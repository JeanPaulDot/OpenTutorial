import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { TourProvider, useTour, TourAnchor } from '../adapters/react';
import { TourChecklist } from '../components/TourChecklist';
import { Banner } from '../components/Banner';
import { Survey } from '../components/Survey';
import { createMemoryStorage } from '../storage/memory';
import type { TutorialSpec } from '../types';

// React logs an act() warning for the engine's async transitions; the tests
// below drive everything through act() deliberately, so silence the noise.
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

function spec(id = 'welcome', extra: Partial<TutorialSpec> = {}): TutorialSpec {
  return {
    specVersion: 1,
    id,
    title: 'Welcome',
    description: 'Get started',
    trigger: { type: 'manual' },
    steps: [
      { id: 's1', title: 'One', content: 'first', placement: 'center' },
      { id: 's2', title: 'Two', content: 'second', placement: 'center' },
    ],
    ...extra,
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

describe('TourProvider / useTour', () => {
  it('exposes the tour API and starts a tour', async () => {
    let api: ReturnType<typeof useTour> | null = null;
    function Probe() {
      api = useTour();
      return <button data-tour="target">target</button>;
    }

    await render(
      <TourProvider specs={[spec()]} storage={createMemoryStorage()}>
        <Probe />
      </TourProvider>,
    );

    expect(api!.specs.map((s) => s.id)).toEqual(['welcome']);
    expect(api!.activeId).toBeNull();
    expect(api!.hasSeen('welcome')).toBe(false);
    expect(api!.whyBlocked('ghost')).toBe('unknown tour');

    await act(async () => { api!.start('welcome'); });
    await vi.waitFor(() => expect(api!.activeId).toBe('welcome'));
    expect(api!.state?.status).toBe('running');
  });

  it('moves between steps and stops', async () => {
    let api: ReturnType<typeof useTour> | null = null;
    function Probe() { api = useTour(); return null; }

    await render(
      <TourProvider specs={[spec()]} storage={createMemoryStorage()}>
        <Probe />
      </TourProvider>,
    );

    await act(async () => { api!.start('welcome'); });
    await vi.waitFor(() => expect(api!.state?.currentStepId).toBe('s1'));

    await act(async () => { api!.next(); });
    await vi.waitFor(() => expect(api!.state?.currentStepId).toBe('s2'));

    await act(async () => { api!.prev(); });
    await vi.waitFor(() => expect(api!.state?.currentStepId).toBe('s1'));

    await act(async () => { api!.stop(); });
    await vi.waitFor(() => expect(api!.activeId).toBeNull());
  });

  it('pauses and resumes', async () => {
    let api: ReturnType<typeof useTour> | null = null;
    function Probe() { api = useTour(); return null; }

    await render(
      <TourProvider specs={[spec()]} storage={createMemoryStorage()}>
        <Probe />
      </TourProvider>,
    );

    await act(async () => { api!.start('welcome'); });
    await vi.waitFor(() => expect(api!.activeId).toBe('welcome'));

    await act(async () => { api!.pause(); });
    expect(api!.state?.status).toBe('paused');

    await act(async () => { api!.resume(); });
    expect(api!.state?.status).toBe('running');
  });

  it('tracks context updates', async () => {
    let api: ReturnType<typeof useTour> | null = null;
    function Probe() { api = useTour(); return null; }

    await render(
      <TourProvider specs={[spec()]} context={{ plan: 'free' }} storage={createMemoryStorage()}>
        <Probe />
      </TourProvider>,
    );

    expect(api!.context.plan).toBe('free');
    await act(async () => { api!.setContext({ plan: 'pro' }); });
    expect(api!.context.plan).toBe('pro');
  });

  it('collects events and clears them', async () => {
    let api: ReturnType<typeof useTour> | null = null;
    function Probe() { api = useTour(); return null; }

    await render(
      <TourProvider specs={[spec()]} storage={createMemoryStorage()}>
        <Probe />
      </TourProvider>,
    );

    await act(async () => { api!.start('welcome'); });
    await vi.waitFor(() => expect(api!.events.length).toBeGreaterThan(0));

    await act(async () => { api!.clearEvents(); });
    expect(api!.events).toHaveLength(0);
  });

  it('exports and imports progress', async () => {
    let api: ReturnType<typeof useTour> | null = null;
    function Probe() { api = useTour(); return null; }

    await render(
      <TourProvider specs={[spec()]} storage={createMemoryStorage()}>
        <Probe />
      </TourProvider>,
    );

    await act(async () => { api!.start('welcome'); });
    await vi.waitFor(() => expect(api!.activeId).toBe('welcome'));
    await act(async () => { api!.getEngine('welcome')!.complete('api'); });
    await vi.waitFor(() => expect(api!.hasSeen('welcome')).toBe(true));

    const snapshot = api!.exportProgress()!;
    await act(async () => { api!.resetTours(); });
    expect(api!.hasSeen('welcome')).toBe(false);

    expect(api!.importProgress(snapshot)).toBe(true);
    expect(api!.hasSeen('welcome')).toBe(true);
  });

  it('honours audience rules through whyBlocked', async () => {
    let api: ReturnType<typeof useTour> | null = null;
    function Probe() { api = useTour(); return null; }

    await render(
      <TourProvider
        specs={[spec('gated', { audience: { showIf: "plan === 'pro'" } })]}
        context={{ plan: 'free' }}
        storage={createMemoryStorage()}
      >
        <Probe />
      </TourProvider>,
    );

    expect(api!.whyBlocked('gated')).toBe('audience rule did not match');
    expect(api!.request('gated')).toBe(false);
  });

  it('throws a helpful error when useTour is used outside a provider', () => {
    function Orphan() { useTour(); return null; }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      act(() => { root.render(<Orphan />); });
    }).toThrow(/TourProvider/i);

    spy.mockRestore();
  });
});

