import { defineSpec } from '../../core';

export const i18nSpec = defineSpec({
  specVersion: 1,
  id: 'i18n-demo',
  title: {
    key: 'tour.i18n.title',
    fallback: 'i18n / Localization',
  },
  description: {
    key: 'tour.i18n.description',
    fallback: 'Tour content resolved from key-based i18n with fallback.',
  },
  version: '1.0.0',
  trigger: { type: 'manual' },
  steps: [
    {
      id: 'i18n-intro',
      target: { selector: "[data-tour='playground']", padding: 8 },
      placement: 'top',
      title: { key: 'tour.i18n.step1.title', fallback: 'Multi-language ready' },
      content: { key: 'tour.i18n.step1.content', fallback: 'Each `title` and `content` field accepts a `{ key, fallback }` object. Pass a `locale` and `i18nResolver` to `TourProvider` and the engine resolves every string at render time.' },
    },
    {
      id: 'i18n-resolver',
      target: { selector: "[data-tour='event-log']", padding: 8 },
      placement: 'left',
      title: { key: 'tour.i18n.step2.title', fallback: 'Bring your own resolver' },
      content: { key: 'tour.i18n.step2.content', fallback: 'The resolver is a simple `(key, locale) => string` function. Connect it to react-i18next, Lingui, or a plain object lookup.' },
    },
  ],
});
