import type { KeyValueStorage } from '../types';

/** In-memory fallback. Used when localStorage is unavailable (private mode, SSR). */
export class MemoryStorage implements KeyValueStorage {
  private map = new Map<string, string>();
  getItem(k: string): string | null { return this.map.get(k) ?? null; }
  setItem(k: string, v: string): void { this.map.set(k, v); }
  removeItem(k: string): void { this.map.delete(k); }
}

export function createMemoryStorage(): KeyValueStorage {
  return new MemoryStorage();
}

/**
 * localStorage when it is actually writable, memory otherwise. Probing matters:
 * Safari private mode exposes localStorage but throws on write.
 */
export function defaultStorage(): KeyValueStorage {
  try {
    if (typeof localStorage !== 'undefined') {
      const probe = '__ot_probe__';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return localStorage;
    }
  } catch { /* private mode, disabled storage, cross-origin iframe */ }
  return new MemoryStorage();
}
