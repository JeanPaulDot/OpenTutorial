import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createBanner } from '../surfaces/banner';
import { createAnnouncement } from '../surfaces/announcement';
import { createSurvey } from '../surfaces/survey';
import { createHint } from '../surfaces/hint';
import { createChecklist } from '../surfaces/checklist';
import { createResourceCenter } from '../surfaces/resourceCenter';
import { createChangelog } from '../surfaces/changelog';
import { SurfaceState } from '../surfaces/shared';
import { createMemoryStorage } from '../storage/memory';
import type { TourController } from '../surfaces/controller';
import type { TourEvent, TutorialSpec } from '../types';

/** Minimal controller — the surfaces only need this structural slice. */
function controller(overrides: Partial<TourController> = {}): TourController & {
  emit: (e: TourEvent) => void;
  started: string[];
} {
  const listeners = new Set<(e: TourEvent) => void>();
  const started: string[] = [];
  const specs: TutorialSpec[] = [
    { specVersion: 1, id: 'setup', title: 'Set up', description: 'Do the thing', steps: [] } as unknown as TutorialSpec,
    { specVersion: 1, id: 'invite', title: 'Invite team', steps: [] } as unknown as TutorialSpec,
  ];
  let seen: string[] = [];

  return {
    getSpecs: () => specs,
    getContext: () => ({}),
    getActiveId: () => null,
    hasSeen: (id: string) => seen.includes(id),
    start: (id: string) => { started.push(id); seen = [...seen, id]; },
    on: (_event, handler) => { listeners.add(handler); return () => listeners.delete(handler); },
    emit: (e: TourEvent) => listeners.forEach((l) => l(e)),
    started,
    ...overrides,
  };
}

const tick = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => { document.body.innerHTML = ''; });

describe('SurfaceState', () => {
  it('shows once, then remembers the dismissal', async () => {
    const storage = createMemoryStorage();
    const state = new SurfaceState(storage, 'ot-x');
    await state.ready;

    expect(state.shouldShow('a')).toBe(true);
    state.markDismissed('a');
    expect(state.shouldShow('a')).toBe(false);
  });

  it('always shows when once is false', async () => {
    const state = new SurfaceState(createMemoryStorage(), 'ot-x');
    await state.ready;
    state.markDismissed('a');
    expect(state.shouldShow('a', { once: false })).toBe(true);
  });

  it('resurfaces after the configured interval', async () => {
    const state = new SurfaceState(createMemoryStorage(), 'ot-x');
    await state.ready;
    state.markDismissed('a');

    expect(state.shouldShow('a', { resurfaceAfter: 60_000 })).toBe(false);
    vi.setSystemTime(Date.now() + 120_000);
    expect(state.shouldShow('a', { resurfaceAfter: 60_000 })).toBe(true);
    vi.useRealTimers();
  });
});

describe('createBanner', () => {
  it('renders markdown and mounts hidden until hydration', async () => {
    const banner = createBanner({ id: 'b1', message: 'Read the **docs**', storage: createMemoryStorage() });
    expect(banner.el.hidden).toBe(true);

    await tick();
    expect(banner.el.hidden).toBe(false);
    expect(banner.el.querySelector('.ot-banner-content')?.innerHTML).toContain('<strong>docs</strong>');
    banner.destroy();
  });

  it('stays hidden once dismissed', async () => {
    const storage = createMemoryStorage();
    const first = createBanner({ id: 'b1', message: 'hi', storage });
    await tick();
    (first.el.querySelector('.ot-banner-dismiss') as HTMLButtonElement).click();
    expect(first.el.hidden).toBe(true);
    first.destroy();

    const second = createBanner({ id: 'b1', message: 'hi', storage });
    await tick();
    expect(second.el.hidden).toBe(true);
    second.destroy();
  });

  it('fires the action and the dismiss callback', async () => {
    const onClick = vi.fn();
    const onDismiss = vi.fn();
    const banner = createBanner({
      id: 'b2', message: 'x', storage: createMemoryStorage(),
      action: { label: 'Go', onClick }, onDismiss,
    });
    await tick();

    (banner.el.querySelector('.ot-banner-action') as HTMLButtonElement).click();
    expect(onClick).toHaveBeenCalled();

    banner.dismiss();
    expect(onDismiss).toHaveBeenCalled();
    banner.destroy();
  });

  it('setMessage swaps the copy', async () => {
    const banner = createBanner({ id: 'b3', message: 'old', storage: createMemoryStorage() });
    await tick();
    banner.setMessage('new **text**');
    expect(banner.el.textContent).toContain('new text');
    banner.destroy();
  });

  it('omits the close button when not dismissible', async () => {
    const banner = createBanner({
      id: 'b4', message: 'x', dismissible: false, storage: createMemoryStorage(),
    });
    await tick();
    expect(banner.el.querySelector('.ot-banner-dismiss')).toBeNull();
    banner.destroy();
  });
});

