# OpenTutorial — Roadmap

Where `@opentutorial/core` stands today and what remains before 1.0.

Everything below is derived from reading the current source (`src/core/**`) and
running the suites, not from assumptions. File references point at the code
behind each claim.

**Current version: 0.3.0.** The 0.2.0 cycle closed the packaging,
expressiveness, orchestration, persistence, authoring and analytics gaps. The
0.3.0 cycle closed the verification, documentation, tooling and framework-parity
gaps that were listed here after it. What is left is genuinely a short list —
see §3.

---

## 1. Baseline — what ships today

| Area | Status |
|---|---|
| Packaging | Subpath exports (`.`, `/react`, `/vue`, `/svelte`, `/angular`, `/solid`, `/webcomponent`, `/vanilla`, `/analytics`, `/authoring`, `/schema`), ESM + CJS + IIFE, React-free root entry, optional peers ([package.json](package.json), [vite.config.ts](vite.config.ts)) |
| Adapters | React, Vue 3, Svelte, Angular, Solid, `<open-tutorial>` Web Component, vanilla JS ([adapters/](src/core/adapters)) |
| State machine | `TourEngine` — start/next/prev/goTo/pause/resume/skip/complete/destroy, history stack ([engine.ts](src/core/engine.ts)) |
| Orchestration | `TourOrchestrator` — one active tour, priority queue, `audience` rules, `frequency` capping, chaining ([orchestrator.ts](src/core/orchestrator.ts)) |
| Triggers | `manual`, `auto`, `event`, `route`, `element`, `idle`, `scroll`, plus `?tour=` deep links ([triggers.ts](src/core/triggers.ts)) |
| Cross-page | `autoResume` rehydration; `onNavigate` for SPA routers ([dom/navigation.ts](src/core/dom/navigation.ts)) |
| Display modes | `spotlight`, `hotspot`, `beacon`, `modal`, `banner`, plus `renderStep` custom rendering |
| Content | Rich blocks — text, image, video, list, code, divider, opt-in HTML ([content.ts](src/core/content.ts)) |
| Targeting | Fallback selector lists, text matching, shadow DOM, iframes, `index`, visibility waits ([dom/target.ts](src/core/dom/target.ts)) |
| Interaction | `free` \| `target-only` \| `blocked` pointer gating |
| Advance conditions | `button`, `target-click`, `event`, `auto`, `input-match`, `form-submit`, `element-appears`, `element-disappears`, `url-match`, `beforeNext` guard |
| Branching | `next: [{ if, to }]` rule lists |
| Expressions | Hand-written sandbox — comparison, arithmetic, ternary, member/index access, whitelisted pure methods; no `eval` ([safeEval.ts](src/core/safeEval.ts)) |
| Validation | 90+ checks with error/warning severity and a `strict` option ([schema.ts](src/core/schema.ts)) |
| Persistence | Sync-or-async storage; localStorage, cookie, IndexedDB, remote REST; per-user namespacing; export/import ([storage/](src/core/storage), [persist.ts](src/core/persist.ts)) |
| Analytics | 10 vendor adapters, batched HTTP with offline queue, run-level sampling, `createFunnelReport` ([analytics/](src/core/analytics)) |
| Events | 13 types with `duration` and `reason` ([types.ts](src/core/types.ts)) |
| Surfaces | Banner, announcement, survey/NPS, hint, checklist, resource centre, changelog — framework-free factories plus React wrappers ([surfaces/](src/core/surfaces), [components/](src/core/components)) |
| Authoring | Recorder with selector stability scoring, debug overlay, published JSON Schema, `opentutorial` CLI ([authoring/](src/core/authoring), [bin/](bin)) |
| i18n | Key + locale resolvers, interpolation, ICU-style plurals, RTL, direction detection ([i18n/](src/core/i18n)) |
| Theming | 20 `--ot-*` tokens, 3-level cascade, dark mode, reduced motion, shadow-DOM `isolate`, `container` portal ([styles.ts](src/core/styles.ts), [dom/layer.ts](src/core/dom/layer.ts)) |
| Mobile | Bottom-sheet layout, 44px touch targets, swipe gestures |
| Docs | API reference, spec reference, 6 framework guides, 11 topic guides, 4 migration guides ([docs/](docs)) |
| Tests | 529 unit tests + 38 Playwright E2E, with an axe accessibility gate |
| CI/Release | Lint, coverage thresholds, size budgets, `dist/` drift check, E2E + a11y job; changesets → tag-triggered npm publish with provenance ([.github/workflows](.github/workflows)) |

