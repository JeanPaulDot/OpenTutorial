# Analytics

## Wiring an adapter

```ts
import { createTutorialLayer, createPostHogAdapter } from '@opentutorial/core';

const layer = createTutorialLayer({
  specs,
  onEvent: createPostHogAdapter(posthog),
});
```

`onEvent` takes any `(event: TourEvent) => void`, so a plain function works too:

```ts
onEvent: (e) => console.log(e.type, e.tourId, e.stepId);
```

Events handed to adapters are fresh objects — no adapter can corrupt another,
and every adapter is individually try/caught so analytics can never break a tour.

## Built-in adapters

| Adapter | Call |
|---|---|
| PostHog | `createPostHogAdapter(posthog)` |
| Mixpanel | `createMixpanelAdapter(mixpanel)` |
| Amplitude | `createAmplitudeAdapter(amplitude)` |
| Segment | `createSegmentAdapter(analytics)` |
| RudderStack | `createRudderStackAdapter(rudderanalytics)` |
| Heap | `createHeapAdapter()` — falls back to `window.heap` |
| GA4 | `createGA4Adapter('G-XXXX')` — uses `window.gtag` |
| Datadog RUM | `createDatadogAdapter()` — falls back to `window.DD_RUM` |
| Console | `createDebugAdapter()` |
| HTTP | `createHttpAdapter({ endpoint })` |

Several at once:

```ts
import { createMultiAdapter } from '@opentutorial/core';

onEvent: createMultiAdapter(
  createPostHogAdapter(posthog),
  createHttpAdapter({ endpoint: '/api/tour-events' }),
);
```

## Events

| Event | Fires when |
|---|---|
| `started` | A tour begins. |
| `resumed` | A tour picks up from stored progress. |
| `step-shown` | A step is displayed. |
| `step-hidden` | A step is torn down. |
| `step-completed` | The user moved forward from a step. |
| `back` | The user went back. |
| `paused` / `unpaused` | |
| `skipped` | Ended early. |
| `dismissed` | Closed via the × or Escape. |
| `completed` | Finished. |
| `target-not-found` | A step's target never resolved. |
| `error` | A spec failed validation, or an internal failure. |

Each carries `tourId`, `timestamp`, and where relevant `stepId`, `index`,
`total`, `duration` (ms on that step), `reason`, `selector`, `message` and
`meta`.

`step-shown` vs `step-completed` is the distinction that makes funnels work:
the first counts views, the second counts people who moved on.

## Funnels

The question every tour author actually has is "where do people quit?"

```ts
import { createEventCollector, createFunnelReport } from '@opentutorial/core';

const collector = createEventCollector();
const layer = createTutorialLayer({ specs, onEvent: collector.adapter });

// …later
const report = collector.report('onboarding');
```

Or against events you already store:

```ts
const events = await api.get('/tour-events?tour=onboarding');
const report = createFunnelReport(events, 'onboarding', spec);
```

```ts
{
  tourId: 'onboarding',
  starts: 1240,
  completions: 806,
  skips: 434,
  completionRate: 0.65,
  medianDurationMs: 47000,
  steps: [
    { stepId: 'intro',   index: 0, views: 1240, completions: 1180, dropOffs: 60,  dropOffRate: 0.048, medianDurationMs: 4200 },
    { stepId: 'connect', index: 1, views: 1180, completions: 830,  dropOffs: 350, dropOffRate: 0.297, medianDurationMs: 21000 },
    { stepId: 'invite',  index: 2, views: 830,  completions: 806,  dropOffs: 24,  dropOffRate: 0.029, medianDurationMs: 8100 },
  ],
  worstStep: { stepId: 'connect', /* … */ },
  targetsNotFound: [{ stepId: 'invite', selector: '#invite-btn', count: 12 }],
}
```

`worstStep` is the step losing the most users — usually the one to rewrite.
`targetsNotFound` is your broken-selector alarm: a non-zero count means a
selector stopped matching in production.

## Sending events to your own backend

```ts
import { createHttpAdapter } from '@opentutorial/core';

onEvent: createHttpAdapter({
  endpoint: 'https://api.example.com/tour-events',
  headers: () => ({ authorization: `Bearer ${getToken()}` }),
  batchSize: 20,
  flushMs: 5000,
  storage: localStorage,      // survive a refresh or an outage
  maxQueue: 500,
});
```

POSTs `{ events: [...] }`. Failed batches go back to the front of the queue and
retry on the next flush, on `online`, and on `pagehide` — where `sendBeacon` is
used, because a normal fetch is cancelled during unload.

| Option | Default |
|---|---|
| `batchSize` | `20` |
| `flushMs` | `5000` |
| `maxQueue` | `500` |
| `storageKey` | `'ot:analytics:queue'` |
| `transform` | `toProperties` |
| `fetchImpl` | global `fetch` |
| `onError` | — |

## Reducing volume

### Sample whole tour runs

Sampling per *event* destroys a funnel: drop 90% at random and step 3 loses a
different 90% than step 4, so the drop-off curve becomes noise.

`withSampling` samples the **tour run** instead. One decision per key, and every
event sharing that key follows it — surviving funnels are complete and simply
scaled down.

```ts
import { withSampling, createPostHogAdapter } from '@opentutorial/core';

onEvent: withSampling(createPostHogAdapter(posthog), {
  rate: 0.1,                              // keep 10% of runs
  always: ['error', 'target-not-found'],  // never sample away diagnostics
});
```

The decision is a hash, not `Math.random()`, so it is stable across reloads,
tabs and devices. Sample by user for a consistent cohort:

```ts
withSampling(adapter, {
  rate: 0.05,
  key: (e) => String(e.meta?.userId ?? e.tourId),
});
```

| Option | Default | Notes |
|---|---|---|
| `rate` | — | **Required.** 0–1. |
| `key` | tour id | What to sample by. |
| `always` | `[]` | Event types that bypass sampling. |
| `salt` | `''` | So two adapters at the same rate pick different cohorts. |

### Narrow the event types

```ts
import { withEventTypes } from '@opentutorial/core';

onEvent: withEventTypes(adapter, ['started', 'completed', 'skipped']);
```

Terminal events alone are often enough for a dashboard, at a fraction of the
volume. Combine both:

```ts
withSampling(withEventTypes(adapter, ['started', 'completed']), { rate: 0.25 })
```

## Writing your own adapter

```ts
import { toProperties, eventName } from '@opentutorial/core';
import type { AnalyticsAdapter } from '@opentutorial/core';

export function createMyAdapter(client: MyClient): AnalyticsAdapter {
  return (event) => {
    client.track(eventName(event, 'Tour'), toProperties(event));
  };
}
```

`toProperties` flattens an event into snake_case analytics properties
(`tour_id`, `step_id`, `step_index`, `duration_ms`, `reason`, …) and always
returns a fresh object. Pass `{ includeTimestamp: false }` for vendors that add
their own.

Wrap the body in `safely()` — or rely on `createMultiAdapter`, which isolates
failures for you.

## What to measure

A few questions worth answering:

| Question | How |
|---|---|
| Is onboarding working? | `completionRate` over time. |
| Which step loses people? | `worstStep`. |
| Is a step confusing? | High `medianDurationMs` relative to its length. |
| Did we break a selector? | `targetsNotFound` count > 0. |
| Do dismissals cluster? | `reason` on `skipped` / `dismissed`. |
| Is the tour reaching anyone? | `started` vs eligible users — check `whyBlocked`. |
