/**
 * Vue 3 adapter.
 *
 * Vue is deliberately *not* imported: this file only relies on the shape of
 * `app.provide`, so the package keeps `dependencies: {}` and Vue users install
 * nothing extra. Inject with your own `inject(TOUR_KEY)` inside components.
 *
 * ```ts
 * import { createApp } from 'vue';
 * import { createTourPlugin, TOUR_KEY } from '@opentutorial/core/vue';
 *
 * app.use(createTourPlugin({ specs, context: { plan: 'pro' } }));
 *
 * // in a component
 * const tour = inject(TOUR_KEY)!;
 * tour.start('welcome');
 * ```
 */
import { type VanillaOptions, type VanillaTutorialLayer } from './vanilla';
import type { TourEvent, TourState } from '../types';
/** Structural subset of Vue's `App` — avoids a hard dependency on `vue`. */
interface VueAppLike {
    provide(key: symbol | string, value: unknown): void;
    config?: {
        globalProperties?: Record<string, unknown>;
    };
    unmount?: () => void;
}
export declare const TOUR_KEY: unique symbol;
export interface VueTour extends VanillaTutorialLayer {
    /** Reactive-friendly snapshot; call inside a `computed` or after an event. */
    snapshot: () => {
        activeId: string | null;
        state: TourState | null;
    };
    /** Subscribe to every tour event. Returns an unsubscribe function. */
    subscribe: (fn: (e: TourEvent) => void) => () => void;
}
export interface TourPlugin {
    install(app: VueAppLike): void;
}
export declare function createTourPlugin(options: VanillaOptions): TourPlugin;
/** Standalone layer for `setup()` blocks that would rather not use provide/inject. */
export declare function createTour(options: VanillaOptions): VueTour;
export {};
