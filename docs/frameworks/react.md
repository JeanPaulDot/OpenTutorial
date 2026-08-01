# React

```bash
npm install @opentutorial/core react react-dom
```

## Provider

```tsx
import { TourProvider } from '@opentutorial/core/react';
import '@opentutorial/core/styles.css';

export default function App() {
  return (
    <TourProvider
      specs={[welcome, billing]}
      context={{ plan: user.plan }}
      userId={user.id}
      onEvent={(e) => analytics.track(e.type, e)}
    >
      <YourApp />
    </TourProvider>
  );
}
```

`TourProviderProps` accepts every [core option](../api-reference.md#options),
plus `storage` and `keyPrefix` at the top level, and `renderStep` typed to return
`ReactNode`.

## useTour

```tsx
import { useTour } from '@opentutorial/core/react';

function StartButton() {
  const { start, request, activeId, state, whyBlocked } = useTour();

  return (
    <button data-tour="start" onClick={() => start('welcome')} disabled={activeId !== null}>
      {state?.status === 'running' ? `Step ${state.index + 1} of ${state.total}` : 'Take the tour'}
    </button>
  );
}
```

The context value is documented in full in the
[API reference](../api-reference.md). The pieces you will reach for most:

| Field | Notes |
|---|---|
| `start(id, stepId?)` | Starts now, preempting anything running. |
| `request(id, stepId?)` | Honours audience, frequency and the queue. |
| `activeId`, `state` | Reactive. |
| `events`, `clearEvents()` | A rolling log, handy in development. |
| `context`, `setContext(patch)` | Reactive context. |
| `hasSeen(id)`, `whyBlocked(id)` | |
| `exportProgress()`, `importProgress(data, mode?)` | |

`useTour` throws if called outside a `TourProvider`, which is almost always a
missing provider rather than a real bug in your component.

## Anchors

```tsx
import { TourAnchor } from '@opentutorial/core/react';

<TourAnchor id="new-project">
  <button>New project</button>
</TourAnchor>
```

`TourAnchor` adds `data-tour="new-project"` to its child. Setting the attribute
yourself works exactly as well.

## Custom step rendering

Replace the built-in popover with your own component. The layer still handles
positioning, the backdrop and interaction gating.

```tsx
<TourProvider
  specs={specs}
  renderStep={({ step, index, total, next, prev, skip, isLast }) => (
    <div className="my-card">
      <h2>{String(step.title)}</h2>
      <p>{index + 1} / {total}</p>
      <button onClick={prev}>Back</button>
      <button onClick={next}>{isLast ? 'Done' : 'Next'}</button>
      <button onClick={skip}>Close</button>
    </div>
  )}
>
```

## Components

All of these come from `@opentutorial/core/react`:

```tsx
import {
  TourChecklist, Banner, Announcement, Survey, ResourceCenter, Hint, Changelog,
} from '@opentutorial/core/react';
```

```tsx
<TourChecklist title="Get started" floating collapsible hideWhenComplete />

<Banner
  id="maintenance"
  message="Scheduled maintenance **Sunday 02:00 UTC**."
  action={{ label: 'Details', onClick: openStatusPage }}
  resurfaceAfter={7 * 24 * 60 * 60 * 1000}
/>

<Announcement
  id="v2-launch"
  title="Version 2 is here"
  content={{ blocks: [
    { type: 'text', value: 'Faster, and finally with dark mode.' },
    { type: 'image', src: '/img/v2.png', alt: 'Version 2 screenshot' },
  ]}}
  primaryAction={{ label: 'See what changed', onClick: openChangelog }}
/>

<Survey id="nps-q3" question="How likely are you to recommend us?"
        followUp="What is the main reason for your score?"
        onSubmit={(r) => api.post('/feedback', r)} />

<ResourceCenter floating links={[{ label: 'Docs', href: 'https://docs.example.com' }]} />

<Hint target="[data-tour='filters']" content="Combine filters with **AND**." />

<Changelog entries={releaseNotes} floating />
```

`TourChecklist` and `ResourceCenter` read the specs registered on the provider,
so they need no props to work. Everything else is standalone.

## Next.js App Router

The React adapter carries `'use client'`, so importing it from a server
component is safe — but the provider itself must live in a client component.

```tsx
// app/providers.tsx
'use client';

import { TourProvider } from '@opentutorial/core/react';
import '@opentutorial/core/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return <TourProvider specs={specs}>{children}</TourProvider>;
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
```

Hand `onNavigate` to the router so `navigate` actions push state instead of
reloading:

```tsx
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();
<TourProvider specs={specs} onNavigate={(path) => router.push(path)}>
```

See the [SSR guide](../guides/ssr.md) for Pages Router, streaming and hydration
notes.

## Testing

The provider works in jsdom. Drive it through `act`:

```tsx
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { TourProvider, useTour } from '@opentutorial/core/react';
import { createMemoryStorage } from '@opentutorial/core';

// Use memory storage so tests do not share localStorage.
<TourProvider specs={specs} storage={createMemoryStorage()}>
```

`src/core/__tests__/react.test.tsx` in this repository is a working example.
