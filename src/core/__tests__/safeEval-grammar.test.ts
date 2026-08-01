import { describe, it, expect } from 'vitest';
import { evaluateExpression, evaluateShowIf, checkExpression } from '../safeEval';

const ctx = {
  plan: 'pro',
  seats: 5,
  price: 19.5,
  trial: false,
  tags: ['beta', 'admin'],
  user: { name: 'Ada', roles: ['owner'], meta: { level: 3 } },
  empty: [],
  nothing: null,
};

const value = (expr: string): unknown => evaluateExpression(expr, ctx);
const truth = (expr: string): boolean => evaluateShowIf(expr, ctx);

describe('comparison operators', () => {
  it('handles the full set', () => {
    expect(truth('seats > 3')).toBe(true);
    expect(truth('seats >= 5')).toBe(true);
    expect(truth('seats < 3')).toBe(false);
    expect(truth('seats <= 5')).toBe(true);
    expect(truth('seats == 5')).toBe(true);
    expect(truth('seats != 4')).toBe(true);
    expect(truth("plan === 'pro'")).toBe(true);
    expect(truth("plan !== 'free'")).toBe(true);
  });

  it('compares floats', () => {
    expect(truth('price > 19')).toBe(true);
    expect(truth('price < 19')).toBe(false);
  });
});

describe('arithmetic', () => {
  it('evaluates the basic operators', () => {
    expect(value('seats + 1')).toBe(6);
    expect(value('seats - 1')).toBe(4);
    expect(value('seats * 2')).toBe(10);
    expect(value('seats / 5')).toBe(1);
    expect(value('seats % 2')).toBe(1);
  });

  it('respects precedence and parentheses', () => {
    expect(value('2 + 3 * 4')).toBe(14);
    expect(value('(2 + 3) * 4')).toBe(20);
  });

  it('supports unary minus', () => {
    expect(value('-seats')).toBe(-5);
    expect(truth('-seats < 0')).toBe(true);
  });

  it('feeds arithmetic into comparison', () => {
    expect(truth('seats * 2 > 9')).toBe(true);
  });
});

describe('member and index access', () => {
  it('reads dotted paths', () => {
    expect(value('user.name')).toBe('Ada');
    expect(value('user.meta.level')).toBe(3);
  });

  it('reads array indexes', () => {
    expect(value('tags[0]')).toBe('beta');
    expect(value('user.roles[0]')).toBe('owner');
  });

  it('returns undefined past the end rather than throwing', () => {
    expect(value('tags[99]')).toBeUndefined();
    expect(truth('tags[99]')).toBe(false);
  });

  it('reads length', () => {
    expect(value('tags.length')).toBe(2);
    expect(truth('tags.length > 1')).toBe(true);
    expect(truth('empty.length === 0')).toBe(true);
  });
});

describe('whitelisted methods', () => {
  it('includes works on arrays and strings', () => {
    expect(truth("tags.includes('beta')")).toBe(true);
    expect(truth("tags.includes('nope')")).toBe(false);
    expect(truth("plan.includes('pr')")).toBe(true);
  });

  it('supports regex matching', () => {
    expect(truth("plan.matches('^pr')")).toBe(true);
    expect(truth("plan.matches('^fr')")).toBe(false);
  });

  it('a malformed regex is false, not a crash', () => {
    expect(truth("plan.matches('([')")).toBe(false);
  });

  it('refuses methods that are not whitelisted', () => {
    expect(truth('plan.split()')).toBe(false);
    expect(truth('plan.replace()')).toBe(false);
  });

  it('does not treat Object.prototype members as whitelisted methods', () => {
    // A plain `SAFE_METHODS[name]` lookup inherits from Object.prototype, so
    // these used to resolve to real functions: `plan.constructor()` evaluated
    // to `Object('pro')`, and `toString` returned "[object Undefined]".
    for (const expr of [
      'plan.constructor()',
      'plan.toString()',
      'plan.valueOf()',
      "plan.hasOwnProperty('length')",
      'plan.isPrototypeOf({})',
      'plan.toLocaleString()',
      "plan.propertyIsEnumerable('x')",
    ]) {
      expect(value(expr)).toBeUndefined();
      expect(truth(expr)).toBe(false);
    }
  });
});

describe('ternary', () => {
  it('picks the right branch', () => {
    expect(value("plan === 'pro' ? 'yes' : 'no'")).toBe('yes');
    expect(value("plan === 'free' ? 'yes' : 'no'")).toBe('no');
  });
});

describe('sandbox guarantees', () => {
  it('blocks prototype-pollution keys', () => {
    expect(truth('user.__proto__')).toBe(false);
    expect(truth('user.constructor')).toBe(false);
    expect(truth('user.prototype')).toBe(false);
  });

  it('cannot reach globals', () => {
    expect(truth('window')).toBe(false);
    expect(truth('globalThis')).toBe(false);
    expect(truth('document.cookie')).toBe(false);
    expect(truth('process.env')).toBe(false);
  });

  it('never throws on garbage input', () => {
    for (const expr of ['((((', 'a b c', '&&', '1 +', "'unclosed", '[]{}', '...']) {
      expect(() => evaluateShowIf(expr, ctx)).not.toThrow();
      expect(evaluateShowIf(expr, ctx)).toBe(false);
    }
  });

  it('treats null and undefined access as falsy', () => {
    expect(truth('nothing')).toBe(false);
    expect(truth('nothing.deep')).toBe(false);
    expect(truth('missing.deeper.deepest')).toBe(false);
  });
});

describe('truthiness', () => {
  it('follows JavaScript rules for bare values', () => {
    expect(truth('plan')).toBe(true);
    expect(truth('trial')).toBe(false);
    expect(truth('seats')).toBe(true);
    expect(truth('tags')).toBe(true);
    expect(truth('empty')).toBe(true);
  });
});

describe('checkExpression', () => {
  it('accepts a valid expression', () => {
    const result = checkExpression("plan === 'pro' && seats > 2");
    expect(result.ok).toBe(true);
  });

  it('rejects and explains an invalid one', () => {
    const result = checkExpression('plan ===');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(typeof result.message).toBe('string');
  });

  it('rejects a call to a method that is not allowed', () => {
    const result = checkExpression('plan.constructor()');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain('not allowed');
  });

  it('enforces the length cap at evaluation time', () => {
    // `checkExpression` is a syntax check; the cap belongs to evaluation.
    expect(evaluateShowIf('a'.repeat(1000), ctx)).toBe(false);
    expect(evaluateShowIf('plan', ctx, { maxLength: 2 })).toBe(false);
  });

  it('reports failures through onError', () => {
    const messages: string[] = [];
    evaluateShowIf('plan ===', ctx, { onError: (m) => messages.push(m) });
    expect(messages.length).toBe(1);
  });
});