describe('createAnnouncement', () => {
  it('renders a modal with content blocks', async () => {
    const announcement = createAnnouncement({
      id: 'a1',
      title: 'New thing',
      content: { blocks: [{ type: 'text', value: 'Body copy' }, { type: 'list', items: ['one', 'two'] }] },
      storage: createMemoryStorage(),
    });
    await tick();

    expect(announcement.el.hidden).toBe(false);
    expect(announcement.el.querySelector('.ot-title')?.textContent).toBe('New thing');
    expect(announcement.el.textContent).toContain('Body copy');
    expect(announcement.el.querySelectorAll('.ot-list li')).toHaveLength(2);
    announcement.destroy();
  });

  it('primary action closes it and marks it acted', async () => {
    const storage = createMemoryStorage();
    const onClick = vi.fn();
    const first = createAnnouncement({
      id: 'a2', title: 'T', content: 'body', storage, primaryAction: { label: 'Do it', onClick },
    });
    await tick();

    (first.el.querySelector('.ot-btn-primary') as HTMLButtonElement).click();
    expect(onClick).toHaveBeenCalled();
    expect(first.el.hidden).toBe(true);
    first.destroy();

    const second = createAnnouncement({ id: 'a2', title: 'T', content: 'body', storage });
    await tick();
    expect(second.el.hidden).toBe(true);
    second.destroy();
  });

  it('Escape dismisses when dismissible', async () => {
    const announcement = createAnnouncement({
      id: 'a3', title: 'T', content: 'body', storage: createMemoryStorage(),
    });
    await tick();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(announcement.el.hidden).toBe(true);
    announcement.destroy();
  });

  it('shows every time when once is false', async () => {
    const storage = createMemoryStorage();
    for (let i = 0; i < 2; i += 1) {
      const a = createAnnouncement({ id: 'a4', title: 'T', content: 'b', once: false, storage });
      await tick();
      expect(a.el.hidden).toBe(false);
      a.close();
      a.destroy();
    }
  });
});

describe('createSurvey', () => {
  it('renders an 11-point NPS scale and blocks submit until answered', () => {
    const onSubmit = vi.fn();
    const survey = createSurvey({ id: 's1', question: 'How likely?', onSubmit });

    expect(survey.el.querySelectorAll('.ot-survey-score')).toHaveLength(11);
    const submit = survey.el.querySelector('.ot-btn-primary') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);

    (survey.el.querySelectorAll('.ot-survey-score')[9] as HTMLButtonElement).click();
    expect(submit.disabled).toBe(false);
    expect(survey.getResponse().score).toBe(9);

    submit.click();
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ surveyId: 's1', kind: 'nps', score: 9 }));
    expect(survey.el.querySelector('.ot-survey-thanks')).not.toBeNull();
    survey.destroy();
  });

  it('renders a 5-point rating', () => {
    const survey = createSurvey({ id: 's2', kind: 'rating', question: 'Rate', onSubmit: vi.fn() });
    expect(survey.el.querySelectorAll('.ot-survey-score')).toHaveLength(5);
    survey.destroy();
  });

  it('handles single choice', () => {
    const onSubmit = vi.fn();
    const survey = createSurvey({
      id: 's3', kind: 'choice', question: 'Pick', options: ['A', 'B'], onSubmit,
    });

    const options = survey.el.querySelectorAll('.ot-survey-option');
    expect(options).toHaveLength(2);
    (options[1] as HTMLButtonElement).click();
    (survey.el.querySelector('.ot-btn-primary') as HTMLButtonElement).click();

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ choice: 'B' }));
    survey.destroy();
  });

  it('handles free text', () => {
    const onSubmit = vi.fn();
    const survey = createSurvey({ id: 's4', kind: 'text', question: 'Why?', onSubmit });

    const textarea = survey.el.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.hidden).toBe(false);

    textarea.value = 'because';
    textarea.dispatchEvent(new Event('input'));
    (survey.el.querySelector('.ot-btn-primary') as HTMLButtonElement).click();

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ comment: 'because' }));
    survey.destroy();
  });

  it('reveals the follow-up only after a score is picked', () => {
    const survey = createSurvey({
      id: 's5', question: 'How likely?', followUp: 'Why that score?', onSubmit: vi.fn(),
    });

    const textarea = survey.el.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.hidden).toBe(true);

    (survey.el.querySelectorAll('.ot-survey-score')[3] as HTMLButtonElement).click();
    expect(textarea.hidden).toBe(false);
    survey.destroy();
  });

  it('reset clears the answer', () => {
    const survey = createSurvey({ id: 's6', question: 'Q', onSubmit: vi.fn() });
    (survey.el.querySelectorAll('.ot-survey-score')[5] as HTMLButtonElement).click();
    expect(survey.getResponse().score).toBe(5);

    survey.reset();
    expect(survey.getResponse().score).toBeUndefined();
    survey.destroy();
  });

  it('shows a dismiss button only when onDismiss is given', () => {
    const withDismiss = createSurvey({ id: 's7', question: 'Q', onSubmit: vi.fn(), onDismiss: vi.fn() });
    expect(withDismiss.el.querySelector('.ot-btn-ghost')).not.toBeNull();
    withDismiss.destroy();

    const without = createSurvey({ id: 's8', question: 'Q', onSubmit: vi.fn() });
    expect(without.el.querySelector('.ot-btn-ghost')).toBeNull();
    without.destroy();
  });
});

