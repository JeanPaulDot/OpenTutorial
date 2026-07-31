import type { KeyValueStorage } from '../types';
import { MemoryStorage } from './memory';

/**
 * IndexedDB-backed storage. Reads are async (returned as promises, which the
 * persistence layer awaits during hydration); writes are fire-and-forget against
 * a synchronous mirror so nothing in the engine has to await a write.
 */
export function createIndexedDBStorage(dbName = 'opentutorial', storeName = 'kv'): KeyValueStorage {
  const mirror = new MemoryStorage();

  if (typeof indexedDB === 'undefined') return mirror;

  let dbPromise: Promise<IDBDatabase | null> | null = null;

  const open = (): Promise<IDBDatabase | null> => {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(dbName, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onblocked = () => resolve(null);
      } catch { resolve(null); }
    });
    return dbPromise;
  };

  const tx = async <T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest): Promise<T | null> => {
    const db = await open();
    if (!db) return null;
    return new Promise<T | null>((resolve) => {
      try {
        const t = db.transaction(storeName, mode);
        const req = fn(t.objectStore(storeName));
        req.onsuccess = () => resolve(req.result as T);
        req.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
  };

  return {
    getItem(key: string) {
      const cached = mirror.getItem(key);
      if (cached !== null) return cached;
      return tx<string>('readonly', (s) => s.get(key)).then((v) => {
        if (typeof v === 'string') mirror.setItem(key, v);
        return typeof v === 'string' ? v : null;
      });
    },
    setItem(key: string, value: string) {
      mirror.setItem(key, value);
      void tx('readwrite', (s) => s.put(value, key));
    },
    removeItem(key: string) {
      mirror.removeItem(key);
      void tx('readwrite', (s) => s.delete(key));
    },
  };
}
