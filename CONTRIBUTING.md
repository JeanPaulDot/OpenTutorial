# Contributing to OpenTutorials

Thanks for your interest in improving OpenTutorials! This document explains how
to set up the project, run tests, and build the demo.

## Prerequisites

- Node.js 20+
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
| `npm run dev` | Start the demo app on `http://localhost:3000` |
| `npm test` | Run the 79 unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint all source with ESLint |
| `npm run build` | Build the library to `dist/` (ESM + CJS) |
| `npm run build:types` | Emit TypeScript declarations to `dist/` |
| `npm run build:site` | Build the static demo site to `dist-site/` |
| `npm run preview` | Preview the built demo site |

## Project structure

```
src/
  core/               ← The library (published package) — framework-agnostic
    __tests__/        ← 79 tests
    adapters/         ← react.tsx, vanilla.ts
    analytics/        ← posthog, mixpanel, amplitude, ga4
    components/       ← TourChecklist
    dom/              ← layer, popover, hotspot, focus, waitFor
    i18n/             ← resolveText, createKeyResolver
    engine.ts         ← TourEngine (state machine)
    schema.ts         ← Spec validator (24+ checks)
    safeEval.ts       ← showIf expression evaluator
    persist.ts        ← Seen state + progress persistence
    styles.css        ← All tour styles (--ot-* vars)
    index.ts          ← Public API surface
  site/               ← The marketing site + live demo (not published)
    pages/            ← Home.tsx (landing), Demo.tsx (interactive app)
    sections/         ← Demo app sections (Shell, Sidebar, …)
    components/       ← Site chrome (nav, footer) + shadcn/ui
    demo/             ← Demo tour specs
dist/                 ← Built library (ESM + CJS + CSS + .d.ts) — committed for git installers
dist-site/            ← Built static site (gitignored)
```

The `@` import alias points at `src/site` (site code only). Library code lives in
`src/core` and must not depend on anything under `src/site`.

## Architecture

```
TourProvider → TourEngine (framework-agnostic) → TourLayer (DOM)
                   ↕                              ↕
                TutorialSpec               TourPopover / TourHotspot
```

The engine has **zero runtime dependencies** — React is a peer dependency, and
the vanilla adapter works without it.

## Guidelines

- Keep the library dependency-free. Runtime deps go in `peerDependencies` only.
- All new features need tests.
- `showIf` expressions are evaluated by a sandbox (tokenizer + parser), not `eval`.
- Run `npm run lint && npm test` before opening a pull request.
