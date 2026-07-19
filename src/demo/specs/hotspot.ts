import { defineSpec } from '../../core';

export const hotspotSpec = defineSpec({
  specVersion: 1,
  id: 'hotspot-demo',
  title: 'Hotspot & Beacon',
  description: 'Non-intrusive display modes: hotspot pulsing dot and minimal beacon.',
  version: '1.0.0',
  trigger: { type: 'manual' },
  steps: [
    {
      id: 'hotspot-intro',
      title: 'Hotspot mode',
      content: 'This step uses **hotspot** display — a pulsing dot with a tooltip. No backdrop, no focus trap. Ideal for subtle guidance.',
      placement: 'auto',
      display: 'hotspot',
      target: { selector: "[data-tour='tours-panel']", padding: 8 },
      advanceOn: 'button',
    },
    {
      id: 'beacon-demo',
      title: 'Beacon mode',
      content: '**Beacon** is even quieter: a tiny pulsing ring with no popover. Just enough to say "look here."',
      placement: 'auto',
      display: 'beacon',
      target: { selector: "[data-tour='theme-studio']", padding: 6 },
      advanceOn: 'button',
    },
    {
      id: 'hotspot-chart',
      title: 'Non-blocking guidance',
      content: 'Hotspots don\'t block interaction. Users can click the chart, use the search, or toggle the plan switch — all while the hint floats nearby.',
      placement: 'auto',
      display: 'hotspot',
      target: { selector: "[data-tour='revenue-chart']", padding: 8 },
      advanceOn: 'button',
    },
  ],
});
