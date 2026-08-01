import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TourPopover, type PopoverModel } from '../dom/popover';

function model(overrides: Partial<PopoverModel> = {}): PopoverModel {
  return {
    stepId: 's1',
    title: 'Step one',
    blocks: [{ type: 'text', value: 'Body copy' }],
    index: 1,
    total: 3,
    canGoBack: true,
    skippable: true,
    isLast: false,
    advanceOn: 'button',
    labels: { next: 'Next', back: 'Back', done: 'Done', skip: 'Skip tour' },
    showNext: true,
    showBack: true,
    modal: false,
    ...overrides,
  };
}

/** Give the popover a real size; jsdom reports zero for everything. */
function sizePopover(popover: TourPopover, width = 300, height = 160): void {
  Object.defineProperty(popover.el, 'offsetWidth', { value: width, configurable: true });
  Object.defineProperty(popover.el, 'offsetHeight', { value: height, configurable: true });
}

function touch(el: HTMLElement, type: string, x: number, y: number, target?: Element): void {
  const event = new Event(type, { bubbles: true }) as Event & {
    touches: unknown[]; changedTouches: unknown[];
  };
  const list = [{ clientX: x, clientY: y }];
  Object.defineProperty(event, 'touches', { value: type === 'touchend' ? [] : list });
  Object.defineProperty(event, 'changedTouches', { value: list });
  if (target) Object.defineProperty(event, 'target', { value: target });
  el.dispatchEvent(event);
}

let callbacks: { onNext: ReturnType<typeof vi.fn>; onPrev: ReturnType<typeof vi.fn>; onSkip: ReturnType<typeof vi.fn> };

beforeEach(() => {
  document.body.innerHTML = '';
  callbacks = { onNext: vi.fn(), onPrev: vi.fn(), onSkip: vi.fn() };
  Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
});

describe('TourPopover rendering', () => {
  it('renders title, content, dots and buttons', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model());

    expect(popover.el.querySelector('.ot-title')?.textContent).toBe('Step one');
    expect(popover.el.textContent).toContain('Body copy');
    expect(popover.el.querySelectorAll('.ot-dot')).toHaveLength(3);
    expect(popover.el.querySelectorAll('.ot-dot-active')).toHaveLength(1);
    expect((popover.el.querySelector('.ot-btn-primary') as HTMLElement).textContent).toBe('Next');
  });

  it('labels the primary button Done on the last step', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model({ isLast: true }));
    expect((popover.el.querySelector('.ot-btn-primary') as HTMLElement).textContent).toBe('Done');
  });

  it('hides Back on the first step and when disallowed', () => {
    const popover = new TourPopover(callbacks);
    const back = popover.el.querySelector('.ot-btn-ghost') as HTMLElement;

    popover.render(model({ index: 0 }));
    expect(back.style.display).toBe('none');

    popover.render(model({ index: 1, canGoBack: false }));
    expect(back.style.display).toBe('none');

    popover.render(model({ index: 1, canGoBack: true }));
    expect(back.style.display).toBe('');
  });

  it('hides the skip button when the step is not skippable', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model({ skippable: false }));
    expect((popover.el.querySelector('.ot-skip') as HTMLElement).style.display).toBe('none');
  });

  it('announces the step in a live region', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model());
    expect(popover.el.querySelector('.ot-sr-only')?.textContent).toBe('Step one. Step 2 of 3');
  });

  it('only claims aria-modal for modal steps', () => {
    const popover = new TourPopover(callbacks);

    popover.render(model({ modal: false }));
    expect(popover.el.getAttribute('aria-modal')).toBe('false');

    popover.render(model({ modal: true }));
    expect(popover.el.getAttribute('aria-modal')).toBe('true');
    expect(popover.el.classList.contains('ot-popover--modal-step')).toBe(true);
  });

  it('wires the buttons to the callbacks', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model());

    (popover.el.querySelector('.ot-btn-primary') as HTMLButtonElement).click();
    (popover.el.querySelector('.ot-btn-ghost') as HTMLButtonElement).click();
    (popover.el.querySelector('.ot-skip') as HTMLButtonElement).click();

    expect(callbacks.onNext).toHaveBeenCalledTimes(1);
    expect(callbacks.onPrev).toHaveBeenCalledTimes(1);
    expect(callbacks.onSkip).toHaveBeenCalledTimes(1);
  });
});