describe('createHint', () => {
  it('hides when the target is missing and pins to it when present', () => {
    const hint = createHint({ target: '#anchor', content: 'Some **help**' });
    expect(hint.el.hidden).toBe(true);

    const anchor = document.createElement('div');
    anchor.id = 'anchor';
    anchor.getBoundingClientRect = () => ({
      x: 10, y: 20, width: 30, height: 8, top: 20, left: 10, right: 40, bottom: 28, toJSON: () => ({}),
    }) as DOMRect;
    document.body.appendChild(anchor);

    hint.reposition();
    expect(hint.el.hidden).toBe(false);
    expect(hint.el.style.left).toBe('40px');
    expect(hint.el.style.top).toBe('20px');
    hint.destroy();
  });

  it('toggles the panel and keeps aria in sync', () => {
    document.body.innerHTML = '<div id="t"></div>';
    document.getElementById('t')!.getBoundingClientRect = () => ({
      x: 0, y: 0, width: 5, height: 5, top: 0, left: 0, right: 5, bottom: 5, toJSON: () => ({}),
    }) as DOMRect;

    const hint = createHint({ target: { selector: '#t' }, content: 'help' });
    const dot = hint.el.querySelector('.ot-hint-dot') as HTMLButtonElement;
    const panel = hint.el.querySelector('.ot-hint-panel') as HTMLElement;

    expect(panel.hidden).toBe(true);
    dot.click();
    expect(panel.hidden).toBe(false);
    expect(dot.getAttribute('aria-expanded')).toBe('true');

    hint.close();
    expect(panel.hidden).toBe(true);
    hint.destroy();
  });
});

