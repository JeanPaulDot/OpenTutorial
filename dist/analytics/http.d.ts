import type { AnalyticsAdapter, KeyValueStorage, TourEvent } from '../types';
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
export declare function createHttpAdapter(opts: HttpAdapterOptions): AnalyticsAdapter;
