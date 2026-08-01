# Getting started

## Install

```bash
npm install @opentutorial/core
```

React is an **optional** peer dependency. Install it only if you use the React
adapter — the core, the Web Component and the vanilla adapter need nothing else.

No bundler? Use the global build:

```html
<link rel="stylesheet" href="https://unpkg.com/@opentutorial/core/dist/styles.css">
<script src="https://unpkg.com/@opentutorial/core/dist/opentutorial.global.js"></script>
```

## Your first tour

A tour is a plain JSON object. Two things matter: a stable `id`, and steps that
point at elements which will still exist after your next deploy.

```ts
import { createTutorialLayer, defineSpec } from '@opentutorial/core';
import '@opentutorial/core/styles.css';

const welcome = defineSpec({
  specVersion: 1,
  id: 'welcome',
  title: 'Welcome',
  trigger: { type: 'manual' },
  steps: [
    {
      id: 'intro',
      title: 'This is your dashboard',
      content: 'Everything starts here. Click **Next** to continue.',
      target: { selector: '[data-tour="dashboard"]' },
      placement: 'bottom',
    },
    {
      id: 'create',
      title: 'Create your first project',
      content: 'Press this button when you are ready.',
      target: { selector: '[data-tour="new-project"]' },
      advanceOn: 'target-click',
    },
  ],
});

const layer = createTutorialLayer({ specs: [welcome] });
await layer.ready;
layer.start('welcome');
```

Add the anchors to your markup:

```html
<section data-tour="dashboard">…</section>
<button data-tour="new-project">New project</button>
```

`data-tour` attributes are the recommended anchor. They exist to be targeted, so
nobody deletes one while refactoring class names — and the recorder prefers them
when generating selectors.

## Start it automatically

Change the trigger and mount the layer; the orchestrator handles the rest.

```ts
trigger: { type: 'route', path: '/dashboard' }
```

Triggers available: `manual`, `auto`, `event`, `route`, `element`, `idle`,
`scroll`. See [Triggers & orchestration](guides/triggers-and-orchestration.md).

## Show it only to the right people

```ts
const spec = defineSpec({
  // …
  audience: { showIf: "plan === 'trial' && seats > 1" },
  frequency: { max: 2, cooldown: 86_400_000 },   // twice, at most once a day
});

const layer = createTutorialLayer({
  specs: [spec],
  context: { plan: 'trial', seats: 4 },
});
```

Context is yours to define. Update it whenever your app's state changes:

```ts
layer.setContext({ plan: 'pro' });
```

## Remember who has seen what

Progress persists to `localStorage` by default. Scope it per user so a shared
browser does not leak one person's state to another:

```ts
const layer = createTutorialLayer({ specs, userId: currentUser.id });
```

For cross-device state, swap the storage adapter — see
[Persistence](guides/persistence.md).

## Measure it

```ts
import { createPostHogAdapter } from '@opentutorial/core';

const layer = createTutorialLayer({
  specs,
  onEvent: createPostHogAdapter(posthog),
});
```

Then answer "where do people quit?" with `createFunnelReport`. See
[Analytics](guides/analytics.md).

## Validate before you ship

```bash
npx opentutorial validate specs/**/*.json --strict
```

A spec that fails validation disables its own tour at runtime and nothing else —
but catching it in CI is better than catching it in production.

## Where next

- Building for a specific framework → the [framework guides](README.md#framework-guides)
- Every field a spec accepts → [Spec reference](spec-reference.md)
- Every function the package exports → [API reference](api-reference.md)
- Making tours look like your product → [Content & theming](guides/content-and-theming.md)
- Coming from another library → [migration guides](README.md#migrating)
