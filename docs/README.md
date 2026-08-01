# OpenTutorial documentation

Everything here is generated from, and checked against, the source in
`src/core/**`. If a page and the code disagree, the code is right — please open
an issue.

## Start here

| Page | What it covers |
|---|---|
| [Getting started](getting-started.md) | Install, first tour, the five-minute version |
| [Spec reference](spec-reference.md) | Every field of a `TutorialSpec`, with types and defaults |
| [API reference](api-reference.md) | Every exported function, class, option and type |

## Framework guides

| Page | What it covers |
|---|---|
| [React](frameworks/react.md) | `TourProvider`, `useTour`, components, Next.js App Router |
| [Vue 3](frameworks/vue.md) | Plugin, `TOUR_KEY`, composables, Nuxt |
| [Svelte](frameworks/svelte.md) | Store contract, `tourAnchor`, SvelteKit |
| [Angular](frameworks/angular.md) | `provideOpenTutorial`, `OpenTutorialService`, signals |
| [Solid](frameworks/solid.md) | `createTourLayer`, signal wiring, directives |
| [Web Component & vanilla](frameworks/web-component.md) | `<open-tutorial>`, script tag, any framework |
| [Server-side rendering](guides/ssr.md) | Next, Nuxt, SvelteKit, Astro — what runs where |

## Guides

| Page | What it covers |
|---|---|
| [Triggers & orchestration](guides/triggers-and-orchestration.md) | When tours fire, queueing, audience, frequency, chaining |
| [Targeting](guides/targeting.md) | Selectors, fallbacks, text, shadow DOM, iframes |
| [Content & theming](guides/content-and-theming.md) | Content blocks, the 20 CSS tokens, dark mode, RTL |
| [Guidance surfaces](guides/surfaces.md) | Banner, announcement, survey, checklist, hub, hints, changelog |
| [Persistence & identity](guides/persistence.md) | Storage adapters, `userId`, export/import, the REST contract |
| [Analytics](guides/analytics.md) | Adapters, funnels, batching, sampling |
| [A/B testing](guides/experiments.md) | Variant assignment, weights, holdouts |
| [Authoring](guides/authoring.md) | The recorder, selector scoring, the debug overlay, the CLI |
| [i18n](guides/i18n.md) | Resolvers, interpolation, pluralization, direction |
| [Accessibility](guides/accessibility.md) | Keyboard map, ARIA, reduced motion, our conformance claims |
| [Content Security Policy](guides/csp.md) | What the library needs, and the one directive that bites |
| [Browser support](guides/browser-support.md) | Supported versions and the features they depend on |

## Migrating

| From | Page |
|---|---|
| intro.js | [Migrating from intro.js](migrating/introjs.md) |
| Shepherd | [Migrating from Shepherd](migrating/shepherd.md) |
| driver.js | [Migrating from driver.js](migrating/driverjs.md) |
| react-joyride | [Migrating from react-joyride](migrating/react-joyride.md) |

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for setup, the build sequence and the
project layout, and [ROADMAP.md](../ROADMAP.md) for what is planned next.
