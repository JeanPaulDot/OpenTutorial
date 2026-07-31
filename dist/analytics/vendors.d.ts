import type { AnalyticsAdapter, TourEvent } from '../types';
interface CaptureClient {
    capture: (event: string, properties?: Record<string, unknown>) => void;
}
interface TrackClient {
    track: (event: string, properties?: Record<string, unknown>) => void;
}
export declare function createPostHogAdapter(client: CaptureClient): AnalyticsAdapter;
export declare function createMixpanelAdapter(client: TrackClient): AnalyticsAdapter;
export declare function createAmplitudeAdapter(client: TrackClient): AnalyticsAdapter;
export declare function createSegmentAdapter(client: TrackClient): AnalyticsAdapter;
/** RudderStack mirrors Segment's `analytics.track` contract. */
export declare function createRudderStackAdapter(client: TrackClient): AnalyticsAdapter;
interface HeapClient {
    track: (event: string, properties?: Record<string, unknown>) => void;
}
export declare function createHeapAdapter(client?: HeapClient): AnalyticsAdapter;
export declare function createGA4Adapter(measurementId?: string): AnalyticsAdapter;
interface DatadogClient {
    addAction: (name: string, context?: Record<string, unknown>) => void;
}
export declare function createDatadogAdapter(client?: DatadogClient): AnalyticsAdapter;
/** Logs to the console. Handy while authoring specs. */
export declare function createDebugAdapter(log?: (...args: unknown[]) => void): AnalyticsAdapter;
/** Fan one event out to several destinations; one failing never blocks the rest. */
export declare function createMultiAdapter(...adapters: Array<AnalyticsAdapter | undefined>): AnalyticsAdapter;
/** Pass through only the event types you care about. */
export declare function filterEvents(adapter: AnalyticsAdapter, types: ReadonlyArray<TourEvent['type']>): AnalyticsAdapter;
export {};
