var ai=Object.defineProperty;var ci=(S,j,X)=>j in S?ai(S,j,{enumerable:!0,configurable:!0,writable:!0,value:X}):S[j]=X;var f=(S,j,X)=>ci(S,typeof j!="symbol"?j+"":j,X);(function(S){"use strict";const j=`
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
`.trim();let X=0;class vt{constructor(t,e={}){f(this,"root");f(this,"host");f(this,"shadow",null);f(this,"svg");f(this,"dimRect");f(this,"mask");f(this,"hole");f(this,"holes",[]);f(this,"ring");f(this,"rings",[]);f(this,"shield");f(this,"panels",[]);f(this,"current",null);f(this,"currentAll",[]);f(this,"interaction","free");f(this,"opts");X+=1;const i=`ot-mask-${X}`;if(this.opts=e,this.root=document.createElement("div"),this.root.className="ot-root",this.root.style.setProperty("--ot-z",String(t)),this.root.setAttribute("data-opentutorial",""),e.dir&&this.root.setAttribute("dir",e.dir),e.isolate){this.host=document.createElement("div"),this.host.setAttribute("data-opentutorial-host",""),this.host.style.cssText="position:fixed;inset:0;pointer-events:none;",this.host.style.zIndex=String(t);try{this.shadow=this.host.attachShadow({mode:"open"});const c=document.createElement("style");c.textContent=j,this.shadow.appendChild(c),this.shadow.appendChild(this.root)}catch{this.shadow=null,this.host=this.root}}else this.host=this.root;const o="http://www.w3.org/2000/svg";this.svg=document.createElementNS(o,"svg"),this.svg.setAttribute("class","ot-backdrop"),this.svg.setAttribute("width","100%"),this.svg.setAttribute("height","100%"),this.svg.setAttribute("aria-hidden","true");const s=document.createElementNS(o,"defs"),r=document.createElementNS(o,"mask");r.setAttribute("id",i);const a=document.createElementNS(o,"rect");a.setAttribute("x","0"),a.setAttribute("y","0"),a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("fill","white"),this.mask=r,this.hole=this.addHole(),r.appendChild(a),r.appendChild(this.hole),s.appendChild(r),this.dimRect=document.createElementNS(o,"rect"),this.dimRect.setAttribute("class","ot-dim"),this.dimRect.setAttribute("x","0"),this.dimRect.setAttribute("y","0"),this.dimRect.setAttribute("width","100%"),this.dimRect.setAttribute("height","100%"),this.dimRect.setAttribute("mask",`url(#${i})`),this.svg.appendChild(s),this.svg.appendChild(this.dimRect),this.ring=document.createElement("div"),this.ring.className="ot-ring",this.ring.style.opacity="0",this.rings.push(this.ring),this.shield=document.createElement("div"),this.shield.className="ot-shield",this.shield.style.display="none";for(let c=0;c<4;c+=1){const l=document.createElement("div");l.className="ot-shield-panel",this.panels.push(l),this.shield.appendChild(l)}this.root.appendChild(this.svg),this.root.appendChild(this.ring),this.root.appendChild(this.shield),this.svg.style.display="none"}addHole(){const t=document.createElementNS("http://www.w3.org/2000/svg","rect");return t.setAttribute("fill","black"),t.setAttribute("rx","12"),t.setAttribute("x","-9999"),t.setAttribute("y","-9999"),t.setAttribute("width","0"),t.setAttribute("height","0"),this.holes.push(t),this.mask&&this.mask.appendChild(t),t}addRing(){const t=document.createElement("div");return t.className="ot-ring",t.style.opacity="0",this.rings.push(t),this.root.appendChild(t),t}setHole(t,e,i=this.hole){i.setAttribute("x",String(t.x-e)),i.setAttribute("y",String(t.y-e)),i.setAttribute("width",String(Math.max(0,t.width+e*2))),i.setAttribute("height",String(Math.max(0,t.height+e*2)))}static union(t){const e=Math.min(...t.map(r=>r.x)),i=Math.min(...t.map(r=>r.y)),o=Math.max(...t.map(r=>r.x+r.width)),s=Math.max(...t.map(r=>r.y+r.height));return{x:e,y:i,width:o-e,height:s-i}}updateSpotlight(t,e=8,i=12){const o=t===null?[]:Array.isArray(t)?t:[t];if(this.currentAll=o,o.length===0){this.current=null;for(const s of this.holes)this.setHole({x:-9999,y:-9999,width:0,height:0},0,s);for(const s of this.rings)s.style.opacity="0";this.svg.style.display="none",this.applyShield();return}for(this.current={...vt.union(o),padding:e,radius:i},this.svg.style.display="";this.holes.length<o.length;)this.addHole();for(;this.rings.length<o.length;)this.addRing();o.forEach((s,r)=>{const a=this.holes[r];this.setHole(s,e,a),a.setAttribute("rx",String(i));const c=this.rings[r].style;c.opacity="1",c.left=`${s.x-e}px`,c.top=`${s.y-e}px`,c.width=`${s.width+e*2}px`,c.height=`${s.height+e*2}px`,c.borderRadius=`${i}px`});for(let s=o.length;s<this.holes.length;s+=1)this.setHole({x:-9999,y:-9999,width:0,height:0},0,this.holes[s]),this.rings[s].style.opacity="0";this.applyShield()}showBackdrop(){this.current=null,this.svg.style.display="",this.setHole({x:-9999,y:-9999,width:0,height:0},0),this.ring.style.opacity="0",this.applyShield()}setInteraction(t){this.interaction=t,this.applyShield()}applyShield(){if(this.interaction==="free"){this.shield.style.display="none";return}this.shield.style.display="";const t=window.innerWidth,e=window.innerHeight,i=this.interaction==="target-only"&&this.current?{x:this.current.x-this.current.padding,y:this.current.y-this.current.padding,width:this.current.width+this.current.padding*2,height:this.current.height+this.current.padding*2}:{x:t,y:e,width:0,height:0},[o,s,r,a]=this.panels,c=(l,h,d,p,E)=>{l.style.left=`${h}px`,l.style.top=`${d}px`,l.style.width=`${Math.max(0,p)}px`,l.style.height=`${Math.max(0,E)}px`};c(o,0,0,t,i.y),c(r,0,i.y+i.height,t,e-(i.y+i.height)),c(a,0,i.y,i.x,i.height),c(s,i.x+i.width,i.y,t-(i.x+i.width),i.height)}refresh(){this.current?this.updateSpotlight(this.currentAll.length>1?this.currentAll:this.current,this.current.padding,this.current.radius):this.applyShield()}getSpotlightRects(){return this.currentAll}mountPopover(t){this.root.appendChild(t)}setBackdropColor(t){this.dimRect.style.fill=t}setDir(t){this.root.setAttribute("dir",t)}attach(t){(t??this.opts.container??document.body).appendChild(this.host)}destroy(){this.host.remove()}}const Se={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function ht(n){return n.replace(/[&<>"']/g,t=>Se[t]??t)}const Ht=/^(javascript|vbscript|data|file|blob)\s*:/i;function jt(n){let t="";for(const e of n)e.charCodeAt(0)>32&&(t+=e);return t}function $e(n){const t=n.trim();return Ht.test(jt(t))?null:t}function Ae(n){const t=jt(n.trim());return/^data:image\/(png|jpe?g|gif|webp|avif);/i.test(t)?n.trim():Ht.test(t)?null:n.trim()}function Y(n,t={}){if(typeof n!="string")return"";let e=ht(n);return e=e.replace(/!\[([^\]]*)\]\(([^\s)]+)\)/g,(i,o,s)=>{const r=Ae(s);return r?`<img class="ot-inline-img" src="${r}" alt="${o}">`:i}),e=e.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(i,o,s)=>{const r=$e(s);if(!r)return i;const c=/^(https?:)?\/\//i.test(r)?' target="_blank" rel="noopener noreferrer"':"";return`<a href="${r}"${c}>${o}</a>`}),e=e.replace(/\*\*([^\s*][^*]*?[^\s*]|[^\s*])\*\*/g,"<strong>$1</strong>"),e=e.replace(/(^|[^*])\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*/g,"$1<em>$2</em>"),e=e.replace(/~~([^~]+)~~/g,"<s>$1</s>"),e=e.replace(/`([^`]+)`/g,"<code>$1</code>"),t.breaks!==!1&&(e=e.replace(/\r?\n/g,"<br>")),e}const _t=/^(#{1,6})\s+(.*)$/,Ft=/^\s*(`{3,}|~{3,})\s*([\w+-]*)\s*$/,Ut=/^\s*(-{3,}|\*{3,}|_{3,})\s*$/,yt=/^\s*[-*+]\s+(.*)$/,at=/^\s*(\d+)\.\s+(.*)$/,ut=/^\s*>\s?(.*)$/,xt=n=>Y(n,{breaks:!1});function Wt(n){if(typeof n!="string"||n==="")return"";const t=n.replace(/\r\n?/g,`
`).split(`
`),e=[];let i=[];const o=()=>{i.length!==0&&(e.push(`<p class="ot-content">${xt(i.join(`
`)).replace(/\n/g,"<br>")}</p>`),i=[])};for(let s=0;s<t.length;s+=1){const r=t[s],a=Ft.exec(r);if(a){o();const l=a[1][0],h=a[2],d=[];for(s+=1;s<t.length&&!new RegExp(`^\\s*${l}{3,}\\s*$`).test(t[s]);)d.push(t[s]),s+=1;const p=h?` class="language-${ht(h)}"`:"";e.push(`<pre class="ot-code"><code${p}>${ht(d.join(`
`))}</code></pre>`);continue}if(Ut.test(r)){o(),e.push('<hr class="ot-divider">');continue}const c=_t.exec(r);if(c){o();const l=c[1].length;e.push(`<h${l} class="ot-heading ot-heading--${l}">${xt(c[2])}</h${l}>`);continue}if(ut.test(r)){o();const l=[];for(;s<t.length&&ut.test(t[s]);)l.push(ut.exec(t[s])[1]),s+=1;s-=1,e.push(`<blockquote class="ot-quote">${Wt(l.join(`
`))}</blockquote>`);continue}if(yt.test(r)||at.test(r)){o();const l=at.test(r),h=[];for(;s<t.length;){const y=t[s],w=l?at.exec(y):yt.exec(y);if(!w)break;h.push(`<li>${xt(l?w[2]:w[1])}</li>`),s+=1}s-=1;const d=l?"ol":"ul",p=l?Number(at.exec(r)[1]):1,E=l&&p!==1?` start="${p}"`:"";e.push(`<${d} class="ot-list"${E}>${h.join("")}</${d}>`);continue}if(r.trim()===""){o();continue}i.push(r)}return o(),e.join("")}function Ce(n){return typeof n!="string"?!1:n.split(/\r?\n/).some(t=>_t.test(t)||Ft.test(t)||Ut.test(t)||yt.test(t)||at.test(t)||ut.test(t))}function wt(n,t){return n&&typeof n=="object"&&"blocks"in n&&Array.isArray(n.blocks)?n.blocks.map(e=>{switch(e.type){case"text":return{type:"text",value:t(e.value)};case"list":return{...e,items:e.items.map(i=>t(i))};default:return e}}):[{type:"text",value:t(n)}]}function Ie(n){return n.map(t=>{switch(t.type){case"text":return typeof t.value=="string"?t.value:"";case"list":return t.items.filter(e=>typeof e=="string").join(", ");case"code":return t.value;case"image":return t.alt;default:return""}}).filter(Boolean).join(" ")}function kt(n,t={}){const e=t.doc??document,i=e.createDocumentFragment();for(const o of n)switch(o.type){case"text":{const s=typeof o.value=="string"?o.value:"";if(t.markdown!=="inline"&&Ce(s)){const r=e.createElement("div");r.className="ot-prose",r.innerHTML=Wt(s),i.appendChild(r)}else{const r=e.createElement("p");r.className="ot-content",r.innerHTML=Y(s),i.appendChild(r)}break}case"image":{const s=e.createElement("img");s.className="ot-media ot-media-image",s.src=o.src,s.alt=o.alt,s.loading="lazy",o.width&&(s.width=o.width),o.height&&(s.height=o.height),i.appendChild(s);break}case"video":{const s=e.createElement("video");s.className="ot-media ot-media-video",s.src=o.src,o.poster&&(s.poster=o.poster),s.controls=o.controls??!0,s.loop=o.loop??!1,s.muted=o.muted??o.autoplay??!1,s.playsInline=!0,o.autoplay&&(s.autoplay=!0,s.muted=!0),i.appendChild(s);break}case"list":{const s=e.createElement(o.ordered?"ol":"ul");s.className="ot-list";for(const r of o.items){const a=e.createElement("li");a.innerHTML=Y(typeof r=="string"?r:""),s.appendChild(a)}i.appendChild(s);break}case"code":{const s=e.createElement("pre");s.className="ot-code";const r=e.createElement("code");o.lang&&(r.dataset.lang=o.lang),r.textContent=o.value,s.appendChild(r),i.appendChild(s);break}case"divider":{const s=e.createElement("hr");s.className="ot-divider",i.appendChild(s);break}case"html":{const s=e.createElement("div");s.className="ot-html",s.innerHTML=t.allowHtml?o.value:ht(o.value),i.appendChild(s);break}}return i}const Te=240,Oe=460,Le=.7,Ne=56,ze=44,Me=700,Re=14,W=10;function Pe(n){if(n==="auto"||n==="center")return{side:"auto",align:"center"};const[t,e]=n.split("-");return{side:t,align:e??"center"}}function De(n){return{top:"bottom",bottom:"top",left:"right",right:"left"}[n]}function Be(n){return n==="left"?"right":n==="right"?"left":n}class qe{constructor(t,e="ltr",i={}){f(this,"el");f(this,"titleEl");f(this,"contentEl");f(this,"progressEl");f(this,"liveEl");f(this,"backBtn");f(this,"nextBtn");f(this,"skipBtn");f(this,"arrow");f(this,"lastSide",null);f(this,"cbs");f(this,"dir");f(this,"model",null);f(this,"detachSwipe",null);f(this,"autoSize",!0);this.cbs=t,this.dir=e,this.autoSize=i.autoSize!==!1,this.el=document.createElement("div"),this.el.className="ot-popover",this.el.setAttribute("role","dialog"),this.el.tabIndex=-1,this.arrow=document.createElement("div"),this.arrow.className="ot-arrow";const o=document.createElement("div");o.className="ot-body",this.skipBtn=document.createElement("button"),this.skipBtn.type="button",this.skipBtn.className="ot-skip",this.skipBtn.setAttribute("aria-label","Close tour"),this.skipBtn.innerHTML="&times;",this.skipBtn.addEventListener("click",()=>this.cbs.onSkip()),this.titleEl=document.createElement("h2"),this.titleEl.className="ot-title",this.titleEl.id=`ot-title-${Math.random().toString(36).slice(2,8)}`,this.el.setAttribute("aria-labelledby",this.titleEl.id),this.contentEl=document.createElement("div"),this.contentEl.className="ot-content-wrap",this.progressEl=document.createElement("div"),this.progressEl.className="ot-dots",this.progressEl.setAttribute("aria-hidden","true"),this.liveEl=document.createElement("span"),this.liveEl.className="ot-sr-only",this.liveEl.setAttribute("aria-live","polite"),this.liveEl.setAttribute("aria-atomic","true"),this.backBtn=document.createElement("button"),this.backBtn.type="button",this.backBtn.className="ot-btn ot-btn-ghost",this.backBtn.addEventListener("click",()=>this.cbs.onPrev()),this.nextBtn=document.createElement("button"),this.nextBtn.type="button",this.nextBtn.className="ot-btn ot-btn-primary",this.nextBtn.addEventListener("click",()=>this.cbs.onNext());const s=document.createElement("div");s.className="ot-footer";const r=document.createElement("div");r.className="ot-btns",r.appendChild(this.backBtn),r.appendChild(this.nextBtn),s.appendChild(this.progressEl),s.appendChild(r),o.appendChild(this.skipBtn),o.appendChild(this.titleEl),o.appendChild(this.contentEl),o.appendChild(this.liveEl),o.appendChild(s),this.el.appendChild(this.arrow),this.el.appendChild(o),i.swipe!==!1&&this.installSwipe()}installSwipe(){let t=0,e=0,i=0,o=!1;const s=a=>{if(a.touches.length!==1){o=!1;return}const c=a.target;if(c?.closest("button, a, input, textarea, select, video, audio, [data-ot-no-swipe]")){o=!1;return}if(c&&this.isScrollableX(c)){o=!1;return}o=!0,t=a.touches[0].clientX,e=a.touches[0].clientY,i=Date.now()},r=a=>{if(!o)return;o=!1;const c=a.changedTouches[0];if(!c)return;const l=c.clientX-t,h=c.clientY-e;if(Date.now()-i>Me||Math.abs(h)>ze||Math.abs(l)<Ne)return;const d=this.dir==="rtl"?l>0:l<0,p=this.model;p&&(d?p.showNext&&this.cbs.onNext():p.showBack&&p.canGoBack&&p.index>0&&this.cbs.onPrev())};this.el.addEventListener("touchstart",s,{passive:!0}),this.el.addEventListener("touchend",r,{passive:!0}),this.detachSwipe=()=>{this.el.removeEventListener("touchstart",s),this.el.removeEventListener("touchend",r)}}isScrollableX(t){let e=t;for(;e&&e!==this.el;){if(e.scrollWidth>e.clientWidth+1)return!0;e=e.parentElement}return!1}setDir(t){this.dir=t}render(t){this.model=t,this.titleEl.textContent=t.title,this.contentEl.replaceChildren(kt(t.blocks,{allowHtml:t.allowHtml})),this.liveEl.textContent=`${t.title}. Step ${t.index+1} of ${t.total}`,this.progressEl.replaceChildren();for(let i=0;i<t.total;i+=1){const o=document.createElement("span");o.className=`ot-dot${i===t.index?" ot-dot-active":""}`,this.progressEl.appendChild(o)}const e=t.showBack&&t.canGoBack&&t.index>0;this.backBtn.style.display=e?"":"none",this.backBtn.textContent=t.labels.back,this.nextBtn.style.display=t.showNext?"":"none",this.nextBtn.textContent=t.isLast?t.labels.done:t.labels.next,this.skipBtn.style.display=t.skippable?"":"none",this.skipBtn.setAttribute("aria-label",t.labels.skip),this.el.setAttribute("aria-modal",t.modal?"true":"false"),this.el.classList.toggle("ot-popover--modal-step",t.modal),t.density?this.el.dataset.otDensity=t.density:delete this.el.dataset.otDensity,this.applyAutoSize()}applyAutoSize(){const t=this.el.ownerDocument?.defaultView??window,e=t.innerHeight,i=t.innerWidth,o=i<=480;if(this.el.style.maxHeight=`${Math.round(e*Le)}px`,!this.autoSize||o){this.el.style.width="";return}this.el.style.width="max-content";const s=this.el.offsetWidth;this.el.style.width="";const r=Math.min(Oe,i-W*2),a=Math.min(Te,r),c=Math.max(a,Math.min(s,r));this.el.style.width=`${Math.round(c)}px`}position(t,e,i){const o=window.innerWidth,s=window.innerHeight,r=this.el.offsetWidth,a=this.el.offsetHeight;if(!t||e==="center"){this.lastSide="modal",this.el.classList.add("ot-modal"),this.arrow.style.display="none",this.el.style.left=`${Math.max(W,(o-r)/2)}px`,this.el.style.top=`${Math.max(W,(s-a)/2)}px`;return}this.el.classList.remove("ot-modal"),this.arrow.style.display="";const c=Pe(e),l=this.dir==="rtl"?Be(c.side):c.side,h=c.align,d=Re+i,p={top:t.y,bottom:s-(t.y+t.height),left:t.x,right:o-(t.x+t.width)};let y=l==="auto"?["bottom","right","top","left"].reduce((x,$)=>p[$]>p[x]?$:x,"bottom"):l;const w=m=>m==="top"||m==="bottom"?p[m]>=a+d:p[m]>=r+d;if(!w(y)){const m=De(y);w(m)?y=m:y=Object.keys(p).reduce((x,$)=>p[x]>=p[$]?x:$)}let u=0,g=0;const b=(m,x,$)=>h==="start"?this.dir==="rtl"?m+x-$:m:h==="end"?this.dir==="rtl"?m:m+x-$:m+x/2-$/2;y==="top"||y==="bottom"?(u=b(t.x,t.width,r),g=y==="top"?t.y-a-d:t.y+t.height+d):(g=b(t.y,t.height,a),u=y==="left"?t.x-r-d:t.x+t.width+d),u=Math.min(Math.max(u,W),Math.max(W,o-r-W)),g=Math.min(Math.max(g,W),Math.max(W,s-a-W)),this.el.style.left=`${u}px`,this.el.style.top=`${g}px`,this.lastSide=y,this.positionArrow(y,t,u,g,r,a)}positionArrow(t,e,i,o,s,r){const a=this.arrow.style;a.top="",a.bottom="",a.left="",a.right="",this.arrow.dataset.side=t;const c=e.x+e.width/2,l=e.y+e.height/2;t==="top"?(a.bottom="-5px",a.left=`${Math.min(Math.max(c-i,16),Math.max(16,s-16))}px`):t==="bottom"?(a.top="-5px",a.left=`${Math.min(Math.max(c-i,16),Math.max(16,s-16))}px`):t==="left"?(a.right="-5px",a.top=`${Math.min(Math.max(l-o,16),Math.max(16,r-16))}px`):(a.left="-5px",a.top=`${Math.min(Math.max(l-o,16),Math.max(16,r-16))}px`)}getSide(){return this.lastSide}destroy(){this.detachSwipe?.(),this.detachSwipe=null,this.el.remove()}}class He{constructor(){f(this,"el");f(this,"beaconEl");f(this,"tooltipEl",null);f(this,"textEl",null);f(this,"dismissBtn",null);f(this,"lastRect",null);f(this,"hasTooltip",!1);f(this,"onDismiss",null);this.el=document.createElement("div"),this.el.className="ot-hotspot",this.beaconEl=document.createElement("button"),this.beaconEl.type="button",this.beaconEl.className="ot-beacon",this.beaconEl.addEventListener("click",()=>this.onDismiss?.()),this.el.appendChild(this.beaconEl)}render(t,e){this.lastRect=e,this.onDismiss=t.onDismiss??null,this.beaconEl.className=`ot-beacon ot-beacon--${t.display}`,this.el.style.left=`${e.x+e.width/2}px`,this.el.style.top=`${e.y+e.height/2}px`,this.el.style.pointerEvents="auto";const i=t.content?.trim()||"Show me";this.beaconEl.setAttribute("aria-label",i),t.display==="beacon"?(this.hasTooltip=!1,this.tooltipEl&&(this.tooltipEl.style.display="none"),this.beaconEl.title=t.content??""):(this.hasTooltip=!0,this.buildTooltip(t),this.positionTooltip(e))}buildTooltip(t){this.tooltipEl||(this.tooltipEl=document.createElement("div"),this.tooltipEl.className="ot-hotspot-tooltip",this.tooltipEl.setAttribute("role","status"),this.textEl=document.createElement("span"),this.textEl.className="ot-hotspot-text",this.tooltipEl.appendChild(this.textEl),this.el.appendChild(this.tooltipEl)),this.tooltipEl.style.display="flex",this.textEl&&(this.textEl.innerHTML=Y(t.content??"")),t.showDismiss||t.display==="hotspot"?(this.dismissBtn||(this.dismissBtn=document.createElement("button"),this.dismissBtn.type="button",this.dismissBtn.className="ot-hotspot-dismiss",this.dismissBtn.textContent="→",this.dismissBtn.setAttribute("aria-label","Next step"),this.dismissBtn.addEventListener("click",()=>this.onDismiss?.())),this.tooltipEl.appendChild(this.dismissBtn)):this.dismissBtn?.parentNode&&this.dismissBtn.remove()}positionTooltip(t){if(!this.tooltipEl)return;const e=window.innerWidth,i=this.tooltipEl.offsetWidth||200,o=t.x+t.width/2,s=e-(o+16),r=o-16;s>i?(this.tooltipEl.style.left="12px",this.tooltipEl.style.right="auto"):r>i?(this.tooltipEl.style.right="12px",this.tooltipEl.style.left="auto"):(this.tooltipEl.style.left=`${Math.max(8,-(o-8))}px`,this.tooltipEl.style.right="auto"),this.tooltipEl.style.top="16px"}reposition(t){this.lastRect&&(this.lastRect=t,this.el.style.left=`${t.x+t.width/2}px`,this.el.style.top=`${t.y+t.height/2}px`,this.hasTooltip&&this.positionTooltip(t))}focus(){this.beaconEl.focus({preventScroll:!0})}destroy(){this.onDismiss=null,this.el.remove()}}const je='button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';function _e(n){if(!n)return!1;if(n.isContentEditable)return!0;const t=n.tagName;if(t==="TEXTAREA"||t==="SELECT")return!0;if(t!=="INPUT")return!1;const e=n.type;return!["button","submit","reset","checkbox","radio","file"].includes(e)}function Fe(n,t={}){const e=document.activeElement,i=t.trap!==!1,o=()=>Array.from(n.querySelectorAll(je)).filter(r=>r.getClientRects().length>0||r===document.activeElement),s=r=>{const a=n.getRootNode().activeElement??document.activeElement;if(r.key==="Escape"){t.onEscape?.(),r.stopPropagation();return}if(_e(a))return;if(r.key==="ArrowRight"){t.onArrowNext?.(),r.preventDefault();return}if(r.key==="ArrowLeft"){t.onArrowPrev?.(),r.preventDefault();return}if(r.key==="Enter"&&a===n){t.onArrowNext?.(),r.preventDefault();return}if(r.key!=="Tab"||!i)return;const c=o();if(!c.length){r.preventDefault();return}const l=c[0],h=c[c.length-1];r.shiftKey&&(a===l||!n.contains(a))?(h.focus(),r.preventDefault()):!r.shiftKey&&a===h&&(l.focus(),r.preventDefault())};return n.addEventListener("keydown",s),t.autoFocus!==!1&&n.focus({preventScroll:!0}),()=>{n.removeEventListener("keydown",s);const r=document.activeElement;(!r||r===document.body||n.contains(r))&&e?.focus?.({preventScroll:!0})}}const Ue="button, a, [role], label, summary, h1, h2, h3, h4, h5, h6, p, li, td, th, span, div";function We(n,t=document){try{return t.querySelector(n)}catch{return null}}function it(n,t=document){try{return Array.from(t.querySelectorAll(n))}catch{return[]}}function Vt(n,t=document){const e=it(n,t),i=new Set,o=s=>{for(const r of it("*",s)){const a=r.shadowRoot;!a||i.has(a)||(i.add(a),e.push(...it(n,a)),o(a))}};return o(t),[...new Set(e)]}function pt(n){const t=n.getBoundingClientRect();if(t.width===0&&t.height===0)return!1;const e=n.ownerDocument?.defaultView;if(!e)return!0;const i=e.getComputedStyle(n);return i.visibility!=="hidden"&&i.display!=="none"&&i.opacity!=="0"}function Et(n){return n.replace(/\s+/g," ").trim().toLowerCase()}function Gt(n,t,e){const i=Et(n);if(!i)return null;const s=(t??it(Ue,e)).filter(c=>Et(c.textContent??"").includes(i));if(s.length===0)return null;const r=s.filter(c=>Et(c.textContent??"")===i);return(r.length?r:s).reduce((c,l)=>c.contains(l)?l:c)}function St(n){if(!n.iframe)return{doc:document,offset:{x:0,y:0}};const t=We(n.iframe);if(!t)return null;try{const e=t.contentDocument;if(!e)return null;const i=t.getBoundingClientRect();return{doc:e,offset:{x:i.x,y:i.y}}}catch{return null}}function F(n){const t=St(n);if(!t)return null;const{doc:e,offset:i}=t,o=n.selector?Array.isArray(n.selector)?n.selector:[n.selector]:[],s=r=>{const a=n.visible?r.filter(pt):r;return a.length===0?null:a[n.index??0]??null};for(const r of o){const a=n.shadow?Vt(r,e):it(r,e);if(n.text){const l=Gt(n.text,n.visible?a.filter(pt):a,e);if(l)return{element:l,doc:e,frameOffset:i,matched:r};continue}const c=s(a);if(c)return{element:c,doc:e,frameOffset:i,matched:r}}if(o.length===0&&n.text){const r=Gt(n.text,null,e);if(r&&(!n.visible||pt(r)))return{element:r,doc:e,frameOffset:i,matched:`text:${n.text}`}}return null}function Ve(n){if(!n.all){const r=F(n);return r?[r]:[]}const t=St(n);if(!t)return[];const{doc:e,offset:i}=t,o=n.selector?Array.isArray(n.selector)?n.selector:[n.selector]:[];for(const r of o){const a=n.shadow?Vt(r,e):it(r,e),c=n.visible?a.filter(pt):a;if(c.length>0)return c.map(l=>({element:l,doc:e,frameOffset:i,matched:r}))}const s=F(n);return s?[s]:[]}function Kt(n){const t=[];return n.selector&&t.push(Array.isArray(n.selector)?n.selector.join(" | "):n.selector),n.text&&t.push(`text "${n.text}"`),n.iframe&&t.push(`in iframe ${n.iframe}`),t.join(" + ")||"(no selector)"}function ft(n,t=5e3){return new Promise(e=>{const i=F(n);if(i){e(i);return}let o=!1,s=null;const r=h=>{o||(o=!0,s?.disconnect(),clearInterval(c),clearTimeout(l),e(h))},a=()=>{const h=F(n);h&&r(h)};try{s=new MutationObserver(a);const h=n.iframe?St(n)?.doc.documentElement??document.documentElement:document.documentElement;s.observe(h,{childList:!0,subtree:!0,attributes:!0})}catch{}const c=setInterval(a,100),l=setTimeout(()=>r(null),t)})}const $t="opentutorial:locationchange";let Jt=!1;function Ge(){if(Jt||typeof history>"u")return;Jt=!0;const n=()=>{try{window.dispatchEvent(new Event($t))}catch{}};for(const t of["pushState","replaceState"]){const e=history[t];typeof e=="function"&&(history[t]=function(...o){const s=e.apply(this,o);return n(),s})}}function Xt(){return typeof location>"u"?"":location.pathname+location.search+location.hash}function Yt(n,t,e=!1){if(!n)return!1;const i=t.split("#")[0];if(n.endsWith("*"))return i.startsWith(n.slice(0,-1));if(n.includes(":")){const s=n.split("/").map(r=>r.startsWith(":")?"[^/]+":r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("/");try{return new RegExp(`^${s}${e?"$":"(/|$|\\?)"}`).test(i)}catch{return!1}}const o=i.split("?")[0];return e?o===n:o.startsWith(n)}function Qt(n){return typeof window>"u"?()=>{}:(Ge(),window.addEventListener("popstate",n),window.addEventListener("hashchange",n),window.addEventListener($t,n),()=>{window.removeEventListener("popstate",n),window.removeEventListener("hashchange",n),window.removeEventListener($t,n)})}class At{constructor(){f(this,"map",new Map)}getItem(t){return this.map.get(t)??null}setItem(t,e){this.map.set(t,e)}removeItem(t){this.map.delete(t)}}function Zt(){try{if(typeof localStorage<"u"){const n="__ot_probe__";return localStorage.setItem(n,"1"),localStorage.removeItem(n),localStorage}}catch{}return new At}function Ct(){return{v:2,tours:{},progress:{}}}class It{constructor(t,e="ot",i){f(this,"ready");f(this,"storage");f(this,"prefix");f(this,"userId");f(this,"root",Ct());f(this,"hydrated",!1);this.storage=t??Zt(),this.prefix=e,this.userId=i,this.ready=this.hydrate()}key(){return this.userId?`${this.prefix}:u:${this.userId}`:`${this.prefix}:anon`}legacyKey(){return`${this.prefix}:tours`}setUser(t){return t===this.userId?this.ready:(this.userId=t,this.root=Ct(),this.hydrated=!1,this.hydrate())}getUser(){return this.userId}parse(t){if(typeof t!="string"||!t)return null;try{const e=JSON.parse(t);if(!e||typeof e!="object")return null;if(e.v===2)return{v:2,tours:e.tours??{},progress:e.progress??{},active:e.active};if(e.v===1)return{v:2,tours:e.tours??{},progress:{}}}catch{}return null}async hydrate(){try{const t=await Promise.resolve(this.storage.getItem(this.key())),e=this.parse(t);if(e){this.root=e,this.hydrated=!0;return}if(!this.userId){const i=this.parse(await Promise.resolve(this.storage.getItem(this.legacyKey())));if(i){this.root=i,this.hydrated=!0,this.save();try{this.storage.removeItem(this.legacyKey())}catch{}return}}}catch{}this.hydrated=!0}isHydrated(){return this.hydrated}save(){try{this.storage.setItem(this.key(),JSON.stringify(this.root))}catch{}}mark(t,e,i){const o=this.root.tours[t];this.root.tours[t]={status:e,version:i,at:Date.now(),shownCount:o?.shownCount??0,lastShownAt:o?.lastShownAt},delete this.root.progress[t],this.root.active?.tourId===t&&delete this.root.active,this.save()}markShown(t,e){const i=this.root.tours[t];this.root.tours[t]={status:i?.status??"skipped",version:i?.version??e,at:i?.at??0,shownCount:(i?.shownCount??0)+1,lastShownAt:Date.now()},this.save()}hasSeen(t,e){const i=this.root.tours[t];return!(!i||!i.at||e&&i.version!==e)}getStatus(t){const e=this.root.tours[t];return!e||!e.at?null:e.status}getRecord(t){return this.root.tours[t]??null}reset(t){if(!t){this.root=Ct(),this.save();return}delete this.root.tours[t],delete this.root.progress[t],this.save()}clearAllProgress(){this.root.progress={},this.save()}saveProgress(t,e,i){this.root.progress[t]={tourId:t,lastStepId:e,stepIndex:i,timestamp:Date.now()},this.save()}getProgress(t){return this.root.progress[t]??null}getProgressIfValid(t,e){const i=this.getProgress(t);return i?Date.now()-i.timestamp>e?(this.clearProgress(t),null):i:null}clearProgress(t){t in this.root.progress&&(delete this.root.progress[t],this.save())}setActive(t,e){this.root.active={tourId:t,stepId:e,at:Date.now()},this.save()}getActive(t=300*1e3){const e=this.root.active;return e?Date.now()-e.at>t?(this.clearActive(),null):e:null}clearActive(){this.root.active&&(delete this.root.active,this.save())}exportAll(){return JSON.parse(JSON.stringify(this.root))}importAll(t,e="replace"){const i=this.parse(typeof t=="string"?t:JSON.stringify(t));if(!i)return!1;if(e==="replace")this.root=i;else{for(const[o,s]of Object.entries(i.tours)){const r=this.root.tours[o];(!r||s.at>r.at)&&(this.root.tours[o]=s)}for(const[o,s]of Object.entries(i.progress)){const r=this.root.progress[o];(!r||s.timestamp>r.timestamp)&&(this.root.progress[o]=s)}}return this.save(),!0}}const Ke=500,Je=new Set(["__proto__","constructor","prototype"]),te={includes:(n,t)=>typeof n=="string"?n.includes(String(t[0])):Array.isArray(n)?n.includes(t[0]):!1,startsWith:(n,t)=>typeof n=="string"?n.startsWith(String(t[0])):!1,endsWith:(n,t)=>typeof n=="string"?n.endsWith(String(t[0])):!1,toLowerCase:n=>typeof n=="string"?n.toLowerCase():n,toUpperCase:n=>typeof n=="string"?n.toUpperCase():n,trim:n=>typeof n=="string"?n.trim():n,indexOf:(n,t)=>typeof n=="string"?n.indexOf(String(t[0])):Array.isArray(n)?n.indexOf(t[0]):-1,matches:(n,t)=>{if(typeof n!="string")return!1;try{return new RegExp(String(t[0])).test(n)}catch{return!1}}},Xe=["===","!==","==","!=","<=",">=","&&","||","<",">","!","(",")","[","]",",","+","-","*","/","%","?",":"];function ee(n){const t=[];let e=0;for(;e<n.length;){const i=n.slice(e);if(/^\s/.test(i)){e+=1;continue}const o=Xe.find(r=>i.startsWith(r));if(o){t.push({t:"op",v:o}),e+=o.length;continue}if(i[0]==="."){t.push({t:"dot"}),e+=1;continue}let s=i.match(/^'((?:[^'\\]|\\.)*)'/)??i.match(/^"((?:[^"\\]|\\.)*)"/);if(s){t.push({t:"str",v:s[1].replace(/\\(.)/g,"$1")}),e+=s[0].length;continue}if(s=i.match(/^\d+(\.\d+)?/),s){t.push({t:"num",v:Number(s[0])}),e+=s[0].length;continue}if(s=i.match(/^(true|false)\b/),s){t.push({t:"bool",v:s[1]==="true"}),e+=s[0].length;continue}if(s=i.match(/^null\b/),s){t.push({t:"null"}),e+=s[0].length;continue}if(s=i.match(/^undefined\b/),s){t.push({t:"undef"}),e+=s[0].length;continue}if(s=i.match(/^[A-Za-z_$][\w$]*/),s){t.push({t:"ident",v:s[0]}),e+=s[0].length;continue}throw new Error(`Unexpected character "${i[0]}" at ${e}`)}return t}function Tt(n,t){if(n!=null&&!(typeof t=="string"&&Je.has(t))){if(typeof n=="string")return t==="length"?n.length:typeof t=="number"?n[t]:void 0;if(Array.isArray(n))return t==="length"?n.length:n[t];if(typeof n=="object")return n[String(t)]}}function ne(n,t){return n===t?!0:n==null?t==null:typeof n=="number"||typeof t=="number"?Number(n)===Number(t):String(n)===String(t)}function D(n){return typeof n=="number"?n:Number(n)}class ie{constructor(t,e){f(this,"pos",0);f(this,"tokens");f(this,"ctx");this.tokens=t,this.ctx=e}parse(){const t=this.ternary();if(this.pos!==this.tokens.length)throw new Error("Trailing tokens");return t}peek(){return this.tokens[this.pos]}isOp(t){const e=this.peek();return!!e&&e.t==="op"&&e.v===t}eatOp(t){return this.isOp(t)?(this.pos+=1,!0):!1}expectOp(t){if(!this.eatOp(t))throw new Error(`Expected "${t}"`)}ternary(){const t=this.orExpr();if(!this.eatOp("?"))return t;const e=this.ternary();this.expectOp(":");const i=this.ternary();return t?e:i}orExpr(){let t=this.andExpr();for(;this.eatOp("||");){const e=this.andExpr();t=t||e}return t}andExpr(){let t=this.equality();for(;this.eatOp("&&");){const e=this.equality();t=t&&e}return t}equality(){let t=this.relational();for(;;){if(this.eatOp("===")){t=t===this.relational();continue}if(this.eatOp("!==")){t=t!==this.relational();continue}if(this.eatOp("==")){t=ne(t,this.relational());continue}if(this.eatOp("!=")){t=!ne(t,this.relational());continue}return t}}relational(){let t=this.additive();for(;;){if(this.eatOp("<=")){t=D(t)<=D(this.additive());continue}if(this.eatOp(">=")){t=D(t)>=D(this.additive());continue}if(this.eatOp("<")){t=D(t)<D(this.additive());continue}if(this.eatOp(">")){t=D(t)>D(this.additive());continue}return t}}additive(){let t=this.multiplicative();for(;;){if(this.eatOp("+")){const e=this.multiplicative();t=typeof t=="string"||typeof e=="string"?String(t)+String(e):D(t)+D(e);continue}if(this.eatOp("-")){t=D(t)-D(this.multiplicative());continue}return t}}multiplicative(){let t=this.unary();for(;;){if(this.eatOp("*")){t=D(t)*D(this.unary());continue}if(this.eatOp("/")){t=D(t)/D(this.unary());continue}if(this.eatOp("%")){t=D(t)%D(this.unary());continue}return t}}unary(){return this.eatOp("!")?!this.unary():this.eatOp("-")?-D(this.unary()):this.postfix()}postfix(){let t=this.primary();for(;;){if(this.peek()?.t==="dot"){this.pos+=1;const e=this.peek();if(!e||e.t!=="ident")throw new Error('Expected identifier after "."');if(this.pos+=1,this.isOp("(")){this.pos+=1;const i=[];if(!this.isOp(")"))do i.push(this.ternary());while(this.eatOp(","));this.expectOp(")");const o=Object.prototype.hasOwnProperty.call(te,e.v)?te[e.v]:void 0;if(typeof o!="function")throw new Error(`Method "${e.v}" is not allowed`);t=o(t,i);continue}t=Tt(t,e.v);continue}if(this.eatOp("[")){const e=this.ternary();this.expectOp("]"),t=Tt(t,typeof e=="number"?e:String(e));continue}return t}}primary(){const t=this.peek();if(!t)throw new Error("Unexpected end of expression");if(t.t==="op"&&t.v==="("){this.pos+=1;const e=this.ternary();return this.expectOp(")"),e}if(t.t==="op"&&t.v==="["){this.pos+=1;const e=[];if(!this.isOp("]"))do e.push(this.ternary());while(this.eatOp(","));return this.expectOp("]"),e}switch(this.pos+=1,t.t){case"str":return t.v;case"num":return t.v;case"bool":return t.v;case"null":return null;case"undef":return;case"ident":return Tt(this.ctx,t.v);default:throw new Error("Unexpected token")}}}function Ot(n,t,e={}){try{if(typeof n!="string")return;if(n.length>(e.maxLength??Ke)){e.onError?.("expression exceeds the maximum length",n);return}return new ie(ee(n),t).parse()}catch(i){e.onError?.(i instanceof Error?i.message:"invalid expression",n);return}}function ct(n,t,e={}){return!!Ot(n,t,e)}function Ye(n){try{return new ie(ee(n),{}).parse(),{ok:!0}}catch(t){return{ok:!1,message:t instanceof Error?t.message:"invalid expression"}}}const oe=new Set(["auto","center","top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"]),se=new Set(["spotlight","hotspot","beacon","modal","banner"]),re=new Set(["button","target-click","event","auto","input-match","form-submit","element-appears","element-disappears","url-match"]),ae=new Set(["manual","auto","event","route","element","idle","scroll"]),Qe=new Set(["emit","click","focus","navigate","setContext","scrollTo","wait"]),Ze=new Set(["text","image","video","list","code","divider","html"]),ce=new Set(["free","target-only","blocked"]),le=new Set(["compact","comfortable","spacious"]),tn=new Set(["specVersion","id","title","description","version","priority","trigger","audience","frequency","onComplete","theme","interaction","density","steps"]),en=new Set(["id","target","placement","display","title","content","buttons","advanceOn","event","duration","match","watch","urlPattern","interaction","density","skippable","canGoBack","next","showIf","theme","onEnter","onExit"]),nn=new Set(["selector","text","index","all","shadow","iframe","waitFor","timeout","visible","scrollIntoView","scrollBehavior","padding"]),on=new Set(["accent","bg","fg","muted","border","success","danger","backdrop","radius","shadow","font","fontSize","spacing","arrowSize","overlayBlur","animationMs","z","spotlightRing","popoverWidth"]),sn=/^[a-z0-9]+(-[a-z0-9]+)*$/,V={title:60,stepTitle:80,description:200,content:320,steps:24},de={steps:200};function P(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}class rn{constructor(){f(this,"errors",[]);f(this,"warnings",[])}error(t,e){this.errors.push({path:t,message:e,severity:"error"})}warn(t,e){this.warnings.push({path:t,message:e,severity:"warning"})}}function he(n,t,e){if(n!==void 0){if(!P(n)){e.error(t,"theme must be an object");return}for(const i of Object.keys(n))on.has(i)||e.warn(`${t}.${i}`,`unknown theme token "${i}" (ignored)`)}}function Lt(n,t,e){if(n===void 0)return;if(typeof n!="string"){e.error(t,"must be a string expression");return}if(n.length>500){e.error(t,`expression must be ≤ 500 chars (got ${n.length})`);return}const i=Ye(n);i.ok||e.error(t,`invalid expression: ${i.message}`)}function ue(n,t,e){if(n!==void 0){if(!Array.isArray(n)){e.error(t,"must be an array of actions");return}n.forEach((i,o)=>{const s=`${t}[${o}]`;if(!P(i)){e.error(s,"action must be an object");return}if(!Qe.has(i.type)){e.error(`${s}.type`,`unknown action type "${String(i.type)}"`);return}i.type==="emit"&&typeof i.name!="string"&&e.error(`${s}.name`,'emit action requires a string "name"'),i.type==="navigate"&&(typeof i.path!="string"||!i.path.startsWith("/"))&&e.error(`${s}.path`,'navigate requires a same-origin "path" starting with /'),i.type==="setContext"&&typeof i.key!="string"&&e.error(`${s}.key`,'setContext requires a string "key"'),i.type==="scrollTo"&&typeof i.selector!="string"&&e.error(`${s}.selector`,'scrollTo requires a string "selector"'),i.type==="wait"&&typeof i.ms!="number"&&e.error(`${s}.ms`,'wait requires a numeric "ms"')})}}function mt(n,t,e){if(typeof n=="string")return n.length;if(P(n)&&typeof n.key=="string")return n.key.length;if(P(n)&&Array.isArray(n.blocks)){if(n.blocks.length===0){e.error(t,"blocks must not be empty");return}let i=0;return n.blocks.forEach((o,s)=>{const r=`${t}.blocks[${s}]`;if(!P(o)){e.error(r,"block must be an object");return}if(!Ze.has(o.type)){e.error(`${r}.type`,`unknown block type "${String(o.type)}"`);return}switch(o.type){case"text":typeof o.value=="string"?i+=o.value.length:(!P(o.value)||typeof o.value.key!="string")&&e.error(`${r}.value`,"text block requires a string or i18n object");break;case"image":typeof o.src!="string"&&e.error(`${r}.src`,'image block requires "src"'),typeof o.alt!="string"&&e.error(`${r}.alt`,'image block requires "alt" for accessibility');break;case"video":typeof o.src!="string"&&e.error(`${r}.src`,'video block requires "src"');break;case"list":(!Array.isArray(o.items)||o.items.length===0)&&e.error(`${r}.items`,'list block requires a non-empty "items" array');break;case"code":typeof o.value!="string"&&e.error(`${r}.value`,'code block requires a string "value"');break;case"html":typeof o.value!="string"?e.error(`${r}.value`,'html block requires a string "value"'):e.warn(r,"html blocks render only when the host sets allowHtml: true");break}}),i}}function an(n,t){if(n===void 0)return;if(!P(n)){t.error("$.trigger","must be an object");return}const e=n.type;if(!ae.has(e)){t.error("$.trigger.type",`must be one of: ${[...ae].join(" | ")}`);return}if(n.delay!==void 0&&(typeof n.delay!="number"||n.delay<0)&&t.error("$.trigger.delay","must be a non-negative number (ms)"),e==="event"&&typeof n.event!="string"&&t.error("$.trigger.event",'required when trigger.type === "event"'),e==="route"&&typeof n.path!="string"&&t.error("$.trigger.path",'required when trigger.type === "route"'),e==="element"&&typeof n.selector!="string"&&t.error("$.trigger.selector",'required when trigger.type === "element"'),e==="idle"&&(typeof n.ms!="number"||n.ms<=0)&&t.error("$.trigger.ms",'required positive number (ms) when trigger.type === "idle"'),e==="scroll"){const i=n.percent;(typeof i!="number"||i<0||i>100)&&t.error("$.trigger.percent","must be a number between 0 and 100")}}function cn(n,t,e){if(n===void 0)return;if(!P(n)){e.error(`${t}.target`,"must be an object");return}for(const r of Object.keys(n))nn.has(r)||e.warn(`${t}.target.${r}`,`unknown target key "${r}" (ignored)`);const{selector:i,text:o}=n,s=typeof i=="string"&&i.trim().length>0||Array.isArray(i)&&i.length>0&&i.every(r=>typeof r=="string"&&r.trim());i!==void 0&&!s&&e.error(`${t}.target.selector`,"must be a non-empty CSS selector or array of selectors"),!s&&typeof o!="string"&&e.error(`${t}.target`,'requires "selector", "text", or both'),n.timeout!==void 0&&(typeof n.timeout!="number"||n.timeout<0)&&e.error(`${t}.target.timeout`,"must be a non-negative number (ms)"),n.padding!==void 0&&(typeof n.padding!="number"||n.padding<0)&&e.error(`${t}.target.padding`,"must be a non-negative number (px)"),n.index!==void 0&&(typeof n.index!="number"||n.index<0)&&e.error(`${t}.target.index`,"must be a non-negative integer"),n.iframe!==void 0&&typeof n.iframe!="string"&&e.error(`${t}.target.iframe`,"must be a CSS selector string"),n.scrollBehavior!==void 0&&!["auto","smooth"].includes(n.scrollBehavior)&&e.error(`${t}.target.scrollBehavior`,'must be "auto" or "smooth"')}function gt(n){const t=new rn;if(!P(n))return{ok:!1,errors:[{path:"$",message:"spec must be a JSON object",severity:"error"}],warnings:[]};for(const o of Object.keys(n))tn.has(o)||t.warn(`$.${o}`,`unknown top-level key "${o}" (ignored)`);n.specVersion!==1&&t.error("$.specVersion","must be the integer 1"),typeof n.id!="string"||!n.id?t.error("$.id","required, non-empty string"):sn.test(n.id)||t.error("$.id",'must be kebab-case (e.g. "dashboard-intro")');const e=mt(n.title,"$.title",t);if(e===void 0?t.error("$.title","required (string or i18n object with key)"):e===0?t.error("$.title","must not be empty"):e>V.title&&t.warn("$.title",`longer than ${V.title} chars (got ${e})`),n.description!==void 0){const o=mt(n.description,"$.description",t);o===void 0?t.error("$.description","must be a string or i18n object"):o>V.description&&t.warn("$.description",`longer than ${V.description} chars (got ${o})`)}if(n.version!==void 0&&typeof n.version!="string"&&t.error("$.version",'must be a string (e.g. "1.0.0")'),n.priority!==void 0&&typeof n.priority!="number"&&t.error("$.priority","must be a number"),n.interaction!==void 0&&!ce.has(n.interaction)&&t.error("$.interaction",'must be "free" | "target-only" | "blocked"'),n.density!==void 0&&!le.has(n.density)&&t.error("$.density",'must be "compact" | "comfortable" | "spacious"'),an(n.trigger,t),n.audience!==void 0&&(P(n.audience)?Lt(n.audience.showIf,"$.audience.showIf",t):t.error("$.audience","must be an object")),n.frequency!==void 0)if(!P(n.frequency))t.error("$.frequency","must be an object");else for(const o of["max","cooldown","perSession"]){const s=n.frequency[o];s!==void 0&&(typeof s!="number"||s<0)&&t.error(`$.frequency.${o}`,"must be a non-negative number")}if(n.onComplete!==void 0)if(!P(n.onComplete))t.error("$.onComplete","must be an object");else{const{startTour:o,emit:s,navigate:r}=n.onComplete;o!==void 0&&typeof o!="string"&&t.error("$.onComplete.startTour","must be a tour id string"),s!==void 0&&typeof s!="string"&&t.error("$.onComplete.emit","must be an event name string"),r!==void 0&&(typeof r!="string"||!r.startsWith("/"))&&t.error("$.onComplete.navigate","must be a same-origin path starting with /")}if(he(n.theme,"$.theme",t),!Array.isArray(n.steps))return t.error("$.steps","required, must be an array"),{ok:!1,errors:t.errors,warnings:t.warnings};n.steps.length<1&&t.error("$.steps","must contain at least 1 step"),n.steps.length>de.steps?t.error("$.steps",`must contain ≤ ${de.steps} steps (got ${n.steps.length})`):n.steps.length>V.steps&&t.warn("$.steps",`${n.steps.length} steps is a lot; consider splitting into several tours`);const i=new Set;return n.steps.forEach((o,s)=>{const r=`$.steps[${s}]`;if(!P(o)){t.error(r,"step must be an object");return}for(const d of Object.keys(o))en.has(d)||t.warn(`${r}.${d}`,`unknown step key "${d}" (ignored)`);typeof o.id!="string"||!o.id?t.error(`${r}.id`,"required"):i.has(o.id)?t.error(`${r}.id`,`duplicate step id "${o.id}"`):i.add(o.id);const a=o.display;a!==void 0&&!se.has(a)&&t.error(`${r}.display`,`must be one of: ${[...se].join(" | ")}`),cn(o.target,r,t),o.placement!==void 0&&!oe.has(o.placement)&&t.error(`${r}.placement`,`must be one of: ${[...oe].join(" | ")}`),o.interaction!==void 0&&!ce.has(o.interaction)&&t.error(`${r}.interaction`,'must be "free" | "target-only" | "blocked"'),o.density!==void 0&&!le.has(o.density)&&t.error(`${r}.density`,'must be "compact" | "comfortable" | "spacious"');const c=mt(o.title,`${r}.title`,t);c===void 0?t.error(`${r}.title`,"required (string or i18n object with key)"):c===0?t.error(`${r}.title`,"must not be empty"):c>V.stepTitle&&t.warn(`${r}.title`,`longer than ${V.stepTitle} chars (got ${c})`);const l=mt(o.content,`${r}.content`,t);if(l===void 0?t.error(`${r}.content`,"required (string, i18n object, or { blocks: [...] })"):l>V.content&&t.warn(`${r}.content`,`longer than ${V.content} chars (got ${l}); long copy hurts completion`),o.buttons!==void 0)if(!P(o.buttons))t.error(`${r}.buttons`,"must be an object");else for(const d of Object.keys(o.buttons))["next","back","skip","done"].includes(d)||t.warn(`${r}.buttons.${d}`,`unknown button "${d}" (ignored)`);const h=o.advanceOn??"button";re.has(h)||t.error(`${r}.advanceOn`,`must be one of: ${[...re].join(" | ")}`),h==="event"&&typeof o.event!="string"&&t.error(`${r}.event`,'required when advanceOn === "event"'),h==="auto"&&(typeof o.duration!="number"||o.duration<=0)&&t.error(`${r}.duration`,'required positive number (ms) when advanceOn === "auto"'),h==="target-click"&&o.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "target-click"'),h==="input-match"&&(o.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "input-match"'),typeof o.match!="string"&&t.error(`${r}.match`,'required when advanceOn === "input-match"')),h==="form-submit"&&o.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "form-submit"'),(h==="element-appears"||h==="element-disappears")&&typeof o.watch!="string"&&t.error(`${r}.watch`,`required when advanceOn === "${h}"`),h==="url-match"&&typeof o.urlPattern!="string"&&t.error(`${r}.urlPattern`,'required when advanceOn === "url-match"'),a==="beacon"&&o.duration!==void 0&&typeof o.duration!="number"&&t.error(`${r}.duration`,"must be a number (ms)"),o.next!==void 0&&(typeof o.next=="string"||(Array.isArray(o.next)?(o.next.length===0&&t.warn(`${r}.next`,"empty branch list falls through to the next step"),o.next.forEach((d,p)=>{const E=`${r}.next[${p}]`;if(!P(d)){t.error(E,"branch must be an object { if, to }");return}Lt(d.if,`${E}.if`,t),typeof d.to!="string"&&t.error(`${E}.to`,"must be a step id string")})):t.error(`${r}.next`,"must be a step id string or an array of { if, to } branches"))),Lt(o.showIf,`${r}.showIf`,t),he(o.theme,`${r}.theme`,t),ue(o.onEnter,`${r}.onEnter`,t),ue(o.onExit,`${r}.onExit`,t)}),n.steps.forEach((o,s)=>{if(!P(o))return;const r=`$.steps[${s}].next`;typeof o.next=="string"&&!i.has(o.next)?t.error(r,`points to unknown step id "${o.next}"`):Array.isArray(o.next)&&o.next.forEach((a,c)=>{P(a)&&typeof a.to=="string"&&!i.has(a.to)&&t.error(`${r}[${c}].to`,`points to unknown step id "${a.to}"`)})}),t.errors.length?{ok:!1,errors:t.errors,warnings:t.warnings}:{ok:!0,errors:[],warnings:t.warnings}}function ln(n){const t=gt(n);if(!t.ok){const e=t.errors.map(i=>`  • ${i.path}: ${i.message}`).join(`
`);throw new Error(`[opentutorial] Invalid TutorialSpec:
${e}`)}return n}function dn(n){const t=[],e=new Set;return n.forEach((i,o)=>{const s=P(i)&&typeof i.id=="string"?i.id:void 0,r=gt(i);for(const a of[...r.errors,...r.warnings])t.push({...a,path:`[${o}]${a.path.slice(1)}`,specId:s});s&&(e.has(s)&&t.push({path:`[${o}].id`,message:`duplicate tour id "${s}"`,severity:"error",specId:s}),e.add(s))}),n.forEach((i,o)=>{if(!P(i)||!P(i.onComplete))return;const s=i.onComplete.startTour;typeof s=="string"&&!e.has(s)&&t.push({path:`[${o}].onComplete.startTour`,message:`chains to unknown tour "${s}"`,severity:"warning",specId:typeof i.id=="string"?i.id:void 0})}),{ok:!t.some(i=>i.severity==="error"),issues:t}}function hn(n){let t=2166136261;for(let e=0;e<n.length;e+=1)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function un(n){return hn(n)/4294967296}function pn(n,t,e=""){return t>=1?!0:t<=0?!1:un(`${e}:${n}`)<t}const fn=["zero","one","two","few","many","other"];function pe(n,t){return t.split(".").reduce((e,i)=>e&&typeof e=="object"?e[i]:void 0,n)}function mn(n,t,e="en"){let i;try{i=new Intl.PluralRules(e).select(n)}catch{i=n===1?"one":"other"}return t[i]??t.other??""}function gn(n){const t={},e=/(\w+)\s*\{([^{}]*)\}/g;let i;for(;(i=e.exec(n))!==null;){const o=i[1];fn.includes(o)&&(t[o]=i[2])}return t}function bn(n,t){let e=0;for(let i=t;i<n.length;i+=1){const o=n[i];if(o==="{")e+=1;else if(o==="}"){if(e===0&&n[i+1]==="}")return i;e>0&&(e-=1)}}return-1}function fe(n,t){try{return new Intl.NumberFormat(t).format(n)}catch{return String(n)}}function Nt(n,t,e="en"){if(!n.includes("{{"))return n;let i="",o=0;for(;o<n.length;){const s=n.indexOf("{{",o);if(s===-1){i+=n.slice(o);break}const r=bn(n,s+2);if(r===-1){i+=n.slice(o);break}i+=n.slice(o,s);const a=n.slice(s+2,r).trim();i+=vn(a,t,e),o=r+2}return i}function vn(n,t,e){const i=`{{${n}}}`,o=n.indexOf(",");if(o!==-1){const r=n.slice(0,o).trim(),a=n.slice(o+1).trim();if(!a.startsWith("plural"))return i;const c=t?pe(t,r):void 0,l=typeof c=="number"?c:Number(c);if(!Number.isFinite(l))return i;const h=gn(a.slice(6).replace(/^\s*,\s*/,""));return mn(l,h,e).replace(/#/g,fe(l,e))}if(!/^[\w.$]+$/.test(n))return i;const s=t?pe(t,n):void 0;return s==null?i:typeof s=="number"?fe(s,e):String(s)}function lt(n,t,e,i){if(typeof n=="string")return Nt(n,i,t);if(n&&typeof n.key=="string"){const o=e?.(n.key,t);return Nt(o!==void 0?o:n.fallback??n.key,i,t)}return String(n)}const yn={next:"Next",back:"Back",done:"Done",skip:"Skip tour"};function xn(n,t,e){return e?.(`opentutorial.${n}`,t)??yn[n]}const wn={accent:"--ot-accent",bg:"--ot-bg",fg:"--ot-fg",muted:"--ot-muted",border:"--ot-border",success:"--ot-success",danger:"--ot-danger",backdrop:"--ot-backdrop",radius:"--ot-radius",shadow:"--ot-shadow",font:"--ot-font",fontSize:"--ot-font-size",spacing:"--ot-spacing",arrowSize:"--ot-arrow-size",overlayBlur:"--ot-overlay-blur",animationMs:"--ot-anim-ms",z:"--ot-z",spotlightRing:"--ot-spotlight-ring",popoverWidth:"--ot-popover-width"};function kn(n){const t=Math.min(...n.map(s=>s.x)),e=Math.min(...n.map(s=>s.y)),i=Math.max(...n.map(s=>s.x+s.width)),o=Math.max(...n.map(s=>s.y+s.height));return{x:t,y:e,width:i-t,height:o-e}}const En=new Set(["radius","popoverWidth","fontSize","spacing","arrowSize","overlayBlur"]),Sn=new Set(["animationMs"]),$n=200;class zt{constructor(t,e={}){f(this,"spec");f(this,"errors",[]);f(this,"warnings",[]);f(this,"opts");f(this,"persistence");f(this,"context");f(this,"layer",null);f(this,"popover",null);f(this,"hotspot",null);f(this,"customHost",null);f(this,"releaseFocus",null);f(this,"cleanupAdvance",null);f(this,"cleanupTrack",null);f(this,"cleanupRender",null);f(this,"appliedVars",[]);f(this,"status","idle");f(this,"currentId",null);f(this,"history",[]);f(this,"resolved",null);f(this,"runToken",0);f(this,"transitions",0);f(this,"stepEnteredAt",0);f(this,"startedAt",0);f(this,"advancing",!1);f(this,"sampleDecision",null);this.spec=t,this.opts=e,this.context={...e.context??{}},this.persistence=new It(e.persistence?.storage,e.persistence?.keyPrefix??"ot",e.userId);const i=gt(t);if(this.warnings=i.warnings,!i.ok||e.strict&&i.warnings.length>0){this.errors=i.ok?i.warnings:i.errors;const o=this.errors.map(s=>`  • ${s.path}: ${s.message}`).join(`
`);e.dev!==!1&&console.error(`[opentutorial] Spec "${t?.id??"?"}" failed validation:
${o}`),this.emit("error",{message:`invalid spec: ${this.errors.length} violation(s)`})}else if(i.warnings.length>0&&e.dev){const o=i.warnings.map(s=>`  • ${s.path}: ${s.message}`).join(`
`);console.warn(`[opentutorial] Spec "${t.id}" has warnings:
${o}`)}}get ready(){return this.persistence.ready}getState(){const t=this.visibleSteps(),e=t.findIndex(o=>o.id===this.currentId),i=this.currentStep();return{status:this.status,currentStepId:this.currentId,index:Math.max(0,e),total:t.length,paused:this.status==="paused",canGoBack:i?.canGoBack!==!1&&this.history.length>0,canGoNext:this.status==="running"}}isValid(){return this.errors.length===0}hasSeen(){return this.persistence.hasSeen(this.spec.id,this.spec.version)}getPersistence(){return this.persistence}resetSeen(){this.persistence.reset(this.spec.id)}resetAll(){this.persistence.reset()}resetProgress(){this.persistence.clearProgress(this.spec.id)}exportProgress(){return this.persistence.exportAll()}importProgress(t,e="replace"){return this.persistence.importAll(t,e)}setUser(t){return this.opts={...this.opts,userId:t},this.persistence.setUser(t)}getContext(){return this.context}setContext(t){const e=this.visibleSteps().length;if(Object.assign(this.context,t),this.status!=="running")return;const i=this.currentStep();if(i?.showIf&&!ct(i.showIf,this.context)){this.next();return}this.visibleSteps().length!==e&&this.rerenderCurrent()}setGlobalTheme(t){this.opts={...this.opts,theme:t},this.layer&&this.applyThemeChain(this.currentStep()?.theme)}setLocale(t){this.opts={...this.opts,locale:t},this.status==="running"&&this.rerenderCurrent()}async start(t){if(this.status==="destroyed"||this.status==="running"||!this.isValid())return;await this.persistence.ready,this.status="running",this.history=[],this.transitions=0,this.startedAt=Date.now();const e=t?void 0:this.resolveResumeStep(),i=t??e??this.visibleSteps()[0]?.id;if(this.history=[],i){const o=this.visibleSteps(),s=o.findIndex(r=>r.id===i);s>0&&(this.history=o.slice(0,s).map(r=>r.id))}if(this.buildDom(),this.persistence.markShown(this.spec.id,this.spec.version),this.emit(e?"resumed":"started",{stepId:i}),!i){this.complete("empty");return}await this.goToInternal(i,!1)}resolveResumeStep(){if(this.opts.autoResume){const i=this.persistence.getActive();if(i?.tourId===this.spec.id&&this.visibleSteps().some(s=>s.id===i.stepId))return i.stepId}if(!this.opts.resume)return;const t=this.opts.progressTtl??1440*60*1e3,e=this.persistence.getProgressIfValid(this.spec.id,t);if(e?.lastStepId&&this.visibleSteps().some(i=>i.id===e.lastStepId))return e.lastStepId}async next(){if(this.status!=="running"||this.advancing)return;const t=this.currentStep();if(!t)return;if(this.opts.beforeNext){this.advancing=!0;try{const i=this.visibleSteps().findIndex(s=>s.id===t.id);if(!await this.opts.beforeNext({tourId:this.spec.id,step:t,index:Math.max(0,i)}))return}catch{return}finally{this.advancing=!1}if(this.status!=="running")return}this.emit("step-completed",{stepId:t.id,duration:this.stepDuration()});const e=this.resolveNextId(t);if(!e){this.complete("end");return}await this.goToInternal(e,!0)}resolveNextId(t){if(Array.isArray(t.next)){for(const r of t.next)if(r&&typeof r.if=="string"&&ct(r.if,this.context))return r.to}else if(typeof t.next=="string")return t.next;const e=this.visibleSteps(),i=e.findIndex(r=>r.id===t.id);if(i>=0)return e[i+1]?.id;const o=this.spec.steps.findIndex(r=>r.id===t.id);if(o<0)return;const s=new Set(e.map(r=>r.id));return this.spec.steps.slice(o+1).find(r=>s.has(r.id))?.id}prev(){if(this.status!=="running")return;const t=this.currentStep();if(t&&t.canGoBack===!1)return;const e=this.history.pop();e&&(this.emit("back",{stepId:this.currentId??void 0}),this.goToInternal(e,!1))}goTo(t){this.status==="running"&&this.goToInternal(t,!0)}pause(){this.status==="running"&&(this.status="paused",this.emit("paused",{stepId:this.currentId??void 0}),this.teardownDom())}resume(){if(this.status!=="paused")return;const t=this.currentId;this.status="running",this.emit("unpaused",{stepId:t??void 0}),this.buildDom(),t?this.goToInternal(t,!1):this.start()}skip(t="user"){this.status!=="running"&&this.status!=="paused"||this.finish("skipped",t)}complete(t="user"){this.status!=="running"&&this.status!=="paused"||this.finish("completed",t)}destroy(){this.status="destroyed",this.teardownDom()}visibleSteps(){return this.spec.steps.filter(t=>!t.showIf||ct(t.showIf,this.context))}currentStep(){return this.spec.steps.find(t=>t.id===this.currentId)??null}stepDuration(){return this.stepEnteredAt?Date.now()-this.stepEnteredAt:0}text(t){return lt(t,this.opts.locale??"en",this.opts.i18nResolver,this.context)}blocks(t){return wt(t,e=>this.text(e))}interactionFor(t){return t.interaction??this.spec.interaction??this.opts.interaction??"free"}buildDom(){const t=this.opts.zIndex??9999;this.layer=new vt(t,{container:this.opts.container,isolate:this.opts.isolate,dir:this.opts.dir}),this.layer.attach(),(this.opts.renderStep||this.opts.renderIndicator)&&(this.customHost=document.createElement("div"),this.customHost.className="ot-custom-host",this.layer.mountPopover(this.customHost)),this.opts.renderStep||(this.popover=new qe({onNext:()=>{this.next()},onPrev:()=>this.prev(),onSkip:()=>this.skip("user")},this.opts.dir??"ltr",{swipe:this.opts.swipe,autoSize:this.opts.autoSize}),this.layer.mountPopover(this.popover.el)),this.applyThemeChain(void 0)}teardownDom(){this.runToken+=1,this.releaseFocus?.(),this.cleanupAdvance?.(),this.cleanupTrack?.(),this.cleanupRender?.(),this.releaseFocus=null,this.cleanupAdvance=null,this.cleanupTrack=null,this.cleanupRender=null,this.popover?.destroy(),this.hotspot?.destroy(),this.customHost?.remove(),this.layer?.destroy(),this.popover=null,this.hotspot=null,this.customHost=null,this.layer=null,this.resolved=null}finish(t,e){const i=this.currentStep();i&&this.runActions(i.onExit);const o=this.startedAt?Date.now()-this.startedAt:0;this.status=t,this.persistence.mark(this.spec.id,t,this.spec.version),this.persistence.clearActive(),this.emit(t,{stepId:this.currentId??void 0,reason:e,duration:o}),this.teardownDom(),t==="completed"&&this.runOnComplete()}runOnComplete(){const t=this.spec.onComplete;if(t)try{t.emit&&window.dispatchEvent(new CustomEvent(t.emit,{detail:{tourId:this.spec.id}})),t.navigate&&this.navigate(t.navigate),t.startTour&&window.dispatchEvent(new CustomEvent("opentutorial:chain",{detail:{from:this.spec.id,to:t.startTour}}))}catch{}}async goToInternal(t,e){if(this.status!=="running")return;if(this.transitions+=1,this.transitions>$n){this.emit("error",{message:"transition limit reached (possible next-loop)"}),this.complete("loop-guard");return}const i=this.spec.steps.find(s=>s.id===t);if(!i){this.emit("error",{message:`unknown step "${t}"`});return}const o=this.currentStep();o&&(this.runActions(o.onExit),this.emit("step-hidden",{stepId:o.id,duration:this.stepDuration()})),e&&this.currentId&&this.currentId!==t&&this.history.push(this.currentId),await this.showStep(i)}async showStep(t){if(!this.layer)return;const e=++this.runToken,i=()=>this.runToken===e&&this.status==="running";this.currentId=t.id,this.cleanupAdvance?.(),this.cleanupAdvance=null,this.releaseFocus?.(),this.releaseFocus=null,this.applyThemeChain(t.theme);const o=t.display??"spotlight",s=this.visibleSteps(),r=Math.max(0,s.findIndex(l=>l.id===t.id));let a=null;if(t.target){if(a=F(t.target),!a&&t.target.waitFor&&(this.renderStep(t,r,s.length,"Looking for the interface element…"),a=await ft(t.target,t.target.timeout??5e3),!i()))return;if(!a){const l=Kt(t.target);this.emit("target-not-found",{stepId:t.id,selector:l,message:`target not found: ${l}`}),this.next();return}}if(!i())return;if(this.resolved=a,a&&t.target?.scrollIntoView!==!1){const l=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,h=t.target?.scrollBehavior??(l?"auto":"smooth");try{a.element.scrollIntoView({block:"center",inline:"center",behavior:h})}catch{}}if(this.hotspot?.destroy(),this.hotspot=null,this.layer.updateSpotlight(null),this.layer.setInteraction(this.interactionFor(t)),(o==="hotspot"||o==="beacon")&&a)this.showIndicator(t,o,a);else{this.renderStep(t,r,s.length),(o==="modal"||!a)&&this.layer.showBackdrop(),requestAnimationFrame(()=>requestAnimationFrame(()=>{i()&&this.reposition()}));const l=this.customHost??this.popover?.el;if(l){const h=o==="modal"||this.interactionFor(t)!=="free";this.releaseFocus=Fe(l,{trap:h,onEscape:()=>{t.skippable!==!1&&this.skip("escape")},onArrowNext:()=>{this.next()},onArrowPrev:()=>this.prev()})}}this.wireAdvance(t,a?.element??null),this.startTracking(),this.stepEnteredAt=Date.now(),this.persistence.saveProgress(this.spec.id,t.id,r),this.opts.autoResume&&this.persistence.setActive(this.spec.id,t.id),this.runActions(t.onEnter),this.emit("step-shown",{stepId:t.id,index:r,total:s.length})}showIndicator(t,e,i){if(!this.layer)return;const o=this.viewportRect(i);if(this.popover&&(this.popover.el.style.display="none"),this.opts.renderIndicator&&this.customHost){this.customHost.style.display="",this.customHost.classList.add("ot-custom-indicator"),this.customHost.style.position="fixed",this.customHost.style.left=`${o.x+o.width/2}px`,this.customHost.style.top=`${o.y+o.height/2}px`,this.cleanupRender?.();const s=this.visibleSteps(),r=s.findIndex(c=>c.id===t.id),a=this.opts.renderIndicator({...this.renderContext(t,Math.max(0,r),s.length,this.blocks(t.content)),display:e},this.customHost);if(this.cleanupRender=typeof a=="function"?a:null,e==="beacon"){const c=window.setTimeout(()=>{this.next()},t.duration??5e3);this.cleanupAdvance=()=>window.clearTimeout(c)}return}if(this.customHost&&(this.customHost.style.display="none"),this.hotspot=new He,this.hotspot.render({display:e,content:Ie(this.blocks(t.content)),showDismiss:e==="hotspot"||t.advanceOn==="button",onDismiss:()=>{this.next()}},o),this.layer.root.appendChild(this.hotspot.el),e==="beacon"){const s=window.setTimeout(()=>{this.next()},t.duration??5e3);this.cleanupAdvance=()=>window.clearTimeout(s)}}renderStep(t,e,i,o){const s=o?[{type:"text",value:o}]:this.blocks(t.content);if(this.opts.renderStep&&this.customHost){this.cleanupRender?.();const r=this.renderContext(t,e,i,s),a=this.opts.renderStep(r,this.customHost);this.cleanupRender=typeof a=="function"?a:null,this.customHost.style.display="";return}this.popover&&(this.popover.el.style.display="",this.popover.render(this.makeModel(t,e,i,s)))}renderContext(t,e,i,o){return{tourId:this.spec.id,step:t,index:e,total:i,title:this.text(t.title),blocks:o,canGoBack:t.canGoBack!==!1&&this.history.length>0,canSkip:t.skippable!==!1,isLast:!t.next&&e>=i-1,next:()=>{this.next()},prev:()=>this.prev(),skip:()=>this.skip("user"),goTo:s=>this.goTo(s)}}rerenderCurrent(){const t=this.currentStep();if(!t)return;const e=this.visibleSteps(),i=Math.max(0,e.findIndex(o=>o.id===t.id));this.renderStep(t,i,e.length),this.reposition()}makeModel(t,e,i,o){const s=this.opts.locale??"en",r=this.opts.i18nResolver,a=(h,d)=>d===!1||d===void 0?xn(h,s,r):this.text(d),c=t.buttons??{},l=t.advanceOn??"button";return{stepId:t.id,title:this.text(t.title),blocks:o,index:e,total:i,canGoBack:t.canGoBack!==!1&&this.history.length>0,skippable:t.skippable!==!1&&c.skip!==!1,isLast:!t.next&&e>=i-1,advanceOn:l,labels:{next:a("next",c.next),back:a("back",c.back),done:a("done",c.done),skip:a("skip",c.skip)},showNext:c.next!==!1&&(l==="button"||e>=i-1),showBack:c.back!==!1,modal:(t.display??"spotlight")==="modal"||this.interactionFor(t)==="blocked",allowHtml:this.opts.allowHtml,density:this.densityFor(t)}}densityFor(t){return t.density??this.spec.density??this.opts.density??"comfortable"}viewportRect(t){const e=t.element.getBoundingClientRect();return{x:e.x+t.frameOffset.x,y:e.y+t.frameOffset.y,width:e.width,height:e.height}}reposition(){if(!this.layer||this.status!=="running")return;const t=this.currentStep();if(!t)return;const e=t.target?.padding??8,i=!!this.popover&&!this.opts.renderStep;if(this.resolved){if(!this.resolved.doc.contains(this.resolved.element)&&t.target){const s=F(t.target);s&&(this.resolved=s)}const o=this.viewportRect(this.resolved);if(this.hotspot)this.hotspot.reposition(o),this.layer.setInteraction(this.interactionFor(t));else{const s=t.target?.all?Ve(t.target).map(a=>this.viewportRect(a)):[o],r=s.length>1?kn(s):o;this.layer.updateSpotlight(s.length>0?s:o,e,this.mergedRadius()),i&&this.popover?.position(r,t.placement??"auto",e)}}else this.layer.showBackdrop(),i&&this.popover?.position(null,"center",0)}mergedRadius(){return({...this.opts.theme,...this.spec.theme,...this.currentStep()?.theme}.radius??14)+2}startTracking(){this.cleanupTrack?.();let t=0,e=!1;const i=()=>{e||(e=!0,t=requestAnimationFrame(()=>{e=!1,this.reposition()}))},o=new ResizeObserver(i);if(this.resolved)try{o.observe(this.resolved.element)}catch{}o.observe(document.documentElement),window.addEventListener("resize",i),window.addEventListener("scroll",i,!0);const s=performance.now()+900,r=()=>{this.status==="running"&&(this.reposition(),performance.now()<s&&requestAnimationFrame(r))};requestAnimationFrame(r),this.cleanupTrack=()=>{o.disconnect(),window.removeEventListener("resize",i),window.removeEventListener("scroll",i,!0),cancelAnimationFrame(t)}}wireAdvance(t,e){const i=t.advanceOn??"button",o=()=>{this.next()};switch(i){case"target-click":{if(!e)return;const s=()=>o();e.addEventListener("click",s,{once:!0}),this.cleanupAdvance=()=>e.removeEventListener("click",s);return}case"event":{if(typeof t.event!="string")return;const s=t.event,r=()=>o();window.addEventListener(s,r,{once:!0}),this.cleanupAdvance=()=>window.removeEventListener(s,r);return}case"auto":{const s=window.setTimeout(o,t.duration??3e3);this.cleanupAdvance=()=>window.clearTimeout(s);return}case"input-match":{if(!e||typeof t.match!="string")return;const s=t.match,r=c=>{if(s.startsWith("/")&&s.lastIndexOf("/")>0){const l=s.lastIndexOf("/");try{return new RegExp(s.slice(1,l),s.slice(l+1)).test(c)}catch{return!1}}return c===s},a=()=>{const c=e.value??"";r(c)&&o()};e.addEventListener("input",a),e.addEventListener("change",a),this.cleanupAdvance=()=>{e.removeEventListener("input",a),e.removeEventListener("change",a)};return}case"form-submit":{if(!e)return;const s=e.closest?.("form")??(e.tagName==="FORM"?e:null);if(!s)return;const r=()=>o();s.addEventListener("submit",r,{once:!0}),this.cleanupAdvance=()=>s.removeEventListener("submit",r);return}case"element-appears":{if(typeof t.watch!="string")return;let s=!1;ft({selector:t.watch,visible:!0},t.duration??6e4).then(r=>{r&&!s&&o()}),this.cleanupAdvance=()=>{s=!0};return}case"element-disappears":{if(typeof t.watch!="string")return;const s=t.watch,r=window.setInterval(()=>{F({selector:s,visible:!0})||(window.clearInterval(r),o())},150);this.cleanupAdvance=()=>window.clearInterval(r);return}case"url-match":{if(typeof t.urlPattern!="string")return;const s=t.urlPattern,r=()=>{Yt(s,Xt())&&o()},a=Qt(r);this.cleanupAdvance=a,r();return}}}navigate(t){if(t.startsWith("/")){if(this.opts.onNavigate){this.opts.onNavigate(t);return}window.location.assign(t)}}runActions(t){if(!t)return;const e=this.resolved?.element;for(const i of t)try{switch(i.type){case"emit":window.dispatchEvent(new CustomEvent(i.name,{detail:i.detail}));break;case"click":e?.click?.();break;case"focus":e?.focus?.();break;case"navigate":this.opts.autoResume&&this.currentId&&this.persistence.setActive(this.spec.id,this.currentId),this.navigate(i.path);break;case"setContext":this.context[i.key]=i.value;break;case"scrollTo":{F({selector:i.selector})?.element.scrollIntoView({block:"center",behavior:"smooth"});break}case"wait":break}}catch{}}applyThemeChain(t){if(!this.layer)return;const e=this.layer.root.style;for(const o of this.appliedVars)e.removeProperty(o);this.appliedVars=[];const i={...this.opts.theme,...this.spec.theme,...t};for(const[o,s]of Object.entries(i)){if(s===void 0)continue;const r=wn[o];if(!r)continue;const a=En.has(o)?`${s}px`:Sn.has(o)?`${s}ms`:String(s);e.setProperty(r,a),this.appliedVars.push(r)}i.z!==void 0&&(this.layer.root.style.zIndex=String(i.z))}emit(t,e={}){const i={type:t,tourId:this.spec?.id??"unknown",timestamp:Date.now(),...e},o=Object.freeze({...i});if(this.sampled())try{this.opts.onEvent?.(o)}catch{}try{window.dispatchEvent(new CustomEvent("opentutorial",{detail:o}))}catch{}}sampled(){const t=this.opts.sampleRate;return t===void 0||t>=1?!0:(this.sampleDecision===null&&(this.sampleDecision=pn(this.spec?.id??"unknown",t)),this.sampleDecision)}}function An(n,t){if(!n||n.type==="manual")return{dispose:()=>{}};const e=n.delay??0,i=[],o=[];let s=!1;const r=n.once??!0,a=()=>{s||(r&&(s=!0),e>0?i.push(window.setTimeout(t,e)):t())};switch(n.type){case"auto":{a();break}case"event":{const c=()=>a();window.addEventListener(n.event,c),o.push(()=>window.removeEventListener(n.event,c));break}case"route":{const c=()=>{Yt(n.path,Xt(),n.exact)?a():r||(s=!1)};o.push(Qt(c)),c();break}case"element":{let c=!1;ft({selector:n.selector,visible:!0},n.timeout??3e4).then(l=>{l&&!c&&a()}),o.push(()=>{c=!0});break}case"idle":{let c=0;const l=()=>{window.clearTimeout(c),!s&&(c=window.setTimeout(a,n.ms))},h=["pointerdown","keydown","scroll","pointermove"];for(const d of h)window.addEventListener(d,l,{passive:!0}),o.push(()=>window.removeEventListener(d,l));o.push(()=>window.clearTimeout(c)),l();break}case"scroll":{const c=()=>{const l=document.documentElement,h=l.scrollHeight-l.clientHeight;if(h<=0)return;l.scrollTop/h*100>=n.percent&&a()};window.addEventListener("scroll",c,{passive:!0}),o.push(()=>window.removeEventListener("scroll",c)),c();break}}return{dispose:()=>{i.forEach(c=>window.clearTimeout(c)),o.forEach(c=>{try{c()}catch{}})}}}class Mt{constructor(t,e={}){f(this,"engines",new Map);f(this,"specs");f(this,"opts");f(this,"triggers",[]);f(this,"disposers",[]);f(this,"queue",[]);f(this,"activeId",null);f(this,"mounted",!1);f(this,"sessionCounts",new Map);this.specs=t,this.opts=e;for(const i of t)this.engines.set(i.id,new zt(i,{...e,onEvent:o=>this.handleEvent(o)}))}get ready(){return Promise.all([...this.engines.values()].map(t=>t.ready)).then(()=>{})}getEngine(t){return this.engines.get(t)}getEngines(){return[...this.engines.values()]}getSpecs(){return this.specs}getActiveId(){return this.activeId}getState(t){const e=t??this.activeId;return e?this.engines.get(e)?.getState()??null:null}hasSeen(t){return this.engines.get(t)?.hasSeen()??!1}checkEligibility(t){const e=this.engines.get(t);if(!e)return"unknown tour";if(!e.isValid())return"spec failed validation";const i=e.spec,o=e.getContext();if(i.audience?.showIf&&!ct(i.audience.showIf,o))return"audience rule did not match";const s=i.frequency;if(s){const r=e.getPersistence().getRecord(i.id);if(s.max!==void 0&&(r?.shownCount??0)>=s.max)return`frequency: already shown ${s.max} time(s)`;if(s.cooldown!==void 0&&r?.lastShownAt){const a=Date.now()-r.lastShownAt;if(a<s.cooldown)return`frequency: cooldown active (${s.cooldown-a}ms left)`}if(s.perSession!==void 0&&(this.sessionCounts.get(i.id)??0)>=s.perSession)return`frequency: session limit of ${s.perSession} reached`}return null}request(t,e,i={}){const o=this.engines.get(t);if(!o||!i.force&&this.checkEligibility(t))return!1;if(this.activeId&&this.activeId!==t)if(i.force)this.engines.get(this.activeId)?.skip("preempted");else return i.queue!==!1&&this.enqueue(t,e,o.spec.priority??0),!1;return this.sessionCounts.set(t,(this.sessionCounts.get(t)??0)+1),o.start(e),!0}start(t,e){this.request(t,e,{force:!0})}enqueue(t,e,i){this.queue.some(o=>o.tourId===t)||(this.queue.push({tourId:t,stepId:e,priority:i}),this.queue.sort((o,s)=>s.priority-o.priority))}drain(){for(;this.queue.length>0;){const t=this.queue.shift();if(!t||this.request(t.tourId,t.stepId,{queue:!1}))return}}stop(t="api"){for(const e of this.engines.values()){const i=e.getState().status;(i==="running"||i==="paused")&&e.skip(t)}this.queue=[]}pause(){this.activeId&&this.engines.get(this.activeId)?.pause()}resume(){this.activeId&&this.engines.get(this.activeId)?.resume()}setContext(t){this.engines.forEach(e=>e.setContext(t))}getContext(){return this.engines.values().next().value?.getContext()??{}}setTheme(t){this.engines.forEach(e=>e.setGlobalTheme(t))}setLocale(t){this.opts={...this.opts,locale:t},this.engines.forEach(e=>e.setLocale(t))}async setUser(t){this.sessionCounts.clear(),await Promise.all([...this.engines.values()].map(e=>e.setUser(t)))}reset(){this.sessionCounts.clear(),this.engines.values().next().value?.resetAll()}resetProgress(){this.engines.forEach(t=>t.resetProgress())}resetTour(t){this.sessionCounts.delete(t),this.engines.get(t)?.resetSeen()}exportProgress(){return this.engines.values().next().value?.exportProgress()??null}importProgress(t,e="replace"){return this.engines.values().next().value?.importProgress(t,e)??!1}mount(){this.mounted||(this.mounted=!0,this.ready.then(()=>{this.mounted&&(this.installChainListener(),this.installDeepLink(),this.installAutoResume(),this.installTriggers())}))}installTriggers(){for(const t of this.specs){const e=this.engines.get(t.id);if(!e||!e.isValid())continue;const i=t.trigger;!i||i.type==="manual"||(i.once??!0)&&e.hasSeen()||this.triggers.push(An(i,()=>{(i.once??!0)&&e.hasSeen()||this.request(t.id)}))}}installDeepLink(){const t=this.opts.deepLinkParam??"tour";if(t!==!1)try{const e=new URLSearchParams(window.location.search),i=e.get(t);if(!i||!this.engines.has(i))return;const o=e.get(`${t}Step`)??void 0,s=window.setTimeout(()=>this.request(i,o,{force:!0}),400);this.disposers.push(()=>window.clearTimeout(s))}catch{}}installAutoResume(){if(!this.opts.autoResume)return;const t=this.engines.values().next().value;if(!t)return;const e=t.getPersistence().getActive();if(!e||!this.engines.has(e.tourId))return;const i=window.setTimeout(()=>this.request(e.tourId,e.stepId,{force:!0}),200);this.disposers.push(()=>window.clearTimeout(i))}installChainListener(){const t=e=>{const i=e.detail;!i?.to||!this.engines.has(i.to)||window.setTimeout(()=>this.request(i.to,void 0,{force:!0}),0)};window.addEventListener("opentutorial:chain",t),this.disposers.push(()=>window.removeEventListener("opentutorial:chain",t))}handleEvent(t){(t.type==="started"||t.type==="resumed")&&(this.activeId=t.tourId),(t.type==="completed"||t.type==="skipped")&&this.activeId===t.tourId&&(this.activeId=null);try{this.opts.onEvent?.(t)}catch{}const e=this.activeId?this.engines.get(this.activeId)?.getState()??null:null;try{this.opts.onStateChange?.(this.activeId,e)}catch{}(t.type==="completed"||t.type==="skipped")&&this.queue.length>0&&window.setTimeout(()=>this.drain(),0)}destroy(){this.mounted=!1,this.triggers.forEach(t=>t.dispose()),this.disposers.forEach(t=>{try{t()}catch{}}),this.triggers=[],this.disposers=[],this.queue=[],this.engines.forEach(t=>t.destroy()),this.activeId=null}}const Cn={start:["started","resumed"],stop:["completed","skipped"],skip:["skipped"],complete:["completed"],step:["step-shown"],event:[],destroy:[]};function me(n){const{specs:t,autoMount:e=!0,storage:i,keyPrefix:o,...s}=n,r=new Map,a=i!==void 0||o!==void 0?{storage:i,keyPrefix:o,...s.persistence??{}}:s.persistence,c=(d,p)=>{const E=r.get(d);if(E)for(const y of E)try{y(p)}catch{}},l=new Mt(t,{...s,persistence:a,onEvent:d=>{c("event",d);for(const[p,E]of Object.entries(Cn))E.includes(d.type)&&c(p,d);s.onEvent?.(d)}});e&&l.mount();const h=d=>{const p=l.getActiveId();if(!p)return;const E=l.getEngine(p);E&&d(E)};return{start:(d,p)=>l.start(d,p),request:(d,p)=>l.request(d,p),stop:()=>l.stop("api"),skip:d=>{d?l.getEngine(d)?.skip("api"):l.stop("api")},pause:()=>l.pause(),resume:()=>l.resume(),next:()=>h(d=>{d.next()}),prev:()=>h(d=>d.prev()),goTo:d=>h(p=>p.goTo(d)),getState:d=>l.getState(d),getActiveId:()=>l.getActiveId(),getSpecs:()=>l.getSpecs(),hasSeen:d=>l.hasSeen(d),whyBlocked:d=>l.checkEligibility(d),getContext:()=>l.getContext(),setContext:d=>l.setContext(d),setTheme:d=>l.setTheme(d),setLocale:d=>l.setLocale(d),setUser:d=>l.setUser(d),reset:()=>l.reset(),resetTour:d=>l.resetTour(d),resetProgress:()=>l.resetProgress(),exportProgress:()=>l.exportProgress(),importProgress:(d,p)=>l.importProgress(d,p),getEngine:d=>l.getEngine(d),ready:l.ready,on(d,p){return r.has(d)||r.set(d,new Set),r.get(d).add(p),()=>this.off(d,p)},off(d,p){r.get(d)?.delete(p)},destroy(){c("destroy",{type:"skipped",tourId:l.getActiveId()??"",reason:"destroy",timestamp:Date.now()}),l.destroy(),r.clear()}}}function In(n,t={}){return new zt(n,t)}function Tn(n,t={}){return new Mt(n,t)}function On(n){return n}function Ln(n={}){const{days:t=365,path:e="/",domain:i,sameSite:o="Lax",secure:s}=n,r=()=>{const c={};if(typeof document>"u")return c;for(const l of document.cookie.split(";")){const h=l.indexOf("=");h<0||(c[decodeURIComponent(l.slice(0,h).trim())]=decodeURIComponent(l.slice(h+1)))}return c},a=(c,l,h)=>{if(typeof document>"u")return;const d=[`${encodeURIComponent(c)}=${encodeURIComponent(l)}`,`path=${e}`,`max-age=${Math.floor(h*86400)}`,`SameSite=${o}`];i&&d.push(`domain=${i}`),(s??o==="None")&&d.push("Secure"),document.cookie=d.join("; ")};return{getItem:c=>r()[c]??null,setItem:(c,l)=>a(c,l,t),removeItem:c=>a(c,"",-1)}}function Nn(n="opentutorial",t="kv"){const e=new At;if(typeof indexedDB>"u")return e;let i=null;const o=()=>i||(i=new Promise(r=>{try{const a=indexedDB.open(n,1);a.onupgradeneeded=()=>{const c=a.result;c.objectStoreNames.contains(t)||c.createObjectStore(t)},a.onsuccess=()=>r(a.result),a.onerror=()=>r(null),a.onblocked=()=>r(null)}catch{r(null)}}),i),s=async(r,a)=>{const c=await o();return c?new Promise(l=>{try{const h=c.transaction(t,r),d=a(h.objectStore(t));d.onsuccess=()=>l(d.result),d.onerror=()=>l(null)}catch{l(null)}}):null};return{getItem(r){const a=e.getItem(r);return a!==null?a:s("readonly",c=>c.get(r)).then(c=>(typeof c=="string"&&e.setItem(r,c),typeof c=="string"?c:null))},setItem(r,a){e.setItem(r,a),s("readwrite",c=>c.put(a,r))},removeItem(r){e.removeItem(r),s("readwrite",a=>a.delete(r))}}}function zn(n){const{endpoint:t,headers:e,debounceMs:i=400,fetchImpl:o,onError:s}=n,r=n.cache===!1?new At:n.cache??Zt(),a=o??(typeof fetch=="function"?fetch.bind(globalThis):void 0),c=t.replace(/\/$/,""),l=w=>`${c}/${encodeURIComponent(w)}`,h=()=>({"content-type":"application/json",...typeof e=="function"?e():e??{}}),d=new Map;let p=null;const E=async()=>{if(!a||d.size===0)return;const w=[...d.entries()];d.clear();for(const[u,g]of w)try{const b=await a(l(u),{method:g===null?"DELETE":"PUT",headers:h(),body:g===null?void 0:JSON.stringify({value:g}),credentials:"include"});if(!b.ok)throw new Error(`HTTP ${b.status}`)}catch(b){d.has(u)||d.set(u,g),s?.(b,g===null?"delete":"put",u)}},y=()=>{p&&clearTimeout(p),p=setTimeout(()=>{p=null,E()},i)};return typeof window<"u"&&(window.addEventListener("online",()=>{E()}),window.addEventListener("pagehide",()=>{E()})),{getItem(w){const u=r.getItem(w);return u??(a?a(l(w),{headers:h(),credentials:"include"}).then(g=>g.ok?g.json():null).then(g=>{const b=g?.value??null;return typeof b=="string"&&r.setItem(w,b),b}).catch(g=>(s?.(g,"get",w),null)):null)},setItem(w,u){r.setItem(w,u),d.set(w,u),y()},removeItem(w){r.removeItem(w),d.set(w,null),y()}}}const Mn=["data-tour","data-testid","data-test-id","data-test","data-cy","data-qa","data-automation-id"],Rn=/^(css-[a-z0-9]+|sc-[a-zA-Z0-9]+|jsx-\d+|[a-z]+-[a-f0-9]{5,}|_[\w-]{5,})$/,ge=/(^|[-_:])(\d{3,}|[a-f0-9]{8,}|uid|uuid|react-aria|radix|headlessui|mui-)/i;function U(n){return typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(n):n.replace(/["\\]/g,"\\$&")}function Rt(n,t=document){try{return t.querySelectorAll(n).length}catch{return 0}}function be(n){return Array.from(n.classList).filter(t=>t.length>1&&!Rn.test(t)&&!t.startsWith("ot-"))}function Pn(n){const t=n.parentElement;return t?Array.from(t.children).filter(i=>i.tagName===n.tagName).indexOf(n)+1:1}function Dn(n,t=document){const e=[];let i=n,o=0;for(;i&&i.nodeType===1&&o<6;){if(i.id&&!ge.test(i.id)){e.unshift(`#${U(i.id)}`);break}const s=i.tagName.toLowerCase();if(s==="html"||s==="body"){e.unshift(s);break}const r=be(i);let a=r.length>0?`${s}.${U(r[0])}`:s;const c=i.parentElement;c&&Array.from(c.children).filter(d=>d.tagName===i.tagName&&(r.length===0||d.classList.contains(r[0]))).length>1&&(a+=`:nth-of-type(${Pn(i)})`),e.unshift(a),i=c,o+=1;const l=e.join(" > ");if(Rt(l,t)===1)break}return e.join(" > ")}function Bn(n,t=document){const e=[],i=(l,h,d)=>{const p=Rt(l,t);if(p===0)return;const E=p===1?h:Math.max(10,h-25);e.push({selector:l,score:E,reason:d,matches:p})};for(const l of Mn){const h=n.getAttribute(l);h&&i(`[${l}="${U(h)}"]`,l==="data-tour"?100:92,`explicit ${l} hook`)}if(n.id){const l=!ge.test(n.id);i(`#${U(n.id)}`,l?85:45,l?"element id":"id looks generated")}const o=n.getAttribute("name");o&&i(`${n.tagName.toLowerCase()}[name="${U(o)}"]`,78,"form field name");const s=n.getAttribute("role"),r=n.getAttribute("aria-label");s&&r?i(`[role="${U(s)}"][aria-label="${U(r)}"]`,74,"role + aria-label"):r&&i(`[aria-label="${U(r)}"]`,70,"aria-label");const a=be(n);if(a.length>0){const l=n.tagName.toLowerCase();i(`${l}.${a.map(U).join(".")}`,55,"tag + stable classes"),a.length>1&&i(`.${U(a[0])}`,40,"single class")}const c=Dn(n,t);return c&&i(c,28,"structural path (fragile — add a data-tour attribute)"),e.filter((l,h,d)=>d.findIndex(p=>p.selector===l.selector)===h).sort((l,h)=>h.score-l.score)}function Pt(n,t=document){const e=Bn(n,t);if(e.length===0)return null;const[i,...o]=e,s=(n.textContent??"").replace(/\s+/g," ").trim();return{selector:i.selector,score:i.score,reason:i.reason,fallbacks:o.filter(r=>r.score>=40).slice(0,2).map(r=>r.selector),text:s.length>0&&s.length<=60?s:void 0}}function qn(n,t=document){return n.map(e=>{const i=Rt(e,t);return i===0?{selector:e,matches:i,ok:!1,note:"no element matches"}:i>1?{selector:e,matches:i,ok:!0,note:`matches ${i} elements; add target.index`}:{selector:e,matches:i,ok:!0}})}const Hn="[data-ot-recorder]";function ve(n={}){const t=n.minScore??60,e=[],i=document.createElement("style");i.setAttribute("data-ot-recorder",""),i.textContent=j,document.head.appendChild(i);const o=document.createElement("div");o.className="ot-rec-highlight",o.setAttribute("data-ot-recorder",""),o.style.display="none";const s=document.createElement("div");s.className="ot-rec-label",s.setAttribute("data-ot-recorder",""),s.style.display="none";const r=document.createElement("div");r.className="ot-rec-panel",r.setAttribute("data-ot-recorder",""),document.body.append(o,s,r);const a=()=>({specVersion:1,id:n.tourId??"recorded-tour",title:n.title??"Recorded tour",trigger:{type:"manual"},steps:e.length>0?e.map(b=>b.step):[{id:"step-1",title:"Untitled",content:"Add your copy here."}]}),c=()=>JSON.stringify(a(),null,2),l=()=>{r.replaceChildren();const b=document.createElement("h4");b.textContent=`Recording — ${e.length} step${e.length===1?"":"s"}`,r.appendChild(b);const m=document.createElement("ul");m.className="ot-rec-steps",e.forEach((O,I)=>{const R=document.createElement("li");R.className="ot-rec-step";const M=document.createElement("div");M.style.flex="1",M.style.minWidth="0";const B=document.createElement("div");B.textContent=`${I+1}. ${typeof O.step.title=="string"?O.step.title:O.step.id}`,M.appendChild(B);const T=document.createElement("code"),A=O.step.target?.selector;if(T.textContent=Array.isArray(A)?A[0]:A??"(no target)",M.appendChild(T),O.score<t){const k=document.createElement("div");k.textContent=`⚠ fragile (${O.score}) — ${O.reason}`,k.style.color="#f59e0b",k.style.fontSize="10.5px",M.appendChild(k)}const C=document.createElement("button");C.className="ot-rec-btn ot-rec-btn--ghost",C.textContent="×",C.title="Remove step",C.addEventListener("click",()=>{e.splice(I,1),h(),l(),n.onChange?.(a())}),R.append(M,C),m.appendChild(R)}),r.appendChild(m);const x=document.createElement("div");x.className="ot-rec-actions";const $=document.createElement("button");$.className="ot-rec-btn",$.textContent="Copy JSON",$.addEventListener("click",()=>d());const L=document.createElement("button");L.className="ot-rec-btn ot-rec-btn--ghost",L.textContent="Stop",L.addEventListener("click",()=>g()),x.append($,L),r.appendChild(x);const N=document.createElement("div");N.style.cssText="margin-top:8px;opacity:0.55;font-size:11px;line-height:1.45",N.textContent="Click any element to capture it. Esc stops recording.",r.appendChild(N)},h=()=>{e.forEach((b,m)=>{b.step.id=`step-${m+1}`})},d=()=>{const b=c();if(n.onExport){n.onExport(a(),b);return}navigator.clipboard?.writeText(b).catch(()=>{console.log(b)})},p=b=>!!b?.closest?.(Hn),E=b=>{const m=b.target;if(!m||p(m)){o.style.display="none",s.style.display="none";return}const x=m.getBoundingClientRect();o.style.display="",o.style.left=`${x.x}px`,o.style.top=`${x.y}px`,o.style.width=`${x.width}px`,o.style.height=`${x.height}px`;const $=Pt(m);s.style.display="",s.textContent=$?`${$.selector}  (${$.score})`:m.tagName.toLowerCase();const L=x.y+x.height+4;s.style.left=`${Math.max(4,x.x)}px`,s.style.top=L+22<window.innerHeight?`${L}px`:`${Math.max(4,x.y-22)}px`},y=b=>{const m=b.target;if(!m||p(m))return;b.preventDefault(),b.stopPropagation();const x=Pt(m);if(!x)return;const $=(m.textContent??"").replace(/\s+/g," ").trim().slice(0,40),L={id:`step-${e.length+1}`,target:{selector:x.fallbacks.length>0?[x.selector,...x.fallbacks]:x.selector,...x.score<t&&x.text?{text:x.text}:{}},title:$||"Untitled step",content:"Describe what the user should do here."};e.push({step:L,score:x.score,reason:x.reason}),l(),n.onChange?.(a())},w=b=>{b.key==="Escape"&&(b.preventDefault(),g())};document.addEventListener("pointermove",E,!0),document.addEventListener("click",y,!0),document.addEventListener("keydown",w,!0),l();let u=!1;const g=()=>{u||(u=!0,document.removeEventListener("pointermove",E,!0),document.removeEventListener("click",y,!0),document.removeEventListener("keydown",w,!0),o.remove(),s.remove(),r.remove(),i.remove())};return{stop:g,getSpec:a,toJSON:c}}function ye(n="ot-record"){try{const e=new URLSearchParams(window.location.search).get(n);return!e||e==="0"||e==="false"?null:ve({tourId:e==="1"?void 0:e})}catch{return null}}function jn(n){const t=document.createElement("style");t.setAttribute("data-ot-debug",""),t.textContent=j;const e=document.createElement("div");e.className="ot-debug",e.setAttribute("data-ot-debug",""),document.head.appendChild(t),document.body.appendChild(e);const i=(r,a,c)=>{const l=document.createElement("div");l.className="ot-debug-row";const h=document.createElement("span");h.className="ot-debug-key",h.textContent=r;const d=document.createElement("span");return d.className=`ot-debug-val${c?` ot-debug-${c}`:""}`,d.textContent=a,l.append(h,d),l},o=()=>{const r=n.getActiveId(),a=n.getState(),c=n.getContext(),l=n.specs.find(y=>y.id===r);e.replaceChildren();const h=document.createElement("h4");h.textContent="OpenTutorial debug",e.appendChild(h),e.appendChild(i("tour",r??"(none)")),e.appendChild(i("status",a?.status??"idle")),e.appendChild(i("step",a?.currentStepId??"—")),a&&e.appendChild(i("position",`${a.index+1} / ${a.total}`));const d=l?.steps.find(y=>y.id===a?.currentStepId);if(d?.target){const y=F(d.target);e.appendChild(i("target",y?"resolved":"NOT FOUND",y?"ok":"bad")),e.appendChild(i("selector",Kt(d.target)))}const p=Object.keys(c);if(p.length>0){const y=document.createElement("h4");y.textContent="context",y.style.marginTop="10px",e.appendChild(y);for(const w of p.slice(0,12))e.appendChild(i(w,JSON.stringify(c[w])?.slice(0,40)??"undefined"))}const E=[];l?.audience?.showIf&&E.push({label:"audience",expr:l.audience.showIf});for(const y of l?.steps??[])y.showIf&&E.push({label:y.id,expr:y.showIf});if(E.length>0){const y=document.createElement("h4");y.textContent="conditions",y.style.marginTop="10px",e.appendChild(y);for(const{label:w,expr:u}of E.slice(0,12)){const g=Ot(u,c);e.appendChild(i(w,`${u} → ${String(g)}`,g?"ok":"bad"))}}},s=()=>o();return window.addEventListener("opentutorial",s),o(),{update:o,destroy:()=>{window.removeEventListener("opentutorial",s),e.remove(),t.remove()}}}function _n(n="[opentutorial]"){const t=e=>{const i=e.detail;if(!i)return;const o=[i.type,i.tourId,i.stepId].filter(Boolean).join(" · ");console.log(`${n} ${o}${i.duration?` (${i.duration}ms)`:""}`)};return window.addEventListener("opentutorial",t),()=>window.removeEventListener("opentutorial",t)}function ot(n,t={}){const e={tour_id:n.tourId,event_type:n.type};return n.stepId!==void 0&&(e.step_id=n.stepId),n.index!==void 0&&(e.step_index=n.index),n.total!==void 0&&(e.step_total=n.total),n.duration!==void 0&&(e.duration_ms=n.duration),n.reason!==void 0&&(e.reason=n.reason),n.selector!==void 0&&(e.selector=n.selector),n.message!==void 0&&(e.message=n.message),n.meta&&Object.assign(e,n.meta),t.includeTimestamp!==!1&&(e.timestamp=n.timestamp),e}function bt(n,t="OpenTutorial"){return`${t} ${n.type}`}function J(n){try{n()}catch{}}function Fn(n){return t=>J(()=>n.capture(bt(t,"[OpenTutorial]"),ot(t)))}function Un(n){return t=>J(()=>n.track(bt(t,"[OpenTutorial]"),ot(t)))}function Wn(n){return t=>J(()=>n.track(bt(t,"[OpenTutorial]"),ot(t,{includeTimestamp:!1})))}function Vn(n){return t=>J(()=>n.track(bt(t,"OpenTutorial"),ot(t)))}function Gn(n){return t=>J(()=>{const e=window.gtag;typeof e=="function"&&e("event",`opentutorial_${t.type.replace(/-/g,"_")}`,{...ot(t,{includeTimestamp:!1}),send_to:n})})}function Kn(...n){const t=n.filter(e=>typeof e=="function");return e=>{for(const i of t)J(()=>i(e))}}function Jn(n){const{endpoint:t,headers:e,batchSize:i=20,flushMs:o=5e3,storage:s,storageKey:r="ot:analytics:queue",maxQueue:a=500,transform:c,fetchImpl:l,onError:h}=n,d=l??(typeof fetch=="function"?fetch.bind(globalThis):void 0);let p=[],E=null,y=!1;const w=()=>({"content-type":"application/json",...typeof e=="function"?e():e??{}}),u=()=>{s&&J(()=>s.setItem(r,JSON.stringify(p)))};s&&Promise.resolve(s.getItem(r)).then(m=>{if(typeof m=="string")try{const x=JSON.parse(m);Array.isArray(x)&&(p=[...x,...p].slice(-a))}catch{}});const g=async()=>{if(y||p.length===0||!d)return;y=!0;const m=p.splice(0,Math.max(i,1));u();try{const x=await d(t,{method:"POST",headers:w(),body:JSON.stringify({events:m}),keepalive:!0});if(!x.ok)throw new Error(`HTTP ${x.status}`)}catch(x){p=[...m,...p].slice(-a),u(),h?.(x,m)}finally{y=!1}},b=()=>{E||(E=setTimeout(()=>{E=null,g()},o))};return typeof window<"u"&&(window.addEventListener("online",()=>{g()}),window.addEventListener("pagehide",()=>{if(p.length===0)return;Xn(t,{events:p})&&(p=[],u())})),m=>J(()=>{p.push(c?c(m):ot(m)),p.length>a&&(p=p.slice(-a)),u(),p.length>=i?g():b()})}function Xn(n,t){try{return typeof navigator>"u"||typeof navigator.sendBeacon!="function"?!1:navigator.sendBeacon(n,new Blob([JSON.stringify(t)],{type:"application/json"}))}catch{return!1}}function xe(n){if(n.length===0)return 0;const t=[...n].sort((i,o)=>i-o),e=Math.floor(t.length/2);return t.length%2===0?Math.round((t[e-1]+t[e])/2):t[e]}function we(n,t,e){const i=n.filter(u=>u.tourId===t),o=i.filter(u=>u.type==="started"||u.type==="resumed").length,s=i.filter(u=>u.type==="completed").length,r=i.filter(u=>u.type==="skipped").length,a=i.filter(u=>(u.type==="completed"||u.type==="skipped")&&typeof u.duration=="number").map(u=>u.duration),c=[],l=new Map,h=new Map,d=new Map;for(const u of i)if(u.type==="step-shown"&&u.stepId&&(c.includes(u.stepId)||c.push(u.stepId),l.set(u.stepId,(l.get(u.stepId)??0)+1)),u.type==="step-completed"&&u.stepId&&(h.set(u.stepId,(h.get(u.stepId)??0)+1),typeof u.duration=="number")){const g=d.get(u.stepId)??[];g.push(u.duration),d.set(u.stepId,g)}const E=(e?e.steps.map(u=>u.id).filter(u=>l.has(u)):c).map((u,g)=>{const b=l.get(u)??0,m=h.get(u)??0,x=Math.max(0,b-m);return{stepId:u,index:g,views:b,completions:m,dropOffs:x,dropOffRate:b>0?x/b:0,medianDurationMs:xe(d.get(u)??[])}}),y=E.reduce((u,g)=>g.dropOffs>0&&(!u||g.dropOffRate>u.dropOffRate)?g:u,null),w=new Map;for(const u of i){if(u.type!=="target-not-found"||!u.stepId)continue;const g=`${u.stepId}::${u.selector??""}`,b=w.get(g);b?b.count+=1:w.set(g,{stepId:u.stepId,selector:u.selector??"",count:1})}return{tourId:t,starts:o,completions:s,skips:r,completionRate:o>0?s/o:0,medianDurationMs:xe(a),steps:E,worstStep:y,targetsNotFound:[...w.values()].sort((u,g)=>g.count-u.count)}}function Yn(n=5e3){const t=[];return{adapter:e=>{t.push(e),t.length>n&&t.splice(0,t.length-n)},events:t,report:(e,i)=>we(t,e,i),clear:()=>{t.length=0}}}function v(n,t,e={}){const i=document.createElement(n);t&&(i.className=t);const{text:o,html:s,...r}=e;return o!==void 0&&(i.textContent=o),s!==void 0&&(i.innerHTML=s),Object.assign(i,r),i}function Q(n,t,e){const i=v("button",n,{type:"button",text:t});return i.addEventListener("click",e),i}class Z{constructor(){f(this,"fns",[])}add(t){this.fns.push(t)}listen(t,e,i,o){t.addEventListener(e,i,o),this.fns.push(()=>t.removeEventListener(e,i,o))}run(){for(const t of this.fns)try{t()}catch{}this.fns=[]}}class Dt{constructor(t,e,i){f(this,"ready");f(this,"persistence");this.persistence=new It(t,e,i),this.ready=this.persistence.ready}shouldShow(t,e={}){const{once:i=!0,resurfaceAfter:o}=e;if(!i)return!0;const s=this.persistence.getRecord(t);return s?.at?o===void 0?!1:Date.now()-s.at>o:!0}markDismissed(t){this.persistence.mark(t,"skipped")}markActed(t){this.persistence.mark(t,"completed")}reset(t){this.persistence.reset(t)}}function tt(n,t){t!==null&&(t??document.body).appendChild(n)}function et(n,t){return{el:n,mount(e){(e??document.body).appendChild(n)},destroy(){t.run(),n.remove()}}}function Qn(n){const{id:t,message:e,position:i="top",action:o,dismissible:s=!0,resurfaceAfter:r,storage:a,keyPrefix:c="ot-banner",userId:l,container:h,className:d="",onDismiss:p}=n,E=new Z,y=new Dt(a,c,l),w=v("div",`ot-banner ot-banner--${i} ${d}`.trim());w.setAttribute("role","status"),w.hidden=!0;const u=v("span","ot-banner-content",{html:Y(e)});w.appendChild(u),o&&w.appendChild(Q("ot-banner-action",o.label,o.onClick));const g=()=>{y.markDismissed(t),w.hidden=!0,p?.()};if(s){const m=Q("ot-banner-dismiss","×",g);m.setAttribute("aria-label","Dismiss"),w.appendChild(m)}tt(w,h);let b=!0;return E.add(()=>{b=!1}),y.ready.then(()=>{b&&(w.hidden=!y.shouldShow(t,{resurfaceAfter:r}))}),{...et(w,E),setMessage(m){u.innerHTML=Y(m)},dismiss:g}}function Zn(n){const{id:t,title:e,content:i,once:o=!0,primaryAction:s,secondaryAction:r,dismissible:a=!0,allowHtml:c,locale:l="en",i18nResolver:h,storage:d,keyPrefix:p="ot-announce",userId:E,container:y,className:w="",onDismiss:u}=n,g=new Z,b=new Dt(d,p,E),m=v("div","ot-root");m.setAttribute("data-opentutorial",""),m.hidden=!0;const x=document.createElementNS("http://www.w3.org/2000/svg","svg");x.setAttribute("class","ot-backdrop"),x.setAttribute("width","100%"),x.setAttribute("height","100%"),x.setAttribute("aria-hidden","true");const $=document.createElementNS("http://www.w3.org/2000/svg","rect");$.setAttribute("class","ot-dim"),$.setAttribute("width","100%"),$.setAttribute("height","100%"),x.appendChild($);const L=`ot-announce-${t}`,N=v("div",`ot-popover ot-modal ot-popover--modal-step ${w}`.trim());N.setAttribute("role","dialog"),N.setAttribute("aria-modal","true"),N.setAttribute("aria-labelledby",L),N.style.left="50%",N.style.top="50%",N.style.transform="translate(-50%, -50%)";const O=v("div","ot-body"),I=k=>{o&&(k?b.markActed(t):b.markDismissed(t)),m.hidden=!0,k||u?.()};if(a){const k=Q("ot-skip","×",()=>I(!1));k.setAttribute("aria-label","Dismiss"),O.appendChild(k)}const R=v("h2","ot-title",{text:e});R.id=L,O.appendChild(R);const M=v("div","ot-content-wrap"),B=wt(i,k=>lt(k,l,h));M.appendChild(kt(B,{allowHtml:c})),O.appendChild(M);const T=v("div","ot-footer");T.appendChild(v("span"));const A=v("div","ot-btns");r&&A.appendChild(Q("ot-btn ot-btn-ghost",r.label,()=>{I(!0),r.onClick()})),A.appendChild(Q("ot-btn ot-btn-primary",s?.label??"Got it",()=>{I(!0),s?.onClick()})),T.appendChild(A),O.appendChild(T),N.appendChild(O),m.appendChild(x),m.appendChild(N),tt(m,y),a&&g.listen(window,"keydown",k=>{!m.hidden&&k.key==="Escape"&&I(!1)});let C=!0;return g.add(()=>{C=!1}),b.ready.then(()=>{C&&(m.hidden=!b.shouldShow(t,{once:o}),m.hidden||N.focus?.())}),{...et(m,g),close:()=>I(!1)}}function ti(n){const{target:t,content:e,glyph:i="?",openOnHover:o=!1,zIndex:s,container:r,className:a=""}=n,c=new Z,l=typeof t=="string"?{selector:t}:t,h=v("div",`ot-hint ${a}`.trim());s!==void 0&&(h.style.zIndex=String(s)),h.hidden=!0;const d=v("button","ot-hint-dot",{type:"button",text:i});d.setAttribute("aria-expanded","false"),d.setAttribute("aria-label","Show hint");const p=v("div","ot-hint-panel",{html:Y(e)});p.setAttribute("role","tooltip"),p.hidden=!0;const E=g=>{p.hidden=!g,d.setAttribute("aria-expanded",String(g)),d.setAttribute("aria-label",g?"Hide hint":"Show hint")};d.addEventListener("click",()=>E(p.hidden)),o&&(h.addEventListener("mouseenter",()=>E(!0)),h.addEventListener("mouseleave",()=>E(!1))),h.appendChild(d),h.appendChild(p),tt(h,r);let y=0;const w=()=>{const g=F(l);if(!g){h.hidden=!0;return}const b=g.element.getBoundingClientRect();h.hidden=!1,h.style.left=`${b.x+g.frameOffset.x+b.width}px`,h.style.top=`${b.y+g.frameOffset.y}px`},u=()=>{cancelAnimationFrame(y),y=requestAnimationFrame(w)};if(w(),c.listen(window,"resize",u),c.listen(window,"scroll",u,{capture:!0}),c.add(()=>cancelAnimationFrame(y)),typeof ResizeObserver<"u"){const g=new ResizeObserver(u);g.observe(document.documentElement),c.add(()=>g.disconnect())}return{...et(h,c),open:()=>E(!0),close:()=>E(!1),reposition:w}}function ei(n){const{id:t,kind:e="nps",question:i,options:o=[],lowLabel:s="Not likely",highLabel:r="Very likely",followUp:a,submitLabel:c="Submit",dismissLabel:l="Not now",thanksMessage:h="Thanks for the feedback!",container:d,className:p="",onSubmit:E,onDismiss:y}=n,w=new Z;let u=null,g=null;const b=v("div",`ot-survey ${p}`.trim()),m=`ot-survey-q-${t}`,x=v("p","ot-survey-question",{text:i});x.id=m,b.appendChild(x);const $=e==="nps"?Array.from({length:11},(T,A)=>A):e==="rating"?[1,2,3,4,5]:null,L=[],N=[],O=v("textarea","ot-survey-textarea");O.placeholder=e==="text"?i:a??"",O.setAttribute("aria-label",e==="text"?i:a??"Additional comments"),O.hidden=e!=="text";const I=v("button","ot-btn ot-btn-primary",{type:"button",text:c}),R=()=>{for(const A of L){const C=Number(A.dataset.value)===u;A.classList.toggle("ot-survey-score--selected",C),A.setAttribute("aria-checked",String(C))}for(const A of N){const C=A.dataset.value===g;A.classList.toggle("ot-survey-option--selected",C),A.setAttribute("aria-checked",String(C))}a&&e!=="text"&&(O.hidden=u===null&&g===null);const T=e==="nps"||e==="rating"?u!==null:e==="choice"?g!==null:O.value.trim().length>0;I.disabled=!T};if($){const T=v("div","ot-survey-scale");T.setAttribute("role","radiogroup"),T.setAttribute("aria-labelledby",m);for(const C of $){const k=v("button","ot-survey-score",{type:"button",text:String(C)});k.dataset.value=String(C),k.setAttribute("role","radio"),k.setAttribute("aria-checked","false"),k.addEventListener("click",()=>{u=C,R()}),L.push(k),T.appendChild(k)}b.appendChild(T);const A=v("div","ot-survey-labels");A.appendChild(v("span",void 0,{text:s})),A.appendChild(v("span",void 0,{text:r})),b.appendChild(A)}if(e==="choice"){const T=v("div","ot-survey-options");T.setAttribute("role","radiogroup"),T.setAttribute("aria-labelledby",m);for(const A of o){const C=v("button","ot-survey-option",{type:"button",text:A});C.dataset.value=A,C.setAttribute("role","radio"),C.setAttribute("aria-checked","false"),C.addEventListener("click",()=>{g=A,R()}),N.push(C),T.appendChild(C)}b.appendChild(T)}b.appendChild(O),O.addEventListener("input",R);const M=v("div","ot-footer");y?M.appendChild(Q("ot-btn ot-btn-ghost",l,y)):M.appendChild(v("span")),M.appendChild(I),b.appendChild(M);const B=()=>({surveyId:t,kind:e,score:u??void 0,choice:g??void 0,comment:O.value.trim()||void 0});return I.addEventListener("click",()=>{I.disabled||(E({...B(),submittedAt:Date.now()}),b.replaceChildren(v("p","ot-survey-thanks",{text:h})))}),R(),tt(b,d),{...et(b,w),getResponse:B,reset(){u=null,g=null,O.value="",R()}}}function ni(n){const{layer:t,specs:e,getStatus:i,onStart:o,title:s="Onboarding",startLabel:r="Start",runningLabel:a="Running",floating:c=!1,collapsible:l=!1,defaultCollapsed:h=!1,hideWhenComplete:d=!1,locale:p="en",i18nResolver:E,container:y,className:w="",onComplete:u}=n,g=new Z;let b=h,m=!1;const x=v("div","ot-checklist"),$=v("ul","ot-checklist-items"),L=v("div","ot-checklist-bar-track"),N=v("div","ot-checklist-bar-fill"),O=v("span","ot-checklist-count"),I=v("button","ot-checklist-toggle",{type:"button"});if(L.setAttribute("role","progressbar"),L.setAttribute("aria-valuemin","0"),L.setAttribute("aria-valuemax","100"),L.appendChild(N),s){const k=v("div","ot-checklist-header");k.appendChild(v("h3","ot-checklist-title",{text:s})),k.appendChild(O),l&&(I.addEventListener("click",()=>C(!b)),k.appendChild(I)),x.appendChild(k)}x.appendChild(L),x.appendChild($);const R=()=>e??t.getSpecs(),M=k=>i?i(k):t.getActiveId()===k?"in_progress":t.hasSeen(k)?"completed":"pending",B=k=>k===void 0?"":lt(k,p,E,t.getContext());let T={completed:0,total:0,percent:0};const A=()=>{const k=R(),G=k.map(H=>M(H.id)),z=G.filter(H=>H==="completed").length,q=k.length>0?Math.round(z/k.length*100):0;T={completed:z,total:k.length,percent:q},O.textContent=`${z}/${k.length}`,N.style.width=`${q}%`,L.setAttribute("aria-valuenow",String(q)),L.setAttribute("aria-label",`${z} of ${k.length} complete`),$.replaceChildren(),k.forEach((H,st)=>{const K=G[st],rt=v("li",`ot-checklist-item ot-checklist-item--${K}`),_=v("span","ot-checklist-icon",{text:K==="completed"?"✓":K==="in_progress"?"◌":"○"});_.setAttribute("aria-hidden","true"),rt.appendChild(_);const Bt=v("div","ot-checklist-info");Bt.appendChild(v("span","ot-checklist-name",{text:B(H.title)}));const Ee=B(H.description);if(Ee&&Bt.appendChild(v("span","ot-checklist-desc",{text:Ee})),rt.appendChild(Bt),K!=="completed"){const qt=v("button","ot-checklist-btn",{type:"button",text:K==="in_progress"?a:r});qt.disabled=K==="in_progress",qt.addEventListener("click",()=>{o?o(H.id):t.start(H.id)}),rt.appendChild(qt)}$.appendChild(rt)});const nt=k.length>0&&z===k.length;nt&&!m&&(m=!0,u?.()),nt||(m=!1),x.hidden=nt&&d,x.className=["ot-checklist",c?"ot-checklist--floating":"",b?"ot-checklist--collapsed":"",w].filter(Boolean).join(" ")};function C(k){b=k,I.textContent=b?"▸":"▾",I.setAttribute("aria-expanded",String(!b)),I.setAttribute("aria-label",b?"Expand checklist":"Collapse checklist"),A()}return C(b),tt(x,y),g.add(t.on("event",A)),{...et(x,g),refresh:A,setCollapsed:C,getProgress:()=>T}}function ii(n){const{layer:t,specs:e,links:i=[],title:o="Help & guides",searchPlaceholder:s="Search…",floating:r=!1,launcherGlyph:a="?",emptyMessage:c="Nothing matches that search.",locale:l="en",i18nResolver:h,container:d,className:p=""}=n,E=new Z;let y=!r,w="";const u=v("div","ot-hub-root"),g=v("div",`ot-hub ${r?"ot-hub--floating":""} ${p}`.trim()),b=v("div","ot-hub-header");b.appendChild(v("h3","ot-hub-title",{text:o}));const m=v("input","ot-hub-search");m.type="search",m.placeholder=s,m.setAttribute("aria-label",s),b.appendChild(m),g.appendChild(b);const x=v("ul","ot-hub-list");g.appendChild(x),u.appendChild(g);const $=v("button","ot-hub-launcher",{type:"button",text:a});r&&($.setAttribute("aria-label",o),u.appendChild($));const L=I=>I===void 0?"":lt(I,l,h,t.getContext()),N=()=>{if(g.hidden=!y,r&&($.textContent=y?"×":a,$.setAttribute("aria-label",y?"Close help":o),$.setAttribute("aria-expanded",String(y))),!y)return;const I=w.trim().toLowerCase(),R=e??t.getSpecs(),M=(T,A)=>!I||T.toLowerCase().includes(I)||A.toLowerCase().includes(I);x.replaceChildren();let B=0;for(const T of R){const A=L(T.title),C=L(T.description);if(!M(A,C))continue;B+=1;const k=v("li"),G=v("button","ot-hub-item",{type:"button",text:`${t.hasSeen(T.id)?"↻ ":""}${A}`});C&&G.appendChild(v("span","ot-hub-item-desc",{text:C})),G.addEventListener("click",()=>{t.start(T.id),r&&O(!1)}),k.appendChild(G),x.appendChild(k)}for(const T of i){const A=T.description??"";if(!M(T.label,A))continue;B+=1;const C=v("li"),k=v("a","ot-hub-item",{text:`${T.label} ↗`});k.href=T.href,k.target="_blank",k.rel="noopener noreferrer",A&&k.appendChild(v("span","ot-hub-item-desc",{text:A})),C.appendChild(k),x.appendChild(C)}B===0&&x.appendChild(v("li","ot-hub-empty",{text:c}))};function O(I){y=I,N()}return m.addEventListener("input",()=>{w=m.value,N()}),$.addEventListener("click",()=>O(!y)),N(),tt(u,d),E.add(t.on("event",()=>{y&&N()})),{...et(u,E),open:()=>O(!0),close:()=>O(!1),search(I){w=I,m.value=I,N()},refresh:N}}function oi(n){const{entries:t,title:e="What's new",floating:i=!0,launcherGlyph:o="✦",emptyMessage:s="Nothing new right now.",limit:r=20,allowHtml:a,locale:c="en",i18nResolver:l,storage:h,keyPrefix:d="ot-changelog",userId:p,container:E,className:y="",onRead:w}=n,u=new Z,g=new Dt(h,d,p);let b=t,m=!i,x=!1;const $=v("div","ot-changelog-root"),L=v("div",`ot-changelog ${i?"ot-changelog--floating":""} ${y}`.trim());L.setAttribute("role","region"),L.setAttribute("aria-label",e);const N=v("div","ot-changelog-header");N.appendChild(v("h3","ot-changelog-title",{text:e})),L.appendChild(N);const O=v("ul","ot-changelog-list");L.appendChild(O),$.appendChild(L);const I=v("button","ot-changelog-launcher",{type:"button"}),R=v("span","ot-changelog-badge");if(R.setAttribute("aria-hidden","true"),i)I.appendChild(v("span","ot-changelog-glyph",{text:o})),I.appendChild(R),$.appendChild(I);else{const z=Q("ot-changelog-close","×",()=>k(!1));z.setAttribute("aria-label","Close"),N.appendChild(z)}const M=()=>b.slice(0,r),B=()=>x?M().filter(z=>g.shouldShow(z.id)).map(z=>z.id):[],T=()=>{const z=B().length;R.textContent=z>99?"99+":String(z),R.hidden=z===0,I.setAttribute("aria-label",z>0?`${e} (${z} unread)`:e),I.setAttribute("aria-expanded",String(m))},A=()=>{O.replaceChildren();const z=M();if(z.length===0){O.appendChild(v("li","ot-changelog-empty",{text:s}));return}for(const q of z){const nt=x&&g.shouldShow(q.id),H=v("li",`ot-changelog-item${nt?" ot-changelog-item--unread":""}`),st=v("div","ot-changelog-meta");if(q.tag&&st.appendChild(v("span","ot-changelog-tag",{text:q.tag})),q.date){const _=v("time","ot-changelog-date",{text:q.date});_.dateTime=q.date,st.appendChild(_)}st.childElementCount>0&&H.appendChild(st),H.appendChild(v("h4","ot-changelog-entry-title",{text:q.title}));const K=v("div","ot-changelog-body"),rt=wt(q.content,_=>lt(_,c,l));if(K.appendChild(kt(rt,{allowHtml:a})),H.appendChild(K),q.href){const _=v("a","ot-changelog-link",{text:"Read more ↗"});_.href=q.href,_.target="_blank",_.rel="noopener noreferrer",H.appendChild(_)}O.appendChild(H)}},C=()=>{L.hidden=!m,T(),m&&A()};function k(z){if(m=z,L.hidden=!m,m){const q=B();if(A(),q.length>0){for(const nt of q)g.markActed(nt);w?.(q)}}T()}I.addEventListener("click",()=>k(!m)),tt($,E),C();let G=!0;return u.add(()=>{G=!1}),g.ready.then(()=>{G&&(x=!0,C())}),{...et($,u),open:()=>k(!0),close:()=>k(!1),unread:B,markAllRead(){for(const z of M())g.markActed(z.id);C()},setEntries(z){b=z,C()}}}const si=["specs","context","theme","locale","dir","z-index","interaction","auto-start","deep-link-param","resume","auto-resume","isolate","allow-html","debug"];function dt(n,t){if(!n)return t;try{return JSON.parse(n)}catch{return t}}class ri extends HTMLElement{constructor(){super(...arguments);f(this,"layer",null);f(this,"_specs",[]);f(this,"_context",{})}static get observedAttributes(){return si}set specs(e){this._specs=Array.isArray(e)?e:[],this.rebuild()}get specs(){return this._specs}set context(e){this._context=e??{},this.layer?.setContext(this._context)}get context(){return this._context}connectedCallback(){this.style.display="none",this.rebuild()}disconnectedCallback(){this.layer?.destroy(),this.layer=null}attributeChangedCallback(e){if(this.isConnected){if(e==="context"){this._context=dt(this.getAttribute("context"),{}),this.layer?.setContext(this._context);return}if(e==="locale"){const i=this.getAttribute("locale");i&&this.layer?.setLocale(i);return}this.rebuild()}}collectSpecs(){if(this._specs.length>0)return this._specs;const e=dt(this.getAttribute("specs"),null);if(e)return Array.isArray(e)?e:[e];const i=[];for(const o of Array.from(this.querySelectorAll('script[type="application/json"]'))){const s=dt(o.textContent,null);s&&i.push(...Array.isArray(s)?s:[s])}return i}rebuild(){if(!this.isConnected)return;this.layer?.destroy();const e=this.collectSpecs();if(e.length===0){this.layer=null;return}const i=a=>this.hasAttribute(a)&&this.getAttribute(a)!=="false",o=Number(this.getAttribute("z-index")),s=this.getAttribute("deep-link-param");this.layer=me({specs:e,context:{...dt(this.getAttribute("context"),{}),...this._context},theme:dt(this.getAttribute("theme"),void 0),locale:this.getAttribute("locale")??void 0,dir:this.getAttribute("dir")??void 0,zIndex:Number.isFinite(o)&&o>0?o:void 0,interaction:this.getAttribute("interaction")??void 0,deepLinkParam:s==="false"?!1:s??void 0,resume:i("resume"),autoResume:i("auto-resume"),isolate:i("isolate"),allowHtml:i("allow-html"),debug:i("debug"),onEvent:a=>{this.dispatchEvent(new CustomEvent("opentutorial",{detail:a,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent(`ot-${a.type}`,{detail:a,bubbles:!0,composed:!0}))}});const r=this.getAttribute("auto-start");r&&this.layer.ready.then(()=>this.layer?.request(r))}start(e,i){this.layer?.start(e,i)}stop(){this.layer?.stop()}pause(){this.layer?.pause()}resumeTour(){this.layer?.resume()}next(){this.layer?.next()}prev(){this.layer?.prev()}reset(){this.layer?.reset()}getState(e){return this.layer?.getState(e)??null}getLayer(){return this.layer}}function ke(n="open-tutorial"){typeof customElements>"u"||customElements.get(n)||customElements.define(n,ri)}ke(),ye(),queueMicrotask(()=>{const n=globalThis;n.OpenTutorial&&!n.Opentutorial&&(n.Opentutorial=n.OpenTutorial)}),S.CSS=j,S.TourEngine=zt,S.TourOrchestrator=Mt,S.TourPersistence=It,S.assertValidSpec=ln,S.auditSelectors=qn,S.bestSelector=Pt,S.createAmplitudeAdapter=Wn,S.createAnnouncement=Zn,S.createBanner=Qn,S.createChangelog=oi,S.createChecklist=ni,S.createCookieStorage=Ln,S.createDebugPanel=jn,S.createEventCollector=Yn,S.createFunnelReport=we,S.createGA4Adapter=Gn,S.createHint=ti,S.createHttpAdapter=Jn,S.createIndexedDBStorage=Nn,S.createMixpanelAdapter=Un,S.createMultiAdapter=Kn,S.createPostHogAdapter=Fn,S.createRemoteStorage=zn,S.createResourceCenter=ii,S.createSegmentAdapter=Vn,S.createSurvey=ei,S.createTour=In,S.createTours=Tn,S.createTutorialLayer=me,S.defineOpenTutorialElement=ke,S.defineSpec=On,S.enableRecorderFromUrl=ye,S.evaluateExpression=Ot,S.evaluateShowIf=ct,S.logEvents=_n,S.resolveTarget=F,S.startRecorder=ve,S.validateSpec=gt,S.validateSpecs=dn,S.waitForTarget=ft,Object.defineProperty(S,Symbol.toStringTag,{value:"Module"})})(this.OpenTutorial=this.OpenTutorial||{});
//# sourceMappingURL=opentutorial.global.js.map
