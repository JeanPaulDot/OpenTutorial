# Content & theming

## Content

### Markdown

Step content is full markdown.

```jsonc
{ "content": "Click **Save**, then open `settings.json`. [Docs](https://example.com)" }
```

| Syntax | Renders |
|---|---|
| `**bold**`, `*italic*`, `~~strike~~`, `` `code` `` | Inline emphasis |
| `[text](url)` | Link |
| `![alt](src)` | Inline image |
| `#` through `######` | Headings 1–6 |
| `-`, `*`, `+` | Unordered list |
| `1.` | Ordered list (honours the start number) |
| `>` | Blockquote, with blocks nestable inside |
| Triple-backtick fence | Code block with a language class |
| `---`, `***`, `___` | Horizontal rule |
| Blank line | New paragraph |

In a spec file, newlines are escaped:

```jsonc
{ "content": "## Connect a source\n\nPick one:\n\n- Postgres\n- BigQuery\n\n> Read-only credentials are enough." }
```

In code, a template literal reads better:

```ts
const content = `## Connect a source

Pick one:

- Postgres
- BigQuery

> Read-only credentials are enough.`;
```

A step with no block syntax stays a single `<p>`, so the common case produces
exactly the markup it always did.

**Escaping happens before formatting, never after.** Author text becomes inert
HTML entities first, so a spec cannot inject markup — and there is no sanitizer
to keep ahead of attackers.

Links to `javascript:`, `vbscript:`, `data:` and `file:` are dropped, including
forms obfuscated with control characters, because browsers would parse those as
executable. Relative links (`/settings`, `#anchor`) are allowed and stay in the
same tab; external links get `target="_blank"` and `rel="noopener noreferrer"`.
Images may additionally use `data:image/…`, which cannot execute.

Deliberately **not** supported: nested lists, reference links, and inline HTML.
A tour step is a paragraph or two; everything past that is surface area an
author can get wrong and a reviewer has to check. Use content blocks instead.

To restrict a step to inline formatting — because its copy legitimately starts
lines with `-` or `1.` — pass `markdown: 'inline'` to `renderBlocks`.

### Content blocks

For anything richer, use a block list:

```jsonc
{
  "content": {
    "blocks": [
      { "type": "text",  "value": "Here is your **dashboard**." },
      { "type": "image", "src": "/img/dash.png", "alt": "Dashboard", "width": 480 },
      { "type": "video", "src": "/vid/tour.mp4", "poster": "/img/poster.png", "controls": true },
      { "type": "list",  "items": ["Filter", "Sort", "Export"], "ordered": true },
      { "type": "code",  "value": "npm i @opentutorial/core", "lang": "bash" },
      { "type": "divider" },
      { "type": "html",  "value": "<custom-element></custom-element>" }
    ]
  }
}
```

| Block | Fields |
|---|---|
| `text` | `value` (i18n content, inline markdown) |
| `image` | `src`, `alt` (both required), `width`, `height` |
| `video` | `src` (required), `poster`, `autoplay`, `loop`, `muted`, `controls` |
| `list` | `items` (required), `ordered` |
| `code` | `value` (required), `lang` |
| `divider` | — |
| `html` | `value` (required) — needs `allowHtml: true` |

`alt` is required on images because a tour that cannot be read aloud is not
finished.

### Raw HTML

`html` blocks are inert unless the host opts in:

```ts
createTutorialLayer({ specs, allowHtml: true });
```

Without it, the markup is **escaped and shown as text** rather than dropped, so
an author immediately sees the block was rejected instead of wondering where
their content went.

Only enable `allowHtml` for specs you control. It is the one place the library
will put author-supplied markup into the DOM.

---

## Theming

Everything is a CSS custom property on `.ot-root`. There are exactly 20:

| Property | Theme key | Default |
|---|---|---|
| `--ot-accent` | `accent` | `#6d5cff` |
| `--ot-bg` | `bg` | `#ffffff` |
| `--ot-fg` | `fg` | `#181822` |
| `--ot-muted` | `muted` | `#67677c` |
| `--ot-border` | `border` | 22% of muted |
| `--ot-success` | `success` | `#10b981` |
| `--ot-danger` | `danger` | `#ef4444` |
| `--ot-backdrop` | `backdrop` | `rgba(12, 12, 22, 0.55)` |
| `--ot-radius` | `radius` | `14px` |
| `--ot-shadow` | `shadow` | layered soft shadow |
| `--ot-font` | `font` | system UI stack |
| `--ot-font-size` | `fontSize` | `13.5px` |
| `--ot-spacing` | `spacing` | `16px` |
| `--ot-arrow-size` | `arrowSize` | `10px` |
| `--ot-overlay-blur` | `overlayBlur` | `0px` |
| `--ot-anim-ms` | `animationMs` | `180ms` |
| `--ot-z` | `z` | `9999` |
| `--ot-spotlight-ring` | `spotlightRing` | `var(--ot-accent)` |
| `--ot-popover-width` | `popoverWidth` | `340px` |

