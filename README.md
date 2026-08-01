<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![npm version][npm-shield]][npm-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/JeanPaulDot/OpenTutorial">
    <img src="images/logo.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">OpenTutorial</h3>

  <p align="center">
    Spec-driven in-app guidance engine. Zero runtime dependencies. Adapters for React, Vue 3, Svelte, a universal Web Component, and plain vanilla JS.
    <br />
    <a href="#usage"><strong>Explore the usage guide »</strong></a>
    <br />
    <br />
    <a href="https://www.npmjs.com/package/@opentutorial/core">npm package</a>
    &middot;
    <a href="https://github.com/JeanPaulDot/OpenTutorial/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/JeanPaulDot/OpenTutorial/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

OpenTutorial is a spec-driven in-app tour and guidance engine. A `TutorialSpec` is a plain JSON object validated against a strict schema — editors get autocomplete from the published schema (`dist/spec.schema.json`), and a bad spec never crashes the host app.

It ships with adapters for React, Vue 3, Svelte, a universal Web Component (works in Angular, Solid, Lit, Astro, Rails, Django, or a static page — no bundler needed), and plain vanilla JS. All from a single, React-free core with zero runtime dependencies.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![TypeScript][TypeScript]][TypeScript-url]
* [![React][React.js]][React-url]
* [![Vue][Vue.js]][Vue-url]
* [![Svelte][Svelte.dev]][Svelte-url]
* [![Vite][Vite]][Vite-url]
* [![Vitest][Vitest]][Vitest-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Features

- **Tour orchestration** — one tour at a time, priority queue, audience rules, frequency capping, tour chaining
- **Triggers** — `manual`, `auto`, `event`, `route`, `element`, `idle`, `scroll`, plus `?tour=<id>` deep links
- **Display modes** — `spotlight`, `hotspot`, and `beacon`
- **Cross-page tours** — `autoResume` rehydrates a tour after full page navigations; `onNavigate` hooks SPA routers
- **Rich content** — text, image, video, list, code and (opt-in) HTML blocks, not just inline markdown
- **Resilient targeting** — fallback selector lists, text matching, shadow-DOM piercing, iframe support, visibility waits
- **Interaction gating** — `free`, `target-only` or `blocked` pointer handling per spec or step
- **Advance conditions** — `button`, `target-click`, `event`, `auto`, `input-match`, `form-submit`, `element-appears`, `element-disappears`, `url-match`, plus a `beforeNext` guard
- **Branching** — `next: [{ if: "plan === 'pro'", to: 'pro-step' }]` rule lists
- **Custom rendering** — replace the built-in popover with your own component via `renderStep`
- **Persistence** — sync or async storage; ships localStorage, cookie, IndexedDB and remote (REST) adapters, with per-user namespacing via `userId`
- **Analytics** — PostHog, Mixpanel, Amplitude, Segment, RudderStack, Heap, GA4, Datadog RUM, a batched HTTP adapter with offline queue, and `createFunnelReport` for drop-off analysis
- **Guidance surfaces** — `Announcement`, `Banner`, `Survey`/NPS, `ResourceCenter`, `Hint`, and a self-managing `TourChecklist` (React)
- **Authoring** — point-and-click recorder with selector stability scoring, debug overlay, published JSON Schema
- **i18n** — key-based localization with interpolation, RTL support
- **Theming** — 20 CSS custom properties, dark mode via `prefers-color-scheme` or `data-ot-theme`, reduced-motion support, optional shadow-DOM isolation and a `container` portal
- **Validation** — fail-closed schema checks with error/warning severity (90+ checks)
- **CSP-safe** — `showIf`, `next` branches and `audience` rules run through a hand-written parser; no `eval`, no `new Function`

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* Node.js >= 18 and npm

### Installation

1. Install the package
   ```sh
   npm install @opentutorial/core
   ```
2. Clone the repo (for contributing or running from source)
   ```sh
   git clone https://github.com/JeanPaulDot/OpenTutorial.git
   cd OpenTutorial
   npm install
   ```
3. Run the test suite
   ```sh
   npm test
   ```

React is an optional peer dependency — install it only if you use the React
adapter. The root entry, the Web Component and the vanilla adapter need nothing
beyond the package itself.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the build commands and project layout.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### React

```tsx
import { TourProvider, useTour, defineSpec } from '@opentutorial/core/react';
import '@opentutorial/core/styles.css';

const mySpec = defineSpec({
  specVersion: 1,
  id: 'quick-start',
  title: 'Quick Start',
  trigger: { type: 'manual' },
  steps: [
    {
      id: 'hello',
      target: { selector: "[data-tour='target']" },
      placement: 'bottom',
      title: 'Hello!',
      content: 'This is your **first tour step**.',
    },
  ],
});

export default function App() {
  return (
    <TourProvider specs={[mySpec]} context={{ plan: 'free' }}>
      <YourApp />
    </TourProvider>
  );
}

function YourApp() {
  const { start } = useTour();
  return (
    <button data-tour="target" onClick={() => start('quick-start')}>
      Start tour
    </button>
  );
}
```

### Vanilla JS

```ts
import { createTutorialLayer, defineSpec } from '@opentutorial/core';
import '@opentutorial/core/styles.css';

const tl = createTutorialLayer({
  specs: [defineSpec({ /* ... */ })],
  context: { plan: 'free' },
});
tl.start('my-tour');
```

### Vue 3

```ts
import { createTourPlugin, TOUR_KEY } from '@opentutorial/core/vue';

app.use(createTourPlugin({ specs, context: { plan: 'pro' } }));

// in a component
const tour = inject(TOUR_KEY)!;
tour.start('welcome');
```

### Svelte

```svelte
<script>
  import { createTourStore, tourAnchor } from '@opentutorial/core/svelte';
  const tour = createTourStore({ specs });
</script>

<button use:tourAnchor={'start-btn'} on:click={() => tour.start('welcome')}>
  Start — step {$tour.state?.index ?? 0}
</button>
```

### Web Component / plain HTML

Works in Angular, Solid, Lit, Astro, Rails, Django, or a static page — no bundler needed:

```html
<script src="https://unpkg.com/@opentutorial/core/dist/opentutorial.global.js"></script>

<open-tutorial auto-start="welcome">
  <script type="application/json">
    { "specVersion": 1, "id": "welcome", "title": "Hi", "steps": [ /* ... */ ] }
  </script>
</open-tutorial>
```

### Entry points

| Import | What you get |
|---|---|
| `@opentutorial/core` | Framework-agnostic core + vanilla adapter. **React-free.** |
| `@opentutorial/core/vanilla` | Alias of the root entry, for readability |
| `@opentutorial/core/react` | Everything + `TourProvider`, `useTour`, `TourAnchor`, all components |
| `@opentutorial/core/vue` | Everything + Vue plugin / `TOUR_KEY` injection |
| `@opentutorial/core/svelte` | Everything + Svelte store + `tourAnchor` action |
| `@opentutorial/core/webcomponent` | `<open-tutorial>` custom element |
| `@opentutorial/core/analytics` | All analytics adapters + funnel reports |
| `@opentutorial/core/authoring` | Tour recorder, debug overlay, selector scoring |
| `@opentutorial/core/schema` | `validateSpec`, `validateSpecs`, `assertValidSpec` |
| `@opentutorial/core/styles.css` | All styles (20 `--ot-*` custom properties) |
| `@opentutorial/core/opentutorial.global.js` | Self-contained IIFE bundle for `<script>` tags |

The JSON Schema ships at `@opentutorial/core/dist/spec.schema.json` — point
`$schema` at it to get autocomplete when authoring specs as JSON.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

See [ROADMAP.md](ROADMAP.md) and the [open issues](https://github.com/JeanPaulDot/OpenTutorial/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/JeanPaulDot/OpenTutorial/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=JeanPaulDot/OpenTutorial" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/JeanPaulDot/OpenTutorial](https://github.com/JeanPaulDot/OpenTutorial)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [Shields.io](https://shields.io/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/JeanPaulDot/OpenTutorial.svg?style=for-the-badge
[contributors-url]: https://github.com/JeanPaulDot/OpenTutorial/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/JeanPaulDot/OpenTutorial.svg?style=for-the-badge
[forks-url]: https://github.com/JeanPaulDot/OpenTutorial/network/members
[stars-shield]: https://img.shields.io/github/stars/JeanPaulDot/OpenTutorial.svg?style=for-the-badge
[stars-url]: https://github.com/JeanPaulDot/OpenTutorial/stargazers
[issues-shield]: https://img.shields.io/github/issues/JeanPaulDot/OpenTutorial.svg?style=for-the-badge
[issues-url]: https://github.com/JeanPaulDot/OpenTutorial/issues
[license-shield]: https://img.shields.io/github/license/JeanPaulDot/OpenTutorial.svg?style=for-the-badge
[license-url]: https://github.com/JeanPaulDot/OpenTutorial/blob/main/LICENSE
[npm-shield]: https://img.shields.io/npm/v/@opentutorial/core.svg?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@opentutorial/core
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Vitest]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white
[Vitest-url]: https://vitest.dev/
