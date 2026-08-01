import type { TourEvent } from '../types';

/**
 * Flatten an event into analytics properties.
 *
 * Always returns a fresh object. The v0.1 Amplitude adapter cast the live event
 * and `delete`d a key from it, corrupting the event for every listener that ran
 * afterwards — building a copy here makes that class of bug impossible.
 */
export function toProperties(
  event: TourEvent,
  opts: { includeTimestamp?: boolean } = {},
): Record<string, unknown> {
  const props: Record<string, unknown> = {
    tour_id: event.tourId,
    event_type: event.type,
  };
  if (event.stepId !== undefined) props.step_id = event.stepId;
  if (event.index !== undefined) props.step_index = event.index;
  if (event.total !== undefined) props.step_total = event.total;
  if (event.duration !== undefined) props.duration_ms = event.duration;
  if (event.reason !== undefined) props.reason = event.reason;
  if (event.selector !== undefined) props.selector = event.selector;
  if (event.message !== undefined) props.message = event.message;
  if (event.meta) Object.assign(props, event.meta);
  if (opts.includeTimestamp !== false) props.timestamp = event.timestamp;
  return props;
}

export function eventName(event: TourEvent, prefix = 'OpenTutorial'): string {
  return `${prefix} ${event.type}`;
}

/** Guard every adapter: analytics must never break a tour. */
export function safely(fn: () => void): void {
  try { fn(); } catch { /* intentionally swallowed */ }
}
