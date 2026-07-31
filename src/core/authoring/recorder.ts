/**
 * Point-and-click tour recorder.
 *
 * Enable it in a dev build, hover to highlight, click to capture a step, and
 * export a ready-to-paste `TutorialSpec`. Selectors come from
 * `bestSelector`, which prefers explicit hooks and reports a stability score so
 * a fragile target is visible while authoring rather than after a deploy.
 *
 * ```ts
 * import { startRecorder } from '@opentutorial/core/authoring';
 * if (import.meta.env.DEV) startRecorder({ tourId: 'my-tour' });
 * ```
 */

import { bestSelector } from './selector';
import { CSS } from '../styles';
import type { TourStep, TutorialSpec } from '../types';

export interface RecorderOptions {
  tourId?: string;
  title?: string;
  /** Called with the spec each time it changes. */
  onChange?: (spec: TutorialSpec) => void;
  /** Called on "Copy" / "Done". Defaults to copying JSON to the clipboard. */
  onExport?: (spec: TutorialSpec, json: string) => void;
  /** Warn when a captured selector scores below this. Default 60. */
  minScore?: number;
}

export interface RecorderHandle {
  stop: () => void;
  getSpec: () => TutorialSpec;
  toJSON: () => string;
}

interface Captured {
  step: TourStep;
  score: number;
  reason: string;
}

const PANEL_IGNORE = '[data-ot-recorder]';

