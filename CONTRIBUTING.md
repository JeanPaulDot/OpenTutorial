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
| `npm test` | Run the unit tests (Vitest, jsdom) — 529 at time of writing |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage thresholds enforced |
| `npm run e2e` | Run the Playwright E2E and accessibility suites |
| `npm run lint` | Lint all source with ESLint |
| `npm run build` | Full build — ESM + CJS + IIFE + CSS + schema + declarations |
| `npm run size` | Check gzipped bundle sizes against their budgets |

### The build

`npm run build` runs [`scripts/build.mjs`](scripts/build.mjs), which sequences
three passes that must happen in this order:

1. `vite build` — multi-entry ESM + CJS, `dist/styles.css`, `dist/spec.schema.json`
2. `BUILD_TARGET=iife vite build` — `dist/opentutorial.global.js`
3. `tsc --emitDeclarationOnly` — `.d.ts`

The first pass **empties `dist/`**, so running it alone silently drops the global
bundle that `unpkg`, `jsdelivr` and the `./opentutorial.global.js` export all
point at. The script also verifies all 14 published entry points exist when it
finishes. It is cross-platform, so there is no separate Windows incantation.

`dist/` is **committed** so the package can be installed directly from git. CI
fails the build if the committed `dist/` drifts from `src/` (it compares the file
inventory and the `.d.ts` declarations; minified `.js`/`.cjs` bytes vary across
platforms, so those are excluded). **Always rebuild and commit `dist/` alongside
source changes.**

### E2E tests

```bash
npx playwright install chromium
npm run e2e
```

They serve `e2e/fixtures` against the **built** `dist/`, so they exercise the
published bundle rather than source. Run `npm run build` first.

## Project structure

```
src/core/
  __tests__/          ← 22 Vitest suites covering every module below
  adapters/           ← react.tsx, vanilla.ts, vue.ts, svelte.ts,
                        angular.ts, solid.ts, webcomponent.ts
  analytics/          ← common.ts, vendors.ts, http.ts (batched), funnel.ts,
                        sampling.ts (run-level)
  authoring/          ← recorder.ts, selector.ts (stability scoring), debug.ts
  components/         ← React wrappers: TourChecklist, Banner, Announcement,
                        Survey, ResourceCenter, Hint, Changelog
  surfaces/           ← framework-free factories the React wrappers build on:
                        banner, announcement, survey, hint, checklist,
                        resourceCenter, changelog, shared, controller
  dom/                ← layer, popover, hotspot, focus, target, navigation, waitFor
  i18n/               ← resolveText, interpolate (plurals), resolvers,
                        localeDirection, DEFAULT_LABELS
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
  index.ts            ← published entry: core + vanilla + surfaces, React-free
  react.ts            ← published entry: core + TourProvider/useTour/components
  vue.ts / svelte.ts / angular.ts / solid.ts / webcomponent.ts
                      ← published framework entries
  global.ts           ← IIFE entry for the <script>-tag bundle
bin/
  opentutorial.mjs    ← the CLI (validate, lint-selectors, schema)
scripts/
  build.mjs           ← the three-pass build
  size-budget.mjs     ← gzipped size budgets
e2e/
  fixtures/           ← static pages served against the built dist/
  tour.spec.ts        ← browser behaviour (placement, gating, resume, swipe)
  a11y.spec.ts        ← axe-core gate
  serve.mjs           ← dependency-free static server
docs/                 ← the documentation set
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
- New guidance surfaces go in `src/core/surfaces/` as framework-free factories.
  The React component then wraps the factory — never reimplements it, or the two
  drift.
- Adapters must not import their framework. Structural typing (Vue's
  `app.provide`, Svelte's store contract, Angular's provider shape) keeps
  `dependencies` empty and avoids pinning a major version.
- Run `npm run lint && npm test` before opening a pull request, and commit a
  rebuilt `dist/` if you touched `src/`.
- Add a changeset (`npx changeset`) for anything that changes shipped behaviour.
  See [.changeset/README.md](.changeset/README.md).
