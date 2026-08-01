# Guidance surfaces

Not all guidance is a step-through tour. These surfaces cover the rest.

Every one is a **framework-free factory** that builds DOM and returns a handle.
React wrappers exist for each, and they wrap the same factories — so the markup,
styling and persistence behaviour are identical everywhere.

```ts
import {
  createBanner, createAnnouncement, createSurvey, createHint,
  createChecklist, createResourceCenter, createChangelog,
} from '@opentutorial/core';
```

```tsx
import {
  Banner, Announcement, Survey, Hint,
  TourChecklist, ResourceCenter, Changelog,
} from '@opentutorial/core/react';
```

## The handle

Every factory returns at least:

| Member | Notes |
|---|---|
| `el` | The root element. Already mounted unless `container: null`. |
| `mount(parent?)` | Attach or move it. |
| `destroy()` | Remove it and release every listener. |

`container` controls placement: omit it for `document.body`, pass an element to
mount there, or pass `null` to keep it detached and place `handle.el` yourself.

## Dismissal state

Surfaces that can be dismissed store that through the same `TourPersistence`
tours use, so they honour your `storage` adapter and `userId` namespacing — a
banner dismissed as one user does not stay dismissed for the next.

They stay hidden until persistence has hydrated, so a dismissed banner never
flashes on screen while an async storage adapter is still loading.

---

## Banner

A persistent bar for notices that are not urgent enough to interrupt.

```ts
const banner = createBanner({
  id: 'maintenance-2026-08',
  message: 'Scheduled maintenance **Sunday 02:00 UTC**.',
  position: 'top',
  action: { label: 'Status page', onClick: () => open('/status') },
  resurfaceAfter: 7 * 24 * 60 * 60 * 1000,
});
```

| Option | Default | Notes |
|---|---|---|
| `id` | — | **Required.** Key the dismissal is stored under. |
| `message` | — | **Required.** Inline markdown. |
| `position` | `'top'` | `'top'` or `'bottom'`. |
| `action` | — | `{ label, onClick }`. |
| `dismissible` | `true` | |
| `resurfaceAfter` | — | Re-show this long after dismissal. Omit for permanent. |
| `onDismiss` | — | |

Handle adds `setMessage(text)` and `dismiss()`.

---

## Announcement

A centred modal for something worth stopping for.

```ts
createAnnouncement({
  id: 'v2-launch',
  title: 'Version 2 is here',
  content: { blocks: [
    { type: 'text', value: 'Faster everywhere, and finally dark mode.' },
    { type: 'image', src: '/img/v2.png', alt: 'Version 2 screenshot' },
  ]},
  primaryAction: { label: 'See what changed', onClick: openChangelog },
  secondaryAction: { label: 'Later', onClick: () => {} },
});
```

| Option | Default | Notes |
|---|---|---|
| `id`, `title`, `content` | — | **Required.** `content` is any `StepContent`. |
| `once` | `true` | Show only once per user. |
| `primaryAction` / `secondaryAction` | — | `{ label, onClick }`. |
| `dismissible` | `true` | Adds a close button and Escape handling. |
| `allowHtml`, `locale`, `i18nResolver` | — | |

Dismissing records a skip; acting records a completion — so you can tell
"ignored it" from "clicked through".

---

## Survey

NPS, a 1–5 rating, single choice, or free text.

```ts
createSurvey({
  id: 'nps-q3',
  kind: 'nps',
  question: 'How likely are you to recommend us?',
  followUp: 'What is the main reason for your score?',
  onSubmit: (response) => api.post('/feedback', response),
  onDismiss: () => {},
});
```

| Option | Default | Notes |
|---|---|---|
| `id`, `question`, `onSubmit` | — | **Required.** |
| `kind` | `'nps'` | `'nps'` (0–10), `'rating'` (1–5), `'choice'`, `'text'`. |
| `options` | `[]` | For `kind: 'choice'`. |
| `lowLabel` / `highLabel` | `'Not likely'` / `'Very likely'` | Scale ends. |
| `followUp` | — | Textarea revealed once a score is picked. |
| `submitLabel`, `dismissLabel`, `thanksMessage` | | |

