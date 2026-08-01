import { type OrchestratorOptions } from '../orchestrator';
import type { TourEngine } from '../engine';
import type { PersistedRoot } from '../persist';
import type { KeyValueStorage, ThemeOverrides, TourEvent, TourState, TutorialSpec } from '../types';
export type VanillaEventName = 'start' | 'stop' | 'skip' | 'complete' | 'step' | 'event' | 'destroy';
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
