# Migrating from react-joyride

react-joyride puts the tour in React state: you hold `run` and `stepIndex`
yourself and drive the tour through a callback. OpenTutorial owns that state, so
the wiring you write around joyride mostly disappears.

## Side by side

**react-joyride**

```tsx
import Joyride, { STATUS, type CallBackProps } from 'react-joyride';

function App() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { target: '#dashboard', content: 'This is your dashboard.', placement: 'bottom' },
    { target: '#new', content: 'Create a project here.' },
  ];

  const handleCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false);
      setStepIndex(0);
      localStorage.setItem('tour-done', '1');
    } else if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('tour-done')) setRun(true);
  }, []);

  return (
    <>
      <Joyride steps={steps} run={run} stepIndex={stepIndex} continuous showProgress
               callback={handleCallback} />
      <YourApp />
    </>
  );
}
```

**OpenTutorial**

```tsx
import { TourProvider } from '@opentutorial/core/react';
import '@opentutorial/core/styles.css';

const welcome = {
  specVersion: 1,
  id: 'welcome',
  title: 'Welcome',
  trigger: { type: 'auto' },        // starts once, per user, automatically
  steps: [
    { id: 'dashboard', title: 'Dashboard', content: 'This is your dashboard.',
      target: { selector: '#dashboard' }, placement: 'bottom' },
    { id: 'new', title: 'Projects', content: 'Create a project here.',
      target: { selector: '#new' } },
  ],
};

function App() {
  return (
    <TourProvider specs={[welcome]}>
      <YourApp />
    </TourProvider>
  );
}
```

The `run`/`stepIndex` state, the callback switch and the localStorage bookkeeping
are all gone: `trigger: { type: 'auto' }` with the default `once: true` already
means "start automatically, but only for someone who has not seen it".

## Field mapping

| react-joyride | OpenTutorial |
|---|---|
| `target` | `target.selector` |
| `content` | `content` |
| `title` | `title` (required here) |
| `placement` | `placement` |
| `placement: 'center'` | `placement: 'center'` (omit `target`) |
| `disableBeacon` | Beacons are opt-in: `display: 'beacon'` |
| `spotlightClicks` | `interaction: 'target-only'` |
| `disableOverlayClose` | Default — the overlay never closes the tour |
| `hideCloseButton` | `skippable: false` |
| `hideBackButton` | `buttons: { back: false }` |
| `showSkipButton` | `skippable: true` (default) |
| `locale.next` / `back` / `last` / `skip` | `buttons.next` / `back` / `done` / `skip` |
| `styles.options.primaryColor` | `theme.accent` |
| `styles.options.zIndex` | `theme.z` or the `zIndex` option |
| `styles.options.overlayColor` | `theme.backdrop` |
| `styles.options.width` | `theme.popoverWidth` |
| `spotlightPadding` | `target.padding` |
| `disableScrolling` | `target.scrollIntoView: false` |
| `scrollOffset` | Not configurable |
| `continuous` | Always continuous |
| `showProgress` | Always on (the dots) |
| `tooltipComponent` | `renderStep` |
| `beaconComponent` | `display: 'beacon'` (not replaceable) |
| `floaterProps` | No equivalent — positioning is built in |

## Replacing the callback

Most of a joyride `callback` is bookkeeping the engine now does. What remains is
your side effects:

```tsx
<TourProvider
  specs={specs}
  onEvent={(e) => {
    switch (e.type) {
      case 'started':   analytics.track('tour_started', { tour: e.tourId }); break;
      case 'step-shown': analytics.track('tour_step', { step: e.stepId }); break;
      case 'completed': analytics.track('tour_completed'); break;
      case 'skipped':   analytics.track('tour_skipped', { at: e.stepId, index: e.index }); break;
    }
  }}
>
```

