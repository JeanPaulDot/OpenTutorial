import { renderInline } from '../markdown';
import {
  Disposers, SurfaceState, attach, button, h, makeHandle,
  type DismissibleOptions, type SurfaceHandle,
} from './shared';

export interface BannerOptions extends DismissibleOptions {
  /** Inline markdown: **bold**, *italic*, `code`, [links](https://…). */
  message: string;
  position?: 'top' | 'bottom';
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  /** Re-show this long after dismissal. Omit to dismiss permanently. */
  resurfaceAfter?: number;
  userId?: string;
  className?: string;
  onDismiss?: () => void;
}

export interface BannerHandle extends SurfaceHandle {
  /** Swap the message without rebuilding the banner. */
  setMessage: (message: string) => void;
  dismiss: () => void;
}

/**
 * A persistent announcement bar, framework-free.
 *
 * Hidden until persistence has hydrated, so a dismissed banner never flashes
 * on screen while an async storage adapter is still loading.
 */
export function createBanner(options: BannerOptions): BannerHandle {
  const {
    id, message, position = 'top', action, dismissible = true, resurfaceAfter,
    storage, keyPrefix = 'ot-banner', userId, container, className = '', onDismiss,
  } = options;

  const disposers = new Disposers();
  const state = new SurfaceState(storage, keyPrefix, userId);

  const el = h('div', `ot-banner ot-banner--${position} ${className}`.trim());
  el.setAttribute('role', 'status');
  el.hidden = true;

  const content = h('span', 'ot-banner-content', { html: renderInline(message) });
  el.appendChild(content);

  if (action) {
    el.appendChild(button('ot-banner-action', action.label, action.onClick));
  }

  const dismiss = (): void => {
    state.markDismissed(id);
    el.hidden = true;
    onDismiss?.();
  };

  if (dismissible) {
    const close = button('ot-banner-dismiss', '×', dismiss);
    close.setAttribute('aria-label', 'Dismiss');
    el.appendChild(close);
  }

  attach(el, container);

  let alive = true;
  disposers.add(() => { alive = false; });
  void state.ready.then(() => {
    if (!alive) return;
    el.hidden = !state.shouldShow(id, { resurfaceAfter });
  });

  return {
    ...makeHandle(el, disposers),
    setMessage(next: string) { content.innerHTML = renderInline(next); },
    dismiss,
  };
}
