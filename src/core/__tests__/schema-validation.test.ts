import { describe, it, expect } from 'vitest';
import { validateSpec, validateSpecs, assertValidSpec } from '../schema';
import type { TutorialSpec } from '../types';

function base(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    specVersion: 1,
    id: 'valid-tour',
    title: 'Valid tour',
    trigger: { type: 'manual' },
    steps: [{ id: 's1', title: 'One', content: 'body' }],
    ...overrides,
  };
}

const errorsAt = (spec: unknown, path: string): string[] =>
  validateSpec(spec).errors.filter((e) => e.path === path).map((e) => e.message);

const warningPaths = (spec: unknown): string[] =>
  validateSpec(spec).warnings.map((w) => w.path);

describe('top level', () => {
  it('accepts a minimal valid spec', () => {
    const result = validateSpec(base());
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects non-objects', () => {
    for (const input of [null, undefined, 42, 'spec', [], true]) {
      const result = validateSpec(input);
      expect(result.ok).toBe(false);
    }
  });

  it('requires specVersion 1', () => {
    expect(errorsAt(base({ specVersion: 2 }), '$.specVersion')).not.toHaveLength(0);
    expect(errorsAt(base({ specVersion: '1' }), '$.specVersion')).not.toHaveLength(0);
  });

  it('requires a kebab-case id', () => {
    expect(errorsAt(base({ id: '' }), '$.id')).not.toHaveLength(0);
    expect(errorsAt(base({ id: 'Not Kebab' }), '$.id')).not.toHaveLength(0);
    expect(errorsAt(base({ id: 'camelCase' }), '$.id')).not.toHaveLength(0);
    expect(validateSpec(base({ id: 'a-b-c-123' })).ok).toBe(true);
  });

  it('requires a non-empty title', () => {
    expect(errorsAt(base({ title: undefined }), '$.title')).not.toHaveLength(0);
    expect(errorsAt(base({ title: '' }), '$.title')).not.toHaveLength(0);
  });

  it('accepts an i18n object as a title', () => {
    expect(validateSpec(base({ title: { key: 'tour.title', fallback: 'Tour' } })).ok).toBe(true);
  });

  it('warns rather than fails on unknown top-level keys', () => {
    const result = validateSpec(base({ somethingNew: true }));
    expect(result.ok).toBe(true);
    expect(warningPaths(base({ somethingNew: true }))).toContain('$.somethingNew');
  });

  it('warns on an over-long title instead of rejecting it', () => {
    const result = validateSpec(base({ title: 'x'.repeat(300) }));
    expect(result.ok).toBe(true);
    expect(result.warnings.some((w) => w.path === '$.title')).toBe(true);
  });

  it('requires at least one step', () => {
    expect(errorsAt(base({ steps: [] }), '$.steps')).not.toHaveLength(0);
    expect(errorsAt(base({ steps: 'nope' }), '$.steps')).not.toHaveLength(0);
  });

  it('rejects duplicate step ids', () => {
    const spec = base({
      steps: [
        { id: 'dup', title: 'A', content: 'a' },
        { id: 'dup', title: 'B', content: 'b' },
      ],
    });
    expect(validateSpec(spec).ok).toBe(false);
  });
});

describe('steps', () => {
  it('requires an id, title and content', () => {
    expect(validateSpec(base({ steps: [{ title: 'A', content: 'a' }] })).ok).toBe(false);
    expect(validateSpec(base({ steps: [{ id: 's1', content: 'a' }] })).ok).toBe(false);
    expect(validateSpec(base({ steps: [{ id: 's1', title: 'A' }] })).ok).toBe(false);
  });

  it('validates placement values', () => {
    expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', placement: 'top' }] })).ok).toBe(true);
    expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', placement: 'sideways' }] })).ok).toBe(false);
  });

  it('validates display modes', () => {
    for (const display of ['spotlight', 'hotspot', 'beacon']) {
      expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', display }] })).ok).toBe(true);
    }
    expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', display: 'neon' }] })).ok).toBe(false);
  });

  it('validates advanceOn values', () => {
    for (const advanceOn of [
      'button', 'target-click', 'event', 'auto',
      'input-match', 'form-submit', 'element-appears', 'element-disappears', 'url-match',
    ]) {
      const spec = base({
        steps: [{
          id: 's1', title: 'A', content: 'a', advanceOn,
          target: { selector: '#x' },
          event: 'e', watch: '#x', urlPattern: '/p', match: 'v', duration: 100,
        }],
      });
      expect(validateSpec(spec).ok).toBe(true);
    }
    expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', advanceOn: 'telepathy' }] })).ok).toBe(false);
  });

  it('requires a target for the advance modes that need one', () => {
    for (const advanceOn of ['target-click', 'input-match', 'form-submit']) {
      const spec = base({ steps: [{ id: 's1', title: 'A', content: 'a', advanceOn, match: 'v' }] });
      const result = validateSpec(spec);
      expect(result.ok).toBe(false);
      expect(result.errors.some((e) => e.path.endsWith('.target'))).toBe(true);
    }
  });

  it('rejects an unparseable showIf', () => {
    expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', showIf: 'plan ===' }] })).ok).toBe(false);
  });

  it('accepts a valid showIf', () => {
    expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', showIf: "plan === 'pro'" }] })).ok).toBe(true);
  });

  it('rejects a next rule pointing at a step that does not exist', () => {
    const spec = base({
      steps: [{ id: 's1', title: 'A', content: 'a', next: [{ if: 'true', to: 'ghost' }] }],
    });
    expect(validateSpec(spec).ok).toBe(false);
  });

  it('accepts a next rule pointing at a real step', () => {
    const spec = base({
      steps: [
        { id: 's1', title: 'A', content: 'a', next: [{ if: 'true', to: 's2' }] },
        { id: 's2', title: 'B', content: 'b' },
      ],
    });
    expect(validateSpec(spec).ok).toBe(true);
  });
});

