/** Focus trap + restore for the popover dialog. */

export interface TrapOptions {
  onEscape?: () => void;
  onArrowNext?: () => void;
  onArrowPrev?: () => void;
}

export function trapFocus(container: HTMLElement, opts: TrapOptions = {}): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const focusables = (): HTMLElement[] =>
    Array.from(
      container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { opts.onEscape?.(); e.stopPropagation(); return; }
    if (e.key === 'ArrowRight' || (e.key === 'Enter' && !(document.activeElement instanceof HTMLButtonElement))) {
      opts.onArrowNext?.(); e.preventDefault(); return;
    }
    if (e.key === 'ArrowLeft') { opts.onArrowPrev?.(); e.preventDefault(); return; }
    if (e.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !container.contains(active))) {
      last.focus(); e.preventDefault();
    } else if (!e.shiftKey && active === last) {
      first.focus(); e.preventDefault();
    }
  };

  container.addEventListener('keydown', onKeydown);

  // Move focus into the dialog for screen readers (container has tabindex=-1).
  container.focus({ preventScroll: true });

  return () => {
    container.removeEventListener('keydown', onKeydown);
    previouslyFocused?.focus?.({ preventScroll: true });
  };
}
