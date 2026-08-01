import { normalizeContent, renderBlocks } from '../content';
import { resolveText } from '../i18n';
import {
  Disposers, SurfaceState, attach, button, h, makeHandle,
  type DismissibleOptions, type SurfaceHandle,
} from './shared';
import type { I18nResolver, StepContent } from '../types';

export interface AnnouncementOptions extends DismissibleOptions {
  title: string;
  content: StepContent;
  /** Show only once. Default true. */
  once?: boolean;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  dismissible?: boolean;
  allowHtml?: boolean;
  locale?: string;
  i18nResolver?: I18nResolver;
  userId?: string;
  className?: string;
  onDismiss?: () => void;
}

export interface AnnouncementHandle extends SurfaceHandle {
  close: () => void;
}

/**
 * A centered modal for product announcements, framework-free.
 *
 * Shares the tour content model, so images, video, lists and code blocks render
 * through exactly the same path a step body does.
 */
export function createAnnouncement(options: AnnouncementOptions): AnnouncementHandle {
  const {
    id, title, content, once = true, primaryAction, secondaryAction,
    dismissible = true, allowHtml, locale = 'en', i18nResolver,
    storage, keyPrefix = 'ot-announce', userId, container, className = '', onDismiss,
  } = options;

  const disposers = new Disposers();
  const state = new SurfaceState(storage, keyPrefix, userId);

  const root = h('div', 'ot-root');
  root.setAttribute('data-opentutorial', '');
  root.hidden = true;

  const backdrop = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  backdrop.setAttribute('class', 'ot-backdrop');
  backdrop.setAttribute('width', '100%');
  backdrop.setAttribute('height', '100%');
  backdrop.setAttribute('aria-hidden', 'true');
  const dim = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  dim.setAttribute('class', 'ot-dim');
  dim.setAttribute('width', '100%');
  dim.setAttribute('height', '100%');
  backdrop.appendChild(dim);

  const titleId = `ot-announce-${id}`;
  const dialog = h('div', `ot-popover ot-modal ot-popover--modal-step ${className}`.trim());
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', titleId);
  dialog.style.left = '50%';
  dialog.style.top = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';

  const body = h('div', 'ot-body');

  const close = (acted: boolean): void => {
    if (once) { if (acted) state.markActed(id); else state.markDismissed(id); }
    root.hidden = true;
    if (!acted) onDismiss?.();
  };

  if (dismissible) {
    const skip = button('ot-skip', '×', () => close(false));
    skip.setAttribute('aria-label', 'Dismiss');
    body.appendChild(skip);
  }

  const heading = h('h2', 'ot-title', { text: title });
  heading.id = titleId;
  body.appendChild(heading);

  const wrap = h('div', 'ot-content-wrap');
  const blocks = normalizeContent(content, (c) => resolveText(c, locale, i18nResolver));
  wrap.appendChild(renderBlocks(blocks, { allowHtml }));
  body.appendChild(wrap);

  const footer = h('div', 'ot-footer');
  footer.appendChild(h('span'));
  const btns = h('div', 'ot-btns');
  if (secondaryAction) {
    btns.appendChild(button('ot-btn ot-btn-ghost', secondaryAction.label, () => {
      close(true);
      secondaryAction.onClick();
    }));
  }
  btns.appendChild(button('ot-btn ot-btn-primary', primaryAction?.label ?? 'Got it', () => {
    close(true);
    primaryAction?.onClick();
  }));
  footer.appendChild(btns);
  body.appendChild(footer);

  dialog.appendChild(body);
  root.appendChild(backdrop);
  root.appendChild(dialog);
  attach(root, container);

  if (dismissible) {
    disposers.listen(window, 'keydown', (e) => {
      if (!root.hidden && (e as KeyboardEvent).key === 'Escape') close(false);
    });
  }

  let alive = true;
  disposers.add(() => { alive = false; });
  void state.ready.then(() => {
    if (!alive) return;
    root.hidden = !state.shouldShow(id, { once });
    if (!root.hidden) dialog.focus?.();
  });

  return {
    ...makeHandle(root, disposers),
    close: () => close(false),
  };
}
