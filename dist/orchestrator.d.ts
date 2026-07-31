/**
 * Owns a set of tours and guarantees that at most one runs at a time.
 *
 * v0.1 started every eligible `auto` tour on its own timer, so two overlays
 * could mount simultaneously. Here every start request — trigger, deep link,
 * chain, or explicit API call — funnels through `request()`, which checks
 * audience and frequency rules and either starts the tour or queues it by
 * priority for when the current one ends.
 */
import { TourEngine } from './engine';
import type { CreateTourOptions, ThemeOverrides, TourState, TutorialSpec } from './types';
export interface OrchestratorOptions extends CreateTourOptions {
    /** URL parameter that deep-links a tour. `false` disables deep linking. */
    deepLinkParam?: string | false;
    /** Called whenever the active tour or its state changes. */
    onStateChange?: (active: string | null, state: TourState | null) => void;
}
export declare class TourOrchestrator {
    private engines;
    private specs;
    private opts;
    private triggers;
    private disposers;
    private queue;
    private activeId;
    private mounted;
    /** Impressions in this page session, for `frequency.perSession`. */
    private sessionCounts;
    constructor(specs: TutorialSpec[], opts?: OrchestratorOptions);
    get ready(): Promise<void>;
    getEngine(tourId: string): TourEngine | undefined;
    getEngines(): TourEngine[];
    getSpecs(): TutorialSpec[];
    getActiveId(): string | null;
    getState(tourId?: string): TourState | null;
    hasSeen(tourId: string): boolean;
    /** Why a tour may not start right now, or null if it may. */
    checkEligibility(tourId: string): string | null;
    /**
     * Ask for a tour to run. Starts it when the stage is free and the rules pass,
     * otherwise queues it. Returns true when it started immediately.
     */
    request(tourId: string, stepId?: string, opts?: {
        force?: boolean;
        queue?: boolean;
    }): boolean;
    /** Start a tour immediately, preempting whatever is running. */
    start(tourId: string, stepId?: string): void;
    private enqueue;
    private drain;
    stop(reason?: string): void;
    pause(): void;
    resume(): void;
    setContext(patch: Record<string, unknown>): void;
    setTheme(theme: ThemeOverrides): void;
    setLocale(locale: string): void;
    setUser(userId: string | undefined): Promise<void>;
    /** Clear seen-state and progress for every tour. */
    reset(): void;
    resetProgress(): void;
    resetTour(tourId: string): void;
    /** Install triggers, deep-link handling, chaining and cross-page resume. */
    mount(): void;
    private installTriggers;
    private installDeepLink;
    private installAutoResume;
    private installChainListener;
    private handleEvent;
    destroy(): void;
}
