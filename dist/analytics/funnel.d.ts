import type { TourEvent, TutorialSpec } from '../types';
export interface FunnelStep {
    stepId: string;
    index: number;
    /** Sessions that reached this step. */
    views: number;
    /** Sessions that advanced past it. */
    completions: number;
    /** Sessions that ended the tour here. */
    dropOffs: number;
    /** Share of viewers who did not continue, 0–1. */
    dropOffRate: number;
    medianDurationMs: number;
}
export interface FunnelReport {
    tourId: string;
    starts: number;
    completions: number;
    skips: number;
    completionRate: number;
    medianDurationMs: number;
    steps: FunnelStep[];
    /** The step losing the most users, if any did. */
    worstStep: FunnelStep | null;
    targetsNotFound: Array<{
        stepId: string;
        selector: string;
        count: number;
    }>;
}
/**
 * Build a drop-off report from a raw event stream.
 *
 * Answers the question every tour author actually has — "where do people quit?"
 * — without needing a warehouse. Feed it the events collected from `onEvent`.
 */
export declare function createFunnelReport(events: readonly TourEvent[], tourId: string, spec?: TutorialSpec): FunnelReport;
/** Collects events in memory so `createFunnelReport` has something to read. */
export declare function createEventCollector(limit?: number): {
    adapter: (e: TourEvent) => void;
    events: TourEvent[];
    report: (tourId: string, spec?: TutorialSpec) => FunnelReport;
    clear: () => void;
};
