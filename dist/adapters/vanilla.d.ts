import type { CreateTourOptions, TutorialSpec, TourState } from '../types';
export interface VanillaTutorialLayer {
    start: (tourId: string, stepId?: string) => void;
    stop: () => void;
    skip: (tourId?: string) => void;
    getState: (tourId?: string) => TourState | null;
    destroy: () => void;
    setContext: (patch: Record<string, unknown>) => void;
    setTheme: (theme: Record<string, string>) => void;
    on: (event: string, handler: (e: Event) => void) => void;
    off: (event: string, handler: (e: Event) => void) => void;
}
export interface VanillaOptions extends CreateTourOptions {
    specs: TutorialSpec[];
}
export declare function createTutorialLayer(opts: VanillaOptions): VanillaTutorialLayer;
