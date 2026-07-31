# Opentutorial

Spec-driven in-app guidance engine. Zero runtime dependencies. Adapters for React, Vue 3, Svelte, a universal Web Component, and plain vanilla JS.

```bash
npm install @opentutorial/core
```

## Quick start (React)

```tsx
import { TourProvider, useTour, defineSpec } from '@opentutorial/core/react';
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
    <button data-tour="target" onClick={() => start('quick-start')}>
      Start tour
    </button>
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

## Quick start (Vue 3)

```ts
import { createTourPlugin, TOUR_KEY } from '@opentutorial/core/vue';

app.use(createTourPlugin({ specs, context: { plan: 'pro' } }));

// in a component
const tour = inject(TOUR_KEY)!;
tour.start('welcome');
```

## Quick start (Svelte)

```svelte
<script>
  import { createTourStore, tourAnchor } from '@opentutorial/core/svelte';
  const tour = createTourStore({ specs });
</script>

<button use:tourAnchor={'start-btn'} on:click={() => tour.start('welcome')}>
  Start — step {$tour.state?.index ?? 0}
</button>
```

## Quick start (Web Component / plain HTML)

Works in Angular, Solid, Lit, Astro, Rails, Django, or a static page — no bundler needed:

```html
<script src="https://unpkg.com/@opentutorial/core/dist/opentutorial.global.js"></script>

<open-tutorial auto-start="welcome">
  <script type="application/json">
    { "specVersion": 1, "id": "welcome", "title": "Hi", "steps": [ /* ... */ ] }
  </script>
