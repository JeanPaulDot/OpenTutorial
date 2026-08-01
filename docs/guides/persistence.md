# Persistence & identity

## What is stored

Everything lives under a **single key** so a reset is one atomic delete:

```jsonc
{
  "v": 2,
  "tours": {
    "welcome": { "status": "completed", "version": "2", "at": 1785580000000,
                 "shownCount": 3, "lastShownAt": 1785579000000 }
  },
  "progress": {
    "billing": { "tourId": "billing", "lastStepId": "confirm", "stepIndex": 2,
                 "timestamp": 1785580000000 }
  },
  "active": { "tourId": "billing", "stepId": "confirm", "at": 1785580000000 }
}
```

| Section | Purpose | Cleared by |
|---|---|---|
| `tours` | Seen state and impression counts. Drives `hasSeen` and `frequency`. | `reset()`, `resetTour(id)` |
| `progress` | Where a tour was left. Drives `resume`. | `resetProgress()`, completion |
| `active` | The in-flight tour. Drives `autoResume`. Expires after 5 minutes. | completion, skip |

The key is `ot:anon`, or `ot:u:<userId>` when a user is set.

## Choosing storage

Default is `localStorage`, probed for writability first — Safari private mode
exposes it but throws on write, so the probe matters.

```ts
import {
  createMemoryStorage, createCookieStorage,
  createIndexedDBStorage, createRemoteStorage,
} from '@opentutorial/core';

createTutorialLayer({ specs, storage: createCookieStorage({ days: 180 }) });
```

| Adapter | Use when |
|---|---|
| default (localStorage) | Almost always. |
| `createMemoryStorage()` | Tests, or when nothing should persist. |
| `createCookieStorage(opts)` | The server needs to read it, or state must cross subdomains. Cookies cap at ~4KB. |
| `createIndexedDBStorage(opts)` | Large state, or localStorage is unavailable. Falls back to memory automatically. |
| `createRemoteStorage(opts)` | Progress must follow a user across devices. |

### Async is fine

`KeyValueStorage` accepts promises:

```ts
interface KeyValueStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}
```

The persistence layer hydrates asynchronously into a synchronous in-memory
cache, so `hasSeen()` stays synchronous no matter which adapter you use. Await
`layer.ready` before making decisions that depend on stored state:

```ts
await layer.ready;
if (!layer.hasSeen('welcome')) layer.start('welcome');
```

### Any storage you like

The interface is small enough to implement against anything:

```ts
const sessionAdapter: KeyValueStorage = {
  getItem: (k) => sessionStorage.getItem(k),
  setItem: (k, v) => sessionStorage.setItem(k, v),
  removeItem: (k) => sessionStorage.removeItem(k),
};
```

## Per-user state

```ts
createTutorialLayer({ specs, userId: currentUser.id });
```

Keys become `ot:u:<userId>`. On login/logout, switch identity — state is
re-hydrated for the new user and per-session counters reset:

```ts
await layer.setUser(newUser.id);   // or undefined on logout
```

Without `userId`, two people sharing a browser share tour state, and one will see
the other's completed onboarding.

## Export and import

```ts
const snapshot = layer.exportProgress();       // plain JSON
await api.put(`/users/${id}/tour-progress`, snapshot);

const remote = await api.get(`/users/${id}/tour-progress`);
layer.importProgress(remote, 'merge');
```

| Mode | Behaviour |
|---|---|
| `'replace'` (default) | Overwrite local state wholesale. |
| `'merge'` | Keep whichever record is newer, per tour. |

`merge` is what you want when reconciling a server copy with local activity.
`importProgress` returns `false` on an unparseable payload and leaves existing
state untouched.

## Remote storage

```ts
import { createRemoteStorage } from '@opentutorial/core';

createTutorialLayer({
  specs,
  userId: currentUser.id,
  storage: createRemoteStorage({
    endpoint: 'https://api.example.com/tour-state',
    headers: () => ({ authorization: `Bearer ${getToken()}` }),
    debounceMs: 400,
    onError: (err, op, key) => console.warn('tour sync failed', op, key, err),
  }),
});
```

### The REST contract

Three endpoints, keyed by the persistence key:

| Method | Path | Request | Response |
|---|---|---|---|
| `GET` | `{endpoint}/{key}` | — | `{ "value": string \| null }` |
| `PUT` | `{endpoint}/{key}` | `{ "value": string }` | any 2xx |
| `DELETE` | `{endpoint}/{key}` | — | any 2xx |

`{key}` is URL-encoded (`ot%3Au%3A42`). `value` is the serialized state blob —
treat it as opaque. Requests are sent with `credentials: 'include'`.

A minimal Express implementation:

```js
app.get('/tour-state/:key', async (req, res) => {
  const value = await db.tourState.get(req.params.key);
  res.json({ value: value ?? null });
});

app.put('/tour-state/:key', async (req, res) => {
  await db.tourState.set(req.params.key, req.body.value);
  res.sendStatus(204);
});

app.delete('/tour-state/:key', async (req, res) => {
  await db.tourState.delete(req.params.key);
  res.sendStatus(204);
});
```

Authorize on the key: a user must only be able to read and write their own.

### Behaviour under failure

- **Reads** hit the local cache first and resolve immediately; the network result
  back-fills the cache.
- **Writes** go to the cache synchronously and flush to the server on a debounce,
  coalescing rapid writes into one request.
- **Failed flushes** are re-queued and retried on the next write, on `online`,
  and on `pagehide`.
- **Nothing throws into the tour.** An unreachable server degrades to local-only
  storage, and `onError` tells you it happened.

| Option | Default | Notes |
|---|---|---|
| `endpoint` | — | **Required.** |
| `headers` | — | Object or function — use a function for rotating tokens. |
| `cache` | localStorage | `false` for memory-only. |
| `debounceMs` | `400` | |
| `fetchImpl` | global `fetch` | Inject for tests. |
| `onError` | — | `(err, op, key)`. |

## Resetting

```ts
layer.resetTour('welcome');   // one tour's seen state
layer.resetProgress();        // every tour's resume position
layer.reset();                // everything
```

Handy in development:

```ts
if (import.meta.env.DEV) {
  (window as Record<string, unknown>).resetTours = () => layer.reset();
}
```

## Re-showing an updated tour

Bump `version` on the spec. `hasSeen` compares versions, so a user who completed
v1 sees v2:

```jsonc
{ "id": "welcome", "version": "2", "steps": [] }
```

## Privacy

The library stores tour ids, timestamps and counters — no personal data unless
you put it in a tour id. It sets no cookies unless you choose the cookie adapter,
and makes no network requests unless you choose remote storage or configure an
analytics adapter.

If your consent flow requires it, defer creating the layer until consent is
given, or start with `createMemoryStorage()` and swap later.
