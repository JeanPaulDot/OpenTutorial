import type { TourEvent } from '../types';
/**
 * Flatten an event into analytics properties.
 *
 * Always returns a fresh object. The v0.1 Amplitude adapter cast the live event
 * and `delete`d a key from it, corrupting the event for every listener that ran
 * afterwards — building a copy here makes that class of bug impossible.
 */
export declare function toProperties(event: TourEvent, opts?: {
    includeTimestamp?: boolean;
}): Record<string, unknown>;
export declare function eventName(event: TourEvent, prefix?: string): string;
/** Guard every adapter: analytics must never break a tour. */
export declare function safely(fn: () => void): void;