export function startRecorder(opts: RecorderOptions = {}): RecorderHandle {
  const minScore = opts.minScore ?? 60;
  const captured: Captured[] = [];

  const styleHost = document.createElement('style');
  styleHost.setAttribute('data-ot-recorder', '');
  styleHost.textContent = CSS;
  document.head.appendChild(styleHost);

  const highlight = document.createElement('div');
  highlight.className = 'ot-rec-highlight';
  highlight.setAttribute('data-ot-recorder', '');
  highlight.style.display = 'none';

  const label = document.createElement('div');
  label.className = 'ot-rec-label';
  label.setAttribute('data-ot-recorder', '');
  label.style.display = 'none';

  const panel = document.createElement('div');
  panel.className = 'ot-rec-panel';
  panel.setAttribute('data-ot-recorder', '');

  document.body.append(highlight, label, panel);

  const buildSpec = (): TutorialSpec => ({
    specVersion: 1,
    id: opts.tourId ?? 'recorded-tour',
    title: opts.title ?? 'Recorded tour',
    trigger: { type: 'manual' },
    steps: captured.length > 0
      ? captured.map((c) => c.step)
      : [{ id: 'step-1', title: 'Untitled', content: 'Add your copy here.' }],
  });

  const toJSON = (): string => JSON.stringify(buildSpec(), null, 2);

  const renderPanel = (): void => {
    panel.replaceChildren();

    const heading = document.createElement('h4');
    heading.textContent = `Recording — ${captured.length} step${captured.length === 1 ? '' : 's'}`;
    panel.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'ot-rec-steps';
    captured.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'ot-rec-step';

      const body = document.createElement('div');
      body.style.flex = '1';
      body.style.minWidth = '0';

      const name = document.createElement('div');
      name.textContent = `${i + 1}. ${typeof c.step.title === 'string' ? c.step.title : c.step.id}`;
      body.appendChild(name);

      const code = document.createElement('code');
      const selector = c.step.target?.selector;
      code.textContent = Array.isArray(selector) ? selector[0] : (selector ?? '(no target)');
      body.appendChild(code);

      if (c.score < minScore) {
        const warn = document.createElement('div');
        warn.textContent = `⚠ fragile (${c.score}) — ${c.reason}`;
        warn.style.color = '#f59e0b';
        warn.style.fontSize = '10.5px';
        body.appendChild(warn);
      }

      const remove = document.createElement('button');
      remove.className = 'ot-rec-btn ot-rec-btn--ghost';
      remove.textContent = '×';
      remove.title = 'Remove step';
      remove.addEventListener('click', () => {
        captured.splice(i, 1);
        renumber();
        renderPanel();
        opts.onChange?.(buildSpec());
      });

      li.append(body, remove);
      list.appendChild(li);
    });
    panel.appendChild(list);

    const actions = document.createElement('div');
    actions.className = 'ot-rec-actions';

    const copy = document.createElement('button');
    copy.className = 'ot-rec-btn';
    copy.textContent = 'Copy JSON';
    copy.addEventListener('click', () => exportSpec());

    const stopBtn = document.createElement('button');
    stopBtn.className = 'ot-rec-btn ot-rec-btn--ghost';
    stopBtn.textContent = 'Stop';
    stopBtn.addEventListener('click', () => stop());

    actions.append(copy, stopBtn);
    panel.appendChild(actions);

    const hint = document.createElement('div');
    hint.style.cssText = 'margin-top:8px;opacity:0.55;font-size:11px;line-height:1.45';
    hint.textContent = 'Click any element to capture it. Esc stops recording.';
    panel.appendChild(hint);
  };

  const renumber = (): void => {
    captured.forEach((c, i) => { c.step.id = `step-${i + 1}`; });
  };

  const exportSpec = (): void => {
    const json = toJSON();
    if (opts.onExport) { opts.onExport(buildSpec(), json); return; }
    void navigator.clipboard?.writeText(json).catch(() => {
      // Clipboard is permission-gated; the console is a dependable fallback.
      console.log(json);
    });
  };

  const isOurs = (el: Element | null): boolean => !!el?.closest?.(PANEL_IGNORE);

  const onMove = (e: PointerEvent): void => {
    const el = e.target as Element | null;
    if (!el || isOurs(el)) { highlight.style.display = 'none'; label.style.display = 'none'; return; }

    const rect = el.getBoundingClientRect();
    highlight.style.display = '';
    highlight.style.left = `${rect.x}px`;
    highlight.style.top = `${rect.y}px`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;

    const best = bestSelector(el);
    label.style.display = '';
    label.textContent = best ? `${best.selector}  (${best.score})` : el.tagName.toLowerCase();
    // Flip above the element when there is no room below.
    const below = rect.y + rect.height + 4;
    label.style.left = `${Math.max(4, rect.x)}px`;
    label.style.top = below + 22 < window.innerHeight ? `${below}px` : `${Math.max(4, rect.y - 22)}px`;
  };

  const onClick = (e: MouseEvent): void => {
    const el = e.target as Element | null;
    if (!el || isOurs(el)) return;

    e.preventDefault();
    e.stopPropagation();

    const best = bestSelector(el);
    if (!best) return;

    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40);
    const step: TourStep = {
      id: `step-${captured.length + 1}`,
      target: {
        selector: best.fallbacks.length > 0 ? [best.selector, ...best.fallbacks] : best.selector,
        ...(best.score < minScore && best.text ? { text: best.text } : {}),
      },
      title: text || 'Untitled step',
      content: 'Describe what the user should do here.',
    };

    captured.push({ step, score: best.score, reason: best.reason });
    renderPanel();
    opts.onChange?.(buildSpec());
  };

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') { e.preventDefault(); stop(); }
  };

  // Capture phase so the host app never sees these interactions.
  document.addEventListener('pointermove', onMove, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKey, true);

  renderPanel();

  let stopped = false;
  const stop = (): void => {
    if (stopped) return;
    stopped = true;
    document.removeEventListener('pointermove', onMove, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKey, true);
    highlight.remove();
    label.remove();
    panel.remove();
    styleHost.remove();
  };

  return { stop, getSpec: buildSpec, toJSON };
}

/** Auto-start when the URL carries `?ot-record=1`. Call once during bootstrap. */
export function enableRecorderFromUrl(param = 'ot-record'): RecorderHandle | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(param);
    if (!value || value === '0' || value === 'false') return null;
    return startRecorder({ tourId: value === '1' ? undefined : value });
  } catch {
    return null;
  }
}
