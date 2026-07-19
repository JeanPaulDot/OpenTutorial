# Opentutorial

Spec-driven in-app tour engine. Zero runtime dependencies. React 19 + vanilla JS adapters.

```bash
npm install git+https://github.com/JeanPaulDot/OpenTutorial.git
```

## Quick start (React)

```tsx
import { TourProvider, useTour, defineSpec } from '@opentutorial/core';
import '@opentutorial/core/styles.css';

const mySpec = defineSpec({
  specVersion: 1,
  id: 'quick-start',
  title: 'Quick Start',
  trigger: { type: 'manual' },
  steps: [
    {
      id: 'hello',
      target: { selector: "[data-tour='target']" },
      placement: 'bottom',
      title: 'Hello!',
      content: 'This is your **first tour step**.',
    },
  ],
});

export default function App() {
  return (
    <TourProvider specs={[mySpec]} context={{ plan: 'free' }}>
      <YourApp />
    </TourProvider>
  );
}

function YourApp() {
  const { start } = useTour();
  return (
    <div>
      <button data-tour="target" onClick={() => start('quick-start')}>
        Start tour
      </button>
    </div>
  );
}
```

## Quick start (Vanilla JS)

```ts
import { createTutorialLayer, defineSpec } from '@opentutorial/core';
import '@opentutorial/core/styles.css';

const tl = createTutorialLayer({
  specs: [defineSpec({ /* ... */ })],
  context: { plan: 'free' },
});
tl.start('my-tour');
```

## Display modes

| Mode | Behavior |
|------|----------|
| `spotlight` (default) | Full backdrop + spotlight cutout + popover with navigation |
| `hotspot` | Pulsing dot + tooltip, no backdrop, non-blocking |
| `beacon` | Minimal pulsing indicator, no popover, low-friction |

## Features

- **Spotlight mode** — full backdrop with animated cutout, flip-away positioning
- **Hotspot mode** — non-intrusive pulsing dot + tooltip, scroll-aware
- **Beacon mode** — minimal new-feature indicator
- **TourChecklist** — onboarding progress component with status + progress bar
- **i18n** — key-based localization, bring your own resolver
- **Progress resume** — users pick up where they left off across sessions
- **Analytics** — PostHog, Mixpanel, Amplitude, GA4 adapters
- **Deep links** — `?tour=<id>` starts a tour from URL
- **showIf** — conditional step visibility with safe boolean expressions
- **Theming** — 20+ CSS custom properties, live-swappable per spec or step
- **Validation** — 24+ schema checks, broken specs never crash the host

## Spec authoring

A `TutorialSpec` is a plain JSON object validated against a strict schema:

```json
{
  "specVersion": 1,
  "id": "my-tour",
  "title": "My Tour",
  "trigger": { "type": "auto", "once": true, "delay": 500 },
  "steps": [
    {
      "id": "step1",
      "target": { "selector": "[data-tour='target']" },
      "placement": "bottom",
      "display": "spotlight",
      "title": "Step Title",
      "content": "Step **content** with `markdown`.",
      "advanceOn": "button"
    }
  ]
}
```

### Step conditions

```json
{ "showIf": "plan === 'pro'" }
{ "showIf": "user.plan !== 'free' && features.export" }
{ "showIf": "(a || b) && !c" }
```

### Persistence & resume

```tsx
<TourProvider
  specs={[mySpec]}
  resume={true}
  progressTtl={86400000}
/>
```

### i18n

```tsx
<TourProvider
  specs={[{
    ...spec,
    title: { key: 'tour.welcome.title', fallback: 'Welcome' },
  }]}
  locale="fr"
  i18nResolver={(key) => messages[key]}
/>
```

### Analytics

```tsx
import { createPostHogAdapter } from '@opentutorial/core';

<TourProvider
  specs={[mySpec]}
  onEvent={createPostHogAdapter(posthog)}
/>
```

## API

### `TourProvider`

| Prop | Type | Default |
|------|------|---------|
| `specs` | `TutorialSpec[]` | required |
| `context` | `object` | `{}` |
| `theme` | `ThemeOverrides` | — |
| `zIndex` | `number` | `9999` |
| `storage` | `KeyValueStorage` | `localStorage` |
| `onEvent` | `(TourEvent) => void` | — |
| `deepLinkParam` | `string \| false` | `'tour'` |
| `locale` | `string` | `'en'` |
| `i18nResolver` | `(key, locale) => string \| undefined` | — |
| `resume` | `boolean` | `false` |
| `progressTtl` | `number` (ms) | `86400000` |

### `useTour()`

Returns: `{ start, stop, activeId, state, events, context, setContext, setTheme, resetTours, hasSeen, specs }`

## Architecture

```
TourProvider → TourEngine (framework-agnostic) → TourLayer (DOM)
                   ↕                              ↕
                TutorialSpec               TourPopover / TourHotspot
```

## Project structure

```
src/
  core/                 ← The library (published package) — framework-agnostic
    __tests__/          ← 79 unit tests
    adapters/           ← react.tsx, vanilla.ts
    analytics/          ← posthog, mixpanel, amplitude, ga4
    components/         ← TourChecklist
    dom/                ← layer, popover, hotspot, focus, waitFor
    i18n/               ← resolveText, createKeyResolver
    engine.ts           ← TourEngine (state machine)
    schema.ts           ← Spec validator (24+ checks)
    safeEval.ts         ← showIf expression evaluator
    persist.ts          ← Seen state + progress persistence
    styles.css          ← All tour styles (--ot-* vars)
    index.ts            ← Public API surface
  site/                 ← The marketing site + live demo (not published)
    pages/              ← Home.tsx (premium landing), Demo.tsx (interactive app)
    sections/           ← Demo app sections (Shell, Sidebar, ThemeStudio, …)
    components/         ← Site chrome (nav, footer) + shadcn/ui
    demo/               ← Demo tour specs
dist/                   ← Built library (ESM + CJS + CSS + .d.ts) — committed for git installers
dist-site/              ← Built static site (gitignored)
```

## Development

```bash
npm install      # install site + dev deps
npm run dev      # start the site + demo on :3000
npm test         # run 79 unit tests
npm run build    # build library to dist/
npm run build:site  # build the marketing site to dist-site/
```

## License

MIT
