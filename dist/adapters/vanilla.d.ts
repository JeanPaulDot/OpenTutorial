import { type OrchestratorOptions } from '../orchestrator';
import type { TourEngine } from '../engine';
import type { PersistedRoot } from '../persist';
import type { KeyValueStorage, ThemeOverrides, TourEvent, TourState, TutorialSpec } from '../types';
export type VanillaEventName = 'start' | 'stop' | 'skip' | 'complete' | 'step' | 'event' | 'destroy';
/** What `subscribe` delivers and `getSnapshot` returns. */
export interface LayerSnapshot {
    activeId: string | null;
    state: TourState | null;
    context: Record<string, unknown>;
}
/**
 * A serializable instruction for the layer.
 *
 * Everything the imperative API can do, as plain data — so a tour can be
 * driven over `postMessage`, from a test script, or by an AI agent that emits
 * JSON rather than calling functions.
 */
export type LayerCommand = {
    type: 'start';
    tourId: string;
    stepId?: string;
} | {
    type: 'request';
    tourId: string;
    stepId?: string;
} | {
    type: 'stop';
} | {
    type: 'next';
} | {
    type: 'prev';
} | {
    type: 'goTo';
    stepId: string;
} | {
    type: 'pause';
} | {
    type: 'resume';
} | {
    type: 'setContext';
    patch: Record<string, unknown>;
} | {
    type: 'addSpec';
    spec: TutorialSpec;
} | {
    type: 'removeSpec';
    tourId: string;
} | {
    type: 'reset';
    tourId?: string;
};
export interface VanillaTutorialLayer {
    start: (tourId: string, stepId?: string) => void;
    request: (tourId: string, stepId?: string) => boolean;
    stop: () => void;
    skip: (tourId?: string) => void;
    pause: () => void;
    resume: () => void;
    next: () => void;
    prev: () => void;
    goTo: (stepId: string) => void;
    getState: (tourId?: string) => TourState | null;
    getActiveId: () => string | null;
    getSpecs: () => TutorialSpec[];
    hasSeen: (tourId: string) => boolean;
    whyBlocked: (tourId: string) => string | null;
    getContext: () => Record<string, unknown>;
    setContext: (patch: Record<string, unknown>) => void;
    setTheme: (theme: ThemeOverrides) => void;
    setLocale: (locale: string) => void;
    setUser: (userId: string | undefined) => Promise<void>;
    reset: () => void;
    resetTour: (tourId: string) => void;
    resetProgress: () => void;
    exportProgress: () => PersistedRoot | null;
    importProgress: (data: PersistedRoot | string, mode?: 'replace' | 'merge') => boolean;
    getEngine: (tourId: string) => TourEngine | undefined;
    /** Register a tour at runtime. Replaces one with the same id. False if invalid. */
    addSpec: (spec: TutorialSpec) => boolean;
    /** Unregister a tour, stopping it first if it is running. */
    removeSpec: (tourId: string) => boolean;
    /**
     * A framework-neutral store over `{ activeId, state, context }`.
     *
     * `subscribe` calls `run` immediately and again on every change, which is the
     * Svelte store contract; `getSnapshot` is referentially stable between
     * changes, which is what React's `useSyncExternalStore` requires:
     *
     *   useSyncExternalStore(cb => layer.store.subscribe(() => cb()), layer.store.getSnapshot)
     *
     * Nested under `store` because the Svelte, Vue and Solid adapters each
     * already expose their own `subscribe` / `watch` with different shapes.
     */
    store: {
        subscribe: (run: (snapshot: LayerSnapshot) => void) => () => void;
        getSnapshot: () => LayerSnapshot;
    };
    /** Run `fn` whenever an expression over the context changes value. */
    watchContext: (expr: string, fn: (value: unknown, previous: unknown) => void) => () => void;
    /** Execute a serializable command. Returns false for an unknown one. */
    dispatch: (command: LayerCommand) => boolean;
    on: (event: VanillaEventName, handler: (detail: TourEvent) => void) => () => void;
    off: (event: VanillaEventName, handler: (detail: TourEvent) => void) => void;
    ready: Promise<void>;
    destroy: () => void;
}
export interface VanillaOptions extends OrchestratorOptions {
    specs: TutorialSpec[];
    /** Install triggers and deep links immediately. Default true. */
    autoMount?: boolean;
    /**
     * Shorthand for `persistence.storage`.
     *
     * `TourProvider` has accepted a top-level `storage` prop since 0.1, so the
     * nested-only form here was a trap: passing `storage` to a non-React adapter
     * silently fell through to localStorage. Both spellings work now; the nested
     * one wins if you somehow pass both.
     */
    storage?: KeyValueStorage;
    /** Shorthand for `persistence.keyPrefix`. Default `"ot"`. */
    keyPrefix?: string;
}
export declare function createTutorialLayer(opts: VanillaOptions): VanillaTutorialLayer;
