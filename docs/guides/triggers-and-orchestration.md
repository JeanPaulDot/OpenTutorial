# Triggers & orchestration

A trigger says *when* a tour would like to run. The orchestrator decides whether
it actually may — and guarantees that at most one tour is on screen at a time.

## Triggers

```jsonc
{ "trigger": { "type": "manual" } }                                  // default
{ "trigger": { "type": "auto", "delay": 2000 } }
{ "trigger": { "type": "event", "event": "checkout:complete" } }
{ "trigger": { "type": "route", "path": "/settings/*" } }
{ "trigger": { "type": "element", "selector": "[data-tour='chart']" } }
{ "trigger": { "type": "idle", "ms": 30000 } }
{ "trigger": { "type": "scroll", "percent": 60 } }
```

| Type | Fires when | Extra fields |
|---|---|---|
| `manual` | Never — you call `start()`. | |
| `auto` | Immediately on mount. | `delay` |
| `event` | A `window` event fires. | `event` (required) |
| `route` | The path matches. | `path` (required), `exact` |
| `element` | A matching element enters the DOM. | `selector` (required), `timeout` |
| `idle` | No pointer or key input for `ms`. | `ms` (required) |
| `scroll` | The page is scrolled `percent` of the way down. | `percent` (required) |

Every trigger also takes:

| Field | Default | Notes |
|---|---|---|
| `delay` | `0` | Milliseconds to wait after the condition is met. |
| `once` | `true` | `true` means "not if this tour has already been seen" — persisted, not per-page. |

### Route patterns

`path` matches `location.pathname + search` and understands:

| Pattern | Matches |
|---|---|
| `/settings` | `/settings`, `/settings/billing` (prefix by default) |
| `/settings` + `"exact": true` | `/settings` only |
| `/docs/*` | anything under `/docs/` |
| `/users/:id` | `/users/42`, `/users/42/edit` |

Route triggers observe `pushState` and `replaceState`, so SPA navigations fire
them without router integration.

With `once: false`, leaving and re-entering a route fires the trigger again.

## Eligibility

Before a tour starts, the orchestrator checks — in this order:

1. Does the spec exist and pass validation?
2. Does `audience.showIf` evaluate true against the current context?
3. Is the tour within its `frequency` limits?

`whyBlocked(tourId)` returns the first failing reason, or `null`:

```ts
layer.whyBlocked('billing-setup');
// → "audience rule did not match"
// → "frequency: cooldown active (3600000ms left)"
// → "frequency: already shown 2 time(s)"
// → "frequency: session limit of 1 reached"
// → "spec failed validation"
// → "unknown tour"
// → null
```

This is the single most useful debugging call in the library: when a tour "does
not show up", ask it why.

## Audience rules

```jsonc
{
  "audience": { "showIf": "plan === 'trial' && daysRemaining < 7" }
}
```

Evaluated against the tour context, using the same expression language as
`showIf`. Update the context and the answer changes:

```ts
layer.setContext({ plan: 'pro' });
```

## Frequency capping

```jsonc
{
  "frequency": {
    "max": 3,                 // at most 3 impressions ever
    "cooldown": 86400000,     // and at most one a day
    "perSession": 1           // and at most one per page session
  }
}
```

`max` and `cooldown` persist per user. `perSession` resets on reload and on
`setUser()`.

A deep link (`?tour=<id>`) deliberately **bypasses** frequency rules — the user
explicitly asked for that tour.

## One at a time

Every start request funnels through `request()`:

```ts
layer.request('welcome');   // → true if it started, false if queued or blocked
layer.start('welcome');     // → forces it, preempting anything running
```

When another tour is already running, `request()` queues by `priority` (higher
first) and drains the queue when the current tour ends. `start()` skips the
running tour with reason `preempted`.

```jsonc
{ "id": "critical-notice", "priority": 100 }
{ "id": "nice-to-have",    "priority": 1 }
```

## Chaining

```jsonc
{
  "onComplete": {
    "startTour": "invite-team",
    "emit": "onboarding:step-one-done",
    "navigate": "/team"
  }
}
```

`startTour` is announced as a `opentutorial:chain` event and picked up by the
orchestrator, so the finishing tour has fully torn down before the next begins.

Chaining only fires on **completion**, never on skip or dismiss.

## Cross-page tours

Two mechanisms, for two different problems:

| Option | Problem it solves |
|---|---|
| `resume: true` | The user closed the tab mid-tour. `start()` picks up at the last step. |
| `autoResume: true` | The tour navigated to a new page. It continues on mount, without `start()`. |

```ts
const layer = createTutorialLayer({
  specs,
  autoResume: true,
  onNavigate: (path) => router.push(path),   // SPA: push instead of reload
});
```

`resume` progress expires after `progressTtl` (7 days by default). The
`autoResume` record expires after 5 minutes — long enough to survive a
navigation, short enough that a tour abandoned yesterday does not ambush the
user tomorrow.

After a resume, history is seeded from the preceding visible steps, so **Back**
works immediately rather than being hidden for the rest of the session.

## Deep links

```
https://app.example.com/dashboard?tour=billing-setup
https://app.example.com/dashboard?tour=billing-setup&tourStep=confirm
```

Rename or disable the parameter:

```ts
createTutorialLayer({ specs, deepLinkParam: 'guide' });
createTutorialLayer({ specs, deepLinkParam: false });
```

Deep links are ideal for support: "click this link and the app will walk you
through it."

## Mounting

`createTutorialLayer` mounts by default. Opt out when you want to control when
triggers install:

```ts
const layer = createTutorialLayer({ specs, autoMount: false });
// …later
layer.getEngine('welcome');           // engines exist immediately
```

With the orchestrator directly:

```ts
const orchestrator = new TourOrchestrator(specs, options);
orchestrator.mount();     // triggers, deep links, chaining, auto-resume
orchestrator.destroy();   // removes every listener
```
