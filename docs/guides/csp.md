# Content Security Policy

The library is designed to work under a strict CSP. There is one directive that
catches people out, and it is documented first.

## The short answer

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  style-src-attr 'unsafe-inline';
  img-src 'self' data:;
```

The only unusual line is `style-src-attr 'unsafe-inline'`.

## Why `style-src-attr`

Positioning is dynamic. The popover's `left`/`top`, the spotlight cutout, the
arrow offset and the progress-bar width are computed from live layout and written
to the element's `style` property — there is no other way to place an element
where a measurement says it should go.

`style-src-attr` governs exactly that: inline style **attributes** set from
script. It is far narrower than `'unsafe-inline'` on `style-src`, which would
also permit injected `<style>` blocks.

If you cannot allow it, the popover will render unpositioned in the corner.
There is no workaround today — a class-based positioning mode is not something
CSS can express for arbitrary coordinates.

Everything else the library needs is ordinary:

| Directive | Why |
|---|---|
| `script-src 'self'` | The bundle. No `eval`, no `new Function`, no inline scripts. |
| `style-src 'self'` | `dist/styles.css`. |
| `img-src` | Only if your steps use `image` blocks. |
| `media-src` | Only if your steps use `video` blocks. |
| `connect-src` | Only for remote storage or an HTTP analytics adapter. |

## No `eval`, ever

`showIf`, `audience.showIf` and `next[].if` are evaluated by a hand-written
tokenizer and parser. There is no `eval`, no `new Function`, and no `setTimeout`
with a string.

That is a deliberate constraint, not an accident — it is the reason the
expression language is small, and it is enforced by tests.

```
script-src 'self';     # no 'unsafe-eval' needed
```

## Nonces and hashes

The library injects no `<script>` and no `<style>` element into your page, so
there is nothing to nonce.

The exception is `isolate: true`, which injects a `<style>` into its **own shadow
root**. Shadow-root styles are governed by the containing document's policy, so
allow `style-src 'self'` (which you almost certainly already do) — or skip
`isolate` and use the external stylesheet.

## Shadow DOM and `style-src`

```ts
createTutorialLayer({ specs, isolate: true });
```

With a very strict `style-src` that forbids everything, the shadow root's
stylesheet will be blocked and the overlay will render unstyled. In that case,
either relax `style-src` to `'self'`, or drop `isolate` and load
`dist/styles.css` normally.

## Trusted Types

Under `require-trusted-types-for 'script'`, the library is unaffected: it never
assigns to `innerHTML` with script-bearing content, never uses
`document.write`, and never creates a `Function`.

Content rendering escapes author text before formatting, so inline markdown
cannot introduce markup. The one exception is an `html` content block, which
requires you to opt in with `allowHtml: true` — if you have Trusted Types
enabled, either leave `allowHtml` off or sanitize the value before it reaches
the spec.

## Reporting mode first

Roll it out in report-only mode and watch for violations before enforcing:

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  style-src-attr 'unsafe-inline';
  report-uri /csp-report;
```

If you see violations attributed to the library that are not
`style-src-attr`, that is a bug — please open an issue.

## Frame ancestors and iframes

Targeting an element inside an iframe requires that frame to be **same-origin**.
CSP does not change this; the same-origin policy does. A cross-origin frame
resolves to `null` rather than throwing.

## Subresource Integrity

For the CDN build:

```html
<script
  src="https://unpkg.com/@opentutorial/core@0.3.0/dist/opentutorial.global.js"
  integrity="sha384-…"
  crossorigin="anonymous"
></script>
```

Pin an exact version when using SRI — the hash changes with every release.
Generate it with:

```bash
curl -s https://unpkg.com/@opentutorial/core@0.3.0/dist/opentutorial.global.js \
  | openssl dgst -sha384 -binary | openssl base64 -A
```
