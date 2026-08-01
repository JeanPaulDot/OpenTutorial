# Solid

`solid-js` is never imported. Rather than take a peer dependency and pin its
version, the layer exposes a subscribe function you feed into your own signal —
two lines at the call site.

## Create a layer

```tsx
import { createSignal, onCleanup } from 'solid-js';
import { createTourLayer, tourAnchor } from '@opentutorial/core/solid';
import '@opentutorial/core/styles.css';

// Keep `tourAnchor` in scope so Solid preserves the `use:` directive.
void tourAnchor;

export function App() {
  const layer = createTourLayer({ specs, context: { plan: 'trial' } });

  const [tour, setTour] = createSignal(layer.snapshot());
  onCleanup(layer.watch(setTour));
  onCleanup(() => layer.destroy());

  return (
    <button use:tourAnchor="start-btn" onClick={() => layer.start('welcome')}>
      {tour().activeId
        ? `Step ${(tour().state?.index ?? 0) + 1} of ${tour().state?.total}`
        : 'Take the tour'}
    </button>
  );
}
```

## API

`SolidTourLayer` is the
[vanilla layer](../api-reference.md#createtutoriallayeroptions-vanillatutoriallayer)
plus:

| Method | Notes |
|---|---|
| `snapshot()` | `{ activeId, state }`, read once. |
| `watch(setter)` | Pushes snapshots into any setter. Returns an unsubscribe — pass it to `onCleanup`. |
| `watchEvents(handler)` | Every `TourEvent`. Returns an unsubscribe. |

```tsx
onCleanup(layer.watchEvents((event) => {
  if (event.type === 'completed') celebrate();
}));
```

## Directive typing

Solid cannot learn about a directive from a package that never imports it, so
declare it once in your app:

```ts
// src/types/solid.d.ts
declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      tourAnchor: string;
    }
  }
}

export {};
```

Or skip the directive entirely and set the attribute yourself:

```tsx
<button data-tour="start-btn">Take the tour</button>
```

## Context sharing

For a layer shared across the tree, put it in a Solid context:

```tsx
import { createContext, useContext, type ParentProps } from 'solid-js';
import { createTourLayer, type SolidTourLayer } from '@opentutorial/core/solid';

const TourContext = createContext<SolidTourLayer>();

export function TourRoot(props: ParentProps) {
  const layer = createTourLayer({ specs });
  onCleanup(() => layer.destroy());
  return <TourContext.Provider value={layer}>{props.children}</TourContext.Provider>;
}

export const useTour = () => useContext(TourContext)!;
```

## Guidance surfaces

```tsx
import { onCleanup, onMount } from 'solid-js';
import { createChecklist, type ChecklistHandle } from '@opentutorial/core';

function Onboarding() {
  const layer = useTour();
  let host!: HTMLDivElement;
  let checklist: ChecklistHandle;

  onMount(() => {
    checklist = createChecklist({ layer, container: host, collapsible: true });
  });
  onCleanup(() => checklist?.destroy());

  return <div ref={host} />;
}
```

## SolidStart

The library needs a DOM, so create the layer inside `onMount` or guard on
`isServer`:

```tsx
import { isServer } from 'solid-js/web';

const layer = isServer ? null : createTourLayer({ specs });
```

Hand navigation to the router:

```tsx
import { useNavigate } from '@solidjs/router';

const navigate = useNavigate();
createTourLayer({ specs, onNavigate: (path) => navigate(path) });
```
