# Spec reference

A `TutorialSpec` is plain JSON. Nothing in it is a function, so specs can live in
a database, be fetched at runtime, or be authored by someone who does not write
code.

Point `$schema` at the bundled JSON Schema for editor autocomplete:

```json
{
  "$schema": "https://unpkg.com/@opentutorial/core/dist/spec.schema.json",
  "specVersion": 1,
  "id": "quick-start",
  "title": "Quick start",
  "steps": []
}
```

Validation is **fail-closed**: a spec with errors disables its own tour and
nothing else. Warnings never disable anything unless you pass `strict: true`.
Run `npx opentutorial validate` in CI to catch problems before they ship.

---

## TutorialSpec

| Field | Type | Default | Notes |
|---|---|---|---|
| `specVersion` | `1` | — | **Required.** The only supported version. |
| `id` | `string` | — | **Required.** Kebab-case, unique across your tours. |
| `title` | `I18nContent` | — | **Required.** |
| `description` | `I18nContent` | — | Shown by the checklist and the resource centre. |
| `version` | `string` | — | Bump it to re-show a tour users have already completed. |
| `priority` | `number` | `0` | Higher wins when several tours are queued. |
| `trigger` | `TourTrigger` | `{ type: 'manual' }` | See [Triggers](guides/triggers-and-orchestration.md). |
| `audience` | `{ showIf?: string }` | — | Spec-level gate, evaluated against the tour context. |
| `frequency` | `FrequencyRule` | — | Impression caps. |
| `onComplete` | `{ startTour?, emit?, navigate? }` | — | Chain into another tour, fire an event, or navigate. |
| `theme` | `ThemeOverrides` | — | Overrides the provider theme for this tour. |
| `interaction` | `InteractionMode` | `'free'` | Default for every step. |
| `density` | `Density` | `'comfortable'` | How roomy the chrome is. |
| `steps` | `TourStep[]` | — | **Required.** At least one. |

### FrequencyRule

| Field | Type | Notes |
|---|---|---|
| `max` | `number` | Maximum lifetime impressions. |
| `cooldown` | `number` | Minimum milliseconds between impressions. |
| `perSession` | `number` | Maximum impressions in the current page session. |

Impressions are counted when a tour actually starts, and persist per user.

---

## TourStep

| Field | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | **Required.** Unique within the spec. |
| `title` | `I18nContent` | — | **Required.** |
| `content` | `StepContent` | — | **Required.** String, i18n object, or block list. |
| `target` | `TourTarget` | — | Omit for a centred, targetless step. |
| `placement` | `Placement` | `'auto'` | Where the popover sits relative to the target. |
| `display` | `DisplayMode` | `'spotlight'` | |
| `buttons` | `StepButtons` | — | Per-step label overrides; `false` hides a button. |
| `advanceOn` | `AdvanceOn` | `'button'` | What moves the tour forward. |
| `event` | `string` | — | Required by `advanceOn: 'event'`. |
| `duration` | `number` | — | Milliseconds for `advanceOn: 'auto'`. |
| `match` | `string` | — | Expected value for `advanceOn: 'input-match'`. Wrap in `/…/` for a regex. |
| `watch` | `string` | — | Selector for `element-appears` / `element-disappears`. |
| `urlPattern` | `string` | — | Path pattern for `url-match`. A trailing `*` is a wildcard. |
| `interaction` | `InteractionMode` | inherits | Overrides the spec-level mode. |
| `density` | `Density` | inherits | Overrides the spec-level density. |
| `skippable` | `boolean` | `true` | Shows the close button. |
| `canGoBack` | `boolean` | `true` | Shows the back button. |
| `next` | `NextSpec` | — | A step id, or a list of `{ if, to }` branch rules. |
| `showIf` | `string` | — | Expression; a false step is skipped entirely. |
| `theme` | `ThemeOverrides` | — | Overrides the spec theme for this step. |
| `onEnter` | `StepAction[]` | — | Runs when the step is shown. |
| `onExit` | `StepAction[]` | — | Runs when the step is left. |

`advanceOn: 'target-click'`, `'input-match'` and `'form-submit'` require a
`target`; the validator rejects the step otherwise.

### Placement

`auto` · `top` · `top-start` · `top-end` · `bottom` · `bottom-start` ·
`bottom-end` · `left` · `left-start` · `left-end` · `right` · `right-start` ·
`right-end` · `center`

