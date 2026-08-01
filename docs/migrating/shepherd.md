# Migrating from Shepherd

Shepherd is the closest library in spirit — a real state machine, good a11y,
Popper-based positioning. The main differences are that its steps are JavaScript
objects containing functions (so they cannot be serialized), and it depends on
Floating UI at runtime.

## Side by side

**Shepherd**

```js
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: { classes: 'shadow-md', scrollTo: true },
});

tour.addStep({
  id: 'intro',
  text: 'This is your dashboard.',
  attachTo: { element: '#dashboard', on: 'bottom' },
  buttons: [
    { text: 'Back', action: tour.back },
    { text: 'Next', action: tour.next },
  ],
});

tour.start();
```

**OpenTutorial**

```ts
import { createTutorialLayer, defineSpec } from '@opentutorial/core';
import '@opentutorial/core/styles.css';

const spec = defineSpec({
  specVersion: 1,
  id: 'welcome',
  title: 'Welcome',
  interaction: 'blocked',            // = useModalOverlay
  steps: [
    {
      id: 'intro',
      title: 'Dashboard',
      content: 'This is your dashboard.',
      target: { selector: '#dashboard', scrollIntoView: true },
      placement: 'bottom',
    },
  ],
});

const layer = createTutorialLayer({ specs: [spec] });
layer.start('welcome');
```

Buttons are implicit. Back, Next and Done are rendered based on position in the
tour; you override the labels rather than declaring the buttons.

## Field mapping

| Shepherd | OpenTutorial |
|---|---|
| `attachTo.element` | `target.selector` |
| `attachTo.on` | `placement` |
| `text` | `content` |
| `title` | `title` (required here) |
| `classes` | `theme`, or your own CSS |
| `scrollTo` | `target.scrollIntoView` |
| `canClickTarget: false` | `interaction: 'blocked'` |
| `useModalOverlay` | `interaction: 'blocked'` (spec level) |
| `modalOverlayOpeningPadding` | `target.padding` |
| `modalOverlayOpeningRadius` | `theme.radius` |
| `cancelIcon: { enabled }` | `skippable` |
| `buttons[]` | `buttons: { next, back, skip, done }` |
| `advanceOn: { selector, event }` | `advanceOn: 'target-click'` or `'event'` + `event` |
| `beforeShowPromise` | `target: { waitFor: true }` |
| `showOn: () => bool` | `showIf: "expression"` |
| `tour.addStep(...)` | An entry in `steps` |

## The `showOn` difference

Shepherd's `showOn` is a JavaScript function. Here it is an expression string
evaluated against a context object:

```js
// Shepherd
showOn: () => user.plan === 'pro' && user.seats > 5
```

```jsonc
// OpenTutorial
{ "showIf": "plan === 'pro' && seats > 5" }
```

```ts
createTutorialLayer({ specs, context: { plan: user.plan, seats: user.seats } });
```

This is the trade that makes specs serializable — and it means the expression
runs under a strict CSP, because there is no `eval` involved. The
[grammar](../spec-reference.md#expressions) covers comparison, logic,
arithmetic, member access and a handful of pure string/array methods.

For logic the grammar cannot express, compute it in your app and put the result
in the context:

```ts
layer.setContext({ eligibleForUpsell: computeEligibility(user) });
```

```jsonc
{ "showIf": "eligibleForUpsell" }
```

## Events

| Shepherd | OpenTutorial |
|---|---|
| `tour.on('start')` | `onEvent` → `started` |
| `tour.on('complete')` | `onEvent` → `completed` |
| `tour.on('cancel')` | `onEvent` → `skipped` / `dismissed` |
| `tour.on('show')` | `onEvent` → `step-shown` |
| `step.on('before-show')` | `onEnter` actions, or `beforeNext` |
| `step.on('destroy')` | `onEvent` → `step-hidden` |

```ts
createTutorialLayer({
  specs,
  onEvent: (e) => {
    switch (e.type) {
      case 'completed': markOnboardingDone(); break;
      case 'skipped': logDropOff(e.stepId); break;
    }
  },
});
```

## Buttons

```jsonc
{
  "buttons": {
    "next": "Continue",
    "back": false,
    "skip": "No thanks",
    "done": "Finish"
  }
}
```

`false` hides a button. For a custom action per button, Shepherd's arbitrary
`action` has no direct equivalent — use `onExit` actions or `beforeNext`:

```jsonc
{
  "onExit": [{ "type": "emit", "name": "analytics:step-done" }]
}
```

## Converting a tour

Shepherd steps contain functions, so a converter can only handle the data parts:

```js
function fromShepherd(steps, { id, title }) {
  return {
    specVersion: 1,
    id,
    title,
    steps: steps.map((step, i) => ({
      id: step.id ?? `step-${i + 1}`,
      title: step.title ?? `Step ${i + 1}`,
      content: typeof step.text === 'string' ? step.text : '',
      ...(step.attachTo?.element
        ? { target: { selector: step.attachTo.element, scrollIntoView: step.scrollTo !== false } }
        : {}),
      ...(step.attachTo?.on ? { placement: step.attachTo.on } : {}),
      ...(step.canClickTarget === false ? { interaction: 'blocked' } : {}),
    })),
  };
}
```

Then port by hand:

- `text` returning a function or DOM node → a `content` string or block list
- `showOn` → a `showIf` expression plus context
- `buttons[].action` → `onExit` actions or `beforeNext`
- `beforeShowPromise` → `target.waitFor`

## What you gain

| | Shepherd | OpenTutorial |
|---|---|---|
| Runtime dependencies | Floating UI | none |
| Specs serializable | no (functions) | yes (JSON) |
| Triggers | manual only | manual, auto, event, route, element, idle, scroll |
| Audience / frequency rules | roll your own | built in |
| Cross-page resume | roll your own | `autoResume` |
| Funnel analysis | roll your own | `createFunnelReport` |
| Framework adapters | React, Vue, Angular wrappers | React, Vue, Svelte, Angular, Solid, Web Component, vanilla |
| CLI validation | — | `opentutorial validate` |
| Other surfaces | — | banner, announcement, survey, checklist, hub, hints, changelog |

## What you lose

- **Arbitrary functions in step definitions.** That is the point of the trade,
  but it is a genuine constraint.
- **Floating UI's middleware.** Positioning here is flip + shift + align, which
  covers the same ground for a tooltip but is not extensible.
- **`Shepherd.activeTour` globals.** Use `layer.getActiveId()`.

## Bundle size

Shepherd is roughly 30 kB gzipped plus Floating UI (~10 kB) plus CSS. The core
here is about 29 kB gzipped plus 5 kB of CSS, with no runtime dependencies.
