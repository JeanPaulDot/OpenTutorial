import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { installTrigger } from '../triggers';
import { currentPath, matchPath, onLocationChange } from '../dom/navigation';

describe('matchPath', () => {
  it('matches a prefix by default and the whole path when exact', () => {
    expect(matchPath('/app', '/app/settings')).toBe(true);
    expect(matchPath('/app', '/app/settings', true)).toBe(false);
    expect(matchPath('/app', '/app', true)).toBe(true);
  });

  it('supports a trailing wildcard', () => {
    expect(matchPath('/docs/*', '/docs/getting-started')).toBe(true);
    expect(matchPath('/docs/*', '/blog')).toBe(false);
  });

  it('supports :param segments', () => {
    expect(matchPath('/users/:id', '/users/42')).toBe(true);
    expect(matchPath('/users/:id', '/users/42/edit')).toBe(true);
    expect(matchPath('/users/:id', '/users/42/edit', true)).toBe(false);
    expect(matchPath('/users/:id', '/teams/42')).toBe(false);
  });

  it('ignores the hash and query when comparing literally', () => {
    expect(matchPath('/app', '/app?tab=1#top', true)).toBe(true);
  });

  it('never matches an empty pattern', () => {
    expect(matchPath('', '/anything')).toBe(false);
  });
});

describe('onLocationChange', () => {
  afterEach(() => { window.history.replaceState({}, '', '/'); });

  it('fires on pushState, replaceState and popstate', () => {
    const seen = vi.fn();
    const off = onLocationChange(seen);

    window.history.pushState({}, '', '/pushed');
    expect(seen).toHaveBeenCalledTimes(1);
    expect(currentPath()).toBe('/pushed');

    window.history.replaceState({}, '', '/replaced');
    expect(seen).toHaveBeenCalledTimes(2);

    window.dispatchEvent(new Event('popstate'));
    expect(seen).toHaveBeenCalledTimes(3);

    off();
    window.history.pushState({}, '', '/after-off');
    expect(seen).toHaveBeenCalledTimes(3);
  });
});

describe('installTrigger', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/');
  });
  afterEach(() => { vi.useRealTimers(); });

  it('does nothing for manual or undefined triggers', () => {
    const fire = vi.fn();
    installTrigger(undefined, fire).dispose();
    installTrigger({ type: 'manual' }, fire).dispose();
    expect(fire).not.toHaveBeenCalled();
  });

  it('auto fires immediately', () => {
    const fire = vi.fn();
    installTrigger({ type: 'auto' }, fire);
    expect(fire).toHaveBeenCalledTimes(1);
  });

  it('auto honours delay', () => {
    const fire = vi.fn();
    installTrigger({ type: 'auto', delay: 500 }, fire);
    expect(fire).not.toHaveBeenCalled();
    vi.advanceTimersByTime(499);
    expect(fire).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fire).toHaveBeenCalledTimes(1);
  });

  it('a pending delayed fire is cancelled by dispose', () => {
    const fire = vi.fn();
    const handle = installTrigger({ type: 'auto', delay: 500 }, fire);
    handle.dispose();
    vi.advanceTimersByTime(1000);
    expect(fire).not.toHaveBeenCalled();
  });

  it('event fires on a window event, once by default', () => {
    const fire = vi.fn();
    const handle = installTrigger({ type: 'event', event: 'checkout:done' }, fire);

    window.dispatchEvent(new Event('checkout:done'));
    window.dispatchEvent(new Event('checkout:done'));
    expect(fire).toHaveBeenCalledTimes(1);

    handle.dispose();
    window.dispatchEvent(new Event('checkout:done'));
    expect(fire).toHaveBeenCalledTimes(1);
  });

  it('event can fire repeatedly when once is false', () => {
    const fire = vi.fn();
    installTrigger({ type: 'event', event: 'ping', once: false }, fire);
    window.dispatchEvent(new Event('ping'));
    window.dispatchEvent(new Event('ping'));
    expect(fire).toHaveBeenCalledTimes(2);
  });

  it('route fires when the current path matches on install', () => {
    window.history.replaceState({}, '', '/billing');
    const fire = vi.fn();
    installTrigger({ type: 'route', path: '/billing' }, fire);
    expect(fire).toHaveBeenCalledTimes(1);
  });

  it('route fires on navigation into the path', () => {
    const fire = vi.fn();
    installTrigger({ type: 'route', path: '/reports' }, fire);
    expect(fire).not.toHaveBeenCalled();

    window.history.pushState({}, '', '/reports');
    expect(fire).toHaveBeenCalledTimes(1);
  });

  it('route can re-fire after leaving and returning when once is false', () => {
    const fire = vi.fn();
    installTrigger({ type: 'route', path: '/inbox', once: false }, fire);

    window.history.pushState({}, '', '/inbox');
    expect(fire).toHaveBeenCalledTimes(1);

    window.history.pushState({}, '', '/elsewhere');
    window.history.pushState({}, '', '/inbox');
    expect(fire).toHaveBeenCalledTimes(2);
  });

  it('element fires once a matching visible element appears', async () => {
    const fire = vi.fn();
    installTrigger({ type: 'element', selector: '#late' }, fire);

    const el = document.createElement('div');
    el.id = 'late';
    el.getBoundingClientRect = () => ({
      x: 0, y: 0, width: 10, height: 10, top: 0, left: 0, right: 10, bottom: 10, toJSON: () => ({}),
    }) as DOMRect;
    document.body.appendChild(el);

    await vi.advanceTimersByTimeAsync(150);
    expect(fire).toHaveBeenCalledTimes(1);
  });

  it('idle fires after the quiet period and is reset by input', () => {
    const fire = vi.fn();
    installTrigger({ type: 'idle', ms: 1000 }, fire);

    vi.advanceTimersByTime(900);
    window.dispatchEvent(new Event('keydown'));
    vi.advanceTimersByTime(900);
    expect(fire).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fire).toHaveBeenCalledTimes(1);
  });

  it('scroll fires past the configured depth and ignores unscrollable pages', () => {
    const fire = vi.fn();
    const doc = document.documentElement;
    const define = (key: string, value: number): void => {
      Object.defineProperty(doc, key, { value, configurable: true });
    };

    // Not scrollable yet.
    define('scrollHeight', 500);
    define('clientHeight', 500);
    define('scrollTop', 0);
    installTrigger({ type: 'scroll', percent: 50 }, fire);
    expect(fire).not.toHaveBeenCalled();

    define('scrollHeight', 2000);
    define('clientHeight', 1000);
    define('scrollTop', 100);
    window.dispatchEvent(new Event('scroll'));
    expect(fire).not.toHaveBeenCalled();

    define('scrollTop', 600);
    window.dispatchEvent(new Event('scroll'));
    expect(fire).toHaveBeenCalledTimes(1);
  });
});