Placements are authored logically. Under `dir="rtl"` a `left` placement is
mirrored to `right` automatically, so one spec serves both directions.

If the requested side does not fit, the popover flips to the opposite side, then
falls back to whichever side has the most room, then clamps into the viewport.

### DisplayMode

| Mode | Behaviour |
|---|---|
| `spotlight` | Backdrop with a cutout around the target, plus a popover. |
| `hotspot` | A pulsing dot with a small tooltip. No backdrop. |
| `beacon` | A pulsing dot only, with the content as its tooltip. |
| `modal` | Centred dialog, no target. |
| `banner` | Docked bar rather than a popover. |

### Density

| Value | Effect |
|---|---|
| `compact` | Tighter padding, 12.5px text, 10px radius. Dense admin tools. |
| `comfortable` | The default. |
| `spacious` | Roomier padding, 14.5px text, 18px radius. Marketing walkthroughs. |

Density scales spacing, font size and radius together, and everything else —
headings, buttons, code blocks, the arrow — derives from those, so one setting
moves the whole card coherently. Resolution is step → spec → provider option.

### InteractionMode

| Mode | Behaviour |
|---|---|
| `free` | Everything on the page stays clickable. Default. |
| `target-only` | Only the highlighted element and the popover accept input. |
| `blocked` | Only the popover accepts input. |

`blocked` also sets `aria-modal="true"`; the other modes do not, because a
tooltip beside a still-usable page must not hide that page from screen readers.

---

## TourTarget

| Field | Type | Default | Notes |
|---|---|---|---|
| `selector` | `string \| string[]` | — | A list is tried in order; the first match wins. |
| `text` | `string` | — | Match by visible text. Combines with `selector` to narrow it. |
| `index` | `number` | `0` | Pick the nth match. |
| `all` | `boolean` | `false` | Highlight **every** match, not just one. The popover anchors to their union. |
| `shadow` | `boolean` | `false` | Search open shadow roots too. |
| `iframe` | `string` | — | Selector of a **same-origin** iframe to search inside. |
| `waitFor` | `boolean` | `false` | Wait for the element instead of failing immediately. |
| `timeout` | `number` | `5000` | How long `waitFor` waits. |
| `visible` | `boolean` | `false` | Require a non-zero box and no `display:none` / `visibility:hidden`. |
| `scrollIntoView` | `boolean` | `true` | Scroll the target into view before showing the step. |
| `scrollBehavior` | `'auto' \| 'smooth'` | `'smooth'` | Forced to `auto` under `prefers-reduced-motion`. |
| `padding` | `number` | `8` | Extra space around the spotlight cutout. |

See [Targeting](guides/targeting.md) for how to pick selectors that survive a
redeploy.

---

## StepContent

Either a string (inline markdown), an i18n object, or a block list.

```jsonc
{
  "content": "Click **Save** to continue."           // inline markdown
}
```

```jsonc
{
  "content": {
    "blocks": [
      { "type": "text",  "value": "Here is the **dashboard**." },
      { "type": "image", "src": "/img/dash.png", "alt": "The dashboard" },
      { "type": "video", "src": "/vid/tour.mp4", "poster": "/img/poster.png" },
      { "type": "list",  "items": ["First", "Second"], "ordered": true },
      { "type": "code",  "value": "npm i @opentutorial/core", "lang": "bash" },
      { "type": "divider" },
      { "type": "html",  "value": "<b>only with allowHtml</b>" }
    ]
  }
}
```

Text content is **full markdown**: headings, ordered and unordered lists,
blockquotes, fenced code, horizontal rules, images and inline emphasis.

```jsonc
{
  "content": "## Connect a source

Pick one, then authorise it.

- Postgres
- BigQuery

> Read-only credentials are enough."
}
```

Everything is escaped **before** it is formatted, so author text can never
inject markup — that ordering is the whole security model, and it holds whether
the spec came from your repo or a database.

Links to script-bearing schemes (`javascript:`, `vbscript:`, `data:`) are
dropped, including forms obfuscated with control characters. Relative links
(`/settings`, `#anchor`) are allowed and open in the same tab; external links
get `target="_blank"` and `rel="noopener noreferrer"`.

