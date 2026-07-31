import type { KeyValueStorage, ProgressRecord, TourStatus } from './types';
import { defaultStorage } from './storage/memory';

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

/** Legacy v1 layout: tours in one key, each tour's progress in its own key. */
interface LegacyRoot {
  v: 1;
  tours: Record<string, { status: 'completed' | 'skipped'; version?: string; at: number }>;
}

function emptyRoot(): PersistedRoot {
  return { v: 2, tours: {}, progress: {} };
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
export class TourPersistence {
  readonly ready: Promise<void>;

  private storage: KeyValueStorage;
  private prefix: string;
  private userId: string | undefined;
  private root: PersistedRoot = emptyRoot();
  private hydrated = false;

  constructor(storage?: KeyValueStorage, prefix = 'ot', userId?: string) {
    this.storage = storage ?? defaultStorage();
    this.prefix = prefix;
    this.userId = userId;
    this.ready = this.hydrate();
  }

  private key(): string {
    return this.userId ? `${this.prefix}:u:${this.userId}` : `${this.prefix}:anon`;
  }

  private legacyKey(): string { return `${this.prefix}:tours`; }

  /**
   * Switch identity. Progress is per-user, so logging in or out must not carry
   * the previous user's completions over.
   */
  setUser(userId: string | undefined): Promise<void> {
    if (userId === this.userId) return this.ready;
    this.userId = userId;
    this.root = emptyRoot();
    this.hydrated = false;
    return this.hydrate();
  }

  getUser(): string | undefined { return this.userId; }

  private parse(raw: unknown): PersistedRoot | null {
    if (typeof raw !== 'string' || !raw) return null;
    try {
      const parsed = JSON.parse(raw) as PersistedRoot | LegacyRoot;
      if (!parsed || typeof parsed !== 'object') return null;
      if (parsed.v === 2) {
        return {
          v: 2,
          tours: parsed.tours ?? {},
          progress: (parsed as PersistedRoot).progress ?? {},
          active: (parsed as PersistedRoot).active,
        };
      }
      if (parsed.v === 1) {
        // Migrate: seen-state carries over, scattered progress keys are dropped.
        return { v: 2, tours: (parsed as LegacyRoot).tours ?? {}, progress: {} };
      }
    } catch { /* corrupted → start fresh */ }
    return null;
  }

  private async hydrate(): Promise<void> {
    try {
      const raw = await Promise.resolve(this.storage.getItem(this.key()));
      const parsed = this.parse(raw);
      if (parsed) {
        this.root = parsed;
        this.hydrated = true;
        return;
      }
      // No record under the current key — try the v1 layout once, anon only.
      if (!this.userId) {
        const legacy = this.parse(await Promise.resolve(this.storage.getItem(this.legacyKey())));
        if (legacy) {
          this.root = legacy;
          this.hydrated = true;
          this.save();
          try { this.storage.removeItem(this.legacyKey()); } catch { /* noop */ }
          return;
        }
      }
    } catch { /* unreadable storage → memory-only for this session */ }
    this.hydrated = true;
  }

  isHydrated(): boolean { return this.hydrated; }

  private save(): void {
    try { this.storage.setItem(this.key(), JSON.stringify(this.root)); } catch { /* quota */ }
  }

  mark(tourId: string, status: 'completed' | 'skipped', version?: string): void {
    const prev = this.root.tours[tourId];
    this.root.tours[tourId] = {
      status,
      version,
      at: Date.now(),
      shownCount: prev?.shownCount ?? 0,
      lastShownAt: prev?.lastShownAt,
    };
    delete this.root.progress[tourId];
    if (this.root.active?.tourId === tourId) delete this.root.active;
    this.save();
  }

  /** Records an impression. Frequency rules read `shownCount` / `lastShownAt`. */
  markShown(tourId: string, version?: string): void {
    const prev = this.root.tours[tourId];
    this.root.tours[tourId] = {
      status: prev?.status ?? 'skipped',
      version: prev?.version ?? version,
      at: prev?.at ?? 0,
      shownCount: (prev?.shownCount ?? 0) + 1,
      lastShownAt: Date.now(),
    };
    this.save();
  }

  hasSeen(tourId: string, version?: string): boolean {
    const rec = this.root.tours[tourId];
    if (!rec || !rec.at) return false;
    if (version && rec.version !== version) return false;
    return true;
  }

  getStatus(tourId: string): TourStatus | null {
    const rec = this.root.tours[tourId];
    if (!rec || !rec.at) return null;
    return rec.status;
  }

  getRecord(tourId: string): PersistedTour | null {
    return this.root.tours[tourId] ?? null;
  }

  reset(tourId?: string): void {
    if (!tourId) {
      this.root = emptyRoot();
      this.save();
      return;
    }
    delete this.root.tours[tourId];
    delete this.root.progress[tourId];
    this.save();
  }

  clearAllProgress(): void {
    this.root.progress = {};
    this.save();
  }

  saveProgress(tourId: string, lastStepId: string, stepIndex: number): void {
    this.root.progress[tourId] = { tourId, lastStepId, stepIndex, timestamp: Date.now() };
    this.save();
  }

  getProgress(tourId: string): ProgressRecord | null {
    return this.root.progress[tourId] ?? null;
  }

  getProgressIfValid(tourId: string, ttl: number): ProgressRecord | null {
    const rec = this.getProgress(tourId);
    if (!rec) return null;
    if (Date.now() - rec.timestamp > ttl) {
      this.clearProgress(tourId);
      return null;
    }
    return rec;
  }

  clearProgress(tourId: string): void {
    if (!(tourId in this.root.progress)) return;
    delete this.root.progress[tourId];
    this.save();
  }

  /**
   * Remember the in-flight tour so a full page navigation can pick it back up.
   * Distinct from `progress`, which survives across sessions — this is cleared
   * as soon as the tour ends or is deliberately abandoned.
   */
  setActive(tourId: string, stepId: string): void {
    this.root.active = { tourId, stepId, at: Date.now() };
    this.save();
  }

  getActive(maxAge = 5 * 60 * 1000): ActiveRecord | null {
    const rec = this.root.active;
    if (!rec) return null;
    if (Date.now() - rec.at > maxAge) {
      this.clearActive();
      return null;
    }
    return rec;
  }

  clearActive(): void {
    if (!this.root.active) return;
    delete this.root.active;
    this.save();
  }

  /** Serialize everything for backup or server sync. */
  exportAll(): PersistedRoot {
    return JSON.parse(JSON.stringify(this.root)) as PersistedRoot;
  }

  /** Replace local state wholesale, or merge newer records in. */
  importAll(data: PersistedRoot | string, mode: 'replace' | 'merge' = 'replace'): boolean {
    const parsed = this.parse(typeof data === 'string' ? data : JSON.stringify(data));
    if (!parsed) return false;
    if (mode === 'replace') {
      this.root = parsed;
    } else {
      for (const [id, rec] of Object.entries(parsed.tours)) {
        const mine = this.root.tours[id];
        if (!mine || rec.at > mine.at) this.root.tours[id] = rec;
      }
      for (const [id, rec] of Object.entries(parsed.progress)) {
        const mine = this.root.progress[id];
        if (!mine || rec.timestamp > mine.timestamp) this.root.progress[id] = rec;
      }
    }
    this.save();
    return true;
  }
}
