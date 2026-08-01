import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trapFocus } from '../dom/focus';
import { TourHotspot } from '../dom/hotspot';
import { TourLayer } from '../dom/layer';

function key(el: HTMLElement, k: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
}

/** jsdom reports no client rects, which the focus trap uses to skip hidden nodes. */
function makeVisible(el: Element): void {
  el.getClientRects = () => ([{ width: 10, height: 10 }] as unknown as DOMRectList);
}

beforeEach(() => {
  document.body.innerHTML = '';
  Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
});

describe('trapFocus', () => {
  function dialog(): HTMLElement {
    document.body.innerHTML = `
      <button id="outside">outside</button>
      <div id="dialog" tabindex="-1">
        <button id="first">first</button>
        <input id="text" type="text" />
        <button id="last">last</button>
      </div>
    `;
    const el = document.getElementById('dialog')!;
    el.querySelectorAll('*').forEach(makeVisible);
    return el;
  }

  it('focuses the container on mount and restores focus on release', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();

    const el = dialog();
    document.body.appendChild(outside);
    outside.focus();

    const release = trapFocus(el);
    expect(document.activeElement).toBe(el);

    release();
    expect(document.activeElement).toBe(outside);
  });

  it('can skip auto-focus', () => {
    const el = dialog();
    const release = trapFocus(el, { autoFocus: false });
    expect(document.activeElement).not.toBe(el);
    release();
  });

  it('calls onEscape', () => {
    const el = dialog();
    const onEscape = vi.fn();
    const release = trapFocus(el, { onEscape });

    key(el, 'Escape');
    expect(onEscape).toHaveBeenCalledTimes(1);
    release();
  });

  it('maps arrow keys to next and previous', () => {
    const el = dialog();
    const onArrowNext = vi.fn();
    const onArrowPrev = vi.fn();
    const release = trapFocus(el, { onArrowNext, onArrowPrev });

    expect(key(el, 'ArrowRight').defaultPrevented).toBe(true);
    expect(key(el, 'ArrowLeft').defaultPrevented).toBe(true);
    expect(onArrowNext).toHaveBeenCalledTimes(1);
    expect(onArrowPrev).toHaveBeenCalledTimes(1);
    release();
  });

  it('advances on Enter only from the dialog surface itself', () => {
    const el = dialog();
    const onArrowNext = vi.fn();
    const release = trapFocus(el, { onArrowNext });

    el.focus();
    key(el, 'Enter');
    expect(onArrowNext).toHaveBeenCalledTimes(1);

    // From a button, the browser's own activation already does the right thing.
    (document.getElementById('first') as HTMLButtonElement).focus();
    key(el, 'Enter');
    expect(onArrowNext).toHaveBeenCalledTimes(1);
    release();
  });

  it('never steals keys while the user is typing', () => {
    const el = dialog();
    const onArrowNext = vi.fn();
    const onArrowPrev = vi.fn();
    const release = trapFocus(el, { onArrowNext, onArrowPrev });

    (document.getElementById('text') as HTMLInputElement).focus();
    key(el, 'ArrowRight');
    key(el, 'ArrowLeft');
    key(el, 'Enter');

    expect(onArrowNext).not.toHaveBeenCalled();
    expect(onArrowPrev).not.toHaveBeenCalled();
    release();
  });

  it('still handles Escape while typing, so the tour is always dismissible', () => {
    const el = dialog();
    const onEscape = vi.fn();
    const release = trapFocus(el, { onEscape });

    (document.getElementById('text') as HTMLInputElement).focus();
    key(el, 'Escape');
    expect(onEscape).toHaveBeenCalledTimes(1);
    release();
  });

  it('wraps Tab from the last focusable back to the first', () => {
    const el = dialog();
    const release = trapFocus(el);

    (document.getElementById('last') as HTMLButtonElement).focus();
    const event = key(el, 'Tab');

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('first');
    release();
  });

  it('wraps Shift+Tab from the first focusable to the last', () => {
    const el = dialog();
    const release = trapFocus(el);

    (document.getElementById('first') as HTMLButtonElement).focus();
    const event = key(el, 'Tab', { shiftKey: true });

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('last');
    release();
  });

  it('lets Tab escape when trapping is off', () => {
    const el = dialog();
    const release = trapFocus(el, { trap: false });

    (document.getElementById('last') as HTMLButtonElement).focus();
    expect(key(el, 'Tab').defaultPrevented).toBe(false);
    release();
  });

  it('does not yank focus back if the user moved it away deliberately', () => {
    const el = dialog();
    const outside = document.getElementById('outside') as HTMLButtonElement;
    makeVisible(outside);

    const release = trapFocus(el);
    outside.focus();
    release();

    expect(document.activeElement).toBe(outside);
  });
});

