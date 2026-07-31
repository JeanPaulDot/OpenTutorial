import type { KeyValueStorage } from '../types';
import { MemoryStorage, defaultStorage } from './memory';

export interface RemoteStorageOptions {
  /**
   * Base endpoint. The adapter issues:
   *   GET  `${endpoint}/${encodeURIComponent(key)}`  → `{ "value": string | null }`
   *   PUT  `${endpoint}/${encodeURIComponent(key)}`  → body `{ "value": string }`
   *   DELETE `${endpoint}/${encodeURIComponent(key)}`
   */
  endpoint: string;
  headers?: Record<string, string> | (() => Record<string, string>);
  /** Cache layer for instant reads and offline survival. Defaults to localStorage. */
  cache?: KeyValueStorage | false;
  /** Milliseconds to coalesce writes before flushing. Default 400. */
  debounceMs?: number;
  fetchImpl?: typeof fetch;
  onError?: (err: unknown, op: 'get' | 'put' | 'delete', key: string) => void;
}

/**
 * Server-backed storage for cross-device progress.
 *
 * Reads hit the local cache first and resolve immediately; the network result
 * back-fills the cache. Writes go to the cache synchronously and are flushed to
 * the server on a debounce, with failed flushes retried on the next write and on
 * `online`. Nothing here can block or throw into the tour.
 */
export function createRemoteStorage(opts: RemoteStorageOptions): KeyValueStorage {
  const {
    endpoint,
    headers,
    debounceMs = 400,
    fetchImpl,
    onError,
  } = opts;

  const cache: KeyValueStorage =
    opts.cache === false ? new MemoryStorage() : (opts.cache ?? defaultStorage());

  const doFetch: typeof fetch | undefined =
    fetchImpl ?? (typeof fetch === 'function' ? fetch.bind(globalThis) : undefined);

  const base = endpoint.replace(/\/$/, '');
  const url = (key: string) => `${base}/${encodeURIComponent(key)}`;
  const hdrs = () => ({
    'content-type': 'application/json',
    ...(typeof headers === 'function' ? headers() : (headers ?? {})),
  });

  /** key → pending value; null means pending delete. */
  const pending = new Map<string, string | null>();
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = async (): Promise<void> => {
    if (!doFetch || pending.size === 0) return;
    const batch = [...pending.entries()];
    pending.clear();
    for (const [key, value] of batch) {
      try {
        const res = await doFetch(url(key), {
          method: value === null ? 'DELETE' : 'PUT',
          headers: hdrs(),
          body: value === null ? undefined : JSON.stringify({ value }),
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        // Re-queue only if no newer write superseded this key.
        if (!pending.has(key)) pending.set(key, value);
        onError?.(err, value === null ? 'delete' : 'put', key);
      }
    }
  };

  const schedule = (): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; void flush(); }, debounceMs);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => void flush());
    window.addEventListener('pagehide', () => void flush());
  }

  return {
    getItem(key: string) {
      const cached = cache.getItem(key);
      if (cached !== null && cached !== undefined) return cached;
      if (!doFetch) return null;
      return doFetch(url(key), { headers: hdrs(), credentials: 'include' })
        .then((res) => (res.ok ? res.json() : null))
        .then((body: { value?: string | null } | null) => {
          const value = body?.value ?? null;
          if (typeof value === 'string') cache.setItem(key, value);
          return value;
        })
        .catch((err) => { onError?.(err, 'get', key); return null; });
    },
    setItem(key: string, value: string) {
      cache.setItem(key, value);
      pending.set(key, value);
      schedule();
    },
    removeItem(key: string) {
      cache.removeItem(key);
      pending.set(key, null);
      schedule();
    },
  };
}
