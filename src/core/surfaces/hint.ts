import { resolveTarget } from '../dom/target';
import { renderInline } from '../markdown';
import { Disposers, attach, h, makeHandle, type SurfaceHandle } from './shared';
import type { TourTarget } from '../types';

export interface HintOptions {
  target: TourTarget | string;
  /** Inline markdown. */
  content: string;
  /** Character shown in the dot. Default "?". */
  glyph?: string;
  openOnHover?: boolean;
  zIndex?: number;
  container?: HTMLElement | null;
  className?: string;
}

export interface HintHandle extends SurfaceHandle {
  open: () => void;
  close: () => void;
  /** Re-measure now, for hosts that move the target without resizing. */
  reposition: () => void;
}

/**
 * A standalone "what is this?" marker pinned to an element, framework-free.
 *
 * Position is recomputed on scroll, resize and layout changes rather than once
 * at mount, so the dot stays on its target in a scrolling or reflowing page.
 */
export function createHint(options: HintOptions): HintHandle {
  const {
    target, content, glyph = '?', openOnHover = false, zIndex, container, className = '',
  } = options;

  const disposers = new Disposers();
  const resolved: TourTarget = typeof target === 'string' ? { selector: target } : target;

  const el = h('div', `ot-hint ${className}`.trim());
  if (zIndex !== undefined) el.style.zIndex = String(zIndex);
  el.hidden = true;

  const dot = h('button', 'ot-hint-dot', { type: 'button', text: glyph });
  dot.setAttribute('aria-expanded', 'false');
  dot.setAttribute('aria-label', 'Show hint');

  const panel = h('div', 'ot-hint-panel', { html: renderInline(content) });
  panel.setAttribute('role', 'tooltip');
  panel.hidden = true;

  const setOpen = (open: boolean): void => {
    panel.hidden = !open;
    dot.setAttribute('aria-expanded', String(open));
    dot.setAttribute('aria-label', open ? 'Hide hint' : 'Show hint');
  };

  dot.addEventListener('click', () => setOpen(panel.hidden));
  if (openOnHover) {
    el.addEventListener('mouseenter', () => setOpen(true));
    el.addEventListener('mouseleave', () => setOpen(false));
  }

  el.appendChild(dot);
  el.appendChild(panel);
  attach(el, container);

  let frame = 0;

  const measure = (): void => {
    const found = resolveTarget(resolved);
    if (!found) { el.hidden = true; return; }
    const rect = found.element.getBoundingClientRect();
    el.hidden = false;
    el.style.left = `${rect.x + found.frameOffset.x + rect.width}px`;
    el.style.top = `${rect.y + found.frameOffset.y}px`;
  };

  const schedule = (): void => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(measure);
  };

  measure();
  disposers.listen(window, 'resize', schedule);
  disposers.listen(window, 'scroll', schedule, { capture: true });
  disposers.add(() => cancelAnimationFrame(frame));

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    disposers.add(() => observer.disconnect());
  }

  return {
    ...makeHandle(el, disposers),
    open: () => setOpen(true),
    close: () => setOpen(false),
    reposition: measure,
  };
}
