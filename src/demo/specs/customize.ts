/**
 * AI-AUTHORED SPEC — "make it yours" tour.
 * Demonstrates: showIf branching on tour context (plan), per-step theme
 * overrides, waitFor targets, and the spec playground.
 */

import { defineSpec } from '../../core';

export const customizeSpec = defineSpec({
  specVersion: 1,
  id: 'customize',
  title: 'Make it yours',
  description: 'Theming, branching and AI authoring.',
  version: '1.0.0',
  trigger: { type: 'manual' },
  steps: [
    {
      id: 'studio',
      target: { selector: "[data-tour='theme-studio']", padding: 8 },
      placement: 'left',
      title: 'Make it yours',
      content:
        'This panel rewrites the tour layer\'s **CSS variables** live. Pick a preset — the popover you\'re reading repaints instantly. That\'s the whole theming API.',
    },
    {
      id: 'pro-step',
      target: { selector: "[data-tour='pro-card']", waitFor: true, timeout: 2500, padding: 8 },
      placement: 'left',
      title: 'Because you\'re on Pro',
      content:
        'This step only renders when `plan === \'pro\'` in the tour context. Flip the **plan switch** in the header to see branching appear and disappear.',
      showIf: "plan === 'pro'",
      theme: { accent: '#f59e0b' },
    },
    {
      id: 'playground',
      target: { selector: "[data-tour='playground']", padding: 8 },
      placement: 'left',
      title: 'Authored by AI, validated by the runtime',
      content:
        'Paste any TutorialSpec JSON below. It\'s checked against the schema — every violation is listed, and a broken spec **never crashes the app**.',
    },
    {
      id: 'events',
      target: { selector: "[data-tour='event-log']", padding: 8 },
      placement: 'left',
      title: 'Measure everything',
      content:
        'Every step, skip and completion emits an event. Pipe `onEvent` into your analytics stack and you have a funnel.',
    },
  ],
});
