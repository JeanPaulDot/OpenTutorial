# TutorialLayer — Project Status

## What it is
A spec-driven, AI-authorable in-app tutorial engine. Drop-in `<TourProvider>` wraps your app,
tours are authored as strict JSON specs, rendered by a dependency-free engine.

## Package
- Published as `@opentutorials/core` (git dependency)
- Single entry: `import { TourProvider } from '@opentutorials/core'`
- CSS: `import '@opentutorials/core/styles.css'`
- Engines: React adapter (default) + vanilla JS adapter

## Features implemented
- Spotlight mode (full backdrop + popover)
- Hotspot mode (pulsing dot + tooltip)
- Beacon mode (minimal indicator)
- TourChecklist onboarding component
- i18n localization support
- Progress persistence + resume across sessions
- Analytics adapters: PostHog, Mixpanel, Amplitude, GA4
- Richer showIf: dot paths (user.plan), &&, ||, !, parens
- Validation with 24+ schema checks
- 79 unit tests (Vitest)

## Structure
```
src/
  tour-layer/          ← Library source (framework-agnostic core)
    __tests__/         ← 79 tests
    adapters/          ← react.tsx, vanilla.ts
    analytics/         ← posthog, mixpanel, amplitude, ga4
    components/        ← TourChecklist
    dom/               ← layer, popover, hotspot, focus, waitFor
    i18n/              ← resolveText, createKeyResolver
    engine.ts          ← TourEngine (state machine)
    schema.ts          ← Spec validator (24+ checks)
    safeEval.ts        ← showIf expression evaluator
    persist.ts         ← Seen state + progress persistence
    styles.css         ← All tour styles (--tl-* vars)
    index.ts           ← Public API surface
  demo/                ← Demo app specs
  sections/            ← Demo app sections
  components/ui/       ← shadcn components (demo only)
dist/                  ← Built library (ESM + CJS + CSS)
```

## Build
```bash
npm run build      # vite build --mode lib → dist/
npm run build:types # tsc --declaration → dist/*.d.ts
npm test           # vitest run (79 tests)
npm run dev        # Demo app on :3000
```

## Git dependency
```bash
npm install git+https://github.com/jeanpaul/html-aau
```
The `prepare` script auto-builds on install. `dist/` is committed for consumers.