describe('TourHotspot', () => {
  const rect = { x: 100, y: 200, width: 50, height: 20 };

  it('positions the beacon at the centre of the target', () => {
    const hotspot = new TourHotspot();
    hotspot.render({ display: 'beacon', content: 'Look here' }, rect);

    expect(hotspot.el.style.left).toBe('125px');
    expect(hotspot.el.style.top).toBe('210px');
    hotspot.destroy();
  });

  it('beacon mode uses a title and renders no tooltip', () => {
    const hotspot = new TourHotspot();
    hotspot.render({ display: 'beacon', content: 'Tip text' }, rect);

    const beacon = hotspot.el.querySelector('.ot-beacon') as HTMLButtonElement;
    expect(beacon.className).toContain('ot-beacon--beacon');
    expect(beacon.title).toBe('Tip text');
    expect(hotspot.el.querySelector('.ot-hotspot-tooltip')).toBeNull();
    hotspot.destroy();
  });

  it('hotspot mode renders a tooltip with markdown and a dismiss control', () => {
    const hotspot = new TourHotspot();
    hotspot.render({ display: 'hotspot', content: 'Click **here**' }, rect);

    const tooltip = hotspot.el.querySelector('.ot-hotspot-tooltip')!;
    expect(tooltip.innerHTML).toContain('<strong>here</strong>');
    expect(hotspot.el.querySelector('.ot-hotspot-dismiss')).not.toBeNull();
    hotspot.destroy();
  });

  it('falls back to a generic aria-label with no content', () => {
    const hotspot = new TourHotspot();
    hotspot.render({ display: 'beacon' }, rect);
    expect(hotspot.el.querySelector('.ot-beacon')?.getAttribute('aria-label')).toBe('Show me');
    hotspot.destroy();
  });

  it('fires onDismiss from the beacon and from the tooltip button', () => {
    const onDismiss = vi.fn();
    const hotspot = new TourHotspot();
    hotspot.render({ display: 'hotspot', content: 'x', onDismiss }, rect);

    (hotspot.el.querySelector('.ot-beacon') as HTMLButtonElement).click();
    (hotspot.el.querySelector('.ot-hotspot-dismiss') as HTMLButtonElement).click();
    expect(onDismiss).toHaveBeenCalledTimes(2);
    hotspot.destroy();
  });

  it('re-rendering never stacks duplicate dismiss handlers', () => {
    const onDismiss = vi.fn();
    const hotspot = new TourHotspot();

    hotspot.render({ display: 'hotspot', content: 'a', onDismiss }, rect);
    hotspot.render({ display: 'hotspot', content: 'b', onDismiss }, rect);
    hotspot.render({ display: 'hotspot', content: 'c', onDismiss }, rect);

    (hotspot.el.querySelector('.ot-beacon') as HTMLButtonElement).click();
    expect(onDismiss).toHaveBeenCalledTimes(1);
    hotspot.destroy();
  });

  it('flips the tooltip to the left when there is no room on the right', () => {
    const hotspot = new TourHotspot();
    hotspot.render({ display: 'hotspot', content: 'x' }, { x: 1000, y: 100, width: 20, height: 20 });

    const tooltip = hotspot.el.querySelector('.ot-hotspot-tooltip') as HTMLElement;
    expect(tooltip.style.right).toBe('12px');
    expect(tooltip.style.left).toBe('auto');
    hotspot.destroy();
  });

  it('reposition moves the beacon', () => {
    const hotspot = new TourHotspot();
    hotspot.render({ display: 'hotspot', content: 'x' }, rect);
    hotspot.reposition({ x: 0, y: 0, width: 10, height: 10 });

    expect(hotspot.el.style.left).toBe('5px');
    expect(hotspot.el.style.top).toBe('5px');
    hotspot.destroy();
  });

  it('reposition before render is a no-op', () => {
    const hotspot = new TourHotspot();
    expect(() => hotspot.reposition(rect)).not.toThrow();
    expect(hotspot.el.style.left).toBe('');
    hotspot.destroy();
  });

  it('switching from hotspot to beacon hides the tooltip', () => {
    const hotspot = new TourHotspot();
    hotspot.render({ display: 'hotspot', content: 'x' }, rect);
    hotspot.render({ display: 'beacon', content: 'x' }, rect);

    const tooltip = hotspot.el.querySelector('.ot-hotspot-tooltip') as HTMLElement;
    expect(tooltip.style.display).toBe('none');
    hotspot.destroy();
  });

  it('destroy detaches the element', () => {
    const hotspot = new TourHotspot();
    document.body.appendChild(hotspot.el);
    hotspot.destroy();
    expect(document.body.contains(hotspot.el)).toBe(false);
  });
});