describe('TourAnchor', () => {
  it('tags a child element with data-tour', async () => {
    await render(
      <TourProvider specs={[spec()]} storage={createMemoryStorage()}>
        <TourAnchor id="sidebar"><button>Menu</button></TourAnchor>
      </TourProvider>,
    );

    expect(container.querySelector('[data-tour="sidebar"]')).not.toBeNull();
  });
});

describe('TourChecklist', () => {
  it('renders every registered spec with progress', async () => {
    await render(
      <TourProvider specs={[spec('a'), spec('b')]} storage={createMemoryStorage()}>
        <TourChecklist title="Get started" />
      </TourProvider>,
    );

    expect(container.querySelectorAll('.ot-checklist-item')).toHaveLength(2);
    expect(container.querySelector('.ot-checklist-count')?.textContent).toBe('0/2');
    expect(container.textContent).toContain('Get started');
  });

  it('starts a tour when an item is clicked', async () => {
    let api: ReturnType<typeof useTour> | null = null;
    function Probe() { api = useTour(); return null; }

    await render(
      <TourProvider specs={[spec('a')]} storage={createMemoryStorage()}>
        <Probe />
        <TourChecklist />
      </TourProvider>,
    );

    const button = container.querySelector('.ot-checklist-btn') as HTMLButtonElement;
    await act(async () => { button.click(); });
    await vi.waitFor(() => expect(api!.activeId).toBe('a'));
  });

  it('honours a getStatus override and hideWhenComplete', async () => {
    await render(
      <TourProvider specs={[spec('a')]} storage={createMemoryStorage()}>
        <TourChecklist getStatus={() => 'completed'} hideWhenComplete />
      </TourProvider>,
    );

    expect(container.querySelector('.ot-checklist')).toBeNull();
  });

  it('resolves i18n titles instead of rendering raw keys', async () => {
    const i18nSpec = {
      ...spec('i18n-tour'),
      title: { key: 'tour.title' },
      description: { key: 'tour.desc' },
    } as unknown as TutorialSpec;

    await render(
      <TourProvider specs={[i18nSpec]} storage={createMemoryStorage()}>
        <TourChecklist
          locale="en"
          i18nResolver={(key) => ({ 'tour.title': 'Localised title', 'tour.desc': 'Localised description' }[key])}
        />
      </TourProvider>,
    );

    expect(container.textContent).toContain('Localised title');
    expect(container.textContent).toContain('Localised description');
    expect(container.textContent).not.toContain('tour.title');
  });
});

describe('Banner', () => {
  it('renders markdown and remembers dismissal', async () => {
    const storage = createMemoryStorage();
    await render(<Banner id="promo" message="See the **docs**" storage={storage} />);

    await vi.waitFor(() => expect(container.querySelector('.ot-banner')).not.toBeNull());
    expect(container.innerHTML).toContain('<strong>docs</strong>');

    const dismiss = container.querySelector('.ot-banner-dismiss') as HTMLButtonElement;
    await act(async () => { dismiss.click(); });
    expect(container.querySelector('.ot-banner')).toBeNull();

    // A fresh mount with the same storage stays hidden.
    await render(<Banner id="promo" message="See the docs" storage={storage} />);
    await new Promise((r) => setTimeout(r, 10));
    expect(container.querySelector('.ot-banner')).toBeNull();
  });
});

describe('Survey', () => {
  it('collects an NPS score', async () => {
    const onSubmit = vi.fn();
    await render(<Survey id="nps" question="How likely?" onSubmit={onSubmit} />);

    const scores = container.querySelectorAll('.ot-survey-score');
    expect(scores).toHaveLength(11);

    await act(async () => { (scores[10] as HTMLButtonElement).click(); });
    await act(async () => { (container.querySelector('.ot-btn-primary') as HTMLButtonElement).click(); });

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ surveyId: 'nps', score: 10 }));
    expect(container.querySelector('.ot-survey-thanks')).not.toBeNull();
  });
});
