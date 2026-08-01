var jn=Object.defineProperty;var _n=(S,_,Y)=>_ in S?jn(S,_,{enumerable:!0,configurable:!0,writable:!0,value:Y}):S[_]=Y;var f=(S,_,Y)=>_n(S,typeof _!="symbol"?_+"":_,Y);(function(S){"use strict";const _=`
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
`.trim();let Y=0;class he{constructor(t,e={}){f(this,"root");f(this,"host");f(this,"shadow",null);f(this,"svg");f(this,"dimRect");f(this,"hole");f(this,"ring");f(this,"shield");f(this,"panels",[]);f(this,"current",null);f(this,"interaction","free");f(this,"opts");Y+=1;const i=`ot-mask-${Y}`;if(this.opts=e,this.root=document.createElement("div"),this.root.className="ot-root",this.root.style.setProperty("--ot-z",String(t)),this.root.setAttribute("data-opentutorial",""),e.dir&&this.root.setAttribute("dir",e.dir),e.isolate){this.host=document.createElement("div"),this.host.setAttribute("data-opentutorial-host",""),this.host.style.cssText="position:fixed;inset:0;pointer-events:none;",this.host.style.zIndex=String(t);try{this.shadow=this.host.attachShadow({mode:"open"});const c=document.createElement("style");c.textContent=_,this.shadow.appendChild(c),this.shadow.appendChild(this.root)}catch{this.shadow=null,this.host=this.root}}else this.host=this.root;const o="http://www.w3.org/2000/svg";this.svg=document.createElementNS(o,"svg"),this.svg.setAttribute("class","ot-backdrop"),this.svg.setAttribute("width","100%"),this.svg.setAttribute("height","100%"),this.svg.setAttribute("aria-hidden","true");const s=document.createElementNS(o,"defs"),r=document.createElementNS(o,"mask");r.setAttribute("id",i);const a=document.createElementNS(o,"rect");a.setAttribute("x","0"),a.setAttribute("y","0"),a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("fill","white"),this.hole=document.createElementNS(o,"rect"),this.hole.setAttribute("fill","black"),this.hole.setAttribute("rx","12"),this.setHole({x:-9999,y:-9999,width:0,height:0},0),r.appendChild(a),r.appendChild(this.hole),s.appendChild(r),this.dimRect=document.createElementNS(o,"rect"),this.dimRect.setAttribute("class","ot-dim"),this.dimRect.setAttribute("x","0"),this.dimRect.setAttribute("y","0"),this.dimRect.setAttribute("width","100%"),this.dimRect.setAttribute("height","100%"),this.dimRect.setAttribute("mask",`url(#${i})`),this.svg.appendChild(s),this.svg.appendChild(this.dimRect),this.ring=document.createElement("div"),this.ring.className="ot-ring",this.ring.style.opacity="0",this.shield=document.createElement("div"),this.shield.className="ot-shield",this.shield.style.display="none";for(let c=0;c<4;c+=1){const l=document.createElement("div");l.className="ot-shield-panel",this.panels.push(l),this.shield.appendChild(l)}this.root.appendChild(this.svg),this.root.appendChild(this.ring),this.root.appendChild(this.shield),this.svg.style.display="none"}setHole(t,e){this.hole.setAttribute("x",String(t.x-e)),this.hole.setAttribute("y",String(t.y-e)),this.hole.setAttribute("width",String(Math.max(0,t.width+e*2))),this.hole.setAttribute("height",String(Math.max(0,t.height+e*2)))}updateSpotlight(t,e=8,i=12){if(this.current=t?{...t,padding:e,radius:i}:null,!t){this.setHole({x:-9999,y:-9999,width:0,height:0},0),this.ring.style.opacity="0",this.svg.style.display="none",this.applyShield();return}this.svg.style.display="",this.setHole(t,e),this.hole.setAttribute("rx",String(i));const o=this.ring.style;o.opacity="1",o.left=`${t.x-e}px`,o.top=`${t.y-e}px`,o.width=`${t.width+e*2}px`,o.height=`${t.height+e*2}px`,o.borderRadius=`${i}px`,this.applyShield()}showBackdrop(){this.current=null,this.svg.style.display="",this.setHole({x:-9999,y:-9999,width:0,height:0},0),this.ring.style.opacity="0",this.applyShield()}setInteraction(t){this.interaction=t,this.applyShield()}applyShield(){if(this.interaction==="free"){this.shield.style.display="none";return}this.shield.style.display="";const t=window.innerWidth,e=window.innerHeight,i=this.interaction==="target-only"&&this.current?{x:this.current.x-this.current.padding,y:this.current.y-this.current.padding,width:this.current.width+this.current.padding*2,height:this.current.height+this.current.padding*2}:{x:t,y:e,width:0,height:0},[o,s,r,a]=this.panels,c=(l,p,d,u,E)=>{l.style.left=`${p}px`,l.style.top=`${d}px`,l.style.width=`${Math.max(0,u)}px`,l.style.height=`${Math.max(0,E)}px`};c(o,0,0,t,i.y),c(r,0,i.y+i.height,t,e-(i.y+i.height)),c(a,0,i.y,i.x,i.height),c(s,i.x+i.width,i.y,t-(i.x+i.width),i.height)}refresh(){this.current?this.updateSpotlight(this.current,this.current.padding,this.current.radius):this.applyShield()}mountPopover(t){this.root.appendChild(t)}setBackdropColor(t){this.dimRect.style.fill=t}setDir(t){this.root.setAttribute("dir",t)}attach(t){(t??this.opts.container??document.body).appendChild(this.host)}destroy(){this.host.remove()}}const pe={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function zt(n){return n.replace(/[&<>"']/g,t=>pe[t]??t)}const ue=/^(https?:\/\/|mailto:)/i;function nt(n){if(typeof n!="string")return"";let t=zt(n);return t=t.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(e,i,o)=>ue.test(o)?`<a href="${o}" target="_blank" rel="noopener noreferrer">${i}</a>`:e),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*([^*]+)\*/g,"<em>$1</em>"),t=t.replace(/~~([^~]+)~~/g,"<s>$1</s>"),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\r?\n/g,"<br>"),t}function ft(n,t){return n&&typeof n=="object"&&"blocks"in n&&Array.isArray(n.blocks)?n.blocks.map(e=>{switch(e.type){case"text":return{type:"text",value:t(e.value)};case"list":return{...e,items:e.items.map(i=>t(i))};default:return e}}):[{type:"text",value:t(n)}]}function fe(n){return n.map(t=>{switch(t.type){case"text":return typeof t.value=="string"?t.value:"";case"list":return t.items.filter(e=>typeof e=="string").join(", ");case"code":return t.value;case"image":return t.alt;default:return""}}).filter(Boolean).join(" ")}function mt(n,t={}){const e=t.doc??document,i=e.createDocumentFragment();for(const o of n)switch(o.type){case"text":{const s=e.createElement("p");s.className="ot-content",s.innerHTML=nt(typeof o.value=="string"?o.value:""),i.appendChild(s);break}case"image":{const s=e.createElement("img");s.className="ot-media ot-media-image",s.src=o.src,s.alt=o.alt,s.loading="lazy",o.width&&(s.width=o.width),o.height&&(s.height=o.height),i.appendChild(s);break}case"video":{const s=e.createElement("video");s.className="ot-media ot-media-video",s.src=o.src,o.poster&&(s.poster=o.poster),s.controls=o.controls??!0,s.loop=o.loop??!1,s.muted=o.muted??o.autoplay??!1,s.playsInline=!0,o.autoplay&&(s.autoplay=!0,s.muted=!0),i.appendChild(s);break}case"list":{const s=e.createElement(o.ordered?"ol":"ul");s.className="ot-list";for(const r of o.items){const a=e.createElement("li");a.innerHTML=nt(typeof r=="string"?r:""),s.appendChild(a)}i.appendChild(s);break}case"code":{const s=e.createElement("pre");s.className="ot-code";const r=e.createElement("code");o.lang&&(r.dataset.lang=o.lang),r.textContent=o.value,s.appendChild(r),i.appendChild(s);break}case"divider":{const s=e.createElement("hr");s.className="ot-divider",i.appendChild(s);break}case"html":{const s=e.createElement("div");s.className="ot-html",s.innerHTML=t.allowHtml?o.value:zt(o.value),i.appendChild(s);break}}return i}const me=56,ge=44,be=700,ve=14,K=10;function ye(n){if(n==="auto"||n==="center")return{side:"auto",align:"center"};const[t,e]=n.split("-");return{side:t,align:e??"center"}}function xe(n){return{top:"bottom",bottom:"top",left:"right",right:"left"}[n]}function we(n){return n==="left"?"right":n==="right"?"left":n}class ke{constructor(t,e="ltr",i={}){f(this,"el");f(this,"titleEl");f(this,"contentEl");f(this,"progressEl");f(this,"liveEl");f(this,"backBtn");f(this,"nextBtn");f(this,"skipBtn");f(this,"arrow");f(this,"lastSide",null);f(this,"cbs");f(this,"dir");f(this,"model",null);f(this,"detachSwipe",null);this.cbs=t,this.dir=e,this.el=document.createElement("div"),this.el.className="ot-popover",this.el.setAttribute("role","dialog"),this.el.tabIndex=-1,this.arrow=document.createElement("div"),this.arrow.className="ot-arrow";const o=document.createElement("div");o.className="ot-body",this.skipBtn=document.createElement("button"),this.skipBtn.type="button",this.skipBtn.className="ot-skip",this.skipBtn.setAttribute("aria-label","Close tour"),this.skipBtn.innerHTML="&times;",this.skipBtn.addEventListener("click",()=>this.cbs.onSkip()),this.titleEl=document.createElement("h2"),this.titleEl.className="ot-title",this.titleEl.id=`ot-title-${Math.random().toString(36).slice(2,8)}`,this.el.setAttribute("aria-labelledby",this.titleEl.id),this.contentEl=document.createElement("div"),this.contentEl.className="ot-content-wrap",this.progressEl=document.createElement("div"),this.progressEl.className="ot-dots",this.progressEl.setAttribute("aria-hidden","true"),this.liveEl=document.createElement("span"),this.liveEl.className="ot-sr-only",this.liveEl.setAttribute("aria-live","polite"),this.liveEl.setAttribute("aria-atomic","true"),this.backBtn=document.createElement("button"),this.backBtn.type="button",this.backBtn.className="ot-btn ot-btn-ghost",this.backBtn.addEventListener("click",()=>this.cbs.onPrev()),this.nextBtn=document.createElement("button"),this.nextBtn.type="button",this.nextBtn.className="ot-btn ot-btn-primary",this.nextBtn.addEventListener("click",()=>this.cbs.onNext());const s=document.createElement("div");s.className="ot-footer";const r=document.createElement("div");r.className="ot-btns",r.appendChild(this.backBtn),r.appendChild(this.nextBtn),s.appendChild(this.progressEl),s.appendChild(r),o.appendChild(this.skipBtn),o.appendChild(this.titleEl),o.appendChild(this.contentEl),o.appendChild(this.liveEl),o.appendChild(s),this.el.appendChild(this.arrow),this.el.appendChild(o),i.swipe!==!1&&this.installSwipe()}installSwipe(){let t=0,e=0,i=0,o=!1;const s=a=>{if(a.touches.length!==1){o=!1;return}const c=a.target;if(c?.closest("button, a, input, textarea, select, video, audio, [data-ot-no-swipe]")){o=!1;return}if(c&&this.isScrollableX(c)){o=!1;return}o=!0,t=a.touches[0].clientX,e=a.touches[0].clientY,i=Date.now()},r=a=>{if(!o)return;o=!1;const c=a.changedTouches[0];if(!c)return;const l=c.clientX-t,p=c.clientY-e;if(Date.now()-i>be||Math.abs(p)>ge||Math.abs(l)<me)return;const d=this.dir==="rtl"?l>0:l<0,u=this.model;u&&(d?u.showNext&&this.cbs.onNext():u.showBack&&u.canGoBack&&u.index>0&&this.cbs.onPrev())};this.el.addEventListener("touchstart",s,{passive:!0}),this.el.addEventListener("touchend",r,{passive:!0}),this.detachSwipe=()=>{this.el.removeEventListener("touchstart",s),this.el.removeEventListener("touchend",r)}}isScrollableX(t){let e=t;for(;e&&e!==this.el;){if(e.scrollWidth>e.clientWidth+1)return!0;e=e.parentElement}return!1}setDir(t){this.dir=t}render(t){this.model=t,this.titleEl.textContent=t.title,this.contentEl.replaceChildren(mt(t.blocks,{allowHtml:t.allowHtml})),this.liveEl.textContent=`${t.title}. Step ${t.index+1} of ${t.total}`,this.progressEl.replaceChildren();for(let i=0;i<t.total;i+=1){const o=document.createElement("span");o.className=`ot-dot${i===t.index?" ot-dot-active":""}`,this.progressEl.appendChild(o)}const e=t.showBack&&t.canGoBack&&t.index>0;this.backBtn.style.display=e?"":"none",this.backBtn.textContent=t.labels.back,this.nextBtn.style.display=t.showNext?"":"none",this.nextBtn.textContent=t.isLast?t.labels.done:t.labels.next,this.skipBtn.style.display=t.skippable?"":"none",this.skipBtn.setAttribute("aria-label",t.labels.skip),this.el.setAttribute("aria-modal",t.modal?"true":"false"),this.el.classList.toggle("ot-popover--modal-step",t.modal)}position(t,e,i){const o=window.innerWidth,s=window.innerHeight,r=this.el.offsetWidth,a=this.el.offsetHeight;if(!t||e==="center"){this.lastSide="modal",this.el.classList.add("ot-modal"),this.arrow.style.display="none",this.el.style.left=`${Math.max(K,(o-r)/2)}px`,this.el.style.top=`${Math.max(K,(s-a)/2)}px`;return}this.el.classList.remove("ot-modal"),this.arrow.style.display="";const c=ye(e),l=this.dir==="rtl"?we(c.side):c.side,p=c.align,d=ve+i,u={top:t.y,bottom:s-(t.y+t.height),left:t.x,right:o-(t.x+t.width)};let x=l==="auto"?["bottom","right","top","left"].reduce((y,C)=>u[C]>u[y]?C:y,"bottom"):l;const k=m=>m==="top"||m==="bottom"?u[m]>=a+d:u[m]>=r+d;if(!k(x)){const m=xe(x);k(m)?x=m:x=Object.keys(u).reduce((y,C)=>u[y]>=u[C]?y:C)}let h=0,g=0;const b=(m,y,C)=>p==="start"?this.dir==="rtl"?m+y-C:m:p==="end"?this.dir==="rtl"?m:m+y-C:m+y/2-C/2;x==="top"||x==="bottom"?(h=b(t.x,t.width,r),g=x==="top"?t.y-a-d:t.y+t.height+d):(g=b(t.y,t.height,a),h=x==="left"?t.x-r-d:t.x+t.width+d),h=Math.min(Math.max(h,K),Math.max(K,o-r-K)),g=Math.min(Math.max(g,K),Math.max(K,s-a-K)),this.el.style.left=`${h}px`,this.el.style.top=`${g}px`,this.lastSide=x,this.positionArrow(x,t,h,g,r,a)}positionArrow(t,e,i,o,s,r){const a=this.arrow.style;a.top="",a.bottom="",a.left="",a.right="",this.arrow.dataset.side=t;const c=e.x+e.width/2,l=e.y+e.height/2;t==="top"?(a.bottom="-5px",a.left=`${Math.min(Math.max(c-i,16),Math.max(16,s-16))}px`):t==="bottom"?(a.top="-5px",a.left=`${Math.min(Math.max(c-i,16),Math.max(16,s-16))}px`):t==="left"?(a.right="-5px",a.top=`${Math.min(Math.max(l-o,16),Math.max(16,r-16))}px`):(a.left="-5px",a.top=`${Math.min(Math.max(l-o,16),Math.max(16,r-16))}px`)}getSide(){return this.lastSide}destroy(){this.detachSwipe?.(),this.detachSwipe=null,this.el.remove()}}class Ee{constructor(){f(this,"el");f(this,"beaconEl");f(this,"tooltipEl",null);f(this,"textEl",null);f(this,"dismissBtn",null);f(this,"lastRect",null);f(this,"hasTooltip",!1);f(this,"onDismiss",null);this.el=document.createElement("div"),this.el.className="ot-hotspot",this.beaconEl=document.createElement("button"),this.beaconEl.type="button",this.beaconEl.className="ot-beacon",this.beaconEl.addEventListener("click",()=>this.onDismiss?.()),this.el.appendChild(this.beaconEl)}render(t,e){this.lastRect=e,this.onDismiss=t.onDismiss??null,this.beaconEl.className=`ot-beacon ot-beacon--${t.display}`,this.el.style.left=`${e.x+e.width/2}px`,this.el.style.top=`${e.y+e.height/2}px`,this.el.style.pointerEvents="auto";const i=t.content?.trim()||"Show me";this.beaconEl.setAttribute("aria-label",i),t.display==="beacon"?(this.hasTooltip=!1,this.tooltipEl&&(this.tooltipEl.style.display="none"),this.beaconEl.title=t.content??""):(this.hasTooltip=!0,this.buildTooltip(t),this.positionTooltip(e))}buildTooltip(t){this.tooltipEl||(this.tooltipEl=document.createElement("div"),this.tooltipEl.className="ot-hotspot-tooltip",this.tooltipEl.setAttribute("role","status"),this.textEl=document.createElement("span"),this.textEl.className="ot-hotspot-text",this.tooltipEl.appendChild(this.textEl),this.el.appendChild(this.tooltipEl)),this.tooltipEl.style.display="flex",this.textEl&&(this.textEl.innerHTML=nt(t.content??"")),t.showDismiss||t.display==="hotspot"?(this.dismissBtn||(this.dismissBtn=document.createElement("button"),this.dismissBtn.type="button",this.dismissBtn.className="ot-hotspot-dismiss",this.dismissBtn.textContent="→",this.dismissBtn.setAttribute("aria-label","Next step"),this.dismissBtn.addEventListener("click",()=>this.onDismiss?.())),this.tooltipEl.appendChild(this.dismissBtn)):this.dismissBtn?.parentNode&&this.dismissBtn.remove()}positionTooltip(t){if(!this.tooltipEl)return;const e=window.innerWidth,i=this.tooltipEl.offsetWidth||200,o=t.x+t.width/2,s=e-(o+16),r=o-16;s>i?(this.tooltipEl.style.left="12px",this.tooltipEl.style.right="auto"):r>i?(this.tooltipEl.style.right="12px",this.tooltipEl.style.left="auto"):(this.tooltipEl.style.left=`${Math.max(8,-(o-8))}px`,this.tooltipEl.style.right="auto"),this.tooltipEl.style.top="16px"}reposition(t){this.lastRect&&(this.lastRect=t,this.el.style.left=`${t.x+t.width/2}px`,this.el.style.top=`${t.y+t.height/2}px`,this.hasTooltip&&this.positionTooltip(t))}focus(){this.beaconEl.focus({preventScroll:!0})}destroy(){this.onDismiss=null,this.el.remove()}}const Se='button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';function Ce(n){if(!n)return!1;if(n.isContentEditable)return!0;const t=n.tagName;if(t==="TEXTAREA"||t==="SELECT")return!0;if(t!=="INPUT")return!1;const e=n.type;return!["button","submit","reset","checkbox","radio","file"].includes(e)}function Ae(n,t={}){const e=document.activeElement,i=t.trap!==!1,o=()=>Array.from(n.querySelectorAll(Se)).filter(r=>r.getClientRects().length>0||r===document.activeElement),s=r=>{const a=n.getRootNode().activeElement??document.activeElement;if(r.key==="Escape"){t.onEscape?.(),r.stopPropagation();return}if(Ce(a))return;if(r.key==="ArrowRight"){t.onArrowNext?.(),r.preventDefault();return}if(r.key==="ArrowLeft"){t.onArrowPrev?.(),r.preventDefault();return}if(r.key==="Enter"&&a===n){t.onArrowNext?.(),r.preventDefault();return}if(r.key!=="Tab"||!i)return;const c=o();if(!c.length){r.preventDefault();return}const l=c[0],p=c[c.length-1];r.shiftKey&&(a===l||!n.contains(a))?(p.focus(),r.preventDefault()):!r.shiftKey&&a===p&&(l.focus(),r.preventDefault())};return n.addEventListener("keydown",s),t.autoFocus!==!1&&n.focus({preventScroll:!0}),()=>{n.removeEventListener("keydown",s);const r=document.activeElement;(!r||r===document.body||n.contains(r))&&e?.focus?.({preventScroll:!0})}}const $e="button, a, [role], label, summary, h1, h2, h3, h4, h5, h6, p, li, td, th, span, div";function Ie(n,t=document){try{return t.querySelector(n)}catch{return null}}function rt(n,t=document){try{return Array.from(t.querySelectorAll(n))}catch{return[]}}function Te(n,t=document){const e=rt(n,t),i=new Set,o=s=>{for(const r of rt("*",s)){const a=r.shadowRoot;!a||i.has(a)||(i.add(a),e.push(...rt(n,a)),o(a))}};return o(t),[...new Set(e)]}function gt(n){const t=n.getBoundingClientRect();if(t.width===0&&t.height===0)return!1;const e=n.ownerDocument?.defaultView;if(!e)return!0;const i=e.getComputedStyle(n);return i.visibility!=="hidden"&&i.display!=="none"&&i.opacity!=="0"}function bt(n){return n.replace(/\s+/g," ").trim().toLowerCase()}function Rt(n,t,e){const i=bt(n);if(!i)return null;const s=(t??rt($e,e)).filter(c=>bt(c.textContent??"").includes(i));if(s.length===0)return null;const r=s.filter(c=>bt(c.textContent??"")===i);return(r.length?r:s).reduce((c,l)=>c.contains(l)?l:c)}function Pt(n){if(!n.iframe)return{doc:document,offset:{x:0,y:0}};const t=Ie(n.iframe);if(!t)return null;try{const e=t.contentDocument;if(!e)return null;const i=t.getBoundingClientRect();return{doc:e,offset:{x:i.x,y:i.y}}}catch{return null}}function U(n){const t=Pt(n);if(!t)return null;const{doc:e,offset:i}=t,o=n.selector?Array.isArray(n.selector)?n.selector:[n.selector]:[],s=r=>{const a=n.visible?r.filter(gt):r;return a.length===0?null:a[n.index??0]??null};for(const r of o){const a=n.shadow?Te(r,e):rt(r,e);if(n.text){const l=Rt(n.text,n.visible?a.filter(gt):a,e);if(l)return{element:l,doc:e,frameOffset:i,matched:r};continue}const c=s(a);if(c)return{element:c,doc:e,frameOffset:i,matched:r}}if(o.length===0&&n.text){const r=Rt(n.text,null,e);if(r&&(!n.visible||gt(r)))return{element:r,doc:e,frameOffset:i,matched:`text:${n.text}`}}return null}function Mt(n){const t=[];return n.selector&&t.push(Array.isArray(n.selector)?n.selector.join(" | "):n.selector),n.text&&t.push(`text "${n.text}"`),n.iframe&&t.push(`in iframe ${n.iframe}`),t.join(" + ")||"(no selector)"}function dt(n,t=5e3){return new Promise(e=>{const i=U(n);if(i){e(i);return}let o=!1,s=null;const r=p=>{o||(o=!0,s?.disconnect(),clearInterval(c),clearTimeout(l),e(p))},a=()=>{const p=U(n);p&&r(p)};try{s=new MutationObserver(a);const p=n.iframe?Pt(n)?.doc.documentElement??document.documentElement:document.documentElement;s.observe(p,{childList:!0,subtree:!0,attributes:!0})}catch{}const c=setInterval(a,100),l=setTimeout(()=>r(null),t)})}const vt="opentutorial:locationchange";let Bt=!1;function Oe(){if(Bt||typeof history>"u")return;Bt=!0;const n=()=>{try{window.dispatchEvent(new Event(vt))}catch{}};for(const t of["pushState","replaceState"]){const e=history[t];typeof e=="function"&&(history[t]=function(...o){const s=e.apply(this,o);return n(),s})}}function qt(){return typeof location>"u"?"":location.pathname+location.search+location.hash}function Dt(n,t,e=!1){if(!n)return!1;const i=t.split("#")[0];if(n.endsWith("*"))return i.startsWith(n.slice(0,-1));if(n.includes(":")){const s=n.split("/").map(r=>r.startsWith(":")?"[^/]+":r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("/");try{return new RegExp(`^${s}${e?"$":"(/|$|\\?)"}`).test(i)}catch{return!1}}const o=i.split("?")[0];return e?o===n:o.startsWith(n)}function jt(n){return typeof window>"u"?()=>{}:(Oe(),window.addEventListener("popstate",n),window.addEventListener("hashchange",n),window.addEventListener(vt,n),()=>{window.removeEventListener("popstate",n),window.removeEventListener("hashchange",n),window.removeEventListener(vt,n)})}class yt{constructor(){f(this,"map",new Map)}getItem(t){return this.map.get(t)??null}setItem(t,e){this.map.set(t,e)}removeItem(t){this.map.delete(t)}}function _t(){try{if(typeof localStorage<"u"){const n="__ot_probe__";return localStorage.setItem(n,"1"),localStorage.removeItem(n),localStorage}}catch{}return new yt}function xt(){return{v:2,tours:{},progress:{}}}class wt{constructor(t,e="ot",i){f(this,"ready");f(this,"storage");f(this,"prefix");f(this,"userId");f(this,"root",xt());f(this,"hydrated",!1);this.storage=t??_t(),this.prefix=e,this.userId=i,this.ready=this.hydrate()}key(){return this.userId?`${this.prefix}:u:${this.userId}`:`${this.prefix}:anon`}legacyKey(){return`${this.prefix}:tours`}setUser(t){return t===this.userId?this.ready:(this.userId=t,this.root=xt(),this.hydrated=!1,this.hydrate())}getUser(){return this.userId}parse(t){if(typeof t!="string"||!t)return null;try{const e=JSON.parse(t);if(!e||typeof e!="object")return null;if(e.v===2)return{v:2,tours:e.tours??{},progress:e.progress??{},active:e.active};if(e.v===1)return{v:2,tours:e.tours??{},progress:{}}}catch{}return null}async hydrate(){try{const t=await Promise.resolve(this.storage.getItem(this.key())),e=this.parse(t);if(e){this.root=e,this.hydrated=!0;return}if(!this.userId){const i=this.parse(await Promise.resolve(this.storage.getItem(this.legacyKey())));if(i){this.root=i,this.hydrated=!0,this.save();try{this.storage.removeItem(this.legacyKey())}catch{}return}}}catch{}this.hydrated=!0}isHydrated(){return this.hydrated}save(){try{this.storage.setItem(this.key(),JSON.stringify(this.root))}catch{}}mark(t,e,i){const o=this.root.tours[t];this.root.tours[t]={status:e,version:i,at:Date.now(),shownCount:o?.shownCount??0,lastShownAt:o?.lastShownAt},delete this.root.progress[t],this.root.active?.tourId===t&&delete this.root.active,this.save()}markShown(t,e){const i=this.root.tours[t];this.root.tours[t]={status:i?.status??"skipped",version:i?.version??e,at:i?.at??0,shownCount:(i?.shownCount??0)+1,lastShownAt:Date.now()},this.save()}hasSeen(t,e){const i=this.root.tours[t];return!(!i||!i.at||e&&i.version!==e)}getStatus(t){const e=this.root.tours[t];return!e||!e.at?null:e.status}getRecord(t){return this.root.tours[t]??null}reset(t){if(!t){this.root=xt(),this.save();return}delete this.root.tours[t],delete this.root.progress[t],this.save()}clearAllProgress(){this.root.progress={},this.save()}saveProgress(t,e,i){this.root.progress[t]={tourId:t,lastStepId:e,stepIndex:i,timestamp:Date.now()},this.save()}getProgress(t){return this.root.progress[t]??null}getProgressIfValid(t,e){const i=this.getProgress(t);return i?Date.now()-i.timestamp>e?(this.clearProgress(t),null):i:null}clearProgress(t){t in this.root.progress&&(delete this.root.progress[t],this.save())}setActive(t,e){this.root.active={tourId:t,stepId:e,at:Date.now()},this.save()}getActive(t=300*1e3){const e=this.root.active;return e?Date.now()-e.at>t?(this.clearActive(),null):e:null}clearActive(){this.root.active&&(delete this.root.active,this.save())}exportAll(){return JSON.parse(JSON.stringify(this.root))}importAll(t,e="replace"){const i=this.parse(typeof t=="string"?t:JSON.stringify(t));if(!i)return!1;if(e==="replace")this.root=i;else{for(const[o,s]of Object.entries(i.tours)){const r=this.root.tours[o];(!r||s.at>r.at)&&(this.root.tours[o]=s)}for(const[o,s]of Object.entries(i.progress)){const r=this.root.progress[o];(!r||s.timestamp>r.timestamp)&&(this.root.progress[o]=s)}}return this.save(),!0}}const Le=500,Ne=new Set(["__proto__","constructor","prototype"]),Ht={includes:(n,t)=>typeof n=="string"?n.includes(String(t[0])):Array.isArray(n)?n.includes(t[0]):!1,startsWith:(n,t)=>typeof n=="string"?n.startsWith(String(t[0])):!1,endsWith:(n,t)=>typeof n=="string"?n.endsWith(String(t[0])):!1,toLowerCase:n=>typeof n=="string"?n.toLowerCase():n,toUpperCase:n=>typeof n=="string"?n.toUpperCase():n,trim:n=>typeof n=="string"?n.trim():n,indexOf:(n,t)=>typeof n=="string"?n.indexOf(String(t[0])):Array.isArray(n)?n.indexOf(t[0]):-1,matches:(n,t)=>{if(typeof n!="string")return!1;try{return new RegExp(String(t[0])).test(n)}catch{return!1}}},ze=["===","!==","==","!=","<=",">=","&&","||","<",">","!","(",")","[","]",",","+","-","*","/","%","?",":"];function Ft(n){const t=[];let e=0;for(;e<n.length;){const i=n.slice(e);if(/^\s/.test(i)){e+=1;continue}const o=ze.find(r=>i.startsWith(r));if(o){t.push({t:"op",v:o}),e+=o.length;continue}if(i[0]==="."){t.push({t:"dot"}),e+=1;continue}let s=i.match(/^'((?:[^'\\]|\\.)*)'/)??i.match(/^"((?:[^"\\]|\\.)*)"/);if(s){t.push({t:"str",v:s[1].replace(/\\(.)/g,"$1")}),e+=s[0].length;continue}if(s=i.match(/^\d+(\.\d+)?/),s){t.push({t:"num",v:Number(s[0])}),e+=s[0].length;continue}if(s=i.match(/^(true|false)\b/),s){t.push({t:"bool",v:s[1]==="true"}),e+=s[0].length;continue}if(s=i.match(/^null\b/),s){t.push({t:"null"}),e+=s[0].length;continue}if(s=i.match(/^undefined\b/),s){t.push({t:"undef"}),e+=s[0].length;continue}if(s=i.match(/^[A-Za-z_$][\w$]*/),s){t.push({t:"ident",v:s[0]}),e+=s[0].length;continue}throw new Error(`Unexpected character "${i[0]}" at ${e}`)}return t}function kt(n,t){if(n!=null&&!(typeof t=="string"&&Ne.has(t))){if(typeof n=="string")return t==="length"?n.length:typeof t=="number"?n[t]:void 0;if(Array.isArray(n))return t==="length"?n.length:n[t];if(typeof n=="object")return n[String(t)]}}function Ut(n,t){return n===t?!0:n==null?t==null:typeof n=="number"||typeof t=="number"?Number(n)===Number(t):String(n)===String(t)}function B(n){return typeof n=="number"?n:Number(n)}class Wt{constructor(t,e){f(this,"pos",0);f(this,"tokens");f(this,"ctx");this.tokens=t,this.ctx=e}parse(){const t=this.ternary();if(this.pos!==this.tokens.length)throw new Error("Trailing tokens");return t}peek(){return this.tokens[this.pos]}isOp(t){const e=this.peek();return!!e&&e.t==="op"&&e.v===t}eatOp(t){return this.isOp(t)?(this.pos+=1,!0):!1}expectOp(t){if(!this.eatOp(t))throw new Error(`Expected "${t}"`)}ternary(){const t=this.orExpr();if(!this.eatOp("?"))return t;const e=this.ternary();this.expectOp(":");const i=this.ternary();return t?e:i}orExpr(){let t=this.andExpr();for(;this.eatOp("||");){const e=this.andExpr();t=t||e}return t}andExpr(){let t=this.equality();for(;this.eatOp("&&");){const e=this.equality();t=t&&e}return t}equality(){let t=this.relational();for(;;){if(this.eatOp("===")){t=t===this.relational();continue}if(this.eatOp("!==")){t=t!==this.relational();continue}if(this.eatOp("==")){t=Ut(t,this.relational());continue}if(this.eatOp("!=")){t=!Ut(t,this.relational());continue}return t}}relational(){let t=this.additive();for(;;){if(this.eatOp("<=")){t=B(t)<=B(this.additive());continue}if(this.eatOp(">=")){t=B(t)>=B(this.additive());continue}if(this.eatOp("<")){t=B(t)<B(this.additive());continue}if(this.eatOp(">")){t=B(t)>B(this.additive());continue}return t}}additive(){let t=this.multiplicative();for(;;){if(this.eatOp("+")){const e=this.multiplicative();t=typeof t=="string"||typeof e=="string"?String(t)+String(e):B(t)+B(e);continue}if(this.eatOp("-")){t=B(t)-B(this.multiplicative());continue}return t}}multiplicative(){let t=this.unary();for(;;){if(this.eatOp("*")){t=B(t)*B(this.unary());continue}if(this.eatOp("/")){t=B(t)/B(this.unary());continue}if(this.eatOp("%")){t=B(t)%B(this.unary());continue}return t}}unary(){return this.eatOp("!")?!this.unary():this.eatOp("-")?-B(this.unary()):this.postfix()}postfix(){let t=this.primary();for(;;){if(this.peek()?.t==="dot"){this.pos+=1;const e=this.peek();if(!e||e.t!=="ident")throw new Error('Expected identifier after "."');if(this.pos+=1,this.isOp("(")){this.pos+=1;const i=[];if(!this.isOp(")"))do i.push(this.ternary());while(this.eatOp(","));this.expectOp(")");const o=Object.prototype.hasOwnProperty.call(Ht,e.v)?Ht[e.v]:void 0;if(typeof o!="function")throw new Error(`Method "${e.v}" is not allowed`);t=o(t,i);continue}t=kt(t,e.v);continue}if(this.eatOp("[")){const e=this.ternary();this.expectOp("]"),t=kt(t,typeof e=="number"?e:String(e));continue}return t}}primary(){const t=this.peek();if(!t)throw new Error("Unexpected end of expression");if(t.t==="op"&&t.v==="("){this.pos+=1;const e=this.ternary();return this.expectOp(")"),e}if(t.t==="op"&&t.v==="["){this.pos+=1;const e=[];if(!this.isOp("]"))do e.push(this.ternary());while(this.eatOp(","));return this.expectOp("]"),e}switch(this.pos+=1,t.t){case"str":return t.v;case"num":return t.v;case"bool":return t.v;case"null":return null;case"undef":return;case"ident":return kt(this.ctx,t.v);default:throw new Error("Unexpected token")}}}function Et(n,t,e={}){try{if(typeof n!="string")return;if(n.length>(e.maxLength??Le)){e.onError?.("expression exceeds the maximum length",n);return}return new Wt(Ft(n),t).parse()}catch(i){e.onError?.(i instanceof Error?i.message:"invalid expression",n);return}}function at(n,t,e={}){return!!Et(n,t,e)}function Re(n){try{return new Wt(Ft(n),{}).parse(),{ok:!0}}catch(t){return{ok:!1,message:t instanceof Error?t.message:"invalid expression"}}}const Vt=new Set(["auto","center","top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"]),Gt=new Set(["spotlight","hotspot","beacon","modal","banner"]),Kt=new Set(["button","target-click","event","auto","input-match","form-submit","element-appears","element-disappears","url-match"]),Jt=new Set(["manual","auto","event","route","element","idle","scroll"]),Pe=new Set(["emit","click","focus","navigate","setContext","scrollTo","wait"]),Me=new Set(["text","image","video","list","code","divider","html"]),Yt=new Set(["free","target-only","blocked"]),Be=new Set(["specVersion","id","title","description","version","priority","trigger","audience","frequency","onComplete","theme","interaction","steps"]),qe=new Set(["id","target","placement","display","title","content","buttons","advanceOn","event","duration","match","watch","urlPattern","interaction","skippable","canGoBack","next","showIf","theme","onEnter","onExit"]),De=new Set(["selector","text","index","shadow","iframe","waitFor","timeout","visible","scrollIntoView","scrollBehavior","padding"]),je=new Set(["accent","bg","fg","muted","border","success","danger","backdrop","radius","shadow","font","fontSize","spacing","arrowSize","overlayBlur","animationMs","z","spotlightRing","popoverWidth"]),_e=/^[a-z0-9]+(-[a-z0-9]+)*$/,W={title:60,stepTitle:80,description:200,content:320,steps:24},Xt={steps:200};function M(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}class He{constructor(){f(this,"errors",[]);f(this,"warnings",[])}error(t,e){this.errors.push({path:t,message:e,severity:"error"})}warn(t,e){this.warnings.push({path:t,message:e,severity:"warning"})}}function Qt(n,t,e){if(n!==void 0){if(!M(n)){e.error(t,"theme must be an object");return}for(const i of Object.keys(n))je.has(i)||e.warn(`${t}.${i}`,`unknown theme token "${i}" (ignored)`)}}function St(n,t,e){if(n===void 0)return;if(typeof n!="string"){e.error(t,"must be a string expression");return}if(n.length>500){e.error(t,`expression must be ≤ 500 chars (got ${n.length})`);return}const i=Re(n);i.ok||e.error(t,`invalid expression: ${i.message}`)}function Zt(n,t,e){if(n!==void 0){if(!Array.isArray(n)){e.error(t,"must be an array of actions");return}n.forEach((i,o)=>{const s=`${t}[${o}]`;if(!M(i)){e.error(s,"action must be an object");return}if(!Pe.has(i.type)){e.error(`${s}.type`,`unknown action type "${String(i.type)}"`);return}i.type==="emit"&&typeof i.name!="string"&&e.error(`${s}.name`,'emit action requires a string "name"'),i.type==="navigate"&&(typeof i.path!="string"||!i.path.startsWith("/"))&&e.error(`${s}.path`,'navigate requires a same-origin "path" starting with /'),i.type==="setContext"&&typeof i.key!="string"&&e.error(`${s}.key`,'setContext requires a string "key"'),i.type==="scrollTo"&&typeof i.selector!="string"&&e.error(`${s}.selector`,'scrollTo requires a string "selector"'),i.type==="wait"&&typeof i.ms!="number"&&e.error(`${s}.ms`,'wait requires a numeric "ms"')})}}function ht(n,t,e){if(typeof n=="string")return n.length;if(M(n)&&typeof n.key=="string")return n.key.length;if(M(n)&&Array.isArray(n.blocks)){if(n.blocks.length===0){e.error(t,"blocks must not be empty");return}let i=0;return n.blocks.forEach((o,s)=>{const r=`${t}.blocks[${s}]`;if(!M(o)){e.error(r,"block must be an object");return}if(!Me.has(o.type)){e.error(`${r}.type`,`unknown block type "${String(o.type)}"`);return}switch(o.type){case"text":typeof o.value=="string"?i+=o.value.length:(!M(o.value)||typeof o.value.key!="string")&&e.error(`${r}.value`,"text block requires a string or i18n object");break;case"image":typeof o.src!="string"&&e.error(`${r}.src`,'image block requires "src"'),typeof o.alt!="string"&&e.error(`${r}.alt`,'image block requires "alt" for accessibility');break;case"video":typeof o.src!="string"&&e.error(`${r}.src`,'video block requires "src"');break;case"list":(!Array.isArray(o.items)||o.items.length===0)&&e.error(`${r}.items`,'list block requires a non-empty "items" array');break;case"code":typeof o.value!="string"&&e.error(`${r}.value`,'code block requires a string "value"');break;case"html":typeof o.value!="string"?e.error(`${r}.value`,'html block requires a string "value"'):e.warn(r,"html blocks render only when the host sets allowHtml: true");break}}),i}}function Fe(n,t){if(n===void 0)return;if(!M(n)){t.error("$.trigger","must be an object");return}const e=n.type;if(!Jt.has(e)){t.error("$.trigger.type",`must be one of: ${[...Jt].join(" | ")}`);return}if(n.delay!==void 0&&(typeof n.delay!="number"||n.delay<0)&&t.error("$.trigger.delay","must be a non-negative number (ms)"),e==="event"&&typeof n.event!="string"&&t.error("$.trigger.event",'required when trigger.type === "event"'),e==="route"&&typeof n.path!="string"&&t.error("$.trigger.path",'required when trigger.type === "route"'),e==="element"&&typeof n.selector!="string"&&t.error("$.trigger.selector",'required when trigger.type === "element"'),e==="idle"&&(typeof n.ms!="number"||n.ms<=0)&&t.error("$.trigger.ms",'required positive number (ms) when trigger.type === "idle"'),e==="scroll"){const i=n.percent;(typeof i!="number"||i<0||i>100)&&t.error("$.trigger.percent","must be a number between 0 and 100")}}function Ue(n,t,e){if(n===void 0)return;if(!M(n)){e.error(`${t}.target`,"must be an object");return}for(const r of Object.keys(n))De.has(r)||e.warn(`${t}.target.${r}`,`unknown target key "${r}" (ignored)`);const{selector:i,text:o}=n,s=typeof i=="string"&&i.trim().length>0||Array.isArray(i)&&i.length>0&&i.every(r=>typeof r=="string"&&r.trim());i!==void 0&&!s&&e.error(`${t}.target.selector`,"must be a non-empty CSS selector or array of selectors"),!s&&typeof o!="string"&&e.error(`${t}.target`,'requires "selector", "text", or both'),n.timeout!==void 0&&(typeof n.timeout!="number"||n.timeout<0)&&e.error(`${t}.target.timeout`,"must be a non-negative number (ms)"),n.padding!==void 0&&(typeof n.padding!="number"||n.padding<0)&&e.error(`${t}.target.padding`,"must be a non-negative number (px)"),n.index!==void 0&&(typeof n.index!="number"||n.index<0)&&e.error(`${t}.target.index`,"must be a non-negative integer"),n.iframe!==void 0&&typeof n.iframe!="string"&&e.error(`${t}.target.iframe`,"must be a CSS selector string"),n.scrollBehavior!==void 0&&!["auto","smooth"].includes(n.scrollBehavior)&&e.error(`${t}.target.scrollBehavior`,'must be "auto" or "smooth"')}function pt(n){const t=new He;if(!M(n))return{ok:!1,errors:[{path:"$",message:"spec must be a JSON object",severity:"error"}],warnings:[]};for(const o of Object.keys(n))Be.has(o)||t.warn(`$.${o}`,`unknown top-level key "${o}" (ignored)`);n.specVersion!==1&&t.error("$.specVersion","must be the integer 1"),typeof n.id!="string"||!n.id?t.error("$.id","required, non-empty string"):_e.test(n.id)||t.error("$.id",'must be kebab-case (e.g. "dashboard-intro")');const e=ht(n.title,"$.title",t);if(e===void 0?t.error("$.title","required (string or i18n object with key)"):e===0?t.error("$.title","must not be empty"):e>W.title&&t.warn("$.title",`longer than ${W.title} chars (got ${e})`),n.description!==void 0){const o=ht(n.description,"$.description",t);o===void 0?t.error("$.description","must be a string or i18n object"):o>W.description&&t.warn("$.description",`longer than ${W.description} chars (got ${o})`)}if(n.version!==void 0&&typeof n.version!="string"&&t.error("$.version",'must be a string (e.g. "1.0.0")'),n.priority!==void 0&&typeof n.priority!="number"&&t.error("$.priority","must be a number"),n.interaction!==void 0&&!Yt.has(n.interaction)&&t.error("$.interaction",'must be "free" | "target-only" | "blocked"'),Fe(n.trigger,t),n.audience!==void 0&&(M(n.audience)?St(n.audience.showIf,"$.audience.showIf",t):t.error("$.audience","must be an object")),n.frequency!==void 0)if(!M(n.frequency))t.error("$.frequency","must be an object");else for(const o of["max","cooldown","perSession"]){const s=n.frequency[o];s!==void 0&&(typeof s!="number"||s<0)&&t.error(`$.frequency.${o}`,"must be a non-negative number")}if(n.onComplete!==void 0)if(!M(n.onComplete))t.error("$.onComplete","must be an object");else{const{startTour:o,emit:s,navigate:r}=n.onComplete;o!==void 0&&typeof o!="string"&&t.error("$.onComplete.startTour","must be a tour id string"),s!==void 0&&typeof s!="string"&&t.error("$.onComplete.emit","must be an event name string"),r!==void 0&&(typeof r!="string"||!r.startsWith("/"))&&t.error("$.onComplete.navigate","must be a same-origin path starting with /")}if(Qt(n.theme,"$.theme",t),!Array.isArray(n.steps))return t.error("$.steps","required, must be an array"),{ok:!1,errors:t.errors,warnings:t.warnings};n.steps.length<1&&t.error("$.steps","must contain at least 1 step"),n.steps.length>Xt.steps?t.error("$.steps",`must contain ≤ ${Xt.steps} steps (got ${n.steps.length})`):n.steps.length>W.steps&&t.warn("$.steps",`${n.steps.length} steps is a lot; consider splitting into several tours`);const i=new Set;return n.steps.forEach((o,s)=>{const r=`$.steps[${s}]`;if(!M(o)){t.error(r,"step must be an object");return}for(const d of Object.keys(o))qe.has(d)||t.warn(`${r}.${d}`,`unknown step key "${d}" (ignored)`);typeof o.id!="string"||!o.id?t.error(`${r}.id`,"required"):i.has(o.id)?t.error(`${r}.id`,`duplicate step id "${o.id}"`):i.add(o.id);const a=o.display;a!==void 0&&!Gt.has(a)&&t.error(`${r}.display`,`must be one of: ${[...Gt].join(" | ")}`),Ue(o.target,r,t),o.placement!==void 0&&!Vt.has(o.placement)&&t.error(`${r}.placement`,`must be one of: ${[...Vt].join(" | ")}`),o.interaction!==void 0&&!Yt.has(o.interaction)&&t.error(`${r}.interaction`,'must be "free" | "target-only" | "blocked"');const c=ht(o.title,`${r}.title`,t);c===void 0?t.error(`${r}.title`,"required (string or i18n object with key)"):c===0?t.error(`${r}.title`,"must not be empty"):c>W.stepTitle&&t.warn(`${r}.title`,`longer than ${W.stepTitle} chars (got ${c})`);const l=ht(o.content,`${r}.content`,t);if(l===void 0?t.error(`${r}.content`,"required (string, i18n object, or { blocks: [...] })"):l>W.content&&t.warn(`${r}.content`,`longer than ${W.content} chars (got ${l}); long copy hurts completion`),o.buttons!==void 0)if(!M(o.buttons))t.error(`${r}.buttons`,"must be an object");else for(const d of Object.keys(o.buttons))["next","back","skip","done"].includes(d)||t.warn(`${r}.buttons.${d}`,`unknown button "${d}" (ignored)`);const p=o.advanceOn??"button";Kt.has(p)||t.error(`${r}.advanceOn`,`must be one of: ${[...Kt].join(" | ")}`),p==="event"&&typeof o.event!="string"&&t.error(`${r}.event`,'required when advanceOn === "event"'),p==="auto"&&(typeof o.duration!="number"||o.duration<=0)&&t.error(`${r}.duration`,'required positive number (ms) when advanceOn === "auto"'),p==="target-click"&&o.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "target-click"'),p==="input-match"&&(o.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "input-match"'),typeof o.match!="string"&&t.error(`${r}.match`,'required when advanceOn === "input-match"')),p==="form-submit"&&o.target===void 0&&t.error(`${r}.target`,'required when advanceOn === "form-submit"'),(p==="element-appears"||p==="element-disappears")&&typeof o.watch!="string"&&t.error(`${r}.watch`,`required when advanceOn === "${p}"`),p==="url-match"&&typeof o.urlPattern!="string"&&t.error(`${r}.urlPattern`,'required when advanceOn === "url-match"'),a==="beacon"&&o.duration!==void 0&&typeof o.duration!="number"&&t.error(`${r}.duration`,"must be a number (ms)"),o.next!==void 0&&(typeof o.next=="string"||(Array.isArray(o.next)?(o.next.length===0&&t.warn(`${r}.next`,"empty branch list falls through to the next step"),o.next.forEach((d,u)=>{const E=`${r}.next[${u}]`;if(!M(d)){t.error(E,"branch must be an object { if, to }");return}St(d.if,`${E}.if`,t),typeof d.to!="string"&&t.error(`${E}.to`,"must be a step id string")})):t.error(`${r}.next`,"must be a step id string or an array of { if, to } branches"))),St(o.showIf,`${r}.showIf`,t),Qt(o.theme,`${r}.theme`,t),Zt(o.onEnter,`${r}.onEnter`,t),Zt(o.onExit,`${r}.onExit`,t)}),n.steps.forEach((o,s)=>{if(!M(o))return;const r=`$.steps[${s}].next`;typeof o.next=="string"&&!i.has(o.next)?t.error(r,`points to unknown step id "${o.next}"`):Array.isArray(o.next)&&o.next.forEach((a,c)=>{M(a)&&typeof a.to=="string"&&!i.has(a.to)&&t.error(`${r}[${c}].to`,`points to unknown step id "${a.to}"`)})}),t.errors.length?{ok:!1,errors:t.errors,warnings:t.warnings}:{ok:!0,errors:[],warnings:t.warnings}}function We(n){const t=pt(n);if(!t.ok){const e=t.errors.map(i=>`  • ${i.path}: ${i.message}`).join(`
`);throw new Error(`[opentutorial] Invalid TutorialSpec:
${e}`)}return n}function Ve(n){const t=[],e=new Set;return n.forEach((i,o)=>{const s=M(i)&&typeof i.id=="string"?i.id:void 0,r=pt(i);for(const a of[...r.errors,...r.warnings])t.push({...a,path:`[${o}]${a.path.slice(1)}`,specId:s});s&&(e.has(s)&&t.push({path:`[${o}].id`,message:`duplicate tour id "${s}"`,severity:"error",specId:s}),e.add(s))}),n.forEach((i,o)=>{if(!M(i)||!M(i.onComplete))return;const s=i.onComplete.startTour;typeof s=="string"&&!e.has(s)&&t.push({path:`[${o}].onComplete.startTour`,message:`chains to unknown tour "${s}"`,severity:"warning",specId:typeof i.id=="string"?i.id:void 0})}),{ok:!t.some(i=>i.severity==="error"),issues:t}}const Ge=["zero","one","two","few","many","other"];function te(n,t){return t.split(".").reduce((e,i)=>e&&typeof e=="object"?e[i]:void 0,n)}function Ke(n,t,e="en"){let i;try{i=new Intl.PluralRules(e).select(n)}catch{i=n===1?"one":"other"}return t[i]??t.other??""}function Je(n){const t={},e=/(\w+)\s*\{([^{}]*)\}/g;let i;for(;(i=e.exec(n))!==null;){const o=i[1];Ge.includes(o)&&(t[o]=i[2])}return t}function Ye(n,t){let e=0;for(let i=t;i<n.length;i+=1){const o=n[i];if(o==="{")e+=1;else if(o==="}"){if(e===0&&n[i+1]==="}")return i;e>0&&(e-=1)}}return-1}function ee(n,t){try{return new Intl.NumberFormat(t).format(n)}catch{return String(n)}}function Ct(n,t,e="en"){if(!n.includes("{{"))return n;let i="",o=0;for(;o<n.length;){const s=n.indexOf("{{",o);if(s===-1){i+=n.slice(o);break}const r=Ye(n,s+2);if(r===-1){i+=n.slice(o);break}i+=n.slice(o,s);const a=n.slice(s+2,r).trim();i+=Xe(a,t,e),o=r+2}return i}function Xe(n,t,e){const i=`{{${n}}}`,o=n.indexOf(",");if(o!==-1){const r=n.slice(0,o).trim(),a=n.slice(o+1).trim();if(!a.startsWith("plural"))return i;const c=t?te(t,r):void 0,l=typeof c=="number"?c:Number(c);if(!Number.isFinite(l))return i;const p=Je(a.slice(6).replace(/^\s*,\s*/,""));return Ke(l,p,e).replace(/#/g,ee(l,e))}if(!/^[\w.$]+$/.test(n))return i;const s=t?te(t,n):void 0;return s==null?i:typeof s=="number"?ee(s,e):String(s)}function ct(n,t,e,i){if(typeof n=="string")return Ct(n,i,t);if(n&&typeof n.key=="string"){const o=e?.(n.key,t);return Ct(o!==void 0?o:n.fallback??n.key,i,t)}return String(n)}const Qe={next:"Next",back:"Back",done:"Done",skip:"Skip tour"};function Ze(n,t,e){return e?.(`opentutorial.${n}`,t)??Qe[n]}const tn={accent:"--ot-accent",bg:"--ot-bg",fg:"--ot-fg",muted:"--ot-muted",border:"--ot-border",success:"--ot-success",danger:"--ot-danger",backdrop:"--ot-backdrop",radius:"--ot-radius",shadow:"--ot-shadow",font:"--ot-font",fontSize:"--ot-font-size",spacing:"--ot-spacing",arrowSize:"--ot-arrow-size",overlayBlur:"--ot-overlay-blur",animationMs:"--ot-anim-ms",z:"--ot-z",spotlightRing:"--ot-spotlight-ring",popoverWidth:"--ot-popover-width"},en=new Set(["radius","popoverWidth","fontSize","spacing","arrowSize","overlayBlur"]),nn=new Set(["animationMs"]),on=200;class At{constructor(t,e={}){f(this,"spec");f(this,"errors",[]);f(this,"warnings",[]);f(this,"opts");f(this,"persistence");f(this,"context");f(this,"layer",null);f(this,"popover",null);f(this,"hotspot",null);f(this,"customHost",null);f(this,"releaseFocus",null);f(this,"cleanupAdvance",null);f(this,"cleanupTrack",null);f(this,"cleanupRender",null);f(this,"appliedVars",[]);f(this,"status","idle");f(this,"currentId",null);f(this,"history",[]);f(this,"resolved",null);f(this,"runToken",0);f(this,"transitions",0);f(this,"stepEnteredAt",0);f(this,"startedAt",0);f(this,"advancing",!1);this.spec=t,this.opts=e,this.context={...e.context??{}},this.persistence=new wt(e.persistence?.storage,e.persistence?.keyPrefix??"ot",e.userId);const i=pt(t);if(this.warnings=i.warnings,!i.ok||e.strict&&i.warnings.length>0){this.errors=i.ok?i.warnings:i.errors;const o=this.errors.map(s=>`  • ${s.path}: ${s.message}`).join(`
`);e.dev!==!1&&console.error(`[opentutorial] Spec "${t?.id??"?"}" failed validation:
${o}`),this.emit("error",{message:`invalid spec: ${this.errors.length} violation(s)`})}else if(i.warnings.length>0&&e.dev){const o=i.warnings.map(s=>`  • ${s.path}: ${s.message}`).join(`
`);console.warn(`[opentutorial] Spec "${t.id}" has warnings:
${o}`)}}get ready(){return this.persistence.ready}getState(){const t=this.visibleSteps(),e=t.findIndex(o=>o.id===this.currentId),i=this.currentStep();return{status:this.status,currentStepId:this.currentId,index:Math.max(0,e),total:t.length,paused:this.status==="paused",canGoBack:i?.canGoBack!==!1&&this.history.length>0,canGoNext:this.status==="running"}}isValid(){return this.errors.length===0}hasSeen(){return this.persistence.hasSeen(this.spec.id,this.spec.version)}getPersistence(){return this.persistence}resetSeen(){this.persistence.reset(this.spec.id)}resetAll(){this.persistence.reset()}resetProgress(){this.persistence.clearProgress(this.spec.id)}exportProgress(){return this.persistence.exportAll()}importProgress(t,e="replace"){return this.persistence.importAll(t,e)}setUser(t){return this.opts={...this.opts,userId:t},this.persistence.setUser(t)}getContext(){return this.context}setContext(t){if(Object.assign(this.context,t),this.status==="running"){const e=this.currentStep();e?.showIf&&!at(e.showIf,this.context)&&this.next()}}setGlobalTheme(t){this.opts={...this.opts,theme:t},this.layer&&this.applyThemeChain(this.currentStep()?.theme)}setLocale(t){this.opts={...this.opts,locale:t},this.status==="running"&&this.rerenderCurrent()}async start(t){if(this.status==="destroyed"||this.status==="running"||!this.isValid())return;await this.persistence.ready,this.status="running",this.history=[],this.transitions=0,this.startedAt=Date.now();const e=t?void 0:this.resolveResumeStep(),i=t??e??this.visibleSteps()[0]?.id;if(this.history=[],i){const o=this.visibleSteps(),s=o.findIndex(r=>r.id===i);s>0&&(this.history=o.slice(0,s).map(r=>r.id))}if(this.buildDom(),this.persistence.markShown(this.spec.id,this.spec.version),this.emit(e?"resumed":"started",{stepId:i}),!i){this.complete("empty");return}await this.goToInternal(i,!1)}resolveResumeStep(){if(this.opts.autoResume){const i=this.persistence.getActive();if(i?.tourId===this.spec.id&&this.visibleSteps().some(s=>s.id===i.stepId))return i.stepId}if(!this.opts.resume)return;const t=this.opts.progressTtl??1440*60*1e3,e=this.persistence.getProgressIfValid(this.spec.id,t);if(e?.lastStepId&&this.visibleSteps().some(i=>i.id===e.lastStepId))return e.lastStepId}async next(){if(this.status!=="running"||this.advancing)return;const t=this.currentStep();if(!t)return;if(this.opts.beforeNext){this.advancing=!0;try{const i=this.visibleSteps().findIndex(s=>s.id===t.id);if(!await this.opts.beforeNext({tourId:this.spec.id,step:t,index:Math.max(0,i)}))return}catch{return}finally{this.advancing=!1}if(this.status!=="running")return}this.emit("step-completed",{stepId:t.id,duration:this.stepDuration()});const e=this.resolveNextId(t);if(!e){this.complete("end");return}await this.goToInternal(e,!0)}resolveNextId(t){if(Array.isArray(t.next)){for(const r of t.next)if(r&&typeof r.if=="string"&&at(r.if,this.context))return r.to}else if(typeof t.next=="string")return t.next;const e=this.visibleSteps(),i=e.findIndex(r=>r.id===t.id);if(i>=0)return e[i+1]?.id;const o=this.spec.steps.findIndex(r=>r.id===t.id);if(o<0)return;const s=new Set(e.map(r=>r.id));return this.spec.steps.slice(o+1).find(r=>s.has(r.id))?.id}prev(){if(this.status!=="running")return;const t=this.currentStep();if(t&&t.canGoBack===!1)return;const e=this.history.pop();e&&(this.emit("back",{stepId:this.currentId??void 0}),this.goToInternal(e,!1))}goTo(t){this.status==="running"&&this.goToInternal(t,!0)}pause(){this.status==="running"&&(this.status="paused",this.emit("paused",{stepId:this.currentId??void 0}),this.teardownDom())}resume(){if(this.status!=="paused")return;const t=this.currentId;this.status="running",this.emit("unpaused",{stepId:t??void 0}),this.buildDom(),t?this.goToInternal(t,!1):this.start()}skip(t="user"){this.status!=="running"&&this.status!=="paused"||this.finish("skipped",t)}complete(t="user"){this.status!=="running"&&this.status!=="paused"||this.finish("completed",t)}destroy(){this.status="destroyed",this.teardownDom()}visibleSteps(){return this.spec.steps.filter(t=>!t.showIf||at(t.showIf,this.context))}currentStep(){return this.spec.steps.find(t=>t.id===this.currentId)??null}stepDuration(){return this.stepEnteredAt?Date.now()-this.stepEnteredAt:0}text(t){return ct(t,this.opts.locale??"en",this.opts.i18nResolver,this.context)}blocks(t){return ft(t,e=>this.text(e))}interactionFor(t){return t.interaction??this.spec.interaction??this.opts.interaction??"free"}buildDom(){const t=this.opts.zIndex??9999;this.layer=new he(t,{container:this.opts.container,isolate:this.opts.isolate,dir:this.opts.dir}),this.layer.attach(),this.opts.renderStep?(this.customHost=document.createElement("div"),this.customHost.className="ot-custom-host",this.layer.mountPopover(this.customHost)):(this.popover=new ke({onNext:()=>{this.next()},onPrev:()=>this.prev(),onSkip:()=>this.skip("user")},this.opts.dir??"ltr",{swipe:this.opts.swipe}),this.layer.mountPopover(this.popover.el)),this.applyThemeChain(void 0)}teardownDom(){this.runToken+=1,this.releaseFocus?.(),this.cleanupAdvance?.(),this.cleanupTrack?.(),this.cleanupRender?.(),this.releaseFocus=null,this.cleanupAdvance=null,this.cleanupTrack=null,this.cleanupRender=null,this.popover?.destroy(),this.hotspot?.destroy(),this.customHost?.remove(),this.layer?.destroy(),this.popover=null,this.hotspot=null,this.customHost=null,this.layer=null,this.resolved=null}finish(t,e){const i=this.currentStep();i&&this.runActions(i.onExit);const o=this.startedAt?Date.now()-this.startedAt:0;this.status=t,this.persistence.mark(this.spec.id,t,this.spec.version),this.persistence.clearActive(),this.emit(t,{stepId:this.currentId??void 0,reason:e,duration:o}),this.teardownDom(),t==="completed"&&this.runOnComplete()}runOnComplete(){const t=this.spec.onComplete;if(t)try{t.emit&&window.dispatchEvent(new CustomEvent(t.emit,{detail:{tourId:this.spec.id}})),t.navigate&&this.navigate(t.navigate),t.startTour&&window.dispatchEvent(new CustomEvent("opentutorial:chain",{detail:{from:this.spec.id,to:t.startTour}}))}catch{}}async goToInternal(t,e){if(this.status!=="running")return;if(this.transitions+=1,this.transitions>on){this.emit("error",{message:"transition limit reached (possible next-loop)"}),this.complete("loop-guard");return}const i=this.spec.steps.find(s=>s.id===t);if(!i){this.emit("error",{message:`unknown step "${t}"`});return}const o=this.currentStep();o&&(this.runActions(o.onExit),this.emit("step-hidden",{stepId:o.id,duration:this.stepDuration()})),e&&this.currentId&&this.currentId!==t&&this.history.push(this.currentId),await this.showStep(i)}async showStep(t){if(!this.layer)return;const e=++this.runToken,i=()=>this.runToken===e&&this.status==="running";this.currentId=t.id,this.cleanupAdvance?.(),this.cleanupAdvance=null,this.releaseFocus?.(),this.releaseFocus=null,this.applyThemeChain(t.theme);const o=t.display??"spotlight",s=this.visibleSteps(),r=Math.max(0,s.findIndex(l=>l.id===t.id));let a=null;if(t.target){if(a=U(t.target),!a&&t.target.waitFor&&(this.renderStep(t,r,s.length,"Looking for the interface element…"),a=await dt(t.target,t.target.timeout??5e3),!i()))return;if(!a){const l=Mt(t.target);this.emit("target-not-found",{stepId:t.id,selector:l,message:`target not found: ${l}`}),this.next();return}}if(!i())return;if(this.resolved=a,a&&t.target?.scrollIntoView!==!1){const l=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,p=t.target?.scrollBehavior??(l?"auto":"smooth");try{a.element.scrollIntoView({block:"center",inline:"center",behavior:p})}catch{}}if(this.hotspot?.destroy(),this.hotspot=null,this.layer.updateSpotlight(null),this.layer.setInteraction(this.interactionFor(t)),(o==="hotspot"||o==="beacon")&&a)this.showIndicator(t,o,a);else{this.renderStep(t,r,s.length),(o==="modal"||!a)&&this.layer.showBackdrop(),requestAnimationFrame(()=>requestAnimationFrame(()=>{i()&&this.reposition()}));const l=this.customHost??this.popover?.el;if(l){const p=o==="modal"||this.interactionFor(t)!=="free";this.releaseFocus=Ae(l,{trap:p,onEscape:()=>{t.skippable!==!1&&this.skip("escape")},onArrowNext:()=>{this.next()},onArrowPrev:()=>this.prev()})}}this.wireAdvance(t,a?.element??null),this.startTracking(),this.stepEnteredAt=Date.now(),this.persistence.saveProgress(this.spec.id,t.id,r),this.opts.autoResume&&this.persistence.setActive(this.spec.id,t.id),this.runActions(t.onEnter),this.emit("step-shown",{stepId:t.id,index:r,total:s.length})}showIndicator(t,e,i){if(!this.layer)return;const o=this.viewportRect(i);if(this.popover&&(this.popover.el.style.display="none"),this.customHost&&(this.customHost.style.display="none"),this.hotspot=new Ee,this.hotspot.render({display:e,content:fe(this.blocks(t.content)),showDismiss:e==="hotspot"||t.advanceOn==="button",onDismiss:()=>{this.next()}},o),this.layer.root.appendChild(this.hotspot.el),e==="beacon"){const s=window.setTimeout(()=>{this.next()},t.duration??5e3);this.cleanupAdvance=()=>window.clearTimeout(s)}}renderStep(t,e,i,o){const s=o?[{type:"text",value:o}]:this.blocks(t.content);if(this.opts.renderStep&&this.customHost){this.cleanupRender?.();const r={tourId:this.spec.id,step:t,index:e,total:i,title:this.text(t.title),blocks:s,canGoBack:t.canGoBack!==!1&&this.history.length>0,canSkip:t.skippable!==!1,isLast:!t.next&&e>=i-1,next:()=>{this.next()},prev:()=>this.prev(),skip:()=>this.skip("user"),goTo:c=>this.goTo(c)},a=this.opts.renderStep(r,this.customHost);this.cleanupRender=typeof a=="function"?a:null,this.customHost.style.display="";return}this.popover&&(this.popover.el.style.display="",this.popover.render(this.makeModel(t,e,i,s)))}rerenderCurrent(){const t=this.currentStep();if(!t)return;const e=this.visibleSteps(),i=Math.max(0,e.findIndex(o=>o.id===t.id));this.renderStep(t,i,e.length),this.reposition()}makeModel(t,e,i,o){const s=this.opts.locale??"en",r=this.opts.i18nResolver,a=(p,d)=>d===!1||d===void 0?Ze(p,s,r):this.text(d),c=t.buttons??{},l=t.advanceOn??"button";return{stepId:t.id,title:this.text(t.title),blocks:o,index:e,total:i,canGoBack:t.canGoBack!==!1&&this.history.length>0,skippable:t.skippable!==!1&&c.skip!==!1,isLast:!t.next&&e>=i-1,advanceOn:l,labels:{next:a("next",c.next),back:a("back",c.back),done:a("done",c.done),skip:a("skip",c.skip)},showNext:c.next!==!1&&(l==="button"||e>=i-1),showBack:c.back!==!1,modal:(t.display??"spotlight")==="modal"||this.interactionFor(t)==="blocked",allowHtml:this.opts.allowHtml}}viewportRect(t){const e=t.element.getBoundingClientRect();return{x:e.x+t.frameOffset.x,y:e.y+t.frameOffset.y,width:e.width,height:e.height}}reposition(){if(!this.layer||this.status!=="running")return;const t=this.currentStep();if(!t)return;const e=t.target?.padding??8,i=!!this.popover&&!this.opts.renderStep;if(this.resolved){if(!this.resolved.doc.contains(this.resolved.element)&&t.target){const s=U(t.target);s&&(this.resolved=s)}const o=this.viewportRect(this.resolved);this.hotspot?(this.hotspot.reposition(o),this.layer.setInteraction(this.interactionFor(t))):(this.layer.updateSpotlight(o,e,this.mergedRadius()),i&&this.popover?.position(o,t.placement??"auto",e))}else this.layer.showBackdrop(),i&&this.popover?.position(null,"center",0)}mergedRadius(){return({...this.opts.theme,...this.spec.theme,...this.currentStep()?.theme}.radius??14)+2}startTracking(){this.cleanupTrack?.();let t=0,e=!1;const i=()=>{e||(e=!0,t=requestAnimationFrame(()=>{e=!1,this.reposition()}))},o=new ResizeObserver(i);if(this.resolved)try{o.observe(this.resolved.element)}catch{}o.observe(document.documentElement),window.addEventListener("resize",i),window.addEventListener("scroll",i,!0);const s=performance.now()+900,r=()=>{this.status==="running"&&(this.reposition(),performance.now()<s&&requestAnimationFrame(r))};requestAnimationFrame(r),this.cleanupTrack=()=>{o.disconnect(),window.removeEventListener("resize",i),window.removeEventListener("scroll",i,!0),cancelAnimationFrame(t)}}wireAdvance(t,e){const i=t.advanceOn??"button",o=()=>{this.next()};switch(i){case"target-click":{if(!e)return;const s=()=>o();e.addEventListener("click",s,{once:!0}),this.cleanupAdvance=()=>e.removeEventListener("click",s);return}case"event":{if(typeof t.event!="string")return;const s=t.event,r=()=>o();window.addEventListener(s,r,{once:!0}),this.cleanupAdvance=()=>window.removeEventListener(s,r);return}case"auto":{const s=window.setTimeout(o,t.duration??3e3);this.cleanupAdvance=()=>window.clearTimeout(s);return}case"input-match":{if(!e||typeof t.match!="string")return;const s=t.match,r=c=>{if(s.startsWith("/")&&s.lastIndexOf("/")>0){const l=s.lastIndexOf("/");try{return new RegExp(s.slice(1,l),s.slice(l+1)).test(c)}catch{return!1}}return c===s},a=()=>{const c=e.value??"";r(c)&&o()};e.addEventListener("input",a),e.addEventListener("change",a),this.cleanupAdvance=()=>{e.removeEventListener("input",a),e.removeEventListener("change",a)};return}case"form-submit":{if(!e)return;const s=e.closest?.("form")??(e.tagName==="FORM"?e:null);if(!s)return;const r=()=>o();s.addEventListener("submit",r,{once:!0}),this.cleanupAdvance=()=>s.removeEventListener("submit",r);return}case"element-appears":{if(typeof t.watch!="string")return;let s=!1;dt({selector:t.watch,visible:!0},t.duration??6e4).then(r=>{r&&!s&&o()}),this.cleanupAdvance=()=>{s=!0};return}case"element-disappears":{if(typeof t.watch!="string")return;const s=t.watch,r=window.setInterval(()=>{U({selector:s,visible:!0})||(window.clearInterval(r),o())},150);this.cleanupAdvance=()=>window.clearInterval(r);return}case"url-match":{if(typeof t.urlPattern!="string")return;const s=t.urlPattern,r=()=>{Dt(s,qt())&&o()},a=jt(r);this.cleanupAdvance=a,r();return}}}navigate(t){if(t.startsWith("/")){if(this.opts.onNavigate){this.opts.onNavigate(t);return}window.location.assign(t)}}runActions(t){if(!t)return;const e=this.resolved?.element;for(const i of t)try{switch(i.type){case"emit":window.dispatchEvent(new CustomEvent(i.name,{detail:i.detail}));break;case"click":e?.click?.();break;case"focus":e?.focus?.();break;case"navigate":this.opts.autoResume&&this.currentId&&this.persistence.setActive(this.spec.id,this.currentId),this.navigate(i.path);break;case"setContext":this.context[i.key]=i.value;break;case"scrollTo":{U({selector:i.selector})?.element.scrollIntoView({block:"center",behavior:"smooth"});break}case"wait":break}}catch{}}applyThemeChain(t){if(!this.layer)return;const e=this.layer.root.style;for(const o of this.appliedVars)e.removeProperty(o);this.appliedVars=[];const i={...this.opts.theme,...this.spec.theme,...t};for(const[o,s]of Object.entries(i)){if(s===void 0)continue;const r=tn[o];if(!r)continue;const a=en.has(o)?`${s}px`:nn.has(o)?`${s}ms`:String(s);e.setProperty(r,a),this.appliedVars.push(r)}i.z!==void 0&&(this.layer.root.style.zIndex=String(i.z))}emit(t,e={}){const i={type:t,tourId:this.spec?.id??"unknown",timestamp:Date.now(),...e},o=Object.freeze({...i});try{this.opts.onEvent?.(o)}catch{}try{window.dispatchEvent(new CustomEvent("opentutorial",{detail:o}))}catch{}}}function sn(n,t){if(!n||n.type==="manual")return{dispose:()=>{}};const e=n.delay??0,i=[],o=[];let s=!1;const r=n.once??!0,a=()=>{s||(r&&(s=!0),e>0?i.push(window.setTimeout(t,e)):t())};switch(n.type){case"auto":{a();break}case"event":{const c=()=>a();window.addEventListener(n.event,c),o.push(()=>window.removeEventListener(n.event,c));break}case"route":{const c=()=>{Dt(n.path,qt(),n.exact)?a():r||(s=!1)};o.push(jt(c)),c();break}case"element":{let c=!1;dt({selector:n.selector,visible:!0},n.timeout??3e4).then(l=>{l&&!c&&a()}),o.push(()=>{c=!0});break}case"idle":{let c=0;const l=()=>{window.clearTimeout(c),!s&&(c=window.setTimeout(a,n.ms))},p=["pointerdown","keydown","scroll","pointermove"];for(const d of p)window.addEventListener(d,l,{passive:!0}),o.push(()=>window.removeEventListener(d,l));o.push(()=>window.clearTimeout(c)),l();break}case"scroll":{const c=()=>{const l=document.documentElement,p=l.scrollHeight-l.clientHeight;if(p<=0)return;l.scrollTop/p*100>=n.percent&&a()};window.addEventListener("scroll",c,{passive:!0}),o.push(()=>window.removeEventListener("scroll",c)),c();break}}return{dispose:()=>{i.forEach(c=>window.clearTimeout(c)),o.forEach(c=>{try{c()}catch{}})}}}class $t{constructor(t,e={}){f(this,"engines",new Map);f(this,"specs");f(this,"opts");f(this,"triggers",[]);f(this,"disposers",[]);f(this,"queue",[]);f(this,"activeId",null);f(this,"mounted",!1);f(this,"sessionCounts",new Map);this.specs=t,this.opts=e;for(const i of t)this.engines.set(i.id,new At(i,{...e,onEvent:o=>this.handleEvent(o)}))}get ready(){return Promise.all([...this.engines.values()].map(t=>t.ready)).then(()=>{})}getEngine(t){return this.engines.get(t)}getEngines(){return[...this.engines.values()]}getSpecs(){return this.specs}getActiveId(){return this.activeId}getState(t){const e=t??this.activeId;return e?this.engines.get(e)?.getState()??null:null}hasSeen(t){return this.engines.get(t)?.hasSeen()??!1}checkEligibility(t){const e=this.engines.get(t);if(!e)return"unknown tour";if(!e.isValid())return"spec failed validation";const i=e.spec,o=e.getContext();if(i.audience?.showIf&&!at(i.audience.showIf,o))return"audience rule did not match";const s=i.frequency;if(s){const r=e.getPersistence().getRecord(i.id);if(s.max!==void 0&&(r?.shownCount??0)>=s.max)return`frequency: already shown ${s.max} time(s)`;if(s.cooldown!==void 0&&r?.lastShownAt){const a=Date.now()-r.lastShownAt;if(a<s.cooldown)return`frequency: cooldown active (${s.cooldown-a}ms left)`}if(s.perSession!==void 0&&(this.sessionCounts.get(i.id)??0)>=s.perSession)return`frequency: session limit of ${s.perSession} reached`}return null}request(t,e,i={}){const o=this.engines.get(t);if(!o||!i.force&&this.checkEligibility(t))return!1;if(this.activeId&&this.activeId!==t)if(i.force)this.engines.get(this.activeId)?.skip("preempted");else return i.queue!==!1&&this.enqueue(t,e,o.spec.priority??0),!1;return this.sessionCounts.set(t,(this.sessionCounts.get(t)??0)+1),o.start(e),!0}start(t,e){this.request(t,e,{force:!0})}enqueue(t,e,i){this.queue.some(o=>o.tourId===t)||(this.queue.push({tourId:t,stepId:e,priority:i}),this.queue.sort((o,s)=>s.priority-o.priority))}drain(){for(;this.queue.length>0;){const t=this.queue.shift();if(!t||this.request(t.tourId,t.stepId,{queue:!1}))return}}stop(t="api"){for(const e of this.engines.values()){const i=e.getState().status;(i==="running"||i==="paused")&&e.skip(t)}this.queue=[]}pause(){this.activeId&&this.engines.get(this.activeId)?.pause()}resume(){this.activeId&&this.engines.get(this.activeId)?.resume()}setContext(t){this.engines.forEach(e=>e.setContext(t))}getContext(){return this.engines.values().next().value?.getContext()??{}}setTheme(t){this.engines.forEach(e=>e.setGlobalTheme(t))}setLocale(t){this.opts={...this.opts,locale:t},this.engines.forEach(e=>e.setLocale(t))}async setUser(t){this.sessionCounts.clear(),await Promise.all([...this.engines.values()].map(e=>e.setUser(t)))}reset(){this.sessionCounts.clear(),this.engines.values().next().value?.resetAll()}resetProgress(){this.engines.forEach(t=>t.resetProgress())}resetTour(t){this.sessionCounts.delete(t),this.engines.get(t)?.resetSeen()}exportProgress(){return this.engines.values().next().value?.exportProgress()??null}importProgress(t,e="replace"){return this.engines.values().next().value?.importProgress(t,e)??!1}mount(){this.mounted||(this.mounted=!0,this.ready.then(()=>{this.mounted&&(this.installChainListener(),this.installDeepLink(),this.installAutoResume(),this.installTriggers())}))}installTriggers(){for(const t of this.specs){const e=this.engines.get(t.id);if(!e||!e.isValid())continue;const i=t.trigger;!i||i.type==="manual"||(i.once??!0)&&e.hasSeen()||this.triggers.push(sn(i,()=>{(i.once??!0)&&e.hasSeen()||this.request(t.id)}))}}installDeepLink(){const t=this.opts.deepLinkParam??"tour";if(t!==!1)try{const e=new URLSearchParams(window.location.search),i=e.get(t);if(!i||!this.engines.has(i))return;const o=e.get(`${t}Step`)??void 0,s=window.setTimeout(()=>this.request(i,o,{force:!0}),400);this.disposers.push(()=>window.clearTimeout(s))}catch{}}installAutoResume(){if(!this.opts.autoResume)return;const t=this.engines.values().next().value;if(!t)return;const e=t.getPersistence().getActive();if(!e||!this.engines.has(e.tourId))return;const i=window.setTimeout(()=>this.request(e.tourId,e.stepId,{force:!0}),200);this.disposers.push(()=>window.clearTimeout(i))}installChainListener(){const t=e=>{const i=e.detail;!i?.to||!this.engines.has(i.to)||window.setTimeout(()=>this.request(i.to,void 0,{force:!0}),0)};window.addEventListener("opentutorial:chain",t),this.disposers.push(()=>window.removeEventListener("opentutorial:chain",t))}handleEvent(t){(t.type==="started"||t.type==="resumed")&&(this.activeId=t.tourId),(t.type==="completed"||t.type==="skipped")&&this.activeId===t.tourId&&(this.activeId=null);try{this.opts.onEvent?.(t)}catch{}const e=this.activeId?this.engines.get(this.activeId)?.getState()??null:null;try{this.opts.onStateChange?.(this.activeId,e)}catch{}(t.type==="completed"||t.type==="skipped")&&this.queue.length>0&&window.setTimeout(()=>this.drain(),0)}destroy(){this.mounted=!1,this.triggers.forEach(t=>t.dispose()),this.disposers.forEach(t=>{try{t()}catch{}}),this.triggers=[],this.disposers=[],this.queue=[],this.engines.forEach(t=>t.destroy()),this.activeId=null}}const rn={start:["started","resumed"],stop:["completed","skipped"],skip:["skipped"],complete:["completed"],step:["step-shown"],event:[],destroy:[]};function ne(n){const{specs:t,autoMount:e=!0,storage:i,keyPrefix:o,...s}=n,r=new Map,a=i!==void 0||o!==void 0?{storage:i,keyPrefix:o,...s.persistence??{}}:s.persistence,c=(d,u)=>{const E=r.get(d);if(E)for(const x of E)try{x(u)}catch{}},l=new $t(t,{...s,persistence:a,onEvent:d=>{c("event",d);for(const[u,E]of Object.entries(rn))E.includes(d.type)&&c(u,d);s.onEvent?.(d)}});e&&l.mount();const p=d=>{const u=l.getActiveId();if(!u)return;const E=l.getEngine(u);E&&d(E)};return{start:(d,u)=>l.start(d,u),request:(d,u)=>l.request(d,u),stop:()=>l.stop("api"),skip:d=>{d?l.getEngine(d)?.skip("api"):l.stop("api")},pause:()=>l.pause(),resume:()=>l.resume(),next:()=>p(d=>{d.next()}),prev:()=>p(d=>d.prev()),goTo:d=>p(u=>u.goTo(d)),getState:d=>l.getState(d),getActiveId:()=>l.getActiveId(),getSpecs:()=>l.getSpecs(),hasSeen:d=>l.hasSeen(d),whyBlocked:d=>l.checkEligibility(d),getContext:()=>l.getContext(),setContext:d=>l.setContext(d),setTheme:d=>l.setTheme(d),setLocale:d=>l.setLocale(d),setUser:d=>l.setUser(d),reset:()=>l.reset(),resetTour:d=>l.resetTour(d),resetProgress:()=>l.resetProgress(),exportProgress:()=>l.exportProgress(),importProgress:(d,u)=>l.importProgress(d,u),getEngine:d=>l.getEngine(d),ready:l.ready,on(d,u){return r.has(d)||r.set(d,new Set),r.get(d).add(u),()=>this.off(d,u)},off(d,u){r.get(d)?.delete(u)},destroy(){c("destroy",{type:"skipped",tourId:l.getActiveId()??"",reason:"destroy",timestamp:Date.now()}),l.destroy(),r.clear()}}}function an(n,t={}){return new At(n,t)}function cn(n,t={}){return new $t(n,t)}function ln(n){return n}function dn(n={}){const{days:t=365,path:e="/",domain:i,sameSite:o="Lax",secure:s}=n,r=()=>{const c={};if(typeof document>"u")return c;for(const l of document.cookie.split(";")){const p=l.indexOf("=");p<0||(c[decodeURIComponent(l.slice(0,p).trim())]=decodeURIComponent(l.slice(p+1)))}return c},a=(c,l,p)=>{if(typeof document>"u")return;const d=[`${encodeURIComponent(c)}=${encodeURIComponent(l)}`,`path=${e}`,`max-age=${Math.floor(p*86400)}`,`SameSite=${o}`];i&&d.push(`domain=${i}`),(s??o==="None")&&d.push("Secure"),document.cookie=d.join("; ")};return{getItem:c=>r()[c]??null,setItem:(c,l)=>a(c,l,t),removeItem:c=>a(c,"",-1)}}function hn(n="opentutorial",t="kv"){const e=new yt;if(typeof indexedDB>"u")return e;let i=null;const o=()=>i||(i=new Promise(r=>{try{const a=indexedDB.open(n,1);a.onupgradeneeded=()=>{const c=a.result;c.objectStoreNames.contains(t)||c.createObjectStore(t)},a.onsuccess=()=>r(a.result),a.onerror=()=>r(null),a.onblocked=()=>r(null)}catch{r(null)}}),i),s=async(r,a)=>{const c=await o();return c?new Promise(l=>{try{const p=c.transaction(t,r),d=a(p.objectStore(t));d.onsuccess=()=>l(d.result),d.onerror=()=>l(null)}catch{l(null)}}):null};return{getItem(r){const a=e.getItem(r);return a!==null?a:s("readonly",c=>c.get(r)).then(c=>(typeof c=="string"&&e.setItem(r,c),typeof c=="string"?c:null))},setItem(r,a){e.setItem(r,a),s("readwrite",c=>c.put(a,r))},removeItem(r){e.removeItem(r),s("readwrite",a=>a.delete(r))}}}function pn(n){const{endpoint:t,headers:e,debounceMs:i=400,fetchImpl:o,onError:s}=n,r=n.cache===!1?new yt:n.cache??_t(),a=o??(typeof fetch=="function"?fetch.bind(globalThis):void 0),c=t.replace(/\/$/,""),l=k=>`${c}/${encodeURIComponent(k)}`,p=()=>({"content-type":"application/json",...typeof e=="function"?e():e??{}}),d=new Map;let u=null;const E=async()=>{if(!a||d.size===0)return;const k=[...d.entries()];d.clear();for(const[h,g]of k)try{const b=await a(l(h),{method:g===null?"DELETE":"PUT",headers:p(),body:g===null?void 0:JSON.stringify({value:g}),credentials:"include"});if(!b.ok)throw new Error(`HTTP ${b.status}`)}catch(b){d.has(h)||d.set(h,g),s?.(b,g===null?"delete":"put",h)}},x=()=>{u&&clearTimeout(u),u=setTimeout(()=>{u=null,E()},i)};return typeof window<"u"&&(window.addEventListener("online",()=>{E()}),window.addEventListener("pagehide",()=>{E()})),{getItem(k){const h=r.getItem(k);return h??(a?a(l(k),{headers:p(),credentials:"include"}).then(g=>g.ok?g.json():null).then(g=>{const b=g?.value??null;return typeof b=="string"&&r.setItem(k,b),b}).catch(g=>(s?.(g,"get",k),null)):null)},setItem(k,h){r.setItem(k,h),d.set(k,h),x()},removeItem(k){r.removeItem(k),d.set(k,null),x()}}}const un=["data-tour","data-testid","data-test-id","data-test","data-cy","data-qa","data-automation-id"],fn=/^(css-[a-z0-9]+|sc-[a-zA-Z0-9]+|jsx-\d+|[a-z]+-[a-f0-9]{5,}|_[\w-]{5,})$/,ie=/(^|[-_:])(\d{3,}|[a-f0-9]{8,}|uid|uuid|react-aria|radix|headlessui|mui-)/i;function F(n){return typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(n):n.replace(/["\\]/g,"\\$&")}function It(n,t=document){try{return t.querySelectorAll(n).length}catch{return 0}}function oe(n){return Array.from(n.classList).filter(t=>t.length>1&&!fn.test(t)&&!t.startsWith("ot-"))}function mn(n){const t=n.parentElement;return t?Array.from(t.children).filter(i=>i.tagName===n.tagName).indexOf(n)+1:1}function gn(n,t=document){const e=[];let i=n,o=0;for(;i&&i.nodeType===1&&o<6;){if(i.id&&!ie.test(i.id)){e.unshift(`#${F(i.id)}`);break}const s=i.tagName.toLowerCase();if(s==="html"||s==="body"){e.unshift(s);break}const r=oe(i);let a=r.length>0?`${s}.${F(r[0])}`:s;const c=i.parentElement;c&&Array.from(c.children).filter(d=>d.tagName===i.tagName&&(r.length===0||d.classList.contains(r[0]))).length>1&&(a+=`:nth-of-type(${mn(i)})`),e.unshift(a),i=c,o+=1;const l=e.join(" > ");if(It(l,t)===1)break}return e.join(" > ")}function bn(n,t=document){const e=[],i=(l,p,d)=>{const u=It(l,t);if(u===0)return;const E=u===1?p:Math.max(10,p-25);e.push({selector:l,score:E,reason:d,matches:u})};for(const l of un){const p=n.getAttribute(l);p&&i(`[${l}="${F(p)}"]`,l==="data-tour"?100:92,`explicit ${l} hook`)}if(n.id){const l=!ie.test(n.id);i(`#${F(n.id)}`,l?85:45,l?"element id":"id looks generated")}const o=n.getAttribute("name");o&&i(`${n.tagName.toLowerCase()}[name="${F(o)}"]`,78,"form field name");const s=n.getAttribute("role"),r=n.getAttribute("aria-label");s&&r?i(`[role="${F(s)}"][aria-label="${F(r)}"]`,74,"role + aria-label"):r&&i(`[aria-label="${F(r)}"]`,70,"aria-label");const a=oe(n);if(a.length>0){const l=n.tagName.toLowerCase();i(`${l}.${a.map(F).join(".")}`,55,"tag + stable classes"),a.length>1&&i(`.${F(a[0])}`,40,"single class")}const c=gn(n,t);return c&&i(c,28,"structural path (fragile — add a data-tour attribute)"),e.filter((l,p,d)=>d.findIndex(u=>u.selector===l.selector)===p).sort((l,p)=>p.score-l.score)}function Tt(n,t=document){const e=bn(n,t);if(e.length===0)return null;const[i,...o]=e,s=(n.textContent??"").replace(/\s+/g," ").trim();return{selector:i.selector,score:i.score,reason:i.reason,fallbacks:o.filter(r=>r.score>=40).slice(0,2).map(r=>r.selector),text:s.length>0&&s.length<=60?s:void 0}}function vn(n,t=document){return n.map(e=>{const i=It(e,t);return i===0?{selector:e,matches:i,ok:!1,note:"no element matches"}:i>1?{selector:e,matches:i,ok:!0,note:`matches ${i} elements; add target.index`}:{selector:e,matches:i,ok:!0}})}const yn="[data-ot-recorder]";function se(n={}){const t=n.minScore??60,e=[],i=document.createElement("style");i.setAttribute("data-ot-recorder",""),i.textContent=_,document.head.appendChild(i);const o=document.createElement("div");o.className="ot-rec-highlight",o.setAttribute("data-ot-recorder",""),o.style.display="none";const s=document.createElement("div");s.className="ot-rec-label",s.setAttribute("data-ot-recorder",""),s.style.display="none";const r=document.createElement("div");r.className="ot-rec-panel",r.setAttribute("data-ot-recorder",""),document.body.append(o,s,r);const a=()=>({specVersion:1,id:n.tourId??"recorded-tour",title:n.title??"Recorded tour",trigger:{type:"manual"},steps:e.length>0?e.map(b=>b.step):[{id:"step-1",title:"Untitled",content:"Add your copy here."}]}),c=()=>JSON.stringify(a(),null,2),l=()=>{r.replaceChildren();const b=document.createElement("h4");b.textContent=`Recording — ${e.length} step${e.length===1?"":"s"}`,r.appendChild(b);const m=document.createElement("ul");m.className="ot-rec-steps",e.forEach((O,I)=>{const P=document.createElement("li");P.className="ot-rec-step";const R=document.createElement("div");R.style.flex="1",R.style.minWidth="0";const q=document.createElement("div");q.textContent=`${I+1}. ${typeof O.step.title=="string"?O.step.title:O.step.id}`,R.appendChild(q);const T=document.createElement("code"),A=O.step.target?.selector;if(T.textContent=Array.isArray(A)?A[0]:A??"(no target)",R.appendChild(T),O.score<t){const w=document.createElement("div");w.textContent=`⚠ fragile (${O.score}) — ${O.reason}`,w.style.color="#f59e0b",w.style.fontSize="10.5px",R.appendChild(w)}const $=document.createElement("button");$.className="ot-rec-btn ot-rec-btn--ghost",$.textContent="×",$.title="Remove step",$.addEventListener("click",()=>{e.splice(I,1),p(),l(),n.onChange?.(a())}),P.append(R,$),m.appendChild(P)}),r.appendChild(m);const y=document.createElement("div");y.className="ot-rec-actions";const C=document.createElement("button");C.className="ot-rec-btn",C.textContent="Copy JSON",C.addEventListener("click",()=>d());const L=document.createElement("button");L.className="ot-rec-btn ot-rec-btn--ghost",L.textContent="Stop",L.addEventListener("click",()=>g()),y.append(C,L),r.appendChild(y);const N=document.createElement("div");N.style.cssText="margin-top:8px;opacity:0.55;font-size:11px;line-height:1.45",N.textContent="Click any element to capture it. Esc stops recording.",r.appendChild(N)},p=()=>{e.forEach((b,m)=>{b.step.id=`step-${m+1}`})},d=()=>{const b=c();if(n.onExport){n.onExport(a(),b);return}navigator.clipboard?.writeText(b).catch(()=>{console.log(b)})},u=b=>!!b?.closest?.(yn),E=b=>{const m=b.target;if(!m||u(m)){o.style.display="none",s.style.display="none";return}const y=m.getBoundingClientRect();o.style.display="",o.style.left=`${y.x}px`,o.style.top=`${y.y}px`,o.style.width=`${y.width}px`,o.style.height=`${y.height}px`;const C=Tt(m);s.style.display="",s.textContent=C?`${C.selector}  (${C.score})`:m.tagName.toLowerCase();const L=y.y+y.height+4;s.style.left=`${Math.max(4,y.x)}px`,s.style.top=L+22<window.innerHeight?`${L}px`:`${Math.max(4,y.y-22)}px`},x=b=>{const m=b.target;if(!m||u(m))return;b.preventDefault(),b.stopPropagation();const y=Tt(m);if(!y)return;const C=(m.textContent??"").replace(/\s+/g," ").trim().slice(0,40),L={id:`step-${e.length+1}`,target:{selector:y.fallbacks.length>0?[y.selector,...y.fallbacks]:y.selector,...y.score<t&&y.text?{text:y.text}:{}},title:C||"Untitled step",content:"Describe what the user should do here."};e.push({step:L,score:y.score,reason:y.reason}),l(),n.onChange?.(a())},k=b=>{b.key==="Escape"&&(b.preventDefault(),g())};document.addEventListener("pointermove",E,!0),document.addEventListener("click",x,!0),document.addEventListener("keydown",k,!0),l();let h=!1;const g=()=>{h||(h=!0,document.removeEventListener("pointermove",E,!0),document.removeEventListener("click",x,!0),document.removeEventListener("keydown",k,!0),o.remove(),s.remove(),r.remove(),i.remove())};return{stop:g,getSpec:a,toJSON:c}}function re(n="ot-record"){try{const e=new URLSearchParams(window.location.search).get(n);return!e||e==="0"||e==="false"?null:se({tourId:e==="1"?void 0:e})}catch{return null}}function xn(n){const t=document.createElement("style");t.setAttribute("data-ot-debug",""),t.textContent=_;const e=document.createElement("div");e.className="ot-debug",e.setAttribute("data-ot-debug",""),document.head.appendChild(t),document.body.appendChild(e);const i=(r,a,c)=>{const l=document.createElement("div");l.className="ot-debug-row";const p=document.createElement("span");p.className="ot-debug-key",p.textContent=r;const d=document.createElement("span");return d.className=`ot-debug-val${c?` ot-debug-${c}`:""}`,d.textContent=a,l.append(p,d),l},o=()=>{const r=n.getActiveId(),a=n.getState(),c=n.getContext(),l=n.specs.find(x=>x.id===r);e.replaceChildren();const p=document.createElement("h4");p.textContent="OpenTutorial debug",e.appendChild(p),e.appendChild(i("tour",r??"(none)")),e.appendChild(i("status",a?.status??"idle")),e.appendChild(i("step",a?.currentStepId??"—")),a&&e.appendChild(i("position",`${a.index+1} / ${a.total}`));const d=l?.steps.find(x=>x.id===a?.currentStepId);if(d?.target){const x=U(d.target);e.appendChild(i("target",x?"resolved":"NOT FOUND",x?"ok":"bad")),e.appendChild(i("selector",Mt(d.target)))}const u=Object.keys(c);if(u.length>0){const x=document.createElement("h4");x.textContent="context",x.style.marginTop="10px",e.appendChild(x);for(const k of u.slice(0,12))e.appendChild(i(k,JSON.stringify(c[k])?.slice(0,40)??"undefined"))}const E=[];l?.audience?.showIf&&E.push({label:"audience",expr:l.audience.showIf});for(const x of l?.steps??[])x.showIf&&E.push({label:x.id,expr:x.showIf});if(E.length>0){const x=document.createElement("h4");x.textContent="conditions",x.style.marginTop="10px",e.appendChild(x);for(const{label:k,expr:h}of E.slice(0,12)){const g=Et(h,c);e.appendChild(i(k,`${h} → ${String(g)}`,g?"ok":"bad"))}}},s=()=>o();return window.addEventListener("opentutorial",s),o(),{update:o,destroy:()=>{window.removeEventListener("opentutorial",s),e.remove(),t.remove()}}}function wn(n="[opentutorial]"){const t=e=>{const i=e.detail;if(!i)return;const o=[i.type,i.tourId,i.stepId].filter(Boolean).join(" · ");console.log(`${n} ${o}${i.duration?` (${i.duration}ms)`:""}`)};return window.addEventListener("opentutorial",t),()=>window.removeEventListener("opentutorial",t)}function it(n,t={}){const e={tour_id:n.tourId,event_type:n.type};return n.stepId!==void 0&&(e.step_id=n.stepId),n.index!==void 0&&(e.step_index=n.index),n.total!==void 0&&(e.step_total=n.total),n.duration!==void 0&&(e.duration_ms=n.duration),n.reason!==void 0&&(e.reason=n.reason),n.selector!==void 0&&(e.selector=n.selector),n.message!==void 0&&(e.message=n.message),n.meta&&Object.assign(e,n.meta),t.includeTimestamp!==!1&&(e.timestamp=n.timestamp),e}function ut(n,t="OpenTutorial"){return`${t} ${n.type}`}function J(n){try{n()}catch{}}function kn(n){return t=>J(()=>n.capture(ut(t,"[OpenTutorial]"),it(t)))}function En(n){return t=>J(()=>n.track(ut(t,"[OpenTutorial]"),it(t)))}function Sn(n){return t=>J(()=>n.track(ut(t,"[OpenTutorial]"),it(t,{includeTimestamp:!1})))}function Cn(n){return t=>J(()=>n.track(ut(t,"OpenTutorial"),it(t)))}function An(n){return t=>J(()=>{const e=window.gtag;typeof e=="function"&&e("event",`opentutorial_${t.type.replace(/-/g,"_")}`,{...it(t,{includeTimestamp:!1}),send_to:n})})}function $n(...n){const t=n.filter(e=>typeof e=="function");return e=>{for(const i of t)J(()=>i(e))}}function In(n){const{endpoint:t,headers:e,batchSize:i=20,flushMs:o=5e3,storage:s,storageKey:r="ot:analytics:queue",maxQueue:a=500,transform:c,fetchImpl:l,onError:p}=n,d=l??(typeof fetch=="function"?fetch.bind(globalThis):void 0);let u=[],E=null,x=!1;const k=()=>({"content-type":"application/json",...typeof e=="function"?e():e??{}}),h=()=>{s&&J(()=>s.setItem(r,JSON.stringify(u)))};s&&Promise.resolve(s.getItem(r)).then(m=>{if(typeof m=="string")try{const y=JSON.parse(m);Array.isArray(y)&&(u=[...y,...u].slice(-a))}catch{}});const g=async()=>{if(x||u.length===0||!d)return;x=!0;const m=u.splice(0,Math.max(i,1));h();try{const y=await d(t,{method:"POST",headers:k(),body:JSON.stringify({events:m}),keepalive:!0});if(!y.ok)throw new Error(`HTTP ${y.status}`)}catch(y){u=[...m,...u].slice(-a),h(),p?.(y,m)}finally{x=!1}},b=()=>{E||(E=setTimeout(()=>{E=null,g()},o))};return typeof window<"u"&&(window.addEventListener("online",()=>{g()}),window.addEventListener("pagehide",()=>{if(u.length===0)return;Tn(t,{events:u})&&(u=[],h())})),m=>J(()=>{u.push(c?c(m):it(m)),u.length>a&&(u=u.slice(-a)),h(),u.length>=i?g():b()})}function Tn(n,t){try{return typeof navigator>"u"||typeof navigator.sendBeacon!="function"?!1:navigator.sendBeacon(n,new Blob([JSON.stringify(t)],{type:"application/json"}))}catch{return!1}}function ae(n){if(n.length===0)return 0;const t=[...n].sort((i,o)=>i-o),e=Math.floor(t.length/2);return t.length%2===0?Math.round((t[e-1]+t[e])/2):t[e]}function ce(n,t,e){const i=n.filter(h=>h.tourId===t),o=i.filter(h=>h.type==="started"||h.type==="resumed").length,s=i.filter(h=>h.type==="completed").length,r=i.filter(h=>h.type==="skipped").length,a=i.filter(h=>(h.type==="completed"||h.type==="skipped")&&typeof h.duration=="number").map(h=>h.duration),c=[],l=new Map,p=new Map,d=new Map;for(const h of i)if(h.type==="step-shown"&&h.stepId&&(c.includes(h.stepId)||c.push(h.stepId),l.set(h.stepId,(l.get(h.stepId)??0)+1)),h.type==="step-completed"&&h.stepId&&(p.set(h.stepId,(p.get(h.stepId)??0)+1),typeof h.duration=="number")){const g=d.get(h.stepId)??[];g.push(h.duration),d.set(h.stepId,g)}const E=(e?e.steps.map(h=>h.id).filter(h=>l.has(h)):c).map((h,g)=>{const b=l.get(h)??0,m=p.get(h)??0,y=Math.max(0,b-m);return{stepId:h,index:g,views:b,completions:m,dropOffs:y,dropOffRate:b>0?y/b:0,medianDurationMs:ae(d.get(h)??[])}}),x=E.reduce((h,g)=>g.dropOffs>0&&(!h||g.dropOffRate>h.dropOffRate)?g:h,null),k=new Map;for(const h of i){if(h.type!=="target-not-found"||!h.stepId)continue;const g=`${h.stepId}::${h.selector??""}`,b=k.get(g);b?b.count+=1:k.set(g,{stepId:h.stepId,selector:h.selector??"",count:1})}return{tourId:t,starts:o,completions:s,skips:r,completionRate:o>0?s/o:0,medianDurationMs:ae(a),steps:E,worstStep:x,targetsNotFound:[...k.values()].sort((h,g)=>g.count-h.count)}}function On(n=5e3){const t=[];return{adapter:e=>{t.push(e),t.length>n&&t.splice(0,t.length-n)},events:t,report:(e,i)=>ce(t,e,i),clear:()=>{t.length=0}}}function v(n,t,e={}){const i=document.createElement(n);t&&(i.className=t);const{text:o,html:s,...r}=e;return o!==void 0&&(i.textContent=o),s!==void 0&&(i.innerHTML=s),Object.assign(i,r),i}function X(n,t,e){const i=v("button",n,{type:"button",text:t});return i.addEventListener("click",e),i}class Q{constructor(){f(this,"fns",[])}add(t){this.fns.push(t)}listen(t,e,i,o){t.addEventListener(e,i,o),this.fns.push(()=>t.removeEventListener(e,i,o))}run(){for(const t of this.fns)try{t()}catch{}this.fns=[]}}class Ot{constructor(t,e,i){f(this,"ready");f(this,"persistence");this.persistence=new wt(t,e,i),this.ready=this.persistence.ready}shouldShow(t,e={}){const{once:i=!0,resurfaceAfter:o}=e;if(!i)return!0;const s=this.persistence.getRecord(t);return s?.at?o===void 0?!1:Date.now()-s.at>o:!0}markDismissed(t){this.persistence.mark(t,"skipped")}markActed(t){this.persistence.mark(t,"completed")}reset(t){this.persistence.reset(t)}}function Z(n,t){t!==null&&(t??document.body).appendChild(n)}function tt(n,t){return{el:n,mount(e){(e??document.body).appendChild(n)},destroy(){t.run(),n.remove()}}}function Ln(n){const{id:t,message:e,position:i="top",action:o,dismissible:s=!0,resurfaceAfter:r,storage:a,keyPrefix:c="ot-banner",userId:l,container:p,className:d="",onDismiss:u}=n,E=new Q,x=new Ot(a,c,l),k=v("div",`ot-banner ot-banner--${i} ${d}`.trim());k.setAttribute("role","status"),k.hidden=!0;const h=v("span","ot-banner-content",{html:nt(e)});k.appendChild(h),o&&k.appendChild(X("ot-banner-action",o.label,o.onClick));const g=()=>{x.markDismissed(t),k.hidden=!0,u?.()};if(s){const m=X("ot-banner-dismiss","×",g);m.setAttribute("aria-label","Dismiss"),k.appendChild(m)}Z(k,p);let b=!0;return E.add(()=>{b=!1}),x.ready.then(()=>{b&&(k.hidden=!x.shouldShow(t,{resurfaceAfter:r}))}),{...tt(k,E),setMessage(m){h.innerHTML=nt(m)},dismiss:g}}function Nn(n){const{id:t,title:e,content:i,once:o=!0,primaryAction:s,secondaryAction:r,dismissible:a=!0,allowHtml:c,locale:l="en",i18nResolver:p,storage:d,keyPrefix:u="ot-announce",userId:E,container:x,className:k="",onDismiss:h}=n,g=new Q,b=new Ot(d,u,E),m=v("div","ot-root");m.setAttribute("data-opentutorial",""),m.hidden=!0;const y=document.createElementNS("http://www.w3.org/2000/svg","svg");y.setAttribute("class","ot-backdrop"),y.setAttribute("width","100%"),y.setAttribute("height","100%"),y.setAttribute("aria-hidden","true");const C=document.createElementNS("http://www.w3.org/2000/svg","rect");C.setAttribute("class","ot-dim"),C.setAttribute("width","100%"),C.setAttribute("height","100%"),y.appendChild(C);const L=`ot-announce-${t}`,N=v("div",`ot-popover ot-modal ot-popover--modal-step ${k}`.trim());N.setAttribute("role","dialog"),N.setAttribute("aria-modal","true"),N.setAttribute("aria-labelledby",L),N.style.left="50%",N.style.top="50%",N.style.transform="translate(-50%, -50%)";const O=v("div","ot-body"),I=w=>{o&&(w?b.markActed(t):b.markDismissed(t)),m.hidden=!0,w||h?.()};if(a){const w=X("ot-skip","×",()=>I(!1));w.setAttribute("aria-label","Dismiss"),O.appendChild(w)}const P=v("h2","ot-title",{text:e});P.id=L,O.appendChild(P);const R=v("div","ot-content-wrap"),q=ft(i,w=>ct(w,l,p));R.appendChild(mt(q,{allowHtml:c})),O.appendChild(R);const T=v("div","ot-footer");T.appendChild(v("span"));const A=v("div","ot-btns");r&&A.appendChild(X("ot-btn ot-btn-ghost",r.label,()=>{I(!0),r.onClick()})),A.appendChild(X("ot-btn ot-btn-primary",s?.label??"Got it",()=>{I(!0),s?.onClick()})),T.appendChild(A),O.appendChild(T),N.appendChild(O),m.appendChild(y),m.appendChild(N),Z(m,x),a&&g.listen(window,"keydown",w=>{!m.hidden&&w.key==="Escape"&&I(!1)});let $=!0;return g.add(()=>{$=!1}),b.ready.then(()=>{$&&(m.hidden=!b.shouldShow(t,{once:o}),m.hidden||N.focus?.())}),{...tt(m,g),close:()=>I(!1)}}function zn(n){const{target:t,content:e,glyph:i="?",openOnHover:o=!1,zIndex:s,container:r,className:a=""}=n,c=new Q,l=typeof t=="string"?{selector:t}:t,p=v("div",`ot-hint ${a}`.trim());s!==void 0&&(p.style.zIndex=String(s)),p.hidden=!0;const d=v("button","ot-hint-dot",{type:"button",text:i});d.setAttribute("aria-expanded","false"),d.setAttribute("aria-label","Show hint");const u=v("div","ot-hint-panel",{html:nt(e)});u.setAttribute("role","tooltip"),u.hidden=!0;const E=g=>{u.hidden=!g,d.setAttribute("aria-expanded",String(g)),d.setAttribute("aria-label",g?"Hide hint":"Show hint")};d.addEventListener("click",()=>E(u.hidden)),o&&(p.addEventListener("mouseenter",()=>E(!0)),p.addEventListener("mouseleave",()=>E(!1))),p.appendChild(d),p.appendChild(u),Z(p,r);let x=0;const k=()=>{const g=U(l);if(!g){p.hidden=!0;return}const b=g.element.getBoundingClientRect();p.hidden=!1,p.style.left=`${b.x+g.frameOffset.x+b.width}px`,p.style.top=`${b.y+g.frameOffset.y}px`},h=()=>{cancelAnimationFrame(x),x=requestAnimationFrame(k)};if(k(),c.listen(window,"resize",h),c.listen(window,"scroll",h,{capture:!0}),c.add(()=>cancelAnimationFrame(x)),typeof ResizeObserver<"u"){const g=new ResizeObserver(h);g.observe(document.documentElement),c.add(()=>g.disconnect())}return{...tt(p,c),open:()=>E(!0),close:()=>E(!1),reposition:k}}function Rn(n){const{id:t,kind:e="nps",question:i,options:o=[],lowLabel:s="Not likely",highLabel:r="Very likely",followUp:a,submitLabel:c="Submit",dismissLabel:l="Not now",thanksMessage:p="Thanks for the feedback!",container:d,className:u="",onSubmit:E,onDismiss:x}=n,k=new Q;let h=null,g=null;const b=v("div",`ot-survey ${u}`.trim()),m=`ot-survey-q-${t}`,y=v("p","ot-survey-question",{text:i});y.id=m,b.appendChild(y);const C=e==="nps"?Array.from({length:11},(T,A)=>A):e==="rating"?[1,2,3,4,5]:null,L=[],N=[],O=v("textarea","ot-survey-textarea");O.placeholder=e==="text"?i:a??"",O.setAttribute("aria-label",e==="text"?i:a??"Additional comments"),O.hidden=e!=="text";const I=v("button","ot-btn ot-btn-primary",{type:"button",text:c}),P=()=>{for(const A of L){const $=Number(A.dataset.value)===h;A.classList.toggle("ot-survey-score--selected",$),A.setAttribute("aria-checked",String($))}for(const A of N){const $=A.dataset.value===g;A.classList.toggle("ot-survey-option--selected",$),A.setAttribute("aria-checked",String($))}a&&e!=="text"&&(O.hidden=h===null&&g===null);const T=e==="nps"||e==="rating"?h!==null:e==="choice"?g!==null:O.value.trim().length>0;I.disabled=!T};if(C){const T=v("div","ot-survey-scale");T.setAttribute("role","radiogroup"),T.setAttribute("aria-labelledby",m);for(const $ of C){const w=v("button","ot-survey-score",{type:"button",text:String($)});w.dataset.value=String($),w.setAttribute("role","radio"),w.setAttribute("aria-checked","false"),w.addEventListener("click",()=>{h=$,P()}),L.push(w),T.appendChild(w)}b.appendChild(T);const A=v("div","ot-survey-labels");A.appendChild(v("span",void 0,{text:s})),A.appendChild(v("span",void 0,{text:r})),b.appendChild(A)}if(e==="choice"){const T=v("div","ot-survey-options");T.setAttribute("role","radiogroup"),T.setAttribute("aria-labelledby",m);for(const A of o){const $=v("button","ot-survey-option",{type:"button",text:A});$.dataset.value=A,$.setAttribute("role","radio"),$.setAttribute("aria-checked","false"),$.addEventListener("click",()=>{g=A,P()}),N.push($),T.appendChild($)}b.appendChild(T)}b.appendChild(O),O.addEventListener("input",P);const R=v("div","ot-footer");x?R.appendChild(X("ot-btn ot-btn-ghost",l,x)):R.appendChild(v("span")),R.appendChild(I),b.appendChild(R);const q=()=>({surveyId:t,kind:e,score:h??void 0,choice:g??void 0,comment:O.value.trim()||void 0});return I.addEventListener("click",()=>{I.disabled||(E({...q(),submittedAt:Date.now()}),b.replaceChildren(v("p","ot-survey-thanks",{text:p})))}),P(),Z(b,d),{...tt(b,k),getResponse:q,reset(){h=null,g=null,O.value="",P()}}}function Pn(n){const{layer:t,specs:e,getStatus:i,onStart:o,title:s="Onboarding",startLabel:r="Start",runningLabel:a="Running",floating:c=!1,collapsible:l=!1,defaultCollapsed:p=!1,hideWhenComplete:d=!1,locale:u="en",i18nResolver:E,container:x,className:k="",onComplete:h}=n,g=new Q;let b=p,m=!1;const y=v("div","ot-checklist"),C=v("ul","ot-checklist-items"),L=v("div","ot-checklist-bar-track"),N=v("div","ot-checklist-bar-fill"),O=v("span","ot-checklist-count"),I=v("button","ot-checklist-toggle",{type:"button"});if(L.setAttribute("role","progressbar"),L.setAttribute("aria-valuemin","0"),L.setAttribute("aria-valuemax","100"),L.appendChild(N),s){const w=v("div","ot-checklist-header");w.appendChild(v("h3","ot-checklist-title",{text:s})),w.appendChild(O),l&&(I.addEventListener("click",()=>$(!b)),w.appendChild(I)),y.appendChild(w)}y.appendChild(L),y.appendChild(C);const P=()=>e??t.getSpecs(),R=w=>i?i(w):t.getActiveId()===w?"in_progress":t.hasSeen(w)?"completed":"pending",q=w=>w===void 0?"":ct(w,u,E,t.getContext());let T={completed:0,total:0,percent:0};const A=()=>{const w=P(),V=w.map(j=>R(j.id)),z=V.filter(j=>j==="completed").length,D=w.length>0?Math.round(z/w.length*100):0;T={completed:z,total:w.length,percent:D},O.textContent=`${z}/${w.length}`,N.style.width=`${D}%`,L.setAttribute("aria-valuenow",String(D)),L.setAttribute("aria-label",`${z} of ${w.length} complete`),C.replaceChildren(),w.forEach((j,ot)=>{const G=V[ot],st=v("li",`ot-checklist-item ot-checklist-item--${G}`),H=v("span","ot-checklist-icon",{text:G==="completed"?"✓":G==="in_progress"?"◌":"○"});H.setAttribute("aria-hidden","true"),st.appendChild(H);const Lt=v("div","ot-checklist-info");Lt.appendChild(v("span","ot-checklist-name",{text:q(j.title)}));const de=q(j.description);if(de&&Lt.appendChild(v("span","ot-checklist-desc",{text:de})),st.appendChild(Lt),G!=="completed"){const Nt=v("button","ot-checklist-btn",{type:"button",text:G==="in_progress"?a:r});Nt.disabled=G==="in_progress",Nt.addEventListener("click",()=>{o?o(j.id):t.start(j.id)}),st.appendChild(Nt)}C.appendChild(st)});const et=w.length>0&&z===w.length;et&&!m&&(m=!0,h?.()),et||(m=!1),y.hidden=et&&d,y.className=["ot-checklist",c?"ot-checklist--floating":"",b?"ot-checklist--collapsed":"",k].filter(Boolean).join(" ")};function $(w){b=w,I.textContent=b?"▸":"▾",I.setAttribute("aria-expanded",String(!b)),I.setAttribute("aria-label",b?"Expand checklist":"Collapse checklist"),A()}return $(b),Z(y,x),g.add(t.on("event",A)),{...tt(y,g),refresh:A,setCollapsed:$,getProgress:()=>T}}function Mn(n){const{layer:t,specs:e,links:i=[],title:o="Help & guides",searchPlaceholder:s="Search…",floating:r=!1,launcherGlyph:a="?",emptyMessage:c="Nothing matches that search.",locale:l="en",i18nResolver:p,container:d,className:u=""}=n,E=new Q;let x=!r,k="";const h=v("div","ot-hub-root"),g=v("div",`ot-hub ${r?"ot-hub--floating":""} ${u}`.trim()),b=v("div","ot-hub-header");b.appendChild(v("h3","ot-hub-title",{text:o}));const m=v("input","ot-hub-search");m.type="search",m.placeholder=s,m.setAttribute("aria-label",s),b.appendChild(m),g.appendChild(b);const y=v("ul","ot-hub-list");g.appendChild(y),h.appendChild(g);const C=v("button","ot-hub-launcher",{type:"button",text:a});r&&(C.setAttribute("aria-label",o),h.appendChild(C));const L=I=>I===void 0?"":ct(I,l,p,t.getContext()),N=()=>{if(g.hidden=!x,r&&(C.textContent=x?"×":a,C.setAttribute("aria-label",x?"Close help":o),C.setAttribute("aria-expanded",String(x))),!x)return;const I=k.trim().toLowerCase(),P=e??t.getSpecs(),R=(T,A)=>!I||T.toLowerCase().includes(I)||A.toLowerCase().includes(I);y.replaceChildren();let q=0;for(const T of P){const A=L(T.title),$=L(T.description);if(!R(A,$))continue;q+=1;const w=v("li"),V=v("button","ot-hub-item",{type:"button",text:`${t.hasSeen(T.id)?"↻ ":""}${A}`});$&&V.appendChild(v("span","ot-hub-item-desc",{text:$})),V.addEventListener("click",()=>{t.start(T.id),r&&O(!1)}),w.appendChild(V),y.appendChild(w)}for(const T of i){const A=T.description??"";if(!R(T.label,A))continue;q+=1;const $=v("li"),w=v("a","ot-hub-item",{text:`${T.label} ↗`});w.href=T.href,w.target="_blank",w.rel="noopener noreferrer",A&&w.appendChild(v("span","ot-hub-item-desc",{text:A})),$.appendChild(w),y.appendChild($)}q===0&&y.appendChild(v("li","ot-hub-empty",{text:c}))};function O(I){x=I,N()}return m.addEventListener("input",()=>{k=m.value,N()}),C.addEventListener("click",()=>O(!x)),N(),Z(h,d),E.add(t.on("event",()=>{x&&N()})),{...tt(h,E),open:()=>O(!0),close:()=>O(!1),search(I){k=I,m.value=I,N()},refresh:N}}function Bn(n){const{entries:t,title:e="What's new",floating:i=!0,launcherGlyph:o="✦",emptyMessage:s="Nothing new right now.",limit:r=20,allowHtml:a,locale:c="en",i18nResolver:l,storage:p,keyPrefix:d="ot-changelog",userId:u,container:E,className:x="",onRead:k}=n,h=new Q,g=new Ot(p,d,u);let b=t,m=!i,y=!1;const C=v("div","ot-changelog-root"),L=v("div",`ot-changelog ${i?"ot-changelog--floating":""} ${x}`.trim());L.setAttribute("role","region"),L.setAttribute("aria-label",e);const N=v("div","ot-changelog-header");N.appendChild(v("h3","ot-changelog-title",{text:e})),L.appendChild(N);const O=v("ul","ot-changelog-list");L.appendChild(O),C.appendChild(L);const I=v("button","ot-changelog-launcher",{type:"button"}),P=v("span","ot-changelog-badge");if(P.setAttribute("aria-hidden","true"),i)I.appendChild(v("span","ot-changelog-glyph",{text:o})),I.appendChild(P),C.appendChild(I);else{const z=X("ot-changelog-close","×",()=>w(!1));z.setAttribute("aria-label","Close"),N.appendChild(z)}const R=()=>b.slice(0,r),q=()=>y?R().filter(z=>g.shouldShow(z.id)).map(z=>z.id):[],T=()=>{const z=q().length;P.textContent=z>99?"99+":String(z),P.hidden=z===0,I.setAttribute("aria-label",z>0?`${e} (${z} unread)`:e),I.setAttribute("aria-expanded",String(m))},A=()=>{O.replaceChildren();const z=R();if(z.length===0){O.appendChild(v("li","ot-changelog-empty",{text:s}));return}for(const D of z){const et=y&&g.shouldShow(D.id),j=v("li",`ot-changelog-item${et?" ot-changelog-item--unread":""}`),ot=v("div","ot-changelog-meta");if(D.tag&&ot.appendChild(v("span","ot-changelog-tag",{text:D.tag})),D.date){const H=v("time","ot-changelog-date",{text:D.date});H.dateTime=D.date,ot.appendChild(H)}ot.childElementCount>0&&j.appendChild(ot),j.appendChild(v("h4","ot-changelog-entry-title",{text:D.title}));const G=v("div","ot-changelog-body"),st=ft(D.content,H=>ct(H,c,l));if(G.appendChild(mt(st,{allowHtml:a})),j.appendChild(G),D.href){const H=v("a","ot-changelog-link",{text:"Read more ↗"});H.href=D.href,H.target="_blank",H.rel="noopener noreferrer",j.appendChild(H)}O.appendChild(j)}},$=()=>{L.hidden=!m,T(),m&&A()};function w(z){if(m=z,L.hidden=!m,m){const D=q();if(A(),D.length>0){for(const et of D)g.markActed(et);k?.(D)}}T()}I.addEventListener("click",()=>w(!m)),Z(C,E),$();let V=!0;return h.add(()=>{V=!1}),g.ready.then(()=>{V&&(y=!0,$())}),{...tt(C,h),open:()=>w(!0),close:()=>w(!1),unread:q,markAllRead(){for(const z of R())g.markActed(z.id);$()},setEntries(z){b=z,$()}}}const qn=["specs","context","theme","locale","dir","z-index","interaction","auto-start","deep-link-param","resume","auto-resume","isolate","allow-html","debug"];function lt(n,t){if(!n)return t;try{return JSON.parse(n)}catch{return t}}class Dn extends HTMLElement{constructor(){super(...arguments);f(this,"layer",null);f(this,"_specs",[]);f(this,"_context",{})}static get observedAttributes(){return qn}set specs(e){this._specs=Array.isArray(e)?e:[],this.rebuild()}get specs(){return this._specs}set context(e){this._context=e??{},this.layer?.setContext(this._context)}get context(){return this._context}connectedCallback(){this.style.display="none",this.rebuild()}disconnectedCallback(){this.layer?.destroy(),this.layer=null}attributeChangedCallback(e){if(this.isConnected){if(e==="context"){this._context=lt(this.getAttribute("context"),{}),this.layer?.setContext(this._context);return}if(e==="locale"){const i=this.getAttribute("locale");i&&this.layer?.setLocale(i);return}this.rebuild()}}collectSpecs(){if(this._specs.length>0)return this._specs;const e=lt(this.getAttribute("specs"),null);if(e)return Array.isArray(e)?e:[e];const i=[];for(const o of Array.from(this.querySelectorAll('script[type="application/json"]'))){const s=lt(o.textContent,null);s&&i.push(...Array.isArray(s)?s:[s])}return i}rebuild(){if(!this.isConnected)return;this.layer?.destroy();const e=this.collectSpecs();if(e.length===0){this.layer=null;return}const i=a=>this.hasAttribute(a)&&this.getAttribute(a)!=="false",o=Number(this.getAttribute("z-index")),s=this.getAttribute("deep-link-param");this.layer=ne({specs:e,context:{...lt(this.getAttribute("context"),{}),...this._context},theme:lt(this.getAttribute("theme"),void 0),locale:this.getAttribute("locale")??void 0,dir:this.getAttribute("dir")??void 0,zIndex:Number.isFinite(o)&&o>0?o:void 0,interaction:this.getAttribute("interaction")??void 0,deepLinkParam:s==="false"?!1:s??void 0,resume:i("resume"),autoResume:i("auto-resume"),isolate:i("isolate"),allowHtml:i("allow-html"),debug:i("debug"),onEvent:a=>{this.dispatchEvent(new CustomEvent("opentutorial",{detail:a,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent(`ot-${a.type}`,{detail:a,bubbles:!0,composed:!0}))}});const r=this.getAttribute("auto-start");r&&this.layer.ready.then(()=>this.layer?.request(r))}start(e,i){this.layer?.start(e,i)}stop(){this.layer?.stop()}pause(){this.layer?.pause()}resumeTour(){this.layer?.resume()}next(){this.layer?.next()}prev(){this.layer?.prev()}reset(){this.layer?.reset()}getState(e){return this.layer?.getState(e)??null}getLayer(){return this.layer}}function le(n="open-tutorial"){typeof customElements>"u"||customElements.get(n)||customElements.define(n,Dn)}le(),re(),queueMicrotask(()=>{const n=globalThis;n.OpenTutorial&&!n.Opentutorial&&(n.Opentutorial=n.OpenTutorial)}),S.CSS=_,S.TourEngine=At,S.TourOrchestrator=$t,S.TourPersistence=wt,S.assertValidSpec=We,S.auditSelectors=vn,S.bestSelector=Tt,S.createAmplitudeAdapter=Sn,S.createAnnouncement=Nn,S.createBanner=Ln,S.createChangelog=Bn,S.createChecklist=Pn,S.createCookieStorage=dn,S.createDebugPanel=xn,S.createEventCollector=On,S.createFunnelReport=ce,S.createGA4Adapter=An,S.createHint=zn,S.createHttpAdapter=In,S.createIndexedDBStorage=hn,S.createMixpanelAdapter=En,S.createMultiAdapter=$n,S.createPostHogAdapter=kn,S.createRemoteStorage=pn,S.createResourceCenter=Mn,S.createSegmentAdapter=Cn,S.createSurvey=Rn,S.createTour=an,S.createTours=cn,S.createTutorialLayer=ne,S.defineOpenTutorialElement=le,S.defineSpec=ln,S.enableRecorderFromUrl=re,S.evaluateExpression=Et,S.evaluateShowIf=at,S.logEvents=wn,S.resolveTarget=U,S.startRecorder=se,S.validateSpec=pt,S.validateSpecs=Ve,S.waitForTarget=dt,Object.defineProperty(S,Symbol.toStringTag,{value:"Module"})})(this.OpenTutorial=this.OpenTutorial||{});
//# sourceMappingURL=opentutorial.global.js.map
