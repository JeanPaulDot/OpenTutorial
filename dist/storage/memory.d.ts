import type { KeyValueStorage } from '../types';
/** In-memory fallback. Used when localStorage is unavailable (private mode, SSR). */
export declare class MemoryStorage implements KeyValueStorage {
    private map;
    getItem(k: string): string | null;
    setItem(k: string, v: string): void;
    removeItem(k: string): void;
}
export declare function createMemoryStorage(): KeyValueStorage;
/**
 * localStorage when it is actually writable, memory otherwise. Probing matters:
 * Safari private mode exposes localStorage but throws on write.
 */
export declare function defaultStorage(): KeyValueStorage;