See [Content & theming](guides/content-and-theming.md#markdown) for the full
syntax table.

`html` blocks are **escaped and rendered as visible text** unless you pass
`allowHtml: true`. That is deliberate: an author who used a block the host has
not enabled sees why, instead of watching their content silently vanish.

---

## Expressions

`showIf`, `audience.showIf` and `next[].if` all use the same small expression
language. It is a hand-written parser — no `eval`, no `new Function` — so the
library works under a strict Content Security Policy.

**Supported**

| Category | Operators |
|---|---|
| Comparison | `===` `!==` `==` `!=` `<` `<=` `>` `>=` |
| Logic | `&&` `\|\|` `!` |
| Arithmetic | `+` `-` `*` `/` `%`, unary `-` |
| Grouping | `( … )` |
| Ternary | `cond ? a : b` |
| Access | `a.b.c`, `list[0]`, `list.length` |
| Methods | `includes` `startsWith` `endsWith` `toLowerCase` `toUpperCase` `trim` `indexOf` `matches` |

```js
"plan === 'pro' && seats > 5"
"user.roles.includes('admin')"
"tags[0] === 'beta' ? 'a' : 'b'"
"email.matches('@acme\\\\.com$')"
```

**Not supported, by design:** assignment, function definitions, arbitrary method
calls, and any access to `constructor`, `prototype` or `__proto__`. Identifiers
resolve only against the tour context — there is no path to `window`.

Anything that fails to parse evaluates to `false` and is reported through the
debug overlay rather than throwing.

---

## StepAction

Actions run on `onEnter` and `onExit`. Each is individually try/caught, so a
failing action never breaks the step.

| Action | Shape |
|---|---|
| Emit an event | `{ "type": "emit", "name": "tour:reached-billing", "detail": {} }` |
| Click the target | `{ "type": "click" }` |
| Focus the target | `{ "type": "focus" }` |
| Navigate | `{ "type": "navigate", "path": "/settings" }` |
| Set context | `{ "type": "setContext", "key": "seenBilling", "value": true }` |
| Scroll to an element | `{ "type": "scrollTo", "selector": "#footer" }` |
| Wait | `{ "type": "wait", "ms": 300 }` |

`navigate` calls your `onNavigate` handler when you supply one, so an SPA pushes
state instead of doing a full page load.

---

## I18nContent

Anywhere the table above says `I18nContent`, you may write either a string or
`{ key, fallback? }`:

```jsonc
{ "title": "Welcome" }
{ "title": { "key": "tour.welcome.title", "fallback": "Welcome" } }
```

See [i18n](guides/i18n.md) for resolvers, interpolation and pluralization.

---

## A complete example

```jsonc
{
  "$schema": "https://unpkg.com/@opentutorial/core/dist/spec.schema.json",
  "specVersion": 1,
  "id": "billing-setup",
  "title": "Set up billing",
  "description": "Add a card so your trial does not lapse.",
  "version": "2",
  "priority": 10,
  "trigger": { "type": "route", "path": "/settings/billing" },
  "audience": { "showIf": "plan === 'trial' && daysLeft < 7" },
  "frequency": { "max": 3, "cooldown": 86400000 },
  "interaction": "target-only",
  "onComplete": { "startTour": "invite-team" },
  "steps": [
    {
      "id": "open-form",
      "title": "Add a payment method",
      "content": "It takes about a minute.",
      "target": { "selector": ["[data-tour='add-card']", "#add-card"], "waitFor": true },
      "placement": "bottom",
      "advanceOn": "target-click"
    },
    {
      "id": "fill-card",
      "title": "Enter your card",
      "content": { "blocks": [
        { "type": "text", "value": "We never store the number ourselves." },
        { "type": "image", "src": "/img/pci.png", "alt": "PCI compliance badge" }
      ]},
      "target": { "selector": "#card-number" },
      "advanceOn": "input-match",
      "match": "/^\\d{4}/"
    },
    {
      "id": "confirm",
      "title": "Confirm",
      "content": "Press **Save** and you are done.",
      "target": { "selector": "#save-card" },
      "advanceOn": "form-submit",
      "next": [
        { "if": "plan === 'trial'", "to": "trial-note" },
        { "if": "true", "to": "thanks" }
      ]
    },
    { "id": "trial-note", "title": "Trial continues", "content": "You keep your remaining trial days.", "placement": "center" },
    { "id": "thanks", "title": "Thanks", "content": "Billing is set up.", "placement": "center" }
  ]
}
```