describe('TourPopover positioning', () => {
  const target = { x: 400, y: 300, width: 100, height: 40 };

  it('centres and drops the arrow when there is no target', () => {
    const popover = new TourPopover(callbacks);
    sizePopover(popover);
    popover.position(null, 'auto', 0);

    expect(popover.getSide()).toBe('modal');
    expect(popover.el.classList.contains('ot-modal')).toBe(true);
    expect((popover.el.querySelector('.ot-arrow') as HTMLElement).style.display).toBe('none');
  });

  it('honours an explicit side that fits', () => {
    const popover = new TourPopover(callbacks);
    sizePopover(popover);
    popover.position(target, 'bottom', 0);
    expect(popover.getSide()).toBe('bottom');
  });

  it('flips to the opposite side when the wanted one does not fit', () => {
    const popover = new TourPopover(callbacks);
    sizePopover(popover, 300, 400);
    // Only 20px above the target — not enough for a 400px popover.
    popover.position({ x: 400, y: 20, width: 100, height: 40 }, 'top', 0);
    expect(popover.getSide()).toBe('bottom');
  });

  it('auto picks the side with the most room', () => {
    const popover = new TourPopover(callbacks);
    sizePopover(popover, 200, 100);
    // Target near the top: below has far more space.
    popover.position({ x: 500, y: 10, width: 40, height: 20 }, 'auto', 0);
    expect(popover.getSide()).toBe('bottom');
  });

  it('clamps inside the viewport', () => {
    const popover = new TourPopover(callbacks);
    sizePopover(popover, 300, 160);
    popover.position({ x: 1000, y: 740, width: 20, height: 20 }, 'right', 0);

    const left = parseFloat(popover.el.style.left);
    const top = parseFloat(popover.el.style.top);
    expect(left).toBeGreaterThanOrEqual(10);
    expect(left).toBeLessThanOrEqual(1024 - 300 - 10);
    expect(top).toBeGreaterThanOrEqual(10);
  });

  it('mirrors left/right placements under RTL', () => {
    const ltr = new TourPopover(callbacks, 'ltr');
    sizePopover(ltr, 200, 100);
    ltr.position(target, 'left', 0);
    expect(ltr.getSide()).toBe('left');

    const rtl = new TourPopover(callbacks, 'rtl');
    sizePopover(rtl, 200, 100);
    rtl.position(target, 'left', 0);
    expect(rtl.getSide()).toBe('right');
  });

  it('setDir switches mirroring at runtime', () => {
    const popover = new TourPopover(callbacks, 'ltr');
    sizePopover(popover, 200, 100);
    popover.setDir('rtl');
    popover.position(target, 'right', 0);
    expect(popover.getSide()).toBe('left');
  });

  it('positions the arrow on the opposite edge', () => {
    const popover = new TourPopover(callbacks);
    sizePopover(popover, 300, 160);
    popover.position(target, 'bottom', 0);

    const arrow = popover.el.querySelector('.ot-arrow') as HTMLElement;
    expect(arrow.dataset.side).toBe('bottom');
    expect(arrow.style.top).toBe('-5px');
  });
});

describe('TourPopover swipe', () => {
  it('advances on a left swipe and rewinds on a right swipe', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model());

    touch(popover.el, 'touchstart', 300, 100);
    touch(popover.el, 'touchend', 200, 105);
    expect(callbacks.onNext).toHaveBeenCalledTimes(1);

    touch(popover.el, 'touchstart', 200, 100);
    touch(popover.el, 'touchend', 300, 98);
    expect(callbacks.onPrev).toHaveBeenCalledTimes(1);
  });

  it('reverses direction under RTL', () => {
    const popover = new TourPopover(callbacks, 'rtl');
    popover.render(model());

    touch(popover.el, 'touchstart', 200, 100);
    touch(popover.el, 'touchend', 300, 100);
    expect(callbacks.onNext).toHaveBeenCalledTimes(1);
  });

  it('ignores short travel and vertical scrolling', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model());

    touch(popover.el, 'touchstart', 300, 100);
    touch(popover.el, 'touchend', 280, 100);   // too short
    touch(popover.el, 'touchstart', 300, 100);
    touch(popover.el, 'touchend', 200, 200);   // mostly vertical

    expect(callbacks.onNext).not.toHaveBeenCalled();
  });

  it('does not advance past a step that hides its Next button', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model({ showNext: false, advanceOn: 'target-click' }));

    touch(popover.el, 'touchstart', 300, 100);
    touch(popover.el, 'touchend', 200, 100);
    expect(callbacks.onNext).not.toHaveBeenCalled();
  });

  it('does not rewind from the first step', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model({ index: 0 }));

    touch(popover.el, 'touchstart', 200, 100);
    touch(popover.el, 'touchend', 300, 100);
    expect(callbacks.onPrev).not.toHaveBeenCalled();
  });

  it('ignores gestures that start on a control', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model());
    const button = popover.el.querySelector('.ot-btn-primary') as HTMLElement;

    touch(popover.el, 'touchstart', 300, 100, button);
    touch(popover.el, 'touchend', 200, 100, button);
    expect(callbacks.onNext).not.toHaveBeenCalled();
  });

  it('can be disabled', () => {
    const popover = new TourPopover(callbacks, 'ltr', { swipe: false });
    popover.render(model());

    touch(popover.el, 'touchstart', 300, 100);
    touch(popover.el, 'touchend', 200, 100);
    expect(callbacks.onNext).not.toHaveBeenCalled();
  });

  it('stops responding after destroy', () => {
    const popover = new TourPopover(callbacks);
    popover.render(model());
    document.body.appendChild(popover.el);

    popover.destroy();
    expect(document.body.contains(popover.el)).toBe(false);

    touch(popover.el, 'touchstart', 300, 100);
    touch(popover.el, 'touchend', 200, 100);
    expect(callbacks.onNext).not.toHaveBeenCalled();
  });
});
