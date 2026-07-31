import { type OrchestratorOptions } from '../orchestrator';
import type { TourEngine } from '../engine';
import type { ThemeOverrides, TourEvent, TourState, TutorialSpec } from '../types';
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
    hasSeen: (tourId: string) => boolean;
    whyBlocked: (tourId: string) => string | null;
    setContext: (patch: Record<string, unknown>) => void;
    setTheme: (theme: ThemeOverrides) => void;
    setLocale: (locale: string) => void;
    setUser: (userId: string | undefined) => Promise<void>;
    reset: () => void;
    resetTour: (tourId: string) => void;
    resetProgress: () => void;
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
}
export declare function createTutorialLayer(opts: VanillaOptions): VanillaTutorialLayer;
