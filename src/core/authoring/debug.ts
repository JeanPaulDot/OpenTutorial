/**
 * Dev-only debug overlay.
 *
 * Answers the questions that otherwise need a debugger: which step is live,
 * did the target resolve, what is in the context, and how did each `showIf`
 * actually evaluate.
 */

import { evaluateExpression } from '../safeEval';
import { resolveTarget, describeTarget } from '../dom/target';
import { CSS } from '../styles';
import type { TourEvent, TutorialSpec } from '../types';

export interface DebugPanelOptions {
  specs: TutorialSpec[];
  getContext: () => Record<string, unknown>;
  getActiveId: () => string | null;
  getState: () => { currentStepId: string | null; index: number; total: number; status: string } | null;
}

export interface DebugPanelHandle {
  update: () => void;
  destroy: () => void;
}

export function createDebugPanel(opts: DebugPanelOptions): DebugPanelHandle {
  const style = document.createElement('style');
  style.setAttribute('data-ot-debug', '');
  style.textContent = CSS;

  const panel = document.createElement('div');
  panel.className = 'ot-debug';
  panel.setAttribute('data-ot-debug', '');

  document.head.appendChild(style);
  document.body.appendChild(panel);

  const row = (key: string, value: string, tone?: 'ok' | 'bad'): HTMLElement => {
    const el = document.createElement('div');
    el.className = 'ot-debug-row';
    const k = document.createElement('span');
    k.className = 'ot-debug-key';
    k.textContent = key;
    const v = document.createElement('span');
    v.className = `ot-debug-val${tone ? ` ot-debug-${tone}` : ''}`;
    v.textContent = value;
    el.append(k, v);
    return el;
  };

  const update = (): void => {
    const activeId = opts.getActiveId();
    const state = opts.getState();
    const context = opts.getContext();
    const spec = opts.specs.find((s) => s.id === activeId);

    panel.replaceChildren();

    const heading = document.createElement('h4');
    heading.textContent = 'OpenTutorial debug';
    panel.appendChild(heading);

    panel.appendChild(row('tour', activeId ?? '(none)'));
    panel.appendChild(row('status', state?.status ?? 'idle'));
    panel.appendChild(row('step', state?.currentStepId ?? '—'));
    if (state) panel.appendChild(row('position', `${state.index + 1} / ${state.total}`));

    const step = spec?.steps.find((s) => s.id === state?.currentStepId);
    if (step?.target) {
      const found = resolveTarget(step.target);
      panel.appendChild(row(
        'target',
        found ? 'resolved' : 'NOT FOUND',
        found ? 'ok' : 'bad',
      ));
      panel.appendChild(row('selector', describeTarget(step.target)));
    }

    const keys = Object.keys(context);
    if (keys.length > 0) {
      const ctxHeading = document.createElement('h4');
      ctxHeading.textContent = 'context';
      ctxHeading.style.marginTop = '10px';
      panel.appendChild(ctxHeading);
      for (const key of keys.slice(0, 12)) {
        panel.appendChild(row(key, JSON.stringify(context[key])?.slice(0, 40) ?? 'undefined'));
      }
    }

    // Every condition in the active spec, with its live result — the fastest way
    // to see why a step is being skipped.
    const conditions: Array<{ label: string; expr: string }> = [];
    if (spec?.audience?.showIf) conditions.push({ label: 'audience', expr: spec.audience.showIf });
    for (const s of spec?.steps ?? []) {
      if (s.showIf) conditions.push({ label: s.id, expr: s.showIf });
    }

    if (conditions.length > 0) {
      const condHeading = document.createElement('h4');
      condHeading.textContent = 'conditions';
      condHeading.style.marginTop = '10px';
      panel.appendChild(condHeading);
      for (const { label, expr } of conditions.slice(0, 12)) {
        const result = evaluateExpression(expr, context);
        panel.appendChild(row(label, `${expr} → ${String(result)}`, result ? 'ok' : 'bad'));
      }
    }
  };

  const listener = (): void => update();
  window.addEventListener('opentutorial', listener);
  update();

  return {
    update,
    destroy: () => {
      window.removeEventListener('opentutorial', listener);
      panel.remove();
      style.remove();
    },
  };
}

/** Log every tour event with timings. Pairs well with the panel. */
export function logEvents(prefix = '[opentutorial]'): () => void {
  const listener = (e: Event): void => {
    const detail = (e as CustomEvent<TourEvent>).detail;
    if (!detail) return;
    const bits = [detail.type, detail.tourId, detail.stepId].filter(Boolean).join(' · ');
    console.log(`${prefix} ${bits}${detail.duration ? ` (${detail.duration}ms)` : ''}`);
  };
  window.addEventListener('opentutorial', listener);
  return () => window.removeEventListener('opentutorial', listener);
}
