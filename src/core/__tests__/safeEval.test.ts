import { describe, it, expect } from 'vitest';
import { evaluateShowIf } from '../safeEval';

describe('evaluateShowIf', () => {
  it('returns true for plain true', () => {
    expect(evaluateShowIf('true', {})).toBe(true);
  });

  it('returns false for plain false', () => {
    expect(evaluateShowIf('false', {})).toBe(false);
  });

  it('evaluates equality', () => {
    expect(evaluateShowIf("plan === 'pro'", { plan: 'pro' })).toBe(true);
    expect(evaluateShowIf("plan === 'pro'", { plan: 'free' })).toBe(false);
  });

  it('evaluates inequality', () => {
    expect(evaluateShowIf("plan !== 'pro'", { plan: 'free' })).toBe(true);
    expect(evaluateShowIf("plan !== 'pro'", { plan: 'pro' })).toBe(false);
  });

  it('evaluates &&', () => {
    expect(evaluateShowIf("a && b", { a: true, b: true })).toBe(true);
    expect(evaluateShowIf("a && b", { a: false, b: true })).toBe(false);
  });

  it('evaluates ||', () => {
    expect(evaluateShowIf("a || b", { a: false, b: true })).toBe(true);
    expect(evaluateShowIf("a || b", { a: false, b: false })).toBe(false);
  });

  it('evaluates ! (not)', () => {
    expect(evaluateShowIf('!a', { a: false })).toBe(true);
    expect(evaluateShowIf('!a', { a: true })).toBe(false);
  });

  it('evaluates nested parentheses', () => {
    expect(evaluateShowIf("(a && b) || c", { a: false, b: true, c: true })).toBe(true);
    expect(evaluateShowIf("(a && b) || c", { a: false, b: true, c: false })).toBe(false);
  });

  it('resolves object paths with dots', () => {
    expect(evaluateShowIf("user.plan === 'pro'", { user: { plan: 'pro' } })).toBe(true);
    expect(evaluateShowIf("user.plan === 'pro'", { user: { plan: 'free' } })).toBe(false);
  });

  it('handles nested dot paths deep', () => {
    expect(evaluateShowIf("a.b.c", { a: { b: { c: true } } })).toBe(true);
    expect(evaluateShowIf("a.b.c", { a: { b: { c: false } } })).toBe(false);
  });

  it('handles numeric comparisons', () => {
    expect(evaluateShowIf("count === 5", { count: 5 })).toBe(true);
    expect(evaluateShowIf("count === 5", { count: 3 })).toBe(false);
  });

  it('handles null', () => {
    expect(evaluateShowIf("x === null", { x: null })).toBe(true);
    expect(evaluateShowIf("x === null", { x: 'a' })).toBe(false);
  });

  it('returns false for undefined identifiers', () => {
    expect(evaluateShowIf("missing === 'x'", {})).toBe(false);
  });

  it('returns false for expressions exceeding MAX_LEN', () => {
    const long = 'true && ' + 'x && '.repeat(50) + 'true';
    expect(evaluateShowIf(long, { x: true })).toBe(false);
  });

  it('returns false for invalid expressions (graceful)', () => {
    expect(evaluateShowIf('invalid syntax !!!', {})).toBe(false);
    expect(evaluateShowIf('', {})).toBe(false);
  });
});