| joyride `status` / `type` | Event |
|---|---|
| `STATUS.RUNNING` | `started` |
| `STATUS.FINISHED` | `completed` |
| `STATUS.SKIPPED` | `skipped` |
| `EVENTS.STEP_BEFORE` | `step-shown` |
| `EVENTS.STEP_AFTER` | `step-completed` |
| `EVENTS.TARGET_NOT_FOUND` | `target-not-found` |
| `ACTIONS.PREV` | `back` |
| `ACTIONS.CLOSE` | `dismissed` |

## Controlling the tour

```tsx
import { useTour } from '@opentutorial/core/react';

function Controls() {
  const { start, stop, next, prev, activeId, state } = useTour();

  return (
    <>
      <button onClick={() => start('welcome')} disabled={activeId !== null}>Start</button>
      <button onClick={next}>Next</button>
      <span>{state ? `${state.index + 1} / ${state.total}` : 'idle'}</span>
    </>
  );
}
```

The equivalent of `stepIndex` is `state.index`, but you read it rather than
setting it. To jump somewhere, use ids:

```tsx
const { getEngine } = useTour();
getEngine('welcome')?.goTo('billing-step');
```

## Custom tooltips

joyride's `tooltipComponent` maps to `renderStep`:

```tsx
<TourProvider
  specs={specs}
  renderStep={({ step, index, total, isLast, next, prev, skip }) => (
    <div className="my-tooltip">
      <h3>{String(step.title)}</h3>
      <div>{index + 1} of {total}</div>
      <button onClick={skip}>Skip</button>
      <button onClick={prev}>Back</button>
      <button onClick={next}>{isLast ? 'Finish' : 'Next'}</button>
    </div>
  )}
>
```

Positioning, the backdrop and interaction gating are still handled for you.

## Waiting for elements

joyride retries a missing target and eventually fires `TARGET_NOT_FOUND`. Here
you say so explicitly:

```jsonc
{ "target": { "selector": "#chart", "waitFor": true, "timeout": 10000 } }
```

Without `waitFor`, a missing target emits `target-not-found` immediately and the
tour continues.

## Converting steps

```ts
function fromJoyride(steps, { id, title }) {
  return {
    specVersion: 1,
    id,
    title,
    trigger: { type: 'manual' },
    steps: steps.map((step, i) => ({
      id: `step-${i + 1}`,
      title: step.title ?? `Step ${i + 1}`,
      content: typeof step.content === 'string' ? step.content : '',
      ...(step.target && step.target !== 'body'
        ? { target: { selector: step.target } }
        : { placement: 'center' }),
      ...(step.placement && step.placement !== 'auto' ? { placement: step.placement } : {}),
      ...(step.spotlightClicks ? { interaction: 'target-only' } : {}),
    })),
  };
}
```

Port by hand afterwards:

- `content` as JSX → a string, a [block list](../guides/content-and-theming.md#content-blocks), or `renderStep`
- Titles — required here, optional in joyride
- Meaningful step ids in place of `step-1`, `step-2`

## What you gain

| | react-joyride | OpenTutorial |
|---|---|---|
| Tour state | yours to manage | owned by the engine |
| "Show once per user" | roll your own | `frequency` / `trigger.once` |
| Audience rules | roll your own | `audience.showIf` |
| Route/idle/scroll triggers | roll your own | built in |
| Cross-page tours | roll your own | `autoResume` |
| Branching | roll your own | `next: [{ if, to }]` |
| Advance on click/input/URL | roll your own | `advanceOn` |
| Funnels | roll your own | `createFunnelReport` |
| Non-React apps | — | Vue, Svelte, Angular, Solid, Web Component, vanilla |
| Specs as data | JSX in steps | plain JSON |

## What you lose

- **JSX inside step content.** Content is data here. Use blocks for structure,
  or `renderStep` when you truly need components.
- **`beaconComponent`.** Beacons are a display mode, not a replaceable component.
- **`floaterProps`.** Positioning is not extensible.
- **Controlled `stepIndex`.** You drive the tour through its API rather than by
  setting state.

## Bundle size

react-joyride is roughly 45 kB gzipped including react-floater. The React entry
here is about 7 kB on top of a 29 kB core, with no runtime dependencies.
