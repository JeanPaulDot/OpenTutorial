# Migrating from driver.js

driver.js is small, focused and pleasant. If all you need is "highlight these
five elements in order", it does that well and you may not need to migrate at
all.

Move when you start writing code *around* it: "only show this once", "only for
trial users", "continue after the page navigates", "where do people quit".

## Side by side

**driver.js**

```js
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

driver({
  showProgress: true,
  steps: [
    { element: '#dashboard', popover: { title: 'Dashboard', description: 'Start here.', side: 'bottom' } },
    { element: '#new', popover: { title: 'Projects', description: 'Create one.' } },
  ],
}).drive();
```

**OpenTutorial**

```ts
import { createTutorialLayer, defineSpec } from '@opentutorial/core';
import '@opentutorial/core/styles.css';

const spec = defineSpec({
  specVersion: 1,
  id: 'welcome',
  title: 'Welcome',
  steps: [
    { id: 'dashboard', title: 'Dashboard', content: 'Start here.',
      target: { selector: '#dashboard' }, placement: 'bottom' },
    { id: 'new', title: 'Projects', content: 'Create one.',
      target: { selector: '#new' } },
  ],
});

createTutorialLayer({ specs: [spec] }).start('welcome');
```

## Field mapping

| driver.js | OpenTutorial |
|---|---|
| `element` | `target.selector` |
| `popover.title` | `title` |
| `popover.description` | `content` |
| `popover.side` | `placement` (`top` / `bottom` / `left` / `right`) |
| `popover.align` | `placement` suffix (`bottom-start`, `top-end`, …) |
| `popover.showButtons` | `buttons: { next: false, back: false }` |
| `popover.nextBtnText` | `buttons.next` |
| `popover.prevBtnText` | `buttons.back` |
| `popover.doneBtnText` | `buttons.done` |
| `popover.popoverClass` | `theme`, or your own CSS |
| `showProgress` | Always on (the dots) |
| `progressText` | Not configurable; hide `.ot-dots` with CSS if unwanted |
| `allowClose: false` | `skippable: false` |
| `overlayColor` | `theme.backdrop` |
| `overlayOpacity` | Part of `theme.backdrop` (use `rgba()`) |
| `stagePadding` | `target.padding` |
| `stageRadius` | `theme.radius` |
| `smoothScroll` | `target.scrollBehavior: 'smooth'` |
| `disableActiveInteraction: true` | `interaction: 'blocked'` |
| `animate: false` | `theme.animationMs: 0` |

### Placement mapping

driver.js splits `side` and `align`; here they are one field:

| driver.js | OpenTutorial |
|---|---|
| `side: 'bottom', align: 'start'` | `placement: 'bottom-start'` |
| `side: 'top', align: 'center'` | `placement: 'top'` |
| `side: 'right', align: 'end'` | `placement: 'right-end'` |
| `side: 'over'` | `placement: 'center'` |

## Hooks

| driver.js | OpenTutorial |
|---|---|
| `onHighlightStarted` | `onEvent` → `step-shown` |
| `onHighlighted` | `onEvent` → `step-shown` |
| `onDeselected` | `onEvent` → `step-hidden` |
| `onNextClick` | `beforeNext` (can veto), or `onEvent` → `step-completed` |
| `onPrevClick` | `onEvent` → `back` |
| `onCloseClick` | `onEvent` → `dismissed` |
| `onDestroyed` | `onEvent` → `completed` / `skipped` |

```ts
createTutorialLayer({
  specs,
  onEvent: (e) => {
    if (e.type === 'step-shown') track('tour_step', { step: e.stepId });
  },
  beforeNext: async ({ step }) => step.id !== 'form' || (await validateForm()),
});
```

## Imperative API

| driver.js | OpenTutorial |
|---|---|
| `driverObj.drive()` | `layer.start(tourId)` |
| `driverObj.drive(2)` | `layer.start(tourId, 'step-id')` |
| `driverObj.moveNext()` | `layer.next()` |
| `driverObj.movePrevious()` | `layer.prev()` |
| `driverObj.destroy()` | `layer.stop()` |
| `driverObj.isActive()` | `layer.getActiveId() !== null` |
| `driverObj.getActiveIndex()` | `layer.getState()?.index` |
| `driverObj.highlight({ element })` | A one-step spec, or [`createHint`](../guides/surfaces.md#hint) |

Note the step-id difference: driver.js addresses steps by **index**, which
breaks the moment you insert a step. Here they have stable ids, so a deep link
or a resume points at the same step forever.

## Converting a tour

```js
function fromDriverJs(steps, { id, title }) {
  const side = (p) => (!p?.side || p.side === 'over' ? 'center' : p.side);
  const placement = (p) =>
    (p?.align && p.align !== 'center' ? `${side(p)}-${p.align}` : side(p));

  return {
    specVersion: 1,
    id,
    title,
    steps: steps.map((step, i) => ({
      id: `step-${i + 1}`,
      title: step.popover?.title ?? `Step ${i + 1}`,
      content: step.popover?.description ?? '',
      ...(step.element ? { target: { selector: step.element } } : {}),
      placement: placement(step.popover),
    })),
  };
}
```

Rename `step-1`, `step-2` … to something meaningful before you ship: those ids
appear in your funnel report, and `step-3` tells you nothing about where users
quit.

## Styling

driver.js uses `.driver-popover` classes you override. Here it is custom
properties:

```css
.ot-root {
  --ot-accent: #4f46e5;
  --ot-radius: 8px;
  --ot-backdrop: rgba(0, 0, 0, 0.7);
  --ot-popover-width: 300px;
}
```

## What you gain

| | driver.js | OpenTutorial |
|---|---|---|
| Serializable specs | partial (functions in hooks) | yes |
| Triggers | manual only | 7 types |
| Audience / frequency | roll your own | built in |
| Cross-page tours | roll your own | `autoResume` |
| Stable step ids | index-based | id-based |
| Branching | — | `next: [{ if, to }]` |
| Advance conditions | — | 9 types |
| i18n | — | keys, interpolation, plurals, RTL |
| Analytics / funnels | — | 10 adapters + `createFunnelReport` |
| Framework adapters | vanilla only | 7 |
| Other surfaces | — | 7 |

## What you lose

- **Size.** driver.js is around 5 kB gzipped; this is around 29 kB for the core.
  If you only need a five-step highlight tour and nothing else, driver.js is the
  better-sized tool and there is no shame in staying.
- **`driverObj.highlight()`** as a one-shot spotlight. Use a single-step spec or
  `createHint`.
- **Index-based addressing.** Deliberate, but it is a change if your code does
  `drive(3)`.