</open-tutorial>
```

## Entry points

| Import | What you get |
|---|---|
| `@opentutorial/core` | Framework-agnostic core + vanilla adapter. **React-free.** |
| `@opentutorial/core/react` | Everything + `TourProvider`, `useTour`, all components |
| `@opentutorial/core/vue` | Everything + Vue plugin / composable |
| `@opentutorial/core/svelte` | Everything + Svelte store + `tourAnchor` action |
| `@opentutorial/core/webcomponent` | `<open-tutorial>` custom element |
| `@opentutorial/core/analytics` | All analytics adapters + funnel reports |
| `@opentutorial/core/authoring` | Tour recorder, debug overlay, selector scoring |
| `@opentutorial/core/styles.css` | All styles (20+ `--ot-*` custom properties) |

## Display modes

| Mode | Behavior |
|------|----------|
| `spotlight` (default) | Full backdrop + spotlight cutout + popover with navigation |
| `hotspot` | Pulsing dot + tooltip, no backdrop, non-blocking |
| `beacon` | Minimal pulsing indicator, no popover, low-friction |

## Features

- **Tour orchestration** — one tour at a time, priority queue, audience rules, frequency capping, tour chaining
- **Triggers** — `manual`, `auto`, `event`, `route`, `element`, `idle`, `scroll`
- **Cross-page tours** — `autoResume` rehydrates a tour after full page navigations; `onNavigate` hooks SPA routers
- **Rich content** — text, image, video, list, code and (opt-in) HTML blocks, not just inline markdown
- **Resilient targeting** — fallback selector lists, text matching, shadow-DOM piercing, iframe support, visibility waits
- **Interaction gating** — `interaction: 'free' | 'target-only' | 'blocked'` controls what users can click
- **Advance conditions** — `button`, `target-click`, `event`, `auto`, `input-match`, `form-submit`, `element-appears`, `element-disappears`, `url-match`, plus a `beforeNext` guard
- **Branching** — `next: [{ if: "plan === 'pro'", to: 'pro-step' }]` rule lists
- **Custom rendering** — replace the built-in popover with your own component via `renderStep`
- **Pause / resume** — full `pause()` / `resume()` lifecycle on the engine and every adapter
- **Persistence** — sync or async storage; ships localStorage, cookie, IndexedDB and remote (REST) adapters, with per-user namespacing via `userId`
- **Analytics** — PostHog, Mixpanel, Amplitude, Segment, RudderStack, Heap, GA4, Datadog RUM, a batched HTTP adapter, and `createFunnelReport` for drop-off analysis
- **Guidance surfaces** — `Announcement`, `Banner`, `Survey`/NPS, `ResourceCenter`, `Hint`, and a self-managing `TourChecklist`
- **Authoring** — point-and-click recorder with selector stability scoring, debug overlay, published JSON Schema
- **i18n** — key-based localization with interpolation, RTL support
- **Theming** — 20+ CSS custom properties, dark mode via `prefers-color-scheme` or `data-ot-theme`, reduced-motion support
- **Validation** — fail-closed schema checks with error/warning severity; a bad spec never crashes the host

## Spec authoring

A `TutorialSpec` is a plain JSON object validated against a strict schema. Editors get autocomplete from the published schema (`dist/spec.schema.json`):

```json
{
  "$schema": "./node_modules/@opentutorial/core/dist/spec.schema.json",
  "specVersion": 1,
  "id": "my-tour",
  "title": "My Tour",
  "priority": 10,
  "trigger": { "type": "auto", "delay": 500 },
  "audience": { "showIf": "plan !== 'free'" },
  "frequency": { "max": 3, "cooldown": 604800000 },
  "steps": [
    {
      "id": "step1",
      "target": { "selector": ["[data-tour='target']", "#fallback"] },
      "placement": "bottom",
      "display": "spotlight",
      "interaction": "target-only",
      "title": "Step Title",
      "content": {
        "blocks": [
          { "type": "text", "value": "Step **content** with `markdown`." },
          { "type": "image", "src": "/help.png", "alt": "Where to click" }
        ]
      },
      "advanceOn": "input-match",
      "match": "/.+@.+/",
      "next": [{ "if": "plan === 'pro'", "to": "pro-step" }]
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

### Persistence, identity & resume

```tsx
<TourProvider
  specs={[mySpec]}
  userId={user.id}               // per-user progress namespacing
  storage={createIndexedDBStorage()}
  resume={true}                  // resume across sessions
  autoResume={true}              // resume across page navigations
  progressTtl={86400000}
/>
```

### i18n

```tsx
<TourProvider
  specs={[{ ...spec, title: { key: 'tour.welcome.title', fallback: 'Welcome' } }]}
  locale="fr"
  dir="rtl"
  i18nResolver={(key) => messages[key]}
/>
```

### Analytics

```tsx
import { createPostHogAdapter, createFunnelReport } from '@opentutorial/core/analytics';

<TourProvider specs={[mySpec]} onEvent={createPostHogAdapter(posthog)} />
```

### Authoring tools

```ts
import { startRecorder, showDebugOverlay } from '@opentutorial/core/authoring';

// Point-and-click spec recorder (dev only)
if (import.meta.env.DEV) startRecorder({ tourId: 'my-tour' });

// Live debug overlay: current step, resolved target, context, showIf results
<TourProvider specs={[mySpec]} debug />
```

## API

### `TourProvider`

| Prop | Type | Default |
|------|------|---------|
| `specs` | `TutorialSpec[]` | required |
| `context` | `object` | `{}` |
| `theme` | `ThemeOverrides` | — |
| `zIndex` | `number` | `9999` |
| `storage` | `KeyValueStorage` (sync or async) | `localStorage` |
| `userId` | `string` | — |
| `onEvent` | `(TourEvent) => void` | — |
| `deepLinkParam` | `string \| false` | `'tour'` |
| `locale` | `string` | `'en'` |
| `i18nResolver` | `(key, locale) => string \| undefined` | — |
| `dir` | `'ltr' \| 'rtl' \| 'auto'` | `'auto'` |
| `resume` | `boolean` | `false` |
| `autoResume` | `boolean` | `false` |
| `progressTtl` | `number` (ms) | `86400000` |
| `interaction` | `'free' \| 'target-only' \| 'blocked'` | `'free'` |
| `container` | `HTMLElement` | `document.body` |
| `isolate` | `boolean` (shadow DOM) | `false` |
| `allowHtml` | `boolean` | `false` |
| `strict` | `boolean` | `false` |
| `onNavigate` | `(path) => void` | hard reload |
| `beforeNext` | `(ctx) => boolean \| Promise<boolean>` | — |
| `renderStep` | `(ctx) => ReactNode` | built-in popover |
| `dev` / `debug` | `boolean` | `false` |

### `useTour()`

Returns: `{ start, request, stop, pause, resume, next, prev, goTo, activeId, state, events, clearEvents, context, setContext, setTheme, setUser, resetTours, resetTour, resetProgress, hasSeen, whyBlocked, getEngine, specs }`

## Architecture

```
TourProvider / createTutorialLayer / <open-tutorial>
        ↓
TourOrchestrator (queue, triggers, frequency, audience)
        ↓
TourEngine (framework-agnostic state machine) → TourLayer (DOM)
        ↕                                          ↕
   TutorialSpec                            TourPopover / TourHotspot
```

## Project structure

```
src/core/               ← The library (published package) — framework-agnostic
  __tests__/            ← Unit tests (Vitest)
  adapters/             ← react, vue, svelte, webcomponent, vanilla
  analytics/            ← vendors, http batching, funnel reports
  authoring/            ← recorder, debug overlay, selector scoring
  components/           ← TourChecklist, Announcement, Banner, Survey, ResourceCenter, Hint
  dom/                  ← layer, popover, hotspot, focus, target resolution, navigation
  i18n/                 ← resolveText, interpolation, key resolvers
  storage/              ← memory, cookie, IndexedDB, remote
  engine.ts             ← TourEngine (state machine)
  orchestrator.ts       ← TourOrchestrator (queue, triggers, eligibility)
  triggers.ts           ← route/element/idle/scroll/event triggers
  schema.ts             ← Spec validator (error/warning severity)
  safeEval.ts           ← showIf expression evaluator (no eval, CSP-safe)
  persist.ts            ← Seen state + progress + active-tour persistence
  content.ts            ← Block content normalization and rendering
  styles.ts             ← All tour styles (--ot-* vars), emitted as dist/styles.css
schema/spec.schema.json ← Published JSON Schema for editor autocomplete
dist/                   ← Built library (ESM + CJS + IIFE + CSS + .d.ts) — committed for git installers
```

## Development

```bash
npm install          # install dev dependencies
npm test             # run unit tests
npm run lint         # lint source with ESLint
npm run build        # build library to dist/ (ESM + CJS + CSS)
BUILD_TARGET=iife npm run build   # build the <script> global bundle
npm run build:types  # emit TypeScript declarations to dist/
```

## Status

`@opentutorial/core` is in **beta (0.x)**. The core API is stable enough for production use,
but breaking changes may land before `1.0` — pin your version (e.g. `"@opentutorial/core": "0.2.x"`)
and watch the changelog.

## License

MIT
