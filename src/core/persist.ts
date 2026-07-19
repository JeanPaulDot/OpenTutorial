import type { KeyValueStorage, ProgressRecord, TourStatus } from './types';

interface PersistedTour {
  status: 'completed' | 'skipped';
  version?: string;
  at: number;
}

interface PersistedRoot {
  v: 1;
  tours: Record<string, PersistedTour>;
}

class MemoryStorage implements KeyValueStorage {
  private map = new Map<string, string>();
  getItem(k: string) { return this.map.get(k) ?? null; }
  setItem(k: string, v: string) { this.map.set(k, v); }
  removeItem(k: string) { this.map.delete(k); }
}

function defaultStorage(): KeyValueStorage {
  try {
    if (typeof localStorage !== 'undefined') {
      const probe = '__ot_probe__';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return localStorage;
    }
  } catch { /* private mode etc. */ }
  return new MemoryStorage();
}

export class TourPersistence {
  private storage: KeyValueStorage;
  private prefix: string;

  constructor(storage?: KeyValueStorage, prefix = 'ot') {
    this.storage = storage ?? defaultStorage();
    this.prefix = prefix;
  }

  private key(): string { return `${this.prefix}:tours`; }
  private progressKey(tourId: string): string { return `${this.prefix}:progress:${tourId}`; }

  private load(): PersistedRoot {
    try {
      const raw = this.storage.getItem(this.key());
      if (!raw) return { v: 1, tours: {} };
      const parsed = JSON.parse(raw) as PersistedRoot;
      if (parsed && parsed.v === 1 && parsed.tours) return parsed;
    } catch { /* corrupted → start fresh */ }
    return { v: 1, tours: {} };
  }

  private save(root: PersistedRoot): void {
    try { this.storage.setItem(this.key(), JSON.stringify(root)); } catch { /* quota */ }
  }

  mark(tourId: string, status: 'completed' | 'skipped', version?: string): void {
    const root = this.load();
    root.tours[tourId] = { status, version, at: Date.now() };
    this.save(root);
    this.clearProgress(tourId);
  }

  hasSeen(tourId: string, version?: string): boolean {
    const rec = this.load().tours[tourId];
    if (!rec) return false;
    if (version && rec.version !== version) return false;
    return true;
  }

  getStatus(tourId: string): TourStatus | null {
    const rec = this.load().tours[tourId];
    if (!rec) return null;
    return rec.status;
  }

  reset(tourId?: string): void {
    if (!tourId) {
      try { this.storage.removeItem(this.key()); } catch { /* noop */ }
      return;
    }
    const root = this.load();
    delete root.tours[tourId];
    this.save(root);
    this.clearProgress(tourId);
  }

  saveProgress(tourId: string, lastStepId: string, stepIndex: number): void {
    const record: ProgressRecord = { tourId, lastStepId, stepIndex, timestamp: Date.now() };
    try { this.storage.setItem(this.progressKey(tourId), JSON.stringify(record)); } catch { /* quota */ }
  }

  getProgress(tourId: string): ProgressRecord | null {
    try {
      const raw = this.storage.getItem(this.progressKey(tourId));
      if (!raw) return null;
      return JSON.parse(raw) as ProgressRecord;
    } catch { return null; }
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
    try { this.storage.removeItem(this.progressKey(tourId)); } catch { /* noop */ }
  }
}
