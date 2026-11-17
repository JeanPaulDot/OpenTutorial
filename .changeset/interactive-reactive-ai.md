---
"@opentutorial/core": minor
---

Interactive, reactive tours and AI tooling.

- `input`, `choice` and `button` content blocks; `nextWhen` gating; clickable
  progress dots; draggable popover; `keyboard` option; `interaction` event.
- Live interpolation, a `context` trigger, one shared context across tours,
  `onContextChange`, `watchContext`, `layer.store`, `addSpec` / `removeSpec`,
  and serializable `dispatch` commands. React's `specs` prop is reactive.
- `opentutorial mcp` (MCP server), `collectAnchors`, `createAuthoringPrompt`,
  `describeSpec`, `extractSpec`, and `opentutorial describe`.
- Fixed: `preview` is now a reverse proxy (the iframe version could never
  resolve selectors); the JSON Schema accepts `density` and `target.all`;
  markdown no longer formats inside inline code; `renderIndicator` follows its
  target; React forwards `density`, `autoSize`, `swipe` and `sampleRate`.
