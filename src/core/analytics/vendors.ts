import type { AnalyticsAdapter, TourEvent } from '../types';
import { toProperties, eventName, safely } from './common';

interface CaptureClient { capture: (event: string, properties?: Record<string, unknown>) => void }
interface TrackClient { track: (event: string, properties?: Record<string, unknown>) => void }

export function createPostHogAdapter(client: CaptureClient): AnalyticsAdapter {
  return (event) => safely(() => client.capture(eventName(event, '[Opentutorial]'), toProperties(event)));
}

export function createMixpanelAdapter(client: TrackClient): AnalyticsAdapter {
  return (event) => safely(() => client.track(eventName(event, '[Opentutorial]'), toProperties(event)));
}

export function createAmplitudeAdapter(client: TrackClient): AnalyticsAdapter {
  return (event) => safely(() =>
    client.track(eventName(event, '[Opentutorial]'), toProperties(event, { includeTimestamp: false })));
}

export function createSegmentAdapter(client: TrackClient): AnalyticsAdapter {
  return (event) => safely(() => client.track(eventName(event, 'Opentutorial'), toProperties(event)));
}

/** RudderStack mirrors Segment's `analytics.track` contract. */
export function createRudderStackAdapter(client: TrackClient): AnalyticsAdapter {
  return createSegmentAdapter(client);
}

interface HeapClient { track: (event: string, properties?: Record<string, unknown>) => void }

export function createHeapAdapter(client?: HeapClient): AnalyticsAdapter {
  return (event) => safely(() => {
    const heap = client ?? (window as unknown as { heap?: HeapClient }).heap;
    heap?.track(`Opentutorial ${event.type}`, toProperties(event));
  });
}

export function createGA4Adapter(measurementId?: string): AnalyticsAdapter {
  return (event) => safely(() => {
    const gtag = (window as unknown as Record<string, unknown>).gtag;
    if (typeof gtag !== 'function') return;
    (gtag as (...args: unknown[]) => void)('event', `opentutorial_${event.type.replace(/-/g, '_')}`, {
      ...toProperties(event, { includeTimestamp: false }),
      send_to: measurementId,
    });
  });
}

interface DatadogClient { addAction: (name: string, context?: Record<string, unknown>) => void }

export function createDatadogAdapter(client?: DatadogClient): AnalyticsAdapter {
  return (event) => safely(() => {
    const rum = client ?? (window as unknown as { DD_RUM?: DatadogClient }).DD_RUM;
    rum?.addAction(`opentutorial.${event.type}`, toProperties(event));
  });
}

/** Logs to the console. Handy while authoring specs. */
export function createDebugAdapter(log: (...args: unknown[]) => void = console.log): AnalyticsAdapter {
  return (event) => safely(() => log(`[opentutorial] ${event.type}`, toProperties(event)));
}

/** Fan one event out to several destinations; one failing never blocks the rest. */
export function createMultiAdapter(...adapters: Array<AnalyticsAdapter | undefined>): AnalyticsAdapter {
  const active = adapters.filter((a): a is AnalyticsAdapter => typeof a === 'function');
  return (event: TourEvent) => {
    for (const adapter of active) safely(() => adapter(event));
  };
}

/** Pass through only the event types you care about. */
export function filterEvents(
  adapter: AnalyticsAdapter,
  types: ReadonlyArray<TourEvent['type']>,
): AnalyticsAdapter {
  const allowed = new Set(types);
  return (event) => { if (allowed.has(event.type)) adapter(event); };
}
