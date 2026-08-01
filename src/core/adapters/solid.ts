/**
 * Solid adapter.
 *
 * `solid-js` is deliberately *not* imported — the package would then need Solid
 * as a peer and pin its version. Instead the layer exposes a subscribe function
 * you feed into your own signal, which is two lines at the call site and keeps
 * `dependencies: {}` intact.
 *
 * ```tsx
 * import { createSignal, onCleanup } from 'solid-js';
 * import { createTourLayer, tourAnchor } from '@opentutorial/core/solid';
 *
 * const layer = createTourLayer({ specs });
 * const [tour, setTour] = createSignal(layer.snapshot());
 * onCleanup(layer.watch(setTour));
 * onCleanup(() => layer.destroy());
 *
 * // `tourAnchor` must be in scope for Solid to keep the `use:` directive
 * void tourAnchor;
 * <button use:tourAnchor="start-btn" onClick={() => layer.start('welcome')}>
 *   Step {tour().state?.index ?? 0}
 * </button>
 * ```
 */

import { createTutorialLayer, type VanillaOptions, type VanillaTutorialLayer } from './vanilla';
import type { TourEvent, TourState } from '../types';

export interface TourSnapshot {
  activeId: string | null;
  state: TourState | null;
}

export interface SolidTourLayer extends VanillaTutorialLayer {
  /** Current active tour and state. */
  snapshot: () => TourSnapshot;
  /** Push state into a setter; returns an unsubscribe suitable for `onCleanup`. */
  watch: (setter: (value: TourSnapshot) => void) => () => void;
  /** Push every tour event into a handler; returns an unsubscribe. */
  watchEvents: (handler: (event: TourEvent) => void) => () => void;
}

export function createTourLayer(options: VanillaOptions): SolidTourLayer {
  const watchers = new Set<(value: TourSnapshot) => void>();
  let value: TourSnapshot = { activeId: null, state: null };

  const layer = createTutorialLayer({
    ...options,
    onStateChange: (activeId, state) => {
      value = { activeId, state };
      for (const watcher of watchers) {
        try { watcher(value); } catch { /* a subscriber must not break the tour */ }
      }
      options.onStateChange?.(activeId, state);
    },
  });

  return Object.assign(layer, {
    snapshot: () => value,
    watch(setter: (next: TourSnapshot) => void) {
      watchers.add(setter);
      setter(value);
      return () => { watchers.delete(setter); };
    },
    watchEvents(handler: (event: TourEvent) => void) {
      return layer.on('event', handler);
    },
  });
}

/**
 * `use:tourAnchor="sidebar"` tags an element with `data-tour="sidebar"`.
 *
 * Solid passes the directive value as an accessor, so a signal-driven id
 * re-tags the element when it changes.
 */
export function tourAnchor(node: HTMLElement, accessor: () => string): void {
  const id = accessor();
  if (id) node.setAttribute('data-tour', id);
  else node.removeAttribute('data-tour');
}

/**
 * Add this to your app's types to teach TSX about the directive — the package
 * cannot declare it itself without importing `solid-js`:
 *
 * ```ts
 * declare module 'solid-js' {
 *   namespace JSX {
 *     interface Directives { tourAnchor: string }
 *   }
 * }
 * ```
 */
export type TourAnchorDirective = typeof tourAnchor;
