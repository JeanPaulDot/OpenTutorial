# Interactivity & reactivity

A tour does not have to be a slideshow. Steps can ask questions, wait for an
answer, branch on it, and update themselves as your app's state changes.

## Interactive content blocks

Three block types take input. Each writes to the **tour context**, so the answer
is immediately available to `showIf`, `nextWhen`, `next` branches, `audience`
rules and `{{interpolation}}` — in this tour and every other one.

### `input`

```jsonc
{
  "id": "ask-email",
  "title": "Where should we send updates?",
  "nextWhen": "email.includes('@')",
  "content": { "blocks": [
    { "type": "text", "value": "We only use it for **release notes**." },
    { "type": "input", "name": "email", "label": "Work email",
      "inputType": "email", "placeholder": "you@example.com" }
  ] }
}
```

| Field | Notes |
|---|---|
| `name` | **Required.** The context key. Must be a valid identifier (`teamSize`, not `team-size`) so expressions can read it. |
| `label` | Visible label. Without one, the placeholder becomes the accessible name. |
| `placeholder` | |
| `inputType` | `text` (default), `email`, `number`, `url`, `tel`. A `number` field writes a number, so `seats > 3` works. |
| `multiline` | Render a textarea. |

### `choice`

```jsonc
{ "type": "choice", "name": "role", "label": "What best describes you?",
  "options": ["Developer", "Designer", "Product"] }
```

```jsonc
{ "type": "choice", "name": "tools", "multiple": true,
  "options": [
    { "label": "Small team (1–10)", "value": 10 },
    { "label": "Larger", "value": 100 }
  ] }
```

Single choice writes the value; `multiple` writes an array. Options are strings,
or `{ label, value }` when the stored value should differ from what is shown.

Rendered as a `radiogroup` (or a `group` of checkboxes), with `aria-checked`
kept in step.

### `button`

```jsonc
{ "type": "button", "label": "Skip the basics", "action": { "goTo": "advanced" } }
{ "type": "button", "label": "Finish", "action": "complete", "variant": "primary" }
{ "type": "button", "label": "Open settings",
  "action": [{ "type": "navigate", "path": "/settings" }] }
```

