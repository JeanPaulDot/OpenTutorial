# Accessibility

## What we claim

The library targets **WCAG 2.1 AA** for the UI it renders. Every step of the
example tour is checked against axe-core (`wcag2a`, `wcag2aa`, `wcag21a`,
`wcag21aa`) on every CI run, in light and dark mode, on desktop and mobile
viewports — see `e2e/a11y.spec.ts`.

Automated checks cannot prove a tour is accessible. They catch contrast,
missing names and role misuse; they cannot tell you whether your copy makes
sense out of context. The checklist at the end of this page covers the rest.

## Keyboard

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move between controls. Trapped inside the popover when the step is `blocked`. |
| `→` | Next step |
| `←` | Previous step |
| `Enter` | Next step — **only** when focus is on the dialog surface itself |
| `Escape` | Dismiss the tour |

Two deliberate details:

- **Enter does not advance from a button.** The browser's own activation already
  does the right thing there; hijacking it would double-fire.
- **Nothing is stolen while typing.** Arrow keys, Enter and Space are left alone
  when focus is in an `input`, `textarea`, `select` or `contenteditable` — in the
  tour's own fields or in the highlighted element. Escape still works, so the
  tour is always dismissible.

## Focus

On mount, focus moves into the popover. On dismiss, it returns to where it was —
**unless** the user deliberately moved it elsewhere, in which case yanking it
back would be disorienting.

The focus trap is only active when the step is `blocked`. A tooltip beside a
still-usable page must not trap focus, or the page becomes unreachable.

## Screen readers

The popover is `role="dialog"`, labelled by its title via `aria-labelledby`.

`aria-modal` reflects the actual interaction mode:

| Interaction | `aria-modal` |
|---|---|
| `free` | `false` |
| `target-only` | `false` |
| `blocked` | `true` |

Claiming `aria-modal="true"` on a non-blocking step would hide the rest of the
page from assistive tech while it is still fully usable — a common bug in tour
libraries, and one we test against.

Step changes are announced through a dedicated polite live region
(`"Welcome. Step 2 of 4"`) rather than by re-reading the dialog, which would
interrupt a screen reader mid-sentence on every reposition.

Icon-only controls (close, hotspot beacon, checklist toggle, changelog launcher)
all carry `aria-label`s. Progress dots are `aria-hidden` — the live region
already conveys position.

The checklist progress bar is a `role="progressbar"` with `aria-valuenow` and a
descriptive label.

## Motion

Under `prefers-reduced-motion: reduce`:

- popover enter animation → off
- spotlight transition → off
- beacon pulse → off
- checklist bar transition → off
- `scrollIntoView` → `auto` instead of `smooth`

Nothing needs configuring.

## Colour and contrast

The default palette meets AA contrast in light and dark mode, but one pair is
close to the line: white button text on the default accent (`#6d5cff`) is
**4.54:1** against a 4.5:1 requirement. If you change `--ot-accent`, check it —
a lighter accent will fail.

When retheming, check three pairs:

| Foreground | Background | Minimum |
|---|---|---|
| `#fff` (button text) | `--ot-accent` | 4.5:1 |
| `--ot-fg` | `--ot-bg` | 4.5:1 |
| `--ot-muted` (body copy) | `--ot-bg` | 4.5:1 |

`--ot-muted` is the one most likely to slip.

Nothing in the UI conveys meaning by colour alone: the checklist uses glyphs
(`✓`, `◌`, `○`) alongside colour, and the active progress dot changes width as
well as hue.

## Touch targets

Below 480px, buttons and the close control are at least 44×44px, meeting WCAG
2.5.5 Target Size (AAA) on mobile.

## Content you are responsible for

The library renders what you write. It cannot fix:

- **`alt` on images.** Required by the schema, so a validation error will tell
  you — but only you can write a useful one.
- **Copy that only makes sense visually.** "Click the button on the left" is
  meaningless to a screen-reader user; name the button.
- **Captions on video.** Add a `<track>` via an `html` block if you use video.
- **Colour contrast in a custom theme.**
- **`renderStep` output.** Replacing the popover means owning its accessibility.

## Testing your own tours

```bash
npm i -D @playwright/test @axe-core/playwright
npx playwright install chromium
```

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('the tour is accessible at every step', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.layer.start('onboarding'));

  for (let i = 0; i < 4; i += 1) {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.locator('.ot-btn-primary').click();
  }
});
```

Then do the part a tool cannot:

- Run the tour with the keyboard only.
- Run it with a screen reader (VoiceOver, NVDA) and listen to the step
  announcements.
- Zoom to 200% and confirm nothing is clipped.
- Turn on reduced motion.
- Check it in dark mode.

## Known limitations

- **Closed shadow roots** cannot be targeted. Nothing can pierce them.
- **Cross-origin iframes** cannot be targeted. The browser forbids it.
- **`interaction: 'blocked'`** relies on a pointer-events shield. A determined
  keyboard user can still Tab to page content behind it; the focus trap mitigates
  this but does not remove page content from the accessibility tree.
- **Custom rendering** (`renderStep`) bypasses all of the above. You own it.

## Reporting a problem

Accessibility issues are treated as bugs, not enhancements. Please open an issue
with the assistive technology, browser and OS versions, and what you expected to
happen.
