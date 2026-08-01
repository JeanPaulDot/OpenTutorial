import type { TourEvent, TutorialSpec } from '../types';
/**
 * The slice of a tour layer the list-shaped surfaces need.
 *
 * Declared structurally rather than importing `VanillaTutorialLayer`, so
 * `surfaces/` never depends on `adapters/` — the vanilla layer, an orchestrator
 * wrapper, or a hand-rolled stub in a test all satisfy it as-is.
 */
export interface TourController {
    getSpecs: () => TutorialSpec[];
    getContext: () => Record<string, unknown>;
    getActiveId: () => string | null;
    hasSeen: (tourId: string) => boolean;
    start: (tourId: string, stepId?: string) => void;
    /** Subscribe to every tour event; returns an unsubscribe function. */
    on: (event: 'event', handler: (e: TourEvent) => void) => () => void;
}
