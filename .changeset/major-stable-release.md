---
"@opentutorial/core": major
---

1.0 — the API is stable.

- Full markdown in step content (headings, lists, quotes, fences, images), with
  hardened URL handling that rejects control-character-obfuscated schemes.
- The popover auto-sizes to its content and caps its height at 70% of the
  viewport, so long steps scroll instead of running off the screen.
- Density option (compact / comfortable / spacious) per provider, spec or step.
- Multi-element highlight via `target.all`.
- `renderIndicator` for replacing the hotspot/beacon independently of the popover.
- A/B testing via `assignVariant` / `assignAll`.
- `sampleRate` on the layer; fully reactive `showIf`.
- `opentutorial preview` for authoring without a rebuild.
- Docs ship inside the package.
- E2E and a11y suites now run on Chromium, Firefox, WebKit and two mobile profiles.