---

## 2. Guardrails to preserve

Four properties are load-bearing and every change must keep them:

1. **Zero runtime dependencies** — `dependencies` stays `{}`. Every adapter
   avoids importing its framework; the CLI and build scripts avoid npm packages.
2. **Fail closed, never crash the host** — a bad spec disables its own tour and
   nothing else; actions, event listeners and analytics adapters are individually
   try/caught.
3. **No `eval`, no `new Function`** — expressions stay a hand-written parser, so
   the library remains usable under a strict CSP.
4. **Framework-agnostic core** — adapters and surfaces wrap the engine; no
   framework concept leaks inward, and the root entry never imports React.

---

## 3. Remaining gaps

### 3.1 Documentation & examples

| # | Gap |
|---|---|
| X-1 | **No `examples/` directory.** The docs are thorough but there is nothing runnable in the repo — no CodeSandbox-able starter per framework. Explicitly deferred, not forgotten. |
| X-2 | **No hosted docs site.** `docs/` is Markdown on GitHub; there is no searchable site and no generated API reference from TSDoc. |
| X-3 | **No playground.** A live spec editor with a preview pane would shorten the authoring loop more than any other doc. |

### 3.2 Tooling

| # | Gap |
|---|---|
| C-1 | **SchemaStore submission.** `spec.schema.json` ships with an `$id`, but is not in the [SchemaStore](https://www.schemastore.org/) catalog, so `*.tour.json` files need a manual `$schema` line. Needs an external pull request. |
| C-2 | **No `opentutorial preview` command.** Serving a spec against a URL without wiring it into an app would help authors iterate. |
| C-3 | **No codemods** for the migration paths documented in `docs/migrating/`. The converter functions are copy-paste snippets rather than a `npx opentutorial migrate` command. |

### 3.3 Verification

| # | Gap |
|---|---|
| T-1 | **Firefox and WebKit are not in CI.** The Playwright config has project slots; only Chromium and an emulated Pixel 7 actually run. |
| T-2 | **No visual regression testing.** Popover placement across the 13 `Placement` values is covered by assertions on geometry, not by screenshots. |
| T-3 | **Branch coverage is 78%.** The remaining gaps are concentrated in `engine.ts` error paths, `recorder.ts` panel interactions and `indexeddb.ts` (which needs a fake IDB to test properly). |

### 3.4 Features

| # | Gap |
|---|---|
| G-1 | **No multi-element highlight.** A step spotlights one target; highlighting a group ("these three fields") needs a second cutout. |
| G-2 | **`showIf` is re-evaluated only for the current step.** A step further ahead becoming eligible mid-tour is not reflected until the tour reaches it. |
| G-3 | **No A/B testing primitive.** `audience.showIf` plus a context flag covers it, but there is no built-in variant assignment or holdout. |
| G-4 | **Analytics sampling is per-adapter.** There is no global sample rate on the layer. |
| G-5 | **`renderStep` cannot replace the hotspot or beacon**, only the popover. |

---

## 4. Sequencing to 1.0

| Milestone | Contents | Rationale |
|---|---|---|
| **0.4.0** | §3.1 — `examples/` per framework, a hosted docs site, a playground. | The library is now far ahead of what anyone can *discover*. Docs exist; discoverability does not. |
| **0.5.0** | §3.2 C-1, C-2 — SchemaStore, `preview`. §3.3 T-1 — Firefox and WebKit in CI. | Cheap, high-leverage, and T-1 is the last real coverage blind spot. |
| **0.6.0** | §3.4 G-1, G-2, G-5 — multi-element highlight, fully reactive `showIf`, replaceable hotspot rendering. | The remaining expressiveness ceilings. |
| **0.7.0** | §3.3 T-2 — visual regression. §3.2 C-3 — migration codemods. §3.4 G-3, G-4. | Polish and adoption work. |
| **1.0.0** | API frozen, docs site live, all gates green. | — |

Nothing on this list blocks production use. 0.3.0 is the first release where the
documentation, the test suite and the shipped behaviour all agree.
