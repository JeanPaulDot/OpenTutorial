import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryStorage, createMemoryStorage } from '../storage/memory';
import { createCookieStorage } from '../storage/cookie';
import { createRemoteStorage } from '../storage/remote';
import { createIndexedDBStorage } from '../storage/indexeddb';
import { TourPersistence } from '../persist';

describe('MemoryStorage', () => {
  it('round-trips values and reports null for misses', () => {
    const store = new MemoryStorage();
    expect(store.getItem('missing')).toBeNull();
    store.setItem('a', '1');
    expect(store.getItem('a')).toBe('1');
    store.removeItem('a');
    expect(store.getItem('a')).toBeNull();
  });

  it('createMemoryStorage returns an isolated instance each time', () => {
    const first = createMemoryStorage();
    const second = createMemoryStorage();
    first.setItem('k', 'v');
    expect(second.getItem('k')).toBeNull();
  });
});

describe('createCookieStorage', () => {
  beforeEach(() => {
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0].trim();
      if (name) document.cookie = `${name}=; max-age=-1; path=/`;
    }
  });

  it('round-trips a value', () => {
    const store = createCookieStorage();
    store.setItem('ot:anon', '{"v":2}');
    expect(store.getItem('ot:anon')).toBe('{"v":2}');
  });

  it('encodes keys and values that contain separators', () => {
    const store = createCookieStorage();
    store.setItem('ot:u:a b', 'x;y=z');
    expect(store.getItem('ot:u:a b')).toBe('x;y=z');
  });

  it('removeItem expires the cookie', () => {
    const store = createCookieStorage();
    store.setItem('gone', 'here');
    store.removeItem('gone');
    expect(store.getItem('gone')).toBeNull();
  });

  it('returns null for a key that was never set', () => {
    expect(createCookieStorage().getItem('never')).toBeNull();
  });
});

describe('createRemoteStorage', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('serves reads from the cache without touching the network', () => {
    const fetchImpl = vi.fn();
    const cache = createMemoryStorage();
    cache.setItem('k', 'cached');

    const store = createRemoteStorage({ endpoint: 'https://api.test/progress', cache, fetchImpl });
    expect(store.getItem('k')).toBe('cached');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('falls back to the network on a cache miss and back-fills', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ value: 'from-server' }),
    } as Response);
    const cache = createMemoryStorage();

    const store = createRemoteStorage({ endpoint: 'https://api.test/progress', cache, fetchImpl });
    await expect(store.getItem('k')).resolves.toBe('from-server');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    // Back-filled, so the next read is synchronous.
    expect(cache.getItem('k')).toBe('from-server');
  });

  it('resolves null and reports when the network read fails', async () => {
    const onError = vi.fn();
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
    const store = createRemoteStorage({
      endpoint: 'https://api.test/p', cache: createMemoryStorage(), fetchImpl, onError,
    });

    await expect(store.getItem('k')).resolves.toBeNull();
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 'get', 'k');
  });

  it('writes to the cache synchronously and flushes on a debounce', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
    const cache = createMemoryStorage();

    const store = createRemoteStorage({
      endpoint: 'https://api.test/p', cache, fetchImpl, debounceMs: 100,
    });

    store.setItem('k', 'v');
    expect(cache.getItem('k')).toBe('v');
    expect(fetchImpl).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(120);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [, init] = fetchImpl.mock.calls[0];
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body as string)).toEqual({ value: 'v' });
  });

  it('coalesces rapid writes into one request', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
    const store = createRemoteStorage({
      endpoint: 'https://api.test/p', cache: createMemoryStorage(), fetchImpl, debounceMs: 100,
    });

    store.setItem('k', 'a');
    store.setItem('k', 'b');
    store.setItem('k', 'c');
    await vi.advanceTimersByTimeAsync(120);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body as string)).toEqual({ value: 'c' });
  });

  it('re-queues a failed write and retries it on the next flush', async () => {
    vi.useFakeTimers();
    const onError = vi.fn();
    const fetchImpl = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ ok: true, json: async () => ({}) } as Response);

    const store = createRemoteStorage({
      endpoint: 'https://api.test/p', cache: createMemoryStorage(), fetchImpl, debounceMs: 50, onError,
    });

    store.setItem('k', 'v');
    await vi.advanceTimersByTimeAsync(60);
    expect(onError).toHaveBeenCalledWith(expect.any(Error), 'put', 'k');

    // A later write triggers a flush that carries the re-queued entry.
    store.setItem('other', 'x');
    await vi.advanceTimersByTimeAsync(60);
    expect(fetchImpl.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it('issues DELETE for removeItem', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
    const store = createRemoteStorage({
      endpoint: 'https://api.test/p', cache: createMemoryStorage(), fetchImpl, debounceMs: 10,
    });

    store.removeItem('k');
    await vi.advanceTimersByTimeAsync(30);
    expect(fetchImpl.mock.calls[0][1].method).toBe('DELETE');
  });

  it('supports a headers function for rotating tokens', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
    let token = 'first';
    const store = createRemoteStorage({
      endpoint: 'https://api.test/p',
      cache: createMemoryStorage(),
      fetchImpl,
      debounceMs: 10,
      headers: () => ({ authorization: `Bearer ${token}` }),
    });

    store.setItem('k', '1');
    await vi.advanceTimersByTimeAsync(30);
    expect(fetchImpl.mock.calls[0][1].headers.authorization).toBe('Bearer first');

    token = 'second';
    store.setItem('k', '2');
    await vi.advanceTimersByTimeAsync(30);
    expect(fetchImpl.mock.calls[1][1].headers.authorization).toBe('Bearer second');
  });
});

