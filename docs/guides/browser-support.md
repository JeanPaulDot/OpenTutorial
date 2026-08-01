# Browser support

## Supported

| Browser | Minimum |
|---|---|
| Chrome / Edge | 111 |
| Firefox | 113 |
| Safari | 16.4 |
| iOS Safari | 16.4 |
| Chrome Android | 111 |

The build targets **ES2020**, so the syntax itself runs much further back. The
floor above is set by the newest **runtime and CSS** features the library relies
on, listed below.

Node 18+ is required for the CLI and for anything that imports the package in a
server context.

## What sets the floor

| Feature | Used for | Chrome | Firefox | Safari |
|---|---|---|---|---|
| CSS `color-mix()` | Borders, hover states, code backgrounds | 111 | 113 | 16.2 |
| CSS logical properties (`inset-inline-end`) | RTL layout | 87 | 66 | 14.1 |
| `Intl.PluralRules` | Pluralization | 63 | 58 | 13 |
| `Element.replaceChildren()` | Efficient re-renders | 86 | 78 | 14 |
| `ResizeObserver` | Keeping hints pinned | 64 | 69 | 13.1 |
| `attachShadow` | `isolate: true` | 53 | 63 | 10 |
| `queueMicrotask` | Global alias in the IIFE build | 71 | 69 | 12.1 |
| `structuredClone`-free JSON cloning | Export/import | — | — | — |

`color-mix()` in Safari 16.2 and the `Intl` and CSS combination is what puts the
practical floor at **Safari 16.4**.

## Degrading gracefully

Several features detect and fall back rather than failing:

| Feature | Without it |
|---|---|
| `IndexedDB` | `createIndexedDBStorage()` falls back to in-memory storage. |
| `localStorage` (private mode) | Falls back to in-memory storage. The write is probed, not just the property — Safari private mode exposes `localStorage` and throws on write. |
| `ResizeObserver` | Hints still reposition on scroll and resize, just not on layout-only changes. |
| `navigator.clipboard` | The recorder logs the JSON to the console instead. |
| `attachShadow` | `isolate: true` silently renders in the light DOM. |
| `Intl.PluralRules` with an invalid tag | Falls back to English-style `one`/`other`. |
| `sendBeacon` | The HTTP analytics adapter falls back to `fetch`. |

Nothing in this list throws. The tour still runs.

## Older browsers

To support below the floor, transpile and polyfill in your own build:

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy';

export default {
  plugins: [legacy({ targets: ['defaults', 'Safari >= 14'] })],
};
```

Then supply CSS fallbacks for `color-mix()`:

```css
.ot-root {
  --ot-border: rgba(103, 103, 124, 0.22);   /* replaces the color-mix default */
}
```

Note that `color-mix()` appears in the *default* values only. Set every token
explicitly and the library needs no `color-mix()` support at all.

## Feature-specific requirements

| Spec feature | Requirement |
|---|---|
| `target.shadow` | The shadow root must be **open**. Closed roots are unreachable by anything. |
| `target.iframe` | The frame must be **same-origin**. |
| `advanceOn: 'url-match'`, `trigger: route` | `history.pushState` — universal. |
| `trigger: idle` | Pointer and key events — universal. |
| Swipe gestures | Touch events. Ignored on non-touch devices. |
| `interaction: 'target-only'` | `pointer-events` — universal. |

## Server-side rendering

The package touches `document` and `window` at construction, so it must not run
during SSR. See the [SSR guide](ssr.md). The React adapter carries `'use client'`
so importing it from a server component is safe.

## Testing matrix

CI runs the E2E and accessibility suites on Chromium desktop and an emulated
Pixel 7. The unit suite runs in jsdom.

Firefox and WebKit are not currently in CI. If you hit a browser-specific
problem, please report it with the version — the Playwright config already has
project slots for both.

## Known issues

None currently tracked. Please [open an issue](https://github.com/JeanPaulDot/OpenTutorial/issues)
with the browser and version if you find one.
