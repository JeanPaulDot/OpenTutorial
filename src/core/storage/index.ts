/**
 * Storage adapters.
 *
 * `KeyValueStorage` is deliberately permissive: `getItem` may return a string,
 * null, or a promise of either. The persistence layer hydrates asynchronously
 * into a synchronous in-memory cache, so engine APIs like `hasSeen()` stay sync
 * regardless of which adapter is in use.
 */

export type { KeyValueStorage } from '../types';
export { MemoryStorage, createMemoryStorage } from './memory';
export { createCookieStorage } from './cookie';
export { createIndexedDBStorage } from './indexeddb';
export { createRemoteStorage } from './remote';
export type { RemoteStorageOptions } from './remote';
