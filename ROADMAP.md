# OpenTutorial — Roadmap

Where `@opentutorial/core` stands today and what remains before 1.0.

Everything below is derived from reading the current source (`src/core/**`), not
from assumptions. File references point at the code behind each claim.

**Current version: 0.2.0.** The 0.1.0 → 0.2.0 cycle closed the packaging,
expressiveness, orchestration, persistence, authoring and analytics gaps that the
original gap analysis identified. What is left is almost entirely **verification**
(tests beyond the core modules), **documentation**, and **tooling** — plus a
handful of feature gaps listed in §3.

---

## 1. Baseline — what ships today

| Area | Status |
|---|---|
| Packaging | Subpath exports (`.`, `/react`, `/vue`, `/svelte`, `/webcomponent`, `/vanilla`, `/analytics`, `/authoring`, `/schema`), ESM + CJS + IIFE, React-free root entry, optional peers, `sideEffects` declared ([package.json](package.json), [vite.config.ts](vite.config.ts)) |
| Adapters | React, Vue 3, Svelte, `<open-tutorial>` Web Component, vanilla JS ([adapters/](src/core/adapters)) |
| State machine | `TourEngine` — start/next/prev/goTo/pause/resume/skip/complete/destroy, history stack ([engine.ts](src/core/engine.ts)) |
| Orchestration | `TourOrchestrator` — one active tour, priority queue, `audience` rules, `frequency` capping, chaining via `onComplete` ([orchestrator.ts](src/core/orchestrator.ts)) |
| Triggers | `manual`, `auto`, `event`, `route`, `element`, `idle`, `scroll` ([triggers.ts](src/core/triggers.ts)) |
| Cross-page | `autoResume` rehydration after full navigations; `onNavigate` for SPA routers ([dom/navigation.ts](src/core/dom/navigation.ts)) |
| Display modes | `spotlight`, `hotspot`, `beacon`, plus `renderStep` custom rendering |
| Content | Rich blocks — text, image, video, list, code, opt-in HTML ([content.ts](src/core/content.ts)) |
| Targeting | Fallback selector lists, text matching, shadow-DOM piercing, iframes, `index`, visibility waits ([dom/target.ts](src/core/dom/target.ts)) |
| Interaction | `free` \| `target-only` \| `blocked` pointer gating |
| Advance conditions | `button`, `target-click`, `event`, `auto`, `input-match`, `form-submit`, `element-appears`, `element-disappears`, `url-match`, `beforeNext` guard |
| Branching | `next: [{ if, to }]` rule lists |
| Expressions | Hand-written sandbox — booleans, comparison, arithmetic, ternary, member/index access, whitelisted pure methods; no `eval` ([safeEval.ts](src/core/safeEval.ts)) |
| Validation | 90+ checks with error/warning severity and a `strict` option ([schema.ts](src/core/schema.ts)) |
| Persistence | Sync-or-async `KeyValueStorage`; localStorage, cookie, IndexedDB, remote REST with write-through cache; per-user namespacing via `userId` ([storage/](src/core/storage), [persist.ts](src/core/persist.ts)) |
| Analytics | PostHog, Mixpanel, Amplitude, Segment, RudderStack, Heap, GA4, Datadog RUM, batched HTTP with offline queue, `createFunnelReport` ([analytics/](src/core/analytics)) |
| Events | 13 types with `duration` and `reason` ([types.ts:235](src/core/types.ts:235)) |
| Surfaces | `Announcement`, `Banner`, `Survey`/NPS, `ResourceCenter`, `Hint`, self-managing `TourChecklist` ([components/](src/core/components)) |
| Authoring | Point-and-click recorder with selector stability scoring, debug overlay, published `spec.schema.json` ([authoring/](src/core/authoring), [schema/spec.schema.json](schema/spec.schema.json)) |
| i18n | Key + locale resolvers, interpolation, RTL, default label set ([i18n/](src/core/i18n)) |
| Theming | 20 `--ot-*` tokens, 3-level cascade (global → spec → step), dark mode via `prefers-color-scheme` / `data-ot-theme`, reduced-motion, shadow-DOM `isolate`, `container` portal ([styles.ts](src/core/styles.ts), [dom/layer.ts](src/core/dom/layer.ts)) |
| Mobile | Bottom-sheet layout under 480px, 44px touch targets |
| Tests | 82 unit tests over engine, schema, persist, safeEval, markdown |
| CI/Release | Lint + test + build + `dist/` drift check; tag-triggered npm publish with provenance ([.github/workflows](.github/workflows)) |

---

## 2. Guardrails to preserve

Four properties are load-bearing and every change must keep them:

1. **Zero runtime dependencies** — `dependencies` stays `{}`.
2. **Fail closed, never crash the host** — a bad spec disables its own tour and
   nothing else ([engine.ts](src/core/engine.ts)); actions and listeners are
   individually try/caught.
3. **No `eval`, no `new Function`** — expressions stay a hand-written parser, so
   the library remains usable under a strict CSP.
4. **Framework-agnostic core** — adapters wrap `TourOrchestrator`/`TourEngine`;
   no framework concept leaks inward. The root entry never imports React.

---

## 3. Remaining gaps

### 3.1 Verification — **highest priority**

The 82 tests cover `engine`, `schema`, `persist`, `safeEval` and `markdown`. The
code added in 0.2.0 is almost entirely untested:

