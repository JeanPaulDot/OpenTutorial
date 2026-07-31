# OpenTutorial — Versatility Roadmap

A gap analysis of `@opentutorial/core` v0.1.0 against what a general-purpose,
production-grade in-app guidance library needs, plus a phased implementation plan.

Everything below is derived from reading the current source (`src/core/**`), not from
assumptions. File references point at the code that motivates each item.

---

## 1. Baseline — what exists today

| Area | Status |
|---|---|
| State machine | `TourEngine` with start/next/prev/goTo/skip/complete, history stack, transition cap ([engine.ts](src/core/engine.ts)) |
| Display modes | `spotlight`, `hotspot`, `beacon` |
| Positioning | Side pick + flip + viewport shift + arrow ([popover.ts](src/core/dom/popover.ts:143)) |
| Targeting | Single CSS selector, optional `waitFor` with MutationObserver ([waitFor.ts](src/core/dom/waitFor.ts)) |
| Conditions | `showIf` mini-expression evaluator ([safeEval.ts](src/core/safeEval.ts)) |
| Validation | ~30 checks, fail-closed ([schema.ts](src/core/schema.ts)) |
| Persistence | localStorage seen-state + resume progress with TTL ([persist.ts](src/core/persist.ts)) |
| Adapters | React, vanilla |
| Analytics | PostHog, Mixpanel, Amplitude, GA4 |
| i18n | Key + fallback resolver |
| Theming | 11 tokens → CSS custom properties, 3-level cascade (global → spec → step) |
| Tests | 79 unit tests over engine/schema/persist/safeEval/markdown |

This is a solid, well-factored core. The gaps are almost entirely about **reach**
(who can install it), **expressiveness** (what a tour can express), and
**authoring** (who can create a tour).

---

## 2. Gap analysis

### 2.1 Packaging & reach — **highest impact, lowest effort**

| # | Gap | Evidence |
|---|---|---|
| P-1 | **The single entry point hard-imports React.** `dist/index.js` line 1–2 imports `react/jsx-runtime` and `react`. A vanilla, Vue, Svelte or Angular consumer cannot load the package without React installed. | [index.ts:10](src/core/index.ts:10) re-exports the React adapter |
| P-2 | No subpath exports. `./react`, `./vanilla`, `./analytics/*`, `./schema` should each be independently importable. | [package.json](package.json) `exports` has only `.` and `./styles.css` |
| P-3 | No IIFE/UMD build → no `<script src="…">` drop-in for sites without a bundler (WordPress, Rails, Django, plain HTML). | [vite.config.ts](vite.config.ts) `formats: ['es','cjs']` |
| P-4 | No `sideEffects: false` → poor tree-shaking. | package.json |
| P-5 | `peerDependencies` lists React as required rather than `peerDependenciesMeta.optional`. | package.json |
| P-6 | No `'use client'` banner on the React adapter → friction in Next.js App Router. | react.tsx |
| P-7 | 60+ Radix/shadcn packages remain in `devDependencies` from the deleted site. Slow `npm ci`, noisy audit surface. | package.json |
| P-8 | `dist/` is committed but CI never verifies it matches `src/`. Silent drift between git installs and npm installs. | [ci.yml](.github/workflows/ci.yml) |

### 2.2 Framework coverage

Only React + vanilla ship. Missing: **Vue 3**, **Svelte 5**, **Angular**, **Solid**,
a **Web Component** (`<open-tutorial>`), and Next.js/Nuxt/SvelteKit SSR guides.
The engine is already framework-agnostic, so each adapter is small — the blocker is
purely the packaging problem above (P-1/P-2).

### 2.3 Step expressiveness

