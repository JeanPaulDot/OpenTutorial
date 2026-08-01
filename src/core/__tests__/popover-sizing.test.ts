import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TourPopover, type PopoverModel } from '../dom/popover';
import type { Density } from '../types';

function model(overrides: Partial<PopoverModel> = {}): PopoverModel {
  return {
    stepId: 's1',
    title: 'Step',
    blocks: [{ type: 'text', value: 'Body' }],
    index: 0,
    total: 2,
    canGoBack: true,
    skippable: true,
    isLast: false,
    advanceOn: 'button',
    labels: { next: 'Next', back: 'Back', done: 'Done', skip: 'Skip' },
    showNext: true,
    showBack: true,
    modal: false,
    ...overrides,
  };
}

/**
 * jsdom reports 0 for every measurement, so `offsetWidth` is stubbed to answer
 * with a "natural" width whenever the popover is measuring itself.
 */
function stubNaturalWidth(popover: TourPopover, natural: number): void {
  Object.defineProperty(popover.el, 'offsetWidth', {
    configurable: true,
    get() {
      return this.style.width === 'max-content' ? natural : parseFloat(this.style.width) || 0;
    },
  });
}

function viewport(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
}

const cbs = { onNext: vi.fn(), onPrev: vi.fn(), onSkip: vi.fn() };

beforeEach(() => {
  document.body.innerHTML = '';
  viewport(1280, 900);
});

describe('density', () => {
  it('is absent by default so the stylesheet default applies', () => {
    const popover = new TourPopover(cbs);
    popover.render(model());
    expect(popover.el.dataset.otDensity).toBeUndefined();
  });

  it('reflects the density onto a data attribute', () => {
    for (const density of ['compact', 'comfortable', 'spacious'] as Density[]) {
      const popover = new TourPopover(cbs);
      popover.render(model({ density }));
      expect(popover.el.dataset.otDensity).toBe(density);
    }
  });

  it('clears the attribute when a later step has no density', () => {
    const popover = new TourPopover(cbs);
    popover.render(model({ density: 'compact' }));
    expect(popover.el.dataset.otDensity).toBe('compact');

    popover.render(model({ density: undefined }));
    expect(popover.el.dataset.otDensity).toBeUndefined();
  });
});

describe('auto-sizing', () => {
  it('caps the height at a share of the viewport', () => {
    viewport(1280, 800);
    const popover = new TourPopover(cbs);
    stubNaturalWidth(popover, 320);
    popover.render(model());

    // 70% of 800.
    expect(popover.el.style.maxHeight).toBe('560px');
  });

  it('adopts the natural content width when it is within bounds', () => {
    const popover = new TourPopover(cbs);
    stubNaturalWidth(popover, 320);
    popover.render(model());
    expect(popover.el.style.width).toBe('320px');
  });

  it('does not shrink below the minimum for short content', () => {
    const popover = new TourPopover(cbs);
    stubNaturalWidth(popover, 90);
    popover.render(model({ title: 'Hi', blocks: [{ type: 'text', value: 'Ok' }] }));
    expect(parseFloat(popover.el.style.width)).toBe(240);
  });

  it('does not grow past the maximum for long content', () => {
    const popover = new TourPopover(cbs);
    stubNaturalWidth(popover, 1200);
    popover.render(model());
    expect(parseFloat(popover.el.style.width)).toBe(460);
  });

  it('always fits inside a narrow desktop window with its margins', () => {
    // Just above the 480px bottom-sheet breakpoint — the tightest desktop case.
    viewport(500, 800);
    const popover = new TourPopover(cbs);
    stubNaturalWidth(popover, 900);
    popover.render(model());

    const width = parseFloat(popover.el.style.width);
    expect(width).toBeLessThanOrEqual(500 - 20);
    // The 460px maximum is the binding constraint here, by design: it is exactly
    // the widest card that still clears both margins at the breakpoint.
    expect(width).toBe(460);
  });

  it('leaves width to the stylesheet on a mobile bottom sheet', () => {
    viewport(390, 844);
    const popover = new TourPopover(cbs);
    stubNaturalWidth(popover, 320);
    popover.render(model());

    expect(popover.el.style.width).toBe('');
    // The height cap still applies, so a long step scrolls rather than overflows.
    expect(popover.el.style.maxHeight).toBe('591px');
  });

  it('can be turned off', () => {
    const popover = new TourPopover(cbs, 'ltr', { autoSize: false });
    stubNaturalWidth(popover, 320);
    popover.render(model());

    expect(popover.el.style.width).toBe('');
    expect(popover.el.style.maxHeight).not.toBe('');
  });

  it('re-measures on every render, so a longer step gets a wider card', () => {
    const popover = new TourPopover(cbs);
    let natural = 280;
    Object.defineProperty(popover.el, 'offsetWidth', {
      configurable: true,
      get() { return this.style.width === 'max-content' ? natural : parseFloat(this.style.width) || 0; },
    });

    popover.render(model());
    expect(popover.el.style.width).toBe('280px');

    natural = 420;
    popover.render(model({ blocks: [{ type: 'text', value: 'A much longer body of copy.' }] }));
    expect(popover.el.style.width).toBe('420px');
  });

  it('never leaves the measuring value behind', () => {
    const popover = new TourPopover(cbs);
    stubNaturalWidth(popover, 300);
    popover.render(model());
    expect(popover.el.style.width).not.toBe('max-content');
  });
});
