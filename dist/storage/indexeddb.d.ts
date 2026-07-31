import type { KeyValueStorage } from '../types';
/**
 * IndexedDB-backed storage. Reads are async (returned as promises, which the
 * persistence layer awaits during hydration); writes are fire-and-forget against
 * a synchronous mirror so nothing in the engine has to await a write.
 */
export declare function createIndexedDBStorage(dbName?: string, storeName?: string): KeyValueStorage;
