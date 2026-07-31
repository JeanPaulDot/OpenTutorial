import type { KeyValueStorage } from '../types';
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
export declare function createRemoteStorage(opts: RemoteStorageOptions): KeyValueStorage;
