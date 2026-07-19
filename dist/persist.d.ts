import type { KeyValueStorage, ProgressRecord, TourStatus } from './types';
export declare class TourPersistence {
    private storage;
    private prefix;
    constructor(storage?: KeyValueStorage, prefix?: string);
    private key;
    private progressKey;
    private load;
    private save;
    mark(tourId: string, status: 'completed' | 'skipped', version?: string): void;
    hasSeen(tourId: string, version?: string): boolean;
    getStatus(tourId: string): TourStatus | null;
    reset(tourId?: string): void;
    clearAllProgress(): void;
    saveProgress(tourId: string, lastStepId: string, stepIndex: number): void;
    getProgress(tourId: string): ProgressRecord | null;
    getProgressIfValid(tourId: string, ttl: number): ProgressRecord | null;
    clearProgress(tourId: string): void;
}
