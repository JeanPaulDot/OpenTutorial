# Server-side rendering

## The rule

The engine touches `document` and `window` when it is constructed. So:

> **Create the tour layer in the browser, never on the server.**

Rendering a tour server-side would be pointless anyway — an overlay positioned
against a live layout has nothing to compute against until there is a viewport.

Nothing here needs a wrapper or a dynamic import of the whole package: the
*imports* are safe, only *construction* is not.

## Next.js — App Router

The React adapter carries `'use client'`, so importing it from a server
component is fine. The provider must live in a client component.

```tsx
// app/providers.tsx
'use client';

import { TourProvider } from '@opentutorial/core/react';
import '@opentutorial/core/styles.css';
import { specs } from '@/tours';

export function Providers({ children }: { children: React.ReactNode }) {
  return <TourProvider specs={specs}>{children}</TourProvider>;
}
```

```tsx
// app/layout.tsx  — stays a server component
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
```

Hand navigation to the router so `navigate` actions push state:

```tsx
'use client';
import { useRouter } from 'next/navigation';

export function Providers({ children }) {
  const router = useRouter();
  return (
    <TourProvider specs={specs} onNavigate={(path) => router.push(path)}>
      {children}
    </TourProvider>
  );
}
```

### Route triggers with the App Router

`trigger: { type: 'route' }` observes `history.pushState`, which the Next router
uses — so route triggers fire on client navigations with no extra wiring.

### Streaming and Suspense

The provider renders its children immediately and mounts the overlay in an
effect, so it does not block streaming or suspend.

## Next.js — Pages Router

```tsx
// pages/_app.tsx
import { TourProvider } from '@opentutorial/core/react';
import '@opentutorial/core/styles.css';

export default function App({ Component, pageProps }) {
  return (
    <TourProvider specs={specs}>
      <Component {...pageProps} />
    </TourProvider>
  );
}
```

`_app` runs on the server too, but `TourProvider` only constructs the
orchestrator inside an effect, so there is nothing to guard.

## Nuxt

Register client-side only — the `.client` suffix keeps it out of the server
bundle:

```ts
// plugins/opentutorial.client.ts
import { createTourPlugin } from '@opentutorial/core/vue';
import '@opentutorial/core/styles.css';
import { specs } from '~/tours';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createTourPlugin({
    specs,
    onNavigate: (path) => navigateTo(path),
  }));
});
```

Inject it as usual:

```vue
<script setup lang="ts">
import { TOUR_KEY, type VueTour } from '@opentutorial/core/vue';
const tour = inject<VueTour>(TOUR_KEY)!;
</script>
```

## SvelteKit

```ts
// src/lib/tour.ts
import { browser } from '$app/environment';
import { createTourStore } from '@opentutorial/core/svelte';
import { goto } from '$app/navigation';
import { specs } from './specs';

export const tour = browser
  ? createTourStore({ specs, onNavigate: (path) => goto(path) })
  : null;
```

```svelte
<script lang="ts">
  import { tour } from '$lib/tour';
</script>

{#if $tour}
  <button on:click={() => tour.start('welcome')}>Take the tour</button>
{/if}
```

Or defer to `onMount`, which never runs on the server:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createTourStore } from '@opentutorial/core/svelte';

  let tour: ReturnType<typeof createTourStore> | undefined;
  onMount(() => { tour = createTourStore({ specs }); });
  onDestroy(() => tour?.destroy());
</script>
```

Import the stylesheet in your root layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>import '@opentutorial/core/styles.css';</script>
```

## Astro

Astro renders to static HTML, so the tour belongs in a client script:

```astro
---
import specs from '../tours/specs.json';
---

<open-tutorial specs={JSON.stringify(specs)} auto-start="welcome" />

<script>
  import '@opentutorial/core/webcomponent';
  import '@opentutorial/core/styles.css';
</script>
```

Astro's `<script>` runs in the browser only. With a framework island, use that
framework's guide and `client:only` or `client:load`.

## Angular Universal

Guard construction on the platform:

```ts
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideOpenTutorial } from '@opentutorial/core/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    ...(typeof window !== 'undefined' ? [provideOpenTutorial({ specs })] : []),
  ],
};
```

Inside a component:

```ts
private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
ngOnInit() { if (this.isBrowser) this.tours.start('welcome'); }
```

## SolidStart

```tsx
import { isServer } from 'solid-js/web';
import { createTourLayer } from '@opentutorial/core/solid';

const layer = isServer ? null : createTourLayer({ specs });
```

## Remix

```tsx
// app/root.tsx
import { ClientOnly } from 'remix-utils/client-only';
import { TourProvider } from '@opentutorial/core/react';

<ClientOnly fallback={<Outlet />}>
  {() => <TourProvider specs={specs}><Outlet /></TourProvider>}
</ClientOnly>
```

Or rely on the effect-based mount and skip `ClientOnly` entirely — the provider
renders children on the server and mounts the overlay after hydration.

## Hydration mismatches

The library adds no DOM during render, so it cannot cause a mismatch. The
overlay is created in an effect, after hydration.

If a *component* like `TourChecklist` renders differently on server and client
— because `hasSeen()` reads persisted state that only exists in the browser —
render it client-side only:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

return mounted ? <TourChecklist /> : null;
```

## Loading specs from a server

Specs are plain JSON, so fetch them wherever you like:

```tsx
// Next.js server component
async function getSpecs() {
  const res = await fetch('https://cms.example.com/tours', { next: { revalidate: 300 } });
  return res.json();
}

export default async function Layout({ children }) {
  const specs = await getSpecs();
  return <Providers specs={specs}>{children}</Providers>;
}
```

Validate before handing them to the provider — an invalid spec disables its own
tour, but knowing why is better:

```ts
import { validateSpecs } from '@opentutorial/core';

const result = validateSpecs(specs);
if (!result.ok) console.error('Invalid tour specs', result.issues);
```

## Checklist

- [ ] The layer/provider is created in the browser only.
- [ ] The stylesheet is imported once, at the root.
- [ ] `onNavigate` is wired to your router.
- [ ] `userId` is set once the session is known.
- [ ] Specs fetched from a server are validated.