Numeric theme keys take plain numbers; the engine appends the unit
(`radius`, `fontSize`, `spacing`, `arrowSize`, `overlayBlur`, `popoverWidth` →
px; `animationMs` → ms).

### Density

```ts
createTutorialLayer({ specs, density: 'compact' });
```

```jsonc
{ "density": "spacious", "steps": [{ "id": "s1", "density": "compact" }] }
```

| Value | Spacing | Font | Radius |
|---|---|---|---|
| `compact` | 11px | 12.5px | 10px |
| `comfortable` | 16px | 13.5px | 14px |
| `spacious` | 22px | 14.5px | 18px |

Everything else derives from those three, so headings, buttons, code blocks and
the arrow all move together. Resolution is step → spec → provider option.

It lands as `data-ot-density` on the popover, so host CSS can target it without
knowing our class names:

```css
.ot-popover[data-ot-density="compact"] .ot-title { letter-spacing: 0; }
```

### Auto-sizing

The popover measures its content and picks its own width, between 240px and
460px, clamped to the viewport. A one-line step gets a narrow card; a step with
a code block gets a wide one.

```ts
createTutorialLayer({ specs, autoSize: false });   // fixed --ot-popover-width
```

Height is **capped**, not sized: at 70% of the viewport, long content scrolls
inside the card while the title and footer stay put. Losing the Next button
below the fold on a short screen was the failure mode this replaces.

On mobile the bottom sheet is full-bleed, so auto-sizing steps aside there.

### Three levels

Themes cascade global → spec → step, each overriding the last:

```ts
createTutorialLayer({ specs, theme: { accent: '#0f766e', radius: 8 } });
```

```jsonc
{ "id": "billing", "theme": { "accent": "#b45309" }, "steps": [
  { "id": "warn", "theme": { "accent": "#dc2626" }, /* … */ }
]}
```

At runtime:

```ts
layer.setTheme({ accent: '#7c3aed' });
```

### From your own CSS

You do not need the theme API at all — override the properties directly:

```css
.ot-root {
  --ot-accent: var(--brand-primary);
  --ot-font: var(--font-sans);
  --ot-radius: 4px;
}
```

### Dark mode

Dark tokens apply automatically under `prefers-color-scheme: dark`. To force a
mode, set `data-ot-theme` on the layer root:

```css
.ot-root[data-ot-theme="dark"] { /* built in */ }
```

```ts
document.querySelector('.ot-root')?.setAttribute('data-ot-theme', 'light');
```

`data-ot-theme="light"` also opts out of the media query, for apps with their own
theme switch.

### RTL

```ts
createTutorialLayer({ specs, dir: 'rtl' });
```

The stylesheet uses logical properties (`inset-inline-end`, `padding-inline-start`),
and placements are mirrored: a `left` placement becomes `right`. One spec serves
both directions.

`localeDirection('ar')` returns `'rtl'` if you want to derive `dir` from the
active locale.

### Reduced motion

Under `prefers-reduced-motion: reduce`, the library disables popover animation,
the spotlight transition, the beacon pulse and the checklist bar transition, and
switches `scrollIntoView` to `auto`. Nothing needs configuring.

### Shadow-DOM isolation

If the host page has aggressive global CSS:

```ts
createTutorialLayer({ specs, isolate: true });
```

The overlay renders inside a shadow root with the stylesheet injected, so host
CSS cannot reach in and the library's styles cannot leak out. The trade-off is
that your own `.ot-root` overrides no longer apply — use the `theme` option
instead.

### Portals

```ts
createTutorialLayer({ specs, container: document.getElementById('app-root')! });
```

Useful inside a fullscreen element or a dialog with its own stacking context,
where a `document.body` overlay would render behind everything.

---

## Custom rendering

When theming is not enough, replace the popover entirely. The layer still owns
positioning, the backdrop and interaction gating.

**Vanilla:**

```ts
createTutorialLayer({
  specs,
  renderStep: (ctx, host) => {
    host.innerHTML = `<h2>${ctx.step.title}</h2>`;
    const next = document.createElement('button');
    next.textContent = ctx.isLast ? 'Done' : 'Next';
    next.onclick = ctx.next;
    host.appendChild(next);

    return () => { host.innerHTML = ''; };   // optional cleanup
  },
});
```

**React:** see the [React guide](../frameworks/react.md#custom-step-rendering).

`StepRenderContext` carries `step`, `index`, `total`, `isLast`, `canGoBack`,
`next`, `prev`, `skip` and the resolved `target`.

---

## Mobile

Below 480px the popover docks as a bottom sheet: full width, anchored to the
bottom, no arrow, with 44px minimum touch targets. Horizontal swipes move
between steps (right-to-left advances; mirrored under RTL).

Swipes are ignored when the gesture starts on a control, inside a horizontally
scrollable block, or on a step whose Next button is hidden — so a swipe can never
bypass an `advanceOn: 'target-click'` step. Disable them with `swipe: false`.
