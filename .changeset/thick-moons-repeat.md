---
"@opentutorial/core": minor
---

Framework parity, tooling and a documentation set.

- Guidance surfaces are now framework-free factories (`createBanner`,
  `createAnnouncement`, `createSurvey`, `createHint`, `createChecklist`,
  `createResourceCenter`, `createChangelog`), so Vue, Svelte, Angular, Solid,
  the Web Component and plain scripts get what React already had. The React
  components remain, sharing the same primitives.
- New what's-new widget with per-entry read tracking.
- Angular and Solid adapters, neither importing its framework.
- `exportProgress()` / `importProgress()` on every adapter.
- ICU-style pluralization and `localeDirection()`.
- Mobile swipe gestures.
- Run-level analytics sampling that keeps funnels intact.
- `opentutorial` CLI: `validate`, `lint-selectors`, `schema`.
- Fixed: the sandbox treated `Object.prototype` members as whitelisted methods,
  so `plan.constructor()` evaluated to `Object('pro')`.
- Fixed: a step whose `showIf` became false ended the tour instead of advancing.
- Fixed: top-level `storage` was silently ignored outside React.
- Fixed: `npm run prepare` could publish without the global bundle.
