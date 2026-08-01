# Vue 3

`vue` is never imported by this package — the adapter only relies on the shape of
`app.provide`. So there is no peer dependency and no version to keep in step.

## Install the plugin

```ts
// main.ts
import { createApp } from 'vue';
import { createTourPlugin } from '@opentutorial/core/vue';
import '@opentutorial/core/styles.css';
import App from './App.vue';

const app = createApp(App);

app.use(createTourPlugin({
  specs: [welcome, billing],
  context: { plan: 'trial' },
  userId: currentUser.id,
}));

app.mount('#app');
```

The plugin also patches `app.unmount` to tear the layer down, so hot reloads do
not leak listeners.

## Use it in a component

```vue
<script setup lang="ts">
import { inject, ref, onUnmounted } from 'vue';
import { TOUR_KEY, type VueTour } from '@opentutorial/core/vue';

const tour = inject<VueTour>(TOUR_KEY)!;

const state = ref(tour.snapshot());
const stop = tour.subscribe(() => { state.value = tour.snapshot(); });
onUnmounted(stop);
</script>

<template>
  <button data-tour="start" @click="tour.start('welcome')">
    {{ state.activeId ? `Step ${(state.state?.index ?? 0) + 1}` : 'Take the tour' }}
  </button>
</template>
```

`$tour` is also registered on `globalProperties`, so options-API components can
reach it without injecting:

```js
export default {
  methods: {
    startTour() { this.$tour.start('welcome'); },
  },
};
```

## Without provide/inject

```ts
import { createTour } from '@opentutorial/core/vue';

const tour = createTour({ specs });
await tour.ready;
tour.start('welcome');
```

`VueTour` extends the vanilla layer with:

| Method | Notes |
|---|---|
| `snapshot()` | `{ activeId, state }` — call it inside a `computed` or after an event. |
| `subscribe(fn)` | Every tour event. Returns an unsubscribe. |

Everything else is the [vanilla layer API](../api-reference.md#createtutoriallayeroptions-vanillatutoriallayer).

## Anchors

Vue has no directive shipped with the package — a plain attribute is enough:

```vue
<button data-tour="new-project">New project</button>
```

If you prefer a directive, three lines gets you one:

```ts
app.directive('tour-anchor', {
  mounted: (el, binding) => el.setAttribute('data-tour', binding.value),
  updated: (el, binding) => el.setAttribute('data-tour', binding.value),
  unmounted: (el) => el.removeAttribute('data-tour'),
});
```

## Guidance surfaces

The surfaces are framework-free factories, so they work here unchanged:

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref, inject } from 'vue';
import { createChecklist, type ChecklistHandle } from '@opentutorial/core';
import { TOUR_KEY, type VueTour } from '@opentutorial/core/vue';

const tour = inject<VueTour>(TOUR_KEY)!;
const host = ref<HTMLElement | null>(null);
let checklist: ChecklistHandle | null = null;

onMounted(() => {
  checklist = createChecklist({ layer: tour, container: host.value!, collapsible: true });
});
onUnmounted(() => checklist?.destroy());
</script>

<template><div ref="host" /></template>
```

See [Guidance surfaces](../guides/surfaces.md) for the full set.

## Vue Router

Hand navigation to the router rather than letting the library reload the page:

```ts
import { useRouter } from 'vue-router';

app.use(createTourPlugin({
  specs,
  onNavigate: (path) => router.push(path),
}));
```

`route` triggers and `advanceOn: 'url-match'` already understand
`history.pushState`, so they fire on Vue Router navigations without extra wiring.

## Nuxt

Register the plugin client-side only — the library needs a DOM.

```ts
// plugins/opentutorial.client.ts
import { createTourPlugin } from '@opentutorial/core/vue';
import '@opentutorial/core/styles.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createTourPlugin({ specs }));
});
```

The `.client` suffix is what keeps it out of the server bundle. See the
[SSR guide](../guides/ssr.md) for details.