| # | Gap |
|---|---|
| S-1 | **Content is inline-markdown only, capped at 320 chars** ([schema.ts:161](src/core/schema.ts:161)), rendered into a single `<p>` ([popover.ts:126](src/core/dom/popover.ts:126)). No images, video, lists, code blocks, or multi-paragraph bodies. |
| S-2 | **No custom rendering slot.** The popover is imperative DOM; React users cannot supply their own component. This is the single biggest ceiling on design flexibility. |
| S-3 | **One selector per step.** No fallback selector list, no multi-element highlight, no shadow-DOM piercing, no iframe targeting, no text-content matching, no `nth` index. |
| S-4 | **No interaction gating.** The overlay never blocks pointer events, so there is no way to say "only the highlighted element is clickable" — a standard tour requirement. |
| S-5 | **No input/validation steps.** `advanceOn` covers `button \| target-click \| event \| auto` ([engine.ts:429](src/core/engine.ts:429)) but not "when this input matches", "when the form submits", "when this element appears/disappears", "when the URL matches". |
| S-6 | **No conditional branching.** `next` is a static string ([types.ts:64](src/core/types.ts:64)). No `next: [{ if, to }]` rule list. |
| S-7 | **`showIf` grammar is thin** — only `=== !== && \|\| ! ()` and dotted paths. No `< > <= >=`, `includes`, `in`, array indexing, or arithmetic. |
| S-8 | **`showIf` is evaluated once per transition**, not reactively; a step already on screen does not disappear when context changes. |
| S-9 | Hard caps that block real use cases: ≤24 steps, title ≤60/80 chars, description ≤200. All errors, no warning severity, and one unknown key kills the whole tour. |
| S-10 | No pause/resume API on the engine (`pause()` / `resume()`), and no `beforeNext` guard hook. |

### 2.4 Flow orchestration

| # | Gap |
|---|---|
| F-1 | **Multi-page tours are broken in practice.** The `navigate` action does `window.location.assign` ([engine.ts:458](src/core/engine.ts:458)), which reloads the page and drops the running tour. There is no "active tour" rehydration on mount — `resume` only applies when `start()` is called explicitly ([engine.ts:125](src/core/engine.ts:125)). |
| F-2 | No SPA router integration. No `onNavigate` hook to delegate to React Router / Next / Vue Router instead of a hard reload. |
| F-3 | **Concurrent auto-tours.** The React trigger effect starts every eligible `auto` tour on its own timer with no coordination ([react.tsx:111-135](src/core/adapters/react.tsx:111)) — two overlays can mount simultaneously. `start()` from `useTour` guards against this; the trigger path does not. |
| F-4 | No trigger types beyond `manual \| auto \| event`. Missing: route match, element appears, scroll depth, idle time, Nth session, first-visit-of-day. |
| F-5 | No frequency capping or cooldown ("at most once per week", "max 2 tours per session"). |
| F-6 | No spec-level targeting/audience rules — `showIf` exists only per step. |
| F-7 | No tour chaining (`onComplete: { startTour: 'next-flow' }`) and no priority queue. |

### 2.5 Persistence & identity

| # | Gap |
|---|---|
| D-1 | **`KeyValueStorage` is synchronous only** ([types.ts:112](src/core/types.ts:112)) → IndexedDB and remote/server-backed storage are impossible. |
| D-2 | **No user scoping.** Keys are `ot:tours` / `ot:progress:<id>` ([persist.ts:42](src/core/persist.ts:42)) with no user id — a shared browser or a logout/login shows the wrong state. |
| D-3 | No server sync adapter, so nothing carries across devices. |
| D-4 | No progress export/import, no bulk `hasSeen` query, no per-tour `reset(tourId)` exposed through the adapters. |

### 2.6 Presentation & accessibility

