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

import { createTutorialLayer, type VanillaOptions, type VanillaTutorialLayer } from './vanilla';
import type { TourEvent, TourState } from '../types';

/** Structural subset of Vue's `App` — avoids a hard dependency on `vue`. */
interface VueAppLike {
  provide(key: symbol | string, value: unknown): void;
  config?: { globalProperties?: Record<string, unknown> };
  unmount?: () => void;
}

export const TOUR_KEY: unique symbol = Symbol.for('opentutorial');

export interface VueTour extends VanillaTutorialLayer {
  /** Reactive-friendly snapshot; call inside a `computed` or after an event. */
  snapshot: () => { activeId: string | null; state: TourState | null };
  /** Subscribe to every tour event. Returns an unsubscribe function. */
  subscribe: (fn: (e: TourEvent) => void) => () => void;
}

function decorate(layer: VanillaTutorialLayer): VueTour {
  return Object.assign(layer, {
    snapshot: () => ({ activeId: layer.getActiveId(), state: layer.getState() }),
    subscribe: (fn: (e: TourEvent) => void) => layer.on('event', fn),
  });
}

export interface TourPlugin {
  install(app: VueAppLike): void;
}

export function createTourPlugin(options: VanillaOptions): TourPlugin {
  return {
    install(app: VueAppLike) {
      const layer = decorate(createTutorialLayer(options));
      app.provide(TOUR_KEY, layer);
      if (app.config?.globalProperties) {
        app.config.globalProperties.$tour = layer;
      }
      const originalUnmount = app.unmount?.bind(app);
      if (originalUnmount) {
        app.unmount = () => { layer.destroy(); originalUnmount(); };
      }
    },
  };
}

/** Standalone layer for `setup()` blocks that would rather not use provide/inject. */
export function createTour(options: VanillaOptions): VueTour {
  return decorate(createTutorialLayer(options));
}
