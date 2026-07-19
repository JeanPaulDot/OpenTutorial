# Changelog

All notable changes to OpenTutorials are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
