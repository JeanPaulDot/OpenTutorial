# API reference

Every public export, grouped by entry point. Types referenced here are defined
in the [spec reference](spec-reference.md) unless stated otherwise.

## Entry points

| Import | Contents |
|---|---|
| `@opentutorial/core` | Core + vanilla adapter + surfaces. **React-free.** |
| `@opentutorial/core/vanilla` | Alias of the root entry. |
| `@opentutorial/core/react` | Core + `TourProvider`, `useTour`, React components. |
| `@opentutorial/core/vue` | Core + Vue plugin. |
| `@opentutorial/core/svelte` | Core + Svelte store + `tourAnchor`. |
| `@opentutorial/core/angular` | Core + `OpenTutorialService`, `provideOpenTutorial`. |
| `@opentutorial/core/solid` | Core + `createTourLayer`, `tourAnchor`. |
| `@opentutorial/core/webcomponent` | Registers `<open-tutorial>`. |
| `@opentutorial/core/analytics` | Analytics adapters, funnels, sampling. |
| `@opentutorial/core/authoring` | Recorder, selector scoring, debug overlay. |
| `@opentutorial/core/schema` | `validateSpec`, `validateSpecs`, `assertValidSpec`. |
| `@opentutorial/core/styles.css` | The stylesheet. |

Every framework entry re-exports the whole core surface, so one import path is
enough.

---

## Options

`CreateTourOptions` is accepted by `TourEngine`, `TourOrchestrator`,
`createTutorialLayer` and every framework adapter.

| Option | Type | Default | Notes |
|---|---|---|---|
| `context` | `Record<string, unknown>` | `{}` | Data that `showIf` / `audience` / `next` read. |
| `theme` | `ThemeOverrides` | — | Global theme; specs and steps override it. |
| `zIndex` | `number` | `9999` | Sets `--ot-z`. |
| `onEvent` | `(e: TourEvent) => void` | — | Every event. Point analytics adapters here. |
| `persistence` | `{ storage?, keyPrefix? }` | localStorage, `'ot'` | See [Persistence](guides/persistence.md). |
| `storage` | `KeyValueStorage` | — | Shorthand for `persistence.storage`. |
| `keyPrefix` | `string` | `'ot'` | Shorthand for `persistence.keyPrefix`. |
| `userId` | `string` | — | Namespaces persisted state per user. |
| `locale` | `string` | `'en'` | Passed to the i18n resolver. |
| `i18nResolver` | `I18nResolver` | — | `(key, locale) => string \| undefined`. |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` | Mirrors placements and logical CSS. |
| `resume` | `boolean` | `false` | Resume a tour at its last step on `start()`. |
| `progressTtl` | `number` | 7 days | How long resume progress stays valid. |
| `autoResume` | `boolean` | `false` | Rehydrate a tour interrupted by a page navigation. |
| `interaction` | `InteractionMode` | `'free'` | Default interaction mode. |
| `container` | `HTMLElement` | `document.body` | Where the overlay mounts. |
| `isolate` | `boolean` | `false` | Render inside a shadow root. |
| `allowHtml` | `boolean` | `false` | Permit `{ type: 'html' }` blocks. |
| `swipe` | `boolean` | `true` | Advance/rewind on horizontal touch swipes. |
| `density` | `Density` | `'comfortable'` | `compact` \| `comfortable` \| `spacious`. |
| `autoSize` | `boolean` | `true` | Size the popover from its content and the viewport. |
| `sampleRate` | `number` | `1` | Fraction of tour runs reported through `onEvent`. |
| `strict` | `boolean` | `false` | Treat validation warnings as errors. |
| `onNavigate` | `(path: string) => void` | — | Handle `navigate` actions yourself (SPA routers). |
| `beforeNext` | `(ctx) => boolean \| Promise<boolean>` | — | Veto advancing. |
| `renderStep` | `(ctx, host) => void \| (() => void)` | — | Replace the built-in popover. |
| `renderIndicator` | `(ctx, host) => void \| (() => void)` | — | Replace the built-in hotspot/beacon. |
| `dev` | `boolean` | `true` | Log validation failures to the console. |
| `debug` | `boolean` | `false` | Show the debug overlay. |

`OrchestratorOptions` adds:

| Option | Type | Default | Notes |
|---|---|---|---|
| `deepLinkParam` | `string \| false` | `'tour'` | `?tour=<id>` launches a tour. `false` disables it. |
| `onStateChange` | `(activeId, state) => void` | — | Fires whenever the active tour or its state changes. |

---

## Core

### `createTutorialLayer(options): VanillaTutorialLayer`

The framework-free entry point. Wraps a `TourOrchestrator` and adds an event-
channel API.

```ts
import { createTutorialLayer } from '@opentutorial/core';

