var hi=Object.defineProperty;var ui=(S,_,X)=>_ in S?hi(S,_,{enumerable:!0,configurable:!0,writable:!0,value:X}):S[_]=X;var g=(S,_,X)=>ui(S,typeof _!="symbol"?_+"":_,X);(function(S){"use strict";const _=`
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
`.trim();let X=0;class wt{constructor(t,e={}){g(this,"root");g(this,"host");g(this,"shadow",null);g(this,"svg");g(this,"dimRect");g(this,"mask");g(this,"hole");g(this,"holes",[]);g(this,"ring");g(this,"rings",[]);g(this,"shield");g(this,"panels",[]);g(this,"current",null);g(this,"currentAll",[]);g(this,"interaction","free");g(this,"opts");X+=1;const n=`ot-mask-${X}`;if(this.opts=e,this.root=document.createElement("div"),this.root.className="ot-root",this.root.style.setProperty("--ot-z",String(t)),this.root.setAttribute("data-opentutorial",""),e.dir&&this.root.setAttribute("dir",e.dir),e.isolate){this.host=document.createElement("div"),this.host.setAttribute("data-opentutorial-host",""),this.host.style.cssText="position:fixed;inset:0;pointer-events:none;",this.host.style.zIndex=String(t);try{this.shadow=this.host.attachShadow({mode:"open"});const c=document.createElement("style");c.textContent=_,this.shadow.appendChild(c),this.shadow.appendChild(this.root)}catch{this.shadow=null,this.host=this.root}}else this.host=this.root;const s="http://www.w3.org/2000/svg";this.svg=document.createElementNS(s,"svg"),this.svg.setAttribute("class","ot-backdrop"),this.svg.setAttribute("width","100%"),this.svg.setAttribute("height","100%"),this.svg.setAttribute("aria-hidden","true");const o=document.createElementNS(s,"defs"),r=document.createElementNS(s,"mask");r.setAttribute("id",n);const a=document.createElementNS(s,"rect");a.setAttribute("x","0"),a.setAttribute("y","0"),a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("fill","white"),this.mask=r,this.hole=this.addHole(),r.appendChild(a),r.appendChild(this.hole),o.appendChild(r),this.dimRect=document.createElementNS(s,"rect"),this.dimRect.setAttribute("class","ot-dim"),this.dimRect.setAttribute("x","0"),this.dimRect.setAttribute("y","0"),this.dimRect.setAttribute("width","100%"),this.dimRect.setAttribute("height","100%"),this.dimRect.setAttribute("mask",`url(#${n})`),this.svg.appendChild(o),this.svg.appendChild(this.dimRect),this.ring=document.createElement("div"),this.ring.className="ot-ring",this.ring.style.opacity="0",this.rings.push(this.ring),this.shield=document.createElement("div"),this.shield.className="ot-shield",this.shield.style.display="none";for(let c=0;c<4;c+=1){const l=document.createElement("div");l.className="ot-shield-panel",this.panels.push(l),this.shield.appendChild(l)}this.root.appendChild(this.svg),this.root.appendChild(this.ring),this.root.appendChild(this.shield),this.svg.style.display="none"}addHole(){const t=document.createElementNS("http://www.w3.org/2000/svg","rect");return t.setAttribute("fill","black"),t.setAttribute("rx","12"),t.setAttribute("x","-9999"),t.setAttribute("y","-9999"),t.setAttribute("width","0"),t.setAttribute("height","0"),this.holes.push(t),this.mask&&this.mask.appendChild(t),t}addRing(){const t=document.createElement("div");return t.className="ot-ring",t.style.opacity="0",this.rings.push(t),this.root.appendChild(t),t}setHole(t,e,n=this.hole){n.setAttribute("x",String(t.x-e)),n.setAttribute("y",String(t.y-e)),n.setAttribute("width",String(Math.max(0,t.width+e*2))),n.setAttribute("height",String(Math.max(0,t.height+e*2)))}static union(t){const e=Math.min(...t.map(r=>r.x)),n=Math.min(...t.map(r=>r.y)),s=Math.max(...t.map(r=>r.x+r.width)),o=Math.max(...t.map(r=>r.y+r.height));return{x:e,y:n,width:s-e,height:o-n}}updateSpotlight(t,e=8,n=12){const s=t===null?[]:Array.isArray(t)?t:[t];if(this.currentAll=s,s.length===0){this.current=null;for(const o of this.holes)this.setHole({x:-9999,y:-9999,width:0,height:0},0,o);for(const o of this.rings)o.style.opacity="0";this.svg.style.display="none",this.applyShield();return}for(this.current={...wt.union(s),padding:e,radius:n},this.svg.style.display="";this.holes.length<s.length;)this.addHole();for(;this.rings.length<s.length;)this.addRing();s.forEach((o,r)=>{const a=this.holes[r];this.setHole(o,e,a),a.setAttribute("rx",String(n));const c=this.rings[r].style;c.opacity="1",c.left=`${o.x-e}px`,c.top=`${o.y-e}px`,c.width=`${o.width+e*2}px`,c.height=`${o.height+e*2}px`,c.borderRadius=`${n}px`});for(let o=s.length;o<this.holes.length;o+=1)this.setHole({x:-9999,y:-9999,width:0,height:0},0,this.holes[o]),this.rings[o].style.opacity="0";this.applyShield()}showBackdrop(){this.current=null,this.svg.style.display="",this.setHole({x:-9999,y:-9999,width:0,height:0},0),this.ring.style.opacity="0",this.applyShield()}setInteraction(t){this.interaction=t,this.applyShield()}applyShield(){if(this.interaction==="free"){this.shield.style.display="none";return}this.shield.style.display="";const t=window.innerWidth,e=window.innerHeight,n=this.interaction==="target-only"&&this.current?{x:this.current.x-this.current.padding,y:this.current.y-this.current.padding,width:this.current.width+this.current.padding*2,height:this.current.height+this.current.padding*2}:{x:t,y:e,width:0,height:0},[s,o,r,a]=this.panels,c=(l,u,f,h,k)=>{l.style.left=`${u}px`,l.style.top=`${f}px`,l.style.width=`${Math.max(0,h)}px`,l.style.height=`${Math.max(0,k)}px`};c(s,0,0,t,n.y),c(r,0,n.y+n.height,t,e-(n.y+n.height)),c(a,0,n.y,n.x,n.height),c(o,n.x+n.width,n.y,t-(n.x+n.width),n.height)}refresh(){this.current?this.updateSpotlight(this.currentAll.length>1?this.currentAll:this.current,this.current.padding,this.current.radius):this.applyShield()}getSpotlightRects(){return this.currentAll}mountPopover(t){this.root.appendChild(t)}setBackdropColor(t){this.dimRect.style.fill=t}setDir(t){this.root.setAttribute("dir",t)}attach(t){(t??this.opts.container??document.body).appendChild(this.host)}destroy(){this.host.remove()}}const Ce={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function pt(i){return i.replace(/[&<>"']/g,t=>Ce[t]??t)}const _t=/^(javascript|vbscript|data|file|blob)\s*:/i;function Ft(i){let t="";for(const e of i)e.charCodeAt(0)>32&&(t+=e);return t}function $e(i){const t=i.trim();return _t.test(Ft(t))?null:t}function Ie(i){const t=Ft(i.trim());return/^data:image\/(png|jpe?g|gif|webp|avif);/i.test(t)?i.trim():_t.test(t)?null:i.trim()}function Q(i,t={}){if(typeof i!="string")return"";let e=pt(i);const n=[];return e=e.replace(/`([^`]+)`/g,(s,o)=>(n.push(o),`${n.length-1}`)),e=e.replace(/!\[([^\]]*)\]\(([^\s)]+)\)/g,(s,o,r)=>{const a=Ie(r);return a?`<img class="ot-inline-img" src="${a}" alt="${o}">`:s}),e=e.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(s,o,r)=>{const a=$e(r);if(!a)return s;const l=/^(https?:)?\/\//i.test(a)?' target="_blank" rel="noopener noreferrer"':"";return`<a href="${a}"${l}>${o}</a>`}),e=e.replace(/\*\*([^\s*][^*]*?[^\s*]|[^\s*])\*\*/g,"<strong>$1</strong>"),e=e.replace(/(^|[^*])\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*/g,"$1<em>$2</em>"),e=e.replace(/~~([^~]+)~~/g,"<s>$1</s>"),e=e.replace(/(\d+)/g,(s,o)=>`<code>${n[Number(o)]}</code>`),t.breaks!==!1&&(e=e.replace(/\r?\n/g,"<br>")),e}const Wt=/^(#{1,6})\s+(.*)$/,Ut=/^\s*(`{3,}|~{3,})\s*([\w+-]*)\s*$/,Vt=/^\s*(-{3,}|\*{3,}|_{3,})\s*$/,kt=/^\s*[-*+]\s+(.*)$/,ct=/^\s*(\d+)\.\s+(.*)$/,ft=/^\s*>\s?(.*)$/,Et=i=>Q(i,{breaks:!1});function Gt(i){if(typeof i!="string"||i==="")return"";const t=i.replace(/\r\n?/g,`
`).split(`
`),e=[];let n=[];const s=()=>{n.length!==0&&(e.push(`<p class="ot-content">${Et(n.join(`
`)).replace(/\n/g,"<br>")}</p>`),n=[])};for(let o=0;o<t.length;o+=1){const r=t[o],a=Ut.exec(r);if(a){s();const l=a[1][0],u=a[2],f=[];for(o+=1;o<t.length&&!new RegExp(`^\\s*${l}{3,}\\s*$`).test(t[o]);)f.push(t[o]),o+=1;const h=u?` class="language-${pt(u)}"`:"";e.push(`<pre class="ot-code"><code${h}>${pt(f.join(`
`))}</code></pre>`);continue}if(Vt.test(r)){s(),e.push('<hr class="ot-divider">');continue}const c=Wt.exec(r);if(c){s();const l=c[1].length;e.push(`<h${l} class="ot-heading ot-heading--${l}">${Et(c[2])}</h${l}>`);continue}if(ft.test(r)){s();const l=[];for(;o<t.length&&ft.test(t[o]);)l.push(ft.exec(t[o])[1]),o+=1;o-=1,e.push(`<blockquote class="ot-quote">${Gt(l.join(`
`))}</blockquote>`);continue}if(kt.test(r)||ct.test(r)){s();const l=ct.test(r),u=[];for(;o<t.length;){const d=t[o],m=l?ct.exec(d):kt.exec(d);if(!m)break;u.push(`<li>${Et(l?m[2]:m[1])}</li>`),o+=1}o-=1;const f=l?"ol":"ul",h=l?Number(ct.exec(r)[1]):1,k=l&&h!==1?` start="${h}"`:"";e.push(`<${f} class="ot-list"${k}>${u.join("")}</${f}>`);continue}if(r.trim()===""){s();continue}n.push(r)}return s(),e.join("")}function Te(i){return typeof i!="string"?!1:i.split(/\r?\n/).some(t=>Wt.test(t)||Ut.test(t)||Vt.test(t)||kt.test(t)||ct.test(t)||ft.test(t))}function St(i,t){return i&&typeof i=="object"&&"blocks"in i&&Array.isArray(i.blocks)?i.blocks.map(e=>{switch(e.type){case"text":return{type:"text",value:t(e.value)};case"list":return{...e,items:e.items.map(n=>t(n))};case"input":return{...e,...e.label!==void 0?{label:t(e.label)}:{},...e.placeholder!==void 0?{placeholder:t(e.placeholder)}:{}};case"choice":return{...e,...e.label!==void 0?{label:t(e.label)}:{},options:e.options.map(n=>typeof n=="string"?{label:n,value:n}:{label:t(n.label),value:n.value})};case"button":return{...e,label:t(e.label)};default:return e}}):[{type:"text",value:t(i)}]}function Oe(i){return i.map(t=>{switch(t.type){case"text":return typeof t.value=="string"?t.value:"";case"list":return t.items.filter(e=>typeof e=="string").join(", ");case"code":return t.value;case"image":return t.alt;case"input":case"choice":case"button":return typeof t.label=="string"?t.label:"";default:return""}}).filter(Boolean).join(" ")}let mt=0;function At(i,t={}){const e=t.doc??document,n=e.createDocumentFragment();for(const s of i)switch(s.type){case"text":{const o=typeof s.value=="string"?s.value:"";if(t.markdown!=="inline"&&Te(o)){const r=e.createElement("div");r.className="ot-prose",r.innerHTML=Gt(o),n.appendChild(r)}else{const r=e.createElement("p");r.className="ot-content",r.innerHTML=Q(o),n.appendChild(r)}break}case"image":{const o=e.createElement("img");o.className="ot-media ot-media-image",o.src=s.src,o.alt=s.alt,o.loading="lazy",s.width&&(o.width=s.width),s.height&&(o.height=s.height),n.appendChild(o);break}case"video":{const o=e.createElement("video");o.className="ot-media ot-media-video",o.src=s.src,s.poster&&(o.poster=s.poster),o.controls=s.controls??!0,o.loop=s.loop??!1,o.muted=s.muted??s.autoplay??!1,o.playsInline=!0,s.autoplay&&(o.autoplay=!0,o.muted=!0),n.appendChild(o);break}case"list":{const o=e.createElement(s.ordered?"ol":"ul");o.className="ot-list";for(const r of s.items){const a=e.createElement("li");a.innerHTML=Q(typeof r=="string"?r:""),o.appendChild(a)}n.appendChild(o);break}case"code":{const o=e.createElement("pre");o.className="ot-code";const r=e.createElement("code");s.lang&&(r.dataset.lang=s.lang),r.textContent=s.value,o.appendChild(r),n.appendChild(o);break}case"divider":{const o=e.createElement("hr");o.className="ot-divider",n.appendChild(o);break}case"html":{const o=e.createElement("div");o.className="ot-html",o.innerHTML=t.allowHtml?s.value:pt(s.value),n.appendChild(o);break}case"input":{const o=t.interactive;if(!o)break;mt+=1;const r=`ot-field-${mt}`,a=typeof s.label=="string"&&s.label!=="",c=e.createElement("div");if(c.className="ot-field",a){const f=e.createElement("label");f.className="ot-field-label",f.htmlFor=r,f.textContent=s.label,c.appendChild(f)}const l=s.multiline?e.createElement("textarea"):e.createElement("input");l.className="ot-input",l.id=r,l.name=s.name,l.dataset.otName=s.name,s.multiline||(l.type=s.inputType??"text"),typeof s.placeholder=="string"&&(l.placeholder=s.placeholder),a||l.setAttribute("aria-label",typeof s.placeholder=="string"&&s.placeholder?s.placeholder:s.name);const u=o.getValue(s.name);u!=null&&(l.value=String(u)),l.addEventListener("input",()=>{const f=l.value,h=s.inputType==="number"&&f.trim()!==""&&Number.isFinite(Number(f))?Number(f):f;o.setValue(s.name,h,"input")}),c.appendChild(l),n.appendChild(c);break}case"choice":{const o=t.interactive;if(!o)break;const r=e.createElement("div");if(r.className="ot-choice",r.dataset.otName=s.name,r.setAttribute("role",s.multiple?"group":"radiogroup"),typeof s.label=="string"&&s.label){const h=e.createElement("div");h.className="ot-field-label",h.textContent=s.label,mt+=1,h.id=`ot-field-${mt}`,r.setAttribute("aria-labelledby",h.id),r.appendChild(h)}else r.setAttribute("aria-label",s.name);const a=s.options.map(h=>typeof h=="string"?{label:h,value:h}:h),c=()=>{const h=o.getValue(s.name);return s.multiple?Array.isArray(h)?h:[]:h===void 0?[]:[h]},l=[],u=()=>{const h=c();l.forEach((k,d)=>{const m=h.includes(a[d].value);k.classList.toggle("ot-choice-option--selected",m),k.setAttribute("aria-checked",String(m))})},f=e.createElement("div");f.className="ot-choice-options",a.forEach(h=>{const k=e.createElement("button");k.type="button",k.className="ot-choice-option",k.setAttribute("role",s.multiple?"checkbox":"radio"),k.textContent=typeof h.label=="string"?h.label:String(h.value),k.addEventListener("click",()=>{if(s.multiple){const d=c(),m=d.includes(h.value)?d.filter(p=>p!==h.value):[...d,h.value];o.setValue(s.name,m,"choice")}else o.setValue(s.name,h.value,"choice");u()}),l.push(k),f.appendChild(k)}),u(),r.appendChild(f),n.appendChild(r);break}case"button":{const o=t.interactive;if(!o)break;const r=typeof s.label=="string"?s.label:"",a=e.createElement("button");a.type="button",a.className=`ot-btn ot-block-btn ${s.variant==="primary"?"ot-btn-primary":"ot-btn-ghost"}`,a.textContent=r,a.addEventListener("click",()=>o.runAction(s.action,r)),n.appendChild(a);break}}return n}const Le=240,Ne=460,ze=.7,Me=56,Re=44,De=700,Be=14,H=10;function Pe(i){if(i==="auto"||i==="center")return{side:"auto",align:"center"};const[t,e]=i.split("-");return{side:t,align:e??"center"}}function qe(i){return{top:"bottom",bottom:"top",left:"right",right:"left"}[i]}function He(i){return i==="left"?"right":i==="right"?"left":i}class je{constructor(t,e="ltr",n={}){g(this,"el");g(this,"titleEl");g(this,"contentEl");g(this,"progressEl");g(this,"liveEl");g(this,"backBtn");g(this,"nextBtn");g(this,"skipBtn");g(this,"arrow");g(this,"lastSide",null);g(this,"cbs");g(this,"dir");g(this,"model",null);g(this,"detachSwipe",null);g(this,"detachDrag",null);g(this,"autoSize",!0);g(this,"dragged",!1);this.cbs=t,this.dir=e,this.autoSize=n.autoSize!==!1,this.el=document.createElement("div"),this.el.className="ot-popover",this.el.setAttribute("role","dialog"),this.el.tabIndex=-1,this.arrow=document.createElement("div"),this.arrow.className="ot-arrow";const s=document.createElement("div");s.className="ot-body",this.skipBtn=document.createElement("button"),this.skipBtn.type="button",this.skipBtn.className="ot-skip",this.skipBtn.setAttribute("aria-label","Close tour"),this.skipBtn.innerHTML="&times;",this.skipBtn.addEventListener("click",()=>this.cbs.onSkip()),this.titleEl=document.createElement("h2"),this.titleEl.className="ot-title",this.titleEl.id=`ot-title-${Math.random().toString(36).slice(2,8)}`,this.el.setAttribute("aria-labelledby",this.titleEl.id),this.contentEl=document.createElement("div"),this.contentEl.className="ot-content-wrap",this.progressEl=document.createElement("div"),this.progressEl.className="ot-dots",this.progressEl.setAttribute("aria-hidden","true"),this.liveEl=document.createElement("span"),this.liveEl.className="ot-sr-only",this.liveEl.setAttribute("aria-live","polite"),this.liveEl.setAttribute("aria-atomic","true"),this.backBtn=document.createElement("button"),this.backBtn.type="button",this.backBtn.className="ot-btn ot-btn-ghost",this.backBtn.addEventListener("click",()=>this.cbs.onPrev()),this.nextBtn=document.createElement("button"),this.nextBtn.type="button",this.nextBtn.className="ot-btn ot-btn-primary",this.nextBtn.addEventListener("click",()=>this.cbs.onNext());const o=document.createElement("div");o.className="ot-footer";const r=document.createElement("div");r.className="ot-btns",r.appendChild(this.backBtn),r.appendChild(this.nextBtn),o.appendChild(this.progressEl),o.appendChild(r),s.appendChild(this.skipBtn),s.appendChild(this.titleEl),s.appendChild(this.contentEl),s.appendChild(this.liveEl),s.appendChild(o),this.el.appendChild(this.arrow),this.el.appendChild(s),n.swipe!==!1&&this.installSwipe(),n.draggable&&this.installDrag()}installDrag(){this.el.classList.add("ot-popover--draggable");let t=0,e=0,n=0,s=0,o=!1;const r=l=>{if(!o)return;const u=this.el.ownerDocument?.defaultView??window,f=Math.max(H,u.innerWidth-this.el.offsetWidth-H),h=Math.max(H,u.innerHeight-this.el.offsetHeight-H),k=Math.min(Math.max(n+l.clientX-t,H),f),d=Math.min(Math.max(s+l.clientY-e,H),h);this.el.style.left=`${k}px`,this.el.style.top=`${d}px`,this.arrow.style.display="none",this.dragged=!0},a=()=>{o=!1,this.el.classList.remove("ot-popover--dragging"),window.removeEventListener("pointermove",r),window.removeEventListener("pointerup",a)},c=l=>{l.button===0&&((this.el.ownerDocument?.defaultView??window).innerWidth<=480||(o=!0,t=l.clientX,e=l.clientY,n=parseFloat(this.el.style.left)||0,s=parseFloat(this.el.style.top)||0,this.el.classList.add("ot-popover--dragging"),window.addEventListener("pointermove",r),window.addEventListener("pointerup",a),l.preventDefault()))};this.titleEl.addEventListener("pointerdown",c),this.detachDrag=()=>{this.titleEl.removeEventListener("pointerdown",c),a()}}isDragged(){return this.dragged}setNextDisabled(t){this.nextBtn.disabled=t,this.nextBtn.setAttribute("aria-disabled",String(t)),this.model&&(this.model={...this.model,nextDisabled:t})}contentHasFocus(){const e=this.el.getRootNode().activeElement??document.activeElement;return!!e&&this.contentEl.contains(e)}installSwipe(){let t=0,e=0,n=0,s=!1;const o=a=>{if(a.touches.length!==1){s=!1;return}const c=a.target;if(c?.closest("button, a, input, textarea, select, video, audio, [data-ot-no-swipe]")){s=!1;return}if(c&&this.isScrollableX(c)){s=!1;return}s=!0,t=a.touches[0].clientX,e=a.touches[0].clientY,n=Date.now()},r=a=>{if(!s)return;s=!1;const c=a.changedTouches[0];if(!c)return;const l=c.clientX-t,u=c.clientY-e;if(Date.now()-n>De||Math.abs(u)>Re||Math.abs(l)<Me)return;const f=this.dir==="rtl"?l>0:l<0,h=this.model;h&&(f?h.showNext&&!h.nextDisabled&&this.cbs.onNext():h.showBack&&h.canGoBack&&h.index>0&&this.cbs.onPrev())};this.el.addEventListener("touchstart",o,{passive:!0}),this.el.addEventListener("touchend",r,{passive:!0}),this.detachSwipe=()=>{this.el.removeEventListener("touchstart",o),this.el.removeEventListener("touchend",r)}}isScrollableX(t){let e=t;for(;e&&e!==this.el;){if(e.scrollWidth>e.clientWidth+1)return!0;e=e.parentElement}return!1}setDir(t){this.dir=t}render(t){this.model?.stepId!==t.stepId&&(this.dragged=!1),this.model=t,this.titleEl.textContent=t.title,this.contentEl.replaceChildren(At(t.blocks,{allowHtml:t.allowHtml,interactive:this.cbs.interactive})),this.liveEl.textContent=`${t.title}. Step ${t.index+1} of ${t.total}`,this.progressEl.replaceChildren();const e=!!this.cbs.onJump&&!!t.jumpable?.some(Boolean);e?this.progressEl.removeAttribute("aria-hidden"):this.progressEl.setAttribute("aria-hidden","true");for(let s=0;s<t.total;s+=1){const o=s===t.index;if(e&&t.jumpable?.[s]&&!o){const r=document.createElement("button");r.type="button",r.className="ot-dot ot-dot-jump",r.setAttribute("aria-label",`Go to step ${s+1}`),r.addEventListener("click",()=>this.cbs.onJump?.(s)),this.progressEl.appendChild(r)}else{const r=document.createElement("span");r.className=`ot-dot${o?" ot-dot-active":""}`,e&&r.setAttribute("aria-hidden","true"),this.progressEl.appendChild(r)}}const n=t.showBack&&t.canGoBack&&t.index>0;this.backBtn.style.display=n?"":"none",this.backBtn.textContent=t.labels.back,this.nextBtn.style.display=t.showNext?"":"none",this.nextBtn.textContent=t.isLast?t.labels.done:t.labels.next,this.nextBtn.disabled=!!t.nextDisabled,this.nextBtn.setAttribute("aria-disabled",String(!!t.nextDisabled)),this.skipBtn.style.display=t.skippable?"":"none",this.skipBtn.setAttribute("aria-label",t.labels.skip),this.el.setAttribute("aria-modal",t.modal?"true":"false"),this.el.classList.toggle("ot-popover--modal-step",t.modal),t.density?this.el.dataset.otDensity=t.density:delete this.el.dataset.otDensity,this.applyAutoSize()}applyAutoSize(){const t=this.el.ownerDocument?.defaultView??window,e=t.innerHeight,n=t.innerWidth,s=n<=480;if(this.el.style.maxHeight=`${Math.round(e*ze)}px`,!this.autoSize||s||this.model?.fixedWidth){this.el.style.width="";return}this.el.style.width="max-content";const o=this.el.offsetWidth;this.el.style.width="";const r=Math.min(Ne,n-H*2),a=Math.min(Le,r),c=Math.max(a,Math.min(o,r));this.el.style.width=`${Math.round(c)}px`}position(t,e,n){if(this.dragged)return;const s=window.innerWidth,o=window.innerHeight,r=this.el.offsetWidth,a=this.el.offsetHeight;if(!t||e==="center"){this.lastSide="modal",this.el.classList.add("ot-modal"),this.arrow.style.display="none",this.el.style.left=`${Math.max(H,(s-r)/2)}px`,this.el.style.top=`${Math.max(H,(o-a)/2)}px`;return}this.el.classList.remove("ot-modal"),this.arrow.style.display="";const c=Pe(e),l=this.dir==="rtl"?He(c.side):c.side,u=c.align,f=Be+n,h={top:t.y,bottom:o-(t.y+t.height),left:t.x,right:s-(t.x+t.width)};let d=l==="auto"?["bottom","right","top","left"].reduce((w,A)=>h[A]>h[w]?A:w,"bottom"):l;const m=v=>v==="top"||v==="bottom"?h[v]>=a+f:h[v]>=r+f;if(!m(d)){const v=qe(d);m(v)?d=v:d=Object.keys(h).reduce((w,A)=>h[w]>=h[A]?w:A)}let p=0,b=0;const y=(v,w,A)=>u==="start"?this.dir==="rtl"?v+w-A:v:u==="end"?this.dir==="rtl"?v:v+w-A:v+w/2-A/2;d==="top"||d==="bottom"?(p=y(t.x,t.width,r),b=d==="top"?t.y-a-f:t.y+t.height+f):(b=y(t.y,t.height,a),p=d==="left"?t.x-r-f:t.x+t.width+f),p=Math.min(Math.max(p,H),Math.max(H,s-r-H)),b=Math.min(Math.max(b,H),Math.max(H,o-a-H)),this.el.style.left=`${p}px`,this.el.style.top=`${b}px`,this.lastSide=d,this.positionArrow(d,t,p,b,r,a)}positionArrow(t,e,n,s,o,r){const a=this.arrow.style;a.top="",a.bottom="",a.left="",a.right="",this.arrow.dataset.side=t;const c=e.x+e.width/2,l=e.y+e.height/2;t==="top"?(a.bottom="-5px",a.left=`${Math.min(Math.max(c-n,16),Math.max(16,o-16))}px`):t==="bottom"?(a.top="-5px",a.left=`${Math.min(Math.max(c-n,16),Math.max(16,o-16))}px`):t==="left"?(a.right="-5px",a.top=`${Math.min(Math.max(l-s,16),Math.max(16,r-16))}px`):(a.left="-5px",a.top=`${Math.min(Math.max(l-s,16),Math.max(16,r-16))}px`)}getSide(){return this.lastSide}destroy(){this.detachSwipe?.(),this.detachSwipe=null,this.detachDrag?.(),this.detachDrag=null,this.el.remove()}}class _e{constructor(){g(this,"el");g(this,"beaconEl");g(this,"tooltipEl",null);g(this,"textEl",null);g(this,"dismissBtn",null);g(this,"lastRect",null);g(this,"hasTooltip",!1);g(this,"onDismiss",null);this.el=document.createElement("div"),this.el.className="ot-hotspot",this.beaconEl=document.createElement("button"),this.beaconEl.type="button",this.beaconEl.className="ot-beacon",this.beaconEl.addEventListener("click",()=>this.onDismiss?.()),this.el.appendChild(this.beaconEl)}render(t,e){this.lastRect=e,this.onDismiss=t.onDismiss??null,this.beaconEl.className=`ot-beacon ot-beacon--${t.display}`,this.el.style.left=`${e.x+e.width/2}px`,this.el.style.top=`${e.y+e.height/2}px`,this.el.style.pointerEvents="auto";const n=t.content?.trim()||"Show me";this.beaconEl.setAttribute("aria-label",n),t.display==="beacon"?(this.hasTooltip=!1,this.tooltipEl&&(this.tooltipEl.style.display="none"),this.beaconEl.title=t.content??""):(this.hasTooltip=!0,this.buildTooltip(t),this.positionTooltip(e))}buildTooltip(t){this.tooltipEl||(this.tooltipEl=document.createElement("div"),this.tooltipEl.className="ot-hotspot-tooltip",this.tooltipEl.setAttribute("role","status"),this.textEl=document.createElement("span"),this.textEl.className="ot-hotspot-text",this.tooltipEl.appendChild(this.textEl),this.el.appendChild(this.tooltipEl)),this.tooltipEl.style.display="flex",this.textEl&&(this.textEl.innerHTML=Q(t.content??"")),t.showDismiss||t.display==="hotspot"?(this.dismissBtn||(this.dismissBtn=document.createElement("button"),this.dismissBtn.type="button",this.dismissBtn.className="ot-hotspot-dismiss",this.dismissBtn.textContent="→",this.dismissBtn.setAttribute("aria-label","Next step"),this.dismissBtn.addEventListener("click",()=>this.onDismiss?.())),this.tooltipEl.appendChild(this.dismissBtn)):this.dismissBtn?.parentNode&&this.dismissBtn.remove()}positionTooltip(t){if(!this.tooltipEl)return;const e=window.innerWidth,n=this.tooltipEl.offsetWidth||200,s=t.x+t.width/2,o=e-(s+16),r=s-16;o>n?(this.tooltipEl.style.left="12px",this.tooltipEl.style.right="auto"):r>n?(this.tooltipEl.style.right="12px",this.tooltipEl.style.left="auto"):(this.tooltipEl.style.left=`${Math.max(8,-(s-8))}px`,this.tooltipEl.style.right="auto"),this.tooltipEl.style.top="16px"}reposition(t){this.lastRect&&(this.lastRect=t,this.el.style.left=`${t.x+t.width/2}px`,this.el.style.top=`${t.y+t.height/2}px`,this.hasTooltip&&this.positionTooltip(t))}focus(){this.beaconEl.focus({preventScroll:!0})}destroy(){this.onDismiss=null,this.el.remove()}}const Fe='button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';function We(i){if(!i)return!1;if(i.isContentEditable)return!0;const t=i.tagName;if(t==="TEXTAREA"||t==="SELECT")return!0;if(t!=="INPUT")return!1;const e=i.type;return!["button","submit","reset","checkbox","radio","file"].includes(e)}function Ue(i,t={}){const e=document.activeElement,n=t.trap!==!1,s=()=>Array.from(i.querySelectorAll(Fe)).filter(r=>r.getClientRects().length>0||r===document.activeElement),o=r=>{const a=i.getRootNode().activeElement??document.activeElement;if(r.key==="Escape"){t.onEscape?.(),r.stopPropagation();return}if(We(a))return;if(r.key==="ArrowRight"){t.onArrowNext?.(),r.preventDefault();return}if(r.key==="ArrowLeft"){t.onArrowPrev?.(),r.preventDefault();return}if(r.key==="Enter"&&a===i){t.onArrowNext?.(),r.preventDefault();return}if(r.key!=="Tab"||!n)return;const c=s();if(!c.length){r.preventDefault();return}const l=c[0],u=c[c.length-1];r.shiftKey&&(a===l||!i.contains(a))?(u.focus(),r.preventDefault()):!r.shiftKey&&a===u&&(l.focus(),r.preventDefault())};return i.addEventListener("keydown",o),t.autoFocus!==!1&&i.focus({preventScroll:!0}),()=>{i.removeEventListener("keydown",o);const r=document.activeElement;(!r||r===document.body||i.contains(r))&&e?.focus?.({preventScroll:!0})}}const Ve="button, a, [role], label, summary, h1, h2, h3, h4, h5, h6, p, li, td, th, span, div";function Ge(i,t=document){try{return t.querySelector(i)}catch{return null}}function st(i,t=document){try{return Array.from(t.querySelectorAll(i))}catch{return[]}}function Jt(i,t=document){const e=st(i,t),n=new Set,s=o=>{for(const r of st("*",o)){const a=r.shadowRoot;!a||n.has(a)||(n.add(a),e.push(...st(i,a)),s(a))}};return s(t),[...new Set(e)]}function gt(i){const t=i.getBoundingClientRect();if(t.width===0&&t.height===0)return!1;const e=i.ownerDocument?.defaultView;if(!e)return!0;const n=e.getComputedStyle(i);return n.visibility!=="hidden"&&n.display!=="none"&&n.opacity!=="0"}function Ct(i){return i.replace(/\s+/g," ").trim().toLowerCase()}function Kt(i,t,e){const n=Ct(i);if(!n)return null;const o=(t??st(Ve,e)).filter(c=>Ct(c.textContent??"").includes(n));if(o.length===0)return null;const r=o.filter(c=>Ct(c.textContent??"")===n);return(r.length?r:o).reduce((c,l)=>c.contains(l)?l:c)}function $t(i){if(!i.iframe)return{doc:document,offset:{x:0,y:0}};const t=Ge(i.iframe);if(!t)return null;try{const e=t.contentDocument;if(!e)return null;const n=t.getBoundingClientRect();return{doc:e,offset:{x:n.x,y:n.y}}}catch{return null}}function W(i){const t=$t(i);if(!t)return null;const{doc:e,offset:n}=t,s=i.selector?Array.isArray(i.selector)?i.selector:[i.selector]:[],o=r=>{const a=i.visible?r.filter(gt):r;return a.length===0?null:a[i.index??0]??null};for(const r of s){const a=i.shadow?Jt(r,e):st(r,e);if(i.text){const l=Kt(i.text,i.visible?a.filter(gt):a,e);if(l)return{element:l,doc:e,frameOffset:n,matched:r};continue}const c=o(a);if(c)return{element:c,doc:e,frameOffset:n,matched:r}}if(s.length===0&&i.text){const r=Kt(i.text,null,e);if(r&&(!i.visible||gt(r)))return{element:r,doc:e,frameOffset:n,matched:`text:${i.text}`}}return null}function Je(i){if(!i.all){const r=W(i);return r?[r]:[]}const t=$t(i);if(!t)return[];const{doc:e,offset:n}=t,s=i.selector?Array.isArray(i.selector)?i.selector:[i.selector]:[];for(const r of s){const a=i.shadow?Jt(r,e):st(r,e),c=i.visible?a.filter(gt):a;if(c.length>0)return c.map(l=>({element:l,doc:e,frameOffset:n,matched:r}))}const o=W(i);return o?[o]:[]}function Yt(i){const t=[];return i.selector&&t.push(Array.isArray(i.selector)?i.selector.join(" | "):i.selector),i.text&&t.push(`text "${i.text}"`),i.iframe&&t.push(`in iframe ${i.iframe}`),t.join(" + ")||"(no selector)"}function bt(i,t=5e3){return new Promise(e=>{const n=W(i);if(n){e(n);return}let s=!1,o=null;const r=u=>{s||(s=!0,o?.disconnect(),clearInterval(c),clearTimeout(l),e(u))},a=()=>{const u=W(i);u&&r(u)};try{o=new MutationObserver(a);const u=i.iframe?$t(i)?.doc.documentElement??document.documentElement:document.documentElement;o.observe(u,{childList:!0,subtree:!0,attributes:!0})}catch{}const c=setInterval(a,100),l=setTimeout(()=>r(null),t)})}const It="opentutorial:locationchange";let Xt=!1;function Ke(){if(Xt||typeof history>"u")return;Xt=!0;const i=()=>{try{window.dispatchEvent(new Event(It))}catch{}};for(const t of["pushState","replaceState"]){const e=history[t];typeof e=="function"&&(history[t]=function(...s){const o=e.apply(this,s);return i(),o})}}function Qt(){return typeof location>"u"?"":location.pathname+location.search+location.hash}function Zt(i,t,e=!1){if(!i)return!1;const n=t.split("#")[0];if(i.endsWith("*"))return n.startsWith(i.slice(0,-1));if(i.includes(":")){const o=i.split("/").map(r=>r.startsWith(":")?"[^/]+":r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("/");try{return new RegExp(`^${o}${e?"$":"(/|$|\\?)"}`).test(n)}catch{return!1}}const s=n.split("?")[0];return e?s===i:s.startsWith(i)}function te(i){return typeof window>"u"?()=>{}:(Ke(),window.addEventListener("popstate",i),window.addEventListener("hashchange",i),window.addEventListener(It,i),()=>{window.removeEventListener("popstate",i),window.removeEventListener("hashchange",i),window.removeEventListener(It,i)})}class Tt{constructor(){g(this,"map",new Map)}getItem(t){return this.map.get(t)??null}setItem(t,e){this.map.set(t,e)}removeItem(t){this.map.delete(t)}}function ee(){try{if(typeof localStorage<"u"){const i="__ot_probe__";return localStorage.setItem(i,"1"),localStorage.removeItem(i),localStorage}}catch{}return new Tt}function Ot(){return{v:2,tours:{},progress:{}}}class Lt{constructor(t,e="ot",n){g(this,"ready");g(this,"storage");g(this,"prefix");g(this,"userId");g(this,"root",Ot());g(this,"hydrated",!1);this.storage=t??ee(),this.prefix=e,this.userId=n,this.ready=this.hydrate()}key(){return this.userId?`${this.prefix}:u:${this.userId}`:`${this.prefix}:anon`}legacyKey(){return`${this.prefix}:tours`}setUser(t){return t===this.userId?this.ready:(this.userId=t,this.root=Ot(),this.hydrated=!1,this.hydrate())}getUser(){return this.userId}parse(t){if(typeof t!="string"||!t)return null;try{const e=JSON.parse(t);if(!e||typeof e!="object")return null;if(e.v===2)return{v:2,tours:e.tours??{},progress:e.progress??{},active:e.active};if(e.v===1)return{v:2,tours:e.tours??{},progress:{}}}catch{}return null}async hydrate(){try{const t=await Promise.resolve(this.storage.getItem(this.key())),e=this.parse(t);if(e){this.root=e,this.hydrated=!0;return}if(!this.userId){const n=this.parse(await Promise.resolve(this.storage.getItem(this.legacyKey())));if(n){this.root=n,this.hydrated=!0,this.save();try{this.storage.removeItem(this.legacyKey())}catch{}return}}}catch{}this.hydrated=!0}isHydrated(){return this.hydrated}save(){try{this.storage.setItem(this.key(),JSON.stringify(this.root))}catch{}}mark(t,e,n){const s=this.root.tours[t];this.root.tours[t]={status:e,version:n,at:Date.now(),shownCount:s?.shownCount??0,lastShownAt:s?.lastShownAt},delete this.root.progress[t],this.root.active?.tourId===t&&delete this.root.active,this.save()}markShown(t,e){const n=this.root.tours[t];this.root.tours[t]={status:n?.status??"skipped",version:n?.version??e,at:n?.at??0,shownCount:(n?.shownCount??0)+1,lastShownAt:Date.now()},this.save()}hasSeen(t,e){const n=this.root.tours[t];return!(!n||!n.at||e&&n.version!==e)}getStatus(t){const e=this.root.tours[t];return!e||!e.at?null:e.status}getRecord(t){return this.root.tours[t]??null}reset(t){if(!t){this.root=Ot(),this.save();return}delete this.root.tours[t],delete this.root.progress[t],this.save()}clearAllProgress(){this.root.progress={},this.save()}saveProgress(t,e,n){this.root.progress[t]={tourId:t,lastStepId:e,stepIndex:n,timestamp:Date.now()},this.save()}getProgress(t){return this.root.progress[t]??null}getProgressIfValid(t,e){const n=this.getProgress(t);return n?Date.now()-n.timestamp>e?(this.clearProgress(t),null):n:null}clearProgress(t){t in this.root.progress&&(delete this.root.progress[t],this.save())}setActive(t,e){this.root.active={tourId:t,stepId:e,at:Date.now()},this.save()}getActive(t=300*1e3){const e=this.root.active;return e?Date.now()-e.at>t?(this.clearActive(),null):e:null}clearActive(){this.root.active&&(delete this.root.active,this.save())}exportAll(){return JSON.parse(JSON.stringify(this.root))}importAll(t,e="replace"){const n=this.parse(typeof t=="string"?t:JSON.stringify(t));if(!n)return!1;if(e==="replace")this.root=n;else{for(const[s,o]of Object.entries(n.tours)){const r=this.root.tours[s];(!r||o.at>r.at)&&(this.root.tours[s]=o)}for(const[s,o]of Object.entries(n.progress)){const r=this.root.progress[s];(!r||o.timestamp>r.timestamp)&&(this.root.progress[s]=o)}}return this.save(),!0}}const Ye=500,Xe=new Set(["__proto__","constructor","prototype"]),ne={includes:(i,t)=>typeof i=="string"?i.includes(String(t[0])):Array.isArray(i)?i.includes(t[0]):!1,startsWith:(i,t)=>typeof i=="string"?i.startsWith(String(t[0])):!1,endsWith:(i,t)=>typeof i=="string"?i.endsWith(String(t[0])):!1,toLowerCase:i=>typeof i=="string"?i.toLowerCase():i,toUpperCase:i=>typeof i=="string"?i.toUpperCase():i,trim:i=>typeof i=="string"?i.trim():i,indexOf:(i,t)=>typeof i=="string"?i.indexOf(String(t[0])):Array.isArray(i)?i.indexOf(t[0]):-1,matches:(i,t)=>{if(typeof i!="string")return!1;try{return new RegExp(String(t[0])).test(i)}catch{return!1}}},Qe=["===","!==","==","!=","<=",">=","&&","||","<",">","!","(",")","[","]",",","+","-","*","/","%","?",":"];function ie(i){const t=[];let e=0;for(;e<i.length;){const n=i.slice(e);if(/^\s/.test(n)){e+=1;continue}const s=Qe.find(r=>n.startsWith(r));if(s){t.push({t:"op",v:s}),e+=s.length;continue}if(n[0]==="."){t.push({t:"dot"}),e+=1;continue}let o=n.match(/^'((?:[^'\\]|\\.)*)'/)??n.match(/^"((?:[^"\\]|\\.)*)"/);if(o){t.push({t:"str",v:o[1].replace(/\\(.)/g,"$1")}),e+=o[0].length;continue}if(o=n.match(/^\d+(\.\d+)?/),o){t.push({t:"num",v:Number(o[0])}),e+=o[0].length;continue}if(o=n.match(/^(true|false)\b/),o){t.push({t:"bool",v:o[1]==="true"}),e+=o[0].length;continue}if(o=n.match(/^null\b/),o){t.push({t:"null"}),e+=o[0].length;continue}if(o=n.match(/^undefined\b/),o){t.push({t:"undef"}),e+=o[0].length;continue}if(o=n.match(/^[A-Za-z_$][\w$]*/),o){t.push({t:"ident",v:o[0]}),e+=o[0].length;continue}throw new Error(`Unexpected character "${n[0]}" at ${e}`)}return t}function Nt(i,t){if(i!=null&&!(typeof t=="string"&&Xe.has(t))){if(typeof i=="string")return t==="length"?i.length:typeof t=="number"?i[t]:void 0;if(Array.isArray(i))return t==="length"?i.length:i[t];if(typeof i=="object")return i[String(t)]}}function se(i,t){return i===t?!0:i==null?t==null:typeof i=="number"||typeof t=="number"?Number(i)===Number(t):String(i)===String(t)}function B(i){return typeof i=="number"?i:Number(i)}class oe{constructor(t,e){g(this,"pos",0);g(this,"tokens");g(this,"ctx");this.tokens=t,this.ctx=e}parse(){const t=this.ternary();if(this.pos!==this.tokens.length)throw new Error("Trailing tokens");return t}peek(){return this.tokens[this.pos]}isOp(t){const e=this.peek();return!!e&&e.t==="op"&&e.v===t}eatOp(t){return this.isOp(t)?(this.pos+=1,!0):!1}expectOp(t){if(!this.eatOp(t))throw new Error(`Expected "${t}"`)}ternary(){const t=this.orExpr();if(!this.eatOp("?"))return t;const e=this.ternary();this.expectOp(":");const n=this.ternary();return t?e:n}orExpr(){let t=this.andExpr();for(;this.eatOp("||");){const e=this.andExpr();t=t||e}return t}andExpr(){let t=this.equality();for(;this.eatOp("&&");){const e=this.equality();t=t&&e}return t}equality(){let t=this.relational();for(;;){if(this.eatOp("===")){t=t===this.relational();continue}if(this.eatOp("!==")){t=t!==this.relational();continue}if(this.eatOp("==")){t=se(t,this.relational());continue}if(this.eatOp("!=")){t=!se(t,this.relational());continue}return t}}relational(){let t=this.additive();for(;;){if(this.eatOp("<=")){t=B(t)<=B(this.additive());continue}if(this.eatOp(">=")){t=B(t)>=B(this.additive());continue}if(this.eatOp("<")){t=B(t)<B(this.additive());continue}if(this.eatOp(">")){t=B(t)>B(this.additive());continue}return t}}additive(){let t=this.multiplicative();for(;;){if(this.eatOp("+")){const e=this.multiplicative();t=typeof t=="string"||typeof e=="string"?String(t)+String(e):B(t)+B(e);continue}if(this.eatOp("-")){t=B(t)-B(this.multiplicative());continue}return t}}multiplicative(){let t=this.unary();for(;;){if(this.eatOp("*")){t=B(t)*B(this.unary());continue}if(this.eatOp("/")){t=B(t)/B(this.unary());continue}if(this.eatOp("%")){t=B(t)%B(this.unary());continue}return t}}unary(){return this.eatOp("!")?!this.unary():this.eatOp("-")?-B(this.unary()):this.postfix()}postfix(){let t=this.primary();for(;;){if(this.peek()?.t==="dot"){this.pos+=1;const e=this.peek();if(!e||e.t!=="ident")throw new Error('Expected identifier after "."');if(this.pos+=1,this.isOp("(")){this.pos+=1;const n=[];if(!this.isOp(")"))do n.push(this.ternary());while(this.eatOp(","));this.expectOp(")");const s=Object.prototype.hasOwnProperty.call(ne,e.v)?ne[e.v]:void 0;if(typeof s!="function")throw new Error(`Method "${e.v}" is not allowed`);t=s(t,n);continue}t=Nt(t,e.v);continue}if(this.eatOp("[")){const e=this.ternary();this.expectOp("]"),t=Nt(t,typeof e=="number"?e:String(e));continue}return t}}primary(){const t=this.peek();if(!t)throw new Error("Unexpected end of expression");if(t.t==="op"&&t.v==="("){this.pos+=1;const e=this.ternary();return this.expectOp(")"),e}if(t.t==="op"&&t.v==="["){this.pos+=1;const e=[];if(!this.isOp("]"))do e.push(this.ternary());while(this.eatOp(","));return this.expectOp("]"),e}switch(this.pos+=1,t.t){case"str":return t.v;case"num":return t.v;case"bool":return t.v;case"null":return null;case"undef":return;case"ident":return Nt(this.ctx,t.v);default:throw new Error("Unexpected token")}}}function lt(i,t,e={}){try{if(typeof i!="string")return;if(i.length>(e.maxLength??Ye)){e.onError?.("expression exceeds the maximum length",i);return}return new oe(ie(i),t).parse()}catch(n){e.onError?.(n instanceof Error?n.message:"invalid expression",i);return}}function K(i,t,e={}){return!!lt(i,t,e)}function Ze(i){try{return new oe(ie(i),{}).parse(),{ok:!0}}catch(t){return{ok:!1,message:t instanceof Error?t.message:"invalid expression"}}}const re=new Set(["auto","center","top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"]),ae=new Set(["spotlight","hotspot","beacon","modal","banner"]),ce=new Set(["button","target-click","event","auto","input-match","form-submit","element-appears","element-disappears","url-match"]),le=new Set(["manual","auto","event","route","element","idle","scroll","context"]),tn=new Set(["emit","click","focus","navigate","setContext","scrollTo","wait"]),en=new Set(["text","image","video","list","code","divider","html","input","choice","button"]),de=new Set(["text","email","number","url","tel"]),nn=/^[A-Za-z_$][\w$]*$/,he=new Set(["free","target-only","blocked"]),ue=new Set(["compact","comfortable","spacious"]),sn=new Set(["specVersion","id","title","description","version","priority","trigger","audience","frequency","onComplete","theme","interaction","density","steps"]),on=new Set(["id","target","placement","display","title","content","buttons","advanceOn","event","duration","match","watch","urlPattern","interaction","density","skippable","canGoBack","next","showIf","nextWhen","theme","onEnter","onExit"]),rn=new Set(["selector","text","index","all","shadow","iframe","waitFor","timeout","visible","scrollIntoView","scrollBehavior","padding"]),an=new Set(["accent","bg","fg","muted","border","success","danger","backdrop","radius","shadow","font","fontSize","spacing","arrowSize","overlayBlur","animationMs","z","spotlightRing","popoverWidth"]),cn=/^[a-z0-9]+(-[a-z0-9]+)*$/,V={title:60,stepTitle:80,description:200,content:320,steps:24},pe={steps:200};function M(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)}class ln{constructor(){g(this,"errors",[]);g(this,"warnings",[])}error(t,e){this.errors.push({path:t,message:e,severity:"error"})}warn(t,e){this.warnings.push({path:t,message:e,severity:"warning"})}}function fe(i,t,e){if(i!==void 0){if(!M(i)){e.error(t,"theme must be an object");return}for(const n of Object.keys(i))an.has(n)||e.warn(`${t}.${n}`,`unknown theme token "${n}" (ignored)`)}}function dt(i,t,e){if(i===void 0)return;if(typeof i!="string"){e.error(t,"must be a string expression");return}if(i.length>500){e.error(t,`expression must be ≤ 500 chars (got ${i.length})`);return}const n=Ze(i);n.ok||e.error(t,`invalid expression: ${n.message}`)}function zt(i,t,e){if(i!==void 0){if(!Array.isArray(i)){e.error(t,"must be an array of actions");return}i.forEach((n,s)=>{const o=`${t}[${s}]`;if(!M(n)){e.error(o,"action must be an object");return}if(!tn.has(n.type)){e.error(`${o}.type`,`unknown action type "${String(n.type)}"`);return}n.type==="emit"&&typeof n.name!="string"&&e.error(`${o}.name`,'emit action requires a string "name"'),n.type==="navigate"&&(typeof n.path!="string"||!n.path.startsWith("/"))&&e.error(`${o}.path`,'navigate requires a same-origin "path" starting with /'),n.type==="setContext"&&typeof n.key!="string"&&e.error(`${o}.key`,'setContext requires a string "key"'),n.type==="scrollTo"&&typeof n.selector!="string"&&e.error(`${o}.selector`,'scrollTo requires a string "selector"'),n.type==="wait"&&typeof n.ms!="number"&&e.error(`${o}.ms`,'wait requires a numeric "ms"')})}}function vt(i,t,e){if(typeof i=="string")return i.length;if(M(i)&&typeof i.key=="string")return i.key.length;if(M(i)&&Array.isArray(i.blocks)){if(i.blocks.length===0){e.error(t,"blocks must not be empty");return}let n=0;return i.blocks.forEach((s,o)=>{const r=`${t}.blocks[${o}]`;if(!M(s)){e.error(r,"block must be an object");return}if(!en.has(s.type)){e.error(`${r}.type`,`unknown block type "${String(s.type)}"`);return}switch(s.type){case"text":typeof s.value=="string"?n+=s.value.length:(!M(s.value)||typeof s.value.key!="string")&&e.error(`${r}.value`,"text block requires a string or i18n object");break;case"image":typeof s.src!="string"&&e.error(`${r}.src`,'image block requires "src"'),typeof s.alt!="string"&&e.error(`${r}.alt`,'image block requires "alt" for accessibility');break;case"video":typeof s.src!="string"&&e.error(`${r}.src`,'video block requires "src"');break;case"list":(!Array.isArray(s.items)||s.items.length===0)&&e.error(`${r}.items`,'list block requires a non-empty "items" array');break;case"code":typeof s.value!="string"&&e.error(`${r}.value`,'code block requires a string "value"');break;case"html":typeof s.value!="string"?e.error(`${r}.value`,'html block requires a string "value"'):e.warn(r,"html blocks render only when the host sets allowHtml: true");break;case"input":case"choice":(typeof s.name!="string"||!nn.test(s.name))&&e.error(`${r}.name`,`${String(s.type)} block requires a "name" that is a valid identifier (e.g. "teamSize")`),s.type==="input"&&s.inputType!==void 0&&!de.has(s.inputType)&&e.error(`${r}.inputType`,`must be one of: ${[...de].join(" | ")}`),s.type==="choice"&&(!Array.isArray(s.options)||s.options.length===0?e.error(`${r}.options`,'choice block requires a non-empty "options" array'):s.options.forEach((a,c)=>{typeof a=="string"||M(a)&&a.label!==void 0&&a.value!==void 0||e.error(`${r}.options[${c}]`,"option must be a string or { label, value }")}));break;case"button":typeof s.label!="string"&&!(M(s.label)&&typeof s.label.key=="string")&&e.error(`${r}.label`,'button block requires a "label"'),s.action===void 0?e.error(`${r}.action`,'button block requires an "action"'):typeof s.action=="string"?["next","prev","skip","complete"].includes(s.action)||e.error(`${r}.action`,'must be "next" | "prev" | "skip" | "complete", { goTo }, or a step action'):M(s.action)&&"goTo"in s.action?typeof s.action.goTo!="string"&&e.error(`${r}.action.goTo`,"must be a step id"):zt(Array.isArray(s.action)?s.action:[s.action],`${r}.action`,e);break}}),n}}function dn(i,t){if(i===void 0)return;if(!M(i)){t.error("$.trigger","must be an object");return}const e=i.type;if(!le.has(e)){t.error("$.trigger.type",`must be one of: ${[...le].join(" | ")}`);return}if(i.delay!==void 0&&(typeof i.delay!="number"||i.delay<0)&&t.error("$.trigger.delay","must be a non-negative number (ms)"),e==="event"&&typeof i.event!="string"&&t.error("$.trigger.event",'required when trigger.type === "event"'),e==="context"&&dt(i.when??null,"$.trigger.when",t),e==="route"&&typeof i.path!="string"&&t.error("$.trigger.path",'required when trigger.type === "route"'),e==="element"&&typeof i.selector!="string"&&t.error("$.trigger.selector",'required when trigger.type === "element"'),e==="idle"&&(typeof i.ms!="number"||i.ms<=0)&&t.error("$.trigger.ms",'required positive number (ms) when trigger.type === "idle"'),e==="scroll"){const n=i.percent;(typeof n!="number"||n<0||n>100)&&t.error("$.trigger.percent","must be a number between 0 and 100")}}function hn(i,t,e){if(i===void 0)return;if(!M(i)){e.error(`${t}.target`,"must be an object");return}for(const r of Object.keys(i))rn.has(r)||e.warn(`${t}.target.${r}`,`unknown target key "${r}" (ignored)`);const{selector:n,text:s}=i,o=typeof n=="string"&&n.trim().length>0||Array.isArray(n)&&n.length>0&&n.every(r=>typeof r=="string"&&r.trim());n!==void 0&&!o&&e.error(`${t}.target.selector`,"must be a non-empty CSS selector or array of selectors"),!o&&typeof s!="string"&&e.error(`${t}.target`,'requires "selector", "text", or both'),i.timeout!==void 0&&(typeof i.timeout!="number"||i.timeout<0)&&e.error(`${t}.target.timeout`,"must be a non-negative number (ms)"),i.padding!==void 0&&(typeof i.padding!="number"||i.padding<0)&&e.error(`${t}.target.padding`,"must be a non-negative number (px)"),i.index!==void 0&&(typeof i.index!="number"||i.index<0)&&e.error(`${t}.target.index`,"must be a non-negative integer"),i.iframe!==void 0&&typeof i.iframe!="string"&&e.error(`${t}.target.iframe`,"must be a CSS selector string"),i.scrollBehavior!==void 0&&!["auto","smooth"].includes(i.scrollBehavior)&&e.error(`${t}.target.scrollBehavior`,'must be "auto" or "smooth"')}function yt(i){const t=new ln;if(!M(i))return{ok:!1,errors:[{path:"$",message:"spec must be a JSON object",severity:"error"}],warnings:[]};for(const s of Object.keys(i))sn.has(s)||t.warn(`$.${s}`,`unknown top-level key "${s}" (ignored)`);i.specVersion!==1&&t.error("$.specVersion","must be the integer 1"),typeof i.id!="string"||!i.id?t.error("$.id","required, non-empty string"):cn.test(i.id)||t.error("$.id",'must be kebab-case (e.g. "dashboard-intro")');const e=vt(i.title,"$.title",t);if(e===void 0?t.error("$.title","required (string or i18n object with key)"):e===0?t.error("$.title","must not be empty"):e>V.title&&t.warn("$.title",`longer than ${V.title} chars (got ${e})`),i.description!==void 0){const s=vt(i.description,"$.description",t);s===void 0?t.error("$.description","must be a string or i18n object"):s>V.description&&t.warn("$.description",`longer than ${V.description} chars (got ${s})`)}if(i.version!==void 0&&typeof i.version!="string"&&t.error("$.version",'must be a string (e.g. "1.0.0")'),i.priority!==void 0&&typeof i.priority!="number"&&t.error("$.priority","must be a number"),i.interaction!==void 0&&!he.has(i.interaction)&&t.error("$.interaction",'must be "free" | "target-only" | "blocked"'),i.density!==void 0&&!ue.has(i.density)&&t.error("$.density",'must be "compact" | "comfortable" | "spacious"'),dn(i.trigger,t),i.audience!==void 0&&(M(i.audience)?dt(i.audience.showIf,"$.audience.showIf",t):t.error("$.audience","must be an object")),i.frequency!==void 0)if(!M(i.frequency))t.error("$.frequency","must be an object");else for(const s of["max","cooldown","perSession"]){const o=i.frequency[s];o!==void 0&&(typeof o!="number"||o<0)&&t.error(`$.frequency.${s}`,"must be a non-negative number")}if(i.onComplete!==void 0)if(!M(i.onComplete))t.error("$.onComplete","must be an object");else{const{startTour:s,emit:o,navigate:r}=i.onComplete;s!==void 0&&typeof s!="string"&&t.error("$.onComplete.startTour","must be a tour id string"),o!==void 0&&typeof o!="string"&&t.error("$.onComplete.emit","must be an event name string"),r!==void 0&&(typeof r!="string"||!r.startsWith("/"))&&t.error("$.onComplete.navigate","must be a same-origin path starting with /")}if(fe(i.theme,"$.theme",t),!Array.isArray(i.steps))return t.error("$.steps","required, must be an array"),{ok:!1,errors:t.errors,warnings:t.warnings};i.steps.length<1&&t.error("$.steps","must contain at least 1 step"),i.steps.length>pe.steps?t.error("$.steps",`must contain ≤ ${pe.steps} steps (got ${i.steps.length})`):i.steps.length>V.steps&&t.warn("$.steps",`${i.steps.length} steps is a lot; consider splitting into several tours`);const n=new Set;return i.steps.forEach((s,o)=>{const r=`$.steps[${o}]`;if(!M(s)){t.error(r,"step must be an object");return}for(const f of Object.keys(s))on.has(f)||t.warn(`${r}.${f}`,`unknown step key "${f}" (ignored)`);typeof s.id!="string"||!s.id?t.error(`${r}.id`,"required"):n.has(s.id)?t.error(`${r}.id`,`duplicate step id "${s.id}"`):n.add(s.id);const a=s.display;a!==void 0&&!ae.has(a)&&t.error(`${r}.display`,`must be one of: ${[...ae].join(" | ")}`),hn(s.target,r,t),s.placement!==void 0&&!re.has(s.placement)&&t.error(`${r}.placement`,`must be one of: ${[...re].join(" | ")}`),s.interaction!==void 0&&!he.has(s.interaction)&&t.error(`${r}.interaction`,'must be "free" | "target-only" | "blocked"'),s.density!==void 0&&!ue.has(s.density)&&t.error(`${r}.density`,'must be "compact" | "comfortable" | "spacious"');const c=vt(s.title,`${r}.title`,t);c===void 0?t.error(`${r}.title`,"required (string or i18n object with key)"):c===0?t.error(`${r}.title`,"must not be empty"):c>V.stepTitle&&t.warn(`${r}.title`,`longer than ${V.stepTitle} chars (got ${c})`);const l=vt(s.content,`${r}.content`,t);if(l===void 0?t.error(`${r}.content`,"required (string, i18n object, or { blocks: [...] })"):l>V.content&&t.warn(`${r}.content`,`longer than ${V.content} chars (got ${l}); long copy hurts completion`),s.buttons!==void 0)if(!M(s.buttons))t.error(`${r}.buttons`,"must be an object");else for(const f of Object.keys(s.buttons))["next","back","skip","done"].includes(f)||t.warn(`${r}.buttons.${f}`,`unknown button "${f}" (ignored)`);const u=s.advanceOn??"button";ce.has(u)||t.error(`${r}.advanceOn`,`must be one of: ${[...ce].join(" | ")}`),u==="event"&&typeof s.event!="string"&&t.error(`${r}.event`,'required when advanceOn === "event"'),u==="auto"&&(typeof s.duration!="number"||s.duration<=0)&&t.error(`${r}.duration`,'required positive number (ms) when advanceOn === "auto"'),u==="target-click"&&s.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "target-click"'),u==="input-match"&&(s.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "input-match"'),typeof s.match!="string"&&t.error(`${r}.match`,'required when advanceOn === "input-match"')),u==="form-submit"&&s.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "form-submit"'),(u==="element-appears"||u==="element-disappears")&&typeof s.watch!="string"&&t.error(`${r}.watch`,`required when advanceOn === "${u}"`),u==="url-match"&&typeof s.urlPattern!="string"&&t.error(`${r}.urlPattern`,'required when advanceOn === "url-match"'),a==="beacon"&&s.duration!==void 0&&typeof s.duration!="number"&&t.error(`${r}.duration`,"must be a number (ms)"),s.next!==void 0&&(typeof s.next=="string"||(Array.isArray(s.next)?(s.next.length===0&&t.warn(`${r}.next`,"empty branch list falls through to the next step"),s.next.forEach((f,h)=>{const k=`${r}.next[${h}]`;if(!M(f)){t.error(k,"branch must be an object { if, to }");return}dt(f.if,`${k}.if`,t),typeof f.to!="string"&&t.error(`${k}.to`,"must be a step id string")})):t.error(`${r}.next`,"must be a step id string or an array of { if, to } branches"))),dt(s.showIf,`${r}.showIf`,t),dt(s.nextWhen,`${r}.nextWhen`,t),fe(s.theme,`${r}.theme`,t),zt(s.onEnter,`${r}.onEnter`,t),zt(s.onExit,`${r}.onExit`,t)}),i.steps.forEach((s,o)=>{if(!M(s))return;const r=`$.steps[${o}].next`;typeof s.next=="string"&&!n.has(s.next)?t.error(r,`points to unknown step id "${s.next}"`):Array.isArray(s.next)&&s.next.forEach((a,c)=>{M(a)&&typeof a.to=="string"&&!n.has(a.to)&&t.error(`${r}[${c}].to`,`points to unknown step id "${a.to}"`)})}),t.errors.length?{ok:!1,errors:t.errors,warnings:t.warnings}:{ok:!0,errors:[],warnings:t.warnings}}function un(i){const t=yt(i);if(!t.ok){const e=t.errors.map(n=>`  • ${n.path}: ${n.message}`).join(`
`);throw new Error(`[opentutorial] Invalid TutorialSpec:
${e}`)}return i}function pn(i){const t=[],e=new Set;return i.forEach((n,s)=>{const o=M(n)&&typeof n.id=="string"?n.id:void 0,r=yt(n);for(const a of[...r.errors,...r.warnings])t.push({...a,path:`[${s}]${a.path.slice(1)}`,specId:o});o&&(e.has(o)&&t.push({path:`[${s}].id`,message:`duplicate tour id "${o}"`,severity:"error",specId:o}),e.add(o))}),i.forEach((n,s)=>{if(!M(n)||!M(n.onComplete))return;const o=n.onComplete.startTour;typeof o=="string"&&!e.has(o)&&t.push({path:`[${s}].onComplete.startTour`,message:`chains to unknown tour "${o}"`,severity:"warning",specId:typeof n.id=="string"?n.id:void 0})}),{ok:!t.some(n=>n.severity==="error"),issues:t}}function fn(i){let t=2166136261;for(let e=0;e<i.length;e+=1)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function mn(i){return fn(i)/4294967296}function gn(i,t,e=""){return t>=1?!0:t<=0?!1:mn(`${e}:${i}`)<t}const bn=["zero","one","two","few","many","other"];function me(i,t){return t.split(".").reduce((e,n)=>e&&typeof e=="object"?e[n]:void 0,i)}function vn(i,t,e="en"){let n;try{n=new Intl.PluralRules(e).select(i)}catch{n=i===1?"one":"other"}return t[n]??t.other??""}function yn(i){const t={},e=/(\w+)\s*\{([^{}]*)\}/g;let n;for(;(n=e.exec(i))!==null;){const s=n[1];bn.includes(s)&&(t[s]=n[2])}return t}function xn(i,t){let e=0;for(let n=t;n<i.length;n+=1){const s=i[n];if(s==="{")e+=1;else if(s==="}"){if(e===0&&i[n+1]==="}")return n;e>0&&(e-=1)}}return-1}function ge(i,t){try{return new Intl.NumberFormat(t).format(i)}catch{return String(i)}}function Mt(i,t,e="en"){if(!i.includes("{{"))return i;let n="",s=0;for(;s<i.length;){const o=i.indexOf("{{",s);if(o===-1){n+=i.slice(s);break}const r=xn(i,o+2);if(r===-1){n+=i.slice(s);break}n+=i.slice(s,o);const a=i.slice(o+2,r).trim();n+=wn(a,t,e),s=r+2}return n}function wn(i,t,e){const n=`{{${i}}}`,s=i.indexOf(",");if(s!==-1){const r=i.slice(0,s).trim(),a=i.slice(s+1).trim();if(!a.startsWith("plural"))return n;const c=t?me(t,r):void 0,l=typeof c=="number"?c:Number(c);if(!Number.isFinite(l))return n;const u=yn(a.slice(6).replace(/^\s*,\s*/,""));return vn(l,u,e).replace(/#/g,ge(l,e))}if(!/^[\w.$]+$/.test(i))return n;const o=t?me(t,i):void 0;return o==null?n:typeof o=="number"?ge(o,e):String(o)}function ht(i,t,e,n){if(typeof i=="string")return Mt(i,n,t);if(i&&typeof i.key=="string"){const s=e?.(i.key,t);return Mt(s!==void 0?s:i.fallback??i.key,n,t)}return String(i)}const kn={next:"Next",back:"Back",done:"Done",skip:"Skip tour"};function En(i,t,e){return e?.(`opentutorial.${i}`,t)??kn[i]}const Sn={accent:"--ot-accent",bg:"--ot-bg",fg:"--ot-fg",muted:"--ot-muted",border:"--ot-border",success:"--ot-success",danger:"--ot-danger",backdrop:"--ot-backdrop",radius:"--ot-radius",shadow:"--ot-shadow",font:"--ot-font",fontSize:"--ot-font-size",spacing:"--ot-spacing",arrowSize:"--ot-arrow-size",overlayBlur:"--ot-overlay-blur",animationMs:"--ot-anim-ms",z:"--ot-z",spotlightRing:"--ot-spotlight-ring",popoverWidth:"--ot-popover-width"};function An(i){const t=Math.min(...i.map(o=>o.x)),e=Math.min(...i.map(o=>o.y)),n=Math.max(...i.map(o=>o.x+o.width)),s=Math.max(...i.map(o=>o.y+o.height));return{x:t,y:e,width:n-t,height:s-e}}function Cn(i){try{return JSON.stringify([i.title,i.content]).includes("{{")}catch{return!1}}const $n=new Set(["radius","popoverWidth","fontSize","spacing","arrowSize","overlayBlur"]),In=new Set(["animationMs"]),Tn=200;class Rt{constructor(t,e={}){g(this,"spec");g(this,"errors",[]);g(this,"warnings",[]);g(this,"opts");g(this,"persistence");g(this,"context");g(this,"layer",null);g(this,"popover",null);g(this,"hotspot",null);g(this,"customHost",null);g(this,"releaseFocus",null);g(this,"cleanupAdvance",null);g(this,"cleanupTrack",null);g(this,"cleanupRender",null);g(this,"appliedVars",[]);g(this,"status","idle");g(this,"currentId",null);g(this,"history",[]);g(this,"resolved",null);g(this,"runToken",0);g(this,"transitions",0);g(this,"stepEnteredAt",0);g(this,"startedAt",0);g(this,"advancing",!1);g(this,"sampleDecision",null);g(this,"indicatorActive",!1);this.spec=t,this.opts=e,this.context={...e.context??{}},this.persistence=new Lt(e.persistence?.storage,e.persistence?.keyPrefix??"ot",e.userId);const n=yt(t);if(this.warnings=n.warnings,!n.ok||e.strict&&n.warnings.length>0){this.errors=n.ok?n.warnings:n.errors;const s=this.errors.map(o=>`  • ${o.path}: ${o.message}`).join(`
`);e.dev!==!1&&console.error(`[opentutorial] Spec "${t?.id??"?"}" failed validation:
${s}`),this.emit("error",{message:`invalid spec: ${this.errors.length} violation(s)`})}else if(n.warnings.length>0&&e.dev){const s=n.warnings.map(o=>`  • ${o.path}: ${o.message}`).join(`
`);console.warn(`[opentutorial] Spec "${t.id}" has warnings:
${s}`)}}get ready(){return this.persistence.ready}getState(){const t=this.visibleSteps(),e=t.findIndex(s=>s.id===this.currentId),n=this.currentStep();return{status:this.status,currentStepId:this.currentId,index:Math.max(0,e),total:t.length,paused:this.status==="paused",canGoBack:n?.canGoBack!==!1&&this.history.length>0,canGoNext:this.status==="running"&&this.canAdvance(n)}}canAdvance(t){return!t?.nextWhen||K(t.nextWhen,this.context)}isValid(){return this.errors.length===0}hasSeen(){return this.persistence.hasSeen(this.spec.id,this.spec.version)}getPersistence(){return this.persistence}resetSeen(){this.persistence.reset(this.spec.id)}resetAll(){this.persistence.reset()}resetProgress(){this.persistence.clearProgress(this.spec.id)}exportProgress(){return this.persistence.exportAll()}importProgress(t,e="replace"){return this.persistence.importAll(t,e)}setUser(t){return this.opts={...this.opts,userId:t},this.persistence.setUser(t)}getContext(){return this.context}setContext(t){this.patchContext(t,{reactive:!0,notify:!0})}applyContext(t){this.patchContext(t,{reactive:!0,notify:!1})}patchContext(t,e){const n={};for(const[r,a]of Object.entries(t))Object.is(this.context[r],a)||(n[r]=a);if(Object.keys(n).length===0)return;const s=this.visibleSteps().length;if(Object.assign(this.context,n),e.notify)try{this.opts.onContextChange?.(this.context,n)}catch{}if(!e.reactive||this.status!=="running")return;const o=this.currentStep();if(o){if(o.showIf&&!K(o.showIf,this.context)){this.advance(!0);return}this.refreshReactive(o,this.visibleSteps().length!==s)}}refreshReactive(t,e){if(this.indicatorActive||this.hotspot)return;const s=this.layer?.root.getRootNode()?.activeElement??document.activeElement,o=!!this.popover?.contentHasFocus()||!!this.customHost&&!!s&&this.customHost.contains(s);if((e||!!this.opts.renderStep||Cn(t))&&!o){this.rerenderCurrent();return}this.popover?.setNextDisabled(!this.canAdvance(t))}setGlobalTheme(t){this.opts={...this.opts,theme:t},this.layer&&this.applyThemeChain(this.currentStep()?.theme)}setLocale(t){this.opts={...this.opts,locale:t},this.status==="running"&&this.rerenderCurrent()}async start(t){if(this.status==="destroyed"||this.status==="running"||!this.isValid())return;await this.persistence.ready,this.status="running",this.history=[],this.transitions=0,this.startedAt=Date.now();const e=t?void 0:this.resolveResumeStep(),n=t??e??this.visibleSteps()[0]?.id;if(this.history=[],n){const s=this.visibleSteps(),o=s.findIndex(r=>r.id===n);o>0&&(this.history=s.slice(0,o).map(r=>r.id))}if(this.buildDom(),this.persistence.markShown(this.spec.id,this.spec.version),this.emit(e?"resumed":"started",{stepId:n}),!n){this.complete("empty");return}await this.goToInternal(n,!1)}resolveResumeStep(){if(this.opts.autoResume){const n=this.persistence.getActive();if(n?.tourId===this.spec.id&&this.visibleSteps().some(o=>o.id===n.stepId))return n.stepId}if(!this.opts.resume)return;const t=this.opts.progressTtl??1440*60*1e3,e=this.persistence.getProgressIfValid(this.spec.id,t);if(e?.lastStepId&&this.visibleSteps().some(n=>n.id===e.lastStepId))return e.lastStepId}async next(){return this.advance(!1)}async advance(t){if(this.status!=="running"||this.advancing)return;const e=this.currentStep();if(!e||!t&&!this.canAdvance(e))return;if(this.opts.beforeNext){this.advancing=!0;try{const s=this.visibleSteps().findIndex(r=>r.id===e.id);if(!await this.opts.beforeNext({tourId:this.spec.id,step:e,index:Math.max(0,s)}))return}catch{return}finally{this.advancing=!1}if(this.status!=="running")return}this.emit("step-completed",{stepId:e.id,duration:this.stepDuration()});const n=this.resolveNextId(e);if(!n){this.complete("end");return}await this.goToInternal(n,!0)}resolveNextId(t){if(Array.isArray(t.next)){for(const r of t.next)if(r&&typeof r.if=="string"&&K(r.if,this.context))return r.to}else if(typeof t.next=="string")return t.next;const e=this.visibleSteps(),n=e.findIndex(r=>r.id===t.id);if(n>=0)return e[n+1]?.id;const s=this.spec.steps.findIndex(r=>r.id===t.id);if(s<0)return;const o=new Set(e.map(r=>r.id));return this.spec.steps.slice(s+1).find(r=>o.has(r.id))?.id}prev(){if(this.status!=="running")return;const t=this.currentStep();if(t&&t.canGoBack===!1)return;const e=this.history.pop();e&&(this.emit("back",{stepId:this.currentId??void 0}),this.goToInternal(e,!1))}goTo(t){this.status==="running"&&this.goToInternal(t,!0)}pause(){this.status==="running"&&(this.status="paused",this.emit("paused",{stepId:this.currentId??void 0}),this.teardownDom())}resume(){if(this.status!=="paused")return;const t=this.currentId;this.status="running",this.emit("unpaused",{stepId:t??void 0}),this.buildDom(),t?this.goToInternal(t,!1):this.start()}skip(t="user"){this.status!=="running"&&this.status!=="paused"||this.finish("skipped",t)}complete(t="user"){this.status!=="running"&&this.status!=="paused"||this.finish("completed",t)}destroy(){this.status="destroyed",this.teardownDom()}visibleSteps(){return this.spec.steps.filter(t=>!t.showIf||K(t.showIf,this.context))}currentStep(){return this.spec.steps.find(t=>t.id===this.currentId)??null}stepDuration(){return this.stepEnteredAt?Date.now()-this.stepEnteredAt:0}text(t){return ht(t,this.opts.locale??"en",this.opts.i18nResolver,this.context)}blocks(t){return St(t,e=>this.text(e))}interactionFor(t){return t.interaction??this.spec.interaction??this.opts.interaction??"free"}buildDom(){const t=this.opts.zIndex??9999;this.layer=new wt(t,{container:this.opts.container,isolate:this.opts.isolate,dir:this.opts.dir}),this.layer.attach(),(this.opts.renderStep||this.opts.renderIndicator)&&(this.customHost=document.createElement("div"),this.customHost.className="ot-custom-host",this.layer.mountPopover(this.customHost)),this.opts.renderStep||(this.popover=new je({onNext:()=>{this.next()},onPrev:()=>this.prev(),onSkip:()=>this.skip("user"),onJump:e=>this.jumpTo(e),interactive:this.interactiveHandlers()},this.opts.dir??"ltr",{swipe:this.opts.swipe,autoSize:this.opts.autoSize,draggable:this.opts.draggable}),this.layer.mountPopover(this.popover.el)),this.applyThemeChain(void 0)}teardownDom(){this.runToken+=1,this.releaseFocus?.(),this.cleanupAdvance?.(),this.cleanupTrack?.(),this.cleanupRender?.(),this.releaseFocus=null,this.cleanupAdvance=null,this.cleanupTrack=null,this.cleanupRender=null,this.popover?.destroy(),this.hotspot?.destroy(),this.customHost?.remove(),this.layer?.destroy(),this.popover=null,this.hotspot=null,this.customHost=null,this.layer=null,this.resolved=null}finish(t,e){const n=this.currentStep();n&&this.runActions(n.onExit);const s=this.startedAt?Date.now()-this.startedAt:0;this.status=t,this.persistence.mark(this.spec.id,t,this.spec.version),this.persistence.clearActive(),this.emit(t,{stepId:this.currentId??void 0,reason:e,duration:s}),this.teardownDom(),t==="completed"&&this.runOnComplete()}runOnComplete(){const t=this.spec.onComplete;if(t)try{t.emit&&window.dispatchEvent(new CustomEvent(t.emit,{detail:{tourId:this.spec.id}})),t.navigate&&this.navigate(t.navigate),t.startTour&&window.dispatchEvent(new CustomEvent("opentutorial:chain",{detail:{from:this.spec.id,to:t.startTour}}))}catch{}}async goToInternal(t,e){if(this.status!=="running")return;if(this.transitions+=1,this.transitions>Tn){this.emit("error",{message:"transition limit reached (possible next-loop)"}),this.complete("loop-guard");return}const n=this.spec.steps.find(o=>o.id===t);if(!n){this.emit("error",{message:`unknown step "${t}"`});return}const s=this.currentStep();s&&(this.runActions(s.onExit),this.emit("step-hidden",{stepId:s.id,duration:this.stepDuration()})),e&&this.currentId&&this.currentId!==t&&this.history.push(this.currentId),await this.showStep(n)}async showStep(t){if(!this.layer)return;const e=++this.runToken,n=()=>this.runToken===e&&this.status==="running";this.currentId=t.id,this.cleanupAdvance?.(),this.cleanupAdvance=null,this.releaseFocus?.(),this.releaseFocus=null,this.applyThemeChain(t.theme);const s=t.display??"spotlight",o=this.visibleSteps(),r=Math.max(0,o.findIndex(l=>l.id===t.id));let a=null;if(t.target){if(a=W(t.target),!a&&t.target.waitFor&&(this.renderStep(t,r,o.length,"Looking for the interface element…"),a=await bt(t.target,t.target.timeout??5e3),!n()))return;if(!a){const l=Yt(t.target);this.emit("target-not-found",{stepId:t.id,selector:l,message:`target not found: ${l}`}),this.next();return}}if(!n())return;if(this.resolved=a,a&&t.target?.scrollIntoView!==!1){const l=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,u=t.target?.scrollBehavior??(l?"auto":"smooth");try{a.element.scrollIntoView({block:"center",inline:"center",behavior:u})}catch{}}if(this.hotspot?.destroy(),this.hotspot=null,this.resetIndicatorHost(),this.layer.updateSpotlight(null),this.layer.setInteraction(this.interactionFor(t)),(s==="hotspot"||s==="beacon")&&a)this.showIndicator(t,s,a);else{this.renderStep(t,r,o.length),(s==="modal"||!a)&&this.layer.showBackdrop(),requestAnimationFrame(()=>requestAnimationFrame(()=>{n()&&this.reposition()}));const l=this.customHost??this.popover?.el;if(l){const u=s==="modal"||this.interactionFor(t)!=="free";this.releaseFocus=Ue(l,{trap:u,onEscape:()=>{t.skippable!==!1&&this.skip("escape")},...this.opts.keyboard!==!1?{onArrowNext:()=>{this.next()},onArrowPrev:()=>this.prev()}:{}})}}this.wireAdvance(t,a?.element??null),this.startTracking(),this.stepEnteredAt=Date.now(),this.persistence.saveProgress(this.spec.id,t.id,r),this.opts.autoResume&&this.persistence.setActive(this.spec.id,t.id),this.runActions(t.onEnter),this.emit("step-shown",{stepId:t.id,index:r,total:o.length})}showIndicator(t,e,n){if(!this.layer)return;const s=this.viewportRect(n);if(this.popover&&(this.popover.el.style.display="none"),this.opts.renderIndicator&&this.customHost){this.indicatorActive=!0,this.customHost.style.display="",this.customHost.classList.add("ot-custom-indicator"),this.customHost.style.position="fixed",this.customHost.style.left=`${s.x+s.width/2}px`,this.customHost.style.top=`${s.y+s.height/2}px`,this.cleanupRender?.();const o=this.visibleSteps(),r=o.findIndex(c=>c.id===t.id),a=this.opts.renderIndicator({...this.renderContext(t,Math.max(0,r),o.length,this.blocks(t.content)),display:e},this.customHost);if(this.cleanupRender=typeof a=="function"?a:null,e==="beacon"){const c=window.setTimeout(()=>{this.next()},t.duration??5e3);this.cleanupAdvance=()=>window.clearTimeout(c)}return}if(this.customHost&&(this.customHost.style.display="none"),this.hotspot=new _e,this.hotspot.render({display:e,content:Oe(this.blocks(t.content)),showDismiss:e==="hotspot"||t.advanceOn==="button",onDismiss:()=>{this.next()}},s),this.layer.root.appendChild(this.hotspot.el),e==="beacon"){const o=window.setTimeout(()=>{this.next()},t.duration??5e3);this.cleanupAdvance=()=>window.clearTimeout(o)}}renderStep(t,e,n,s){const o=s?[{type:"text",value:s}]:this.blocks(t.content);if(this.opts.renderStep&&this.customHost){this.cleanupRender?.();const r=this.renderContext(t,e,n,o),a=this.opts.renderStep(r,this.customHost);this.cleanupRender=typeof a=="function"?a:null,this.customHost.style.display="";return}this.popover&&(this.popover.el.style.display="",this.popover.render(this.makeModel(t,e,n,o)))}renderContext(t,e,n,s){return{tourId:this.spec.id,step:t,index:e,total:n,title:this.text(t.title),blocks:s,canGoBack:t.canGoBack!==!1&&this.history.length>0,canSkip:t.skippable!==!1,isLast:!t.next&&e>=n-1,next:()=>{this.next()},prev:()=>this.prev(),skip:()=>this.skip("user"),goTo:o=>this.goTo(o),context:this.context,setValue:(o,r)=>this.setContext({[o]:r}),canGoNext:this.canAdvance(t)}}resetIndicatorHost(){this.indicatorActive&&(this.indicatorActive=!1,this.customHost&&(this.customHost.classList.remove("ot-custom-indicator"),this.customHost.style.position="",this.customHost.style.left="",this.customHost.style.top="",this.opts.renderStep||(this.customHost.style.display="none")))}interactiveHandlers(){return{getValue:t=>this.context[t],setValue:(t,e,n)=>{this.emit("interaction",{stepId:this.currentId??void 0,meta:n==="choice"?{name:t,value:e}:{name:t}}),this.setContext({[t]:e})},runAction:(t,e)=>{this.emit("interaction",{stepId:this.currentId??void 0,meta:{button:e}}),this.runBlockAction(t)}}}runBlockAction(t){if(t==="next"){this.next();return}if(t==="prev"){this.prev();return}if(t==="skip"){this.skip("user");return}if(t==="complete"){this.complete("user");return}if(t&&typeof t=="object"&&!Array.isArray(t)&&"goTo"in t){this.goTo(t.goTo);return}this.runActions(Array.isArray(t)?t:[t])}jumpTo(t){if(this.status!=="running")return;const e=this.visibleSteps(),n=e[t],s=e.findIndex(r=>r.id===this.currentId);if(!n||t>=s||this.currentStep()?.canGoBack===!1)return;const o=this.history.lastIndexOf(n.id);o>=0&&(this.history.length=o),this.emit("back",{stepId:n.id}),this.goToInternal(n.id,!1)}rerenderCurrent(){const t=this.currentStep();if(!t||this.indicatorActive||this.hotspot)return;const e=this.visibleSteps(),n=Math.max(0,e.findIndex(s=>s.id===t.id));this.renderStep(t,n,e.length),this.reposition()}makeModel(t,e,n,s){const o=this.opts.locale??"en",r=this.opts.i18nResolver,a=(u,f)=>f===!1||f===void 0?En(u,o,r):this.text(f),c=t.buttons??{},l=t.advanceOn??"button";return{stepId:t.id,title:this.text(t.title),blocks:s,index:e,total:n,canGoBack:t.canGoBack!==!1&&this.history.length>0,skippable:t.skippable!==!1&&c.skip!==!1,isLast:!t.next&&e>=n-1,advanceOn:l,labels:{next:a("next",c.next),back:a("back",c.back),done:a("done",c.done),skip:a("skip",c.skip)},showNext:c.next!==!1&&(l==="button"||e>=n-1),showBack:c.back!==!1,modal:(t.display??"spotlight")==="modal"||this.interactionFor(t)==="blocked",allowHtml:this.opts.allowHtml,density:this.densityFor(t),nextDisabled:!this.canAdvance(t),jumpable:Array.from({length:n},(u,f)=>this.opts.dotNavigation!==!1&&t.canGoBack!==!1&&f<e),fixedWidth:{...this.opts.theme,...this.spec.theme,...t.theme}.popoverWidth!==void 0}}densityFor(t){return t.density??this.spec.density??this.opts.density??"comfortable"}viewportRect(t){const e=t.element.getBoundingClientRect();return{x:e.x+t.frameOffset.x,y:e.y+t.frameOffset.y,width:e.width,height:e.height}}reposition(){if(!this.layer||this.status!=="running")return;const t=this.currentStep();if(!t)return;const e=t.target?.padding??8,n=!!this.popover&&!this.opts.renderStep;if(this.resolved){if(!this.resolved.doc.contains(this.resolved.element)&&t.target){const o=W(t.target);o&&(this.resolved=o)}const s=this.viewportRect(this.resolved);if(this.indicatorActive&&this.customHost)this.customHost.style.left=`${s.x+s.width/2}px`,this.customHost.style.top=`${s.y+s.height/2}px`,this.layer.setInteraction(this.interactionFor(t));else if(this.hotspot)this.hotspot.reposition(s),this.layer.setInteraction(this.interactionFor(t));else{const o=t.target?.all?Je(t.target).map(a=>this.viewportRect(a)):[s],r=o.length>1?An(o):s;this.layer.updateSpotlight(o.length>0?o:s,e,this.mergedRadius()),n&&this.popover?.position(r,t.placement??"auto",e)}}else this.layer.showBackdrop(),n&&this.popover?.position(null,"center",0)}mergedRadius(){return({...this.opts.theme,...this.spec.theme,...this.currentStep()?.theme}.radius??14)+2}startTracking(){this.cleanupTrack?.();let t=0,e=!1;const n=()=>{e||(e=!0,t=requestAnimationFrame(()=>{e=!1,this.reposition()}))},s=new ResizeObserver(n);if(this.resolved)try{s.observe(this.resolved.element)}catch{}s.observe(document.documentElement),window.addEventListener("resize",n),window.addEventListener("scroll",n,!0);const o=performance.now()+900,r=()=>{this.status==="running"&&(this.reposition(),performance.now()<o&&requestAnimationFrame(r))};requestAnimationFrame(r),this.cleanupTrack=()=>{s.disconnect(),window.removeEventListener("resize",n),window.removeEventListener("scroll",n,!0),cancelAnimationFrame(t)}}wireAdvance(t,e){const n=t.advanceOn??"button",s=()=>{this.next()};switch(n){case"target-click":{if(!e)return;const o=()=>s();e.addEventListener("click",o,{once:!0}),this.cleanupAdvance=()=>e.removeEventListener("click",o);return}case"event":{if(typeof t.event!="string")return;const o=t.event,r=()=>s();window.addEventListener(o,r,{once:!0}),this.cleanupAdvance=()=>window.removeEventListener(o,r);return}case"auto":{const o=window.setTimeout(s,t.duration??3e3);this.cleanupAdvance=()=>window.clearTimeout(o);return}case"input-match":{if(!e||typeof t.match!="string")return;const o=t.match,r=c=>{if(o.startsWith("/")&&o.lastIndexOf("/")>0){const l=o.lastIndexOf("/");try{return new RegExp(o.slice(1,l),o.slice(l+1)).test(c)}catch{return!1}}return c===o},a=()=>{const c=e.value??"";r(c)&&s()};e.addEventListener("input",a),e.addEventListener("change",a),this.cleanupAdvance=()=>{e.removeEventListener("input",a),e.removeEventListener("change",a)};return}case"form-submit":{if(!e)return;const o=e.closest?.("form")??(e.tagName==="FORM"?e:null);if(!o)return;const r=()=>s();o.addEventListener("submit",r,{once:!0}),this.cleanupAdvance=()=>o.removeEventListener("submit",r);return}case"element-appears":{if(typeof t.watch!="string")return;let o=!1;bt({selector:t.watch,visible:!0},t.duration??6e4).then(r=>{r&&!o&&s()}),this.cleanupAdvance=()=>{o=!0};return}case"element-disappears":{if(typeof t.watch!="string")return;const o=t.watch,r=window.setInterval(()=>{W({selector:o,visible:!0})||(window.clearInterval(r),s())},150);this.cleanupAdvance=()=>window.clearInterval(r);return}case"url-match":{if(typeof t.urlPattern!="string")return;const o=t.urlPattern,r=()=>{Zt(o,Qt())&&s()},a=te(r);this.cleanupAdvance=a,r();return}}}navigate(t){if(t.startsWith("/")){if(this.opts.onNavigate){this.opts.onNavigate(t);return}window.location.assign(t)}}runActions(t){if(!t)return;const e=this.resolved?.element;for(const n of t)try{switch(n.type){case"emit":window.dispatchEvent(new CustomEvent(n.name,{detail:n.detail}));break;case"click":e?.click?.();break;case"focus":e?.focus?.();break;case"navigate":this.opts.autoResume&&this.currentId&&this.persistence.setActive(this.spec.id,this.currentId),this.navigate(n.path);break;case"setContext":this.patchContext({[n.key]:n.value},{reactive:!1,notify:!0});break;case"scrollTo":{W({selector:n.selector})?.element.scrollIntoView({block:"center",behavior:"smooth"});break}case"wait":break}}catch{}}applyThemeChain(t){if(!this.layer)return;const e=this.layer.root.style;for(const s of this.appliedVars)e.removeProperty(s);this.appliedVars=[];const n={...this.opts.theme,...this.spec.theme,...t};for(const[s,o]of Object.entries(n)){if(o===void 0)continue;const r=Sn[s];if(!r)continue;const a=$n.has(s)?`${o}px`:In.has(s)?`${o}ms`:String(o);e.setProperty(r,a),this.appliedVars.push(r)}n.z!==void 0&&(this.layer.root.style.zIndex=String(n.z))}emit(t,e={}){const n={type:t,tourId:this.spec?.id??"unknown",timestamp:Date.now(),...e},s=Object.freeze({...n});if(this.sampled())try{this.opts.onEvent?.(s)}catch{}try{window.dispatchEvent(new CustomEvent("opentutorial",{detail:s}))}catch{}}sampled(){const t=this.opts.sampleRate;return t===void 0||t>=1?!0:(this.sampleDecision===null&&(this.sampleDecision=gn(this.spec?.id??"unknown",t)),this.sampleDecision)}}function On(i,t){if(!i||i.type==="manual")return{dispose:()=>{}};const e=i.delay??0,n=[],s=[];let o=!1;const r=i.once??!0,a=()=>{o||(r&&(o=!0),e>0?n.push(window.setTimeout(t,e)):t())};switch(i.type){case"auto":{a();break}case"event":{const c=()=>a();window.addEventListener(i.event,c),s.push(()=>window.removeEventListener(i.event,c));break}case"route":{const c=()=>{Zt(i.path,Qt(),i.exact)?a():r||(o=!1)};s.push(te(c)),c();break}case"element":{let c=!1;bt({selector:i.selector,visible:!0},i.timeout??3e4).then(l=>{l&&!c&&a()}),s.push(()=>{c=!0});break}case"idle":{let c=0;const l=()=>{window.clearTimeout(c),!o&&(c=window.setTimeout(a,i.ms))},u=["pointerdown","keydown","scroll","pointermove"];for(const f of u)window.addEventListener(f,l,{passive:!0}),s.push(()=>window.removeEventListener(f,l));s.push(()=>window.clearTimeout(c)),l();break}case"scroll":{const c=()=>{const l=document.documentElement,u=l.scrollHeight-l.clientHeight;if(u<=0)return;l.scrollTop/u*100>=i.percent&&a()};window.addEventListener("scroll",c,{passive:!0}),s.push(()=>window.removeEventListener("scroll",c)),c();break}}return{dispose:()=>{n.forEach(c=>window.clearTimeout(c)),s.forEach(c=>{try{c()}catch{}})}}}class Dt{constructor(t,e={}){g(this,"engines",new Map);g(this,"specs");g(this,"opts");g(this,"triggers",new Map);g(this,"context");g(this,"contextTriggers",new Map);g(this,"watchers",new Set);g(this,"disposers",[]);g(this,"queue",[]);g(this,"activeId",null);g(this,"mounted",!1);g(this,"sessionCounts",new Map);this.specs=[...t],this.opts=e,this.context={...e.context??{}};for(const n of this.specs)this.createEngine(n)}createEngine(t){const e=new Rt(t,{...this.opts,context:this.context,onEvent:n=>this.handleEvent(n),onContextChange:(n,s)=>this.onEngineContext(t.id,s)});return this.engines.set(t.id,e),e}addSpec(t){this.engines.has(t.id)&&this.removeSpec(t.id),this.specs.push(t);const e=this.createEngine(t);return this.mounted&&e.ready.then(()=>{this.mounted&&this.engines.get(t.id)===e&&this.installTriggerFor(t)}),this.notifyState(),e.isValid()}removeSpec(t){const e=this.engines.get(t);if(!e)return!1;const n=e.getState().status;return(n==="running"||n==="paused")&&e.skip("removed"),this.triggers.get(t)?.dispose(),this.triggers.delete(t),this.contextTriggers.delete(t),this.queue=this.queue.filter(s=>s.tourId!==t),this.sessionCounts.delete(t),e.destroy(),this.engines.delete(t),this.specs=this.specs.filter(s=>s.id!==t),this.activeId===t&&(this.activeId=null),this.notifyState(),!0}notifyState(){const t=this.activeId?this.engines.get(this.activeId)?.getState()??null:null;try{this.opts.onStateChange?.(this.activeId,t)}catch{}}get ready(){return Promise.all([...this.engines.values()].map(t=>t.ready)).then(()=>{})}getEngine(t){return this.engines.get(t)}getEngines(){return[...this.engines.values()]}getSpecs(){return this.specs}getActiveId(){return this.activeId}getState(t){const e=t??this.activeId;return e?this.engines.get(e)?.getState()??null:null}hasSeen(t){return this.engines.get(t)?.hasSeen()??!1}checkEligibility(t){const e=this.engines.get(t);if(!e)return"unknown tour";if(!e.isValid())return"spec failed validation";const n=e.spec,s=e.getContext();if(n.audience?.showIf&&!K(n.audience.showIf,s))return"audience rule did not match";const o=n.frequency;if(o){const r=e.getPersistence().getRecord(n.id);if(o.max!==void 0&&(r?.shownCount??0)>=o.max)return`frequency: already shown ${o.max} time(s)`;if(o.cooldown!==void 0&&r?.lastShownAt){const a=Date.now()-r.lastShownAt;if(a<o.cooldown)return`frequency: cooldown active (${o.cooldown-a}ms left)`}if(o.perSession!==void 0&&(this.sessionCounts.get(n.id)??0)>=o.perSession)return`frequency: session limit of ${o.perSession} reached`}return null}request(t,e,n={}){const s=this.engines.get(t);if(!s||!n.force&&this.checkEligibility(t))return!1;if(this.activeId&&this.activeId!==t)if(n.force)this.engines.get(this.activeId)?.skip("preempted");else return n.queue!==!1&&this.enqueue(t,e,s.spec.priority??0),!1;return this.sessionCounts.set(t,(this.sessionCounts.get(t)??0)+1),s.start(e),!0}start(t,e){this.request(t,e,{force:!0})}enqueue(t,e,n){this.queue.some(s=>s.tourId===t)||(this.queue.push({tourId:t,stepId:e,priority:n}),this.queue.sort((s,o)=>o.priority-s.priority))}drain(){for(;this.queue.length>0;){const t=this.queue.shift();if(!t||this.request(t.tourId,t.stepId,{queue:!1}))return}}stop(t="api"){for(const e of this.engines.values()){const n=e.getState().status;(n==="running"||n==="paused")&&e.skip(t)}this.queue=[]}pause(){this.activeId&&this.engines.get(this.activeId)?.pause()}resume(){this.activeId&&this.engines.get(this.activeId)?.resume()}setContext(t){const e={};for(const[n,s]of Object.entries(t))Object.is(this.context[n],s)||(e[n]=s);Object.keys(e).length!==0&&(Object.assign(this.context,e),this.engines.forEach(n=>n.applyContext(e)),this.afterContextChange(e))}getContext(){return this.context}onEngineContext(t,e){Object.assign(this.context,e),this.engines.forEach((n,s)=>{s!==t&&n.applyContext(e)}),this.afterContextChange(e)}afterContextChange(t){try{this.opts.onContextChange?.(this.context,t)}catch{}for(const e of this.watchers){const n=lt(e.expr,this.context);if(Object.is(n,e.last))continue;const s=e.last;e.last=n;try{e.fn(n,s)}catch{}}for(const e of this.contextTriggers.values()){const n=K(e.when,this.context),s=n&&!e.last;e.last=n,s&&e.fire()}}watch(t,e){const n={expr:t,last:lt(t,this.context),fn:e};return this.watchers.add(n),()=>{this.watchers.delete(n)}}setTheme(t){this.engines.forEach(e=>e.setGlobalTheme(t))}setLocale(t){this.opts={...this.opts,locale:t},this.engines.forEach(e=>e.setLocale(t))}async setUser(t){this.sessionCounts.clear(),await Promise.all([...this.engines.values()].map(e=>e.setUser(t)))}reset(){this.sessionCounts.clear(),this.engines.values().next().value?.resetAll()}resetProgress(){this.engines.forEach(t=>t.resetProgress())}resetTour(t){this.sessionCounts.delete(t),this.engines.get(t)?.resetSeen()}exportProgress(){return this.engines.values().next().value?.exportProgress()??null}importProgress(t,e="replace"){return this.engines.values().next().value?.importProgress(t,e)??!1}mount(){this.mounted||(this.mounted=!0,this.ready.then(()=>{this.mounted&&(this.installChainListener(),this.installDeepLink(),this.installAutoResume(),this.installTriggers())}))}installTriggers(){for(const t of this.specs)this.installTriggerFor(t)}installTriggerFor(t){const e=this.engines.get(t.id);if(!e||!e.isValid())return;const n=t.trigger;if(!n||n.type==="manual")return;const s=n.once??!0;if(s&&e.hasSeen())return;const o=()=>{s&&e.hasSeen()||this.request(t.id)};if(n.type==="context"){let r=0;const a=()=>{window.clearTimeout(r),n.delay&&n.delay>0?r=window.setTimeout(o,n.delay):o()},c=K(n.when,this.context);this.contextTriggers.set(t.id,{when:n.when,last:c,fire:a}),this.triggers.set(t.id,{dispose:()=>window.clearTimeout(r)}),c&&a();return}this.triggers.set(t.id,On(n,o))}installDeepLink(){const t=this.opts.deepLinkParam??"tour";if(t!==!1)try{const e=new URLSearchParams(window.location.search),n=e.get(t);if(!n||!this.engines.has(n))return;const s=e.get(`${t}Step`)??void 0,o=window.setTimeout(()=>this.request(n,s,{force:!0}),400);this.disposers.push(()=>window.clearTimeout(o))}catch{}}installAutoResume(){if(!this.opts.autoResume)return;const t=this.engines.values().next().value;if(!t)return;const e=t.getPersistence().getActive();if(!e||!this.engines.has(e.tourId))return;const n=window.setTimeout(()=>this.request(e.tourId,e.stepId,{force:!0}),200);this.disposers.push(()=>window.clearTimeout(n))}installChainListener(){const t=e=>{const n=e.detail;!n?.to||!this.engines.has(n.to)||window.setTimeout(()=>this.request(n.to,void 0,{force:!0}),0)};window.addEventListener("opentutorial:chain",t),this.disposers.push(()=>window.removeEventListener("opentutorial:chain",t))}handleEvent(t){(t.type==="started"||t.type==="resumed")&&(this.activeId=t.tourId),(t.type==="completed"||t.type==="skipped")&&this.activeId===t.tourId&&(this.activeId=null);try{this.opts.onEvent?.(t)}catch{}const e=this.activeId?this.engines.get(this.activeId)?.getState()??null:null;try{this.opts.onStateChange?.(this.activeId,e)}catch{}(t.type==="completed"||t.type==="skipped")&&this.queue.length>0&&window.setTimeout(()=>this.drain(),0)}destroy(){this.mounted=!1,this.triggers.forEach(t=>t.dispose()),this.disposers.forEach(t=>{try{t()}catch{}}),this.triggers.clear(),this.contextTriggers.clear(),this.watchers.clear(),this.disposers=[],this.queue=[],this.engines.forEach(t=>t.destroy()),this.activeId=null}}const Ln={start:["started","resumed"],stop:["completed","skipped"],skip:["skipped"],complete:["completed"],step:["step-shown"],event:[],destroy:[]};function be(i){const{specs:t,autoMount:e=!0,storage:n,keyPrefix:s,...o}=i,r=new Map,a=n!==void 0||s!==void 0?{storage:n,keyPrefix:s,...o.persistence??{}}:o.persistence,c=(d,m)=>{const p=r.get(d);if(p)for(const b of p)try{b(m)}catch{}},l=new Set;let u={activeId:null,state:null,context:o.context??{}};const f=d=>{u=d;for(const m of l)try{m(u)}catch{}},h=new Dt(t,{...o,persistence:a,onStateChange:(d,m)=>{f({activeId:d,state:m,context:u.context}),o.onStateChange?.(d,m)},onContextChange:(d,m)=>{f({...u,context:{...d}}),o.onContextChange?.(d,m)},onEvent:d=>{c("event",d);for(const[m,p]of Object.entries(Ln))p.includes(d.type)&&c(m,d);o.onEvent?.(d)}});u={...u,context:{...h.getContext()}},e&&h.mount();const k=d=>{const m=h.getActiveId();if(!m)return;const p=h.getEngine(m);p&&d(p)};return{start:(d,m)=>h.start(d,m),request:(d,m)=>h.request(d,m),stop:()=>h.stop("api"),skip:d=>{d?h.getEngine(d)?.skip("api"):h.stop("api")},pause:()=>h.pause(),resume:()=>h.resume(),next:()=>k(d=>{d.next()}),prev:()=>k(d=>d.prev()),goTo:d=>k(m=>m.goTo(d)),getState:d=>h.getState(d),getActiveId:()=>h.getActiveId(),getSpecs:()=>h.getSpecs(),hasSeen:d=>h.hasSeen(d),whyBlocked:d=>h.checkEligibility(d),getContext:()=>h.getContext(),setContext:d=>h.setContext(d),setTheme:d=>h.setTheme(d),setLocale:d=>h.setLocale(d),setUser:d=>h.setUser(d),reset:()=>h.reset(),resetTour:d=>h.resetTour(d),resetProgress:()=>h.resetProgress(),exportProgress:()=>h.exportProgress(),importProgress:(d,m)=>h.importProgress(d,m),getEngine:d=>h.getEngine(d),addSpec:d=>h.addSpec(d),removeSpec:d=>h.removeSpec(d),store:{subscribe(d){l.add(d);try{d(u)}catch{}return()=>{l.delete(d)}},getSnapshot:()=>u},watchContext:(d,m)=>h.watch(d,m),dispatch(d){switch(d?.type){case"start":return h.start(d.tourId,d.stepId),!0;case"request":return h.request(d.tourId,d.stepId),!0;case"stop":return h.stop("api"),!0;case"next":return k(m=>{m.next()}),!0;case"prev":return k(m=>m.prev()),!0;case"goTo":return k(m=>m.goTo(d.stepId)),!0;case"pause":return h.pause(),!0;case"resume":return h.resume(),!0;case"setContext":return h.setContext(d.patch??{}),!0;case"addSpec":return h.addSpec(d.spec),!0;case"removeSpec":return h.removeSpec(d.tourId),!0;case"reset":return d.tourId?h.resetTour(d.tourId):h.reset(),!0;default:return!1}},get ready(){return h.ready},on(d,m){return r.has(d)||r.set(d,new Set),r.get(d).add(m),()=>this.off(d,m)},off(d,m){r.get(d)?.delete(m)},destroy(){c("destroy",{type:"skipped",tourId:h.getActiveId()??"",reason:"destroy",timestamp:Date.now()}),h.destroy(),r.clear(),l.clear()}}}function Nn(i,t={}){return new Rt(i,t)}function zn(i,t={}){return new Dt(i,t)}function Mn(i){return i}function Rn(i={}){const{days:t=365,path:e="/",domain:n,sameSite:s="Lax",secure:o}=i,r=()=>{const c={};if(typeof document>"u")return c;for(const l of document.cookie.split(";")){const u=l.indexOf("=");u<0||(c[decodeURIComponent(l.slice(0,u).trim())]=decodeURIComponent(l.slice(u+1)))}return c},a=(c,l,u)=>{if(typeof document>"u")return;const f=[`${encodeURIComponent(c)}=${encodeURIComponent(l)}`,`path=${e}`,`max-age=${Math.floor(u*86400)}`,`SameSite=${s}`];n&&f.push(`domain=${n}`),(o??s==="None")&&f.push("Secure"),document.cookie=f.join("; ")};return{getItem:c=>r()[c]??null,setItem:(c,l)=>a(c,l,t),removeItem:c=>a(c,"",-1)}}function Dn(i="opentutorial",t="kv"){const e=new Tt;if(typeof indexedDB>"u")return e;let n=null;const s=()=>n||(n=new Promise(r=>{try{const a=indexedDB.open(i,1);a.onupgradeneeded=()=>{const c=a.result;c.objectStoreNames.contains(t)||c.createObjectStore(t)},a.onsuccess=()=>r(a.result),a.onerror=()=>r(null),a.onblocked=()=>r(null)}catch{r(null)}}),n),o=async(r,a)=>{const c=await s();return c?new Promise(l=>{try{const u=c.transaction(t,r),f=a(u.objectStore(t));f.onsuccess=()=>l(f.result),f.onerror=()=>l(null)}catch{l(null)}}):null};return{getItem(r){const a=e.getItem(r);return a!==null?a:o("readonly",c=>c.get(r)).then(c=>(typeof c=="string"&&e.setItem(r,c),typeof c=="string"?c:null))},setItem(r,a){e.setItem(r,a),o("readwrite",c=>c.put(a,r))},removeItem(r){e.removeItem(r),o("readwrite",a=>a.delete(r))}}}function Bn(i){const{endpoint:t,headers:e,debounceMs:n=400,fetchImpl:s,onError:o}=i,r=i.cache===!1?new Tt:i.cache??ee(),a=s??(typeof fetch=="function"?fetch.bind(globalThis):void 0),c=t.replace(/\/$/,""),l=m=>`${c}/${encodeURIComponent(m)}`,u=()=>({"content-type":"application/json",...typeof e=="function"?e():e??{}}),f=new Map;let h=null;const k=async()=>{if(!a||f.size===0)return;const m=[...f.entries()];f.clear();for(const[p,b]of m)try{const y=await a(l(p),{method:b===null?"DELETE":"PUT",headers:u(),body:b===null?void 0:JSON.stringify({value:b}),credentials:"include"});if(!y.ok)throw new Error(`HTTP ${y.status}`)}catch(y){f.has(p)||f.set(p,b),o?.(y,b===null?"delete":"put",p)}},d=()=>{h&&clearTimeout(h),h=setTimeout(()=>{h=null,k()},n)};return typeof window<"u"&&(window.addEventListener("online",()=>{k()}),window.addEventListener("pagehide",()=>{k()})),{getItem(m){const p=r.getItem(m);return p??(a?a(l(m),{headers:u(),credentials:"include"}).then(b=>b.ok?b.json():null).then(b=>{const y=b?.value??null;return typeof y=="string"&&r.setItem(m,y),y}).catch(b=>(o?.(b,"get",m),null)):null)},setItem(m,p){r.setItem(m,p),f.set(m,p),d()},removeItem(m){r.removeItem(m),f.set(m,null),d()}}}const Pn=["data-tour","data-testid","data-test-id","data-test","data-cy","data-qa","data-automation-id"],qn=/^(css-[a-z0-9]+|sc-[a-zA-Z0-9]+|jsx-\d+|[a-z]+-[a-f0-9]{5,}|_[\w-]{5,})$/,ve=/(^|[-_:])(\d{3,}|[a-f0-9]{8,}|uid|uuid|react-aria|radix|headlessui|mui-)/i;function U(i){return typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(i):i.replace(/["\\]/g,"\\$&")}function Bt(i,t=document){try{return t.querySelectorAll(i).length}catch{return 0}}function ye(i){return Array.from(i.classList).filter(t=>t.length>1&&!qn.test(t)&&!t.startsWith("ot-"))}function Hn(i){const t=i.parentElement;return t?Array.from(t.children).filter(n=>n.tagName===i.tagName).indexOf(i)+1:1}function jn(i,t=document){const e=[];let n=i,s=0;for(;n&&n.nodeType===1&&s<6;){if(n.id&&!ve.test(n.id)){e.unshift(`#${U(n.id)}`);break}const o=n.tagName.toLowerCase();if(o==="html"||o==="body"){e.unshift(o);break}const r=ye(n);let a=r.length>0?`${o}.${U(r[0])}`:o;const c=n.parentElement;c&&Array.from(c.children).filter(f=>f.tagName===n.tagName&&(r.length===0||f.classList.contains(r[0]))).length>1&&(a+=`:nth-of-type(${Hn(n)})`),e.unshift(a),n=c,s+=1;const l=e.join(" > ");if(Bt(l,t)===1)break}return e.join(" > ")}function _n(i,t=document){const e=[],n=(l,u,f)=>{const h=Bt(l,t);if(h===0)return;const k=h===1?u:Math.max(10,u-25);e.push({selector:l,score:k,reason:f,matches:h})};for(const l of Pn){const u=i.getAttribute(l);u&&n(`[${l}="${U(u)}"]`,l==="data-tour"?100:92,`explicit ${l} hook`)}if(i.id){const l=!ve.test(i.id);n(`#${U(i.id)}`,l?85:45,l?"element id":"id looks generated")}const s=i.getAttribute("name");s&&n(`${i.tagName.toLowerCase()}[name="${U(s)}"]`,78,"form field name");const o=i.getAttribute("role"),r=i.getAttribute("aria-label");o&&r?n(`[role="${U(o)}"][aria-label="${U(r)}"]`,74,"role + aria-label"):r&&n(`[aria-label="${U(r)}"]`,70,"aria-label");const a=ye(i);if(a.length>0){const l=i.tagName.toLowerCase();n(`${l}.${a.map(U).join(".")}`,55,"tag + stable classes"),a.length>1&&n(`.${U(a[0])}`,40,"single class")}const c=jn(i,t);return c&&n(c,28,"structural path (fragile — add a data-tour attribute)"),e.filter((l,u,f)=>f.findIndex(h=>h.selector===l.selector)===u).sort((l,u)=>u.score-l.score)}function Pt(i,t=document){const e=_n(i,t);if(e.length===0)return null;const[n,...s]=e,o=(i.textContent??"").replace(/\s+/g," ").trim();return{selector:n.selector,score:n.score,reason:n.reason,fallbacks:s.filter(r=>r.score>=40).slice(0,2).map(r=>r.selector),text:o.length>0&&o.length<=60?o:void 0}}function Fn(i,t=document){return i.map(e=>{const n=Bt(e,t);return n===0?{selector:e,matches:n,ok:!1,note:"no element matches"}:n>1?{selector:e,matches:n,ok:!0,note:`matches ${n} elements; add target.index`}:{selector:e,matches:n,ok:!0}})}const Wn="[data-ot-recorder]";function xe(i={}){const t=i.minScore??60,e=[],n=document.createElement("style");n.setAttribute("data-ot-recorder",""),n.textContent=_,document.head.appendChild(n);const s=document.createElement("div");s.className="ot-rec-highlight",s.setAttribute("data-ot-recorder",""),s.style.display="none";const o=document.createElement("div");o.className="ot-rec-label",o.setAttribute("data-ot-recorder",""),o.style.display="none";const r=document.createElement("div");r.className="ot-rec-panel",r.setAttribute("data-ot-recorder",""),document.body.append(s,o,r);const a=()=>({specVersion:1,id:i.tourId??"recorded-tour",title:i.title??"Recorded tour",trigger:{type:"manual"},steps:e.length>0?e.map(y=>y.step):[{id:"step-1",title:"Untitled",content:"Add your copy here."}]}),c=()=>JSON.stringify(a(),null,2),l=()=>{r.replaceChildren();const y=document.createElement("h4");y.textContent=`Recording — ${e.length} step${e.length===1?"":"s"}`,r.appendChild(y);const v=document.createElement("ul");v.className="ot-rec-steps",e.forEach((O,I)=>{const D=document.createElement("li");D.className="ot-rec-step";const R=document.createElement("div");R.style.flex="1",R.style.minWidth="0";const P=document.createElement("div");P.textContent=`${I+1}. ${typeof O.step.title=="string"?O.step.title:O.step.id}`,R.appendChild(P);const T=document.createElement("code"),C=O.step.target?.selector;if(T.textContent=Array.isArray(C)?C[0]:C??"(no target)",R.appendChild(T),O.score<t){const E=document.createElement("div");E.textContent=`⚠ fragile (${O.score}) — ${O.reason}`,E.style.color="#f59e0b",E.style.fontSize="10.5px",R.appendChild(E)}const $=document.createElement("button");$.className="ot-rec-btn ot-rec-btn--ghost",$.textContent="×",$.title="Remove step",$.addEventListener("click",()=>{e.splice(I,1),u(),l(),i.onChange?.(a())}),D.append(R,$),v.appendChild(D)}),r.appendChild(v);const w=document.createElement("div");w.className="ot-rec-actions";const A=document.createElement("button");A.className="ot-rec-btn",A.textContent="Copy JSON",A.addEventListener("click",()=>f());const L=document.createElement("button");L.className="ot-rec-btn ot-rec-btn--ghost",L.textContent="Stop",L.addEventListener("click",()=>b()),w.append(A,L),r.appendChild(w);const N=document.createElement("div");N.style.cssText="margin-top:8px;opacity:0.55;font-size:11px;line-height:1.45",N.textContent="Click any element to capture it. Esc stops recording.",r.appendChild(N)},u=()=>{e.forEach((y,v)=>{y.step.id=`step-${v+1}`})},f=()=>{const y=c();if(i.onExport){i.onExport(a(),y);return}navigator.clipboard?.writeText(y).catch(()=>{console.log(y)})},h=y=>!!y?.closest?.(Wn),k=y=>{const v=y.target;if(!v||h(v)){s.style.display="none",o.style.display="none";return}const w=v.getBoundingClientRect();s.style.display="",s.style.left=`${w.x}px`,s.style.top=`${w.y}px`,s.style.width=`${w.width}px`,s.style.height=`${w.height}px`;const A=Pt(v);o.style.display="",o.textContent=A?`${A.selector}  (${A.score})`:v.tagName.toLowerCase();const L=w.y+w.height+4;o.style.left=`${Math.max(4,w.x)}px`,o.style.top=L+22<window.innerHeight?`${L}px`:`${Math.max(4,w.y-22)}px`},d=y=>{const v=y.target;if(!v||h(v))return;y.preventDefault(),y.stopPropagation();const w=Pt(v);if(!w)return;const A=(v.textContent??"").replace(/\s+/g," ").trim().slice(0,40),L={id:`step-${e.length+1}`,target:{selector:w.fallbacks.length>0?[w.selector,...w.fallbacks]:w.selector,...w.score<t&&w.text?{text:w.text}:{}},title:A||"Untitled step",content:"Describe what the user should do here."};e.push({step:L,score:w.score,reason:w.reason}),l(),i.onChange?.(a())},m=y=>{y.key==="Escape"&&(y.preventDefault(),b())};document.addEventListener("pointermove",k,!0),document.addEventListener("click",d,!0),document.addEventListener("keydown",m,!0),l();let p=!1;const b=()=>{p||(p=!0,document.removeEventListener("pointermove",k,!0),document.removeEventListener("click",d,!0),document.removeEventListener("keydown",m,!0),s.remove(),o.remove(),r.remove(),n.remove())};return{stop:b,getSpec:a,toJSON:c}}function we(i="ot-record"){try{const e=new URLSearchParams(window.location.search).get(i);return!e||e==="0"||e==="false"?null:xe({tourId:e==="1"?void 0:e})}catch{return null}}function Un(i){const t=document.createElement("style");t.setAttribute("data-ot-debug",""),t.textContent=_;const e=document.createElement("div");e.className="ot-debug",e.setAttribute("data-ot-debug",""),document.head.appendChild(t),document.body.appendChild(e);const n=(r,a,c)=>{const l=document.createElement("div");l.className="ot-debug-row";const u=document.createElement("span");u.className="ot-debug-key",u.textContent=r;const f=document.createElement("span");return f.className=`ot-debug-val${c?` ot-debug-${c}`:""}`,f.textContent=a,l.append(u,f),l},s=()=>{const r=i.getActiveId(),a=i.getState(),c=i.getContext(),l=i.specs.find(d=>d.id===r);e.replaceChildren();const u=document.createElement("h4");u.textContent="OpenTutorial debug",e.appendChild(u),e.appendChild(n("tour",r??"(none)")),e.appendChild(n("status",a?.status??"idle")),e.appendChild(n("step",a?.currentStepId??"—")),a&&e.appendChild(n("position",`${a.index+1} / ${a.total}`));const f=l?.steps.find(d=>d.id===a?.currentStepId);if(f?.target){const d=W(f.target);e.appendChild(n("target",d?"resolved":"NOT FOUND",d?"ok":"bad")),e.appendChild(n("selector",Yt(f.target)))}const h=Object.keys(c);if(h.length>0){const d=document.createElement("h4");d.textContent="context",d.style.marginTop="10px",e.appendChild(d);for(const m of h.slice(0,12))e.appendChild(n(m,JSON.stringify(c[m])?.slice(0,40)??"undefined"))}const k=[];l?.audience?.showIf&&k.push({label:"audience",expr:l.audience.showIf});for(const d of l?.steps??[])d.showIf&&k.push({label:d.id,expr:d.showIf});if(k.length>0){const d=document.createElement("h4");d.textContent="conditions",d.style.marginTop="10px",e.appendChild(d);for(const{label:m,expr:p}of k.slice(0,12)){const b=lt(p,c);e.appendChild(n(m,`${p} → ${String(b)}`,b?"ok":"bad"))}}},o=()=>s();return window.addEventListener("opentutorial",o),s(),{update:s,destroy:()=>{window.removeEventListener("opentutorial",o),e.remove(),t.remove()}}}function Vn(i="[opentutorial]"){const t=e=>{const n=e.detail;if(!n)return;const s=[n.type,n.tourId,n.stepId].filter(Boolean).join(" · ");console.log(`${i} ${s}${n.duration?` (${n.duration}ms)`:""}`)};return window.addEventListener("opentutorial",t),()=>window.removeEventListener("opentutorial",t)}function ot(i,t={}){const e={tour_id:i.tourId,event_type:i.type};return i.stepId!==void 0&&(e.step_id=i.stepId),i.index!==void 0&&(e.step_index=i.index),i.total!==void 0&&(e.step_total=i.total),i.duration!==void 0&&(e.duration_ms=i.duration),i.reason!==void 0&&(e.reason=i.reason),i.selector!==void 0&&(e.selector=i.selector),i.message!==void 0&&(e.message=i.message),i.meta&&Object.assign(e,i.meta),t.includeTimestamp!==!1&&(e.timestamp=i.timestamp),e}function xt(i,t="OpenTutorial"){return`${t} ${i.type}`}function Y(i){try{i()}catch{}}function Gn(i){return t=>Y(()=>i.capture(xt(t,"[OpenTutorial]"),ot(t)))}function Jn(i){return t=>Y(()=>i.track(xt(t,"[OpenTutorial]"),ot(t)))}function Kn(i){return t=>Y(()=>i.track(xt(t,"[OpenTutorial]"),ot(t,{includeTimestamp:!1})))}function Yn(i){return t=>Y(()=>i.track(xt(t,"OpenTutorial"),ot(t)))}function Xn(i){return t=>Y(()=>{const e=window.gtag;typeof e=="function"&&e("event",`opentutorial_${t.type.replace(/-/g,"_")}`,{...ot(t,{includeTimestamp:!1}),send_to:i})})}function Qn(...i){const t=i.filter(e=>typeof e=="function");return e=>{for(const n of t)Y(()=>n(e))}}function Zn(i){const{endpoint:t,headers:e,batchSize:n=20,flushMs:s=5e3,storage:o,storageKey:r="ot:analytics:queue",maxQueue:a=500,transform:c,fetchImpl:l,onError:u}=i,f=l??(typeof fetch=="function"?fetch.bind(globalThis):void 0);let h=[],k=null,d=!1;const m=()=>({"content-type":"application/json",...typeof e=="function"?e():e??{}}),p=()=>{o&&Y(()=>o.setItem(r,JSON.stringify(h)))};o&&Promise.resolve(o.getItem(r)).then(v=>{if(typeof v=="string")try{const w=JSON.parse(v);Array.isArray(w)&&(h=[...w,...h].slice(-a))}catch{}});const b=async()=>{if(d||h.length===0||!f)return;d=!0;const v=h.splice(0,Math.max(n,1));p();try{const w=await f(t,{method:"POST",headers:m(),body:JSON.stringify({events:v}),keepalive:!0});if(!w.ok)throw new Error(`HTTP ${w.status}`)}catch(w){h=[...v,...h].slice(-a),p(),u?.(w,v)}finally{d=!1}},y=()=>{k||(k=setTimeout(()=>{k=null,b()},s))};return typeof window<"u"&&(window.addEventListener("online",()=>{b()}),window.addEventListener("pagehide",()=>{if(h.length===0)return;ti(t,{events:h})&&(h=[],p())})),v=>Y(()=>{h.push(c?c(v):ot(v)),h.length>a&&(h=h.slice(-a)),p(),h.length>=n?b():y()})}function ti(i,t){try{return typeof navigator>"u"||typeof navigator.sendBeacon!="function"?!1:navigator.sendBeacon(i,new Blob([JSON.stringify(t)],{type:"application/json"}))}catch{return!1}}function ke(i){if(i.length===0)return 0;const t=[...i].sort((n,s)=>n-s),e=Math.floor(t.length/2);return t.length%2===0?Math.round((t[e-1]+t[e])/2):t[e]}function Ee(i,t,e){const n=i.filter(p=>p.tourId===t),s=n.filter(p=>p.type==="started"||p.type==="resumed").length,o=n.filter(p=>p.type==="completed").length,r=n.filter(p=>p.type==="skipped").length,a=n.filter(p=>(p.type==="completed"||p.type==="skipped")&&typeof p.duration=="number").map(p=>p.duration),c=[],l=new Map,u=new Map,f=new Map;for(const p of n)if(p.type==="step-shown"&&p.stepId&&(c.includes(p.stepId)||c.push(p.stepId),l.set(p.stepId,(l.get(p.stepId)??0)+1)),p.type==="step-completed"&&p.stepId&&(u.set(p.stepId,(u.get(p.stepId)??0)+1),typeof p.duration=="number")){const b=f.get(p.stepId)??[];b.push(p.duration),f.set(p.stepId,b)}const k=(e?e.steps.map(p=>p.id).filter(p=>l.has(p)):c).map((p,b)=>{const y=l.get(p)??0,v=u.get(p)??0,w=Math.max(0,y-v);return{stepId:p,index:b,views:y,completions:v,dropOffs:w,dropOffRate:y>0?w/y:0,medianDurationMs:ke(f.get(p)??[])}}),d=k.reduce((p,b)=>b.dropOffs>0&&(!p||b.dropOffRate>p.dropOffRate)?b:p,null),m=new Map;for(const p of n){if(p.type!=="target-not-found"||!p.stepId)continue;const b=`${p.stepId}::${p.selector??""}`,y=m.get(b);y?y.count+=1:m.set(b,{stepId:p.stepId,selector:p.selector??"",count:1})}return{tourId:t,starts:s,completions:o,skips:r,completionRate:s>0?o/s:0,medianDurationMs:ke(a),steps:k,worstStep:d,targetsNotFound:[...m.values()].sort((p,b)=>b.count-p.count)}}function ei(i=5e3){const t=[];return{adapter:e=>{t.push(e),t.length>i&&t.splice(0,t.length-i)},events:t,report:(e,n)=>Ee(t,e,n),clear:()=>{t.length=0}}}function x(i,t,e={}){const n=document.createElement(i);t&&(n.className=t);const{text:s,html:o,...r}=e;return s!==void 0&&(n.textContent=s),o!==void 0&&(n.innerHTML=o),Object.assign(n,r),n}function Z(i,t,e){const n=x("button",i,{type:"button",text:t});return n.addEventListener("click",e),n}class tt{constructor(){g(this,"fns",[])}add(t){this.fns.push(t)}listen(t,e,n,s){t.addEventListener(e,n,s),this.fns.push(()=>t.removeEventListener(e,n,s))}run(){for(const t of this.fns)try{t()}catch{}this.fns=[]}}class qt{constructor(t,e,n){g(this,"ready");g(this,"persistence");this.persistence=new Lt(t,e,n),this.ready=this.persistence.ready}shouldShow(t,e={}){const{once:n=!0,resurfaceAfter:s}=e;if(!n)return!0;const o=this.persistence.getRecord(t);return o?.at?s===void 0?!1:Date.now()-o.at>s:!0}markDismissed(t){this.persistence.mark(t,"skipped")}markActed(t){this.persistence.mark(t,"completed")}reset(t){this.persistence.reset(t)}}function et(i,t){t!==null&&(t??document.body).appendChild(i)}function nt(i,t){return{el:i,mount(e){(e??document.body).appendChild(i)},destroy(){t.run(),i.remove()}}}function ni(i){const{id:t,message:e,position:n="top",action:s,dismissible:o=!0,resurfaceAfter:r,storage:a,keyPrefix:c="ot-banner",userId:l,container:u,className:f="",onDismiss:h}=i,k=new tt,d=new qt(a,c,l),m=x("div",`ot-banner ot-banner--${n} ${f}`.trim());m.setAttribute("role","status"),m.hidden=!0;const p=x("span","ot-banner-content",{html:Q(e)});m.appendChild(p),s&&m.appendChild(Z("ot-banner-action",s.label,s.onClick));const b=()=>{d.markDismissed(t),m.hidden=!0,h?.()};if(o){const v=Z("ot-banner-dismiss","×",b);v.setAttribute("aria-label","Dismiss"),m.appendChild(v)}et(m,u);let y=!0;return k.add(()=>{y=!1}),d.ready.then(()=>{y&&(m.hidden=!d.shouldShow(t,{resurfaceAfter:r}))}),{...nt(m,k),setMessage(v){p.innerHTML=Q(v)},dismiss:b}}function ii(i){const{id:t,title:e,content:n,once:s=!0,primaryAction:o,secondaryAction:r,dismissible:a=!0,allowHtml:c,locale:l="en",i18nResolver:u,storage:f,keyPrefix:h="ot-announce",userId:k,container:d,className:m="",onDismiss:p}=i,b=new tt,y=new qt(f,h,k),v=x("div","ot-root");v.setAttribute("data-opentutorial",""),v.hidden=!0;const w=document.createElementNS("http://www.w3.org/2000/svg","svg");w.setAttribute("class","ot-backdrop"),w.setAttribute("width","100%"),w.setAttribute("height","100%"),w.setAttribute("aria-hidden","true");const A=document.createElementNS("http://www.w3.org/2000/svg","rect");A.setAttribute("class","ot-dim"),A.setAttribute("width","100%"),A.setAttribute("height","100%"),w.appendChild(A);const L=`ot-announce-${t}`,N=x("div",`ot-popover ot-modal ot-popover--modal-step ${m}`.trim());N.setAttribute("role","dialog"),N.setAttribute("aria-modal","true"),N.setAttribute("aria-labelledby",L),N.style.left="50%",N.style.top="50%",N.style.transform="translate(-50%, -50%)";const O=x("div","ot-body"),I=E=>{s&&(E?y.markActed(t):y.markDismissed(t)),v.hidden=!0,E||p?.()};if(a){const E=Z("ot-skip","×",()=>I(!1));E.setAttribute("aria-label","Dismiss"),O.appendChild(E)}const D=x("h2","ot-title",{text:e});D.id=L,O.appendChild(D);const R=x("div","ot-content-wrap"),P=St(n,E=>ht(E,l,u));R.appendChild(At(P,{allowHtml:c})),O.appendChild(R);const T=x("div","ot-footer");T.appendChild(x("span"));const C=x("div","ot-btns");r&&C.appendChild(Z("ot-btn ot-btn-ghost",r.label,()=>{I(!0),r.onClick()})),C.appendChild(Z("ot-btn ot-btn-primary",o?.label??"Got it",()=>{I(!0),o?.onClick()})),T.appendChild(C),O.appendChild(T),N.appendChild(O),v.appendChild(w),v.appendChild(N),et(v,d),a&&b.listen(window,"keydown",E=>{!v.hidden&&E.key==="Escape"&&I(!1)});let $=!0;return b.add(()=>{$=!1}),y.ready.then(()=>{$&&(v.hidden=!y.shouldShow(t,{once:s}),v.hidden||N.focus?.())}),{...nt(v,b),close:()=>I(!1)}}function si(i){const{target:t,content:e,glyph:n="?",openOnHover:s=!1,zIndex:o,container:r,className:a=""}=i,c=new tt,l=typeof t=="string"?{selector:t}:t,u=x("div",`ot-hint ${a}`.trim());o!==void 0&&(u.style.zIndex=String(o)),u.hidden=!0;const f=x("button","ot-hint-dot",{type:"button",text:n});f.setAttribute("aria-expanded","false"),f.setAttribute("aria-label","Show hint");const h=x("div","ot-hint-panel",{html:Q(e)});h.setAttribute("role","tooltip"),h.hidden=!0;const k=b=>{h.hidden=!b,f.setAttribute("aria-expanded",String(b)),f.setAttribute("aria-label",b?"Hide hint":"Show hint")};f.addEventListener("click",()=>k(h.hidden)),s&&(u.addEventListener("mouseenter",()=>k(!0)),u.addEventListener("mouseleave",()=>k(!1))),u.appendChild(f),u.appendChild(h),et(u,r);let d=0;const m=()=>{const b=W(l);if(!b){u.hidden=!0;return}const y=b.element.getBoundingClientRect();u.hidden=!1,u.style.left=`${y.x+b.frameOffset.x+y.width}px`,u.style.top=`${y.y+b.frameOffset.y}px`},p=()=>{cancelAnimationFrame(d),d=requestAnimationFrame(m)};if(m(),c.listen(window,"resize",p),c.listen(window,"scroll",p,{capture:!0}),c.add(()=>cancelAnimationFrame(d)),typeof ResizeObserver<"u"){const b=new ResizeObserver(p);b.observe(document.documentElement),c.add(()=>b.disconnect())}return{...nt(u,c),open:()=>k(!0),close:()=>k(!1),reposition:m}}function oi(i){const{id:t,kind:e="nps",question:n,options:s=[],lowLabel:o="Not likely",highLabel:r="Very likely",followUp:a,submitLabel:c="Submit",dismissLabel:l="Not now",thanksMessage:u="Thanks for the feedback!",container:f,className:h="",onSubmit:k,onDismiss:d}=i,m=new tt;let p=null,b=null;const y=x("div",`ot-survey ${h}`.trim()),v=`ot-survey-q-${t}`,w=x("p","ot-survey-question",{text:n});w.id=v,y.appendChild(w);const A=e==="nps"?Array.from({length:11},(T,C)=>C):e==="rating"?[1,2,3,4,5]:null,L=[],N=[],O=x("textarea","ot-survey-textarea");O.placeholder=e==="text"?n:a??"",O.setAttribute("aria-label",e==="text"?n:a??"Additional comments"),O.hidden=e!=="text";const I=x("button","ot-btn ot-btn-primary",{type:"button",text:c}),D=()=>{for(const C of L){const $=Number(C.dataset.value)===p;C.classList.toggle("ot-survey-score--selected",$),C.setAttribute("aria-checked",String($))}for(const C of N){const $=C.dataset.value===b;C.classList.toggle("ot-survey-option--selected",$),C.setAttribute("aria-checked",String($))}a&&e!=="text"&&(O.hidden=p===null&&b===null);const T=e==="nps"||e==="rating"?p!==null:e==="choice"?b!==null:O.value.trim().length>0;I.disabled=!T};if(A){const T=x("div","ot-survey-scale");T.setAttribute("role","radiogroup"),T.setAttribute("aria-labelledby",v);for(const $ of A){const E=x("button","ot-survey-score",{type:"button",text:String($)});E.dataset.value=String($),E.setAttribute("role","radio"),E.setAttribute("aria-checked","false"),E.addEventListener("click",()=>{p=$,D()}),L.push(E),T.appendChild(E)}y.appendChild(T);const C=x("div","ot-survey-labels");C.appendChild(x("span",void 0,{text:o})),C.appendChild(x("span",void 0,{text:r})),y.appendChild(C)}if(e==="choice"){const T=x("div","ot-survey-options");T.setAttribute("role","radiogroup"),T.setAttribute("aria-labelledby",v);for(const C of s){const $=x("button","ot-survey-option",{type:"button",text:C});$.dataset.value=C,$.setAttribute("role","radio"),$.setAttribute("aria-checked","false"),$.addEventListener("click",()=>{b=C,D()}),N.push($),T.appendChild($)}y.appendChild(T)}y.appendChild(O),O.addEventListener("input",D);const R=x("div","ot-footer");d?R.appendChild(Z("ot-btn ot-btn-ghost",l,d)):R.appendChild(x("span")),R.appendChild(I),y.appendChild(R);const P=()=>({surveyId:t,kind:e,score:p??void 0,choice:b??void 0,comment:O.value.trim()||void 0});return I.addEventListener("click",()=>{I.disabled||(k({...P(),submittedAt:Date.now()}),y.replaceChildren(x("p","ot-survey-thanks",{text:u})))}),D(),et(y,f),{...nt(y,m),getResponse:P,reset(){p=null,b=null,O.value="",D()}}}function ri(i){const{layer:t,specs:e,getStatus:n,onStart:s,title:o="Onboarding",startLabel:r="Start",runningLabel:a="Running",floating:c=!1,collapsible:l=!1,defaultCollapsed:u=!1,hideWhenComplete:f=!1,locale:h="en",i18nResolver:k,container:d,className:m="",onComplete:p}=i,b=new tt;let y=u,v=!1;const w=x("div","ot-checklist"),A=x("ul","ot-checklist-items"),L=x("div","ot-checklist-bar-track"),N=x("div","ot-checklist-bar-fill"),O=x("span","ot-checklist-count"),I=x("button","ot-checklist-toggle",{type:"button"});if(L.setAttribute("role","progressbar"),L.setAttribute("aria-valuemin","0"),L.setAttribute("aria-valuemax","100"),L.appendChild(N),o){const E=x("div","ot-checklist-header");E.appendChild(x("h3","ot-checklist-title",{text:o})),E.appendChild(O),l&&(I.addEventListener("click",()=>$(!y)),E.appendChild(I)),w.appendChild(E)}w.appendChild(L),w.appendChild(A);const D=()=>e??t.getSpecs(),R=E=>n?n(E):t.getActiveId()===E?"in_progress":t.hasSeen(E)?"completed":"pending",P=E=>E===void 0?"":ht(E,h,k,t.getContext());let T={completed:0,total:0,percent:0};const C=()=>{const E=D(),G=E.map(j=>R(j.id)),z=G.filter(j=>j==="completed").length,q=E.length>0?Math.round(z/E.length*100):0;T={completed:z,total:E.length,percent:q},O.textContent=`${z}/${E.length}`,N.style.width=`${q}%`,L.setAttribute("aria-valuenow",String(q)),L.setAttribute("aria-label",`${z} of ${E.length} complete`),A.replaceChildren(),E.forEach((j,rt)=>{const J=G[rt],at=x("li",`ot-checklist-item ot-checklist-item--${J}`),F=x("span","ot-checklist-icon",{text:J==="completed"?"✓":J==="in_progress"?"◌":"○"});F.setAttribute("aria-hidden","true"),at.appendChild(F);const Ht=x("div","ot-checklist-info");Ht.appendChild(x("span","ot-checklist-name",{text:P(j.title)}));const Ae=P(j.description);if(Ae&&Ht.appendChild(x("span","ot-checklist-desc",{text:Ae})),at.appendChild(Ht),J!=="completed"){const jt=x("button","ot-checklist-btn",{type:"button",text:J==="in_progress"?a:r});jt.disabled=J==="in_progress",jt.addEventListener("click",()=>{s?s(j.id):t.start(j.id)}),at.appendChild(jt)}A.appendChild(at)});const it=E.length>0&&z===E.length;it&&!v&&(v=!0,p?.()),it||(v=!1),w.hidden=it&&f,w.className=["ot-checklist",c?"ot-checklist--floating":"",y?"ot-checklist--collapsed":"",m].filter(Boolean).join(" ")};function $(E){y=E,I.textContent=y?"▸":"▾",I.setAttribute("aria-expanded",String(!y)),I.setAttribute("aria-label",y?"Expand checklist":"Collapse checklist"),C()}return $(y),et(w,d),b.add(t.on("event",C)),{...nt(w,b),refresh:C,setCollapsed:$,getProgress:()=>T}}function ai(i){const{layer:t,specs:e,links:n=[],title:s="Help & guides",searchPlaceholder:o="Search…",floating:r=!1,launcherGlyph:a="?",emptyMessage:c="Nothing matches that search.",locale:l="en",i18nResolver:u,container:f,className:h=""}=i,k=new tt;let d=!r,m="";const p=x("div","ot-hub-root"),b=x("div",`ot-hub ${r?"ot-hub--floating":""} ${h}`.trim()),y=x("div","ot-hub-header");y.appendChild(x("h3","ot-hub-title",{text:s}));const v=x("input","ot-hub-search");v.type="search",v.placeholder=o,v.setAttribute("aria-label",o),y.appendChild(v),b.appendChild(y);const w=x("ul","ot-hub-list");b.appendChild(w),p.appendChild(b);const A=x("button","ot-hub-launcher",{type:"button",text:a});r&&(A.setAttribute("aria-label",s),p.appendChild(A));const L=I=>I===void 0?"":ht(I,l,u,t.getContext()),N=()=>{if(b.hidden=!d,r&&(A.textContent=d?"×":a,A.setAttribute("aria-label",d?"Close help":s),A.setAttribute("aria-expanded",String(d))),!d)return;const I=m.trim().toLowerCase(),D=e??t.getSpecs(),R=(T,C)=>!I||T.toLowerCase().includes(I)||C.toLowerCase().includes(I);w.replaceChildren();let P=0;for(const T of D){const C=L(T.title),$=L(T.description);if(!R(C,$))continue;P+=1;const E=x("li"),G=x("button","ot-hub-item",{type:"button",text:`${t.hasSeen(T.id)?"↻ ":""}${C}`});$&&G.appendChild(x("span","ot-hub-item-desc",{text:$})),G.addEventListener("click",()=>{t.start(T.id),r&&O(!1)}),E.appendChild(G),w.appendChild(E)}for(const T of n){const C=T.description??"";if(!R(T.label,C))continue;P+=1;const $=x("li"),E=x("a","ot-hub-item",{text:`${T.label} ↗`});E.href=T.href,E.target="_blank",E.rel="noopener noreferrer",C&&E.appendChild(x("span","ot-hub-item-desc",{text:C})),$.appendChild(E),w.appendChild($)}P===0&&w.appendChild(x("li","ot-hub-empty",{text:c}))};function O(I){d=I,N()}return v.addEventListener("input",()=>{m=v.value,N()}),A.addEventListener("click",()=>O(!d)),N(),et(p,f),k.add(t.on("event",()=>{d&&N()})),{...nt(p,k),open:()=>O(!0),close:()=>O(!1),search(I){m=I,v.value=I,N()},refresh:N}}function ci(i){const{entries:t,title:e="What's new",floating:n=!0,launcherGlyph:s="✦",emptyMessage:o="Nothing new right now.",limit:r=20,allowHtml:a,locale:c="en",i18nResolver:l,storage:u,keyPrefix:f="ot-changelog",userId:h,container:k,className:d="",onRead:m}=i,p=new tt,b=new qt(u,f,h);let y=t,v=!n,w=!1;const A=x("div","ot-changelog-root"),L=x("div",`ot-changelog ${n?"ot-changelog--floating":""} ${d}`.trim());L.setAttribute("role","region"),L.setAttribute("aria-label",e);const N=x("div","ot-changelog-header");N.appendChild(x("h3","ot-changelog-title",{text:e})),L.appendChild(N);const O=x("ul","ot-changelog-list");L.appendChild(O),A.appendChild(L);const I=x("button","ot-changelog-launcher",{type:"button"}),D=x("span","ot-changelog-badge");if(D.setAttribute("aria-hidden","true"),n)I.appendChild(x("span","ot-changelog-glyph",{text:s})),I.appendChild(D),A.appendChild(I);else{const z=Z("ot-changelog-close","×",()=>E(!1));z.setAttribute("aria-label","Close"),N.appendChild(z)}const R=()=>y.slice(0,r),P=()=>w?R().filter(z=>b.shouldShow(z.id)).map(z=>z.id):[],T=()=>{const z=P().length;D.textContent=z>99?"99+":String(z),D.hidden=z===0,I.setAttribute("aria-label",z>0?`${e} (${z} unread)`:e),I.setAttribute("aria-expanded",String(v))},C=()=>{O.replaceChildren();const z=R();if(z.length===0){O.appendChild(x("li","ot-changelog-empty",{text:o}));return}for(const q of z){const it=w&&b.shouldShow(q.id),j=x("li",`ot-changelog-item${it?" ot-changelog-item--unread":""}`),rt=x("div","ot-changelog-meta");if(q.tag&&rt.appendChild(x("span","ot-changelog-tag",{text:q.tag})),q.date){const F=x("time","ot-changelog-date",{text:q.date});F.dateTime=q.date,rt.appendChild(F)}rt.childElementCount>0&&j.appendChild(rt),j.appendChild(x("h4","ot-changelog-entry-title",{text:q.title}));const J=x("div","ot-changelog-body"),at=St(q.content,F=>ht(F,c,l));if(J.appendChild(At(at,{allowHtml:a})),j.appendChild(J),q.href){const F=x("a","ot-changelog-link",{text:"Read more ↗"});F.href=q.href,F.target="_blank",F.rel="noopener noreferrer",j.appendChild(F)}O.appendChild(j)}},$=()=>{L.hidden=!v,T(),v&&C()};function E(z){if(v=z,L.hidden=!v,v){const q=P();if(C(),q.length>0){for(const it of q)b.markActed(it);m?.(q)}}T()}I.addEventListener("click",()=>E(!v)),et(A,k),$();let G=!0;return p.add(()=>{G=!1}),b.ready.then(()=>{G&&(w=!0,$())}),{...nt(A,p),open:()=>E(!0),close:()=>E(!1),unread:P,markAllRead(){for(const z of R())b.markActed(z.id);$()},setEntries(z){y=z,$()}}}const li=["specs","context","theme","locale","dir","z-index","interaction","auto-start","deep-link-param","resume","auto-resume","isolate","allow-html","debug"];function ut(i,t){if(!i)return t;try{return JSON.parse(i)}catch{return t}}class di extends HTMLElement{constructor(){super(...arguments);g(this,"layer",null);g(this,"_specs",[]);g(this,"_context",{})}static get observedAttributes(){return li}set specs(e){this._specs=Array.isArray(e)?e:[],this.rebuild()}get specs(){return this._specs}set context(e){this._context=e??{},this.layer?.setContext(this._context)}get context(){return this._context}connectedCallback(){this.style.display="none",this.rebuild()}disconnectedCallback(){this.layer?.destroy(),this.layer=null}attributeChangedCallback(e){if(this.isConnected){if(e==="context"){this._context=ut(this.getAttribute("context"),{}),this.layer?.setContext(this._context);return}if(e==="locale"){const n=this.getAttribute("locale");n&&this.layer?.setLocale(n);return}this.rebuild()}}collectSpecs(){if(this._specs.length>0)return this._specs;const e=ut(this.getAttribute("specs"),null);if(e)return Array.isArray(e)?e:[e];const n=[];for(const s of Array.from(this.querySelectorAll('script[type="application/json"]'))){const o=ut(s.textContent,null);o&&n.push(...Array.isArray(o)?o:[o])}return n}rebuild(){if(!this.isConnected)return;this.layer?.destroy();const e=this.collectSpecs();if(e.length===0){this.layer=null;return}const n=a=>this.hasAttribute(a)&&this.getAttribute(a)!=="false",s=Number(this.getAttribute("z-index")),o=this.getAttribute("deep-link-param");this.layer=be({specs:e,context:{...ut(this.getAttribute("context"),{}),...this._context},theme:ut(this.getAttribute("theme"),void 0),locale:this.getAttribute("locale")??void 0,dir:this.getAttribute("dir")??void 0,zIndex:Number.isFinite(s)&&s>0?s:void 0,interaction:this.getAttribute("interaction")??void 0,deepLinkParam:o==="false"?!1:o??void 0,resume:n("resume"),autoResume:n("auto-resume"),isolate:n("isolate"),allowHtml:n("allow-html"),debug:n("debug"),onEvent:a=>{this.dispatchEvent(new CustomEvent("opentutorial",{detail:a,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent(`ot-${a.type}`,{detail:a,bubbles:!0,composed:!0}))}});const r=this.getAttribute("auto-start");r&&this.layer.ready.then(()=>this.layer?.request(r))}start(e,n){this.layer?.start(e,n)}stop(){this.layer?.stop()}pause(){this.layer?.pause()}resumeTour(){this.layer?.resume()}next(){this.layer?.next()}prev(){this.layer?.prev()}reset(){this.layer?.reset()}getState(e){return this.layer?.getState(e)??null}getLayer(){return this.layer}}function Se(i="open-tutorial"){typeof customElements>"u"||customElements.get(i)||customElements.define(i,di)}Se(),we(),queueMicrotask(()=>{const i=globalThis;i.OpenTutorial&&!i.Opentutorial&&(i.Opentutorial=i.OpenTutorial)}),S.CSS=_,S.TourEngine=Rt,S.TourOrchestrator=Dt,S.TourPersistence=Lt,S.assertValidSpec=un,S.auditSelectors=Fn,S.bestSelector=Pt,S.createAmplitudeAdapter=Kn,S.createAnnouncement=ii,S.createBanner=ni,S.createChangelog=ci,S.createChecklist=ri,S.createCookieStorage=Rn,S.createDebugPanel=Un,S.createEventCollector=ei,S.createFunnelReport=Ee,S.createGA4Adapter=Xn,S.createHint=si,S.createHttpAdapter=Zn,S.createIndexedDBStorage=Dn,S.createMixpanelAdapter=Jn,S.createMultiAdapter=Qn,S.createPostHogAdapter=Gn,S.createRemoteStorage=Bn,S.createResourceCenter=ai,S.createSegmentAdapter=Yn,S.createSurvey=oi,S.createTour=Nn,S.createTours=zn,S.createTutorialLayer=be,S.defineOpenTutorialElement=Se,S.defineSpec=Mn,S.enableRecorderFromUrl=we,S.evaluateExpression=lt,S.evaluateShowIf=K,S.logEvents=Vn,S.resolveTarget=W,S.startRecorder=xe,S.validateSpec=yt,S.validateSpecs=pn,S.waitForTarget=bt,Object.defineProperty(S,Symbol.toStringTag,{value:"Module"})})(this.OpenTutorial=this.OpenTutorial||{});
//# sourceMappingURL=opentutorial.global.js.map
