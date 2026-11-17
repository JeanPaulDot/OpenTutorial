import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Interactive blocks, reactive gating and the things only a real browser can
 * confirm about them: that typing keeps focus, that a disabled button really
 * cannot be clicked, and that the controls pass the accessibility gate.
 */

/** Call a method on the page's tour layer. */
const call = (page: Page, method: string, ...args: unknown[]): Promise<unknown> =>
  page.evaluate(
    ([name, list]) => {
      const target = (window as unknown as { layer: Record<string, (...a: unknown[]) => unknown> }).layer;
      return target[name as string](...(list as unknown[]));
    },
    [method, args] as const,
  );

async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const el = document.querySelector('.ot-popover');
    if (!el) return;
    await Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {})));
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('Next stays disabled until the input satisfies nextWhen', async ({ page }) => {
  await call(page, 'start', 'quiz-tour');
  const next = page.locator('.ot-btn-primary');
  const field = page.locator('.ot-input');

  await expect(next).toBeDisabled();
  await field.fill('not-an-email');
  await expect(next).toBeDisabled();

  await field.fill('ada@example.com');
  await expect(next).toBeEnabled();
});

test('typing keeps focus and the caret in the field', async ({ page }) => {
  await call(page, 'start', 'quiz-tour');
  const field = page.locator('.ot-input');

  // Typed key by key: a re-render mid-word would drop characters.
  await field.click();
  await page.keyboard.type('ada@example.com', { delay: 10 });

  await expect(field).toHaveValue('ada@example.com');
  await expect(field).toBeFocused();
});

test('arrow keys move the caret while typing instead of changing step', async ({ page }) => {
  await call(page, 'start', 'quiz-tour');
  const field = page.locator('.ot-input');
  await field.fill('a@b.co');
  await field.press('ArrowLeft');
  await field.press('ArrowRight');
  await expect(page.locator('.ot-title')).toHaveText('Where should we send updates?');
});

test('a choice gates the step and drives the branch', async ({ page }) => {
  await call(page, 'start', 'quiz-tour');
  await page.locator('.ot-input').fill('ada@example.com');
  await page.locator('.ot-btn-primary').click();

  await expect(page.locator('.ot-title')).toHaveText('What best describes you?');
  await expect(page.locator('.ot-btn-primary')).toBeDisabled();

  await page.getByRole('radio', { name: 'Designer' }).click();
  await expect(page.getByRole('radio', { name: 'Designer' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('.ot-btn-primary')).toBeEnabled();

  await page.locator('.ot-btn-primary').click();
  await expect(page.locator('.ot-title')).toHaveText('For designers');
  // The earlier answer is interpolated into later copy.
  await expect(page.locator('.ot-content')).toHaveText('Thanks, ada@example.com.');
});

test('interactive steps pass the accessibility gate', async ({ page }) => {
  await call(page, 'start', 'quiz-tour');
  await settle(page);

  const scan = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  // Disabled Next, labelled input.
  expect((await scan()).violations).toEqual([]);

  await page.locator('.ot-input').fill('ada@example.com');
  await page.locator('.ot-btn-primary').click();
  await expect(page.locator('.ot-title')).toHaveText('What best describes you?');
  await settle(page);

  // Radiogroup, nothing selected.
  expect((await scan()).violations).toEqual([]);

  await page.getByRole('radio', { name: 'Developer' }).click();
  // Radiogroup with a selected option — the state most likely to fail contrast.
  expect((await scan()).violations).toEqual([]);
});

test('the input is reachable and labelled for assistive tech', async ({ page }) => {
  await call(page, 'start', 'quiz-tour');
  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByRole('radiogroup')).toHaveCount(0);
});

test('progress dots jump back to visited steps', async ({ page }) => {
  await call(page, 'start', 'e2e-tour');
  await page.locator('.ot-btn-primary').click();
  await expect(page.locator('.ot-title')).toHaveText('Only this is clickable');

  await page.getByRole('button', { name: 'Go to step 1' }).click();
  await expect(page.locator('.ot-title')).toHaveText('Welcome');
});

test('a context trigger starts its tour when the expression becomes true', async ({ page }) => {
  await expect(page.locator('.ot-popover')).toBeHidden();
  await call(page, 'setContext', { cartItems: 2 });
  await expect(page.locator('.ot-title')).toHaveText('Your cart has items');
});

test('a tour generated at runtime can be added and started with commands', async ({ page }) => {
  const ok = await call(page, 'dispatch', {
    type: 'addSpec',
    spec: {
      specVersion: 1,
      id: 'generated',
      title: 'Generated',
      steps: [{ id: 'only', title: 'Made at runtime', content: 'By a script.', target: { selector: '[data-tour="save"]' } }],
    },
  });
  expect(ok).toBe(true);

  await call(page, 'dispatch', { type: 'start', tourId: 'generated' });
  await expect(page.locator('.ot-title')).toHaveText('Made at runtime');
  await expect(page.locator('.ot-ring').first()).toBeVisible();
});

test.describe('desktop only', () => {
  test.skip(({ isMobile }) => !!isMobile, 'the mobile bottom sheet is docked, not draggable');

  test('the popover can be dragged out of the way and stays there', async ({ page }) => {
    await call(page, 'start', 'e2e-tour');
    await settle(page);

    const popover = page.locator('.ot-popover');
    const before = (await popover.boundingBox())!;
    const title = (await page.locator('.ot-title').boundingBox())!;

    await page.mouse.move(title.x + 20, title.y + title.height / 2);
    await page.mouse.down();
    await page.mouse.move(title.x + 20 + 150, title.y + title.height / 2 + 90, { steps: 6 });
    await page.mouse.up();

    const after = (await popover.boundingBox())!;
    expect(after.x).toBeGreaterThan(before.x + 100);
    expect(after.y).toBeGreaterThan(before.y + 50);

    // Scrolling repositions an undragged card; a dragged one must stay put.
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(250);
    const later = (await popover.boundingBox())!;
    expect(Math.abs(later.x - after.x)).toBeLessThan(2);
    expect(Math.abs(later.y - after.y)).toBeLessThan(2);
  });
});