const layer = createTutorialLayer({
  specs: [mySpec],
  context: { plan: 'free' },
  autoMount: true,     // install triggers and deep links now. Default true.
});

await layer.ready;
layer.start('welcome');
```

**Methods**

| Method | Returns | Notes |
|---|---|---|
| `start(tourId, stepId?)` | `void` | Starts immediately, preempting anything running. |
| `request(tourId, stepId?)` | `boolean` | Honours audience/frequency/queue. `true` if it started now. |
| `stop()` | `void` | Skips whatever is running. |
| `skip(tourId?)` | `void` | Skips one tour, or the active one. |
| `pause()` / `resume()` | `void` | |
| `next()` / `prev()` / `goTo(stepId)` | `void` | No-ops when nothing is active. |
| `getState(tourId?)` | `TourState \| null` | Defaults to the active tour. |
| `getActiveId()` | `string \| null` | |
| `getSpecs()` | `TutorialSpec[]` | |
| `hasSeen(tourId)` | `boolean` | |
| `whyBlocked(tourId)` | `string \| null` | Why a tour cannot start, or `null`. |
| `getContext()` / `setContext(patch)` | | |
| `setTheme(theme)` / `setLocale(locale)` | `void` | |
| `setUser(userId)` | `Promise<void>` | Re-namespaces and re-hydrates state. |
| `reset()` / `resetTour(id)` / `resetProgress()` | `void` | |
| `exportProgress()` | `PersistedRoot \| null` | |
| `importProgress(data, mode?)` | `boolean` | `'replace'` (default) or `'merge'`. |
| `getEngine(tourId)` | `TourEngine \| undefined` | Escape hatch. |
| `on(channel, handler)` | `() => void` | Returns an unsubscribe. |
| `off(channel, handler)` | `void` | |
| `destroy()` | `void` | |
| `ready` | `Promise<void>` | Resolves once persisted state has hydrated. |

**Event channels** — `start` · `stop` · `skip` · `complete` · `step` · `event`
(everything) · `destroy`.

### `TourEngine`

One spec, one state machine. Most apps use the orchestrator or an adapter
instead, but the engine is public for advanced control.

```ts
const engine = new TourEngine(spec, options);
await engine.ready;
await engine.start();
```

| Method | Returns | Notes |
|---|---|---|
| `start(stepId?)` | `Promise<void>` | Ignored if already running or destroyed. |
| `next()` | `Promise<void>` | Runs `beforeNext`, then branch rules. |
| `prev()` | `void` | |
| `goTo(stepId)` | `void` | |
| `pause()` / `resume()` | `void` | |
| `skip(reason?)` / `complete(reason?)` | `void` | Only while running or paused. |
| `destroy()` | `void` | |
| `getState()` | `TourState` | |
| `isValid()` | `boolean` | False when the spec failed validation. |
| `hasSeen()` | `boolean` | |
| `getContext()` / `setContext(patch)` | | `setContext` re-evaluates the current `showIf`. |
| `setGlobalTheme(theme)` / `setLocale(locale)` | `void` | |
| `setUser(userId)` | `Promise<void>` | |
| `resetSeen()` / `resetAll()` / `resetProgress()` | `void` | |
| `exportProgress()` | `PersistedRoot` | |
| `importProgress(data, mode?)` | `boolean` | |
| `getPersistence()` | `TourPersistence` | |
| `ready` | `Promise<void>` | |

### `TourOrchestrator`

Owns a set of tours and guarantees at most one runs at a time.

```ts
const orchestrator = new TourOrchestrator(specs, options);
orchestrator.mount();   // installs triggers, deep links, chaining, auto-resume
```

Beyond the layer methods above: `getEngines()`, `checkEligibility(tourId)`,
`request(tourId, stepId?, { force?, queue? })`, and `mount()` / `destroy()`.

### `installTrigger(trigger, fire): TriggerHandle`

Wires one trigger definition to a callback and returns `{ dispose }`. Used
internally by the orchestrator; exported for custom orchestration.

### Factories

| Function | Notes |
|---|---|
| `createTour(spec, options?)` | → `TourEngine` |
| `createTours(specs, options?)` | → `TourOrchestrator` |
| `defineSpec(spec)` | Identity function that pins literal types. |
| `defineStep(step)` | Same, for a single step. |
| `extendSpec(base, overrides)` | Merge overrides into a spec — per-tenant or per-locale variants. |
| `SpecStepId<T>` | Union of the step ids declared in a spec. |

```ts
const spec = defineSpec({ id: 'welcome', steps: [{ id: 'intro', /* … */ }] });
type StepId = SpecStepId<typeof spec>;   // 'intro'
```

---

## Validation

```ts
import { validateSpec, validateSpecs, assertValidSpec } from '@opentutorial/core';
```

| Function | Returns |
|---|---|
| `validateSpec(input)` | `{ ok, errors: SpecIssue[], warnings: SpecIssue[] }` |
| `validateSpecs(specs)` | `{ ok, issues }` — adds cross-spec duplicate-id detection. |
| `assertValidSpec(input)` | The spec, or throws with a readable message. |

`SpecIssue` is `{ path, message, severity: 'error' | 'warning' }`. Paths are
JSONPath-ish: `$.steps[2].target`.

---

## Expressions

| Function | Notes |
|---|---|
| `evaluateShowIf(expr, ctx, opts?)` | → `boolean`. Never throws. |
| `evaluateExpression(expr, ctx, opts?)` | → the raw value, or `undefined` on failure. |
| `checkExpression(expr)` | → `{ ok: true }` or `{ ok: false, message }`. Syntax only. |

`EvalOptions` is `{ maxLength?: number; onError?: (message, expr) => void }`.

---

## Targeting

| Function | Notes |
|---|---|
| `resolveTarget(target)` | → `ResolvedTarget \| null`, resolved once. |
| `resolveTargets(target)` | → `ResolvedTarget[]`. Every match when `all: true`, otherwise at most one. |
| `waitForTarget(target, timeout?)` | → `Promise<ResolvedTarget \| null>`. |
| `waitForElement(selector, timeout?)` | → `Promise<Element \| null>`. |
| `safeQuery(selector, root?)` | Never throws on a malformed selector. |
| `queryDeep(selector, root?)` | Pierces **open** shadow roots. |
| `isVisible(el)` | Non-zero box, not `display:none` / `visibility:hidden` / `opacity:0`. |
| `describeTarget(target)` | Human-readable summary for logs. |

`ResolvedTarget` is `{ element, doc, frameOffset: { x, y }, matched }`.
`frameOffset` maps an in-iframe element into the top-level viewport.

## Navigation

| Function | Notes |
|---|---|
| `currentPath()` | `pathname + search + hash`. |
| `matchPath(pattern, path, exact?)` | Trailing `*` wildcard and `:param` segments. |
| `onLocationChange(cb)` | Fires on `pushState`, `replaceState`, `popstate` and `hashchange`. Returns an unsubscribe. |

---

## Content

| Function | Notes |
|---|---|
| `normalizeContent(content, resolve)` | Any `StepContent` → `ContentBlock[]`. |
| `renderBlocks(blocks, opts?)` | → `DocumentFragment`. `{ allowHtml?, doc? }`. |
| `blocksToText(blocks)` | Plain-text flattening for labels and analytics. |
| `renderInline(markdown, opts?)` | Inline markdown → escaped HTML string. `{ breaks?: boolean }`. |
| `renderMarkdown(markdown)` | Full block markdown → escaped HTML string. |
| `hasBlockMarkdown(source)` | True when the source uses block syntax. |
| `escapeHtml(text)` | |

## Experiments

| Function | Notes |
|---|---|
| `assignVariant(experiment, unit, variants, opts?)` | → variant name, or `null` for a holdout. |
| `assignAll(unit, experiments)` | Assign several at once, ready to spread into the context. |

See [A/B testing](guides/experiments.md).

---

## Persistence

| Export | Notes |
|---|---|
| `TourPersistence` | The store. See [Persistence](guides/persistence.md). |
| `MemoryStorage` / `createMemoryStorage()` | In-memory. |
| `createCookieStorage(opts?)` | `{ days?, path?, domain?, sameSite?, secure? }`. |
| `createIndexedDBStorage(opts?)` | Falls back to memory where IndexedDB is unavailable. |
| `createRemoteStorage(opts)` | REST-backed with a local write-through cache. |

`KeyValueStorage` is deliberately permissive — `getItem` may return a string,
`null`, or a promise of either:

```ts
interface KeyValueStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}
```

---

## Analytics

From `@opentutorial/core` or `@opentutorial/core/analytics`:

| Function | Notes |
|---|---|
| `createPostHogAdapter(client)` | |
| `createMixpanelAdapter(client)` | |
| `createAmplitudeAdapter(client)` | |
| `createSegmentAdapter(client)` | |
| `createRudderStackAdapter(client)` | Same contract as Segment. |
| `createHeapAdapter(client?)` | Falls back to `window.heap`. |
| `createGA4Adapter(measurementId?)` | Uses `window.gtag`. |
| `createDatadogAdapter(client?)` | Falls back to `window.DD_RUM`. |
| `createDebugAdapter(log?)` | Console logging. |
| `createHttpAdapter(opts)` | Batching + offline queue. |
| `createMultiAdapter(...adapters)` | Fan out; one failure never blocks the rest. |
| `filterEvents(adapter, types)` | |
| `withEventTypes(adapter, types)` | |
| `withSampling(adapter, opts)` | Samples whole tour runs, not events. |
| `shouldSample(key, rate, salt?)` | The underlying decision. |
| `createFunnelReport(events, tourId, spec?)` | Drop-off analysis. |
| `createEventCollector(limit?)` | `{ adapter, events, report, clear }`. |
| `toProperties(event, opts?)` / `eventName(event, prefix?)` | Building blocks for a custom adapter. |

### Events

`started` · `resumed` · `step-shown` · `step-hidden` · `step-completed` ·
`back` · `paused` · `unpaused` · `skipped` · `dismissed` · `completed` ·
`target-not-found` · `error`

```ts
interface TourEvent {
  type: TourEventType;
  tourId: string;
  stepId?: string;
  index?: number;
  total?: number;
  message?: string;
  duration?: number;   // ms on the step this event refers to
  reason?: string;     // 'user' | 'escape' | 'api' | 'error' | 'navigation' | …
  selector?: string;   // on targeting events
  meta?: Record<string, unknown>;
  timestamp: number;
}
```

Events handed to adapters are fresh objects, so no adapter can corrupt another.

---

## Guidance surfaces

Framework-free factories from `@opentutorial/core`. Each returns a handle with
`el`, `mount(parent?)` and `destroy()`.

| Factory | Extra handle methods |
|---|---|
| `createBanner(opts)` | `setMessage`, `dismiss` |
| `createAnnouncement(opts)` | `close` |
| `createSurvey(opts)` | `getResponse`, `reset` |
| `createHint(opts)` | `open`, `close`, `reposition` |
| `createChecklist(opts)` | `refresh`, `setCollapsed`, `getProgress` |
| `createResourceCenter(opts)` | `open`, `close`, `search`, `refresh` |
| `createChangelog(opts)` | `open`, `close`, `unread`, `markAllRead`, `setEntries` |

`createChecklist` and `createResourceCenter` take a `layer` implementing
`TourController` — the vanilla layer satisfies it as-is.

See [Guidance surfaces](guides/surfaces.md) for options and examples.

---

## Authoring

From `@opentutorial/core/authoring`:

| Function | Notes |
|---|---|
| `startRecorder(opts?)` | Point-and-click capture. → `{ stop, getSpec, toJSON }`. |
| `enableRecorderFromUrl(param?)` | Starts the recorder when `?ot-record=1` is present. |
| `generateSelectors(el, root?)` | Scored candidates. |
| `bestSelector(el, root?)` | The winner plus fallbacks and visible text. |
| `auditSelectors(selectors, root?)` | Dead / ambiguous selector report. |
| `createDebugPanel(opts)` | The dev overlay. → `{ update, destroy }`. |
| `logEvents(prefix?)` | Console-logs every tour event. Returns an unsubscribe. |

---

## i18n

| Function | Notes |
|---|---|
| `resolveText(content, locale, resolver?, params?)` | The main entry. |
| `interpolate(template, params?, locale?)` | `{{name}}` and plural blocks. |
| `selectPlural(count, forms, locale?)` | Uses `Intl.PluralRules`. |
| `createKeyResolver(messages)` | Flat map. |
| `createLocaleResolver(messages, defaultLocale?)` | Per-locale maps with fallback. |
| `resolveLabel(key, locale, resolver?)` | Built-in button text. |
| `localeDirection(locale)` | `'ltr' \| 'rtl'`. |
| `DEFAULT_LABELS` | `{ next, back, done, skip }`. |

---

## Styles

`CSS` is the stylesheet as a string — the same source `dist/styles.css` is
generated from. Import it when injecting styles into your own shadow root.

---

## CLI

```bash
npx opentutorial validate specs/**/*.json --strict
npx opentutorial lint-selectors http://localhost:3000 specs/
npx opentutorial preview http://localhost:3000 specs/
npx opentutorial schema
```

See [Authoring](guides/authoring.md#cli) for the full command reference.
