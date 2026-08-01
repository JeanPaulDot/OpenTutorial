import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { TourProvider } from '../adapters/react';
import { Announcement } from '../components/Announcement';
import { Hint } from '../components/Hint';
import { ResourceCenter } from '../components/ResourceCenter';
import { Changelog } from '../components/Changelog';
import { createMemoryStorage } from '../storage/memory';
import type { TutorialSpec } from '../types';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

function spec(id: string, title: string, description?: string): TutorialSpec {
  return {
    specVersion: 1,
    id,
    title,
    description,
    trigger: { type: 'manual' },
    steps: [{ id: 's1', title: 'One', content: 'x', placement: 'center' }],
  } as TutorialSpec;
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  document.body.innerHTML = '';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => { root.unmount(); });
  document.body.innerHTML = '';
});

async function render(node: React.ReactNode): Promise<void> {
  await act(async () => { root.render(node); });
}

const settle = () => act(async () => { await new Promise((r) => setTimeout(r, 5)); });

describe('Announcement', () => {
  it('renders a modal with rich content', async () => {
    await render(
      <Announcement
        id="a1"
        title="What's new"
        content={{ blocks: [{ type: 'text', value: 'Body' }, { type: 'list', items: ['x', 'y'] }] }}
        storage={createMemoryStorage()}
      />,
    );
    await settle();

    expect(container.querySelector('.ot-title')?.textContent).toBe("What's new");
    expect(container.textContent).toContain('Body');
    expect(container.querySelectorAll('.ot-list li')).toHaveLength(2);
    expect(container.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true');
  });

  it('shows once and stays dismissed', async () => {
    const storage = createMemoryStorage();
    await render(<Announcement id="a2" title="T" content="body" storage={storage} />);
    await settle();

    await act(async () => {
      (container.querySelector('.ot-skip') as HTMLButtonElement).click();
    });
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    await render(<Announcement id="a2" title="T" content="body" storage={storage} />);
    await settle();
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('runs the primary and secondary actions', async () => {
    const primary = vi.fn();
    const secondary = vi.fn();

    await render(
      <Announcement
        id="a3" title="T" content="body" storage={createMemoryStorage()}
        primaryAction={{ label: 'Do it', onClick: primary }}
        secondaryAction={{ label: 'Later', onClick: secondary }}
      />,
    );
    await settle();

    await act(async () => {
      (container.querySelector('.ot-btn-ghost') as HTMLButtonElement).click();
    });
    expect(secondary).toHaveBeenCalled();

    await render(
      <Announcement
        id="a4" title="T" content="body" storage={createMemoryStorage()}
        primaryAction={{ label: 'Do it', onClick: primary }}
      />,
    );
    await settle();

    await act(async () => {
      (container.querySelector('.ot-btn-primary') as HTMLButtonElement).click();
    });
    expect(primary).toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const onDismiss = vi.fn();
    await render(
      <Announcement id="a5" title="T" content="body" storage={createMemoryStorage()} onDismiss={onDismiss} />,
    );
    await settle();

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(onDismiss).toHaveBeenCalled();
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('re-shows every mount when once is false', async () => {
    const storage = createMemoryStorage();
    for (let i = 0; i < 2; i += 1) {
      // A distinct key forces a real remount; re-rendering the same element
      // would preserve the component's `visible` state and prove nothing.
      await render(
        <Announcement key={i} id="a6" title="T" content="b" once={false} storage={storage} />,
      );
      await settle();
      expect(container.querySelector('[role="dialog"]')).not.toBeNull();
      await act(async () => {
        (container.querySelector('.ot-skip') as HTMLButtonElement).click();
      });
    }
  });
});

describe('Hint', () => {
  it('renders nothing until its target exists', async () => {
    await render(<Hint target="#missing" content="help" />);
    expect(container.querySelector('.ot-hint')).toBeNull();
  });

  it('pins to a resolved target and toggles the panel', async () => {
    const anchor = document.createElement('div');
    anchor.id = 'anchor';
    anchor.getBoundingClientRect = () => ({
      x: 10, y: 20, width: 30, height: 8, top: 20, left: 10, right: 40, bottom: 28, toJSON: () => ({}),
    }) as DOMRect;
    document.body.appendChild(anchor);

    await render(<Hint target="#anchor" content="Read the **docs**" />);
    await settle();

    const hint = container.querySelector('.ot-hint') as HTMLElement;
    expect(hint).not.toBeNull();

    const dot = container.querySelector('.ot-hint-dot') as HTMLButtonElement;
    expect(container.querySelector('.ot-hint-panel')).toBeNull();

    await act(async () => { dot.click(); });
    const panel = container.querySelector('.ot-hint-panel')!;
    expect(panel.innerHTML).toContain('<strong>docs</strong>');
    expect(dot.getAttribute('aria-expanded')).toBe('true');

    await act(async () => { dot.click(); });
    expect(container.querySelector('.ot-hint-panel')).toBeNull();
  });

  it('accepts a full target object and a custom glyph', async () => {
    const anchor = document.createElement('div');
    anchor.className = 'target';
    anchor.getBoundingClientRect = () => ({
      x: 0, y: 0, width: 5, height: 5, top: 0, left: 0, right: 5, bottom: 5, toJSON: () => ({}),
    }) as DOMRect;
    document.body.appendChild(anchor);

    await render(<Hint target={{ selector: '.target' }} content="c" glyph="i" zIndex={42} />);
    await settle();

    expect(container.querySelector('.ot-hint-dot')?.textContent).toBe('i');
    expect((container.querySelector('.ot-hint') as HTMLElement).style.zIndex).toBe('42');
  });
});

describe('ResourceCenter', () => {
  const specs = [spec('setup', 'Set up', 'Do the thing'), spec('invite', 'Invite team')];

  it('lists tours and external links', async () => {
    await render(
      <TourProvider specs={specs} storage={createMemoryStorage()}>
        <ResourceCenter links={[{ label: 'Docs', href: 'https://docs.test', description: 'Read more' }]} />
      </TourProvider>,
    );

    expect(container.querySelectorAll('.ot-hub-item')).toHaveLength(3);
    expect(container.textContent).toContain('Set up');
    expect(container.textContent).toContain('Docs');
  });

  it('filters as the user types', async () => {
    await render(
      <TourProvider specs={specs} storage={createMemoryStorage()}>
        <ResourceCenter />
      </TourProvider>,
    );

    const search = container.querySelector('.ot-hub-search') as HTMLInputElement;
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      setter.call(search, 'invite');
      search.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(container.querySelectorAll('.ot-hub-item')).toHaveLength(1);
  });

  it('shows an empty message when nothing matches', async () => {
    await render(
      <TourProvider specs={specs} storage={createMemoryStorage()}>
        <ResourceCenter emptyMessage="No results" />
      </TourProvider>,
    );

    const search = container.querySelector('.ot-hub-search') as HTMLInputElement;
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      setter.call(search, 'zzzz');
      search.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(container.querySelector('.ot-hub-empty')?.textContent).toBe('No results');
  });

  it('floating mode starts closed behind a launcher', async () => {
    await render(
      <TourProvider specs={specs} storage={createMemoryStorage()}>
        <ResourceCenter floating launcherGlyph="?" />
      </TourProvider>,
    );

    expect(container.querySelector('.ot-hub')).toBeNull();
    const launcher = container.querySelector('.ot-hub-launcher') as HTMLButtonElement;
    expect(launcher.textContent).toBe('?');

    await act(async () => { launcher.click(); });
    expect(container.querySelector('.ot-hub')).not.toBeNull();
  });

  it('starts a tour from a list item', async () => {
    await render(
      <TourProvider specs={specs} storage={createMemoryStorage()}>
        <ResourceCenter />
      </TourProvider>,
    );

    await act(async () => {
      (container.querySelector('.ot-hub-item') as HTMLButtonElement).click();
    });
    await vi.waitFor(() => expect(document.querySelector('.ot-root')).not.toBeNull());
  });
});

describe('Changelog', () => {
  const entries = [
    { id: 'e1', title: 'Dark mode', date: '2026-07-01', tag: 'New', content: 'Now with dark mode.' },
    { id: 'e2', title: 'Faster', content: 'Twice as fast.' },
  ];

  it('mounts the widget with an unread badge', async () => {
    await render(<Changelog entries={entries} storage={createMemoryStorage()} />);
    await settle();

    const badge = container.querySelector('.ot-changelog-badge') as HTMLElement;
    expect(badge).not.toBeNull();
    expect(badge.hidden).toBe(false);
    expect(badge.textContent).toBe('2');
  });

  it('opens and renders the entries', async () => {
    await render(<Changelog entries={entries} storage={createMemoryStorage()} />);
    await settle();

    await act(async () => {
      (container.querySelector('.ot-changelog-launcher') as HTMLButtonElement).click();
    });

    expect(container.querySelectorAll('.ot-changelog-item')).toHaveLength(2);
    expect(container.textContent).toContain('Dark mode');
  });

  it('pushes new entries through to the widget', async () => {
    await render(<Changelog entries={[]} storage={createMemoryStorage()} />);
    await settle();

    await render(<Changelog entries={entries} storage={createMemoryStorage()} />);
    await settle();

    await act(async () => {
      (container.querySelector('.ot-changelog-launcher') as HTMLButtonElement).click();
    });
    expect(container.querySelectorAll('.ot-changelog-item').length).toBeGreaterThan(0);
  });

  it('cleans up its DOM on unmount', async () => {
    await render(<Changelog entries={entries} storage={createMemoryStorage()} />);
    await settle();
    expect(container.querySelector('.ot-changelog-root')).not.toBeNull();

    await act(async () => { root.render(<div />); });
    expect(container.querySelector('.ot-changelog-root')).toBeNull();
  });
});
