var ri=Object.defineProperty;var ai=(y,A,z)=>A in y?ri(y,A,{enumerable:!0,configurable:!0,writable:!0,value:z}):y[A]=z;var u=(y,A,z)=>ai(y,typeof A!="symbol"?A+"":A,z);(function(y){"use strict";const A=`
/*
 * Opentutorial styles. Everything is driven by --ot-* custom properties set on
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
`.trim();let z=0;class _t{constructor(t,e={}){u(this,"root");u(this,"host");u(this,"shadow",null);u(this,"svg");u(this,"dimRect");u(this,"hole");u(this,"ring");u(this,"shield");u(this,"panels",[]);u(this,"current",null);u(this,"interaction","free");u(this,"opts");z+=1;const s=`ot-mask-${z}`;if(this.opts=e,this.root=document.createElement("div"),this.root.className="ot-root",this.root.style.setProperty("--ot-z",String(t)),this.root.setAttribute("data-opentutorial",""),e.dir&&this.root.setAttribute("dir",e.dir),e.isolate){this.host=document.createElement("div"),this.host.setAttribute("data-opentutorial-host",""),this.host.style.cssText="position:fixed;inset:0;pointer-events:none;",this.host.style.zIndex=String(t);try{this.shadow=this.host.attachShadow({mode:"open"});const a=document.createElement("style");a.textContent=A,this.shadow.appendChild(a),this.shadow.appendChild(this.root)}catch{this.shadow=null,this.host=this.root}}else this.host=this.root;const n="http://www.w3.org/2000/svg";this.svg=document.createElementNS(n,"svg"),this.svg.setAttribute("class","ot-backdrop"),this.svg.setAttribute("width","100%"),this.svg.setAttribute("height","100%"),this.svg.setAttribute("aria-hidden","true");const o=document.createElementNS(n,"defs"),r=document.createElementNS(n,"mask");r.setAttribute("id",s);const c=document.createElementNS(n,"rect");c.setAttribute("x","0"),c.setAttribute("y","0"),c.setAttribute("width","100%"),c.setAttribute("height","100%"),c.setAttribute("fill","white"),this.hole=document.createElementNS(n,"rect"),this.hole.setAttribute("fill","black"),this.hole.setAttribute("rx","12"),this.setHole({x:-9999,y:-9999,width:0,height:0},0),r.appendChild(c),r.appendChild(this.hole),o.appendChild(r),this.dimRect=document.createElementNS(n,"rect"),this.dimRect.setAttribute("class","ot-dim"),this.dimRect.setAttribute("x","0"),this.dimRect.setAttribute("y","0"),this.dimRect.setAttribute("width","100%"),this.dimRect.setAttribute("height","100%"),this.dimRect.setAttribute("mask",`url(#${s})`),this.svg.appendChild(o),this.svg.appendChild(this.dimRect),this.ring=document.createElement("div"),this.ring.className="ot-ring",this.ring.style.opacity="0",this.shield=document.createElement("div"),this.shield.className="ot-shield",this.shield.style.display="none";for(let a=0;a<4;a+=1){const l=document.createElement("div");l.className="ot-shield-panel",this.panels.push(l),this.shield.appendChild(l)}this.root.appendChild(this.svg),this.root.appendChild(this.ring),this.root.appendChild(this.shield),this.svg.style.display="none"}setHole(t,e){this.hole.setAttribute("x",String(t.x-e)),this.hole.setAttribute("y",String(t.y-e)),this.hole.setAttribute("width",String(Math.max(0,t.width+e*2))),this.hole.setAttribute("height",String(Math.max(0,t.height+e*2)))}updateSpotlight(t,e=8,s=12){if(this.current=t?{...t,padding:e,radius:s}:null,!t){this.setHole({x:-9999,y:-9999,width:0,height:0},0),this.ring.style.opacity="0",this.svg.style.display="none",this.applyShield();return}this.svg.style.display="",this.setHole(t,e),this.hole.setAttribute("rx",String(s));const n=this.ring.style;n.opacity="1",n.left=`${t.x-e}px`,n.top=`${t.y-e}px`,n.width=`${t.width+e*2}px`,n.height=`${t.height+e*2}px`,n.borderRadius=`${s}px`,this.applyShield()}showBackdrop(){this.current=null,this.svg.style.display="",this.setHole({x:-9999,y:-9999,width:0,height:0},0),this.ring.style.opacity="0",this.applyShield()}setInteraction(t){this.interaction=t,this.applyShield()}applyShield(){if(this.interaction==="free"){this.shield.style.display="none";return}this.shield.style.display="";const t=window.innerWidth,e=window.innerHeight,s=this.interaction==="target-only"&&this.current?{x:this.current.x-this.current.padding,y:this.current.y-this.current.padding,width:this.current.width+this.current.padding*2,height:this.current.height+this.current.padding*2}:{x:t,y:e,width:0,height:0},[n,o,r,c]=this.panels,a=(l,d,p,f,k)=>{l.style.left=`${d}px`,l.style.top=`${p}px`,l.style.width=`${Math.max(0,f)}px`,l.style.height=`${Math.max(0,k)}px`};a(n,0,0,t,s.y),a(r,0,s.y+s.height,t,e-(s.y+s.height)),a(c,0,s.y,s.x,s.height),a(o,s.x+s.width,s.y,t-(s.x+s.width),s.height)}refresh(){this.current?this.updateSpotlight(this.current,this.current.padding,this.current.radius):this.applyShield()}mountPopover(t){this.root.appendChild(t)}setBackdropColor(t){this.dimRect.style.fill=t}setDir(t){this.root.setAttribute("dir",t)}attach(t){(t??this.opts.container??document.body).appendChild(this.host)}destroy(){this.host.remove()}}const Ht={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function lt(i){return i.replace(/[&<>"']/g,t=>Ht[t]??t)}const Ft=/^(https?:\/\/|mailto:)/i;function W(i){if(typeof i!="string")return"";let t=lt(i);return t=t.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(e,s,n)=>Ft.test(n)?`<a href="${n}" target="_blank" rel="noopener noreferrer">${s}</a>`:e),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*([^*]+)\*/g,"<em>$1</em>"),t=t.replace(/~~([^~]+)~~/g,"<s>$1</s>"),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\r?\n/g,"<br>"),t}function Ut(i,t){return i&&typeof i=="object"&&"blocks"in i&&Array.isArray(i.blocks)?i.blocks.map(e=>{switch(e.type){case"text":return{type:"text",value:t(e.value)};case"list":return{...e,items:e.items.map(s=>t(s))};default:return e}}):[{type:"text",value:t(i)}]}function Vt(i){return i.map(t=>{switch(t.type){case"text":return typeof t.value=="string"?t.value:"";case"list":return t.items.filter(e=>typeof e=="string").join(", ");case"code":return t.value;case"image":return t.alt;default:return""}}).filter(Boolean).join(" ")}function Wt(i,t={}){const e=t.doc??document,s=e.createDocumentFragment();for(const n of i)switch(n.type){case"text":{const o=e.createElement("p");o.className="ot-content",o.innerHTML=W(typeof n.value=="string"?n.value:""),s.appendChild(o);break}case"image":{const o=e.createElement("img");o.className="ot-media ot-media-image",o.src=n.src,o.alt=n.alt,o.loading="lazy",n.width&&(o.width=n.width),n.height&&(o.height=n.height),s.appendChild(o);break}case"video":{const o=e.createElement("video");o.className="ot-media ot-media-video",o.src=n.src,n.poster&&(o.poster=n.poster),o.controls=n.controls??!0,o.loop=n.loop??!1,o.muted=n.muted??n.autoplay??!1,o.playsInline=!0,n.autoplay&&(o.autoplay=!0,o.muted=!0),s.appendChild(o);break}case"list":{const o=e.createElement(n.ordered?"ol":"ul");o.className="ot-list";for(const r of n.items){const c=e.createElement("li");c.innerHTML=W(typeof r=="string"?r:""),o.appendChild(c)}s.appendChild(o);break}case"code":{const o=e.createElement("pre");o.className="ot-code";const r=e.createElement("code");n.lang&&(r.dataset.lang=n.lang),r.textContent=n.value,o.appendChild(r),s.appendChild(o);break}case"divider":{const o=e.createElement("hr");o.className="ot-divider",s.appendChild(o);break}case"html":{const o=e.createElement("div");o.className="ot-html",o.innerHTML=t.allowHtml?n.value:lt(n.value),s.appendChild(o);break}}return s}const Kt=14,O=10;function Gt(i){if(i==="auto"||i==="center")return{side:"auto",align:"center"};const[t,e]=i.split("-");return{side:t,align:e??"center"}}function Jt(i){return{top:"bottom",bottom:"top",left:"right",right:"left"}[i]}function Yt(i){return i==="left"?"right":i==="right"?"left":i}class Xt{constructor(t,e="ltr"){u(this,"el");u(this,"titleEl");u(this,"contentEl");u(this,"progressEl");u(this,"liveEl");u(this,"backBtn");u(this,"nextBtn");u(this,"skipBtn");u(this,"arrow");u(this,"lastSide",null);u(this,"cbs");u(this,"dir");this.cbs=t,this.dir=e,this.el=document.createElement("div"),this.el.className="ot-popover",this.el.setAttribute("role","dialog"),this.el.tabIndex=-1,this.arrow=document.createElement("div"),this.arrow.className="ot-arrow";const s=document.createElement("div");s.className="ot-body",this.skipBtn=document.createElement("button"),this.skipBtn.type="button",this.skipBtn.className="ot-skip",this.skipBtn.setAttribute("aria-label","Close tour"),this.skipBtn.innerHTML="&times;",this.skipBtn.addEventListener("click",()=>this.cbs.onSkip()),this.titleEl=document.createElement("h2"),this.titleEl.className="ot-title",this.titleEl.id=`ot-title-${Math.random().toString(36).slice(2,8)}`,this.el.setAttribute("aria-labelledby",this.titleEl.id),this.contentEl=document.createElement("div"),this.contentEl.className="ot-content-wrap",this.progressEl=document.createElement("div"),this.progressEl.className="ot-dots",this.progressEl.setAttribute("aria-hidden","true"),this.liveEl=document.createElement("span"),this.liveEl.className="ot-sr-only",this.liveEl.setAttribute("aria-live","polite"),this.liveEl.setAttribute("aria-atomic","true"),this.backBtn=document.createElement("button"),this.backBtn.type="button",this.backBtn.className="ot-btn ot-btn-ghost",this.backBtn.addEventListener("click",()=>this.cbs.onPrev()),this.nextBtn=document.createElement("button"),this.nextBtn.type="button",this.nextBtn.className="ot-btn ot-btn-primary",this.nextBtn.addEventListener("click",()=>this.cbs.onNext());const n=document.createElement("div");n.className="ot-footer";const o=document.createElement("div");o.className="ot-btns",o.appendChild(this.backBtn),o.appendChild(this.nextBtn),n.appendChild(this.progressEl),n.appendChild(o),s.appendChild(this.skipBtn),s.appendChild(this.titleEl),s.appendChild(this.contentEl),s.appendChild(this.liveEl),s.appendChild(n),this.el.appendChild(this.arrow),this.el.appendChild(s)}setDir(t){this.dir=t}render(t){this.titleEl.textContent=t.title,this.contentEl.replaceChildren(Wt(t.blocks,{allowHtml:t.allowHtml})),this.liveEl.textContent=`${t.title}. Step ${t.index+1} of ${t.total}`,this.progressEl.replaceChildren();for(let s=0;s<t.total;s+=1){const n=document.createElement("span");n.className=`ot-dot${s===t.index?" ot-dot-active":""}`,this.progressEl.appendChild(n)}const e=t.showBack&&t.canGoBack&&t.index>0;this.backBtn.style.display=e?"":"none",this.backBtn.textContent=t.labels.back,this.nextBtn.style.display=t.showNext?"":"none",this.nextBtn.textContent=t.isLast?t.labels.done:t.labels.next,this.skipBtn.style.display=t.skippable?"":"none",this.skipBtn.setAttribute("aria-label",t.labels.skip),this.el.setAttribute("aria-modal",t.modal?"true":"false"),this.el.classList.toggle("ot-popover--modal-step",t.modal)}position(t,e,s){const n=window.innerWidth,o=window.innerHeight,r=this.el.offsetWidth,c=this.el.offsetHeight;if(!t||e==="center"){this.lastSide="modal",this.el.classList.add("ot-modal"),this.arrow.style.display="none",this.el.style.left=`${Math.max(O,(n-r)/2)}px`,this.el.style.top=`${Math.max(O,(o-c)/2)}px`;return}this.el.classList.remove("ot-modal"),this.arrow.style.display="";const a=Gt(e),l=this.dir==="rtl"?Yt(a.side):a.side,d=a.align,p=Kt+s,f={top:t.y,bottom:o-(t.y+t.height),left:t.x,right:n-(t.x+t.width)};let x=l==="auto"?["bottom","right","top","left"].reduce((v,S)=>f[S]>f[v]?S:v,"bottom"):l;const w=m=>m==="top"||m==="bottom"?f[m]>=c+p:f[m]>=r+p;if(!w(x)){const m=Jt(x);w(m)?x=m:x=Object.keys(f).reduce((v,S)=>f[v]>=f[S]?v:S)}let h=0,g=0;const b=(m,v,S)=>d==="start"?this.dir==="rtl"?m+v-S:m:d==="end"?this.dir==="rtl"?m:m+v-S:m+v/2-S/2;x==="top"||x==="bottom"?(h=b(t.x,t.width,r),g=x==="top"?t.y-c-p:t.y+t.height+p):(g=b(t.y,t.height,c),h=x==="left"?t.x-r-p:t.x+t.width+p),h=Math.min(Math.max(h,O),Math.max(O,n-r-O)),g=Math.min(Math.max(g,O),Math.max(O,o-c-O)),this.el.style.left=`${h}px`,this.el.style.top=`${g}px`,this.lastSide=x,this.positionArrow(x,t,h,g,r,c)}positionArrow(t,e,s,n,o,r){const c=this.arrow.style;c.top="",c.bottom="",c.left="",c.right="",this.arrow.dataset.side=t;const a=e.x+e.width/2,l=e.y+e.height/2;t==="top"?(c.bottom="-5px",c.left=`${Math.min(Math.max(a-s,16),Math.max(16,o-16))}px`):t==="bottom"?(c.top="-5px",c.left=`${Math.min(Math.max(a-s,16),Math.max(16,o-16))}px`):t==="left"?(c.right="-5px",c.top=`${Math.min(Math.max(l-n,16),Math.max(16,r-16))}px`):(c.left="-5px",c.top=`${Math.min(Math.max(l-n,16),Math.max(16,r-16))}px`)}getSide(){return this.lastSide}destroy(){this.el.remove()}}class Qt{constructor(){u(this,"el");u(this,"beaconEl");u(this,"tooltipEl",null);u(this,"textEl",null);u(this,"dismissBtn",null);u(this,"lastRect",null);u(this,"hasTooltip",!1);u(this,"onDismiss",null);this.el=document.createElement("div"),this.el.className="ot-hotspot",this.beaconEl=document.createElement("button"),this.beaconEl.type="button",this.beaconEl.className="ot-beacon",this.beaconEl.addEventListener("click",()=>this.onDismiss?.()),this.el.appendChild(this.beaconEl)}render(t,e){this.lastRect=e,this.onDismiss=t.onDismiss??null,this.beaconEl.className=`ot-beacon ot-beacon--${t.display}`,this.el.style.left=`${e.x+e.width/2}px`,this.el.style.top=`${e.y+e.height/2}px`,this.el.style.pointerEvents="auto";const s=t.content?.trim()||"Show me";this.beaconEl.setAttribute("aria-label",s),t.display==="beacon"?(this.hasTooltip=!1,this.tooltipEl&&(this.tooltipEl.style.display="none"),this.beaconEl.title=t.content??""):(this.hasTooltip=!0,this.buildTooltip(t),this.positionTooltip(e))}buildTooltip(t){this.tooltipEl||(this.tooltipEl=document.createElement("div"),this.tooltipEl.className="ot-hotspot-tooltip",this.tooltipEl.setAttribute("role","status"),this.textEl=document.createElement("span"),this.textEl.className="ot-hotspot-text",this.tooltipEl.appendChild(this.textEl),this.el.appendChild(this.tooltipEl)),this.tooltipEl.style.display="flex",this.textEl&&(this.textEl.innerHTML=W(t.content??"")),t.showDismiss||t.display==="hotspot"?(this.dismissBtn||(this.dismissBtn=document.createElement("button"),this.dismissBtn.type="button",this.dismissBtn.className="ot-hotspot-dismiss",this.dismissBtn.textContent="→",this.dismissBtn.setAttribute("aria-label","Next step"),this.dismissBtn.addEventListener("click",()=>this.onDismiss?.())),this.tooltipEl.appendChild(this.dismissBtn)):this.dismissBtn?.parentNode&&this.dismissBtn.remove()}positionTooltip(t){if(!this.tooltipEl)return;const e=window.innerWidth,s=this.tooltipEl.offsetWidth||200,n=t.x+t.width/2,o=e-(n+16),r=n-16;o>s?(this.tooltipEl.style.left="12px",this.tooltipEl.style.right="auto"):r>s?(this.tooltipEl.style.right="12px",this.tooltipEl.style.left="auto"):(this.tooltipEl.style.left=`${Math.max(8,-(n-8))}px`,this.tooltipEl.style.right="auto"),this.tooltipEl.style.top="16px"}reposition(t){this.lastRect&&(this.lastRect=t,this.el.style.left=`${t.x+t.width/2}px`,this.el.style.top=`${t.y+t.height/2}px`,this.hasTooltip&&this.positionTooltip(t))}focus(){this.beaconEl.focus({preventScroll:!0})}destroy(){this.onDismiss=null,this.el.remove()}}const Zt='button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';function te(i){if(!i)return!1;if(i.isContentEditable)return!0;const t=i.tagName;if(t==="TEXTAREA"||t==="SELECT")return!0;if(t!=="INPUT")return!1;const e=i.type;return!["button","submit","reset","checkbox","radio","file"].includes(e)}function ee(i,t={}){const e=document.activeElement,s=t.trap!==!1,n=()=>Array.from(i.querySelectorAll(Zt)).filter(r=>r.getClientRects().length>0||r===document.activeElement),o=r=>{const c=i.getRootNode().activeElement??document.activeElement;if(r.key==="Escape"){t.onEscape?.(),r.stopPropagation();return}if(te(c))return;if(r.key==="ArrowRight"){t.onArrowNext?.(),r.preventDefault();return}if(r.key==="ArrowLeft"){t.onArrowPrev?.(),r.preventDefault();return}if(r.key==="Enter"&&c===i){t.onArrowNext?.(),r.preventDefault();return}if(r.key!=="Tab"||!s)return;const a=n();if(!a.length){r.preventDefault();return}const l=a[0],d=a[a.length-1];r.shiftKey&&(c===l||!i.contains(c))?(d.focus(),r.preventDefault()):!r.shiftKey&&c===d&&(l.focus(),r.preventDefault())};return i.addEventListener("keydown",o),t.autoFocus!==!1&&i.focus({preventScroll:!0}),()=>{i.removeEventListener("keydown",o);const r=document.activeElement;(!r||r===document.body||i.contains(r))&&e?.focus?.({preventScroll:!0})}}const ie="button, a, [role], label, summary, h1, h2, h3, h4, h5, h6, p, li, td, th, span, div";function se(i,t=document){try{return t.querySelector(i)}catch{return null}}function q(i,t=document){try{return Array.from(t.querySelectorAll(i))}catch{return[]}}function ne(i,t=document){const e=q(i,t),s=new Set,n=o=>{for(const r of q("*",o)){const c=r.shadowRoot;!c||s.has(c)||(s.add(c),e.push(...q(i,c)),n(c))}};return n(t),[...new Set(e)]}function K(i){const t=i.getBoundingClientRect();if(t.width===0&&t.height===0)return!1;const e=i.ownerDocument?.defaultView;if(!e)return!0;const s=e.getComputedStyle(i);return s.visibility!=="hidden"&&s.display!=="none"&&s.opacity!=="0"}function G(i){return i.replace(/\s+/g," ").trim().toLowerCase()}function dt(i,t,e){const s=G(i);if(!s)return null;const o=(t??q(ie,e)).filter(a=>G(a.textContent??"").includes(s));if(o.length===0)return null;const r=o.filter(a=>G(a.textContent??"")===s);return(r.length?r:o).reduce((a,l)=>a.contains(l)?l:a)}function ht(i){if(!i.iframe)return{doc:document,offset:{x:0,y:0}};const t=se(i.iframe);if(!t)return null;try{const e=t.contentDocument;if(!e)return null;const s=t.getBoundingClientRect();return{doc:e,offset:{x:s.x,y:s.y}}}catch{return null}}function L(i){const t=ht(i);if(!t)return null;const{doc:e,offset:s}=t,n=i.selector?Array.isArray(i.selector)?i.selector:[i.selector]:[],o=r=>{const c=i.visible?r.filter(K):r;return c.length===0?null:c[i.index??0]??null};for(const r of n){const c=i.shadow?ne(r,e):q(r,e);if(i.text){const l=dt(i.text,i.visible?c.filter(K):c,e);if(l)return{element:l,doc:e,frameOffset:s,matched:r};continue}const a=o(c);if(a)return{element:a,doc:e,frameOffset:s,matched:r}}if(n.length===0&&i.text){const r=dt(i.text,null,e);if(r&&(!i.visible||K(r)))return{element:r,doc:e,frameOffset:s,matched:`text:${i.text}`}}return null}function ut(i){const t=[];return i.selector&&t.push(Array.isArray(i.selector)?i.selector.join(" | "):i.selector),i.text&&t.push(`text "${i.text}"`),i.iframe&&t.push(`in iframe ${i.iframe}`),t.join(" + ")||"(no selector)"}function _(i,t=5e3){return new Promise(e=>{const s=L(i);if(s){e(s);return}let n=!1,o=null;const r=d=>{n||(n=!0,o?.disconnect(),clearInterval(a),clearTimeout(l),e(d))},c=()=>{const d=L(i);d&&r(d)};try{o=new MutationObserver(c);const d=i.iframe?ht(i)?.doc.documentElement??document.documentElement:document.documentElement;o.observe(d,{childList:!0,subtree:!0,attributes:!0})}catch{}const a=setInterval(c,100),l=setTimeout(()=>r(null),t)})}const J="opentutorial:locationchange";let pt=!1;function oe(){if(pt||typeof history>"u")return;pt=!0;const i=()=>{try{window.dispatchEvent(new Event(J))}catch{}};for(const t of["pushState","replaceState"]){const e=history[t];typeof e=="function"&&(history[t]=function(...n){const o=e.apply(this,n);return i(),o})}}function ft(){return typeof location>"u"?"":location.pathname+location.search+location.hash}function mt(i,t,e=!1){if(!i)return!1;const s=t.split("#")[0];if(i.endsWith("*"))return s.startsWith(i.slice(0,-1));if(i.includes(":")){const o=i.split("/").map(r=>r.startsWith(":")?"[^/]+":r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("/");try{return new RegExp(`^${o}${e?"$":"(/|$|\\?)"}`).test(s)}catch{return!1}}const n=s.split("?")[0];return e?n===i:n.startsWith(i)}function gt(i){return typeof window>"u"?()=>{}:(oe(),window.addEventListener("popstate",i),window.addEventListener("hashchange",i),window.addEventListener(J,i),()=>{window.removeEventListener("popstate",i),window.removeEventListener("hashchange",i),window.removeEventListener(J,i)})}class Y{constructor(){u(this,"map",new Map)}getItem(t){return this.map.get(t)??null}setItem(t,e){this.map.set(t,e)}removeItem(t){this.map.delete(t)}}function vt(){try{if(typeof localStorage<"u"){const i="__ot_probe__";return localStorage.setItem(i,"1"),localStorage.removeItem(i),localStorage}}catch{}return new Y}function X(){return{v:2,tours:{},progress:{}}}class bt{constructor(t,e="ot",s){u(this,"ready");u(this,"storage");u(this,"prefix");u(this,"userId");u(this,"root",X());u(this,"hydrated",!1);this.storage=t??vt(),this.prefix=e,this.userId=s,this.ready=this.hydrate()}key(){return this.userId?`${this.prefix}:u:${this.userId}`:`${this.prefix}:anon`}legacyKey(){return`${this.prefix}:tours`}setUser(t){return t===this.userId?this.ready:(this.userId=t,this.root=X(),this.hydrated=!1,this.hydrate())}getUser(){return this.userId}parse(t){if(typeof t!="string"||!t)return null;try{const e=JSON.parse(t);if(!e||typeof e!="object")return null;if(e.v===2)return{v:2,tours:e.tours??{},progress:e.progress??{},active:e.active};if(e.v===1)return{v:2,tours:e.tours??{},progress:{}}}catch{}return null}async hydrate(){try{const t=await Promise.resolve(this.storage.getItem(this.key())),e=this.parse(t);if(e){this.root=e,this.hydrated=!0;return}if(!this.userId){const s=this.parse(await Promise.resolve(this.storage.getItem(this.legacyKey())));if(s){this.root=s,this.hydrated=!0,this.save();try{this.storage.removeItem(this.legacyKey())}catch{}return}}}catch{}this.hydrated=!0}isHydrated(){return this.hydrated}save(){try{this.storage.setItem(this.key(),JSON.stringify(this.root))}catch{}}mark(t,e,s){const n=this.root.tours[t];this.root.tours[t]={status:e,version:s,at:Date.now(),shownCount:n?.shownCount??0,lastShownAt:n?.lastShownAt},delete this.root.progress[t],this.root.active?.tourId===t&&delete this.root.active,this.save()}markShown(t,e){const s=this.root.tours[t];this.root.tours[t]={status:s?.status??"skipped",version:s?.version??e,at:s?.at??0,shownCount:(s?.shownCount??0)+1,lastShownAt:Date.now()},this.save()}hasSeen(t,e){const s=this.root.tours[t];return!(!s||!s.at||e&&s.version!==e)}getStatus(t){const e=this.root.tours[t];return!e||!e.at?null:e.status}getRecord(t){return this.root.tours[t]??null}reset(t){if(!t){this.root=X(),this.save();return}delete this.root.tours[t],delete this.root.progress[t],this.save()}clearAllProgress(){this.root.progress={},this.save()}saveProgress(t,e,s){this.root.progress[t]={tourId:t,lastStepId:e,stepIndex:s,timestamp:Date.now()},this.save()}getProgress(t){return this.root.progress[t]??null}getProgressIfValid(t,e){const s=this.getProgress(t);return s?Date.now()-s.timestamp>e?(this.clearProgress(t),null):s:null}clearProgress(t){t in this.root.progress&&(delete this.root.progress[t],this.save())}setActive(t,e){this.root.active={tourId:t,stepId:e,at:Date.now()},this.save()}getActive(t=300*1e3){const e=this.root.active;return e?Date.now()-e.at>t?(this.clearActive(),null):e:null}clearActive(){this.root.active&&(delete this.root.active,this.save())}exportAll(){return JSON.parse(JSON.stringify(this.root))}importAll(t,e="replace"){const s=this.parse(typeof t=="string"?t:JSON.stringify(t));if(!s)return!1;if(e==="replace")this.root=s;else{for(const[n,o]of Object.entries(s.tours)){const r=this.root.tours[n];(!r||o.at>r.at)&&(this.root.tours[n]=o)}for(const[n,o]of Object.entries(s.progress)){const r=this.root.progress[n];(!r||o.timestamp>r.timestamp)&&(this.root.progress[n]=o)}}return this.save(),!0}}const re=500,ae=new Set(["__proto__","constructor","prototype"]),ce={includes:(i,t)=>typeof i=="string"?i.includes(String(t[0])):Array.isArray(i)?i.includes(t[0]):!1,startsWith:(i,t)=>typeof i=="string"?i.startsWith(String(t[0])):!1,endsWith:(i,t)=>typeof i=="string"?i.endsWith(String(t[0])):!1,toLowerCase:i=>typeof i=="string"?i.toLowerCase():i,toUpperCase:i=>typeof i=="string"?i.toUpperCase():i,trim:i=>typeof i=="string"?i.trim():i,indexOf:(i,t)=>typeof i=="string"?i.indexOf(String(t[0])):Array.isArray(i)?i.indexOf(t[0]):-1,matches:(i,t)=>{if(typeof i!="string")return!1;try{return new RegExp(String(t[0])).test(i)}catch{return!1}}},le=["===","!==","==","!=","<=",">=","&&","||","<",">","!","(",")","[","]",",","+","-","*","/","%","?",":"];function yt(i){const t=[];let e=0;for(;e<i.length;){const s=i.slice(e);if(/^\s/.test(s)){e+=1;continue}const n=le.find(r=>s.startsWith(r));if(n){t.push({t:"op",v:n}),e+=n.length;continue}if(s[0]==="."){t.push({t:"dot"}),e+=1;continue}let o=s.match(/^'((?:[^'\\]|\\.)*)'/)??s.match(/^"((?:[^"\\]|\\.)*)"/);if(o){t.push({t:"str",v:o[1].replace(/\\(.)/g,"$1")}),e+=o[0].length;continue}if(o=s.match(/^\d+(\.\d+)?/),o){t.push({t:"num",v:Number(o[0])}),e+=o[0].length;continue}if(o=s.match(/^(true|false)\b/),o){t.push({t:"bool",v:o[1]==="true"}),e+=o[0].length;continue}if(o=s.match(/^null\b/),o){t.push({t:"null"}),e+=o[0].length;continue}if(o=s.match(/^undefined\b/),o){t.push({t:"undef"}),e+=o[0].length;continue}if(o=s.match(/^[A-Za-z_$][\w$]*/),o){t.push({t:"ident",v:o[0]}),e+=o[0].length;continue}throw new Error(`Unexpected character "${s[0]}" at ${e}`)}return t}function Q(i,t){if(i!=null&&!(typeof t=="string"&&ae.has(t))){if(typeof i=="string")return t==="length"?i.length:typeof t=="number"?i[t]:void 0;if(Array.isArray(i))return t==="length"?i.length:i[t];if(typeof i=="object")return i[String(t)]}}function xt(i,t){return i===t?!0:i==null?t==null:typeof i=="number"||typeof t=="number"?Number(i)===Number(t):String(i)===String(t)}function $(i){return typeof i=="number"?i:Number(i)}class wt{constructor(t,e){u(this,"pos",0);u(this,"tokens");u(this,"ctx");this.tokens=t,this.ctx=e}parse(){const t=this.ternary();if(this.pos!==this.tokens.length)throw new Error("Trailing tokens");return t}peek(){return this.tokens[this.pos]}isOp(t){const e=this.peek();return!!e&&e.t==="op"&&e.v===t}eatOp(t){return this.isOp(t)?(this.pos+=1,!0):!1}expectOp(t){if(!this.eatOp(t))throw new Error(`Expected "${t}"`)}ternary(){const t=this.orExpr();if(!this.eatOp("?"))return t;const e=this.ternary();this.expectOp(":");const s=this.ternary();return t?e:s}orExpr(){let t=this.andExpr();for(;this.eatOp("||");){const e=this.andExpr();t=t||e}return t}andExpr(){let t=this.equality();for(;this.eatOp("&&");){const e=this.equality();t=t&&e}return t}equality(){let t=this.relational();for(;;){if(this.eatOp("===")){t=t===this.relational();continue}if(this.eatOp("!==")){t=t!==this.relational();continue}if(this.eatOp("==")){t=xt(t,this.relational());continue}if(this.eatOp("!=")){t=!xt(t,this.relational());continue}return t}}relational(){let t=this.additive();for(;;){if(this.eatOp("<=")){t=$(t)<=$(this.additive());continue}if(this.eatOp(">=")){t=$(t)>=$(this.additive());continue}if(this.eatOp("<")){t=$(t)<$(this.additive());continue}if(this.eatOp(">")){t=$(t)>$(this.additive());continue}return t}}additive(){let t=this.multiplicative();for(;;){if(this.eatOp("+")){const e=this.multiplicative();t=typeof t=="string"||typeof e=="string"?String(t)+String(e):$(t)+$(e);continue}if(this.eatOp("-")){t=$(t)-$(this.multiplicative());continue}return t}}multiplicative(){let t=this.unary();for(;;){if(this.eatOp("*")){t=$(t)*$(this.unary());continue}if(this.eatOp("/")){t=$(t)/$(this.unary());continue}if(this.eatOp("%")){t=$(t)%$(this.unary());continue}return t}}unary(){return this.eatOp("!")?!this.unary():this.eatOp("-")?-$(this.unary()):this.postfix()}postfix(){let t=this.primary();for(;;){if(this.peek()?.t==="dot"){this.pos+=1;const e=this.peek();if(!e||e.t!=="ident")throw new Error('Expected identifier after "."');if(this.pos+=1,this.isOp("(")){this.pos+=1;const s=[];if(!this.isOp(")"))do s.push(this.ternary());while(this.eatOp(","));this.expectOp(")");const n=ce[e.v];if(!n)throw new Error(`Method "${e.v}" is not allowed`);t=n(t,s);continue}t=Q(t,e.v);continue}if(this.eatOp("[")){const e=this.ternary();this.expectOp("]"),t=Q(t,typeof e=="number"?e:String(e));continue}return t}}primary(){const t=this.peek();if(!t)throw new Error("Unexpected end of expression");if(t.t==="op"&&t.v==="("){this.pos+=1;const e=this.ternary();return this.expectOp(")"),e}if(t.t==="op"&&t.v==="["){this.pos+=1;const e=[];if(!this.isOp("]"))do e.push(this.ternary());while(this.eatOp(","));return this.expectOp("]"),e}switch(this.pos+=1,t.t){case"str":return t.v;case"num":return t.v;case"bool":return t.v;case"null":return null;case"undef":return;case"ident":return Q(this.ctx,t.v);default:throw new Error("Unexpected token")}}}function Z(i,t,e={}){try{if(typeof i!="string")return;if(i.length>(e.maxLength??re)){e.onError?.("expression exceeds the maximum length",i);return}return new wt(yt(i),t).parse()}catch(s){e.onError?.(s instanceof Error?s.message:"invalid expression",i);return}}function P(i,t,e={}){return!!Z(i,t,e)}function de(i){try{return new wt(yt(i),{}).parse(),{ok:!0}}catch(t){return{ok:!1,message:t instanceof Error?t.message:"invalid expression"}}}const kt=new Set(["auto","center","top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"]),Et=new Set(["spotlight","hotspot","beacon","modal","banner"]),St=new Set(["button","target-click","event","auto","input-match","form-submit","element-appears","element-disappears","url-match"]),$t=new Set(["manual","auto","event","route","element","idle","scroll"]),he=new Set(["emit","click","focus","navigate","setContext","scrollTo","wait"]),ue=new Set(["text","image","video","list","code","divider","html"]),At=new Set(["free","target-only","blocked"]),pe=new Set(["specVersion","id","title","description","version","priority","trigger","audience","frequency","onComplete","theme","interaction","steps"]),fe=new Set(["id","target","placement","display","title","content","buttons","advanceOn","event","duration","match","watch","urlPattern","interaction","skippable","canGoBack","next","showIf","theme","onEnter","onExit"]),me=new Set(["selector","text","index","shadow","iframe","waitFor","timeout","visible","scrollIntoView","scrollBehavior","padding"]),ge=new Set(["accent","bg","fg","muted","border","success","danger","backdrop","radius","shadow","font","fontSize","spacing","arrowSize","overlayBlur","animationMs","z","spotlightRing","popoverWidth"]),ve=/^[a-z0-9]+(-[a-z0-9]+)*$/,I={title:60,stepTitle:80,description:200,content:320,steps:24},Ct={steps:200};function E(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)}class be{constructor(){u(this,"errors",[]);u(this,"warnings",[])}error(t,e){this.errors.push({path:t,message:e,severity:"error"})}warn(t,e){this.warnings.push({path:t,message:e,severity:"warning"})}}function It(i,t,e){if(i!==void 0){if(!E(i)){e.error(t,"theme must be an object");return}for(const s of Object.keys(i))ge.has(s)||e.warn(`${t}.${s}`,`unknown theme token "${s}" (ignored)`)}}function tt(i,t,e){if(i===void 0)return;if(typeof i!="string"){e.error(t,"must be a string expression");return}if(i.length>500){e.error(t,`expression must be ≤ 500 chars (got ${i.length})`);return}const s=de(i);s.ok||e.error(t,`invalid expression: ${s.message}`)}function Tt(i,t,e){if(i!==void 0){if(!Array.isArray(i)){e.error(t,"must be an array of actions");return}i.forEach((s,n)=>{const o=`${t}[${n}]`;if(!E(s)){e.error(o,"action must be an object");return}if(!he.has(s.type)){e.error(`${o}.type`,`unknown action type "${String(s.type)}"`);return}s.type==="emit"&&typeof s.name!="string"&&e.error(`${o}.name`,'emit action requires a string "name"'),s.type==="navigate"&&(typeof s.path!="string"||!s.path.startsWith("/"))&&e.error(`${o}.path`,'navigate requires a same-origin "path" starting with /'),s.type==="setContext"&&typeof s.key!="string"&&e.error(`${o}.key`,'setContext requires a string "key"'),s.type==="scrollTo"&&typeof s.selector!="string"&&e.error(`${o}.selector`,'scrollTo requires a string "selector"'),s.type==="wait"&&typeof s.ms!="number"&&e.error(`${o}.ms`,'wait requires a numeric "ms"')})}}function H(i,t,e){if(typeof i=="string")return i.length;if(E(i)&&typeof i.key=="string")return i.key.length;if(E(i)&&Array.isArray(i.blocks)){if(i.blocks.length===0){e.error(t,"blocks must not be empty");return}let s=0;return i.blocks.forEach((n,o)=>{const r=`${t}.blocks[${o}]`;if(!E(n)){e.error(r,"block must be an object");return}if(!ue.has(n.type)){e.error(`${r}.type`,`unknown block type "${String(n.type)}"`);return}switch(n.type){case"text":typeof n.value=="string"?s+=n.value.length:(!E(n.value)||typeof n.value.key!="string")&&e.error(`${r}.value`,"text block requires a string or i18n object");break;case"image":typeof n.src!="string"&&e.error(`${r}.src`,'image block requires "src"'),typeof n.alt!="string"&&e.error(`${r}.alt`,'image block requires "alt" for accessibility');break;case"video":typeof n.src!="string"&&e.error(`${r}.src`,'video block requires "src"');break;case"list":(!Array.isArray(n.items)||n.items.length===0)&&e.error(`${r}.items`,'list block requires a non-empty "items" array');break;case"code":typeof n.value!="string"&&e.error(`${r}.value`,'code block requires a string "value"');break;case"html":typeof n.value!="string"?e.error(`${r}.value`,'html block requires a string "value"'):e.warn(r,"html blocks render only when the host sets allowHtml: true");break}}),s}}function ye(i,t){if(i===void 0)return;if(!E(i)){t.error("$.trigger","must be an object");return}const e=i.type;if(!$t.has(e)){t.error("$.trigger.type",`must be one of: ${[...$t].join(" | ")}`);return}if(i.delay!==void 0&&(typeof i.delay!="number"||i.delay<0)&&t.error("$.trigger.delay","must be a non-negative number (ms)"),e==="event"&&typeof i.event!="string"&&t.error("$.trigger.event",'required when trigger.type === "event"'),e==="route"&&typeof i.path!="string"&&t.error("$.trigger.path",'required when trigger.type === "route"'),e==="element"&&typeof i.selector!="string"&&t.error("$.trigger.selector",'required when trigger.type === "element"'),e==="idle"&&(typeof i.ms!="number"||i.ms<=0)&&t.error("$.trigger.ms",'required positive number (ms) when trigger.type === "idle"'),e==="scroll"){const s=i.percent;(typeof s!="number"||s<0||s>100)&&t.error("$.trigger.percent","must be a number between 0 and 100")}}function xe(i,t,e){if(i===void 0)return;if(!E(i)){e.error(`${t}.target`,"must be an object");return}for(const r of Object.keys(i))me.has(r)||e.warn(`${t}.target.${r}`,`unknown target key "${r}" (ignored)`);const{selector:s,text:n}=i,o=typeof s=="string"&&s.trim().length>0||Array.isArray(s)&&s.length>0&&s.every(r=>typeof r=="string"&&r.trim());s!==void 0&&!o&&e.error(`${t}.target.selector`,"must be a non-empty CSS selector or array of selectors"),!o&&typeof n!="string"&&e.error(`${t}.target`,'requires "selector", "text", or both'),i.timeout!==void 0&&(typeof i.timeout!="number"||i.timeout<0)&&e.error(`${t}.target.timeout`,"must be a non-negative number (ms)"),i.padding!==void 0&&(typeof i.padding!="number"||i.padding<0)&&e.error(`${t}.target.padding`,"must be a non-negative number (px)"),i.index!==void 0&&(typeof i.index!="number"||i.index<0)&&e.error(`${t}.target.index`,"must be a non-negative integer"),i.iframe!==void 0&&typeof i.iframe!="string"&&e.error(`${t}.target.iframe`,"must be a CSS selector string"),i.scrollBehavior!==void 0&&!["auto","smooth"].includes(i.scrollBehavior)&&e.error(`${t}.target.scrollBehavior`,'must be "auto" or "smooth"')}function F(i){const t=new be;if(!E(i))return{ok:!1,errors:[{path:"$",message:"spec must be a JSON object",severity:"error"}],warnings:[]};for(const n of Object.keys(i))pe.has(n)||t.warn(`$.${n}`,`unknown top-level key "${n}" (ignored)`);i.specVersion!==1&&t.error("$.specVersion","must be the integer 1"),typeof i.id!="string"||!i.id?t.error("$.id","required, non-empty string"):ve.test(i.id)||t.error("$.id",'must be kebab-case (e.g. "dashboard-intro")');const e=H(i.title,"$.title",t);if(e===void 0?t.error("$.title","required (string or i18n object with key)"):e===0?t.error("$.title","must not be empty"):e>I.title&&t.warn("$.title",`longer than ${I.title} chars (got ${e})`),i.description!==void 0){const n=H(i.description,"$.description",t);n===void 0?t.error("$.description","must be a string or i18n object"):n>I.description&&t.warn("$.description",`longer than ${I.description} chars (got ${n})`)}if(i.version!==void 0&&typeof i.version!="string"&&t.error("$.version",'must be a string (e.g. "1.0.0")'),i.priority!==void 0&&typeof i.priority!="number"&&t.error("$.priority","must be a number"),i.interaction!==void 0&&!At.has(i.interaction)&&t.error("$.interaction",'must be "free" | "target-only" | "blocked"'),ye(i.trigger,t),i.audience!==void 0&&(E(i.audience)?tt(i.audience.showIf,"$.audience.showIf",t):t.error("$.audience","must be an object")),i.frequency!==void 0)if(!E(i.frequency))t.error("$.frequency","must be an object");else for(const n of["max","cooldown","perSession"]){const o=i.frequency[n];o!==void 0&&(typeof o!="number"||o<0)&&t.error(`$.frequency.${n}`,"must be a non-negative number")}if(i.onComplete!==void 0)if(!E(i.onComplete))t.error("$.onComplete","must be an object");else{const{startTour:n,emit:o,navigate:r}=i.onComplete;n!==void 0&&typeof n!="string"&&t.error("$.onComplete.startTour","must be a tour id string"),o!==void 0&&typeof o!="string"&&t.error("$.onComplete.emit","must be an event name string"),r!==void 0&&(typeof r!="string"||!r.startsWith("/"))&&t.error("$.onComplete.navigate","must be a same-origin path starting with /")}if(It(i.theme,"$.theme",t),!Array.isArray(i.steps))return t.error("$.steps","required, must be an array"),{ok:!1,errors:t.errors,warnings:t.warnings};i.steps.length<1&&t.error("$.steps","must contain at least 1 step"),i.steps.length>Ct.steps?t.error("$.steps",`must contain ≤ ${Ct.steps} steps (got ${i.steps.length})`):i.steps.length>I.steps&&t.warn("$.steps",`${i.steps.length} steps is a lot; consider splitting into several tours`);const s=new Set;return i.steps.forEach((n,o)=>{const r=`$.steps[${o}]`;if(!E(n)){t.error(r,"step must be an object");return}for(const p of Object.keys(n))fe.has(p)||t.warn(`${r}.${p}`,`unknown step key "${p}" (ignored)`);typeof n.id!="string"||!n.id?t.error(`${r}.id`,"required"):s.has(n.id)?t.error(`${r}.id`,`duplicate step id "${n.id}"`):s.add(n.id);const c=n.display;c!==void 0&&!Et.has(c)&&t.error(`${r}.display`,`must be one of: ${[...Et].join(" | ")}`),xe(n.target,r,t),n.placement!==void 0&&!kt.has(n.placement)&&t.error(`${r}.placement`,`must be one of: ${[...kt].join(" | ")}`),n.interaction!==void 0&&!At.has(n.interaction)&&t.error(`${r}.interaction`,'must be "free" | "target-only" | "blocked"');const a=H(n.title,`${r}.title`,t);a===void 0?t.error(`${r}.title`,"required (string or i18n object with key)"):a===0?t.error(`${r}.title`,"must not be empty"):a>I.stepTitle&&t.warn(`${r}.title`,`longer than ${I.stepTitle} chars (got ${a})`);const l=H(n.content,`${r}.content`,t);if(l===void 0?t.error(`${r}.content`,"required (string, i18n object, or { blocks: [...] })"):l>I.content&&t.warn(`${r}.content`,`longer than ${I.content} chars (got ${l}); long copy hurts completion`),n.buttons!==void 0)if(!E(n.buttons))t.error(`${r}.buttons`,"must be an object");else for(const p of Object.keys(n.buttons))["next","back","skip","done"].includes(p)||t.warn(`${r}.buttons.${p}`,`unknown button "${p}" (ignored)`);const d=n.advanceOn??"button";St.has(d)||t.error(`${r}.advanceOn`,`must be one of: ${[...St].join(" | ")}`),d==="event"&&typeof n.event!="string"&&t.error(`${r}.event`,'required when advanceOn === "event"'),d==="auto"&&(typeof n.duration!="number"||n.duration<=0)&&t.error(`${r}.duration`,'required positive number (ms) when advanceOn === "auto"'),d==="target-click"&&n.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "target-click"'),d==="input-match"&&(n.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "input-match"'),typeof n.match!="string"&&t.error(`${r}.match`,'required when advanceOn === "input-match"')),d==="form-submit"&&n.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "form-submit"'),(d==="element-appears"||d==="element-disappears")&&typeof n.watch!="string"&&t.error(`${r}.watch`,`required when advanceOn === "${d}"`),d==="url-match"&&typeof n.urlPattern!="string"&&t.error(`${r}.urlPattern`,'required when advanceOn === "url-match"'),c==="beacon"&&n.duration!==void 0&&typeof n.duration!="number"&&t.error(`${r}.duration`,"must be a number (ms)"),n.next!==void 0&&(typeof n.next=="string"||(Array.isArray(n.next)?(n.next.length===0&&t.warn(`${r}.next`,"empty branch list falls through to the next step"),n.next.forEach((p,f)=>{const k=`${r}.next[${f}]`;if(!E(p)){t.error(k,"branch must be an object { if, to }");return}tt(p.if,`${k}.if`,t),typeof p.to!="string"&&t.error(`${k}.to`,"must be a step id string")})):t.error(`${r}.next`,"must be a step id string or an array of { if, to } branches"))),tt(n.showIf,`${r}.showIf`,t),It(n.theme,`${r}.theme`,t),Tt(n.onEnter,`${r}.onEnter`,t),Tt(n.onExit,`${r}.onExit`,t)}),i.steps.forEach((n,o)=>{if(!E(n))return;const r=`$.steps[${o}].next`;typeof n.next=="string"&&!s.has(n.next)?t.error(r,`points to unknown step id "${n.next}"`):Array.isArray(n.next)&&n.next.forEach((c,a)=>{E(c)&&typeof c.to=="string"&&!s.has(c.to)&&t.error(`${r}[${a}].to`,`points to unknown step id "${c.to}"`)})}),t.errors.length?{ok:!1,errors:t.errors,warnings:t.warnings}:{ok:!0,errors:[],warnings:t.warnings}}function we(i){const t=F(i);if(!t.ok){const e=t.errors.map(s=>`  • ${s.path}: ${s.message}`).join(`
`);throw new Error(`[opentutorial] Invalid TutorialSpec:
${e}`)}return i}function ke(i){const t=[],e=new Set;return i.forEach((s,n)=>{const o=E(s)&&typeof s.id=="string"?s.id:void 0,r=F(s);for(const c of[...r.errors,...r.warnings])t.push({...c,path:`[${n}]${c.path.slice(1)}`,specId:o});o&&(e.has(o)&&t.push({path:`[${n}].id`,message:`duplicate tour id "${o}"`,severity:"error",specId:o}),e.add(o))}),i.forEach((s,n)=>{if(!E(s)||!E(s.onComplete))return;const o=s.onComplete.startTour;typeof o=="string"&&!e.has(o)&&t.push({path:`[${n}].onComplete.startTour`,message:`chains to unknown tour "${o}"`,severity:"warning",specId:typeof s.id=="string"?s.id:void 0})}),{ok:!t.some(s=>s.severity==="error"),issues:t}}const Ee=/\{\{\s*([\w.$]+)\s*\}\}/g;function Se(i,t){return t.split(".").reduce((e,s)=>e&&typeof e=="object"?e[s]:void 0,i)}function et(i,t){return!t||!i.includes("{{")?i:i.replace(Ee,(e,s)=>{const n=Se(t,s);return n==null?e:String(n)})}function $e(i,t,e,s){if(typeof i=="string")return et(i,s);if(i&&typeof i.key=="string"){const n=e?.(i.key,t);return et(n!==void 0?n:i.fallback??i.key,s)}return String(i)}const Ae={next:"Next",back:"Back",done:"Done",skip:"Skip tour"};function Ce(i,t,e){return e?.(`opentutorial.${i}`,t)??Ae[i]}const Ie={accent:"--ot-accent",bg:"--ot-bg",fg:"--ot-fg",muted:"--ot-muted",border:"--ot-border",success:"--ot-success",danger:"--ot-danger",backdrop:"--ot-backdrop",radius:"--ot-radius",shadow:"--ot-shadow",font:"--ot-font",fontSize:"--ot-font-size",spacing:"--ot-spacing",arrowSize:"--ot-arrow-size",overlayBlur:"--ot-overlay-blur",animationMs:"--ot-anim-ms",z:"--ot-z",spotlightRing:"--ot-spotlight-ring",popoverWidth:"--ot-popover-width"},Te=new Set(["radius","popoverWidth","fontSize","spacing","arrowSize","overlayBlur"]),Oe=new Set(["animationMs"]),Le=200;class it{constructor(t,e={}){u(this,"spec");u(this,"errors",[]);u(this,"warnings",[]);u(this,"opts");u(this,"persistence");u(this,"context");u(this,"layer",null);u(this,"popover",null);u(this,"hotspot",null);u(this,"customHost",null);u(this,"releaseFocus",null);u(this,"cleanupAdvance",null);u(this,"cleanupTrack",null);u(this,"cleanupRender",null);u(this,"appliedVars",[]);u(this,"status","idle");u(this,"currentId",null);u(this,"history",[]);u(this,"resolved",null);u(this,"runToken",0);u(this,"transitions",0);u(this,"stepEnteredAt",0);u(this,"startedAt",0);u(this,"advancing",!1);this.spec=t,this.opts=e,this.context={...e.context??{}},this.persistence=new bt(e.persistence?.storage,e.persistence?.keyPrefix??"ot",e.userId);const s=F(t);if(this.warnings=s.warnings,!s.ok||e.strict&&s.warnings.length>0){this.errors=s.ok?s.warnings:s.errors;const n=this.errors.map(o=>`  • ${o.path}: ${o.message}`).join(`
`);e.dev!==!1&&console.error(`[opentutorial] Spec "${t?.id??"?"}" failed validation:
${n}`),this.emit("error",{message:`invalid spec: ${this.errors.length} violation(s)`})}else if(s.warnings.length>0&&e.dev){const n=s.warnings.map(o=>`  • ${o.path}: ${o.message}`).join(`
`);console.warn(`[opentutorial] Spec "${t.id}" has warnings:
${n}`)}}get ready(){return this.persistence.ready}getState(){const t=this.visibleSteps(),e=t.findIndex(n=>n.id===this.currentId),s=this.currentStep();return{status:this.status,currentStepId:this.currentId,index:Math.max(0,e),total:t.length,paused:this.status==="paused",canGoBack:s?.canGoBack!==!1&&this.history.length>0,canGoNext:this.status==="running"}}isValid(){return this.errors.length===0}hasSeen(){return this.persistence.hasSeen(this.spec.id,this.spec.version)}getPersistence(){return this.persistence}resetSeen(){this.persistence.reset(this.spec.id)}resetAll(){this.persistence.reset()}resetProgress(){this.persistence.clearProgress(this.spec.id)}setUser(t){return this.opts={...this.opts,userId:t},this.persistence.setUser(t)}getContext(){return this.context}setContext(t){if(Object.assign(this.context,t),this.status==="running"){const e=this.currentStep();e?.showIf&&!P(e.showIf,this.context)&&this.next()}}setGlobalTheme(t){this.opts={...this.opts,theme:t},this.layer&&this.applyThemeChain(this.currentStep()?.theme)}setLocale(t){this.opts={...this.opts,locale:t},this.status==="running"&&this.rerenderCurrent()}async start(t){if(this.status==="destroyed"||this.status==="running"||!this.isValid())return;await this.persistence.ready,this.status="running",this.history=[],this.transitions=0,this.startedAt=Date.now();const e=t?void 0:this.resolveResumeStep(),s=t??e??this.visibleSteps()[0]?.id;if(this.history=[],s){const n=this.visibleSteps(),o=n.findIndex(r=>r.id===s);o>0&&(this.history=n.slice(0,o).map(r=>r.id))}if(this.buildDom(),this.persistence.markShown(this.spec.id,this.spec.version),this.emit(e?"resumed":"started",{stepId:s}),!s){this.complete("empty");return}await this.goToInternal(s,!1)}resolveResumeStep(){if(this.opts.autoResume){const s=this.persistence.getActive();if(s?.tourId===this.spec.id&&this.visibleSteps().some(o=>o.id===s.stepId))return s.stepId}if(!this.opts.resume)return;const t=this.opts.progressTtl??1440*60*1e3,e=this.persistence.getProgressIfValid(this.spec.id,t);if(e?.lastStepId&&this.visibleSteps().some(s=>s.id===e.lastStepId))return e.lastStepId}async next(){if(this.status!=="running"||this.advancing)return;const t=this.currentStep();if(!t)return;if(this.opts.beforeNext){this.advancing=!0;try{const s=this.visibleSteps().findIndex(o=>o.id===t.id);if(!await this.opts.beforeNext({tourId:this.spec.id,step:t,index:Math.max(0,s)}))return}catch{return}finally{this.advancing=!1}if(this.status!=="running")return}this.emit("step-completed",{stepId:t.id,duration:this.stepDuration()});const e=this.resolveNextId(t);if(!e){this.complete("end");return}await this.goToInternal(e,!0)}resolveNextId(t){if(Array.isArray(t.next)){for(const n of t.next)if(n&&typeof n.if=="string"&&P(n.if,this.context))return n.to}else if(typeof t.next=="string")return t.next;const e=this.visibleSteps(),s=e.findIndex(n=>n.id===t.id);return s>=0?e[s+1]?.id:void 0}prev(){if(this.status!=="running")return;const t=this.currentStep();if(t&&t.canGoBack===!1)return;const e=this.history.pop();e&&(this.emit("back",{stepId:this.currentId??void 0}),this.goToInternal(e,!1))}goTo(t){this.status==="running"&&this.goToInternal(t,!0)}pause(){this.status==="running"&&(this.status="paused",this.emit("paused",{stepId:this.currentId??void 0}),this.teardownDom())}resume(){if(this.status!=="paused")return;const t=this.currentId;this.status="running",this.emit("unpaused",{stepId:t??void 0}),this.buildDom(),t?this.goToInternal(t,!1):this.start()}skip(t="user"){this.status!=="running"&&this.status!=="paused"||this.finish("skipped",t)}complete(t="user"){this.status!=="running"&&this.status!=="paused"||this.finish("completed",t)}destroy(){this.status="destroyed",this.teardownDom()}visibleSteps(){return this.spec.steps.filter(t=>!t.showIf||P(t.showIf,this.context))}currentStep(){return this.spec.steps.find(t=>t.id===this.currentId)??null}stepDuration(){return this.stepEnteredAt?Date.now()-this.stepEnteredAt:0}text(t){return $e(t,this.opts.locale??"en",this.opts.i18nResolver,this.context)}blocks(t){return Ut(t,e=>this.text(e))}interactionFor(t){return t.interaction??this.spec.interaction??this.opts.interaction??"free"}buildDom(){const t=this.opts.zIndex??9999;this.layer=new _t(t,{container:this.opts.container,isolate:this.opts.isolate,dir:this.opts.dir}),this.layer.attach(),this.opts.renderStep?(this.customHost=document.createElement("div"),this.customHost.className="ot-custom-host",this.layer.mountPopover(this.customHost)):(this.popover=new Xt({onNext:()=>{this.next()},onPrev:()=>this.prev(),onSkip:()=>this.skip("user")},this.opts.dir??"ltr"),this.layer.mountPopover(this.popover.el)),this.applyThemeChain(void 0)}teardownDom(){this.runToken+=1,this.releaseFocus?.(),this.cleanupAdvance?.(),this.cleanupTrack?.(),this.cleanupRender?.(),this.releaseFocus=null,this.cleanupAdvance=null,this.cleanupTrack=null,this.cleanupRender=null,this.popover?.destroy(),this.hotspot?.destroy(),this.customHost?.remove(),this.layer?.destroy(),this.popover=null,this.hotspot=null,this.customHost=null,this.layer=null,this.resolved=null}finish(t,e){const s=this.currentStep();s&&this.runActions(s.onExit);const n=this.startedAt?Date.now()-this.startedAt:0;this.status=t,this.persistence.mark(this.spec.id,t,this.spec.version),this.persistence.clearActive(),this.emit(t,{stepId:this.currentId??void 0,reason:e,duration:n}),this.teardownDom(),t==="completed"&&this.runOnComplete()}runOnComplete(){const t=this.spec.onComplete;if(t)try{t.emit&&window.dispatchEvent(new CustomEvent(t.emit,{detail:{tourId:this.spec.id}})),t.navigate&&this.navigate(t.navigate),t.startTour&&window.dispatchEvent(new CustomEvent("opentutorial:chain",{detail:{from:this.spec.id,to:t.startTour}}))}catch{}}async goToInternal(t,e){if(this.status!=="running")return;if(this.transitions+=1,this.transitions>Le){this.emit("error",{message:"transition limit reached (possible next-loop)"}),this.complete("loop-guard");return}const s=this.spec.steps.find(o=>o.id===t);if(!s){this.emit("error",{message:`unknown step "${t}"`});return}const n=this.currentStep();n&&(this.runActions(n.onExit),this.emit("step-hidden",{stepId:n.id,duration:this.stepDuration()})),e&&this.currentId&&this.currentId!==t&&this.history.push(this.currentId),await this.showStep(s)}async showStep(t){if(!this.layer)return;const e=++this.runToken,s=()=>this.runToken===e&&this.status==="running";this.currentId=t.id,this.cleanupAdvance?.(),this.cleanupAdvance=null,this.releaseFocus?.(),this.releaseFocus=null,this.applyThemeChain(t.theme);const n=t.display??"spotlight",o=this.visibleSteps(),r=Math.max(0,o.findIndex(l=>l.id===t.id));let c=null;if(t.target){if(c=L(t.target),!c&&t.target.waitFor&&(this.renderStep(t,r,o.length,"Looking for the interface element…"),c=await _(t.target,t.target.timeout??5e3),!s()))return;if(!c){const l=ut(t.target);this.emit("target-not-found",{stepId:t.id,selector:l,message:`target not found: ${l}`}),this.next();return}}if(!s())return;if(this.resolved=c,c&&t.target?.scrollIntoView!==!1){const l=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,d=t.target?.scrollBehavior??(l?"auto":"smooth");try{c.element.scrollIntoView({block:"center",inline:"center",behavior:d})}catch{}}if(this.hotspot?.destroy(),this.hotspot=null,this.layer.updateSpotlight(null),this.layer.setInteraction(this.interactionFor(t)),(n==="hotspot"||n==="beacon")&&c)this.showIndicator(t,n,c);else{this.renderStep(t,r,o.length),(n==="modal"||!c)&&this.layer.showBackdrop(),requestAnimationFrame(()=>requestAnimationFrame(()=>{s()&&this.reposition()}));const l=this.customHost??this.popover?.el;if(l){const d=n==="modal"||this.interactionFor(t)!=="free";this.releaseFocus=ee(l,{trap:d,onEscape:()=>{t.skippable!==!1&&this.skip("escape")},onArrowNext:()=>{this.next()},onArrowPrev:()=>this.prev()})}}this.wireAdvance(t,c?.element??null),this.startTracking(),this.stepEnteredAt=Date.now(),this.persistence.saveProgress(this.spec.id,t.id,r),this.opts.autoResume&&this.persistence.setActive(this.spec.id,t.id),this.runActions(t.onEnter),this.emit("step-shown",{stepId:t.id,index:r,total:o.length})}showIndicator(t,e,s){if(!this.layer)return;const n=this.viewportRect(s);if(this.popover&&(this.popover.el.style.display="none"),this.customHost&&(this.customHost.style.display="none"),this.hotspot=new Qt,this.hotspot.render({display:e,content:Vt(this.blocks(t.content)),showDismiss:e==="hotspot"||t.advanceOn==="button",onDismiss:()=>{this.next()}},n),this.layer.root.appendChild(this.hotspot.el),e==="beacon"){const o=window.setTimeout(()=>{this.next()},t.duration??5e3);this.cleanupAdvance=()=>window.clearTimeout(o)}}renderStep(t,e,s,n){const o=n?[{type:"text",value:n}]:this.blocks(t.content);if(this.opts.renderStep&&this.customHost){this.cleanupRender?.();const r={tourId:this.spec.id,step:t,index:e,total:s,title:this.text(t.title),blocks:o,canGoBack:t.canGoBack!==!1&&this.history.length>0,canSkip:t.skippable!==!1,isLast:!t.next&&e>=s-1,next:()=>{this.next()},prev:()=>this.prev(),skip:()=>this.skip("user"),goTo:a=>this.goTo(a)},c=this.opts.renderStep(r,this.customHost);this.cleanupRender=typeof c=="function"?c:null,this.customHost.style.display="";return}this.popover&&(this.popover.el.style.display="",this.popover.render(this.makeModel(t,e,s,o)))}rerenderCurrent(){const t=this.currentStep();if(!t)return;const e=this.visibleSteps(),s=Math.max(0,e.findIndex(n=>n.id===t.id));this.renderStep(t,s,e.length),this.reposition()}makeModel(t,e,s,n){const o=this.opts.locale??"en",r=this.opts.i18nResolver,c=(d,p)=>p===!1||p===void 0?Ce(d,o,r):this.text(p),a=t.buttons??{},l=t.advanceOn??"button";return{stepId:t.id,title:this.text(t.title),blocks:n,index:e,total:s,canGoBack:t.canGoBack!==!1&&this.history.length>0,skippable:t.skippable!==!1&&a.skip!==!1,isLast:!t.next&&e>=s-1,advanceOn:l,labels:{next:c("next",a.next),back:c("back",a.back),done:c("done",a.done),skip:c("skip",a.skip)},showNext:a.next!==!1&&(l==="button"||e>=s-1),showBack:a.back!==!1,modal:(t.display??"spotlight")==="modal"||this.interactionFor(t)==="blocked",allowHtml:this.opts.allowHtml}}viewportRect(t){const e=t.element.getBoundingClientRect();return{x:e.x+t.frameOffset.x,y:e.y+t.frameOffset.y,width:e.width,height:e.height}}reposition(){if(!this.layer||this.status!=="running")return;const t=this.currentStep();if(!t)return;const e=t.target?.padding??8,s=!!this.popover&&!this.opts.renderStep;if(this.resolved){if(!this.resolved.doc.contains(this.resolved.element)&&t.target){const o=L(t.target);o&&(this.resolved=o)}const n=this.viewportRect(this.resolved);this.hotspot?(this.hotspot.reposition(n),this.layer.setInteraction(this.interactionFor(t))):(this.layer.updateSpotlight(n,e,this.mergedRadius()),s&&this.popover?.position(n,t.placement??"auto",e))}else this.layer.showBackdrop(),s&&this.popover?.position(null,"center",0)}mergedRadius(){return({...this.opts.theme,...this.spec.theme,...this.currentStep()?.theme}.radius??14)+2}startTracking(){this.cleanupTrack?.();let t=0,e=!1;const s=()=>{e||(e=!0,t=requestAnimationFrame(()=>{e=!1,this.reposition()}))},n=new ResizeObserver(s);if(this.resolved)try{n.observe(this.resolved.element)}catch{}n.observe(document.documentElement),window.addEventListener("resize",s),window.addEventListener("scroll",s,!0);const o=performance.now()+900,r=()=>{this.status==="running"&&(this.reposition(),performance.now()<o&&requestAnimationFrame(r))};requestAnimationFrame(r),this.cleanupTrack=()=>{n.disconnect(),window.removeEventListener("resize",s),window.removeEventListener("scroll",s,!0),cancelAnimationFrame(t)}}wireAdvance(t,e){const s=t.advanceOn??"button",n=()=>{this.next()};switch(s){case"target-click":{if(!e)return;const o=()=>n();e.addEventListener("click",o,{once:!0}),this.cleanupAdvance=()=>e.removeEventListener("click",o);return}case"event":{if(typeof t.event!="string")return;const o=t.event,r=()=>n();window.addEventListener(o,r,{once:!0}),this.cleanupAdvance=()=>window.removeEventListener(o,r);return}case"auto":{const o=window.setTimeout(n,t.duration??3e3);this.cleanupAdvance=()=>window.clearTimeout(o);return}case"input-match":{if(!e||typeof t.match!="string")return;const o=t.match,r=a=>{if(o.startsWith("/")&&o.lastIndexOf("/")>0){const l=o.lastIndexOf("/");try{return new RegExp(o.slice(1,l),o.slice(l+1)).test(a)}catch{return!1}}return a===o},c=()=>{const a=e.value??"";r(a)&&n()};e.addEventListener("input",c),e.addEventListener("change",c),this.cleanupAdvance=()=>{e.removeEventListener("input",c),e.removeEventListener("change",c)};return}case"form-submit":{if(!e)return;const o=e.closest?.("form")??(e.tagName==="FORM"?e:null);if(!o)return;const r=()=>n();o.addEventListener("submit",r,{once:!0}),this.cleanupAdvance=()=>o.removeEventListener("submit",r);return}case"element-appears":{if(typeof t.watch!="string")return;let o=!1;_({selector:t.watch,visible:!0},t.duration??6e4).then(r=>{r&&!o&&n()}),this.cleanupAdvance=()=>{o=!0};return}case"element-disappears":{if(typeof t.watch!="string")return;const o=t.watch,r=window.setInterval(()=>{L({selector:o,visible:!0})||(window.clearInterval(r),n())},150);this.cleanupAdvance=()=>window.clearInterval(r);return}case"url-match":{if(typeof t.urlPattern!="string")return;const o=t.urlPattern,r=()=>{mt(o,ft())&&n()},c=gt(r);this.cleanupAdvance=c,r();return}}}navigate(t){if(t.startsWith("/")){if(this.opts.onNavigate){this.opts.onNavigate(t);return}window.location.assign(t)}}runActions(t){if(!t)return;const e=this.resolved?.element;for(const s of t)try{switch(s.type){case"emit":window.dispatchEvent(new CustomEvent(s.name,{detail:s.detail}));break;case"click":e?.click?.();break;case"focus":e?.focus?.();break;case"navigate":this.opts.autoResume&&this.currentId&&this.persistence.setActive(this.spec.id,this.currentId),this.navigate(s.path);break;case"setContext":this.context[s.key]=s.value;break;case"scrollTo":{L({selector:s.selector})?.element.scrollIntoView({block:"center",behavior:"smooth"});break}case"wait":break}}catch{}}applyThemeChain(t){if(!this.layer)return;const e=this.layer.root.style;for(const n of this.appliedVars)e.removeProperty(n);this.appliedVars=[];const s={...this.opts.theme,...this.spec.theme,...t};for(const[n,o]of Object.entries(s)){if(o===void 0)continue;const r=Ie[n];if(!r)continue;const c=Te.has(n)?`${o}px`:Oe.has(n)?`${o}ms`:String(o);e.setProperty(r,c),this.appliedVars.push(r)}s.z!==void 0&&(this.layer.root.style.zIndex=String(s.z))}emit(t,e={}){const s={type:t,tourId:this.spec?.id??"unknown",timestamp:Date.now(),...e},n=Object.freeze({...s});try{this.opts.onEvent?.(n)}catch{}try{window.dispatchEvent(new CustomEvent("opentutorial",{detail:n}))}catch{}}}function Ne(i,t){if(!i||i.type==="manual")return{dispose:()=>{}};const e=i.delay??0,s=[],n=[];let o=!1;const r=i.once??!0,c=()=>{o||(r&&(o=!0),e>0?s.push(window.setTimeout(t,e)):t())};switch(i.type){case"auto":{c();break}case"event":{const a=()=>c();window.addEventListener(i.event,a),n.push(()=>window.removeEventListener(i.event,a));break}case"route":{const a=()=>{mt(i.path,ft(),i.exact)?c():r||(o=!1)};n.push(gt(a)),a();break}case"element":{let a=!1;_({selector:i.selector,visible:!0},i.timeout??3e4).then(l=>{l&&!a&&c()}),n.push(()=>{a=!0});break}case"idle":{let a=0;const l=()=>{window.clearTimeout(a),!o&&(a=window.setTimeout(c,i.ms))},d=["pointerdown","keydown","scroll","pointermove"];for(const p of d)window.addEventListener(p,l,{passive:!0}),n.push(()=>window.removeEventListener(p,l));n.push(()=>window.clearTimeout(a)),l();break}case"scroll":{const a=()=>{const l=document.documentElement,d=l.scrollHeight-l.clientHeight;if(d<=0)return;l.scrollTop/d*100>=i.percent&&c()};window.addEventListener("scroll",a,{passive:!0}),n.push(()=>window.removeEventListener("scroll",a)),a();break}}return{dispose:()=>{s.forEach(a=>window.clearTimeout(a)),n.forEach(a=>{try{a()}catch{}})}}}class st{constructor(t,e={}){u(this,"engines",new Map);u(this,"specs");u(this,"opts");u(this,"triggers",[]);u(this,"disposers",[]);u(this,"queue",[]);u(this,"activeId",null);u(this,"mounted",!1);u(this,"sessionCounts",new Map);this.specs=t,this.opts=e;for(const s of t)this.engines.set(s.id,new it(s,{...e,onEvent:n=>this.handleEvent(n)}))}get ready(){return Promise.all([...this.engines.values()].map(t=>t.ready)).then(()=>{})}getEngine(t){return this.engines.get(t)}getEngines(){return[...this.engines.values()]}getSpecs(){return this.specs}getActiveId(){return this.activeId}getState(t){const e=t??this.activeId;return e?this.engines.get(e)?.getState()??null:null}hasSeen(t){return this.engines.get(t)?.hasSeen()??!1}checkEligibility(t){const e=this.engines.get(t);if(!e)return"unknown tour";if(!e.isValid())return"spec failed validation";const s=e.spec,n=e.getContext();if(s.audience?.showIf&&!P(s.audience.showIf,n))return"audience rule did not match";const o=s.frequency;if(o){const r=e.getPersistence().getRecord(s.id);if(o.max!==void 0&&(r?.shownCount??0)>=o.max)return`frequency: already shown ${o.max} time(s)`;if(o.cooldown!==void 0&&r?.lastShownAt){const c=Date.now()-r.lastShownAt;if(c<o.cooldown)return`frequency: cooldown active (${o.cooldown-c}ms left)`}if(o.perSession!==void 0&&(this.sessionCounts.get(s.id)??0)>=o.perSession)return`frequency: session limit of ${o.perSession} reached`}return null}request(t,e,s={}){const n=this.engines.get(t);if(!n||!s.force&&this.checkEligibility(t))return!1;if(this.activeId&&this.activeId!==t)if(s.force)this.engines.get(this.activeId)?.skip("preempted");else return s.queue!==!1&&this.enqueue(t,e,n.spec.priority??0),!1;return this.sessionCounts.set(t,(this.sessionCounts.get(t)??0)+1),n.start(e),!0}start(t,e){this.request(t,e,{force:!0})}enqueue(t,e,s){this.queue.some(n=>n.tourId===t)||(this.queue.push({tourId:t,stepId:e,priority:s}),this.queue.sort((n,o)=>o.priority-n.priority))}drain(){for(;this.queue.length>0;){const t=this.queue.shift();if(!t||this.request(t.tourId,t.stepId,{queue:!1}))return}}stop(t="api"){for(const e of this.engines.values()){const s=e.getState().status;(s==="running"||s==="paused")&&e.skip(t)}this.queue=[]}pause(){this.activeId&&this.engines.get(this.activeId)?.pause()}resume(){this.activeId&&this.engines.get(this.activeId)?.resume()}setContext(t){this.engines.forEach(e=>e.setContext(t))}setTheme(t){this.engines.forEach(e=>e.setGlobalTheme(t))}setLocale(t){this.opts={...this.opts,locale:t},this.engines.forEach(e=>e.setLocale(t))}async setUser(t){this.sessionCounts.clear(),await Promise.all([...this.engines.values()].map(e=>e.setUser(t)))}reset(){this.sessionCounts.clear(),this.engines.values().next().value?.resetAll()}resetProgress(){this.engines.forEach(t=>t.resetProgress())}resetTour(t){this.sessionCounts.delete(t),this.engines.get(t)?.resetSeen()}mount(){this.mounted||(this.mounted=!0,this.ready.then(()=>{this.mounted&&(this.installChainListener(),this.installDeepLink(),this.installAutoResume(),this.installTriggers())}))}installTriggers(){for(const t of this.specs){const e=this.engines.get(t.id);if(!e||!e.isValid())continue;const s=t.trigger;!s||s.type==="manual"||(s.once??!0)&&e.hasSeen()||this.triggers.push(Ne(s,()=>{(s.once??!0)&&e.hasSeen()||this.request(t.id)}))}}installDeepLink(){const t=this.opts.deepLinkParam??"tour";if(t!==!1)try{const e=new URLSearchParams(window.location.search),s=e.get(t);if(!s||!this.engines.has(s))return;const n=e.get(`${t}Step`)??void 0,o=window.setTimeout(()=>this.request(s,n,{force:!0}),400);this.disposers.push(()=>window.clearTimeout(o))}catch{}}installAutoResume(){if(!this.opts.autoResume)return;const t=this.engines.values().next().value;if(!t)return;const e=t.getPersistence().getActive();if(!e||!this.engines.has(e.tourId))return;const s=window.setTimeout(()=>this.request(e.tourId,e.stepId,{force:!0}),200);this.disposers.push(()=>window.clearTimeout(s))}installChainListener(){const t=e=>{const s=e.detail;!s?.to||!this.engines.has(s.to)||window.setTimeout(()=>this.request(s.to,void 0,{force:!0}),0)};window.addEventListener("opentutorial:chain",t),this.disposers.push(()=>window.removeEventListener("opentutorial:chain",t))}handleEvent(t){(t.type==="started"||t.type==="resumed")&&(this.activeId=t.tourId),(t.type==="completed"||t.type==="skipped")&&this.activeId===t.tourId&&(this.activeId=null);try{this.opts.onEvent?.(t)}catch{}const e=this.activeId?this.engines.get(this.activeId)?.getState()??null:null;try{this.opts.onStateChange?.(this.activeId,e)}catch{}(t.type==="completed"||t.type==="skipped")&&this.queue.length>0&&window.setTimeout(()=>this.drain(),0)}destroy(){this.mounted=!1,this.triggers.forEach(t=>t.dispose()),this.disposers.forEach(t=>{try{t()}catch{}}),this.triggers=[],this.disposers=[],this.queue=[],this.engines.forEach(t=>t.destroy()),this.activeId=null}}const ze={start:["started","resumed"],stop:["completed","skipped"],skip:["skipped"],complete:["completed"],step:["step-shown"],event:[],destroy:[]};function Ot(i){const{specs:t,autoMount:e=!0,...s}=i,n=new Map,o=(a,l)=>{const d=n.get(a);if(d)for(const p of d)try{p(l)}catch{}},r=new st(t,{...s,onEvent:a=>{o("event",a);for(const[l,d]of Object.entries(ze))d.includes(a.type)&&o(l,a);s.onEvent?.(a)}});e&&r.mount();const c=a=>{const l=r.getActiveId();if(!l)return;const d=r.getEngine(l);d&&a(d)};return{start:(a,l)=>r.start(a,l),request:(a,l)=>r.request(a,l),stop:()=>r.stop("api"),skip:a=>{a?r.getEngine(a)?.skip("api"):r.stop("api")},pause:()=>r.pause(),resume:()=>r.resume(),next:()=>c(a=>{a.next()}),prev:()=>c(a=>a.prev()),goTo:a=>c(l=>l.goTo(a)),getState:a=>r.getState(a),getActiveId:()=>r.getActiveId(),hasSeen:a=>r.hasSeen(a),whyBlocked:a=>r.checkEligibility(a),setContext:a=>r.setContext(a),setTheme:a=>r.setTheme(a),setLocale:a=>r.setLocale(a),setUser:a=>r.setUser(a),reset:()=>r.reset(),resetTour:a=>r.resetTour(a),resetProgress:()=>r.resetProgress(),getEngine:a=>r.getEngine(a),ready:r.ready,on(a,l){return n.has(a)||n.set(a,new Set),n.get(a).add(l),()=>this.off(a,l)},off(a,l){n.get(a)?.delete(l)},destroy(){o("destroy",{type:"skipped",tourId:r.getActiveId()??"",reason:"destroy",timestamp:Date.now()}),r.destroy(),n.clear()}}}function Re(i,t={}){return new it(i,t)}function Me(i,t={}){return new st(i,t)}function Be(i){return i}function qe(i={}){const{days:t=365,path:e="/",domain:s,sameSite:n="Lax",secure:o}=i,r=()=>{const a={};if(typeof document>"u")return a;for(const l of document.cookie.split(";")){const d=l.indexOf("=");d<0||(a[decodeURIComponent(l.slice(0,d).trim())]=decodeURIComponent(l.slice(d+1)))}return a},c=(a,l,d)=>{if(typeof document>"u")return;const p=[`${encodeURIComponent(a)}=${encodeURIComponent(l)}`,`path=${e}`,`max-age=${Math.floor(d*86400)}`,`SameSite=${n}`];s&&p.push(`domain=${s}`),(o??n==="None")&&p.push("Secure"),document.cookie=p.join("; ")};return{getItem:a=>r()[a]??null,setItem:(a,l)=>c(a,l,t),removeItem:a=>c(a,"",-1)}}function Pe(i="opentutorial",t="kv"){const e=new Y;if(typeof indexedDB>"u")return e;let s=null;const n=()=>s||(s=new Promise(r=>{try{const c=indexedDB.open(i,1);c.onupgradeneeded=()=>{const a=c.result;a.objectStoreNames.contains(t)||a.createObjectStore(t)},c.onsuccess=()=>r(c.result),c.onerror=()=>r(null),c.onblocked=()=>r(null)}catch{r(null)}}),s),o=async(r,c)=>{const a=await n();return a?new Promise(l=>{try{const d=a.transaction(t,r),p=c(d.objectStore(t));p.onsuccess=()=>l(p.result),p.onerror=()=>l(null)}catch{l(null)}}):null};return{getItem(r){const c=e.getItem(r);return c!==null?c:o("readonly",a=>a.get(r)).then(a=>(typeof a=="string"&&e.setItem(r,a),typeof a=="string"?a:null))},setItem(r,c){e.setItem(r,c),o("readwrite",a=>a.put(c,r))},removeItem(r){e.removeItem(r),o("readwrite",c=>c.delete(r))}}}function De(i){const{endpoint:t,headers:e,debounceMs:s=400,fetchImpl:n,onError:o}=i,r=i.cache===!1?new Y:i.cache??vt(),c=n??(typeof fetch=="function"?fetch.bind(globalThis):void 0),a=t.replace(/\/$/,""),l=w=>`${a}/${encodeURIComponent(w)}`,d=()=>({"content-type":"application/json",...typeof e=="function"?e():e??{}}),p=new Map;let f=null;const k=async()=>{if(!c||p.size===0)return;const w=[...p.entries()];p.clear();for(const[h,g]of w)try{const b=await c(l(h),{method:g===null?"DELETE":"PUT",headers:d(),body:g===null?void 0:JSON.stringify({value:g}),credentials:"include"});if(!b.ok)throw new Error(`HTTP ${b.status}`)}catch(b){p.has(h)||p.set(h,g),o?.(b,g===null?"delete":"put",h)}},x=()=>{f&&clearTimeout(f),f=setTimeout(()=>{f=null,k()},s)};return typeof window<"u"&&(window.addEventListener("online",()=>{k()}),window.addEventListener("pagehide",()=>{k()})),{getItem(w){const h=r.getItem(w);return h??(c?c(l(w),{headers:d(),credentials:"include"}).then(g=>g.ok?g.json():null).then(g=>{const b=g?.value??null;return typeof b=="string"&&r.setItem(w,b),b}).catch(g=>(o?.(g,"get",w),null)):null)},setItem(w,h){r.setItem(w,h),p.set(w,h),x()},removeItem(w){r.removeItem(w),p.set(w,null),x()}}}const je=["data-tour","data-testid","data-test-id","data-test","data-cy","data-qa","data-automation-id"],_e=/^(css-[a-z0-9]+|sc-[a-zA-Z0-9]+|jsx-\d+|[a-z]+-[a-f0-9]{5,}|_[\w-]{5,})$/,Lt=/(^|[-_:])(\d{3,}|[a-f0-9]{8,}|uid|uuid|react-aria|radix|headlessui|mui-)/i;function C(i){return typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(i):i.replace(/["\\]/g,"\\$&")}function nt(i,t=document){try{return t.querySelectorAll(i).length}catch{return 0}}function Nt(i){return Array.from(i.classList).filter(t=>t.length>1&&!_e.test(t)&&!t.startsWith("ot-"))}function He(i){const t=i.parentElement;return t?Array.from(t.children).filter(s=>s.tagName===i.tagName).indexOf(i)+1:1}function Fe(i,t=document){const e=[];let s=i,n=0;for(;s&&s.nodeType===1&&n<6;){if(s.id&&!Lt.test(s.id)){e.unshift(`#${C(s.id)}`);break}const o=s.tagName.toLowerCase();if(o==="html"||o==="body"){e.unshift(o);break}const r=Nt(s);let c=r.length>0?`${o}.${C(r[0])}`:o;const a=s.parentElement;a&&Array.from(a.children).filter(p=>p.tagName===s.tagName&&(r.length===0||p.classList.contains(r[0]))).length>1&&(c+=`:nth-of-type(${He(s)})`),e.unshift(c),s=a,n+=1;const l=e.join(" > ");if(nt(l,t)===1)break}return e.join(" > ")}function Ue(i,t=document){const e=[],s=(l,d,p)=>{const f=nt(l,t);if(f===0)return;const k=f===1?d:Math.max(10,d-25);e.push({selector:l,score:k,reason:p,matches:f})};for(const l of je){const d=i.getAttribute(l);d&&s(`[${l}="${C(d)}"]`,l==="data-tour"?100:92,`explicit ${l} hook`)}if(i.id){const l=!Lt.test(i.id);s(`#${C(i.id)}`,l?85:45,l?"element id":"id looks generated")}const n=i.getAttribute("name");n&&s(`${i.tagName.toLowerCase()}[name="${C(n)}"]`,78,"form field name");const o=i.getAttribute("role"),r=i.getAttribute("aria-label");o&&r?s(`[role="${C(o)}"][aria-label="${C(r)}"]`,74,"role + aria-label"):r&&s(`[aria-label="${C(r)}"]`,70,"aria-label");const c=Nt(i);if(c.length>0){const l=i.tagName.toLowerCase();s(`${l}.${c.map(C).join(".")}`,55,"tag + stable classes"),c.length>1&&s(`.${C(c[0])}`,40,"single class")}const a=Fe(i,t);return a&&s(a,28,"structural path (fragile — add a data-tour attribute)"),e.filter((l,d,p)=>p.findIndex(f=>f.selector===l.selector)===d).sort((l,d)=>d.score-l.score)}function ot(i,t=document){const e=Ue(i,t);if(e.length===0)return null;const[s,...n]=e,o=(i.textContent??"").replace(/\s+/g," ").trim();return{selector:s.selector,score:s.score,reason:s.reason,fallbacks:n.filter(r=>r.score>=40).slice(0,2).map(r=>r.selector),text:o.length>0&&o.length<=60?o:void 0}}function Ve(i,t=document){return i.map(e=>{const s=nt(e,t);return s===0?{selector:e,matches:s,ok:!1,note:"no element matches"}:s>1?{selector:e,matches:s,ok:!0,note:`matches ${s} elements; add target.index`}:{selector:e,matches:s,ok:!0}})}const We="[data-ot-recorder]";function zt(i={}){const t=i.minScore??60,e=[],s=document.createElement("style");s.setAttribute("data-ot-recorder",""),s.textContent=A,document.head.appendChild(s);const n=document.createElement("div");n.className="ot-rec-highlight",n.setAttribute("data-ot-recorder",""),n.style.display="none";const o=document.createElement("div");o.className="ot-rec-label",o.setAttribute("data-ot-recorder",""),o.style.display="none";const r=document.createElement("div");r.className="ot-rec-panel",r.setAttribute("data-ot-recorder",""),document.body.append(n,o,r);const c=()=>({specVersion:1,id:i.tourId??"recorded-tour",title:i.title??"Recorded tour",trigger:{type:"manual"},steps:e.length>0?e.map(b=>b.step):[{id:"step-1",title:"Untitled",content:"Add your copy here."}]}),a=()=>JSON.stringify(c(),null,2),l=()=>{r.replaceChildren();const b=document.createElement("h4");b.textContent=`Recording — ${e.length} step${e.length===1?"":"s"}`,r.appendChild(b);const m=document.createElement("ul");m.className="ot-rec-steps",e.forEach((R,Pt)=>{const at=document.createElement("li");at.className="ot-rec-step";const B=document.createElement("div");B.style.flex="1",B.style.minWidth="0";const Dt=document.createElement("div");Dt.textContent=`${Pt+1}. ${typeof R.step.title=="string"?R.step.title:R.step.id}`,B.appendChild(Dt);const jt=document.createElement("code"),ct=R.step.target?.selector;if(jt.textContent=Array.isArray(ct)?ct[0]:ct??"(no target)",B.appendChild(jt),R.score<t){const V=document.createElement("div");V.textContent=`⚠ fragile (${R.score}) — ${R.reason}`,V.style.color="#f59e0b",V.style.fontSize="10.5px",B.appendChild(V)}const j=document.createElement("button");j.className="ot-rec-btn ot-rec-btn--ghost",j.textContent="×",j.title="Remove step",j.addEventListener("click",()=>{e.splice(Pt,1),d(),l(),i.onChange?.(c())}),at.append(B,j),m.appendChild(at)}),r.appendChild(m);const v=document.createElement("div");v.className="ot-rec-actions";const S=document.createElement("button");S.className="ot-rec-btn",S.textContent="Copy JSON",S.addEventListener("click",()=>p());const T=document.createElement("button");T.className="ot-rec-btn ot-rec-btn--ghost",T.textContent="Stop",T.addEventListener("click",()=>g()),v.append(S,T),r.appendChild(v);const rt=document.createElement("div");rt.style.cssText="margin-top:8px;opacity:0.55;font-size:11px;line-height:1.45",rt.textContent="Click any element to capture it. Esc stops recording.",r.appendChild(rt)},d=()=>{e.forEach((b,m)=>{b.step.id=`step-${m+1}`})},p=()=>{const b=a();if(i.onExport){i.onExport(c(),b);return}navigator.clipboard?.writeText(b).catch(()=>{console.log(b)})},f=b=>!!b?.closest?.(We),k=b=>{const m=b.target;if(!m||f(m)){n.style.display="none",o.style.display="none";return}const v=m.getBoundingClientRect();n.style.display="",n.style.left=`${v.x}px`,n.style.top=`${v.y}px`,n.style.width=`${v.width}px`,n.style.height=`${v.height}px`;const S=ot(m);o.style.display="",o.textContent=S?`${S.selector}  (${S.score})`:m.tagName.toLowerCase();const T=v.y+v.height+4;o.style.left=`${Math.max(4,v.x)}px`,o.style.top=T+22<window.innerHeight?`${T}px`:`${Math.max(4,v.y-22)}px`},x=b=>{const m=b.target;if(!m||f(m))return;b.preventDefault(),b.stopPropagation();const v=ot(m);if(!v)return;const S=(m.textContent??"").replace(/\s+/g," ").trim().slice(0,40),T={id:`step-${e.length+1}`,target:{selector:v.fallbacks.length>0?[v.selector,...v.fallbacks]:v.selector,...v.score<t&&v.text?{text:v.text}:{}},title:S||"Untitled step",content:"Describe what the user should do here."};e.push({step:T,score:v.score,reason:v.reason}),l(),i.onChange?.(c())},w=b=>{b.key==="Escape"&&(b.preventDefault(),g())};document.addEventListener("pointermove",k,!0),document.addEventListener("click",x,!0),document.addEventListener("keydown",w,!0),l();let h=!1;const g=()=>{h||(h=!0,document.removeEventListener("pointermove",k,!0),document.removeEventListener("click",x,!0),document.removeEventListener("keydown",w,!0),n.remove(),o.remove(),r.remove(),s.remove())};return{stop:g,getSpec:c,toJSON:a}}function Rt(i="ot-record"){try{const e=new URLSearchParams(window.location.search).get(i);return!e||e==="0"||e==="false"?null:zt({tourId:e==="1"?void 0:e})}catch{return null}}function Ke(i){const t=document.createElement("style");t.setAttribute("data-ot-debug",""),t.textContent=A;const e=document.createElement("div");e.className="ot-debug",e.setAttribute("data-ot-debug",""),document.head.appendChild(t),document.body.appendChild(e);const s=(r,c,a)=>{const l=document.createElement("div");l.className="ot-debug-row";const d=document.createElement("span");d.className="ot-debug-key",d.textContent=r;const p=document.createElement("span");return p.className=`ot-debug-val${a?` ot-debug-${a}`:""}`,p.textContent=c,l.append(d,p),l},n=()=>{const r=i.getActiveId(),c=i.getState(),a=i.getContext(),l=i.specs.find(x=>x.id===r);e.replaceChildren();const d=document.createElement("h4");d.textContent="Opentutorial debug",e.appendChild(d),e.appendChild(s("tour",r??"(none)")),e.appendChild(s("status",c?.status??"idle")),e.appendChild(s("step",c?.currentStepId??"—")),c&&e.appendChild(s("position",`${c.index+1} / ${c.total}`));const p=l?.steps.find(x=>x.id===c?.currentStepId);if(p?.target){const x=L(p.target);e.appendChild(s("target",x?"resolved":"NOT FOUND",x?"ok":"bad")),e.appendChild(s("selector",ut(p.target)))}const f=Object.keys(a);if(f.length>0){const x=document.createElement("h4");x.textContent="context",x.style.marginTop="10px",e.appendChild(x);for(const w of f.slice(0,12))e.appendChild(s(w,JSON.stringify(a[w])?.slice(0,40)??"undefined"))}const k=[];l?.audience?.showIf&&k.push({label:"audience",expr:l.audience.showIf});for(const x of l?.steps??[])x.showIf&&k.push({label:x.id,expr:x.showIf});if(k.length>0){const x=document.createElement("h4");x.textContent="conditions",x.style.marginTop="10px",e.appendChild(x);for(const{label:w,expr:h}of k.slice(0,12)){const g=Z(h,a);e.appendChild(s(w,`${h} → ${String(g)}`,g?"ok":"bad"))}}},o=()=>n();return window.addEventListener("opentutorial",o),n(),{update:n,destroy:()=>{window.removeEventListener("opentutorial",o),e.remove(),t.remove()}}}function Ge(i="[opentutorial]"){const t=e=>{const s=e.detail;if(!s)return;const n=[s.type,s.tourId,s.stepId].filter(Boolean).join(" · ");console.log(`${i} ${n}${s.duration?` (${s.duration}ms)`:""}`)};return window.addEventListener("opentutorial",t),()=>window.removeEventListener("opentutorial",t)}function M(i,t={}){const e={tour_id:i.tourId,event_type:i.type};return i.stepId!==void 0&&(e.step_id=i.stepId),i.index!==void 0&&(e.step_index=i.index),i.total!==void 0&&(e.step_total=i.total),i.duration!==void 0&&(e.duration_ms=i.duration),i.reason!==void 0&&(e.reason=i.reason),i.selector!==void 0&&(e.selector=i.selector),i.message!==void 0&&(e.message=i.message),i.meta&&Object.assign(e,i.meta),t.includeTimestamp!==!1&&(e.timestamp=i.timestamp),e}function U(i,t="Opentutorial"){return`${t} ${i.type}`}function N(i){try{i()}catch{}}function Je(i){return t=>N(()=>i.capture(U(t,"[Opentutorial]"),M(t)))}function Ye(i){return t=>N(()=>i.track(U(t,"[Opentutorial]"),M(t)))}function Xe(i){return t=>N(()=>i.track(U(t,"[Opentutorial]"),M(t,{includeTimestamp:!1})))}function Qe(i){return t=>N(()=>i.track(U(t,"Opentutorial"),M(t)))}function Ze(i){return t=>N(()=>{const e=window.gtag;typeof e=="function"&&e("event",`opentutorial_${t.type.replace(/-/g,"_")}`,{...M(t,{includeTimestamp:!1}),send_to:i})})}function ti(...i){const t=i.filter(e=>typeof e=="function");return e=>{for(const s of t)N(()=>s(e))}}function ei(i){const{endpoint:t,headers:e,batchSize:s=20,flushMs:n=5e3,storage:o,storageKey:r="ot:analytics:queue",maxQueue:c=500,transform:a,fetchImpl:l,onError:d}=i,p=l??(typeof fetch=="function"?fetch.bind(globalThis):void 0);let f=[],k=null,x=!1;const w=()=>({"content-type":"application/json",...typeof e=="function"?e():e??{}}),h=()=>{o&&N(()=>o.setItem(r,JSON.stringify(f)))};o&&Promise.resolve(o.getItem(r)).then(m=>{if(typeof m=="string")try{const v=JSON.parse(m);Array.isArray(v)&&(f=[...v,...f].slice(-c))}catch{}});const g=async()=>{if(x||f.length===0||!p)return;x=!0;const m=f.splice(0,Math.max(s,1));h();try{const v=await p(t,{method:"POST",headers:w(),body:JSON.stringify({events:m}),keepalive:!0});if(!v.ok)throw new Error(`HTTP ${v.status}`)}catch(v){f=[...m,...f].slice(-c),h(),d?.(v,m)}finally{x=!1}},b=()=>{k||(k=setTimeout(()=>{k=null,g()},n))};return typeof window<"u"&&(window.addEventListener("online",()=>{g()}),window.addEventListener("pagehide",()=>{if(f.length===0)return;ii(t,{events:f})&&(f=[],h())})),m=>N(()=>{f.push(a?a(m):M(m)),f.length>c&&(f=f.slice(-c)),h(),f.length>=s?g():b()})}function ii(i,t){try{return typeof navigator>"u"||typeof navigator.sendBeacon!="function"?!1:navigator.sendBeacon(i,new Blob([JSON.stringify(t)],{type:"application/json"}))}catch{return!1}}function Mt(i){if(i.length===0)return 0;const t=[...i].sort((s,n)=>s-n),e=Math.floor(t.length/2);return t.length%2===0?Math.round((t[e-1]+t[e])/2):t[e]}function Bt(i,t,e){const s=i.filter(h=>h.tourId===t),n=s.filter(h=>h.type==="started"||h.type==="resumed").length,o=s.filter(h=>h.type==="completed").length,r=s.filter(h=>h.type==="skipped").length,c=s.filter(h=>(h.type==="completed"||h.type==="skipped")&&typeof h.duration=="number").map(h=>h.duration),a=[],l=new Map,d=new Map,p=new Map;for(const h of s)if(h.type==="step-shown"&&h.stepId&&(a.includes(h.stepId)||a.push(h.stepId),l.set(h.stepId,(l.get(h.stepId)??0)+1)),h.type==="step-completed"&&h.stepId&&(d.set(h.stepId,(d.get(h.stepId)??0)+1),typeof h.duration=="number")){const g=p.get(h.stepId)??[];g.push(h.duration),p.set(h.stepId,g)}const k=(e?e.steps.map(h=>h.id).filter(h=>l.has(h)):a).map((h,g)=>{const b=l.get(h)??0,m=d.get(h)??0,v=Math.max(0,b-m);return{stepId:h,index:g,views:b,completions:m,dropOffs:v,dropOffRate:b>0?v/b:0,medianDurationMs:Mt(p.get(h)??[])}}),x=k.reduce((h,g)=>g.dropOffs>0&&(!h||g.dropOffRate>h.dropOffRate)?g:h,null),w=new Map;for(const h of s){if(h.type!=="target-not-found"||!h.stepId)continue;const g=`${h.stepId}::${h.selector??""}`,b=w.get(g);b?b.count+=1:w.set(g,{stepId:h.stepId,selector:h.selector??"",count:1})}return{tourId:t,starts:n,completions:o,skips:r,completionRate:n>0?o/n:0,medianDurationMs:Mt(c),steps:k,worstStep:x,targetsNotFound:[...w.values()].sort((h,g)=>g.count-h.count)}}function si(i=5e3){const t=[];return{adapter:e=>{t.push(e),t.length>i&&t.splice(0,t.length-i)},events:t,report:(e,s)=>Bt(t,e,s),clear:()=>{t.length=0}}}const ni=["specs","context","theme","locale","dir","z-index","interaction","auto-start","deep-link-param","resume","auto-resume","isolate","allow-html","debug"];function D(i,t){if(!i)return t;try{return JSON.parse(i)}catch{return t}}class oi extends HTMLElement{constructor(){super(...arguments);u(this,"layer",null);u(this,"_specs",[]);u(this,"_context",{})}static get observedAttributes(){return ni}set specs(e){this._specs=Array.isArray(e)?e:[],this.rebuild()}get specs(){return this._specs}set context(e){this._context=e??{},this.layer?.setContext(this._context)}get context(){return this._context}connectedCallback(){this.style.display="none",this.rebuild()}disconnectedCallback(){this.layer?.destroy(),this.layer=null}attributeChangedCallback(e){if(this.isConnected){if(e==="context"){this._context=D(this.getAttribute("context"),{}),this.layer?.setContext(this._context);return}if(e==="locale"){const s=this.getAttribute("locale");s&&this.layer?.setLocale(s);return}this.rebuild()}}collectSpecs(){if(this._specs.length>0)return this._specs;const e=D(this.getAttribute("specs"),null);if(e)return Array.isArray(e)?e:[e];const s=[];for(const n of Array.from(this.querySelectorAll('script[type="application/json"]'))){const o=D(n.textContent,null);o&&s.push(...Array.isArray(o)?o:[o])}return s}rebuild(){if(!this.isConnected)return;this.layer?.destroy();const e=this.collectSpecs();if(e.length===0){this.layer=null;return}const s=c=>this.hasAttribute(c)&&this.getAttribute(c)!=="false",n=Number(this.getAttribute("z-index")),o=this.getAttribute("deep-link-param");this.layer=Ot({specs:e,context:{...D(this.getAttribute("context"),{}),...this._context},theme:D(this.getAttribute("theme"),void 0),locale:this.getAttribute("locale")??void 0,dir:this.getAttribute("dir")??void 0,zIndex:Number.isFinite(n)&&n>0?n:void 0,interaction:this.getAttribute("interaction")??void 0,deepLinkParam:o==="false"?!1:o??void 0,resume:s("resume"),autoResume:s("auto-resume"),isolate:s("isolate"),allowHtml:s("allow-html"),debug:s("debug"),onEvent:c=>{this.dispatchEvent(new CustomEvent("opentutorial",{detail:c,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent(`ot-${c.type}`,{detail:c,bubbles:!0,composed:!0}))}});const r=this.getAttribute("auto-start");r&&this.layer.ready.then(()=>this.layer?.request(r))}start(e,s){this.layer?.start(e,s)}stop(){this.layer?.stop()}pause(){this.layer?.pause()}resumeTour(){this.layer?.resume()}next(){this.layer?.next()}prev(){this.layer?.prev()}reset(){this.layer?.reset()}getState(e){return this.layer?.getState(e)??null}getLayer(){return this.layer}}function qt(i="open-tutorial"){typeof customElements>"u"||customElements.get(i)||customElements.define(i,oi)}qt(),Rt(),y.CSS=A,y.TourEngine=it,y.TourOrchestrator=st,y.TourPersistence=bt,y.assertValidSpec=we,y.auditSelectors=Ve,y.bestSelector=ot,y.createAmplitudeAdapter=Xe,y.createCookieStorage=qe,y.createDebugPanel=Ke,y.createEventCollector=si,y.createFunnelReport=Bt,y.createGA4Adapter=Ze,y.createHttpAdapter=ei,y.createIndexedDBStorage=Pe,y.createMixpanelAdapter=Ye,y.createMultiAdapter=ti,y.createPostHogAdapter=Je,y.createRemoteStorage=De,y.createSegmentAdapter=Qe,y.createTour=Re,y.createTours=Me,y.createTutorialLayer=Ot,y.defineOpenTutorialElement=qt,y.defineSpec=Be,y.enableRecorderFromUrl=Rt,y.evaluateExpression=Z,y.evaluateShowIf=P,y.logEvents=Ge,y.resolveTarget=L,y.startRecorder=zt,y.validateSpec=F,y.validateSpecs=ke,y.waitForTarget=_,Object.defineProperty(y,Symbol.toStringTag,{value:"Module"})})(this.Opentutorial=this.Opentutorial||{});
//# sourceMappingURL=opentutorial.global.js.map
