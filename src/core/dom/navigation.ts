/**
 * Location tracking for route triggers and `advanceOn: 'url-match'`.
 *
 * `popstate` only fires on back/forward, so SPA navigations via `pushState` are
 * invisible without patching. The patch is installed once, is idempotent, and
 * always calls through to the original method.
 */

const EVENT = 'opentutorial:locationchange';
let patched = false;

function patchHistory(): void {
  if (patched || typeof history === 'undefined') return;
  patched = true;

  const notify = (): void => {
    try { window.dispatchEvent(new Event(EVENT)); } catch { /* noop */ }
  };

  for (const method of ['pushState', 'replaceState'] as const) {
    const original = history[method];
    if (typeof original !== 'function') continue;
    history[method] = function patchedMethod(this: History, ...args: Parameters<History['pushState']>) {
      const result = original.apply(this, args);
      notify();
      return result;
    };
  }
}

export function currentPath(): string {
  if (typeof location === 'undefined') return '';
  return location.pathname + location.search + location.hash;
}

/**
 * Match a path pattern. Supports a trailing `*` wildcard and `:param` segments;
 * anything else is compared literally.
 */
export function matchPath(pattern: string, path: string, exact = false): boolean {
  if (!pattern) return false;
  const cleanPath = path.split('#')[0];

  if (pattern.endsWith('*')) {
    return cleanPath.startsWith(pattern.slice(0, -1));
  }

  if (pattern.includes(':')) {
    const source = pattern
      .split('/')
      .map((seg) => (seg.startsWith(':') ? '[^/]+' : seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      .join('/');
    try {
      return new RegExp(`^${source}${exact ? '$' : '(/|$|\\?)'}`).test(cleanPath);
    } catch {
      return false;
    }
  }

  const withoutQuery = cleanPath.split('?')[0];
  return exact ? withoutQuery === pattern : withoutQuery.startsWith(pattern);
}

/** Subscribe to every location change, including SPA pushes. */
export function onLocationChange(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  patchHistory();
  window.addEventListener('popstate', cb);
  window.addEventListener('hashchange', cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener('popstate', cb);
    window.removeEventListener('hashchange', cb);
    window.removeEventListener(EVENT, cb);
  };
}
