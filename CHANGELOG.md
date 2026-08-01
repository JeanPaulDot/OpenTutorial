# Changelog

All notable changes to OpenTutorial are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-08-01

**The API is now stable.** Everything documented in `docs/` is covered by
semantic versioning: no breaking change without a major release.

This release closes the last of the roadmap and makes the tour adapt to its
content and its viewport rather than the other way round.

### Added

#### Content
- **Full markdown in step content.** Headings, ordered and unordered lists,
  blockquotes, fenced code with language classes, horizontal rules and inline
  images, on top of the emphasis/code/link support that already existed. A step
  with no block syntax still renders as a single `<p>`, so existing tours
  produce the markup they always did.
- **Hardened URL handling.** `javascript:`, `vbscript:`, `data:` and `file:`
  links are dropped — including forms obfuscated with control characters, which
  browsers parse as executable. Relative links are now allowed and stay in the
  same tab; only genuinely external links get `target="_blank"`.
- `renderMarkdown()`, `hasBlockMarkdown()` and a `breaks` option on
  `renderInline()`.

#### Layout
- **Auto-sizing popover.** The card measures its content and picks a width
  between 240px and 460px, clamped to the viewport — a one-line step no longer
  rattles around in a 340px box, and a step with a code block no longer
  overflows one. Disable with `autoSize: false`.
- **Height is capped at 70% of the viewport**, so long content scrolls inside
  the card while the title and footer stay put. Losing the Next button below the
  fold on a short screen was the failure mode this replaces.
- **Density** — `compact` | `comfortable` | `spacious`, settable per provider,
  spec or step. Scales spacing, font size and radius together, and surfaces as
  `data-ot-density` for host CSS to hook.

#### Features
- **Multi-element highlight** — `target: { selector: '…', all: true }` gives
  every match its own cutout and ring. The popover and the interaction shield
  use their union.
- **`renderIndicator`** replaces the built-in hotspot/beacon, separately from
  `renderStep` — replacing the popover while keeping the default beacon is a
  reasonable combination that used to be impossible.
- **A/B testing** — `assignVariant()` and `assignAll()`. Stable hash-based
  assignment with weights and holdouts, no storage and no service. See
  [docs/guides/experiments.md](docs/guides/experiments.md).
- **`sampleRate`** on the layer applies run-level analytics sampling to every
  adapter at once.
- **`showIf` is fully reactive** — `setContext` now also repaints the step count
  when a *later* step becomes visible or hidden, not just when the current one
  does.
- **`opentutorial preview <url>`** serves a page that runs your specs against a
  running app, turning the authoring loop into *edit JSON → refresh*.

#### Documentation
- Docs now ship **inside the npm package**, so a site or wiki can render them
  from `node_modules` and never drift from the installed version.
- New [A/B testing guide](docs/guides/experiments.md).

#### Verification
- E2E and accessibility suites run on **Chromium, Firefox, WebKit and two mobile
  profiles** — 94 browser tests, up from 38 on Chromium alone.
- 601 unit tests.

### Changed
- Text content renders block markdown by default. A line beginning `- ` or `1. `
  that used to render literally now becomes a list. Pass `markdown: 'inline'` to
  `renderBlocks` for the old behaviour.
- The popover sizes itself unless `autoSize: false` is set; `--ot-popover-width`
  now acts as the fallback rather than the fixed width.

### Fixed
- The `docs/` directory was missing from the published package.

## [0.3.0] - 2026-08-01

The theme of this release is **parity and proof**: everything React could do,
every adapter can now do; and everything the docs claim is now covered by a test.

### Added

#### Framework parity
- **Guidance surfaces as framework-free factories** — `createBanner`,
  `createAnnouncement`, `createSurvey`, `createHint`, `createChecklist`,
  `createResourceCenter` and `createChangelog`. Each builds DOM and returns a
  handle with `destroy()`. Vue, Svelte, Angular, Solid, the Web Component and
  plain scripts now get the surfaces that were previously React-only. The React
  components remain and wrap the same primitives, so markup, styling and
  persistence cannot drift between them.
- **Changelog / what's-new widget** (`createChangelog`, `<Changelog>`) — the one
  surface from the original plan that had never shipped. Read state is tracked
  per entry id rather than by a "last seen" timestamp, so a backdated entry still
  surfaces and re-ordering the feed never marks anything unread again.
- **Angular adapter** (`@opentutorial/core/angular`) — `provideOpenTutorial()`
  and `OpenTutorialService`, with `Observable`-shaped `state$` and `events$` that
  work directly with `toSignal` and the `async` pipe. `@angular/core` is never
  imported.
- **Solid adapter** (`@opentutorial/core/solid`) — `createTourLayer` with
  `watch`/`watchEvents` for signal wiring, plus a `tourAnchor` directive.
  `solid-js` is never imported.

#### Features
- **Progress export/import** — `exportProgress()` and `importProgress(data, mode)`
  on the engine, orchestrator and every adapter. `merge` keeps whichever record
  is newer per tour, for reconciling a server copy with local activity.
