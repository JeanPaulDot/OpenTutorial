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
import { type VanillaOptions, type VanillaTutorialLayer } from './vanilla';
import type { TourState } from '../types';
export interface TourStoreValue {
    activeId: string | null;
    state: TourState | null;
}
type Subscriber = (value: TourStoreValue) => void;
export interface TourStore extends VanillaTutorialLayer {
    subscribe: (run: Subscriber) => () => void;
}
export declare function createTourStore(options: VanillaOptions): TourStore;
/** `use:tourAnchor={'sidebar'}` tags an element with `data-tour="sidebar"`. */
export declare function tourAnchor(node: HTMLElement, id: string): {
    update: (next: string) => void;
    destroy: () => void;
};
export {};
