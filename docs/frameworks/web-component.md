# Web Component & vanilla JS

`<open-tutorial>` is a standard custom element. It works in Angular, Lit, Astro,
Ember, Rails, Django, WordPress, a static HTML file — anywhere that runs a
`<script>` tag. No bundler, no framework, no build step.

## Script tag

```html
<link rel="stylesheet" href="https://unpkg.com/@opentutorial/core/dist/styles.css">
<script src="https://unpkg.com/@opentutorial/core/dist/opentutorial.global.js"></script>

<open-tutorial auto-start="welcome">
  <script type="application/json">
    {
      "specVersion": 1,
      "id": "welcome",
      "title": "Welcome",
      "steps": [
        {
          "id": "intro",
          "title": "Start here",
          "content": "This is your dashboard.",
          "target": { "selector": "[data-tour='dashboard']" }
        }
      ]
    }
  </script>
</open-tutorial>
```

The global build registers the element and the `?ot-record=1` recorder hook
automatically. It exposes `window.OpenTutorial` (and `window.Opentutorial` as a
backwards-compatible alias).

## As a module

```ts
import '@opentutorial/core/webcomponent';   // registers <open-tutorial>
import '@opentutorial/core/styles.css';
```

To choose your own tag name, import the definer instead:

```ts
import { defineOpenTutorialElement } from '@opentutorial/core';
defineOpenTutorialElement('acme-tours');
```

## Attributes

| Attribute | Type | Notes |
|---|---|---|
| `specs` | JSON | One spec or an array. Alternative to the inline `<script>`. |
| `context` | JSON | Object read by `showIf` / `audience`. |
| `theme` | JSON | `ThemeOverrides`. |
| `locale` | string | |
| `dir` | `ltr` \| `rtl` | |
| `z-index` | number | |
| `interaction` | `free` \| `target-only` \| `blocked` | |
| `auto-start` | tour id | Starts once the layer is ready. |
| `deep-link-param` | string \| `false` | Defaults to `tour`. |
| `resume` | boolean attr | Resume at the last step. |
| `auto-resume` | boolean attr | Continue after a full page navigation. |
| `isolate` | boolean attr | Render inside a shadow root. |
| `allow-html` | boolean attr | Permit `html` content blocks. |
| `debug` | boolean attr | Show the debug overlay. |

Boolean attributes are on when present and not `"false"`:

```html
<open-tutorial auto-resume isolate debug></open-tutorial>
```

Every attribute is observed, so changing one rebuilds the layer.

## Imperative API

```html
<script>
  const el = document.querySelector('open-tutorial');

  el.start('welcome');
  el.next();
  el.prev();
  el.pause();
  el.resumeTour();   // `resume` is taken by the HTMLElement spec
  el.stop();
  el.reset();

  console.log(el.getState());

  // Anything not mirrored above lives on the layer itself.
  el.getLayer()?.setContext({ plan: 'pro' });
  el.getLayer()?.exportProgress();
</script>
```

## Events

The element dispatches every tour event as a DOM event:

```js
el.addEventListener('opentutorial', (e) => {
  console.log(e.detail.type, e.detail.tourId);
});
```

## Plain vanilla JS, without the element

If you would rather build the layer yourself:

```html
<script src="https://unpkg.com/@opentutorial/core/dist/opentutorial.global.js"></script>
<script>
  const layer = OpenTutorial.createTutorialLayer({
    specs: [mySpec],
    context: { plan: 'free' },
  });

  layer.ready.then(() => layer.start('welcome'));

  layer.on('complete', (e) => console.log('finished', e.tourId));
</script>
```

The global also exposes `createTour`, `createTours`, `validateSpec`,
`resolveTarget`, the storage factories, the analytics adapters, the authoring
tools and every guidance surface. See the
[API reference](../api-reference.md).

## Angular

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import '@opentutorial/core/webcomponent';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<open-tutorial [attr.specs]="specsJson" auto-start="welcome"></open-tutorial>`,
})
export class AppComponent {
  protected readonly specsJson = JSON.stringify(specs);
}
```

Angular also has a [dedicated adapter](angular.md) if you prefer DI.

## Astro

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

The `<script>` runs client-side only, which is what you want — see the
[SSR guide](../guides/ssr.md).

## Rails, Django, Laravel

Serve the global build from your asset pipeline and put the spec in the page:

```erb
<%= stylesheet_link_tag "opentutorial" %>
<%= javascript_include_tag "opentutorial.global" %>

<open-tutorial specs="<%= tours_json.to_json %>" auto-start="welcome"></open-tutorial>
```

Because specs are plain JSON, they can live in your database and be edited by
someone who does not write front-end code.
