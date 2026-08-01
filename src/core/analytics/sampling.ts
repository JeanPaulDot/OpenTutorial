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

/** FNV-1a — small, dependency-free, and well spread for short ASCII keys. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Stable value in [0, 1) for a key. */
export function sampleValue(key: string): number {
  return hash(key) / 0x100000000;
}

/** Whether a key falls inside the sampled cohort at `rate`. */
export function shouldSample(key: string, rate: number, salt = ''): boolean {
  if (rate >= 1) return true;
  if (rate <= 0) return false;
  return sampleValue(`${salt}:${key}`) < rate;
}

/**
 * Wrap an adapter so only a stable fraction of tour runs reach it.
 *
 * ```ts
 * const adapter = withSampling(createPostHogAdapter(posthog), { rate: 0.1 });
 * ```
 */
export function withSampling(
  adapter: AnalyticsAdapter,
  options: SamplingOptions,
): AnalyticsAdapter {
  const { rate, key = (e: TourEvent) => e.tourId, always = [], salt = '' } = options;
  const alwaysSet = new Set<TourEventType>(always);
  // Memoised so a long tour hashes once, not once per step.
  const decisions = new Map<string, boolean>();

  return (event) => {
    if (alwaysSet.has(event.type)) { adapter(event); return; }

    const bucket = key(event);
    let keep = decisions.get(bucket);
    if (keep === undefined) {
      keep = shouldSample(bucket, rate, salt);
      decisions.set(bucket, keep);
    }
    if (keep) adapter(event);
  };
}

/**
 * Wrap an adapter so it only receives the listed event types.
 *
 * Complements sampling: sampling reduces *runs*, this reduces *kinds*. Sending
 * only terminal events is often enough for a dashboard and costs almost nothing.
 */
export function withEventTypes(
  adapter: AnalyticsAdapter,
  types: TourEventType[],
): AnalyticsAdapter {
  const allowed = new Set(types);
  return (event) => { if (allowed.has(event.type)) adapter(event); };
}
