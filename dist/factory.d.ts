import { TourEngine } from './engine';
import { TourOrchestrator, type OrchestratorOptions } from './orchestrator';
import type { CreateTourOptions, TutorialSpec, TourStep } from './types';
export declare function createTour(spec: TutorialSpec, opts?: CreateTourOptions): TourEngine;
/** Manage several tours with one active at a time, triggers, and a priority queue. */
export declare function createTours(specs: TutorialSpec[], opts?: OrchestratorOptions): TourOrchestrator;
/**
 * Identity function that pins the literal types of a spec.
 *
 * Pass your context type to get autocomplete on the ids your own code
 * references — `spec.steps[number]['id']` becomes a union of the real step ids
 * rather than `string`, so a typo in `next` or `goTo` is a compile error.
 *
 * ```ts
 * const spec = defineSpec({ id: 'welcome', steps: [{ id: 'intro', ... }] });
 * type StepId = SpecStepId<typeof spec>;  // 'intro'
 * ```
 */
export declare function defineSpec<const T extends TutorialSpec>(spec: T): T;
/** Union of the step ids declared in a spec. */
export type SpecStepId<T extends TutorialSpec> = T['steps'][number]['id'];
/** Build a step with the same literal-type preservation. */
export declare function defineStep<const T extends TourStep>(step: T): T;
/**
 * Merge partial overrides into a spec — for per-tenant or per-locale variants
 * that differ only in copy or theme.
 */
export declare function extendSpec<T extends TutorialSpec>(base: T, overrides: Partial<Omit<TutorialSpec, 'steps'>> & {
    steps?: Record<string, Partial<TourStep>>;
}): T;
