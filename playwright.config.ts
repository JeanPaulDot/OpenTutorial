import { defineConfig, devices } from '@playwright/test';

/**
 * Browser-level tests.
 *
 * jsdom cannot answer the questions that matter most here — real layout for
 * popover placement, real pointer-events for interaction gating, and a real
 * navigation for cross-page resume. Those live in `e2e/`; everything else stays
 * in the much faster Vitest suite.
 *
 * The fixture app is a static page served from `e2e/fixtures`, built against
 * `dist/`, so these tests exercise the published bundle rather than source.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    // `npx serve` would be another dependency; Node can serve a directory in
    // a few lines and it keeps `devDependencies` honest.
    command: 'node e2e/serve.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