| # | Gap |
|---|---|
| T-1 | No tests for `orchestrator.ts` — the queue, `audience`, `frequency` capping and chaining are the most stateful logic in the package. |
| T-2 | No tests for `triggers.ts` (route/element/idle/scroll) or `dom/navigation.ts`. |
| T-3 | No tests for any adapter — React, Vue, Svelte, Web Component or vanilla. |
| T-4 | No tests for `dom/` — popover geometry and flipping, `target.ts` resolution order (fallback list, text match, shadow, iframe), focus trap, `waitFor`, layer/shadow isolation, hotspot. |
| T-5 | No tests for `storage/` (cookie, IndexedDB, remote + offline behaviour), `content.ts`, `i18n/`, `analytics/` (especially the batched HTTP queue) or `authoring/`. |
| T-6 | No coverage threshold in CI. |
| T-7 | No E2E. Multi-page resume, interaction gating and the trigger types can only be verified in a real browser (Playwright). |
| T-8 | No automated a11y gate (`@axe-core/playwright`) and no visual regression across placements/display modes. |
| T-9 | No bundle-size budget, so a regression in the "zero deps, small core" promise would ship silently. |

### 3.2 Documentation

| # | Gap |
|---|---|
| X-1 | No docs site and no generated API reference. The README is currently the entire documentation surface. |
| X-2 | No `examples/` directory and no playground — nothing runnable in the repo since the demo site moved out. |
| X-3 | No SSR guides for Next.js App Router, Nuxt or SvelteKit, despite `'use client'` being in place. |
| X-4 | No migration guides from **intro.js, Shepherd, driver.js and react-joyride** — cheap, high-intent acquisition. |
| X-5 | No browser-support matrix, no a11y statement, no CSP recipe (the library is CSP-safe by design but writes inline `style` attributes, which `style-src-attr` blocks — this needs documenting). |
| X-6 | The REST contract behind `createRemoteStorage()` is documented only in source comments. |

### 3.3 Tooling

| # | Gap |
|---|---|
| C-1 | No CLI. `opentutorial validate specs/**/*.json` for CI-time spec linting is the obvious first command; `lint-selectors <url>` (Playwright-driven dead-selector detection) and `preview` follow. `package.json` has no `bin` entry yet. |
| C-2 | `spec.schema.json` is published in `dist/` but not submitted to [SchemaStore](https://www.schemastore.org/), so `$schema` autocomplete needs a manual URL. |
| C-3 | `npm run prepare` runs `build && build:types` but **not** the `BUILD_TARGET=iife` pass, and the default build empties `dist/` — so a publish that relies on `prepare` alone ships without `dist/opentutorial.global.js`, which `unpkg`, `jsdelivr` and the `./opentutorial.global.js` export all point at. The release workflow runs the full sequence, so releases are correct today; `prepare` should match it. |
| C-4 | No changesets or equivalent — the CHANGELOG is maintained by hand and the version bump is manual. |

### 3.4 Feature gaps

| # | Gap |
|---|---|
| G-1 | **Guidance surfaces are React-only.** `Announcement`, `Banner`, `Survey`, `ResourceCenter`, `Hint` and `TourChecklist` are `.tsx` and exported only from `/react`. Vue, Svelte, Web Component and vanilla consumers get tours but none of the other surfaces — the clearest asymmetry in the package. |
| G-2 | No changelog / what's-new widget (the one surface from the original plan that never shipped). |
| G-3 | No `exportProgress()` / `importProgress()` for migrating or seeding progress. |
| G-4 | i18n has interpolation but no pluralization. |
| G-5 | No swipe gestures on mobile; the bottom-sheet layout and touch targets landed, the gestures did not. |
| G-6 | No dedicated Angular or Solid adapters. The Web Component covers both, but a thin idiomatic wrapper (an Angular service, a Solid primitive) would remove friction. |
| G-7 | Analytics has batching and an offline queue but no sampling. |

---

## 4. Sequencing to 1.0

| Milestone | Contents | Rationale |
|---|---|---|
| **0.3.0** | §3.1 T-1…T-6 — tests for orchestrator, triggers, adapters, dom, storage, analytics, authoring; coverage threshold in CI. Fix C-3. | 0.2.0 tripled the surface area without tripling the tests. Nothing else should ship until that is closed. |
| **0.4.0** | §3.2 X-1…X-3, X-6 — docs site, API reference, `examples/`, SSR guides, documented REST contract. | The feature set is far ahead of what anyone can discover from a README. |
| **0.5.0** | §3.3 C-1, C-2 — CLI (`validate`, `lint-selectors`) and SchemaStore submission. | Makes specs verifiable in the host project's CI, not just at runtime. |
| **0.6.0** | §3.4 G-1 — framework-neutral guidance surfaces, so Vue/Svelte/WC/vanilla reach parity with React. Plus G-2, G-3. | Removes the one place where "framework-agnostic" is not yet true. |
| **0.7.0** | §3.1 T-7…T-9 — Playwright E2E, axe a11y gate, visual regression, bundle-size budget. Plus G-4, G-5, G-7. | Browser-level guarantees before freezing the API. |
| **0.8.0** | §3.2 X-4, X-5 — migration guides, browser matrix, a11y statement, CSP recipe. G-6 if demand warrants. | Adoption work, once the product is stable enough to migrate *to*. |
| **1.0.0** | API frozen, docs site live, coverage and E2E gates green, changesets-driven releases (C-4). | — |
