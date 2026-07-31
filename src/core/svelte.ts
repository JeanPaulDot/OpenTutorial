/** Svelte entry point — `@opentutorial/core/svelte`. */

export * from './index';

export { createTourStore, tourAnchor } from './adapters/svelte';
export type { TourStore, TourStoreValue } from './adapters/svelte';
