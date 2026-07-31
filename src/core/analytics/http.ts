import type { AnalyticsAdapter, KeyValueStorage, TourEvent } from '../types';
import { toProperties, safely } from './common';

export interface HttpAdapterOptions {
  endpoint: string;
  headers?: Record<string, string> | (() => Record<string, string>);
  /** Flush once this many events have queued. Default 20. */
  batchSize?: number;
  /** Flush at most this often, in ms. Default 5000. */
  flushMs?: number;
  /** Persist unsent events so a refresh or an outage does not lose them. */
  storage?: KeyValueStorage;
  storageKey?: string;
  /** Drop events beyond this backlog. Default 500. */
  maxQueue?: number;
  transform?: (event: TourEvent) => Record<string, unknown>;
  fetchImpl?: typeof fetch;
  onError?: (err: unknown, batch: Record<string, unknown>[]) => void;
}

/**
 * Generic HTTP sink with batching and an offline queue.
 *
 * POSTs `{ events: [...] }`. Failed batches go back to the front of the queue
 * and are retried on the next flush, on `online`, and on `pagehide` — where
 * `sendBeacon` is used because a normal fetch is cancelled during unload.
 */
export function createHttpAdapter(opts: HttpAdapterOptions): AnalyticsAdapter {
  const {
    endpoint,
    headers,
    batchSize = 20,
    flushMs = 5000,
    storage,
    storageKey = 'ot:analytics:queue',
    maxQueue = 500,
    transform,
    fetchImpl,
    onError,
  } = opts;

  const doFetch = fetchImpl ?? (typeof fetch === 'function' ? fetch.bind(globalThis) : undefined);
  let queue: Record<string, unknown>[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;
  let flushing = false;

  const hdrs = (): Record<string, string> => ({
    'content-type': 'application/json',
    ...(typeof headers === 'function' ? headers() : (headers ?? {})),
  });

  const persist = (): void => {
    if (!storage) return;
    safely(() => storage.setItem(storageKey, JSON.stringify(queue)));
  };

  // Restore anything left over from a previous page load.
  if (storage) {
    void Promise.resolve(storage.getItem(storageKey)).then((raw) => {
      if (typeof raw !== 'string') return;
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>[];
        if (Array.isArray(parsed)) queue = [...parsed, ...queue].slice(-maxQueue);
      } catch { /* corrupted backlog */ }
    });
  }

  const flush = async (): Promise<void> => {
    if (flushing || queue.length === 0 || !doFetch) return;
    flushing = true;
    const batch = queue.splice(0, Math.max(batchSize, 1));
    persist();
    try {
      const res = await doFetch(endpoint, {
        method: 'POST',
        headers: hdrs(),
        body: JSON.stringify({ events: batch }),
        keepalive: true,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      queue = [...batch, ...queue].slice(-maxQueue);
      persist();
      onError?.(err, batch);
    } finally {
      flushing = false;
    }
  };

  const schedule = (): void => {
    if (timer) return;
    timer = setTimeout(() => { timer = null; void flush(); }, flushMs);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => void flush());
    window.addEventListener('pagehide', () => {
      if (queue.length === 0) return;
      // A regular fetch is cancelled on unload; sendBeacon survives it.
      const sent = safelyBeacon(endpoint, { events: queue });
      if (sent) { queue = []; persist(); }
    });
  }

  return (event: TourEvent) => safely(() => {
    queue.push(transform ? transform(event) : toProperties(event));
    if (queue.length > maxQueue) queue = queue.slice(-maxQueue);
    persist();
    if (queue.length >= batchSize) void flush();
    else schedule();
  });
}

function safelyBeacon(url: string, payload: unknown): boolean {
  try {
    if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') return false;
    return navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  } catch {
    return false;
  }
}
