# A/B testing tours

The library assigns variants. It does not collect results or compute
significance — you already have an analytics pipeline, and a tour library
guessing at statistics would be worse than the one you have.

## Assigning a variant

```ts
import { assignVariant, createTutorialLayer } from '@opentutorial/core';

const variant = assignVariant('onboarding-length', user.id, ['short', 'long']);

const layer = createTutorialLayer({
  specs,
  context: { variant },
  userId: user.id,
});
```

Then gate the tours on it:

```jsonc
{ "id": "onboarding-short", "audience": { "showIf": "variant === 'short'" } }
{ "id": "onboarding-long",  "audience": { "showIf": "variant === 'long'" } }
```

## Why it needs no storage

Assignment is a stable hash of `${experiment}:${unit}`, so:

- the same user gets the same variant on every device, with nothing persisted
- two experiments never correlate, because the experiment id salts the hash
- it works before persistence has hydrated, and offline
- it is deterministic in tests

There is no assignment table to keep, no race between tabs, and no cold-start
problem on a user's second device.

## Weighted variants

```ts
assignVariant('cta-copy', user.id, [
  { name: 'control', weight: 9 },
  { name: 'bold', weight: 1 },
]);
```

Weights are relative, so `9` and `1` is a 90/10 split. Use it to ramp a change:
start at `{ control: 19, treatment: 1 }`, watch, then even it out.

A variant with `weight: 0` is excluded — the cleanest way to switch one off
without disturbing anyone else's assignment.

## Holdouts

An A/B split between two tours answers "which tour is better?". It cannot
answer "does a tour help at all?" — for that you need a group that sees nothing.

```ts
const variant = assignVariant('onboarding', user.id, ['short', 'long'], {
  holdout: 0.1,   // 10% see no tour
});

// `null` for the holdout group
if (variant) layer.request(`onboarding-${variant}`);
```

The holdout decision uses a different hash from the variant decision, so the two
are independent rather than both keyed off the same value.

## Several experiments at once

```ts
import { assignAll } from '@opentutorial/core';

const context = assignAll(user.id, {
  'onboarding-length': ['short', 'long'],
  'cta-copy': { variants: ['control', 'bold'], holdout: 0.05 },
});

createTutorialLayer({ specs, context: { ...context, plan: user.plan } });
```

```jsonc
{ "audience": { "showIf": "onboarding-length === 'short'" } }
```

Note that a hyphenated key is not a valid identifier in the expression grammar.
Name experiments in a way expressions can read:

```ts
const context = assignAll(user.id, {
  onboardingLength: ['short', 'long'],
  ctaCopy: ['control', 'bold'],
});
```

## Reporting

Put the variant on every event so your warehouse can split by it:

```ts
createTutorialLayer({
  specs,
  context: { variant },
  onEvent: (event) => analytics.track(event.type, {
    ...event,
    variant,
  }),
});
```

Then compare completion rates per variant with `createFunnelReport`, filtering
the event stream yourself:

```ts
import { createFunnelReport } from '@opentutorial/core';

const short = createFunnelReport(events.filter((e) => e.meta?.variant === 'short'), 'onboarding-short');
const long = createFunnelReport(events.filter((e) => e.meta?.variant === 'long'), 'onboarding-long');

console.log(short.completionRate, long.completionRate);
```

## Choosing the unit

The second argument is what you are splitting on:

| Unit | Use when |
|---|---|
| `user.id` | The usual choice. Consistent across devices and sessions. |
| `account.id` | Everyone in a workspace should see the same thing. |
| A session id | Logged-out traffic, where there is no stable identity. |

Whatever you choose, keep it stable. Assigning on a value that changes — a
session id for a logged-in user, say — reshuffles people mid-experiment and
makes the result meaningless.

## What this is not

- **No feature-flag service.** If you already run LaunchDarkly, Statsig or
  similar, assign there and pass the result into `context`. This exists so you
  do not *have* to.
- **No significance testing.** Compute that where your event data lives.
- **No mutual exclusion.** Two experiments can both touch the same user. If you
  need them exclusive, assign a single "experiment slot" first and branch on it.

## Testing

Assignment is deterministic, so tests need no mocking:

```ts
import { assignVariant } from '@opentutorial/core';

expect(assignVariant('exp', 'user-1', ['a', 'b']))
  .toBe(assignVariant('exp', 'user-1', ['a', 'b']));
```

To exercise both branches, find a unit that lands in each:

```ts
const short = ['u1', 'u2', 'u3'].find((u) => assignVariant('exp', u, ['short', 'long']) === 'short');
```