describe('createIndexedDBStorage', () => {
  it('degrades to a synchronous cache when IndexedDB is unavailable', async () => {
    // jsdom has no IndexedDB, which is exactly the fallback path.
    const store = createIndexedDBStorage();
    store.setItem('k', 'v');
    await expect(Promise.resolve(store.getItem('k'))).resolves.toBe('v');
    store.removeItem('k');
    await expect(Promise.resolve(store.getItem('k'))).resolves.toBeNull();
  });

  it('works as the backing store for TourPersistence', async () => {
    const persistence = new TourPersistence(createIndexedDBStorage(), 'ot-idb');
    await persistence.ready;
    persistence.mark('tour-a', 'completed');
    expect(persistence.hasSeen('tour-a')).toBe(true);
  });
});

describe('TourPersistence with async storage', () => {
  it('keeps reads synchronous while hydrating from a promise-based store', async () => {
    const backing = createMemoryStorage();
    backing.setItem('ot:anon', JSON.stringify({
      v: 2, tours: { seen: { status: 'completed', at: Date.now() } }, progress: {},
    }));

    const asyncStore = {
      getItem: (k: string) => Promise.resolve(backing.getItem(k)),
      setItem: (k: string, v: string) => backing.setItem(k, v),
      removeItem: (k: string) => backing.removeItem(k),
    };

    const persistence = new TourPersistence(asyncStore, 'ot');
    // Not hydrated yet, so the read is empty rather than blocking.
    expect(persistence.hasSeen('seen')).toBe(false);

    await persistence.ready;
    expect(persistence.hasSeen('seen')).toBe(true);
  });

  it('namespaces by user and swaps cleanly on identity change', async () => {
    const storage = createMemoryStorage();
    const persistence = new TourPersistence(storage, 'ot', 'alice');
    await persistence.ready;

    persistence.mark('welcome', 'completed');
    expect(persistence.hasSeen('welcome')).toBe(true);

    await persistence.setUser('bob');
    expect(persistence.hasSeen('welcome')).toBe(false);

    await persistence.setUser('alice');
    expect(persistence.hasSeen('welcome')).toBe(true);
  });

  it('survives corrupted stored JSON', async () => {
    const storage = createMemoryStorage();
    storage.setItem('ot:anon', '{{{ not json');
    const persistence = new TourPersistence(storage, 'ot');
    await persistence.ready;
    expect(persistence.hasSeen('anything')).toBe(false);
  });

  it('migrates the v1 layout and removes the legacy key', async () => {
    const storage = createMemoryStorage();
    storage.setItem('ot:tours', JSON.stringify({
      v: 1, tours: { old: { status: 'completed', at: 123 } },
    }));

    const persistence = new TourPersistence(storage, 'ot');
    await persistence.ready;

    expect(persistence.hasSeen('old')).toBe(true);
    expect(storage.getItem('ot:tours')).toBeNull();
  });
});