| # | Gap |
|---|---|
| A-1 | No dark-mode default (`prefers-color-scheme`) — light-only unless the host overrides tokens. |
| A-2 | No RTL support; positioning and CSS use physical, not logical, properties. |
| A-3 | No enter/exit animations, no `prefers-reduced-motion` handling for the beacon pulse or spotlight transition (only `scrollIntoView` respects it, [engine.ts:305](src/core/engine.ts:305)). |
| A-4 | No shadow-DOM encapsulation for the layer → host CSS can bleed into the popover. |
| A-5 | No `container` / portal option; the layer always attaches to `document.body` ([layer.ts](src/core/dom/layer.ts)). Breaks inside fullscreen elements and dialogs with their own stacking context. |
| A-6 | `aria-modal="true"` is set unconditionally ([popover.ts:63](src/core/dom/popover.ts:63)), including for non-blocking hotspot flows. No `aria-live` region for step changes. |
| A-7 | Enter advances the tour whenever focus is not on a button ([focus.ts:23](src/core/dom/focus.ts:23)) — hijacks form input inside a step. |
| A-8 | Beacon mode advances on *any* document click ([engine.ts:336-337](src/core/engine.ts:336)). |
| A-9 | Mobile: one `max-width: 480px` media query, no bottom-sheet layout, no swipe gestures, no touch-target sizing. |
| A-10 | No CSP guidance — the library writes inline `style` attributes, which `style-src-attr` blocks. |

### 2.7 Authoring & DX

| # | Gap |
|---|---|
| X-1 | **No visual tour builder.** Every commercial competitor ships point-and-click authoring. A "record mode" (`?ot-record=1`) that lets you click elements, auto-generates resilient selectors, and emits a `TutorialSpec` JSON is the highest-leverage differentiator. |
| X-2 | No published JSON Schema (`spec.schema.json`) → no `$schema` autocomplete when authoring specs as JSON. |
| X-3 | No CLI (`opentutorial validate specs/**/*.json`) for CI-time spec linting. |
| X-4 | No selector-health check — nothing tells you a tour broke because a `data-tour` attribute was renamed. |
| X-5 | `dev: true` exists in options ([types.ts:137](src/core/types.ts:137)) but only gates a `console.error`. No debug overlay showing current step, resolved target, context, and `showIf` evaluation. |
| X-6 | `defineSpec` is an identity function ([factory.ts:9](src/core/factory.ts:9)). No generic over the context type, so `showIf` strings and `setContext` keys are unchecked. |
| X-7 | No examples directory, playground, or Storybook (removed with the site). |
| X-8 | No docs site and no generated API reference. |

### 2.8 Analytics & observability

| # | Gap |
|---|---|
| N-1 | Six event types only ([types.ts:89](src/core/types.ts:89)). Missing: `resumed`, `paused`, `step-completed` (vs merely shown), `navigated-back`, `target-not-found` as a typed event, `dismissed` vs `skipped`, and time-on-step duration. |
| N-2 | No funnel/drop-off helper — the most-asked question ("where do users quit?") requires host-side work. |
| N-3 | Adapters mutate the caller's event object: the Amplitude adapter `delete`s `timestamp` from a cast of the live event ([amplitude.ts:11-12](src/core/analytics/amplitude.ts:11)), corrupting it for every later listener. |
| N-4 | No Segment, RudderStack, Heap, Datadog RUM, or generic webhook/HTTP adapter; no batching, offline queue, or sampling. |

### 2.9 Beyond tours — the product surface

A "versatile" guidance library is more than step-through tours. Missing primitives:

- **Announcement modal** (full-screen, targetless, image/video)
- **Banner / top bar** (dismissible, scheduled)
- **Survey / NPS step**
- **Resource center / help hub launcher** (searchable list of tours + links)
- **Standalone hints** — persistent `?` markers that are not part of a flow
- **Changelog / what's-new widget**
- **Self-managing checklist.** `TourChecklist` today is presentational and makes the
  host compute `getStatus` ([TourChecklist.tsx:9](src/core/components/TourChecklist.tsx:9)); it should derive
  status from persistence by default, support a minimized/floating state, and deep-link per item.

### 2.10 Testing & release

- No tests for: engine DOM flows, popover geometry, React adapter, vanilla adapter, hotspot, focus trap, `waitFor`, i18n, analytics adapters.
- No E2E (Playwright), no visual regression, no automated a11y (axe) pass.
- CI has no coverage threshold, no bundle-size budget, and no publish workflow (no npm release automation, no provenance).

