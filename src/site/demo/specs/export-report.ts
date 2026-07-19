/**
 * AI-AUTHORED SPEC — "export your first report" feature tour.
 * Demonstrates advanceOn: 'target-click' (the user drives the tour by
 * interacting with the real UI) and a modal closing step.
 */

import { defineSpec } from '@opentutorial/core';

export const exportReportSpec = defineSpec({
  specVersion: 1,
  id: 'export-report',
  title: 'Export your first report',
  description: 'Learn how reporting and CSV export work.',
  version: '1.0.0',
  trigger: { type: 'manual' },
  steps: [
    {
      id: 'chart',
      target: { selector: "[data-tour='revenue-chart']", padding: 8 },
      placement: 'top',
      title: 'Start from the trend',
      content: 'Reports are generated from the visible range, so set the range you need **before** exporting.',
    },
    {
      id: 'export',
      target: { selector: "[data-tour='export-btn']", padding: 6 },
      placement: 'bottom',
      title: 'Click Export yourself',
      content: 'Go ahead — press **Export CSV** on the real button. The tour advances when *you* act.',
      advanceOn: 'target-click',
      canGoBack: true,
    },
    {
      id: 'table',
      target: { selector: "[data-tour='invoices-table']", padding: 8 },
      placement: 'top',
      title: 'Every export lands here',
      content: 'Exports are logged with their range and row count, so finance always has an audit trail.',
    },
    {
      id: 'done',
      title: 'You exported your first report',
      content: 'Nice work. Scheduled exports and Slack delivery are available on **Pro** — check the Tours panel for more guides.',
    },
  ],
});
