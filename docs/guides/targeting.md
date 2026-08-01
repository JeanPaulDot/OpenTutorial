# Targeting

The hard part of a tour is not the copy — it is pointing at an element that will
still be there after the next deploy. Everything in this guide exists to make a
broken selector either survivable or loud.

## Anchors beat selectors

The most durable target is one that exists to be targeted:

```html
<button data-tour="new-project">New project</button>
```

```jsonc
{ "target": { "selector": "[data-tour='new-project']" } }
```

Nobody removes a `data-tour` attribute while renaming CSS classes, and the
recorder scores it highest. If you already use `data-testid`, target that
instead — same reasoning, one less attribute.

## Fallback lists

```jsonc
{ "target": { "selector": ["[data-tour='save']", "#save-btn", "button.save"] } }
```

Tried in order; the first match wins. Useful during a migration, or when a
component renders differently on mobile.

The event stream reports which selector actually matched, so you can retire the
fallbacks once the logs are quiet.

## Text matching

```jsonc
{ "target": { "text": "Save changes" } }
```

Resolves to the **deepest** element whose own text matches, so "Save" finds the
button rather than the surrounding form. Exact matches beat substring matches.

Combine with a selector to narrow it:

```jsonc
{ "target": { "selector": "button", "text": "save changes" } }
```

Matching is case-insensitive and collapses whitespace. It is also inherently
fragile across locales — prefer it as a fallback, not a primary.

## Several matches

```jsonc
{ "target": { "selector": ".row", "index": 2 } }
```

Zero-based. Out of range resolves to nothing rather than the wrong element.

## Highlighting several elements

```jsonc
{ "target": { "selector": "[data-tour='required-field']", "all": true } }
```

Every match gets its own cutout and ring — "fill in these three fields". The
popover anchors to their bounding box, and so does the `target-only`
interaction gap, because a four-panel shield cannot express a disjoint hole.

Rects are re-resolved on every frame, since the elements can reflow
independently of one another.

`all` is ignored when `text` is used: text matching resolves to a single
deepest element by definition.

## Waiting

By default a target must exist when the step is shown. For content that arrives
after a fetch:

```jsonc
{ "target": { "selector": "#chart", "waitFor": true, "timeout": 10000 } }
```

The resolver both observes mutations and polls, because changes inside a shadow
root or an iframe that swaps documents are not always observable from the
top-level tree.

When the timeout expires, the step emits `target-not-found` and the tour
continues rather than hanging.

## Visibility

Present in the DOM is not the same as visible:

```jsonc
{ "target": { "selector": ".tab-panel", "visible": true } }
```

Requires a non-zero box and no `display: none`, `visibility: hidden` or
`opacity: 0`. Pair with `waitFor` for tabs and accordions that mount hidden.

## Shadow DOM

```jsonc
{ "target": { "selector": "#inner-button", "shadow": true } }
```

Searches **open** shadow roots recursively. Closed roots are unreachable by
design — nothing can pierce them, including this library.

## Iframes

```jsonc
{ "target": { "selector": "#submit", "iframe": "#checkout-frame" } }
```

Same-origin only. A cross-origin frame resolves to `null` rather than throwing,
because the browser will not let anyone read into it.

Coordinates are translated automatically: the resolved target carries a
`frameOffset` that maps the element's rect into the top-level viewport, so the
spotlight lands in the right place.

## Scrolling

```jsonc
{
  "target": {
    "selector": "#footer-cta",
    "scrollIntoView": true,
    "scrollBehavior": "smooth",
    "padding": 16
  }
}
```

`scrollIntoView` defaults to `true`. `scrollBehavior` is forced to `auto` under
`prefers-reduced-motion`. `padding` widens the spotlight cutout.

## Targetless steps

Omit `target` for a centred modal — good for an opening or closing step:

```jsonc
{ "id": "intro", "title": "Welcome", "content": "Let's take a look.", "placement": "center" }
```

## When a target is missing

The step emits `target-not-found` with the selector, then the tour moves on. It
never throws and never blocks.

Watch for it in production:

```ts
createTutorialLayer({
  specs,
  onEvent: (e) => {
    if (e.type === 'target-not-found') {
      Sentry.captureMessage(`Tour selector broke: ${e.selector}`, {
        tags: { tourId: e.tourId, stepId: e.stepId },
      });
    }
  },
});
```

`createFunnelReport` also aggregates them under `targetsNotFound`.

## Checking selectors before you ship

Against a running app:

```bash
npx opentutorial lint-selectors http://localhost:3000 specs/
```

It reports dead selectors as failures and ambiguous ones (several matches) as
warnings suggesting `target.index`. Requires Playwright, which is not bundled:

```bash
npm i -D playwright && npx playwright install chromium
```

In the browser, against the current page:

```ts
import { auditSelectors } from '@opentutorial/core/authoring';

auditSelectors(['[data-tour="save"]', '#gone']);
// [{ selector: '[data-tour="save"]', matches: 1, ok: true },
//  { selector: '#gone', matches: 0, ok: false, note: 'no element matches' }]
```

## Generating selectors

The recorder scores candidates by how likely they are to survive:

| Preference | Example | Why |
|---|---|---|
| Tour/test hooks | `[data-tour="save"]` | Exists to be targeted. |
| Stable ids | `#save-button` | Usually authored, occasionally generated. |
| Semantic attributes | `button[name="save"]` | Tied to behaviour, not styling. |
| Scored CSS path | `main > form > button:nth-of-type(2)` | Last resort; brittle. |

Generated ids (`radix-1234`, `:r0:`) and CSS-in-JS class names (`css-1a2b3c`,
`sc-AbCdEf`) are explicitly rejected — they change on every build.

```ts
import { bestSelector } from '@opentutorial/core/authoring';

bestSelector(document.querySelector('#pay')!);
// { selector: '[data-testid="pay-btn"]', score: 95, reason: '…',
//   fallbacks: ['#pay'], text: 'Pay now' }
```

Anything below 40 will probably break; above 70 is safe to ship.
