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
import type { PersistedRoot } from './persist';
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
    /**
     * The one shared context. Engines hold mirrors of it, kept in step through
     * `applyContext`, so an answer given inside one tour is visible to the
     * audience rules, triggers and branches of every other.
     */
    private context;
    /** `context` triggers, with the last value of each expression for edge detection. */
    private contextTriggers;
    private watchers;
    private disposers;
    private queue;
    private activeId;
    private mounted;
    /** Impressions in this page session, for `frequency.perSession`. */
    private sessionCounts;
    constructor(specs: TutorialSpec[], opts?: OrchestratorOptions);
    private createEngine;
    /**
     * Register a tour after construction — one fetched from a server, built by a
     * feature flag, or generated on the fly. Replaces any tour with the same id.
     * Returns false when the spec fails validation (it is still registered, so
     * `whyBlocked` can explain why it will not run).
     */
    addSpec(spec: TutorialSpec): boolean;
    /** Unregister a tour, stopping it first if it is running. */
    removeSpec(tourId: string): boolean;
    private notifyState;
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
    /** The shared tour context. */
    getContext(): Record<string, unknown>;
    /** A change that started inside one engine — an interactive block or an action. */
    private onEngineContext;
    private afterContextChange;
    /**
     * Observe an expression over the context. `fn` runs whenever its value
     * changes — `watch("cart.length", n => badge.update(n))`. Returns an
     * unsubscribe function.
     */
    watch(expr: string, fn: (value: unknown, previous: unknown) => void): () => void;
    setTheme(theme: ThemeOverrides): void;
    setLocale(locale: string): void;
    setUser(userId: string | undefined): Promise<void>;
    /** Clear seen-state and progress for every tour. */
    reset(): void;
    resetProgress(): void;
    resetTour(tourId: string): void;
    /** Snapshot persisted state for every tour. See `TourEngine.exportProgress`. */
    exportProgress(): PersistedRoot | null;
    /** Restore a snapshot. All engines share one store, so one call covers them all. */
    importProgress(data: PersistedRoot | string, mode?: 'replace' | 'merge'): boolean;
    /** Install triggers, deep-link handling, chaining and cross-page resume. */
    mount(): void;
    private installTriggers;
    private installTriggerFor;
    private installDeepLink;
    private installAutoResume;
    private installChainListener;
    private handleEvent;
    destroy(): void;
}
