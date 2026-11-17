var P = Object.defineProperty;
var V = (e, t, o) => t in e ? P(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var v = (e, t, o) => V(e, typeof t != "symbol" ? t + "" : t, o);
const nt = `
/*
 * OpenTutorial styles. Everything is driven by --ot-* custom properties set on
 * .ot-root — override them from host CSS or via spec \`theme\` objects.
 */

.ot-root {
  position: fixed;
  inset: 0;
  z-index: var(--ot-z, 9999);
  pointer-events: none;

  --ot-accent: #6d5cff;
  --ot-bg: #ffffff;
  --ot-fg: #181822;
  --ot-muted: #67677c;
  --ot-border: color-mix(in srgb, var(--ot-muted) 22%, transparent);
  --ot-success: #10b981;
  --ot-danger: #ef4444;
  --ot-backdrop: rgba(12, 12, 22, 0.55);
  --ot-radius: 14px;
  --ot-shadow: 0 24px 60px -12px rgba(10, 10, 25, 0.45), 0 4px 16px rgba(10, 10, 25, 0.12);
  --ot-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  --ot-font-size: 13.5px;
  --ot-spacing: 16px;
  --ot-arrow-size: 10px;
  --ot-overlay-blur: 0px;
  --ot-anim-ms: 180ms;
  --ot-spotlight-ring: var(--ot-accent);
  --ot-popover-width: 340px;

  font-family: var(--ot-font);
}

/* Dark mode: opt in with [data-ot-theme="dark"], or follow the OS. */
@media (prefers-color-scheme: dark) {
  .ot-root:not([data-ot-theme="light"]) {
    --ot-bg: #17171f;
    --ot-fg: #f2f2f7;
    --ot-muted: #a1a1b5;
    --ot-border: color-mix(in srgb, var(--ot-muted) 28%, transparent);
    --ot-backdrop: rgba(4, 4, 10, 0.68);
    --ot-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.7), 0 4px 16px rgba(0, 0, 0, 0.4);
  }
}

.ot-root[data-ot-theme="dark"] {
  --ot-bg: #17171f;
  --ot-fg: #f2f2f7;
  --ot-muted: #a1a1b5;
  --ot-border: color-mix(in srgb, var(--ot-muted) 28%, transparent);
  --ot-backdrop: rgba(4, 4, 10, 0.68);
  --ot-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.7), 0 4px 16px rgba(0, 0, 0, 0.4);
}

.ot-backdrop {
  position: fixed;
  inset: 0;
  display: block;
  backdrop-filter: blur(var(--ot-overlay-blur));
}

.ot-dim {
  fill: var(--ot-backdrop);
  transition: fill var(--ot-anim-ms) ease;
}

.ot-ring {
  position: fixed;
  pointer-events: none;
  border: 2px solid var(--ot-spotlight-ring);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ot-spotlight-ring) 22%, transparent);
  transition:
    left var(--ot-anim-ms) ease, top var(--ot-anim-ms) ease,
    width var(--ot-anim-ms) ease, height var(--ot-anim-ms) ease,
    opacity var(--ot-anim-ms) ease;
}

/* Interaction shield: four panels that leave the target reachable. */
.ot-shield { position: fixed; inset: 0; pointer-events: none; }
.ot-shield-panel { position: fixed; pointer-events: auto; background: transparent; }

/* --------------------------------------------------------------------- */
/* Popover                                                                */
/* --------------------------------------------------------------------- */

.ot-popover {
  position: fixed;
  width: var(--ot-popover-width);
  max-width: calc(100vw - 20px);
  background: var(--ot-bg);
  color: var(--ot-fg);
  border-radius: var(--ot-radius);
  box-shadow: var(--ot-shadow);
  pointer-events: auto;
  outline: none;
  transition: left var(--ot-anim-ms) ease, top var(--ot-anim-ms) ease, opacity var(--ot-anim-ms) ease;
  animation: ot-pop-in var(--ot-anim-ms) ease-out;
}

.ot-popover--modal-step { --ot-popover-width: 420px; }

/*
 * Density scales the three things that actually change how roomy a card feels.
 * Everything else is derived from them, so headings, buttons, code blocks and
 * the arrow all move together.
 */
.ot-popover[data-ot-density="compact"] {
  --ot-spacing: 11px;
  --ot-font-size: 12.5px;
  --ot-radius: 10px;
}

.ot-popover[data-ot-density="spacious"] {
  --ot-spacing: 22px;
  --ot-font-size: 14.5px;
  --ot-radius: 18px;
}

/*
 * The card is capped at a share of the viewport, so a long step scrolls its
 * body instead of running off the bottom of the screen. Title and footer stay
 * put — losing the Next button below the fold was the old failure mode.
 */
.ot-popover {
  display: flex;
  flex-direction: column;
}

.ot-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.ot-content-wrap {
  overflow-y: auto;
  overscroll-behavior: contain;
  min-height: 0;
}

@keyframes ot-pop-in {
  from { opacity: 0; transform: translateY(4px) scale(0.985); }
  to   { opacity: 1; transform: none; }
}

.ot-body {
  position: relative;
  padding: var(--ot-spacing) calc(var(--ot-spacing) + 2px) calc(var(--ot-spacing) - 2px);
}

.ot-title {
  margin: 0 28px 6px 0;
  font-size: calc(var(--ot-font-size) + 1.5px);
  font-weight: 650;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

[dir="rtl"] .ot-title { margin: 0 0 6px 28px; }

.ot-content-wrap { margin-bottom: 14px; }
.ot-content-wrap > *:last-child { margin-bottom: 0; }

.ot-content {
  margin: 0 0 8px;
  font-size: var(--ot-font-size);
  line-height: 1.55;
  color: var(--ot-muted);
}

.ot-content strong { color: var(--ot-fg); font-weight: 650; }
.ot-content a { color: var(--ot-accent); text-decoration: underline; text-underline-offset: 2px; }
.ot-content code,
.ot-list code {
  background: color-mix(in srgb, var(--ot-muted) 14%, transparent);
  color: var(--ot-fg);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: calc(var(--ot-font-size) - 1.5px);
}

.ot-media {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: calc(var(--ot-radius) * 0.7);
  margin: 0 0 10px;
  background: color-mix(in srgb, var(--ot-muted) 10%, transparent);
}

.ot-list {
  margin: 0 0 10px;
  padding-inline-start: 20px;
  font-size: var(--ot-font-size);
  line-height: 1.55;
  color: var(--ot-muted);
}

.ot-list li { margin-bottom: 3px; }

.ot-code {
  margin: 0 0 10px;
  padding: 10px 12px;
  border-radius: calc(var(--ot-radius) * 0.6);
  background: color-mix(in srgb, var(--ot-muted) 12%, transparent);
  overflow-x: auto;
  font-size: calc(var(--ot-font-size) - 1.5px);
  line-height: 1.5;
}

.ot-code code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: var(--ot-fg); }

.ot-divider {
  border: 0;
  border-top: 1px solid var(--ot-border);
  margin: 12px 0;
}

.ot-html { font-size: var(--ot-font-size); line-height: 1.55; color: var(--ot-muted); margin-bottom: 10px; }

/* --------------------------------------------------------------------- */
/* Interactive blocks                                                     */
/* --------------------------------------------------------------------- */

.ot-field, .ot-choice { margin: 0 0 10px; }

.ot-field-label {
  display: block;
  margin-bottom: 5px;
  font-size: calc(var(--ot-font-size) - 1px);
  font-weight: 600;
  color: var(--ot-fg);
}

.ot-input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  font-size: var(--ot-font-size);
  color: var(--ot-fg);
  background: var(--ot-bg);
  border: 1px solid var(--ot-border);
  border-radius: calc(var(--ot-radius) * 0.5);
  padding: 8px 10px;
}

textarea.ot-input { min-height: 64px; resize: vertical; }
.ot-input::placeholder { color: var(--ot-muted); opacity: 0.8; }
.ot-input:focus-visible { outline: 2px solid var(--ot-accent); outline-offset: 1px; }

.ot-choice-options { display: flex; flex-wrap: wrap; gap: 6px; }

.ot-choice-option {
  font-family: inherit;
  font-size: calc(var(--ot-font-size) - 0.5px);
  color: var(--ot-fg);
  background: transparent;
  border: 1px solid var(--ot-border);
  border-radius: calc(var(--ot-radius) * 0.5);
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;
}

.ot-choice-option:hover { border-color: var(--ot-accent); }
.ot-choice-option:focus-visible { outline: 2px solid var(--ot-accent); outline-offset: 2px; }

/*
 * Selected is a border and a tint, with the text left at full foreground
 * contrast — accent-on-tint text would fail AA on most palettes.
 */
.ot-choice-option--selected {
  border-color: var(--ot-accent);
  background: color-mix(in srgb, var(--ot-accent) 14%, transparent);
  box-shadow: inset 0 0 0 1px var(--ot-accent);
  font-weight: 600;
}

.ot-block-btn { margin: 0 0 10px; }

.ot-btn:disabled,
.ot-btn[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; filter: none; }

/* Dots for visited steps are real buttons with a comfortable hit area. */
.ot-dot-jump {
  border: 0;
  padding: 0;
  cursor: pointer;
  position: relative;
  background: color-mix(in srgb, var(--ot-accent) 55%, transparent);
}
.ot-dot-jump::after { content: ""; position: absolute; inset: -9px -4px; }
.ot-dot-jump:hover { background: var(--ot-accent); }
.ot-dot-jump:focus-visible { outline: 2px solid var(--ot-accent); outline-offset: 3px; }

.ot-popover--draggable .ot-title { cursor: grab; touch-action: none; user-select: none; }
.ot-popover--dragging { transition: none; }
.ot-popover--dragging .ot-title { cursor: grabbing; }

/* --------------------------------------------------------------------- */
/* Block markdown                                                         */
/* --------------------------------------------------------------------- */

.ot-prose { font-size: var(--ot-font-size); line-height: 1.55; color: var(--ot-muted); }
.ot-prose > *:last-child { margin-bottom: 0; }

.ot-heading {
  margin: 0 0 6px;
  color: var(--ot-fg);
  font-weight: 650;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.ot-prose > .ot-heading:not(:first-child) { margin-top: 14px; }

/* Scaled from the body size so a density change moves headings with it. */
.ot-heading--1 { font-size: calc(var(--ot-font-size) + 4px); }
.ot-heading--2 { font-size: calc(var(--ot-font-size) + 2.5px); }
.ot-heading--3 { font-size: calc(var(--ot-font-size) + 1px); }
.ot-heading--4,
.ot-heading--5,
.ot-heading--6 { font-size: var(--ot-font-size); }
.ot-heading--5,
.ot-heading--6 { color: var(--ot-muted); text-transform: uppercase; letter-spacing: 0.05em; font-size: calc(var(--ot-font-size) - 2px); }

.ot-quote {
  margin: 0 0 10px;
  padding: 2px 0 2px 12px;
  border-inline-start: 3px solid color-mix(in srgb, var(--ot-accent) 45%, transparent);
  color: var(--ot-muted);
}

.ot-quote > *:last-child { margin-bottom: 0; }

.ot-inline-img {
  max-width: 100%;
  height: auto;
  border-radius: calc(var(--ot-radius) * 0.5);
  vertical-align: middle;
}

.ot-prose .ot-list { margin-bottom: 10px; }
.ot-prose .ot-code { margin-bottom: 10px; }

.ot-skip {
  position: absolute;
  top: 8px;
  inset-inline-end: 10px;
  border: 0;
  background: transparent;
  color: var(--ot-muted);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 8px;
}

.ot-skip:hover {
  color: var(--ot-fg);
  background: color-mix(in srgb, var(--ot-muted) 12%, transparent);
}

.ot-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ot-dots { display: flex; gap: 5px; align-items: center; }

.ot-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ot-muted) 32%, transparent);
  transition: all 0.15s ease;
}

.ot-dot-active { background: var(--ot-accent); width: 18px; }

.ot-btns { display: flex; gap: 8px; }

.ot-btn {
  font-family: inherit;
  font-size: calc(var(--ot-font-size) - 0.5px);
  font-weight: 600;
  padding: 7px 14px;
  border-radius: calc(var(--ot-radius) * 0.6);
  cursor: pointer;
  border: 1px solid transparent;
  transition: filter 0.12s ease, background 0.12s ease, color 0.12s ease;
}

.ot-btn-primary { background: var(--ot-accent); color: #fff; }
.ot-btn-primary:hover { filter: brightness(1.08); }

.ot-btn-ghost {
  background: transparent;
  color: var(--ot-muted);
  border-color: var(--ot-border);
}
.ot-btn-ghost:hover { color: var(--ot-fg); }

.ot-btn:focus-visible,
.ot-skip:focus-visible,
.ot-beacon:focus-visible,
.ot-content a:focus-visible {
  outline: 2px solid var(--ot-accent);
  outline-offset: 2px;
}

.ot-arrow {
  position: absolute;
  width: var(--ot-arrow-size);
  height: var(--ot-arrow-size);
  background: var(--ot-bg);
  transform: rotate(45deg);
  border-radius: 2px;
}

.ot-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.ot-custom-host { pointer-events: auto; }

/* Mobile: dock as a bottom sheet */
@media (max-width: 480px) {
  .ot-popover {
    left: 10px !important;
    right: 10px;
    bottom: 10px;
    top: auto !important;
    width: auto;
  }
  .ot-arrow { display: none; }
  .ot-btn { padding: 10px 16px; min-height: 44px; }
  .ot-skip { min-width: 44px; min-height: 44px; }
}

/* --------------------------------------------------------------------- */
/* Hotspot + beacon                                                       */
/* --------------------------------------------------------------------- */

@keyframes ot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 0.3; }
}

@keyframes ot-beacon-pulse {
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.3); opacity: 0.4; }
  100% { transform: scale(1); opacity: 0.9; }
}

.ot-hotspot {
  position: fixed;
  pointer-events: none;
  z-index: calc(var(--ot-z, 9999) + 1);
  transform: translate(-50%, -50%);
}

.ot-beacon {
  width: 12px;
  height: 12px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--ot-accent);
  cursor: pointer;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ot-accent) 25%, transparent);
}

.ot-beacon--hotspot { animation: ot-pulse 2s ease-in-out infinite; }

.ot-beacon--beacon {
  width: 8px;
  height: 8px;
  animation: ot-beacon-pulse 2s ease-in-out infinite;
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--ot-accent) 15%, transparent);
}

.ot-hotspot-tooltip {
  position: absolute;
  top: 16px;
  inset-inline-start: 12px;
  background: var(--ot-bg);
  color: var(--ot-fg);
  border-radius: var(--ot-radius);
  box-shadow: var(--ot-shadow);
  padding: 6px 10px;
  font-family: var(--ot-font);
  font-size: calc(var(--ot-font-size) - 1.5px);
  line-height: 1.4;
  max-width: 220px;
  white-space: normal;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ot-hotspot-text { flex: 1; min-width: 0; }

.ot-hotspot-dismiss {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: var(--ot-accent);
  color: #fff;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.12s ease;
}

.ot-hotspot-dismiss:hover { filter: brightness(1.15); }

/* --------------------------------------------------------------------- */
/* Checklist                                                              */
/* --------------------------------------------------------------------- */

.ot-checklist {
  font-family: var(--ot-font, ui-sans-serif, system-ui, sans-serif);
  padding: 16px;
  border-radius: 12px;
  background: var(--ot-bg, #fff);
  border: 1px solid var(--ot-border, rgba(103, 103, 124, 0.22));
  color: var(--ot-fg, #181822);
}

.ot-checklist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ot-checklist-title { font-size: 15px; font-weight: 600; margin: 0; }
.ot-checklist-count { font-size: 12px; font-weight: 500; color: var(--ot-muted, #67677c); }

.ot-checklist-bar-track {
  height: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ot-muted, #67677c) 16%, transparent);
  margin-bottom: 12px;
  overflow: hidden;
}

.ot-checklist-bar-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--ot-accent, #6d5cff);
  transition: width 0.4s ease;
}

.ot-checklist-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ot-checklist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.ot-checklist-item:hover { background: color-mix(in srgb, var(--ot-muted, #67677c) 6%, transparent); }
.ot-checklist-item--completed { opacity: 0.6; }

.ot-checklist-icon { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }
.ot-checklist-item--completed .ot-checklist-icon { color: var(--ot-success, #10b981); }
.ot-checklist-item--in_progress .ot-checklist-icon { color: var(--ot-accent, #6d5cff); }
.ot-checklist-item--pending .ot-checklist-icon { color: var(--ot-muted, #67677c); }

.ot-checklist-info { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.ot-checklist-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ot-checklist-desc { font-size: 11px; color: var(--ot-muted, #67677c); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ot-checklist-btn {
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--ot-accent, #6d5cff) 40%, transparent);
  background: transparent;
  color: var(--ot-accent, #6d5cff);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s ease;
}

.ot-checklist-btn:hover { background: color-mix(in srgb, var(--ot-accent, #6d5cff) 10%, transparent); }
.ot-checklist-btn:disabled { opacity: 0.4; cursor: default; }

.ot-checklist--floating {
  position: fixed;
  inset-inline-end: 20px;
  bottom: 20px;
  width: 320px;
  max-width: calc(100vw - 40px);
  z-index: var(--ot-z, 9999);
  box-shadow: var(--ot-shadow);
}

.ot-checklist-toggle {
  border: 0;
  background: transparent;
  color: var(--ot-muted, #67677c);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 6px;
}

.ot-checklist--collapsed .ot-checklist-items,
.ot-checklist--collapsed .ot-checklist-bar-track { display: none; }

/* --------------------------------------------------------------------- */
/* Banner                                                                 */
/* --------------------------------------------------------------------- */

.ot-banner {
  position: fixed;
  inset-inline: 0;
  z-index: var(--ot-z, 9999);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--ot-accent, #6d5cff);
  color: #fff;
  font-family: var(--ot-font);
  font-size: 13.5px;
  line-height: 1.45;
  box-shadow: 0 2px 12px rgba(10, 10, 25, 0.18);
}

.ot-banner--top { top: 0; }
.ot-banner--bottom { bottom: 0; }
.ot-banner-content { flex: 1; min-width: 0; }
.ot-banner-content a { color: inherit; text-decoration: underline; }

.ot-banner-action {
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 650;
  padding: 6px 12px;
  border-radius: 8px;
  border: 0;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
}

.ot-banner-action:hover { background: rgba(255, 255, 255, 0.28); }

.ot-banner-dismiss {
  border: 0;
  background: transparent;
  color: #fff;
  opacity: 0.8;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 2px 6px;
  flex-shrink: 0;
}

.ot-banner-dismiss:hover { opacity: 1; }

/* --------------------------------------------------------------------- */
/* Resource center / help hub                                             */
/* --------------------------------------------------------------------- */

.ot-hub {
  font-family: var(--ot-font);
  width: 340px;
  max-width: calc(100vw - 40px);
  background: var(--ot-bg, #fff);
  color: var(--ot-fg, #181822);
  border: 1px solid var(--ot-border, rgba(103, 103, 124, 0.22));
  border-radius: 14px;
  box-shadow: var(--ot-shadow);
  overflow: hidden;
}

.ot-hub--floating {
  position: fixed;
  inset-inline-end: 20px;
  bottom: 76px;
  z-index: var(--ot-z, 9999);
}

.ot-hub-header { padding: 14px 16px 10px; }
.ot-hub-title { margin: 0 0 8px; font-size: 15px; font-weight: 650; }

.ot-hub-search {
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--ot-border, rgba(103, 103, 124, 0.22));
  background: transparent;
  color: inherit;
}

.ot-hub-search:focus-visible { outline: 2px solid var(--ot-accent); outline-offset: 1px; }

.ot-hub-list { list-style: none; margin: 0; padding: 0 8px 10px; max-height: 320px; overflow-y: auto; }

.ot-hub-item {
  display: block;
  width: 100%;
  text-align: start;
  font-family: inherit;
  font-size: 13px;
  color: inherit;
  background: transparent;
  border: 0;
  border-radius: 8px;
  padding: 9px 10px;
  cursor: pointer;
  text-decoration: none;
}

.ot-hub-item:hover { background: color-mix(in srgb, var(--ot-muted) 8%, transparent); }
.ot-hub-item-desc { display: block; font-size: 11.5px; color: var(--ot-muted); margin-top: 2px; }
.ot-hub-empty { padding: 16px 10px; text-align: center; font-size: 12.5px; color: var(--ot-muted); }

.ot-hub-launcher {
  position: fixed;
  inset-inline-end: 20px;
  bottom: 20px;
  z-index: var(--ot-z, 9999);
  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: 0;
  background: var(--ot-accent, #6d5cff);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 8px 24px -6px rgba(10, 10, 25, 0.45);
}

/* --------------------------------------------------------------------- */
/* Survey                                                                 */
/* --------------------------------------------------------------------- */

.ot-survey { font-family: var(--ot-font); }
.ot-survey-question { margin: 0 0 12px; font-size: 14px; font-weight: 600; }

.ot-survey-scale { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 12px; }

.ot-survey-score {
  flex: 1;
  min-width: 30px;
  font-family: inherit;
  font-size: 12.5px;
  padding: 8px 0;
  border-radius: 7px;
  border: 1px solid var(--ot-border, rgba(103, 103, 124, 0.22));
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;
}

.ot-survey-score:hover { border-color: var(--ot-accent); }
.ot-survey-score--selected { background: var(--ot-accent); border-color: var(--ot-accent); color: #fff; }

.ot-survey-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--ot-muted);
  margin-bottom: 12px;
}

.ot-survey-options { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }

.ot-survey-option {
  font-family: inherit;
  font-size: 13px;
  text-align: start;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid var(--ot-border, rgba(103, 103, 124, 0.22));
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.ot-survey-option:hover { border-color: var(--ot-accent); }
.ot-survey-option--selected { background: color-mix(in srgb, var(--ot-accent) 12%, transparent); border-color: var(--ot-accent); }

.ot-survey-textarea {
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 13px;
  min-height: 72px;
  padding: 9px 11px;
  border-radius: 8px;
  border: 1px solid var(--ot-border, rgba(103, 103, 124, 0.22));
  background: transparent;
  color: inherit;
  resize: vertical;
  margin-bottom: 12px;
}

.ot-survey-thanks { font-size: 13.5px; color: var(--ot-muted); text-align: center; padding: 12px 0; }

/* --------------------------------------------------------------------- */
/* Standalone hint                                                        */
/* --------------------------------------------------------------------- */

.ot-hint {
  position: fixed;
  z-index: var(--ot-z, 9999);
  transform: translate(-50%, -50%);
  pointer-events: auto;
}

.ot-hint-dot {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 0;
  background: var(--ot-accent, #6d5cff);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ot-accent) 25%, transparent);
}

.ot-hint-panel {
  position: absolute;
  top: 24px;
  inset-inline-start: 0;
  width: 240px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--ot-bg, #fff);
  color: var(--ot-fg, #181822);
  box-shadow: var(--ot-shadow);
  font-family: var(--ot-font);
  font-size: 12.5px;
  line-height: 1.5;
}

/* --------------------------------------------------------------------- */
/* Recorder + debug overlay                                               */
/* --------------------------------------------------------------------- */

.ot-rec-highlight {
  position: fixed;
  pointer-events: none;
  z-index: 2147483646;
  border: 2px solid #6d5cff;
  background: rgba(109, 92, 255, 0.12);
  border-radius: 4px;
  transition: all 60ms linear;
}

.ot-rec-label {
  position: fixed;
  pointer-events: none;
  z-index: 2147483647;
  background: #181822;
  color: #fff;
  font: 500 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  padding: 3px 7px;
  border-radius: 5px;
  max-width: 460px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ot-rec-panel,
.ot-debug {
  position: fixed;
  z-index: 2147483647;
  width: 320px;
  max-height: 70vh;
  overflow-y: auto;
  background: #17171f;
  color: #f2f2f7;
  border-radius: 12px;
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.6);
  font: 400 12px/1.5 ui-sans-serif, system-ui, sans-serif;
  padding: 12px 14px;
  pointer-events: auto;
}

.ot-rec-panel { top: 16px; inset-inline-end: 16px; }
.ot-debug { bottom: 16px; inset-inline-start: 16px; width: 300px; }

.ot-rec-panel h4,
.ot-debug h4 { margin: 0 0 8px; font-size: 12.5px; font-weight: 650; }

.ot-rec-steps { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 4px; }

.ot-rec-step {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 6px 8px;
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.ot-rec-step code { font-size: 10.5px; opacity: 0.75; word-break: break-all; }
.ot-rec-actions { display: flex; gap: 6px; flex-wrap: wrap; }

.ot-rec-btn {
  font: 600 11.5px/1 inherit;
  padding: 7px 10px;
  border-radius: 6px;
  border: 0;
  background: #6d5cff;
  color: #fff;
  cursor: pointer;
}

.ot-rec-btn--ghost { background: rgba(255, 255, 255, 0.1); }

.ot-debug-row { display: flex; justify-content: space-between; gap: 10px; padding: 3px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
.ot-debug-key { opacity: 0.6; }
.ot-debug-val { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; text-align: end; word-break: break-all; }
.ot-debug-ok { color: #10b981; }
.ot-debug-bad { color: #ef4444; }

/* --------------------------------------------------------------------- */
/* Changelog / what's-new                                                 */
/* --------------------------------------------------------------------- */

.ot-changelog {
  font-family: var(--ot-font);
  width: 360px;
  max-width: calc(100vw - 40px);
  background: var(--ot-bg, #fff);
  color: var(--ot-fg, #181822);
  border: 1px solid var(--ot-border, rgba(103, 103, 124, 0.22));
  border-radius: 14px;
  box-shadow: var(--ot-shadow);
  overflow: hidden;
}

.ot-changelog--floating {
  position: fixed;
  inset-inline-end: 20px;
  bottom: 76px;
  z-index: var(--ot-z, 9999);
}

.ot-changelog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px 10px;
}

.ot-changelog-title { margin: 0; font-size: 15px; font-weight: 650; }

.ot-changelog-close {
  border: 0;
  background: transparent;
  color: var(--ot-muted);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  min-width: 28px;
  min-height: 28px;
}

.ot-changelog-list {
  list-style: none;
  margin: 0;
  padding: 0 8px 10px;
  max-height: 380px;
  overflow-y: auto;
}

.ot-changelog-item {
  padding: 10px;
  border-radius: 10px;
  border-bottom: 1px solid var(--ot-border, rgba(103, 103, 124, 0.16));
}

.ot-changelog-item:last-child { border-bottom: 0; }

.ot-changelog-item--unread {
  background: color-mix(in srgb, var(--ot-accent) 7%, transparent);
}

.ot-changelog-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.ot-changelog-tag {
  font-size: 10.5px;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ot-accent) 14%, transparent);
  color: var(--ot-accent);
}

.ot-changelog-date { font-size: 11.5px; color: var(--ot-muted); }
.ot-changelog-entry-title { margin: 0 0 4px; font-size: 13.5px; font-weight: 600; }
.ot-changelog-body { font-size: 12.5px; color: var(--ot-muted); }
.ot-changelog-body p { margin: 0 0 6px; }

.ot-changelog-link {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--ot-accent);
  text-decoration: none;
}

.ot-changelog-link:hover { text-decoration: underline; }
.ot-changelog-empty { padding: 18px 10px; text-align: center; font-size: 12.5px; color: var(--ot-muted); }

.ot-changelog-launcher {
  position: fixed;
  inset-inline-end: 20px;
  bottom: 20px;
  z-index: var(--ot-z, 9999);
  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: 0;
  background: var(--ot-accent, #6d5cff);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 8px 24px -6px rgba(10, 10, 25, 0.45);
}

.ot-changelog-badge {
  position: absolute;
  top: -4px;
  inset-inline-end: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 999px;
  background: var(--ot-danger, #ef4444);
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  font-weight: 650;
}

/* --------------------------------------------------------------------- */
/* Reduced motion                                                         */
/* --------------------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .ot-popover,
  .ot-ring,
  .ot-dim,
  .ot-beacon,
  .ot-rec-highlight,
  .ot-checklist-bar-fill { transition: none; animation: none; }
  .ot-beacon--hotspot,
  .ot-beacon--beacon { animation: none; }
  .ot-popover { animation: none; }
}
`.trim(), W = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function z(e) {
  return e.replace(/[&<>"']/g, (t) => W[t] ?? t);
}
const D = /^(javascript|vbscript|data|file|blob)\s*:/i;
function L(e) {
  let t = "";
  for (const o of e)
    o.charCodeAt(0) > 32 && (t += o);
  return t;
}
function K(e) {
  const t = e.trim();
  return D.test(L(t)) ? null : t;
}
function Q(e) {
  const t = L(e.trim());
  return /^data:image\/(png|jpe?g|gif|webp|avif);/i.test(t) ? e.trim() : D.test(t) ? null : e.trim();
}
function S(e, t = {}) {
  if (typeof e != "string") return "";
  let o = z(e);
  const a = [];
  return o = o.replace(/`([^`]+)`/g, (n, r) => (a.push(r), `${a.length - 1}`)), o = o.replace(
    /!\[([^\]]*)\]\(([^\s)]+)\)/g,
    (n, r, i) => {
      const s = Q(i);
      return s ? `<img class="ot-inline-img" src="${s}" alt="${r}">` : n;
    }
  ), o = o.replace(
    /\[([^\]]+)\]\(([^\s)]+)\)/g,
    (n, r, i) => {
      const s = K(i);
      if (!s) return n;
      const c = /^(https?:)?\/\//i.test(s) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${s}"${c}>${r}</a>`;
    }
  ), o = o.replace(/\*\*([^\s*][^*]*?[^\s*]|[^\s*])\*\*/g, "<strong>$1</strong>"), o = o.replace(/(^|[^*])\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*/g, "$1<em>$2</em>"), o = o.replace(/~~([^~]+)~~/g, "<s>$1</s>"), o = o.replace(/(\d+)/g, (n, r) => `<code>${a[Number(r)]}</code>`), t.breaks !== !1 && (o = o.replace(/\r?\n/g, "<br>")), o;
}
const M = /^(#{1,6})\s+(.*)$/, q = /^\s*(`{3,}|~{3,})\s*([\w+-]*)\s*$/, _ = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/, A = /^\s*[-*+]\s+(.*)$/, b = /^\s*(\d+)\.\s+(.*)$/, w = /^\s*>\s?(.*)$/, O = (e) => S(e, { breaks: !1 });
function F(e) {
  if (typeof e != "string" || e === "") return "";
  const t = e.replace(/\r\n?/g, `
`).split(`
`), o = [];
  let a = [];
  const n = () => {
    a.length !== 0 && (o.push(`<p class="ot-content">${O(a.join(`
`)).replace(/\n/g, "<br>")}</p>`), a = []);
  };
  for (let r = 0; r < t.length; r += 1) {
    const i = t[r], s = q.exec(i);
    if (s) {
      n();
      const c = s[1][0], d = s[2], u = [];
      for (r += 1; r < t.length && !new RegExp(`^\\s*${c}{3,}\\s*$`).test(t[r]); )
        u.push(t[r]), r += 1;
      const l = d ? ` class="language-${z(d)}"` : "";
      o.push(`<pre class="ot-code"><code${l}>${z(u.join(`
`))}</code></pre>`);
      continue;
    }
    if (_.test(i)) {
      n(), o.push('<hr class="ot-divider">');
      continue;
    }
    const p = M.exec(i);
    if (p) {
      n();
      const c = p[1].length;
      o.push(`<h${c} class="ot-heading ot-heading--${c}">${O(p[2])}</h${c}>`);
      continue;
    }
    if (w.test(i)) {
      n();
      const c = [];
      for (; r < t.length && w.test(t[r]); )
        c.push(w.exec(t[r])[1]), r += 1;
      r -= 1, o.push(`<blockquote class="ot-quote">${F(c.join(`
`))}</blockquote>`);
      continue;
    }
    if (A.test(i) || b.test(i)) {
      n();
      const c = b.test(i), d = [];
      for (; r < t.length; ) {
        const x = t[r], g = c ? b.exec(x) : A.exec(x);
        if (!g) break;
        d.push(`<li>${O(c ? g[2] : g[1])}</li>`), r += 1;
      }
      r -= 1;
      const u = c ? "ol" : "ul", l = c ? Number(b.exec(i)[1]) : 1, h = c && l !== 1 ? ` start="${l}"` : "";
      o.push(`<${u} class="ot-list"${h}>${d.join("")}</${u}>`);
      continue;
    }
    if (i.trim() === "") {
      n();
      continue;
    }
    a.push(i);
  }
  return n(), o.join("");
}
function G(e) {
  return typeof e != "string" ? !1 : e.split(/\r?\n/).some(
    (t) => M.test(t) || q.test(t) || _.test(t) || A.test(t) || b.test(t) || w.test(t)
  );
}
function it(e, t) {
  return e && typeof e == "object" && "blocks" in e && Array.isArray(e.blocks) ? e.blocks.map((o) => {
    switch (o.type) {
      case "text":
        return { type: "text", value: t(o.value) };
      case "list":
        return { ...o, items: o.items.map((a) => t(a)) };
      case "input":
        return {
          ...o,
          ...o.label !== void 0 ? { label: t(o.label) } : {},
          ...o.placeholder !== void 0 ? { placeholder: t(o.placeholder) } : {}
        };
      case "choice":
        return {
          ...o,
          ...o.label !== void 0 ? { label: t(o.label) } : {},
          options: o.options.map((a) => typeof a == "string" ? { label: a, value: a } : { label: t(a.label), value: a.value })
        };
      case "button":
        return { ...o, label: t(o.label) };
      default:
        return o;
    }
  }) : [{ type: "text", value: t(e) }];
}
function at(e) {
  return e.map((t) => {
    switch (t.type) {
      case "text":
        return typeof t.value == "string" ? t.value : "";
      case "list":
        return t.items.filter((o) => typeof o == "string").join(", ");
      case "code":
        return t.value;
      case "image":
        return t.alt;
      case "input":
      case "choice":
      case "button":
        return typeof t.label == "string" ? t.label : "";
      default:
        return "";
    }
  }).filter(Boolean).join(" ");
}
let y = 0;
function st(e, t = {}) {
  const o = t.doc ?? document, a = o.createDocumentFragment();
  for (const n of e)
    switch (n.type) {
      case "text": {
        const r = typeof n.value == "string" ? n.value : "";
        if (t.markdown !== "inline" && G(r)) {
          const i = o.createElement("div");
          i.className = "ot-prose", i.innerHTML = F(r), a.appendChild(i);
        } else {
          const i = o.createElement("p");
          i.className = "ot-content", i.innerHTML = S(r), a.appendChild(i);
        }
        break;
      }
      case "image": {
        const r = o.createElement("img");
        r.className = "ot-media ot-media-image", r.src = n.src, r.alt = n.alt, r.loading = "lazy", n.width && (r.width = n.width), n.height && (r.height = n.height), a.appendChild(r);
        break;
      }
      case "video": {
        const r = o.createElement("video");
        r.className = "ot-media ot-media-video", r.src = n.src, n.poster && (r.poster = n.poster), r.controls = n.controls ?? !0, r.loop = n.loop ?? !1, r.muted = n.muted ?? n.autoplay ?? !1, r.playsInline = !0, n.autoplay && (r.autoplay = !0, r.muted = !0), a.appendChild(r);
        break;
      }
      case "list": {
        const r = o.createElement(n.ordered ? "ol" : "ul");
        r.className = "ot-list";
        for (const i of n.items) {
          const s = o.createElement("li");
          s.innerHTML = S(typeof i == "string" ? i : ""), r.appendChild(s);
        }
        a.appendChild(r);
        break;
      }
      case "code": {
        const r = o.createElement("pre");
        r.className = "ot-code";
        const i = o.createElement("code");
        n.lang && (i.dataset.lang = n.lang), i.textContent = n.value, r.appendChild(i), a.appendChild(r);
        break;
      }
      case "divider": {
        const r = o.createElement("hr");
        r.className = "ot-divider", a.appendChild(r);
        break;
      }
      case "html": {
        const r = o.createElement("div");
        r.className = "ot-html", r.innerHTML = t.allowHtml ? n.value : z(n.value), a.appendChild(r);
        break;
      }
      case "input": {
        const r = t.interactive;
        if (!r) break;
        y += 1;
        const i = `ot-field-${y}`, s = typeof n.label == "string" && n.label !== "", p = o.createElement("div");
        if (p.className = "ot-field", s) {
          const u = o.createElement("label");
          u.className = "ot-field-label", u.htmlFor = i, u.textContent = n.label, p.appendChild(u);
        }
        const c = n.multiline ? o.createElement("textarea") : o.createElement("input");
        c.className = "ot-input", c.id = i, c.name = n.name, c.dataset.otName = n.name, n.multiline || (c.type = n.inputType ?? "text"), typeof n.placeholder == "string" && (c.placeholder = n.placeholder), s || c.setAttribute(
          "aria-label",
          typeof n.placeholder == "string" && n.placeholder ? n.placeholder : n.name
        );
        const d = r.getValue(n.name);
        d != null && (c.value = String(d)), c.addEventListener("input", () => {
          const u = c.value, l = n.inputType === "number" && u.trim() !== "" && Number.isFinite(Number(u)) ? Number(u) : u;
          r.setValue(n.name, l, "input");
        }), p.appendChild(c), a.appendChild(p);
        break;
      }
      case "choice": {
        const r = t.interactive;
        if (!r) break;
        const i = o.createElement("div");
        if (i.className = "ot-choice", i.dataset.otName = n.name, i.setAttribute("role", n.multiple ? "group" : "radiogroup"), typeof n.label == "string" && n.label) {
          const l = o.createElement("div");
          l.className = "ot-field-label", l.textContent = n.label, y += 1, l.id = `ot-field-${y}`, i.setAttribute("aria-labelledby", l.id), i.appendChild(l);
        } else
          i.setAttribute("aria-label", n.name);
        const s = n.options.map((l) => typeof l == "string" ? { label: l, value: l } : l), p = () => {
          const l = r.getValue(n.name);
          return n.multiple ? Array.isArray(l) ? l : [] : l === void 0 ? [] : [l];
        }, c = [], d = () => {
          const l = p();
          c.forEach((h, x) => {
            const g = l.includes(s[x].value);
            h.classList.toggle("ot-choice-option--selected", g), h.setAttribute("aria-checked", String(g));
          });
        }, u = o.createElement("div");
        u.className = "ot-choice-options", s.forEach((l) => {
          const h = o.createElement("button");
          h.type = "button", h.className = "ot-choice-option", h.setAttribute("role", n.multiple ? "checkbox" : "radio"), h.textContent = typeof l.label == "string" ? l.label : String(l.value), h.addEventListener("click", () => {
            if (n.multiple) {
              const x = p(), g = x.includes(l.value) ? x.filter((I) => I !== l.value) : [...x, l.value];
              r.setValue(n.name, g, "choice");
            } else
              r.setValue(n.name, l.value, "choice");
            d();
          }), c.push(h), u.appendChild(h);
        }), d(), i.appendChild(u), a.appendChild(i);
        break;
      }
      case "button": {
        const r = t.interactive;
        if (!r) break;
        const i = typeof n.label == "string" ? n.label : "", s = o.createElement("button");
        s.type = "button", s.className = `ot-btn ot-block-btn ${n.variant === "primary" ? "ot-btn-primary" : "ot-btn-ghost"}`, s.textContent = i, s.addEventListener("click", () => r.runAction(n.action, i)), a.appendChild(s);
        break;
      }
    }
  return a;
}
const X = "button, a, [role], label, summary, h1, h2, h3, h4, h5, h6, p, li, td, th, span, div";
function Y(e, t = document) {
  try {
    return t.querySelector(e);
  } catch {
    return null;
  }
}
function m(e, t = document) {
  try {
    return Array.from(t.querySelectorAll(e));
  } catch {
    return [];
  }
}
function H(e, t = document) {
  const o = m(e, t), a = /* @__PURE__ */ new Set(), n = (r) => {
    for (const i of m("*", r)) {
      const s = i.shadowRoot;
      !s || a.has(s) || (a.add(s), o.push(...m(e, s)), n(s));
    }
  };
  return n(t), [...new Set(o)];
}
function k(e) {
  const t = e.getBoundingClientRect();
  if (t.width === 0 && t.height === 0) return !1;
  const o = e.ownerDocument?.defaultView;
  if (!o) return !0;
  const a = o.getComputedStyle(e);
  return a.visibility !== "hidden" && a.display !== "none" && a.opacity !== "0";
}
function $(e) {
  return e.replace(/\s+/g, " ").trim().toLowerCase();
}
function T(e, t, o) {
  const a = $(e);
  if (!a) return null;
  const r = (t ?? m(X, o)).filter((p) => $(p.textContent ?? "").includes(a));
  if (r.length === 0) return null;
  const i = r.filter((p) => $(p.textContent ?? "") === a);
  return (i.length ? i : r).reduce((p, c) => p.contains(c) ? c : p);
}
function N(e) {
  if (!e.iframe) return { doc: document, offset: { x: 0, y: 0 } };
  const t = Y(e.iframe);
  if (!t) return null;
  try {
    const o = t.contentDocument;
    if (!o) return null;
    const a = t.getBoundingClientRect();
    return { doc: o, offset: { x: a.x, y: a.y } };
  } catch {
    return null;
  }
}
function E(e) {
  const t = N(e);
  if (!t) return null;
  const { doc: o, offset: a } = t, n = e.selector ? Array.isArray(e.selector) ? e.selector : [e.selector] : [], r = (i) => {
    const s = e.visible ? i.filter(k) : i;
    return s.length === 0 ? null : s[e.index ?? 0] ?? null;
  };
  for (const i of n) {
    const s = e.shadow ? H(i, o) : m(i, o);
    if (e.text) {
      const c = T(e.text, e.visible ? s.filter(k) : s, o);
      if (c) return { element: c, doc: o, frameOffset: a, matched: i };
      continue;
    }
    const p = r(s);
    if (p) return { element: p, doc: o, frameOffset: a, matched: i };
  }
  if (n.length === 0 && e.text) {
    const i = T(e.text, null, o);
    if (i && (!e.visible || k(i)))
      return { element: i, doc: o, frameOffset: a, matched: `text:${e.text}` };
  }
  return null;
}
function ct(e) {
  if (!e.all) {
    const i = E(e);
    return i ? [i] : [];
  }
  const t = N(e);
  if (!t) return [];
  const { doc: o, offset: a } = t, n = e.selector ? Array.isArray(e.selector) ? e.selector : [e.selector] : [];
  for (const i of n) {
    const s = e.shadow ? H(i, o) : m(i, o), p = e.visible ? s.filter(k) : s;
    if (p.length > 0)
      return p.map((c) => ({ element: c, doc: o, frameOffset: a, matched: i }));
  }
  const r = E(e);
  return r ? [r] : [];
}
function lt(e) {
  const t = [];
  return e.selector && t.push(Array.isArray(e.selector) ? e.selector.join(" | ") : e.selector), e.text && t.push(`text "${e.text}"`), e.iframe && t.push(`in iframe ${e.iframe}`), t.join(" + ") || "(no selector)";
}
function Z(e, t = 5e3) {
  return new Promise((o) => {
    const a = E(e);
    if (a) {
      o(a);
      return;
    }
    let n = !1, r = null;
    const i = (d) => {
      n || (n = !0, r?.disconnect(), clearInterval(p), clearTimeout(c), o(d));
    }, s = () => {
      const d = E(e);
      d && i(d);
    };
    try {
      r = new MutationObserver(s);
      const d = e.iframe ? N(e)?.doc.documentElement ?? document.documentElement : document.documentElement;
      r.observe(d, { childList: !0, subtree: !0, attributes: !0 });
    } catch {
    }
    const p = setInterval(s, 100), c = setTimeout(() => i(null), t);
  });
}
function pt(e, t = 5e3) {
  return Z({ selector: e }, t).then((o) => o?.element ?? null);
}
const J = 500, tt = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]), j = {
  includes: (e, t) => typeof e == "string" ? e.includes(String(t[0])) : Array.isArray(e) ? e.includes(t[0]) : !1,
  startsWith: (e, t) => typeof e == "string" ? e.startsWith(String(t[0])) : !1,
  endsWith: (e, t) => typeof e == "string" ? e.endsWith(String(t[0])) : !1,
  toLowerCase: (e) => typeof e == "string" ? e.toLowerCase() : e,
  toUpperCase: (e) => typeof e == "string" ? e.toUpperCase() : e,
  trim: (e) => typeof e == "string" ? e.trim() : e,
  indexOf: (e, t) => typeof e == "string" ? e.indexOf(String(t[0])) : Array.isArray(e) ? e.indexOf(t[0]) : -1,
  /** `value.matches('^pro')` — regex test against the resolved string. */
  matches: (e, t) => {
    if (typeof e != "string") return !1;
    try {
      return new RegExp(String(t[0])).test(e);
    } catch {
      return !1;
    }
  }
}, et = [
  "===",
  "!==",
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "<",
  ">",
  "!",
  "(",
  ")",
  "[",
  "]",
  ",",
  "+",
  "-",
  "*",
  "/",
  "%",
  "?",
  ":"
];
function U(e) {
  const t = [];
  let o = 0;
  for (; o < e.length; ) {
    const a = e.slice(o);
    if (/^\s/.test(a)) {
      o += 1;
      continue;
    }
    const n = et.find((i) => a.startsWith(i));
    if (n) {
      t.push({ t: "op", v: n }), o += n.length;
      continue;
    }
    if (a[0] === ".") {
      t.push({ t: "dot" }), o += 1;
      continue;
    }
    let r = a.match(/^'((?:[^'\\]|\\.)*)'/) ?? a.match(/^"((?:[^"\\]|\\.)*)"/);
    if (r) {
      t.push({ t: "str", v: r[1].replace(/\\(.)/g, "$1") }), o += r[0].length;
      continue;
    }
    if (r = a.match(/^\d+(\.\d+)?/), r) {
      t.push({ t: "num", v: Number(r[0]) }), o += r[0].length;
      continue;
    }
    if (r = a.match(/^(true|false)\b/), r) {
      t.push({ t: "bool", v: r[1] === "true" }), o += r[0].length;
      continue;
    }
    if (r = a.match(/^null\b/), r) {
      t.push({ t: "null" }), o += r[0].length;
      continue;
    }
    if (r = a.match(/^undefined\b/), r) {
      t.push({ t: "undef" }), o += r[0].length;
      continue;
    }
    if (r = a.match(/^[A-Za-z_$][\w$]*/), r) {
      t.push({ t: "ident", v: r[0] }), o += r[0].length;
      continue;
    }
    throw new Error(`Unexpected character "${a[0]}" at ${o}`);
  }
  return t;
}
function C(e, t) {
  if (e != null && !(typeof t == "string" && tt.has(t))) {
    if (typeof e == "string")
      return t === "length" ? e.length : typeof t == "number" ? e[t] : void 0;
    if (Array.isArray(e))
      return t === "length" ? e.length : e[t];
    if (typeof e == "object")
      return e[String(t)];
  }
}
function R(e, t) {
  return e === t ? !0 : e == null ? t == null : typeof e == "number" || typeof t == "number" ? Number(e) === Number(t) : String(e) === String(t);
}
function f(e) {
  return typeof e == "number" ? e : Number(e);
}
class B {
  constructor(t, o) {
    v(this, "pos", 0);
    v(this, "tokens");
    v(this, "ctx");
    this.tokens = t, this.ctx = o;
  }
  parse() {
    const t = this.ternary();
    if (this.pos !== this.tokens.length) throw new Error("Trailing tokens");
    return t;
  }
  peek() {
    return this.tokens[this.pos];
  }
  isOp(t) {
    const o = this.peek();
    return !!o && o.t === "op" && o.v === t;
  }
  eatOp(t) {
    return this.isOp(t) ? (this.pos += 1, !0) : !1;
  }
  expectOp(t) {
    if (!this.eatOp(t)) throw new Error(`Expected "${t}"`);
  }
  ternary() {
    const t = this.orExpr();
    if (!this.eatOp("?")) return t;
    const o = this.ternary();
    this.expectOp(":");
    const a = this.ternary();
    return t ? o : a;
  }
  orExpr() {
    let t = this.andExpr();
    for (; this.eatOp("||"); ) {
      const o = this.andExpr();
      t = t || o;
    }
    return t;
  }
  andExpr() {
    let t = this.equality();
    for (; this.eatOp("&&"); ) {
      const o = this.equality();
      t = t && o;
    }
    return t;
  }
  equality() {
    let t = this.relational();
    for (; ; ) {
      if (this.eatOp("===")) {
        t = t === this.relational();
        continue;
      }
      if (this.eatOp("!==")) {
        t = t !== this.relational();
        continue;
      }
      if (this.eatOp("==")) {
        t = R(t, this.relational());
        continue;
      }
      if (this.eatOp("!=")) {
        t = !R(t, this.relational());
        continue;
      }
      return t;
    }
  }
  relational() {
    let t = this.additive();
    for (; ; ) {
      if (this.eatOp("<=")) {
        t = f(t) <= f(this.additive());
        continue;
      }
      if (this.eatOp(">=")) {
        t = f(t) >= f(this.additive());
        continue;
      }
      if (this.eatOp("<")) {
        t = f(t) < f(this.additive());
        continue;
      }
      if (this.eatOp(">")) {
        t = f(t) > f(this.additive());
        continue;
      }
      return t;
    }
  }
  additive() {
    let t = this.multiplicative();
    for (; ; ) {
      if (this.eatOp("+")) {
        const o = this.multiplicative();
        t = typeof t == "string" || typeof o == "string" ? String(t) + String(o) : f(t) + f(o);
        continue;
      }
      if (this.eatOp("-")) {
        t = f(t) - f(this.multiplicative());
        continue;
      }
      return t;
    }
  }
  multiplicative() {
    let t = this.unary();
    for (; ; ) {
      if (this.eatOp("*")) {
        t = f(t) * f(this.unary());
        continue;
      }
      if (this.eatOp("/")) {
        t = f(t) / f(this.unary());
        continue;
      }
      if (this.eatOp("%")) {
        t = f(t) % f(this.unary());
        continue;
      }
      return t;
    }
  }
  unary() {
    return this.eatOp("!") ? !this.unary() : this.eatOp("-") ? -f(this.unary()) : this.postfix();
  }
  postfix() {
    let t = this.primary();
    for (; ; ) {
      if (this.peek()?.t === "dot") {
        this.pos += 1;
        const o = this.peek();
        if (!o || o.t !== "ident") throw new Error('Expected identifier after "."');
        if (this.pos += 1, this.isOp("(")) {
          this.pos += 1;
          const a = [];
          if (!this.isOp(")"))
            do
              a.push(this.ternary());
            while (this.eatOp(","));
          this.expectOp(")");
          const n = Object.prototype.hasOwnProperty.call(j, o.v) ? j[o.v] : void 0;
          if (typeof n != "function") throw new Error(`Method "${o.v}" is not allowed`);
          t = n(t, a);
          continue;
        }
        t = C(t, o.v);
        continue;
      }
      if (this.eatOp("[")) {
        const o = this.ternary();
        this.expectOp("]"), t = C(t, typeof o == "number" ? o : String(o));
        continue;
      }
      return t;
    }
  }
  primary() {
    const t = this.peek();
    if (!t) throw new Error("Unexpected end of expression");
    if (t.t === "op" && t.v === "(") {
      this.pos += 1;
      const o = this.ternary();
      return this.expectOp(")"), o;
    }
    if (t.t === "op" && t.v === "[") {
      this.pos += 1;
      const o = [];
      if (!this.isOp("]"))
        do
          o.push(this.ternary());
        while (this.eatOp(","));
      return this.expectOp("]"), o;
    }
    switch (this.pos += 1, t.t) {
      case "str":
        return t.v;
      case "num":
        return t.v;
      case "bool":
        return t.v;
      case "null":
        return null;
      case "undef":
        return;
      case "ident":
        return C(this.ctx, t.v);
      default:
        throw new Error("Unexpected token");
    }
  }
}
function ot(e, t, o = {}) {
  try {
    if (typeof e != "string") return;
    if (e.length > (o.maxLength ?? J)) {
      o.onError?.("expression exceeds the maximum length", e);
      return;
    }
    return new B(U(e), t).parse();
  } catch (a) {
    o.onError?.(a instanceof Error ? a.message : "invalid expression", e);
    return;
  }
}
function dt(e, t, o = {}) {
  return !!ot(e, t, o);
}
function ut(e) {
  try {
    return new B(U(e), {}).parse(), { ok: !0 };
  } catch (t) {
    return { ok: !1, message: t instanceof Error ? t.message : "invalid expression" };
  }
}
export {
  nt as C,
  ot as a,
  at as b,
  ut as c,
  lt as d,
  z as e,
  dt as f,
  S as g,
  G as h,
  k as i,
  F as j,
  E as k,
  ct as l,
  Z as m,
  it as n,
  H as q,
  st as r,
  Y as s,
  pt as w
};
//# sourceMappingURL=safeEval.es.js.map