- **Pluralization** — ICU-style `{{count, plural, one {# tour} other {# tours}}}`
  driven by `Intl.PluralRules`, so Slavic `few`/`many` and Arabic `zero`/`two`
  work without a rules table. Plus `selectPlural()` and `localeDirection()`.
- **Locale-aware number formatting** in interpolation.
- **Mobile swipe gestures** — horizontal swipes move between steps, mirrored
  under RTL, and gated so a swipe can never bypass an `advanceOn: 'target-click'`
  step. Disable with `swipe: false`.
- **Analytics sampling** — `withSampling()` samples whole **tour runs** rather
  than individual events, because per-event sampling destroys funnel analysis.
  The decision is a stable hash, not `Math.random()`. Plus `withEventTypes()`.
- **`getSpecs()` and `getContext()`** on the vanilla layer and orchestrator.
- **Top-level `storage` / `keyPrefix`** on the vanilla layer, matching the React
  provider (see the fix below).

#### Tooling
- **`opentutorial` CLI** — `validate` (with `--strict`, `--json`, `--quiet`),
  `lint-selectors <url>` for Playwright-driven dead-selector detection, `schema`
  and `version`. Zero dependencies, its own glob expansion so it behaves the same
  in bash, PowerShell and cmd, and cross-file duplicate-id detection that a
  per-spec validator cannot do.
- **Changesets** for versioning and release notes.
- **`scripts/build.mjs`** — the full three-pass build as one cross-platform
  command, verifying all 14 published entry points exist afterwards.
- **`scripts/size-budget.mjs`** — gzipped size budgets per bundle, enforced in CI.

#### Documentation
- A complete `docs/` set: API reference, spec reference, getting started, six
  framework guides, an SSR guide, and guides for triggers/orchestration,
  targeting, content/theming, surfaces, persistence, analytics, authoring, i18n,
  accessibility, CSP and browser support.
- Migration guides from **intro.js**, **Shepherd**, **driver.js** and
  **react-joyride**, each with field mappings and a converter function.
- The `createRemoteStorage` REST contract is now documented rather than living
  only in source comments.

#### Tests
- **529 unit tests** (was 82), covering the orchestrator, triggers, every
  adapter, the DOM layer, storage adapters, analytics, surfaces, content, i18n,
  authoring and the React components. Coverage thresholds are enforced in CI
  (85% lines / 82% statements / 78% functions / 75% branches).
- **38 Playwright E2E tests** across desktop and mobile, covering placement,
  interaction gating, cross-page resume, keyboard navigation and swipe gestures.
- **Automated accessibility gate** — every step of the example tour is checked
  against axe-core (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) in light and dark
  mode, on every CI run.

### Fixed
- **Expression sandbox escape.** `SAFE_METHODS[name]` resolved through
  `Object.prototype`, so inherited members were treated as whitelisted methods:
  `plan.constructor()` evaluated to `Object('pro')`, and `toString`, `valueOf`,
  `hasOwnProperty`, `isPrototypeOf`, `toLocaleString` and
  `propertyIsEnumerable` were all reachable. Now an own-property check.
- **A step whose `showIf` became false ended the tour.** `setContext` correctly
  left the step, but the next-step lookup could not find the now-hidden step in
  the visible list and returned nothing, which the engine read as "end of tour".
  It now walks forward from the step's position in the spec.
- **Top-level `storage` was silently ignored outside React.** `TourProvider`
  mapped `storage` into `persistence.storage`; every other adapter required the
  nested form, so passing `storage` to the vanilla, Vue, Svelte or Web Component
  layer fell through to `localStorage`. Both spellings now work everywhere.
- **`npm run prepare` could publish a broken package.** It ran only the first
  build pass, which empties `dist/` — so a publish relying on it shipped without
  `dist/opentutorial.global.js`, breaking the `unpkg`, `jsdelivr` and
  `./opentutorial.global.js` entry points.
- **A throwing Svelte subscriber took the store down.** The immediate call
  required by Svelte's store contract was not guarded like later notifications.
- **Reopening the changelog panel** cleared the unread highlight in the same
  frame it appeared.

### Changed
- **`OpenTutorial` is now spelled consistently.** Analytics event prefixes are
  `OpenTutorial …` rather than `Opentutorial …`, and the IIFE global is
  `window.OpenTutorial`. **If you have dashboards keyed on the old event names,
  update them.** `window.Opentutorial` remains as an alias for script-tag users.
- The React components now import `ChecklistStatus`, `SurveyKind`,
  `SurveyResponse` and `ResourceLink` from the shared surfaces rather than
  redeclaring them.
- CI now runs coverage, the size budget, a CLI smoke test and a separate E2E job.

## [0.2.0] - 2026-07-31

### Added
- **Subpath exports**: `@opentutorial/core` (React-free core), `/react`, `/vue`,
  `/svelte`, `/webcomponent`, `/vanilla`, `/analytics`, `/authoring`, `/schema`.
