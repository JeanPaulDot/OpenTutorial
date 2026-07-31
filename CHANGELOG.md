# Changelog

All notable changes to OpenTutorials are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
- Removed Docker, nginx and docker-compose setup (they served the demo site only).
- Removed Tailwind/shadcn site tooling and the leftover Radix/shadcn devDependencies.

### Removed
- `npm run dev`, `npm run build:site` and `npm run preview` scripts.
- The `vite` site build mode; `vite build` now targets the library exclusively.

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
