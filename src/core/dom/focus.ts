/** Focus trap + restore for the popover dialog. */

export interface TrapOptions {
  onEscape?: () => void;
  onArrowNext?: () => void;
  onArrowPrev?: () => void;
  /** Confine Tab to the dialog. Off for non-blocking steps so the page stays reachable. */
  trap?: boolean;
  /** Move focus into the dialog on mount. Default true. */
  autoFocus?: boolean;
}

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * True when the user is typing. Keyboard navigation must never steal Enter,
 * Space or the arrow keys from a real input — including one the tour itself
 * renders, or one inside the highlighted element.
 */
function isTextEntry(el: Element | null): boolean {
  if (!el) return false;
  if ((el as HTMLElement).isContentEditable) return true;
  const tag = el.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag !== 'INPUT') return false;
  const type = (el as HTMLInputElement).type;
  return !['button', 'submit', 'reset', 'checkbox', 'radio', 'file'].includes(type);
}

export function trapFocus(container: HTMLElement, opts: TrapOptions = {}): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const shouldTrap = opts.trap !== false;

  const focusables = (): HTMLElement[] =>
    Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
      .filter((el) => el.getClientRects().length > 0 || el === document.activeElement);

  const onKeydown = (e: KeyboardEvent): void => {
    const active = (container.getRootNode() as Document | ShadowRoot).activeElement ?? document.activeElement;

    if (e.key === 'Escape') {
      opts.onEscape?.();
      e.stopPropagation();
      return;
    }

    if (isTextEntry(active)) return;

    if (e.key === 'ArrowRight') { opts.onArrowNext?.(); e.preventDefault(); return; }
    if (e.key === 'ArrowLeft') { opts.onArrowPrev?.(); e.preventDefault(); return; }

    // Enter advances only from the dialog surface itself. On a button, the
    // browser's own activation already does the right thing.
    if (e.key === 'Enter' && active === container) {
      opts.onArrowNext?.();
      e.preventDefault();
      return;
    }

    if (e.key !== 'Tab' || !shouldTrap) return;
    const items = focusables();
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (active === first || !container.contains(active))) {
      last.focus(); e.preventDefault();
    } else if (!e.shiftKey && active === last) {
      first.focus(); e.preventDefault();
    }
  };

  container.addEventListener('keydown', onKeydown);

  if (opts.autoFocus !== false) {
    container.focus({ preventScroll: true });
  }

  return () => {
    container.removeEventListener('keydown', onKeydown);
    // Only restore if focus is still inside the dialog — the user may have
    // clicked elsewhere deliberately, and yanking it back is disorienting.
    const active = document.activeElement;
    if (!active || active === document.body || container.contains(active)) {
      previouslyFocused?.focus?.({ preventScroll: true });
    }
  };
}
