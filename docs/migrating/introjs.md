# Migrating from intro.js

intro.js is imperative: you build an array of steps in JavaScript and call
`start()`. OpenTutorial is declarative: the tour is data, and the engine runs it.

The practical difference is that a spec can be validated, stored in a database,
edited by someone who does not write JavaScript, and linted in CI.

## Side by side

**intro.js**

```js
import introJs from 'intro.js';
import 'intro.js/introjs.css';

introJs().setOptions({
  steps: [
    { element: '#step1', intro: 'This is your dashboard.', position: 'bottom' },
    { element: '#step2', intro: 'Create a project here.' },
  ],
  showProgress: true,
  exitOnOverlayClick: false,
}).start();
```

**OpenTutorial**

```ts
import { createTutorialLayer, defineSpec } from '@opentutorial/core';
import '@opentutorial/core/styles.css';

const spec = defineSpec({
  specVersion: 1,
  id: 'welcome',
  title: 'Welcome',
  trigger: { type: 'manual' },
  steps: [
    { id: 'dashboard', title: 'Dashboard', content: 'This is your dashboard.',
      target: { selector: '#step1' }, placement: 'bottom' },
    { id: 'create', title: 'Projects', content: 'Create a project here.',
      target: { selector: '#step2' } },
  ],
});

const layer = createTutorialLayer({ specs: [spec] });
layer.start('welcome');
```

## Field mapping

| intro.js | OpenTutorial |
|---|---|
| `element` | `target.selector` |
| `intro` | `content` (plus a required `title`) |
| `title` | `title` |
| `position` | `placement` |
| `tooltipClass` | `theme` on the step, or your own CSS |
| `highlightClass` | `theme.spotlightRing` |
| `disableInteraction: true` | `interaction: 'blocked'` |
| `nextLabel` / `prevLabel` / `doneLabel` | `buttons.next` / `buttons.back` / `buttons.done` |
| `showButtons: false` | `buttons: { next: false, back: false }` |
| `showProgress` | Always on (the dots) |
| `showBullets: false` | Hide `.ot-dots` with CSS |
| `exitOnEsc: false` | `skippable: false` on each step |
| `exitOnOverlayClick` | No equivalent — the overlay never dismisses the tour |
| `scrollTo` / `scrollToElement` | `target.scrollIntoView`, `target.scrollBehavior` |
| `data-intro` / `data-step` attributes | Not supported — specs are data, not markup |
| `hintButtonLabel`, hints API | [`createHint`](../guides/surfaces.md#hint) |

## Callbacks

| intro.js | OpenTutorial |
|---|---|
| `onbeforechange` | `beforeNext` (can veto) |
| `onchange` / `onafterchange` | `onEvent` → `step-shown` |
| `oncomplete` | `onEvent` → `completed`, or `onComplete` in the spec |
| `onexit` | `onEvent` → `skipped` / `dismissed` |
| `onbeforeexit` | No equivalent |

```ts
createTutorialLayer({
  specs,
  onEvent: (e) => {
    if (e.type === 'step-shown') console.log('now on', e.stepId);
    if (e.type === 'completed') celebrate();
  },
  beforeNext: async ({ step }) => (step.id === 'form' ? await isFormValid() : true),
});
```

## Things you no longer hand-roll

intro.js leaves these to you; OpenTutorial has them built in:

| Need | OpenTutorial |
|---|---|
| "Only show this once" | `frequency: { max: 1 }` — persisted per user |
| "Only for trial users" | `audience: { showIf: "plan === 'trial'" }` |
| "Start when they reach /billing" | `trigger: { type: 'route', path: '/billing' }` |
| "Continue after the page navigates" | `autoResume: true` |
| "Wait for the chart to load" | `target: { waitFor: true }` |
| "Advance when they click the button" | `advanceOn: 'target-click'` |
| "Branch for pro users" | `next: [{ if: "plan === 'pro'", to: 'pro-step' }]` |
| "Where do people quit?" | `createFunnelReport(events, tourId)` |

## Converting an existing tour

```js
function fromIntroJs(introSteps, { id, title }) {
  return {
    specVersion: 1,
    id,
    title,
    trigger: { type: 'manual' },
    steps: introSteps.map((step, i) => ({
      id: `step-${i + 1}`,
      title: step.title ?? `Step ${i + 1}`,
      content: step.intro ?? '',
      ...(step.element ? { target: { selector: step.element } } : {}),
      ...(step.position && step.position !== 'auto' ? { placement: step.position } : {}),
    })),
  };
}
```

Two things to fix by hand afterwards:

1. **Titles.** intro.js makes them optional; here they are required, because a
   step with no heading is unusable with a screen reader.
2. **Step ids.** `step-1` works but says nothing. Rename them to something
   meaningful — they appear in your funnel reports.

Then validate:

```bash
npx opentutorial validate tours/*.json --strict
```

## Styling

intro.js ships opinionated CSS you override with `!important`. Here everything is
a CSS custom property:

```css
.ot-root {
  --ot-accent: #1a73e8;
  --ot-radius: 4px;
  --ot-popover-width: 320px;
}
```

Or per tour, in the spec itself:

```jsonc
{ "theme": { "accent": "#1a73e8", "radius": 4 } }
```

See [Content & theming](../guides/content-and-theming.md).

## What you lose

Being honest about the gaps:

- **`data-intro` attributes.** You cannot author a tour by annotating markup.
  That is deliberate — specs as data is the whole design — but it is a real
  workflow change if you rely on it.
- **`exitOnOverlayClick`.** Clicking the backdrop never dismisses a tour here.
- **intro.js hints as a first-class API.** [`createHint`](../guides/surfaces.md#hint)
  covers the same ground with a different shape.

## Bundle size

intro.js is roughly 40 kB gzipped with its CSS. The React-free core here is
about 29 kB gzipped plus 5 kB of CSS, with no runtime dependencies — and the
framework adapters are 1–7 kB on top.