`SurveyResponse` is `{ surveyId, kind, score?, choice?, comment?, submittedAt }`.

Deliberately transport-agnostic: the response is handed to you, and where it goes
is your decision.

---

## Hint

A permanent "what is this?" marker, not part of any flow.

```ts
createHint({
  target: "[data-tour='filters']",
  content: 'Filters combine with **AND**.',
  glyph: '?',
  openOnHover: true,
});
```

Position is recomputed on scroll, resize and layout changes, so the dot stays
pinned in a scrolling page. If the target disappears the hint hides itself.

Handle adds `open()`, `close()` and `reposition()`.

---

## Checklist

An onboarding checklist that derives its own status.

```ts
const checklist = createChecklist({
  layer,
  floating: true,
  collapsible: true,
  hideWhenComplete: true,
  onComplete: () => confetti(),
});
```

| Option | Default | Notes |
|---|---|---|
| `layer` | — | **Required.** Any `TourController` — the vanilla layer works as-is. |
| `specs` | every registered spec | |
| `getStatus` | derived | Override to compute status yourself. |
| `onStart` | `layer.start` | |
| `title` | `'Onboarding'` | |
| `floating`, `collapsible`, `defaultCollapsed`, `hideWhenComplete` | `false` | |
| `startLabel`, `runningLabel` | `'Start'`, `'Running'` | |
| `locale`, `i18nResolver` | | i18n titles and descriptions are resolved, not printed raw. |

Status comes from persisted state by default: `completed` if seen,
`in_progress` if it is the active tour, `pending` otherwise. The list repaints on
every tour event, so finishing a tour ticks its row with no wiring.

Handle adds `refresh()`, `setCollapsed(bool)` and `getProgress()`.

---

## Resource centre

A searchable hub of every tour plus your own links.

```ts
createResourceCenter({
  layer,
  floating: true,
  links: [
    { label: 'Documentation', href: 'https://docs.example.com' },
    { label: 'Contact support', href: '/support', description: 'We reply within a day' },
  ],
});
```

This is what makes one-shot onboarding safe to dismiss: there is always a way
back into guidance the user waved away.

Search matches titles and descriptions. Tours already seen are marked with `↻`.

Handle adds `open()`, `close()`, `search(query)` and `refresh()`.

---

## Changelog

A what's-new widget with an unread badge.

```ts
const changelog = createChangelog({
  entries: [
    { id: '2026-07-30', title: 'Dark mode', date: '2026-07-30', tag: 'New',
      content: 'Follows your system setting automatically.' },
    { id: '2026-07-12', title: 'Faster search', tag: 'Improved',
      content: 'Roughly 3× quicker on large workspaces.',
      href: 'https://example.com/releases/2026-07-12' },
  ],
  floating: true,
  onRead: (ids) => analytics.track('changelog_read', { ids }),
});
```

| Option | Default | Notes |
|---|---|---|
| `entries` | — | **Required.** |
| `title` | `"What's new"` | |
| `floating` | `true` | Launcher with an unread count. |
| `limit` | `20` | Entries rendered. |
| `emptyMessage`, `launcherGlyph`, `allowHtml`, `locale`, `i18nResolver` | | |
| `onRead` | — | Called with the ids that were unread when opened. |

Read state is tracked **per entry id**, not as a single "last seen" timestamp.
So inserting a backdated entry still surfaces it, and re-ordering the feed never
marks anything unread again.

Opening the panel renders entries as unread first, *then* marks them read — the
whole point of opening is to see what is new.

Handle adds `open()`, `close()`, `unread()`, `markAllRead()` and
`setEntries(entries)` — the last for feeds fetched after mount.

---

## Using them outside React

The factories are the primary API; React is a wrapper. In Vue, Svelte, Angular
or Solid, create the surface on mount and destroy it on teardown:

```ts
// Svelte
onMount(() => { handle = createChecklist({ layer: tour, container: host }); });
onDestroy(() => handle?.destroy());
```

The framework guides each show this pattern for their idioms.