describe('createChecklist', () => {
  it('derives status from the controller and renders progress', () => {
    const layer = controller();
    const checklist = createChecklist({ layer });

    expect(checklist.getProgress()).toEqual({ completed: 0, total: 2, percent: 0 });
    expect(checklist.el.querySelectorAll('.ot-checklist-item')).toHaveLength(2);
    expect(checklist.el.querySelector('.ot-checklist-count')?.textContent).toBe('0/2');
    expect(checklist.el.textContent).toContain('Do the thing');
    checklist.destroy();
  });

  it('starts a tour and repaints on the resulting event', () => {
    const layer = controller();
    const checklist = createChecklist({ layer });

    (checklist.el.querySelector('.ot-checklist-btn') as HTMLButtonElement).click();
    expect(layer.started).toEqual(['setup']);

    layer.emit({ type: 'completed', tourId: 'setup', timestamp: Date.now() });
    expect(checklist.getProgress().completed).toBe(1);
    expect(checklist.el.querySelector('.ot-checklist-count')?.textContent).toBe('1/2');
    checklist.destroy();
  });

  it('marks the active tour as in progress', () => {
    const layer = controller({ getActiveId: () => 'invite' });
    const checklist = createChecklist({ layer });
    expect(checklist.el.querySelector('.ot-checklist-item--in_progress')).not.toBeNull();
    checklist.destroy();
  });

  it('honours a getStatus override', () => {
    const checklist = createChecklist({ layer: controller(), getStatus: () => 'completed' });
    expect(checklist.getProgress().percent).toBe(100);
    checklist.destroy();
  });

  it('collapses and expands', () => {
    const checklist = createChecklist({ layer: controller(), collapsible: true });
    const toggle = checklist.el.querySelector('.ot-checklist-toggle') as HTMLButtonElement;

    toggle.click();
    expect(checklist.el.className).toContain('ot-checklist--collapsed');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    expect(checklist.el.className).not.toContain('ot-checklist--collapsed');
    checklist.destroy();
  });

  it('hides when complete and fires onComplete once', () => {
    const onComplete = vi.fn();
    const checklist = createChecklist({
      layer: controller(), getStatus: () => 'completed', hideWhenComplete: true, onComplete,
    });

    expect(checklist.el.hidden).toBe(true);
    checklist.refresh();
    expect(onComplete).toHaveBeenCalledTimes(1);
    checklist.destroy();
  });

  it('calls onStart instead of the layer when given', () => {
    const layer = controller();
    const onStart = vi.fn();
    const checklist = createChecklist({ layer, onStart });

    (checklist.el.querySelector('.ot-checklist-btn') as HTMLButtonElement).click();
    expect(onStart).toHaveBeenCalledWith('setup');
    expect(layer.started).toEqual([]);
    checklist.destroy();
  });
});

describe('createResourceCenter', () => {
  it('lists tours and links', () => {
    const hub = createResourceCenter({
      layer: controller(),
      links: [{ label: 'Docs', href: 'https://docs.test', description: 'Read more' }],
    });

    const items = hub.el.querySelectorAll('.ot-hub-item');
    expect(items).toHaveLength(3);
    expect(hub.el.textContent).toContain('Set up');
    expect(hub.el.textContent).toContain('Docs');
    hub.destroy();
  });

  it('filters by search across titles and descriptions', () => {
    const hub = createResourceCenter({ layer: controller() });

    hub.search('invite');
    expect(hub.el.querySelectorAll('.ot-hub-item')).toHaveLength(1);

    hub.search('do the thing');
    expect(hub.el.querySelectorAll('.ot-hub-item')).toHaveLength(1);

    hub.search('zzz');
    expect(hub.el.querySelector('.ot-hub-empty')).not.toBeNull();
    hub.destroy();
  });

  it('starts a tour and closes when floating', () => {
    const layer = controller();
    const hub = createResourceCenter({ layer, floating: true });

    hub.open();
    (hub.el.querySelector('.ot-hub-item') as HTMLButtonElement).click();
    expect(layer.started).toEqual(['setup']);
    expect((hub.el.querySelector('.ot-hub') as HTMLElement).hidden).toBe(true);
    hub.destroy();
  });

  it('the floating launcher toggles the panel', () => {
    const hub = createResourceCenter({ layer: controller(), floating: true });
    const launcher = hub.el.querySelector('.ot-hub-launcher') as HTMLButtonElement;
    const panel = hub.el.querySelector('.ot-hub') as HTMLElement;

    expect(panel.hidden).toBe(true);
    launcher.click();
    expect(panel.hidden).toBe(false);
    expect(launcher.getAttribute('aria-expanded')).toBe('true');
    hub.destroy();
  });

  it('marks tours already seen', () => {
    const layer = controller();
    layer.start('setup');
    const hub = createResourceCenter({ layer });
    expect(hub.el.textContent).toContain('↻ Set up');
    hub.destroy();
  });
});