- **IIFE global build** (`dist/opentutorial.global.js`) for plain `<script>` usage.
- **Framework adapters**: Vue 3 plugin, Svelte store + `tourAnchor` action, and a
  universal `<open-tutorial>` custom element.
- **TourOrchestrator**: one active tour at a time, priority queue, spec-level
  `audience` rules, `frequency` capping, and tour chaining via `onComplete`.
- **Triggers**: `route`, `element`, `idle`, `scroll` alongside `manual`/`auto`/`event`.
- **Cross-page tours**: `autoResume` rehydrates a tour after full page navigations;
  `onNavigate` delegates to SPA routers.
- **Rich content blocks**: text, image, video, list, code and opt-in HTML blocks.
- **Resilient targeting**: fallback selector lists, text matching, shadow-DOM
  piercing, iframe support, visibility waits.
- **Interaction gating**: `interaction: 'free' | 'target-only' | 'blocked'`.
- **New advance conditions**: `input-match`, `form-submit`, `element-appears`,
  `element-disappears`, `url-match`, plus a `beforeNext` guard hook.
- **Branching**: `next: [{ if, to }]` rule lists.
- **Custom rendering**: `renderStep` replaces the built-in popover.
- **Pause/resume** on the engine and every adapter.
- **Async storage**: `createIndexedDBStorage()`, `createCookieStorage()`,
  `createRemoteStorage()` (REST contract with local write-through cache), and
  per-user namespacing via `userId`.
- **Analytics**: Segment, RudderStack, Heap, Datadog RUM, a batched HTTP adapter
  with offline queue, and `createFunnelReport()` for drop-off analysis.
- **Guidance surfaces**: `Announcement`, `Banner`, `Survey`/NPS, `ResourceCenter`,
  `Hint`, and a self-managing `TourChecklist` (derives status from persistence,
  floating/collapsible).
- **Authoring**: point-and-click recorder with selector stability scoring, debug
  overlay (`debug` prop), and a published JSON Schema (`dist/spec.schema.json`).
- **Presentation**: dark mode (`prefers-color-scheme` / `data-ot-theme`), RTL
  support, reduced-motion handling, shadow-DOM isolation (`isolate`), and a
  `container` portal option.
- Validation now reports error/warning severity with a `strict` option.
- **Expression sandbox** widened: comparison operators, arithmetic, ternary,
  member/index access and a whitelist of pure string/array methods (`includes`,
  `matches`, …) — still no `eval`/`new Function`, so strict CSP keeps working.
- **Event set** expanded to `started`, `resumed`, `step-shown`, `step-hidden`,
  `step-completed`, `back`, `paused`, `unpaused`, `skipped`, `dismissed`,
  `completed`, `target-not-found`, `error`, with `duration` and `reason` fields.
- **Mobile**: popover docks as a bottom sheet under 480px with 44px touch targets.
- **Release automation**: tag-triggered npm publish with provenance, plus a CI
  check that the committed `dist/` has not drifted from `src/`.

### Fixed
- Progress keys no longer leak on reset (single atomic storage key).
- Amplitude adapter no longer mutates the shared event object.
- Vanilla adapter event subscriptions now fire for engine-emitted events.
- Vanilla adapter honours `locale`, `i18nResolver`, `resume` and `progressTtl`.
- `TourChecklist` resolves i18n titles/descriptions instead of rendering raw keys.
- "Back" works after resuming mid-tour (history is seeded from visible steps).

### Changed
- **Repository is now library-only.** The marketing site and live demo were moved
  to a separate repository; this repo ships only `@opentutorial/core`.
- The root entry point no longer imports React; React is an optional peer.
- `TourChecklist` derives status from persistence by default instead of requiring
  the host to compute `getStatus`.

### Removed
- The `npm run build:site` script and the `vite` site build mode; `vite build`
  now targets the library exclusively, with `BUILD_TARGET=iife` for the global
  bundle.
- The site's Tailwind/shadcn toolchain and the leftover Radix devDependencies.
- Docker, nginx and docker-compose setup (they served the demo site only).

## [0.1.0] - 2024

### Added
- Spec-driven in-app tour engine with a strict `TutorialSpec` schema (24+ validation checks).
- **Display modes**: `spotlight` (backdrop + cutout), `hotspot` (pulsing dot + tooltip), `beacon` (minimal indicator).
- **React adapter** (`TourProvider`, `useTour`, `TourAnchor`) and **vanilla JS adapter** (`createTutorialLayer`).
- **TourChecklist** onboarding component with progress tracking.
- **i18n** support via key-based resolvers.
- **Progress persistence** with resume across sessions (`localStorage` or custom storage).
- **Analytics adapters**: PostHog, Mixpanel, Amplitude, GA4.
- **Deep links** (`?tour=<id>`) to launch tours from a URL.
- **Conditional steps** via a safe, sandboxed `showIf` expression evaluator.
- **Theming** through 20+ CSS custom properties, overridable per spec or step.
- 79 unit tests (Vitest).
- Docker + nginx setup for serving the demo site.
