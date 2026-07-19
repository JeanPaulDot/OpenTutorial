import { TourEngine } from './engine';
import type { CreateTourOptions, TutorialSpec } from './types';

export function createTour(spec: TutorialSpec, opts: CreateTourOptions = {}): TourEngine {
  return new TourEngine(spec, opts);
}

export function defineSpec(spec: TutorialSpec): TutorialSpec {
  return spec;
}
