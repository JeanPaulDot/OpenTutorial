/** Angular entry point — `@opentutorial/core/angular`. */

export * from './index';

export { OpenTutorialService, provideOpenTutorial } from './adapters/angular';
export type { TourObservable, TourProvider, TourSnapshot } from './adapters/angular';
