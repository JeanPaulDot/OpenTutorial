import { resolveText } from '../i18n';
import { Disposers, attach, h, makeHandle, type SurfaceHandle } from './shared';
import type { TourController } from './controller';
import type { I18nContent, I18nResolver, TutorialSpec } from '../types';

export type ChecklistStatus = 'pending' | 'in_progress' | 'completed';

export interface ChecklistOptions {
  layer: TourController;
  /** Defaults to every spec registered on the layer. */
  specs?: TutorialSpec[];
  /** Override the derived status. Omit to read it from persisted state. */
  getStatus?: (id: string) => ChecklistStatus;
  onStart?: (id: string) => void;
  title?: string;
  startLabel?: string;
  runningLabel?: string;
  /** Dock bottom-right as a floating card. */
  floating?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  /** Hide entirely once every item is done. */
  hideWhenComplete?: boolean;
  locale?: string;
  i18nResolver?: I18nResolver;
  container?: HTMLElement | null;
  className?: string;
  onComplete?: () => void;
}

export interface ChecklistHandle extends SurfaceHandle {
  /** Re-derive every status and repaint. Called automatically on tour events. */
  refresh: () => void;
  setCollapsed: (collapsed: boolean) => void;
  getProgress: () => { completed: number; total: number; percent: number };
}

/**
 * Onboarding checklist, framework-free.
 *
 * Status comes from persisted tour state by default, and the list repaints on
 * every tour event — so completing a tour ticks its row without the host
 * wiring up a single subscription.
 */
export function createChecklist(options: ChecklistOptions): ChecklistHandle {
  const {
    layer, specs: specsOption, getStatus: getStatusOption, onStart,
    title = 'Onboarding', startLabel = 'Start', runningLabel = 'Running',
    floating = false, collapsible = false, defaultCollapsed = false,
    hideWhenComplete = false, locale = 'en', i18nResolver,
    container, className = '', onComplete,
  } = options;

  const disposers = new Disposers();
  let collapsed = defaultCollapsed;
  let announcedComplete = false;

  const el = h('div', 'ot-checklist');
  const items = h('ul', 'ot-checklist-items');
  const track = h('div', 'ot-checklist-bar-track');
  const fill = h('div', 'ot-checklist-bar-fill');
  const count = h('span', 'ot-checklist-count');
  const toggle = h('button', 'ot-checklist-toggle', { type: 'button' });

  track.setAttribute('role', 'progressbar');
  track.setAttribute('aria-valuemin', '0');
  track.setAttribute('aria-valuemax', '100');
  track.appendChild(fill);

  if (title) {
    const header = h('div', 'ot-checklist-header');
    header.appendChild(h('h3', 'ot-checklist-title', { text: title }));
    header.appendChild(count);
    if (collapsible) {
      toggle.addEventListener('click', () => setCollapsed(!collapsed));
      header.appendChild(toggle);
    }
    el.appendChild(header);
  }
  el.appendChild(track);
  el.appendChild(items);

  const specs = (): TutorialSpec[] => specsOption ?? layer.getSpecs();

  const statusOf = (id: string): ChecklistStatus => {
    if (getStatusOption) return getStatusOption(id);
    if (layer.getActiveId() === id) return 'in_progress';
    return layer.hasSeen(id) ? 'completed' : 'pending';
  };

  const text = (content: I18nContent | undefined): string =>
    (content === undefined ? '' : resolveText(content, locale, i18nResolver, layer.getContext()));

  let progress = { completed: 0, total: 0, percent: 0 };

  const refresh = (): void => {
    const list = specs();
    const statuses = list.map((spec) => statusOf(spec.id));
    const completed = statuses.filter((s) => s === 'completed').length;
    const percent = list.length > 0 ? Math.round((completed / list.length) * 100) : 0;
    progress = { completed, total: list.length, percent };

    count.textContent = `${completed}/${list.length}`;
    fill.style.width = `${percent}%`;
    track.setAttribute('aria-valuenow', String(percent));
    track.setAttribute('aria-label', `${completed} of ${list.length} complete`);

    items.replaceChildren();
    list.forEach((spec, i) => {
      const status = statuses[i];
      const li = h('li', `ot-checklist-item ot-checklist-item--${status}`);

      const icon = h('span', 'ot-checklist-icon', {
        text: status === 'completed' ? '✓' : status === 'in_progress' ? '◌' : '○',
      });
      icon.setAttribute('aria-hidden', 'true');
      li.appendChild(icon);

      const info = h('div', 'ot-checklist-info');
      info.appendChild(h('span', 'ot-checklist-name', { text: text(spec.title) }));
      const description = text(spec.description);
      if (description) info.appendChild(h('span', 'ot-checklist-desc', { text: description }));
      li.appendChild(info);

      if (status !== 'completed') {
        const btn = h('button', 'ot-checklist-btn', {
          type: 'button',
          text: status === 'in_progress' ? runningLabel : startLabel,
        });
        btn.disabled = status === 'in_progress';
        btn.addEventListener('click', () => {
          if (onStart) onStart(spec.id);
          else layer.start(spec.id);
        });
        li.appendChild(btn);
      }

      items.appendChild(li);
    });

    const allDone = list.length > 0 && completed === list.length;
    if (allDone && !announcedComplete) { announcedComplete = true; onComplete?.(); }
    if (!allDone) announcedComplete = false;

    el.hidden = allDone && hideWhenComplete;
    el.className = [
      'ot-checklist',
      floating ? 'ot-checklist--floating' : '',
      collapsed ? 'ot-checklist--collapsed' : '',
      className,
    ].filter(Boolean).join(' ');
  };

  function setCollapsed(next: boolean): void {
    collapsed = next;
    toggle.textContent = collapsed ? '▸' : '▾';
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Expand checklist' : 'Collapse checklist');
    refresh();
  }

  setCollapsed(collapsed);
  attach(el, container);
  disposers.add(layer.on('event', refresh));

  return {
    ...makeHandle(el, disposers),
    refresh,
    setCollapsed,
    getProgress: () => progress,
  };
}