describe('createChangelog', () => {
  const entries = [
    { id: 'e1', title: 'Dark mode', date: '2026-07-01', tag: 'New', content: 'Now with dark mode.' },
    { id: 'e2', title: 'Faster boot', content: 'Twice as fast.', href: 'https://notes.test' },
  ];

  it('badges unread entries once hydrated', async () => {
    const changelog = createChangelog({ entries, storage: createMemoryStorage() });
    // Before hydration nothing is claimed as unread.
    expect(changelog.unread()).toEqual([]);

    await tick();
    expect(changelog.unread()).toEqual(['e1', 'e2']);
    const badge = changelog.el.querySelector('.ot-changelog-badge') as HTMLElement;
    expect(badge.hidden).toBe(false);
    expect(badge.textContent).toBe('2');
    changelog.destroy();
  });

  it('opening renders the entries and marks them read', async () => {
    const storage = createMemoryStorage();
    const onRead = vi.fn();
    const changelog = createChangelog({ entries, storage, onRead });
    await tick();

    changelog.open();
    expect(changelog.el.querySelectorAll('.ot-changelog-item')).toHaveLength(2);
    // Rendered as unread first, so the user can see what is new.
    expect(changelog.el.querySelectorAll('.ot-changelog-item--unread')).toHaveLength(2);
    expect(onRead).toHaveBeenCalledWith(['e1', 'e2']);
    expect(changelog.unread()).toEqual([]);
    changelog.destroy();
  });

  it('read state survives a remount', async () => {
    const storage = createMemoryStorage();
    const first = createChangelog({ entries, storage });
    await tick();
    first.open();
    first.destroy();

    const second = createChangelog({ entries, storage });
    await tick();
    expect(second.unread()).toEqual([]);
    second.destroy();
  });

  it('a new entry becomes unread even when older ones were read', async () => {
    const storage = createMemoryStorage();
    const first = createChangelog({ entries, storage });
    await tick();
    first.open();
    first.destroy();

    const second = createChangelog({
      entries: [{ id: 'e3', title: 'Brand new', content: 'x' }, ...entries],
      storage,
    });
    await tick();
    expect(second.unread()).toEqual(['e3']);
    second.destroy();
  });

  it('renders tag, date and an external link', async () => {
    const changelog = createChangelog({ entries, storage: createMemoryStorage() });
    await tick();
    changelog.open();

    expect(changelog.el.querySelector('.ot-changelog-tag')?.textContent).toBe('New');
    expect(changelog.el.querySelector('.ot-changelog-date')?.textContent).toBe('2026-07-01');
    const link = changelog.el.querySelector('.ot-changelog-link') as HTMLAnchorElement;
    expect(link.href).toBe('https://notes.test/');
    expect(link.rel).toBe('noopener noreferrer');
    changelog.destroy();
  });

  it('markAllRead clears the badge without opening', async () => {
    const changelog = createChangelog({ entries, storage: createMemoryStorage() });
    await tick();
    changelog.markAllRead();
    expect(changelog.unread()).toEqual([]);
    changelog.destroy();
  });

  it('setEntries swaps the feed', async () => {
    const changelog = createChangelog({ entries: [], storage: createMemoryStorage() });
    await tick();
    changelog.open();
    expect(changelog.el.querySelector('.ot-changelog-empty')).not.toBeNull();

    changelog.setEntries(entries);
    changelog.open();
    expect(changelog.el.querySelectorAll('.ot-changelog-item')).toHaveLength(2);
    changelog.destroy();
  });

  it('caps the rendered list at the limit', async () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ id: `x${i}`, title: `E${i}`, content: 'c' }));
    const changelog = createChangelog({ entries: many, limit: 5, storage: createMemoryStorage() });
    await tick();
    changelog.open();
    expect(changelog.el.querySelectorAll('.ot-changelog-item')).toHaveLength(5);
    changelog.destroy();
  });

  it('caps the badge at 99+', async () => {
    const many = Array.from({ length: 200 }, (_, i) => ({ id: `y${i}`, title: `E${i}`, content: 'c' }));
    const changelog = createChangelog({ entries: many, limit: 200, storage: createMemoryStorage() });
    await tick();
    expect(changelog.el.querySelector('.ot-changelog-badge')?.textContent).toBe('99+');
    changelog.destroy();
  });
});

describe('surface handles', () => {
  it('destroy removes the element from the DOM', async () => {
    const banner = createBanner({ id: 'z', message: 'x', storage: createMemoryStorage() });
    await tick();
    expect(document.body.contains(banner.el)).toBe(true);
    banner.destroy();
    expect(document.body.contains(banner.el)).toBe(false);
  });

  it('container: null leaves the element detached for manual placement', async () => {
    const banner = createBanner({
      id: 'z2', message: 'x', container: null, storage: createMemoryStorage(),
    });
    await tick();
    expect(document.body.contains(banner.el)).toBe(false);

    const host = document.createElement('section');
    document.body.appendChild(host);
    banner.mount(host);
    expect(host.contains(banner.el)).toBe(true);
    banner.destroy();
  });
});