### 2.11 Bugs found while reading

1. **Progress keys leak on reset.** `resetSeen()` calls `persist.reset()` — which removes the root `ot:tours` key — *then* `clearAllProgress()`, which reads that now-deleted root to find tour ids and therefore finds none. Per-tour `ot:progress:*` keys survive a "reset all". ([engine.ts:93](src/core/engine.ts:93), [persist.ts:79](src/core/persist.ts:79))
2. `TourPersistence.reset()` with no id calls `clearProgress('')`, removing the meaningless key `ot:progress:`. ([persist.ts:82](src/core/persist.ts:82))
3. Amplitude adapter mutates the shared event object (N-3 above).
4. Vanilla adapter's `on()` registers handlers in a local map *and* on `window` under `opentutorial:<event>`, but the engine only ever dispatches `opentutorial` ([engine.ts:492](src/core/engine.ts:492)) — the window path never fires, and `emit()` is only called for lifecycle calls made through the adapter, not by the engine.
5. Vanilla adapter drops `locale`, `i18nResolver`, `resume` and `progressTtl` when constructing engines ([vanilla.ts:25-32](src/core/adapters/vanilla.ts:25)) — i18n and resume are React-only in practice.
6. `TourChecklist` renders the raw i18n *key* as the visible title when a spec uses i18n objects ([TourChecklist.tsx:44](src/core/components/TourChecklist.tsx:44)), and always drops i18n descriptions.
7. After a resume, `history` is empty so "Back" is hidden even mid-tour ([engine.ts:361](src/core/engine.ts:361)).

---

## 3. Phased plan

### Phase 0 — Correctness & packaging (foundation)
*Nothing else lands cleanly until the package can be installed without React.*

1. Fix the 7 bugs in §2.11 (each gets a regression test).
2. Split entry points and add subpath exports:
   ```jsonc
   "exports": {
     ".":            { "types": "./dist/index.d.ts", "import": "./dist/index.js",  "require": "./dist/index.cjs" },
     "./react":      { "types": "./dist/react.d.ts", "import": "./dist/react.js",  "require": "./dist/react.cjs" },
     "./vanilla":    { … },
     "./analytics":  { … },
     "./schema":     { … },
     "./styles.css": "./dist/styles.css"
   }
   ```
   The root entry becomes React-free; `peerDependenciesMeta.react.optional = true`.
3. Add an IIFE build (`dist/opentutorial.global.js`) for `<script>` users.
4. Add `"sideEffects": ["*.css"]`, `'use client'` on the React adapter, prune the ~60 leftover Radix/shadcn devDependencies.
5. CI: `npm run build && git diff --exit-code dist/` to catch drift; add a bundle-size budget.

**Done when:** a plain HTML page and a Vue app can both use the library, and `npm ci` no longer installs a UI kit.

---

### Phase 1 — Step expressiveness
*Makes tours look and behave like the host product.*

1. **Rich content** — `content` accepts a block list, not just a string:
   ```ts
   type StepContent =
     | string
     | { blocks: Array<
         | { type: 'text';  value: I18nContent }
         | { type: 'image'; src: string; alt: string }
         | { type: 'video'; src: string; poster?: string }
         | { type: 'list';  items: I18nContent[] }
         | { type: 'code';  value: string; lang?: string }
       > };
   ```
   Raise the char caps to configurable soft **warnings**; introduce error/warning severity in `validateSpec` and a `strict: boolean` option so an unknown key no longer kills a tour.
2. **Custom rendering slot** — `TourProvider` accepts `renderStep?: (ctx) => ReactNode`, rendered through a React portal into the layer. Vanilla gets `renderStep?: (ctx, el) => void`. The built-in popover becomes the default, not the only option.
3. **Resilient targeting**:
   ```ts
   target: {
     selector: string | string[];   // first match wins
     text?: string;                 // match by visible text
     shadow?: boolean;              // pierce open shadow roots
     iframe?: string;               // selector of the containing iframe
     index?: number;
     visible?: boolean;             // wait for visibility, not just presence
   }
   ```
