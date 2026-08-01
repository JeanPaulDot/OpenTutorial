"use strict";var A=Object.defineProperty;var C=(o,t,e)=>t in o?A(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var x=(o,t,e)=>C(o,typeof t!="symbol"?t+"":t,e);const R=`
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
`.trim(),j="button, a, [role], label, summary, h1, h2, h3, h4, h5, h6, p, li, td, th, span, div";function z(o,t=document){try{return t.querySelector(o)}catch{return null}}function f(o,t=document){try{return Array.from(t.querySelectorAll(o))}catch{return[]}}function m(o,t=document){const e=f(o,t),r=new Set,c=n=>{for(const i of f("*",n)){const a=i.shadowRoot;!a||r.has(a)||(r.add(a),e.push(...f(o,a)),c(a))}};return c(t),[...new Set(e)]}function h(o){const t=o.getBoundingClientRect();if(t.width===0&&t.height===0)return!1;const e=o.ownerDocument?.defaultView;if(!e)return!0;const r=e.getComputedStyle(o);return r.visibility!=="hidden"&&r.display!=="none"&&r.opacity!=="0"}function g(o){return o.replace(/\s+/g," ").trim().toLowerCase()}function y(o,t,e){const r=g(o);if(!r)return null;const n=(t??f(j,e)).filter(p=>g(p.textContent??"").includes(r));if(n.length===0)return null;const i=n.filter(p=>g(p.textContent??"")===r);return(i.length?i:n).reduce((p,l)=>p.contains(l)?l:p)}function v(o){if(!o.iframe)return{doc:document,offset:{x:0,y:0}};const t=z(o.iframe);if(!t)return null;try{const e=t.contentDocument;if(!e)return null;const r=t.getBoundingClientRect();return{doc:e,offset:{x:r.x,y:r.y}}}catch{return null}}function u(o){const t=v(o);if(!t)return null;const{doc:e,offset:r}=t,c=o.selector?Array.isArray(o.selector)?o.selector:[o.selector]:[],n=i=>{const a=o.visible?i.filter(h):i;return a.length===0?null:a[o.index??0]??null};for(const i of c){const a=o.shadow?m(i,e):f(i,e);if(o.text){const l=y(o.text,o.visible?a.filter(h):a,e);if(l)return{element:l,doc:e,frameOffset:r,matched:i};continue}const p=n(a);if(p)return{element:p,doc:e,frameOffset:r,matched:i}}if(c.length===0&&o.text){const i=y(o.text,null,e);if(i&&(!o.visible||h(i)))return{element:i,doc:e,frameOffset:r,matched:`text:${o.text}`}}return null}function q(o){if(!o.all){const i=u(o);return i?[i]:[]}const t=v(o);if(!t)return[];const{doc:e,offset:r}=t,c=o.selector?Array.isArray(o.selector)?o.selector:[o.selector]:[];for(const i of c){const a=o.shadow?m(i,e):f(i,e),p=o.visible?a.filter(h):a;if(p.length>0)return p.map(l=>({element:l,doc:e,frameOffset:r,matched:i}))}const n=u(o);return n?[n]:[]}function D(o){const t=[];return o.selector&&t.push(Array.isArray(o.selector)?o.selector.join(" | "):o.selector),o.text&&t.push(`text "${o.text}"`),o.iframe&&t.push(`in iframe ${o.iframe}`),t.join(" + ")||"(no selector)"}function O(o,t=5e3){return new Promise(e=>{const r=u(o);if(r){e(r);return}let c=!1,n=null;const i=d=>{c||(c=!0,n?.disconnect(),clearInterval(p),clearTimeout(l),e(d))},a=()=>{const d=u(o);d&&i(d)};try{n=new MutationObserver(a);const d=o.iframe?v(o)?.doc.documentElement??document.documentElement:document.documentElement;n.observe(d,{childList:!0,subtree:!0,attributes:!0})}catch{}const p=setInterval(a,100),l=setTimeout(()=>i(null),t)})}function M(o,t=5e3){return O({selector:o},t).then(e=>e?.element??null)}const _=500,F=new Set(["__proto__","constructor","prototype"]),w={includes:(o,t)=>typeof o=="string"?o.includes(String(t[0])):Array.isArray(o)?o.includes(t[0]):!1,startsWith:(o,t)=>typeof o=="string"?o.startsWith(String(t[0])):!1,endsWith:(o,t)=>typeof o=="string"?o.endsWith(String(t[0])):!1,toLowerCase:o=>typeof o=="string"?o.toLowerCase():o,toUpperCase:o=>typeof o=="string"?o.toUpperCase():o,trim:o=>typeof o=="string"?o.trim():o,indexOf:(o,t)=>typeof o=="string"?o.indexOf(String(t[0])):Array.isArray(o)?o.indexOf(t[0]):-1,matches:(o,t)=>{if(typeof o!="string")return!1;try{return new RegExp(String(t[0])).test(o)}catch{return!1}}},$=["===","!==","==","!=","<=",">=","&&","||","<",">","!","(",")","[","]",",","+","-","*","/","%","?",":"];function E(o){const t=[];let e=0;for(;e<o.length;){const r=o.slice(e);if(/^\s/.test(r)){e+=1;continue}const c=$.find(i=>r.startsWith(i));if(c){t.push({t:"op",v:c}),e+=c.length;continue}if(r[0]==="."){t.push({t:"dot"}),e+=1;continue}let n=r.match(/^'((?:[^'\\]|\\.)*)'/)??r.match(/^"((?:[^"\\]|\\.)*)"/);if(n){t.push({t:"str",v:n[1].replace(/\\(.)/g,"$1")}),e+=n[0].length;continue}if(n=r.match(/^\d+(\.\d+)?/),n){t.push({t:"num",v:Number(n[0])}),e+=n[0].length;continue}if(n=r.match(/^(true|false)\b/),n){t.push({t:"bool",v:n[1]==="true"}),e+=n[0].length;continue}if(n=r.match(/^null\b/),n){t.push({t:"null"}),e+=n[0].length;continue}if(n=r.match(/^undefined\b/),n){t.push({t:"undef"}),e+=n[0].length;continue}if(n=r.match(/^[A-Za-z_$][\w$]*/),n){t.push({t:"ident",v:n[0]}),e+=n[0].length;continue}throw new Error(`Unexpected character "${r[0]}" at ${e}`)}return t}function b(o,t){if(o!=null&&!(typeof t=="string"&&F.has(t))){if(typeof o=="string")return t==="length"?o.length:typeof t=="number"?o[t]:void 0;if(Array.isArray(o))return t==="length"?o.length:o[t];if(typeof o=="object")return o[String(t)]}}function k(o,t){return o===t?!0:o==null?t==null:typeof o=="number"||typeof t=="number"?Number(o)===Number(t):String(o)===String(t)}function s(o){return typeof o=="number"?o:Number(o)}class S{constructor(t,e){x(this,"pos",0);x(this,"tokens");x(this,"ctx");this.tokens=t,this.ctx=e}parse(){const t=this.ternary();if(this.pos!==this.tokens.length)throw new Error("Trailing tokens");return t}peek(){return this.tokens[this.pos]}isOp(t){const e=this.peek();return!!e&&e.t==="op"&&e.v===t}eatOp(t){return this.isOp(t)?(this.pos+=1,!0):!1}expectOp(t){if(!this.eatOp(t))throw new Error(`Expected "${t}"`)}ternary(){const t=this.orExpr();if(!this.eatOp("?"))return t;const e=this.ternary();this.expectOp(":");const r=this.ternary();return t?e:r}orExpr(){let t=this.andExpr();for(;this.eatOp("||");){const e=this.andExpr();t=t||e}return t}andExpr(){let t=this.equality();for(;this.eatOp("&&");){const e=this.equality();t=t&&e}return t}equality(){let t=this.relational();for(;;){if(this.eatOp("===")){t=t===this.relational();continue}if(this.eatOp("!==")){t=t!==this.relational();continue}if(this.eatOp("==")){t=k(t,this.relational());continue}if(this.eatOp("!=")){t=!k(t,this.relational());continue}return t}}relational(){let t=this.additive();for(;;){if(this.eatOp("<=")){t=s(t)<=s(this.additive());continue}if(this.eatOp(">=")){t=s(t)>=s(this.additive());continue}if(this.eatOp("<")){t=s(t)<s(this.additive());continue}if(this.eatOp(">")){t=s(t)>s(this.additive());continue}return t}}additive(){let t=this.multiplicative();for(;;){if(this.eatOp("+")){const e=this.multiplicative();t=typeof t=="string"||typeof e=="string"?String(t)+String(e):s(t)+s(e);continue}if(this.eatOp("-")){t=s(t)-s(this.multiplicative());continue}return t}}multiplicative(){let t=this.unary();for(;;){if(this.eatOp("*")){t=s(t)*s(this.unary());continue}if(this.eatOp("/")){t=s(t)/s(this.unary());continue}if(this.eatOp("%")){t=s(t)%s(this.unary());continue}return t}}unary(){return this.eatOp("!")?!this.unary():this.eatOp("-")?-s(this.unary()):this.postfix()}postfix(){let t=this.primary();for(;;){if(this.peek()?.t==="dot"){this.pos+=1;const e=this.peek();if(!e||e.t!=="ident")throw new Error('Expected identifier after "."');if(this.pos+=1,this.isOp("(")){this.pos+=1;const r=[];if(!this.isOp(")"))do r.push(this.ternary());while(this.eatOp(","));this.expectOp(")");const c=Object.prototype.hasOwnProperty.call(w,e.v)?w[e.v]:void 0;if(typeof c!="function")throw new Error(`Method "${e.v}" is not allowed`);t=c(t,r);continue}t=b(t,e.v);continue}if(this.eatOp("[")){const e=this.ternary();this.expectOp("]"),t=b(t,typeof e=="number"?e:String(e));continue}return t}}primary(){const t=this.peek();if(!t)throw new Error("Unexpected end of expression");if(t.t==="op"&&t.v==="("){this.pos+=1;const e=this.ternary();return this.expectOp(")"),e}if(t.t==="op"&&t.v==="["){this.pos+=1;const e=[];if(!this.isOp("]"))do e.push(this.ternary());while(this.eatOp(","));return this.expectOp("]"),e}switch(this.pos+=1,t.t){case"str":return t.v;case"num":return t.v;case"bool":return t.v;case"null":return null;case"undef":return;case"ident":return b(this.ctx,t.v);default:throw new Error("Unexpected token")}}}function T(o,t,e={}){try{if(typeof o!="string")return;if(o.length>(e.maxLength??_)){e.onError?.("expression exceeds the maximum length",o);return}return new S(E(o),t).parse()}catch(r){e.onError?.(r instanceof Error?r.message:"invalid expression",o);return}}function L(o,t,e={}){return!!T(o,t,e)}function N(o){try{return new S(E(o),{}).parse(),{ok:!0}}catch(t){return{ok:!1,message:t instanceof Error?t.message:"invalid expression"}}}exports.CSS=R;exports.checkExpression=N;exports.describeTarget=D;exports.evaluateExpression=T;exports.evaluateShowIf=L;exports.isVisible=h;exports.queryDeep=m;exports.resolveTarget=u;exports.resolveTargets=q;exports.safeQuery=z;exports.waitForElement=M;exports.waitForTarget=O;
//# sourceMappingURL=safeEval.cjs.js.map
