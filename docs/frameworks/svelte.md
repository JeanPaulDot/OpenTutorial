# Svelte

`svelte/store` is never imported — the adapter implements the store contract by
hand, so there is no peer dependency and Svelte 4 and 5 both work.

## Create a store

```ts
// src/lib/tour.ts
import { createTourStore } from '@opentutorial/core/svelte';
import '@opentutorial/core/styles.css';
import { specs } from './specs';

export const tour = createTourStore({ specs, context: { plan: 'trial' } });
```

## Use it

```svelte
<script lang="ts">
  import { tour } from '$lib/tour';
  import { tourAnchor } from '@opentutorial/core/svelte';
</script>

<button use:tourAnchor={'start-btn'} on:click={() => tour.start('welcome')}>
  {#if $tour.activeId}
    Step {($tour.state?.index ?? 0) + 1} of {$tour.state?.total ?? 0}
  {:else}
    Take the tour
  {/if}
</button>
```

`$tour` is `{ activeId, state }`. Every other method — `start`, `next`, `pause`,
`setContext`, `exportProgress`, … — is the
[vanilla layer API](../api-reference.md#createtutoriallayeroptions-vanillatutoriallayer)
and is called directly on `tour`.

## tourAnchor

```svelte
<button use:tourAnchor={'new-project'}>New project</button>
```

Sets `data-tour="new-project"`, updates it when the value changes, and removes
it on destroy.

## Guidance surfaces

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createChecklist, type ChecklistHandle } from '@opentutorial/core';
  import { tour } from '$lib/tour';

  let host: HTMLElement;
  let checklist: ChecklistHandle;

  onMount(() => {
    checklist = createChecklist({ layer: tour, container: host, collapsible: true });
  });
  onDestroy(() => checklist?.destroy());
</script>

<div bind:this={host} />
```

## SvelteKit

The library needs a DOM, so create the store in the browser only.

```ts
// src/lib/tour.ts
import { browser } from '$app/environment';
import { createTourStore } from '@opentutorial/core/svelte';

export const tour = browser
  ? createTourStore({ specs })
  : null;
```

Or defer to `onMount`, which never runs on the server:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { createTourStore } from '@opentutorial/core/svelte';

  let tour: ReturnType<typeof createTourStore> | undefined;
  onMount(() => { tour = createTourStore({ specs }); });
</script>
```

Hand navigation to SvelteKit's router:

```ts
import { goto } from '$app/navigation';

createTourStore({ specs, onNavigate: (path) => goto(path) });
```

See the [SSR guide](../guides/ssr.md) for the full picture.