4. **Interaction gating** — `interaction: 'free' | 'target-only' | 'blocked'`, implemented with a pointer-events shield on the layer plus a cutout for the target rect.
5. **New advance conditions** — `advanceOn: 'input-match' | 'form-submit' | 'element-appears' | 'element-disappears' | 'url-match'`, plus `beforeNext?: (ctx) => boolean | Promise<boolean>` as a guard.
6. **Branching** — `next: string | Array<{ if: string; to: string }>`, reusing the `showIf` evaluator.
7. **Richer `showIf` grammar** — comparison operators, `includes`, `in`, array indexing, numeric arithmetic. Keep the hand-written parser (no `eval`, no CSP problem).
8. **Reactive visibility** — re-evaluate the current step's `showIf` on `setContext`; auto-advance if it becomes false.
9. `pause()` / `resume()` on the engine and both adapters.

---

### Phase 2 — Flow orchestration
*Turns a step-runner into an onboarding system.*

1. **Cross-page tours** — persist `{ activeTourId, stepId }` on navigation; a new
   `autoResume` provider option rehydrates and continues on mount. `navigate` gains an
   `onNavigate?: (path) => void` escape hatch so SPAs push state instead of reloading.
2. **Trigger engine** — a real evaluator supporting:
   ```ts
   trigger:
     | { type: 'manual' }
     | { type: 'auto'; delay?: number }
     | { type: 'event'; event: string }
     | { type: 'route'; path: string | RegExp }
     | { type: 'element'; selector: string }
     | { type: 'idle'; ms: number }
     | { type: 'scroll'; percent: number }
   ```
3. **Tour queue** — one active tour at a time, `priority` per spec, deferred tours queued rather than dropped. Fixes F-3.
4. **Audience & frequency**:
   ```ts
   audience?: { showIf?: string };            // spec-level condition
   frequency?: { max?: number; cooldown?: number; perSession?: number };
   ```
5. **Chaining** — `onComplete?: { startTour?: string; emit?: string }`.

---

### Phase 3 — Persistence, identity & backend
1. Widen `KeyValueStorage` to allow async (`string | null | Promise<string | null>`) and make the engine await it; ship `createIndexedDBStorage()` and `createCookieStorage()`.
2. `userId` option → namespaced keys (`ot:<userId>:tours`), with automatic reset on identity change.
3. `createRemoteStorage({ endpoint, headers })` — a documented REST contract (`GET/PUT /progress/:userId`) so teams can self-host cross-device state, with local write-through cache and offline queue.
4. `exportProgress()` / `importProgress()`; per-tour `reset(tourId)` on both adapters.

---

### Phase 4 — Authoring (the differentiator)
1. **Record mode** — `?ot-record=1` (or `enableRecorder: true` in dev) opens a picker overlay: hover to highlight, click to capture, type the copy, reorder steps, export JSON. Selector generation prefers `data-tour` → `data-testid` → `id` → a scored, minimal CSS path, and reports a stability score for each.
2. **Debug overlay** — with `dev: true`, a corner panel showing the active spec, step index, resolved target, live context, and the boolean result of every `showIf`.
3. **`spec.schema.json`** published in `dist/` and to SchemaStore, so JSON specs get editor autocomplete.
4. **CLI** — `opentutorial validate`, `opentutorial lint-selectors <url>` (Playwright-driven dead-selector detection), `opentutorial preview`.
5. **Typed authoring** — `defineSpec<Ctx>()` generic that types `setContext` keys and, where feasible, validates `showIf` identifiers against `Ctx` at compile time.

---

### Phase 5 — Framework adapters
Once Phase 0 lands, each is a thin wrapper over `TourEngine`:
Vue 3 (`useTour` composable + plugin) → Svelte 5 (store + action) → Web Component
(`<open-tutorial>`, covers Angular/Solid/anything) → Angular service → Solid.
Ship an SSR guide per meta-framework (Next App Router, Nuxt, SvelteKit).

