/**
 * AI-AUTHORED SPEC — welcome tour (auto trigger, once per user).
 * Written per the Authoring Protocol: targets use data-tour markers only,
 * copy is benefit-led, 6 steps.
 */

import { defineSpec } from '@opentutorial/core';

export const welcomeSpec = defineSpec({
  specVersion: 1,
  id: 'welcome',
  title: 'Welcome to Pulseboard',
  description: 'A 60-second orientation for new users.',
  version: '1.0.0',
  trigger: { type: 'auto', once: true, delay: 900 },
  steps: [
    {
      id: 'intro',
      title: 'Welcome to Pulseboard',
      content:
        'This 60-second tour runs **above the app** — the engine was dropped in as a module and read this dashboard\'s markup. Replay it anytime from the **Tours** panel.',
      placement: 'auto',
      advanceOn: 'button',
    },
    {
      id: 'sidebar',
      target: { selector: "[data-tour='sidebar']", padding: 6 },
      placement: 'right',
      title: 'Everything lives here',
      content:
        'Jump between Overview, Reports and Settings. The tour engine found this sidebar through its `data-tour` marker, not a fragile class name.',
    },
    {
      id: 'search',
      target: { selector: "[data-tour='search']", padding: 6 },
      placement: 'bottom',
      title: 'Find anything fast',
      content: 'Search reports, customers and invoices. Power users press `/` from anywhere.',
    },
    {
      id: 'stats',
      target: { selector: "[data-tour='stats']", padding: 10 },
      placement: 'bottom',
      title: 'Your week at a glance',
      content: 'Revenue, active users and conversion update in real time as data streams in.',
    },
    {
      id: 'chart',
      target: { selector: "[data-tour='revenue-chart']", padding: 8 },
      placement: 'top',
      title: 'Trends, not snapshots',
      content: 'Hover the bars for daily numbers, or switch the range — your filters stay put.',
    },
    {
      id: 'upgrade',
      target: { selector: "[data-tour='upgrade']", padding: 6 },
      placement: 'bottom-end',
      title: 'Go further with Pro',
      content: 'Scheduled exports and anomaly alerts live on **Pro**. That\'s the tour — go build something.',
    },
  ],
});
