import { describe, it, expect } from 'vitest';
import { TourEngine } from '../engine';
import type { TutorialSpec } from '../types';

const MIN_SPEC: TutorialSpec = {
  specVersion: 1,
  id: 'minimal',
  title: 'Minimal',
  trigger: { type: 'manual' },
  steps: [
    { id: 'a', title: 'Step A', content: 'Content A' },
    { id: 'b', title: 'Step B', content: 'Content B' },
  ],
};

describe('TourEngine', () => {
  it('constructs with valid spec and no errors', () => {
    const engine = new TourEngine(MIN_SPEC);
    expect(engine.isValid()).toBe(true);
    expect(engine.errors).toHaveLength(0);
  });

  it('has errors for invalid spec', () => {
    const engine = new TourEngine({ specVersion: 2, id: '', title: '', steps: [] } as never);
    expect(engine.isValid()).toBe(false);
    expect(engine.errors.length).toBeGreaterThan(0);
  });

  it('starts in idle state', () => {
    const engine = new TourEngine(MIN_SPEC);
    const state = engine.getState();
    expect(state.status).toBe('idle');
    expect(state.currentStepId).toBeNull();
  });

  it('setContext updates context', () => {
    const engine = new TourEngine(MIN_SPEC);
    engine.setContext({ plan: 'pro' });
    engine.setContext({ user: 'ava' });
  });

  it('has not seen fresh spec', () => {
    const engine = new TourEngine(MIN_SPEC);
    expect(engine.hasSeen()).toBe(false);
  });

  it('skip on idle does nothing', () => {
    const engine = new TourEngine(MIN_SPEC);
    engine.skip();
    expect(engine.getState().status).toBe('idle');
  });

  it('destroy transitions to destroyed', () => {
    const engine = new TourEngine(MIN_SPEC);
    engine.destroy();
    expect(engine.getState().status).toBe('destroyed');
  });

  it('start on destroyed spec is no-op', async () => {
    const engine = new TourEngine(MIN_SPEC);
    engine.destroy();
    await engine.start();
    expect(engine.getState().status).toBe('destroyed');
  });

  it('state reports correct step progress', async () => {
    const events: string[] = [];
    const engine = new TourEngine(MIN_SPEC, {
      onEvent: (e) => events.push(e.type),
    });
    await engine.start();
    expect(engine.getState().status).toBe('running');
    expect(engine.getState().currentStepId).toBe('a');
    engine.next();
    expect(engine.getState().currentStepId).toBe('b');
    engine.next();
    expect(engine.getState().status).toBe('completed');
    expect(events).toContain('started');
    expect(events).toContain('completed');
  });

  it('respects showIf to filter steps', async () => {
    const events: string[] = [];
    const engine = new TourEngine({
      specVersion: 1,
      id: 'cond',
      title: 'Conditional',
      steps: [
        { id: 'a', title: 'A', content: 'X' },
        { id: 'b', title: 'B', content: 'Y', showIf: "plan === 'pro'" },
        { id: 'c', title: 'C', content: 'Z' },
      ],
    } as TutorialSpec, { context: { plan: 'free' }, onEvent: (e) => events.push(e.type) });
    await engine.start();
    expect(engine.getState().currentStepId).toBe('a');
    engine.next();
    expect(engine.getState().currentStepId).toBe('c');
    engine.next();
    expect(engine.getState().status).toBe('completed');
  });

  it('complete emits completed event', async () => {
    const events: string[] = [];
    const engine = new TourEngine(MIN_SPEC, { onEvent: (e) => events.push(e.type) });
    await engine.start();
    engine.complete();
    expect(events).toContain('completed');
  });

  it('goTo navigates to specific step', async () => {
    const engine = new TourEngine(MIN_SPEC);
    await engine.start();
    engine.goTo('b');
    expect(engine.getState().currentStepId).toBe('b');
  });

  it('prev goes back to previous step', async () => {
    const engine = new TourEngine(MIN_SPEC);
    await engine.start();
    engine.next();
    expect(engine.getState().currentStepId).toBe('b');
    engine.prev();
    expect(engine.getState().currentStepId).toBe('a');
  });

  it('prev on first step does nothing', async () => {
    const engine = new TourEngine(MIN_SPEC);
    await engine.start();
    engine.prev();
    expect(engine.getState().currentStepId).toBe('a');
  });

  it('setGlobalTheme does not crash', () => {
    const engine = new TourEngine(MIN_SPEC);
    engine.setGlobalTheme({ accent: '#ff0000' });
  });

  it('skip marks as skipped in persistence', async () => {
    const engine = new TourEngine(MIN_SPEC);
    await engine.start();
    engine.skip();
    expect(engine.hasSeen()).toBe(true);
    expect(engine.getState().status).toBe('skipped');
  });

  it('emits step-shown and step-hidden events', async () => {
    const events: string[] = [];
    const engine = new TourEngine(MIN_SPEC, { onEvent: (e) => events.push(e.type) });
    await engine.start();
    engine.next();
    expect(events).toContain('step-shown');
    expect(events).toContain('step-hidden');
  });
});
