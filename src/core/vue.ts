/** Vue 3 entry point — `@opentutorial/core/vue`. */

export * from './index';

export { createTourPlugin, createTour as createVueTour, TOUR_KEY } from './adapters/vue';
export type { VueTour, TourPlugin } from './adapters/vue';
