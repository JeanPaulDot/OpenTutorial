import { describe, it, expect } from 'vitest';
import { validateSpec } from '../schema';

const VALID_SPEC = {
  specVersion: 1,
  id: 'test-tour',
  title: 'Test Tour',
  trigger: { type: 'manual' },
  steps: [
    { id: 'step1', title: 'Step 1', content: 'Content 1' },
    { id: 'step2', title: 'Step 2', content: 'Content 2', target: { selector: '[data-tour="x"]' } },
  ],
};

describe('validateSpec', () => {
  it('accepts a valid spec', () => {
    const result = validateSpec(VALID_SPEC);
    expect(result.ok).toBe(true);
  });

  it('rejects non-object', () => {
    const result = validateSpec('hello');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors[0].path).toBe('$');
    }
  });

  it('rejects wrong specVersion', () => {
    const r = validateSpec({ ...VALID_SPEC, specVersion: 2 });
    expect(r.ok).toBe(false);
  });

  it('rejects missing id', () => {
    const r = validateSpec({ ...VALID_SPEC, id: '' });
    expect(r.ok).toBe(false);
  });

  it('rejects non-kebab id', () => {
    const r = validateSpec({ ...VALID_SPEC, id: 'Hello World' });
    expect(r.ok).toBe(false);
  });

  it('rejects missing title', () => {
    const r = validateSpec({ ...VALID_SPEC, title: '' });
    expect(r.ok).toBe(false);
  });

  it('rejects title > 60 chars', () => {
    const r = validateSpec({ ...VALID_SPEC, title: 'x'.repeat(61) });
    expect(r.ok).toBe(false);
  });

  it('rejects missing steps', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [] });
    expect(r.ok).toBe(false);
  });

  it('rejects >24 steps', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: Array.from({ length: 25 }, (_, i) => ({ id: `s${i}`, title: 't', content: 'c' })) });
    expect(r.ok).toBe(false);
  });

  it('rejects duplicate step ids', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 'dup', title: 'a', content: 'b' }, { id: 'dup', title: 'c', content: 'd' }] });
    expect(r.ok).toBe(false);
  });

  it('rejects step title > 80 chars', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 'x'.repeat(81), content: 'ok' }] });
    expect(r.ok).toBe(false);
  });

  it('rejects step content > 320 chars', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 'ok', content: 'x'.repeat(321) }] });
    expect(r.ok).toBe(false);
  });

  it('rejects advanceOn target-click without target', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 't', content: 'c', advanceOn: 'target-click' }] });
    expect(r.ok).toBe(false);
  });

  it('rejects bad placement', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 't', content: 'c', placement: 'nowhere' }] });
    expect(r.ok).toBe(false);
  });

  it('rejects showIf > 200 chars', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 't', content: 'c', showIf: 'x'.repeat(201) }] });
    expect(r.ok).toBe(false);
  });

  it('rejects next pointing to non-existent step', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 't', content: 'c', next: 'ghost' }] });
    expect(r.ok).toBe(false);
  });

  it('rejects bad advanceOn values', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 't', content: 'c', advanceOn: 'invalid' }] });
    expect(r.ok).toBe(false);
  });

  it('rejects event advanceOn without event string', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 't', content: 'c', advanceOn: 'event' }] });
    expect(r.ok).toBe(false);
  });

  it('rejects auto advanceOn without duration', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 't', content: 'c', advanceOn: 'auto' }] });
    expect(r.ok).toBe(false);
  });

  it('rejects bad theme keys', () => {
    const r = validateSpec({ ...VALID_SPEC, theme: { unknown_key: 'red' } as never });
    expect(r.ok).toBe(false);
  });

  it('accepts display mode hotspot', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 't', content: 'c', display: 'hotspot' }] });
    expect(r.ok).toBe(true);
  });

  it('rejects bad display mode', () => {
    const r = validateSpec({ ...VALID_SPEC, steps: [{ id: 's', title: 't', content: 'c', display: 'megaphone' }] });
    expect(r.ok).toBe(false);
  });

  it('accepts i18n title object', () => {
    const r = validateSpec({ ...VALID_SPEC, title: { key: 'tour.welcome.title' } });
    expect(r.ok).toBe(true);
  });

  it('returns all errors, not just first', () => {
    const r = validateSpec({ specVersion: 2, id: 'Bad ID!', title: '', steps: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.length).toBeGreaterThanOrEqual(3);
    }
  });
});
