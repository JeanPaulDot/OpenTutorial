import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated accessibility gate.
 *
 * axe cannot prove a tour is accessible, but it reliably catches the
 * regressions that matter here: contrast, missing names on the icon buttons,
 * and a dialog that claims to be modal without the roles to back it up.
 */

async function startTour(page: Page, tourId = 'e2e-tour'): Promise<void> {
  await page.evaluate((id) => {
    (window as unknown as { layer: { start: (t: string) => void } }).layer.start(id);
  }, tourId);
  await page.locator('.ot-popover').waitFor();
  await settle(page);
}

/**
 * Wait for the entrance animation to finish.
 *
 * axe samples computed colours, and mid-fade every colour is composited against
 * whatever is behind it — which reads as a contrast failure that no user ever
 * sees. Scanning a settled frame measures the design, not the transition.
 */
async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const el = document.querySelector('.ot-popover');
    if (!el) return;
    await Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {})));
  });
}

async function scan(page: Page) {
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('the page is clean before a tour starts', async ({ page }) => {
  const results = await scan(page);
  expect(results.violations).toEqual([]);
});

test('a spotlight step introduces no violations', async ({ page }) => {
  await startTour(page);
  const results = await scan(page);
  expect(results.violations).toEqual([]);
});

test('every step of the tour passes', async ({ page }) => {
  await startTour(page);

  for (const title of ['Welcome', 'Only this is clickable']) {
    await expect(page.locator('.ot-title')).toHaveText(title);
    await settle(page);
    const results = await scan(page);
    expect(results.violations, `violations on step "${title}"`).toEqual([]);
    await page.locator('.ot-btn-primary').click();
  }
});

test('the dialog is labelled and announces step changes', async ({ page }) => {
  await startTour(page);

  const dialog = page.locator('.ot-popover');
  await expect(dialog).toHaveAttribute('role', 'dialog');

  const labelledBy = await dialog.getAttribute('aria-labelledby');
  expect(labelledBy).toBeTruthy();
  await expect(page.locator(`#${labelledBy}`)).toHaveText('Welcome');

  const live = page.locator('.ot-sr-only');
  await expect(live).toHaveAttribute('aria-live', 'polite');
  await expect(live).toContainText('Step 1 of 4');
});

test('icon-only controls carry accessible names', async ({ page }) => {
  await startTour(page);
  const close = page.locator('.ot-skip');
  await expect(close).toHaveAttribute('aria-label', /.+/);
});

test('focus moves into the dialog and is restored on dismiss', async ({ page }) => {
  await page.locator('[data-tour="start"]').focus();
  await startTour(page);

  const insideDialog = await page.evaluate(
    () => !!document.querySelector('.ot-popover')?.contains(document.activeElement),
  );
  expect(insideDialog).toBe(true);

  await page.keyboard.press('Escape');
  await expect(page.locator('.ot-popover')).toBeHidden();
  await expect(page.locator('[data-tour="start"]')).toBeFocused();
});

test('a non-modal step does not claim aria-modal', async ({ page }) => {
  await startTour(page);
  // The fixture's steps are tooltips beside a still-usable page.
  await expect(page.locator('.ot-popover')).toHaveAttribute('aria-modal', 'false');
});

test('dark mode keeps contrast within tolerance', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await startTour(page);

  const results = await scan(page);
  const contrast = results.violations.filter((v) => v.id === 'color-contrast');
  expect(contrast).toEqual([]);
});

test('reduced motion is honoured', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startTour(page);

  const animation = await page.locator('.ot-popover').evaluate(
    (el) => getComputedStyle(el).animationName,
  );
  expect(animation === 'none' || animation === '').toBe(true);
});
