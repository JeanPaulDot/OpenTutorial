import { test, expect, type Page } from '@playwright/test';

/**
 * Behaviour that only a real browser can confirm: layout-driven placement,
 * pointer-events gating, and a tour surviving a full page navigation.
 */

async function startTour(page: Page, tourId = 'e2e-tour'): Promise<void> {
  await page.evaluate((id) => {
    (window as unknown as { layer: { start: (t: string) => void } }).layer.start(id);
  }, tourId);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('renders a popover anchored below its target', async ({ page }) => {
  await startTour(page);

  const popover = page.locator('.ot-popover');
  await expect(popover).toBeVisible();
  await expect(popover.locator('.ot-title')).toHaveText('Welcome');
  await expect(popover.locator('strong')).toHaveText('first');

  const target = await page.locator('[data-tour="start"]').boundingBox();
  const box = await popover.boundingBox();
  expect(target).not.toBeNull();
  expect(box).not.toBeNull();
  // Placement is `bottom`, so the popover starts below the target.
  expect(box!.y).toBeGreaterThan(target!.y);
});

test('progress dots track the current step', async ({ page }) => {
  await startTour(page);

  await expect(page.locator('.ot-dot')).toHaveCount(4);
  await expect(page.locator('.ot-dot-active')).toHaveCount(1);

  await page.locator('.ot-btn-primary').click();
  await expect(page.locator('.ot-title')).toHaveText('Only this is clickable');
});

test('target-only interaction blocks the page but not the target', async ({ page }) => {
  await startTour(page);
  await page.locator('.ot-btn-primary').click();
  await expect(page.locator('.ot-title')).toHaveText('Only this is clickable');

  // The highlighted control still works.
  await page.locator('[data-tour="save"]').click();
  await expect(page.locator('#counter')).toHaveText('clicks: 1');

  // A control outside the cutout sits under the shield, so Playwright's
  // actionability check reports the interception rather than clicking through.
  const blocked = await page
    .locator('[data-tour="publish"]')
    .click({ timeout: 2000 })
    .then(() => null, (err: Error) => err.message);

  expect(blocked, 'expected the shield to intercept the click').not.toBeNull();
  expect(blocked).toMatch(/intercepts pointer events|timeout/i);
  await expect(page.locator('#counter')).toHaveText('clicks: 1');
});

test('advanceOn target-click waits for the real click', async ({ page }) => {
  await startTour(page);
  await page.locator('.ot-btn-primary').click();
  await page.locator('.ot-btn-primary').click();
  await expect(page.locator('.ot-title')).toHaveText('Click Publish');

  // A non-final step that advances on a click hides the primary button, so the
  // click is the only way forward.
  await expect(page.locator('.ot-btn-primary')).toBeHidden();

  await page.locator('[data-tour="publish"]').click();
  await expect(page.locator('.ot-title')).toHaveText('All set');
});

test('the last step always offers a way to finish', async ({ page }) => {
  await startTour(page);
  for (let i = 0; i < 2; i += 1) await page.locator('.ot-btn-primary').click();
  await page.locator('[data-tour="publish"]').click();

  const done = page.locator('.ot-btn-primary');
  await expect(done).toBeVisible();
  await expect(done).toHaveText('Done');

  await done.click();
  await expect(page.locator('.ot-popover')).toBeHidden();
});

test('Escape dismisses the tour', async ({ page }) => {
  await startTour(page);
  await expect(page.locator('.ot-popover')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.locator('.ot-popover')).toBeHidden();
});

test('keyboard navigation moves between steps', async ({ page }) => {
  await startTour(page);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.ot-title')).toHaveText('Only this is clickable');

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.ot-title')).toHaveText('Welcome');
});

test('a tour resumes after a full page navigation', async ({ page }) => {
  await startTour(page, 'resume-tour');
  await expect(page.locator('.ot-title')).toHaveText('On page one');

  await page.locator('#next-page').click();
  await page.waitForURL('**/page-two.html');

  // autoResume rehydrates the in-flight tour on the new document.
  await expect(page.locator('.ot-popover')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.ot-title')).toHaveText('On page two');
});

test('the spotlight follows the target on scroll', async ({ page }) => {
  await startTour(page);
  const ring = page.locator('.ot-ring');
  await expect(ring).toBeVisible();

  const before = await ring.boundingBox();
  // `window.scrollTo` rather than a wheel gesture: mobile WebKit does not
  // synthesise wheel events, and the tracking path is the same either way.
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(300);
  const after = await ring.boundingBox();

  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(after!.y).not.toBeCloseTo(before!.y, 0);
});

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile layout only');

  test('docks the popover as a bottom sheet', async ({ page }) => {
    await startTour(page);
    const popover = await page.locator('.ot-popover').boundingBox();
    const viewport = page.viewportSize()!;

    expect(popover).not.toBeNull();
    // Bottom-anchored and nearly full width.
    expect(popover!.y + popover!.height).toBeGreaterThan(viewport.height * 0.6);
    expect(popover!.width).toBeGreaterThan(viewport.width * 0.8);
  });

  test('a horizontal swipe advances the tour', async ({ page }) => {
    await startTour(page);

    // Built in the page because Playwright's dispatchEvent cannot carry touch
    // lists. Plain events with the lists attached, rather than `new TouchEvent`
    // — WebKit has no `Touch` constructor, and the handler only reads
    // `touches.length` and `clientX`/`clientY`.
    await page.evaluate(() => {
      const popover = document.querySelector('.ot-popover') as HTMLElement;
      const box = popover.getBoundingClientRect();
      const y = box.y + box.height / 2;

      const fire = (type: string, touches: Array<{ x: number }>, changed: Array<{ x: number }>) => {
        const event = new Event(type, { bubbles: true });
        const list = (points: Array<{ x: number }>) =>
          points.map((p) => ({ clientX: p.x, clientY: y, identifier: 1, target: popover }));
        Object.defineProperty(event, 'touches', { value: list(touches) });
        Object.defineProperty(event, 'changedTouches', { value: list(changed) });
        popover.dispatchEvent(event);
      };

      const from = { x: box.x + box.width - 30 };
      const to = { x: box.x + 20 };
      fire('touchstart', [from], [from]);
      fire('touchend', [], [to]);
    });

    await expect(page.locator('.ot-title')).toHaveText('Only this is clickable');
  });
});
