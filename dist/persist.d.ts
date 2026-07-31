import type { KeyValueStorage, ProgressRecord, TourStatus } from './types';
export interface PersistedTour {
    status: 'completed' | 'skipped';
    version?: string;
    at: number;
    /** How many times this tour has been shown. Drives frequency capping. */
    shownCount?: number;
    lastShownAt?: number;
}
/** A tour that was mid-flight when the page navigated away. */
export interface ActiveRecord {
    tourId: string;
    stepId: string;
    at: number;
}
export interface PersistedRoot {
    v: 2;
    tours: Record<string, PersistedTour>;
    progress: Record<string, ProgressRecord>;
    active?: ActiveRecord;
}
/**
 * Seen-state and progress persistence.
 *
 * Everything lives under a single key so that "reset" is one atomic delete —
 * the v1 layout scattered progress across `ot:progress:<id>` keys that could not
 * be enumerated through the `KeyValueStorage` interface, so they survived resets.
 *
 * The in-memory `root` is the source of truth for reads, which keeps `hasSeen()`
 * and friends synchronous even when the underlying storage is async (IndexedDB,
 * a remote endpoint). `ready` resolves once the first hydration completes.
 */
export declare class TourPersistence {
    readonly ready: Promise<void>;
    private storage;
    private prefix;
    private userId;
    private root;
    private hydrated;
    constructor(storage?: KeyValueStorage, prefix?: string, userId?: string);
    private key;
    private legacyKey;
    /**
     * Switch identity. Progress is per-user, so logging in or out must not carry
     * the previous user's completions over.
     */
    setUser(userId: string | undefined): Promise<void>;
    getUser(): string | undefined;
    private parse;
    private hydrate;
    isHydrated(): boolean;
    private save;
    mark(tourId: string, status: 'completed' | 'skipped', version?: string): void;
    /** Records an impression. Frequency rules read `shownCount` / `lastShownAt`. */
    markShown(tourId: string, version?: string): void;
    hasSeen(tourId: string, version?: string): boolean;
    getStatus(tourId: string): TourStatus | null;
    getRecord(tourId: string): PersistedTour | null;
    reset(tourId?: string): void;
    clearAllProgress(): void;
    saveProgress(tourId: string, lastStepId: string, stepIndex: number): void;
    getProgress(tourId: string): ProgressRecord | null;
    getProgressIfValid(tourId: string, ttl: number): ProgressRecord | null;
    clearProgress(tourId: string): void;
    /**
     * Remember the in-flight tour so a full page navigation can pick it back up.
     * Distinct from `progress`, which survives across sessions — this is cleared
     * as soon as the tour ends or is deliberately abandoned.
     */
    setActive(tourId: string, stepId: string): void;
    getActive(maxAge?: number): ActiveRecord | null;
    clearActive(): void;
    /** Serialize everything for backup or server sync. */
    exportAll(): PersistedRoot;
    /** Replace local state wholesale, or merge newer records in. */
    importAll(data: PersistedRoot | string, mode?: 'replace' | 'merge'): boolean;
}