`action` is `"next"`, `"prev"`, `"skip"`, `"complete"`, `{ "goTo": "<step id>" }`,
or any [step action](../spec-reference.md#stepaction) (or an array of them).

## Gating a step: `nextWhen`

```jsonc
{ "nextWhen": "email.includes('@') && agreed" }
```

The Next button is disabled until the expression holds, and re-evaluates on
every context change. It gates the *user*, everywhere:

- the button is `disabled`
- `→`, `Enter` and a swipe do nothing
- `layer.next()` is refused

`goTo()` is not gated — it is the explicit escape hatch. A step whose own
`showIf` becomes false leaves regardless, because `nextWhen` should not trap the
user on a step that no longer applies.

## Branching on an answer

```jsonc
{
  "id": "ask-role",
  "title": "What best describes you?",
  "nextWhen": "role",
  "content": { "blocks": [
    { "type": "choice", "name": "role", "options": ["Developer", "Designer"] }
  ] },
  "next": [
    { "if": "role === 'Developer'", "to": "for-devs" },
    { "if": "role === 'Designer'", "to": "for-designers" }
  ]
}
```

Because the context is shared, a *different* tour can react to the same answer:

```jsonc
{ "id": "dev-deep-dive", "audience": { "showIf": "role === 'Developer'" } }
```

## Reactive copy

`{{placeholders}}` are live. When the context changes, a step that uses them
repaints:

```jsonc
{ "title": "Welcome back, {{name}}", "content": "You have {{cart.length}} items." }
```

```ts
layer.setContext({ cart: [...cart, item] });   // the open step updates
```

Two details keep this from being annoying:

- A step with **no** placeholders is not rebuilt on unrelated changes — a
  playing video is not restarted because some other key moved.
- A step is never rebuilt **while the user is typing in it**. Only the Next
  button's state is updated; the body repaints once focus leaves.

## Context triggers

Start a tour when your app's state crosses a line:

```jsonc
{
  "id": "first-item",
  "trigger": { "type": "context", "when": "cart.length > 0" },
  "steps": [ … ]
}
```

It is **edge-triggered**: it fires on the false → true change, not continuously
while the expression holds — otherwise every unrelated `setContext` would
restart it. If the expression is already true at mount, that counts as having
become true.

With `once: false` it fires again each time the expression falls and rises.

## Watching the context

```ts
const stop = layer.watchContext('cart.length', (count, previous) => {
  badge.textContent = String(count);
});

layer.watchContext("plan === 'pro'", (isPro) => { if (isPro) confetti(); });
```

`fn` runs only when the expression's **value** changes. Returns an unsubscribe.

For every change, with just what changed:

```ts
createTutorialLayer({
  specs,
  onContextChange: (context, patch) => {
    if ('email' in patch) api.saveLead(patch.email);
  },
});
```

`onContextChange` fires for `setContext`, for `setContext` step actions, and for
answers given in interactive blocks. It does not fire when nothing actually
changed.

## A store for any framework

```ts
layer.store.subscribe((snapshot) => {
  // { activeId, state, context }
});
layer.store.getSnapshot();
```

`subscribe` calls back immediately and on every change (the Svelte store
contract), and `getSnapshot` is referentially stable between changes (what
React requires):

```tsx
const snapshot = useSyncExternalStore(
  (onChange) => layer.store.subscribe(() => onChange()),
  layer.store.getSnapshot,
);
```

```svelte
<script>
  const { store } = layer;
</script>
{$store.activeId}
```

## Adding and removing tours at runtime

```ts
layer.addSpec(spec);        // replaces one with the same id; false if invalid
layer.removeSpec('promo');  // stops it first if it is running
```

A spec added later sees the **current** context, gets its trigger installed if
the layer is mounted, and is explainable through `whyBlocked` even when invalid.

In React the `specs` prop is itself reactive: add, replace or remove a spec and
the provider follows, with no remount.

```tsx
const [specs, setSpecs] = useState([welcome]);
// later
setSpecs((s) => [...s, generated]);

<TourProvider specs={specs}>…</TourProvider>
```

## Commands as data

Everything the imperative API does is also a plain object:

```ts
layer.dispatch({ type: 'start', tourId: 'welcome' });
layer.dispatch({ type: 'setContext', patch: { plan: 'pro' } });
layer.dispatch({ type: 'addSpec', spec });
```

| Command | Fields |
|---|---|
| `start` / `request` | `tourId`, `stepId?` |
| `stop` / `next` / `prev` / `pause` / `resume` | — |
| `goTo` | `stepId` |
| `setContext` | `patch` |
| `addSpec` | `spec` |
| `removeSpec` | `tourId` |
| `reset` | `tourId?` |

Returns `false` for an unknown command instead of throwing. Because commands
are JSON, a tour can be driven over `postMessage`, from a test script, or by an
AI agent that emits data rather than calling functions — see
[AI & agents](ai.md).

```ts
window.addEventListener('message', (e) => {
  if (e.origin === TRUSTED_ORIGIN) layer.dispatch(e.data);
});
```

Check the origin. A command can add a spec, and a spec is content.

## More control for the user

| Option | Default | Effect |
|---|---|---|
| `dotNavigation` | `true` | Progress dots of visited steps become buttons. Backwards only — jumping ahead would skip `nextWhen` gates and branches. |
| `draggable` | `false` | The popover can be dragged by its title when it covers something. It stays where it was put until the step changes. |
| `keyboard` | `true` | Arrow-key and Enter navigation. `false` frees those keys for your app. **Escape always works** — a tour must be dismissible from the keyboard. |
| `swipe` | `true` | Horizontal swipes on touch devices. |

## Custom rendering

`renderStep` receives the same reactive surface:

```ts
renderStep: (ctx, host) => {
  // ctx.context      — live answers
  // ctx.setValue     — write one, exactly as a block would
  // ctx.canGoNext    — false while `nextWhen` is unmet
}
```

It is re-invoked when the context changes, unless focus is inside your host.

## Privacy of answers

`interaction` events are emitted for every answer, but they are deliberately
asymmetric:

| Block | Event `meta` |
|---|---|
| `input` | `{ name }` — **never the value** |
| `choice` | `{ name, value }` |
| `button` | `{ button: label }` |

Free text is routinely personal — an email, a name — and analytics pipelines
are the wrong place for it to arrive by default. A choice is one of *your*
options, which is what a funnel wants to split on. If you do want typed values,
read them from `onContextChange` and send them somewhere you chose.
