import { TourEngine } from './engine';
import type { CreateTourOptions, TutorialSpec } from './types';
export declare function createTour(spec: TutorialSpec, opts?: CreateTourOptions): TourEngine;
export declare function defineSpec(spec: TutorialSpec): TutorialSpec;
