# OpenTutorial — Roadmap

**Current version: 1.0.0. The API is stable.** Everything documented in
[docs/](docs/README.md) is covered by semantic versioning: no breaking change
without a major release.

Everything below is derived from reading the current source (`src/core/**`) and
running the suites, not from assumptions.

---

## 1. What ships today

| Area | Status |
|---|---|
| Packaging | Subpath exports (`.`, `/react`, `/vue`, `/svelte`, `/angular`, `/solid`, `/webcomponent`, `/vanilla`, `/analytics`, `/authoring`, `/schema`), ESM + CJS + IIFE, React-free root entry, optional peers |
| Adapters | React, Vue 3, Svelte, Angular, Solid, `<open-tutorial>` Web Component, vanilla JS |
| State machine | `TourEngine` — start/next/prev/goTo/pause/resume/skip/complete/destroy, history stack |
| Orchestration | `TourOrchestrator` — one active tour, priority queue, `audience` rules, `frequency` capping, chaining |
| Triggers | `manual`, `auto`, `event`, `route`, `element`, `idle`, `scroll`, plus `?tour=` deep links |
| Cross-page | `autoResume` rehydration; `onNavigate` for SPA routers |
| Display modes | `spotlight`, `hotspot`, `beacon`, `modal`, `banner`, plus `renderStep` and `renderIndicator` |
| Content | Full markdown (headings, lists, quotes, fences, rules, images) plus typed content blocks |
| Layout | Auto-sizing width, viewport-capped scrolling height, three density levels, mobile bottom sheet with swipe |
| Targeting | Fallback lists, text matching, shadow DOM, iframes, `index`, `all` (multi-highlight), visibility waits |
| Interaction | `free` \| `target-only` \| `blocked` pointer gating |
| Advance conditions | 9 types plus a `beforeNext` guard |
| Branching | `next: [{ if, to }]` rule lists |
| Expressions | Hand-written sandbox — no `eval`, CSP-safe |
| Validation | 90+ checks with error/warning severity and a `strict` option |
| Persistence | Sync-or-async storage; localStorage, cookie, IndexedDB, remote REST; per-user namespacing; export/import |
| Analytics | 10 vendor adapters, batched HTTP with offline queue, run-level sampling, funnel reports |
| Experiments | Hash-based variant assignment with weights and holdouts |
| Surfaces | Banner, announcement, survey/NPS, hint, checklist, resource centre, changelog — framework-free factories plus React wrappers |
| Authoring | Recorder with selector scoring, debug overlay, JSON Schema, CLI (`validate`, `lint-selectors`, `preview`) |
| i18n | Key + locale resolvers, interpolation, ICU-style plurals, RTL, direction detection |
| Theming | 20 `--ot-*` tokens, 3-level cascade, dark mode, reduced motion, shadow-DOM isolation, portal |
| Docs | 27 pages shipped inside the package and rendered at [the docs site](https://jeanpauldot.github.io/OpenTutorial/docs/) |
| Tests | 601 unit + 94 browser tests across Chromium, Firefox, WebKit and two mobile profiles, with an axe a11y gate |
| CI/Release | Lint, coverage thresholds, size budgets, `dist/` drift check, multi-browser E2E; changesets → tag-triggered npm publish with provenance |

---

## 2. Guardrails

Four properties are load-bearing. A change that breaks one needs a very good
reason and a major version.

1. **Zero runtime dependencies** — `dependencies` stays `{}`. Every adapter
   avoids importing its framework; the CLI and build scripts avoid npm packages.
2. **Fail closed, never crash the host** — a bad spec disables its own tour and
   nothing else; actions, listeners and analytics adapters are individually
   try/caught.
3. **No `eval`, no `new Function`** — expressions stay a hand-written parser, so
   the library works under a strict CSP.
4. **Framework-agnostic core** — adapters and surfaces wrap the engine; the root
   entry never imports React.

---

## 3. What is not done

Two of these need action outside this repository; the rest are genuinely
optional.

| # | Item | Notes |
|---|---|---|
| X-1 | **SchemaStore submission** | `spec.schema.json` ships with an `$id`, but is not in the [SchemaStore](https://www.schemastore.org/) catalog, so `*.tour.json` files still need a `$schema` line. Needs a pull request against their repo. |
| X-2 | **`examples/` directory** | The [docs site](https://jeanpauldot.github.io/OpenTutorial/docs/) and the landing-page demo cover this in practice; a per-framework starter repo would still help. |
| X-3 | **Playground** | A live spec editor with a preview pane. `opentutorial preview` covers the local case. |
| X-4 | **Migration codemods** | The migration guides carry converter functions as snippets; `opentutorial migrate` would run them. |
| X-5 | **Visual regression** | Popover placement across the 13 `Placement` values is asserted on geometry, not screenshots. |
| X-6 | **Nested lists in markdown** | Deliberately excluded — see [Content & theming](docs/guides/content-and-theming.md#markdown). Revisit if it comes up. |
| X-7 | **Mutually exclusive experiments** | `assignVariant` assigns independently; exclusive slots are a layer above it. |

Branch coverage sits at ~78%; the remainder is concentrated in `engine.ts` error
paths and `indexeddb.ts`, which needs a fake IDB to exercise properly.

---

## 4. After 1.0

No dates. The API is stable, so anything here is additive.

| Milestone | Contents |
|---|---|
| **1.1** | X-1 SchemaStore, X-2 examples, X-4 codemods. Adoption work. |
| **1.2** | X-3 playground, X-5 visual regression. |
| **Ongoing** | Bug fixes, browser-support updates, and whatever real usage turns up. |

The best input now is a bug report from a real integration. If something in the
docs does not match what the library does, that is a bug — please open an issue.
