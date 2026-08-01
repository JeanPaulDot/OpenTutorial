# Contributing to OpenTutorial

Thanks for your interest in improving OpenTutorial! This document explains how to
set up the project, run the tests, and build the library.

This repository is **library-only** — it ships the `@opentutorial/core` npm
package. There is no demo site or app in this repo.

## Prerequisites

- Node.js 18+ (CI runs on Node 20)
- npm 10+

## Setup

```bash
git clone https://github.com/JeanPaulDot/OpenTutorial.git
cd OpenTutorial
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run the unit tests (Vitest, jsdom) — 82 at time of writing |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint all source with ESLint |
| `npm run build` | Build the library to `dist/` (ESM + CJS), emit `dist/styles.css` and copy `dist/spec.schema.json` |
| `npm run build:types` | Emit TypeScript declarations to `dist/` |

### Full build

`npm run build` runs the multi-entry ESM/CJS build and **empties `dist/` first**.
The `<script>`-tag global bundle is a second pass behind the `BUILD_TARGET`
environment variable, so a complete build is three commands in this order:

```bash
npm run build && BUILD_TARGET=iife npm run build && npm run build:types
```

On Windows PowerShell, set the variable separately:

```bash
npm run build; $env:BUILD_TARGET='iife'; npm run build; Remove-Item Env:BUILD_TARGET; npm run build:types
```

This is exactly what `.github/workflows/ci.yml` and `release.yml` run. Skipping
the `iife` pass leaves `dist/opentutorial.global.js` missing, which breaks the
`unpkg`/`jsdelivr` entry points.

`dist/` is **committed** so the package can be installed directly from git. CI
fails the build if the committed `dist/` drifts from `src/` (it compares the file
inventory and the `.d.ts` declarations; minified `.js`/`.cjs` bytes vary across
platforms, so those are excluded). **Always rebuild and commit `dist/` alongside
source changes.**

## Project structure

```
src/core/
  __tests__/          ← Vitest suites: engine, schema, persist, safeEval, markdown
  adapters/           ← react.tsx, vanilla.ts, vue.ts, svelte.ts, webcomponent.ts
  analytics/          ← common.ts, vendors.ts, http.ts (batched), funnel.ts
  authoring/          ← recorder.ts, selector.ts (stability scoring), debug.ts
  components/         ← React surfaces: TourChecklist, Banner, Announcement,
                        Survey, ResourceCenter, Hint
  dom/                ← layer, popover, hotspot, focus, target, navigation, waitFor
  i18n/               ← resolveText, interpolate, createKeyResolver,
                        createLocaleResolver, DEFAULT_LABELS
  storage/            ← memory, cookie, indexeddb, remote (REST)
  engine.ts           ← TourEngine — per-tour state machine
  orchestrator.ts     ← TourOrchestrator — one active tour, priority queue,
                        audience rules, frequency capping, chaining
  triggers.ts         ← installTrigger: manual, auto, event, route, element,
                        idle, scroll
  schema.ts           ← validateSpec — 90+ checks, error/warning severity
  safeEval.ts         ← sandbox for showIf / next branches / audience rules
  content.ts          ← rich content blocks (text, image, video, list, code, html)
  markdown.ts         ← inline markdown renderer
  persist.ts          ← seen state + progress; sync cache over async storage
  factory.ts          ← createTour, createTours, defineSpec, defineStep, extendSpec
  styles.ts           ← CSS source of truth (20 --ot-* tokens) → dist/styles.css
  index.ts            ← published entry: core + vanilla, React-free
  react.ts            ← published entry: core + TourProvider/useTour/components
  vue.ts              ← published entry: Vue 3 plugin
  svelte.ts           ← published entry: Svelte store + tourAnchor action
  webcomponent.ts     ← published entry: <open-tutorial> custom element
  global.ts           ← IIFE entry for the <script>-tag bundle
schema/
  spec.schema.json    ← published JSON Schema, copied into dist/ at build time
dist/                 ← built output (ESM + CJS + IIFE + CSS + .d.ts) — committed
images/               ← README assets
```

Library code lives entirely under `src/core`. The core must stay
framework-agnostic and dependency-free — React, Vue and Svelte are optional peers
consumed only by their adapters.

## Architecture

```
                    TutorialSpec (validated JSON)
                              │
   TourProvider (React)       │
   createTourPlugin (Vue)     │
   createTourStore (Svelte)   ├──▶ TourOrchestrator ──▶ TourEngine ──▶ TourLayer (DOM)
   <open-tutorial> (WC)       │    one active tour       state machine     │
   createTutorialLayer (JS)   │    queue / audience                        │
                              │    frequency / chaining     TourPopover / TourHotspot
                         installTrigger
                    (route, element, idle, scroll, …)
```

Every adapter is a thin wrapper over `TourOrchestrator`/`TourEngine`. No
framework concept leaks into the engine.

## Guidelines

- Keep the library dependency-free. `dependencies` must stay `{}`; runtime deps
  go in `peerDependencies` (optional) only.
- Keep the root entry (`src/core/index.ts`) React-free. Framework imports belong
  in their own entry point.
- All new features need tests.
- Never introduce `eval` or `new Function`. `showIf`, `next` branches and
  `audience` rules are evaluated by a hand-written tokenizer + parser so the
  library works under a strict Content-Security-Policy.
- Fail closed: an invalid spec disables its own tour and must never crash the
  host app.
- Styles live in `src/core/styles.ts` (the single source for both
  `dist/styles.css` and the shadow-DOM injection path) — do not edit
  `dist/styles.css` by hand.
- Run `npm run lint && npm test` before opening a pull request, and commit a
  rebuilt `dist/` if you touched `src/`.
