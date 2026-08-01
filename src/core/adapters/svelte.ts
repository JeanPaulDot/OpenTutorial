/**
 * Svelte adapter.
 *
 * Implements Svelte's store contract by hand (`subscribe` returning an
 * unsubscriber), so `svelte/store` is never imported and the package stays
 * dependency-free.
 *
 * ```svelte
 * <script>
 *   import { createTourStore, tourAnchor } from '@opentutorial/core/svelte';
 *   const tour = createTourStore({ specs });
 * </script>
 *
 * <button use:tourAnchor={'start-btn'} on:click={() => tour.start('welcome')}>
 *   Start — step {$tour.state?.index ?? 0}
 * </button>
 * ```
 */

import { createTutorialLayer, type VanillaOptions, type VanillaTutorialLayer } from './vanilla';
import type { TourState } from '../types';

export interface TourStoreValue {
  activeId: string | null;
  state: TourState | null;
}

type Subscriber = (value: TourStoreValue) => void;

export interface TourStore extends VanillaTutorialLayer {
  subscribe: (run: Subscriber) => () => void;
}

export function createTourStore(options: VanillaOptions): TourStore {
  const subscribers = new Set<Subscriber>();
  let value: TourStoreValue = { activeId: null, state: null };

  const layer = createTutorialLayer({
    ...options,
    onStateChange: (activeId, state) => {
      value = { activeId, state };
      for (const run of subscribers) {
        try { run(value); } catch { /* a subscriber must not break the tour */ }
      }
      options.onStateChange?.(activeId, state);
    },
  });

  return Object.assign(layer, {
    subscribe(run: Subscriber) {
      subscribers.add(run);
      // Svelte's contract calls the subscriber immediately. Guard it like the
      // later notifications, so a component that throws on its first render
      // cannot take the tour layer down with it.
      try { run(value); } catch { /* a subscriber must not break the tour */ }
      return () => { subscribers.delete(run); };
    },
  });
}

/** `use:tourAnchor={'sidebar'}` tags an element with `data-tour="sidebar"`. */
export function tourAnchor(node: HTMLElement, id: string): {
  update: (next: string) => void;
  destroy: () => void;
} {
  node.setAttribute('data-tour', id);
  return {
    update(next: string) { node.setAttribute('data-tour', next); },
    destroy() { node.removeAttribute('data-tour'); },
  };
}