---

### Phase 6 — Presentation, a11y, i18n polish
1. Dark-mode token set behind `prefers-color-scheme` + explicit `data-ot-theme` override.
2. RTL: logical CSS properties and mirrored placement resolution.
3. Enter/exit animations with a full `prefers-reduced-motion` path (spotlight, beacon, popover).
4. Optional shadow-DOM encapsulation (`isolate: true`) and a `container` portal option.
5. A11y pass: correct `aria-modal` per display mode, `aria-live` step announcements, scoped Enter handling (A-7), targeted beacon dismissal (A-8), documented keyboard map.
6. Mobile: bottom-sheet layout under 480px, swipe next/prev, 44px touch targets.
7. i18n: pluralization/interpolation, per-locale spec overrides, `dir` awareness, and wiring i18n into the vanilla adapter (bug 5) and `TourChecklist` (bug 6).

---

### Phase 7 — Guidance surfaces beyond tours
Ship as separate, individually importable modules so nobody pays for what they don't use:
`Announcement` (modal) · `Banner` · `Survey`/NPS · `ResourceCenter` · `Hint` (standalone
persistent markers) · `Changelog` · and a self-managing `Checklist` that derives status from
persistence, supports a floating/minimized state, and deep-links each item.

---

### Phase 8 — Analytics & insight
1. Expand the event set (N-1) with durations and a `reason` field on terminal events.
2. `createFunnelReport(events)` helper returning per-step views, completions, drop-off rate, median time.
3. Generic `createHttpAdapter({ endpoint, batchSize, flushMs })` with batching and an offline queue; add Segment, RudderStack, Heap, Datadog RUM.
4. Freeze/clone events before handing them to adapters so no adapter can corrupt another (fixes N-3 at the source).

---

### Cross-cutting — quality & release
- Unit tests for every untested module; coverage threshold in CI (start at 80%).
- Playwright E2E across the display modes, multi-page flows, and interaction gating.
- `@axe-core/playwright` a11y gate; visual regression on the popover across placements.
- Release automation: changesets → npm publish with provenance, on tag.
- Docs site with framework guides, recipes, troubleshooting, a browser-support matrix,
  an a11y statement, and migration guides from **intro.js, Shepherd, driver.js and react-joyride**
  (a cheap, high-conversion acquisition channel).

---

## 4. Suggested sequencing

| Milestone | Contents | Rationale |
|---|---|---|
| **0.2.0** | Phase 0 | Unblocks every non-React user; fixes real bugs. Ship first. |
| **0.3.0** | Phase 1 (1–4) + rich content | The visible ceiling on what a tour can look like. |
| **0.4.0** | Phase 1 (5–9) + Phase 2 | Multi-page + triggers + queue = actual onboarding, not demos. |
| **0.5.0** | Phase 4 (recorder, debug overlay, JSON Schema) | The adoption differentiator. |
| **0.6.0** | Phase 5 (Vue, Svelte, Web Component) | Reach, now that packaging allows it. |
| **0.7.0** | Phase 3 + Phase 6 | Backend/identity and the a11y/i18n/mobile polish pass. |
| **0.8.0** | Phase 7 + Phase 8 | Broadens from "tour library" to "guidance platform". |
| **1.0.0** | Cross-cutting complete; API frozen; docs site live | — |

## 5. Guardrails to preserve while doing all this

The current design has four properties worth defending as the surface grows:

1. **Zero runtime dependencies** — every addition should keep `dependencies: {}`.
2. **Fail-closed, never crash the host** — a bad spec disables its tour and nothing else
   ([engine.ts:65-73](src/core/engine.ts:65)); actions and event listeners are individually try/caught.
3. **No `eval`, no `new Function`** — `showIf` stays a hand-written parser, so the library
   remains usable under a strict CSP.
4. **Framework-agnostic core** — adapters wrap `TourEngine`; no framework concept leaks into it.