describe('TourLayer', () => {
  it('attaches to the body and tears down cleanly', () => {
    const layer = new TourLayer(9999);
    expect(document.querySelector('.ot-root')).toBeNull();

    layer.attach();
    expect(document.querySelector('.ot-root')).not.toBeNull();

    layer.destroy();
    expect(document.querySelector('.ot-root')).toBeNull();
  });

  it('attaches to a custom parent', () => {
    const host = document.createElement('section');
    document.body.appendChild(host);

    const layer = new TourLayer(9999);
    layer.attach(host);
    expect(host.querySelector('.ot-root')).not.toBeNull();
    layer.destroy();
  });

  it('isolates in a shadow root when asked', () => {
    const layer = new TourLayer(9999, { isolate: true });
    layer.attach();

    // The root lives in a shadow tree, so a light-DOM query cannot reach it.
    expect(document.querySelector('.ot-root')).toBeNull();
    expect(document.querySelector('[data-opentutorial-host]')).not.toBeNull();
    layer.destroy();
  });

  it('applies the z-index as a custom property', () => {
    const layer = new TourLayer(12345);
    expect(layer.root.style.getPropertyValue('--ot-z')).toBe('12345');
    layer.destroy();
  });

  it('sets and updates the direction attribute', () => {
    const layer = new TourLayer(9999, { dir: 'rtl' });
    expect(layer.root.getAttribute('dir')).toBe('rtl');

    layer.setDir('ltr');
    expect(layer.root.getAttribute('dir')).toBe('ltr');
    layer.destroy();
  });

  it('mounts a popover inside the layer root', () => {
    const layer = new TourLayer(9999);
    layer.attach();

    const popover = document.createElement('div');
    popover.className = 'my-popover';
    layer.mountPopover(popover);

    expect(layer.root.querySelector('.my-popover')).not.toBeNull();
    layer.destroy();
  });

  it('switches interaction modes without throwing', () => {
    const layer = new TourLayer(9999);
    layer.attach();
    layer.updateSpotlight({ x: 10, y: 10, width: 100, height: 40 });

    for (const mode of ['free', 'target-only', 'blocked'] as const) {
      expect(() => layer.setInteraction(mode)).not.toThrow();
    }
    layer.destroy();
  });

  it('clearing the spotlight is safe', () => {
    const layer = new TourLayer(9999);
    layer.attach();
    layer.updateSpotlight({ x: 0, y: 0, width: 10, height: 10 });
    expect(() => layer.updateSpotlight(null)).not.toThrow();
    expect(() => layer.refresh()).not.toThrow();
    layer.destroy();
  });

  it('accepts a backdrop colour override', () => {
    const layer = new TourLayer(9999);
    layer.attach();
    layer.setBackdropColor('rgba(0, 0, 0, 0.9)');
    layer.showBackdrop();
    layer.destroy();
  });

  it('destroy is idempotent', () => {
    const layer = new TourLayer(9999);
    layer.attach();
    layer.destroy();
    expect(() => layer.destroy()).not.toThrow();
  });
});