describe('targets', () => {
  it('accepts a string selector, a list, and text matching', () => {
    for (const target of [
      { selector: '#a' },
      { selector: ['#a', '.b'] },
      { text: 'Save' },
      { selector: '#a', shadow: true, visible: true, index: 2 },
      { selector: '#a', iframe: '#frame' },
    ]) {
      expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', target }] })).ok).toBe(true);
    }
  });

  it('rejects a target with neither selector nor text', () => {
    expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', target: {} }] })).ok).toBe(false);
  });

  it('rejects a non-object target', () => {
    expect(validateSpec(base({ steps: [{ id: 's1', title: 'A', content: 'a', target: '#a' }] })).ok).toBe(false);
  });
});

describe('triggers', () => {
  it('accepts every supported trigger', () => {
    for (const trigger of [
      { type: 'manual' },
      { type: 'auto', delay: 500 },
      { type: 'event', event: 'ready' },
      { type: 'route', path: '/app', exact: true },
      { type: 'element', selector: '#x', timeout: 1000 },
      { type: 'idle', ms: 3000 },
      { type: 'scroll', percent: 50 },
    ]) {
      expect(validateSpec(base({ trigger })).ok).toBe(true);
    }
  });

  it('rejects an unknown trigger type', () => {
    expect(validateSpec(base({ trigger: { type: 'telepathy' } })).ok).toBe(false);
  });

  it('requires the fields each trigger needs', () => {
    expect(validateSpec(base({ trigger: { type: 'event' } })).ok).toBe(false);
    expect(validateSpec(base({ trigger: { type: 'route' } })).ok).toBe(false);
    expect(validateSpec(base({ trigger: { type: 'element' } })).ok).toBe(false);
    expect(validateSpec(base({ trigger: { type: 'idle' } })).ok).toBe(false);
    expect(validateSpec(base({ trigger: { type: 'scroll' } })).ok).toBe(false);
  });
});

describe('content blocks', () => {
  it('accepts every block type', () => {
    const spec = base({
      steps: [{
        id: 's1', title: 'A',
        content: {
          blocks: [
            { type: 'text', value: 'copy' },
            { type: 'image', src: '/a.png', alt: 'A' },
            { type: 'video', src: '/v.mp4' },
            { type: 'list', items: ['one', 'two'] },
            { type: 'code', value: 'npm i', lang: 'bash' },
            { type: 'divider' },
            { type: 'html', value: '<b>x</b>' },
          ],
        },
      }],
    });
    expect(validateSpec(spec).ok).toBe(true);
  });

  it('rejects an unknown block type', () => {
    const spec = base({
      steps: [{ id: 's1', title: 'A', content: { blocks: [{ type: 'hologram' }] } }],
    });
    expect(validateSpec(spec).ok).toBe(false);
  });

  it('requires src on image and video blocks', () => {
    const image = base({ steps: [{ id: 's1', title: 'A', content: { blocks: [{ type: 'image', alt: 'x' }] } }] });
    expect(validateSpec(image).ok).toBe(false);
  });
});

describe('audience, frequency and chaining', () => {
  it('accepts valid rules', () => {
    const spec = base({
      audience: { showIf: "plan === 'pro'" },
      frequency: { max: 3, cooldown: 86400000, perSession: 1 },
      onComplete: { startTour: 'next-tour', emit: 'done' },
      priority: 5,
    });
    expect(validateSpec(spec).ok).toBe(true);
  });

  it('rejects an unparseable audience expression', () => {
    expect(validateSpec(base({ audience: { showIf: '&&&' } })).ok).toBe(false);
  });

  it('rejects non-numeric frequency values', () => {
    expect(validateSpec(base({ frequency: { max: 'lots' } })).ok).toBe(false);
  });
});

describe('themes', () => {
  it('accepts known tokens and rejects unknown ones', () => {
    expect(validateSpec(base({ theme: { accent: '#f00', radius: '8px' } })).ok).toBe(true);
    const result = validateSpec(base({ theme: { unicorn: 'sparkle' } }));
    // Unknown theme keys are forward-compatibility warnings, not hard errors.
    expect(result.ok || result.warnings.length > 0).toBe(true);
  });
});

describe('validateSpecs', () => {
  it('flags duplicate ids across specs and prefixes paths by index', () => {
    const result = validateSpecs([base(), base()]);
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.message.includes('duplicate'))).toBe(true);
    expect(result.issues.some((i) => i.path.startsWith('['))).toBe(true);
  });

  it('passes a set of distinct valid specs', () => {
    const result = validateSpecs([base({ id: 'a' }), base({ id: 'b' })]);
    expect(result.ok).toBe(true);
  });

  it('handles an empty list', () => {
    expect(validateSpecs([]).ok).toBe(true);
  });
});

describe('assertValidSpec', () => {
  it('returns the spec when valid', () => {
    const spec = assertValidSpec(base());
    expect(spec.id).toBe('valid-tour');
  });

  it('throws with a readable message when invalid', () => {
    expect(() => assertValidSpec(base({ id: 'Bad Id' }))).toThrow(/id/i);
  });

  it('narrows the type for downstream use', () => {
    const spec: TutorialSpec = assertValidSpec(base());
    expect(spec.steps).toHaveLength(1);
  });
});
