/**
 * Event sampling.
 *
 * Sampling analytics per *event* would destroy the thing tours are measured by:
 * a funnel. Drop 90% of events at random and `step-shown` for step 3 loses a
 * different 90% than step 4, so the drop-off curve becomes noise.
 *
 * So the sampling unit here is the **tour run**, not the event. One decision is
 * made per key (the tour id by default) and every event sharing that key follows
 * it — a sampled-in run reports all of its steps, a sampled-out run reports none,
 * and the surviving funnels are complete and simply scaled down.
 *
 * The decision is a hash, not `Math.random()`, so it is stable: the same key
 * yields the same verdict across reloads, tabs and devices. Pass a user id as
 * the key and you get a consistent cohort rather than a per-visit coin flip.
 */
import type { AnalyticsAdapter, TourEvent, TourEventType } from '../types';
export interface SamplingOptions {
    /** Fraction of tour runs to keep, 0–1. `1` keeps everything, `0` drops all. */
    rate: number;
    /**
     * What to sample by. Defaults to the tour id, which keeps whole funnels
     * intact. Return a user id to sample by user across every tour instead.
     */
    key?: (event: TourEvent) => string;
    /** Event types that bypass sampling entirely — diagnostics, usually. */
    always?: TourEventType[];
    /** Extra salt, so two adapters at the same rate do not pick the same cohort. */
    salt?: string;
}
/** Stable value in [0, 1) for a key. */
export declare function sampleValue(key: string): number;
/** Whether a key falls inside the sampled cohort at `rate`. */
export declare function shouldSample(key: string, rate: number, salt?: string): boolean;
/**
 * Wrap an adapter so only a stable fraction of tour runs reach it.
 *
 * ```ts
 * const adapter = withSampling(createPostHogAdapter(posthog), { rate: 0.1 });
 * ```
 */
export declare function withSampling(adapter: AnalyticsAdapter, options: SamplingOptions): AnalyticsAdapter;
/**
 * Wrap an adapter so it only receives the listed event types.
 *
 * Complements sampling: sampling reduces *runs*, this reduces *kinds*. Sending
 * only terminal events is often enough for a dashboard and costs almost nothing.
 */
export declare function withEventTypes(adapter: AnalyticsAdapter, types: TourEventType[]): AnalyticsAdapter;
