import { describe, it, expect, beforeEach } from 'vitest';
import { TourPersistence } from '../persist';

describe('TourPersistence', () => {
  let storage: Storage;
  let p: TourPersistence;

  beforeEach(() => {
    const map = new Map<string, string>();
    storage = {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => { map.set(k, v); },
      removeItem: (k: string) => { map.delete(k); },
      get length() { return map.size; },
      clear: () => map.clear(),
      key: (i: number) => [...map.keys()][i] ?? null,
    } as Storage;
    p = new TourPersistence(storage, 'tl');
  });

  it('starts with no seen tours', () => {
    expect(p.hasSeen('welcome')).toBe(false);
  });

  it('marks as seen after completion', () => {
    p.mark('welcome', 'completed', '1.0.0');
    expect(p.hasSeen('welcome')).toBe(true);
  });

  it('considers skipped tours as seen', () => {
    p.mark('welcome', 'skipped', '1.0.0');
    expect(p.hasSeen('welcome')).toBe(true);
  });

  it('returns false after version bump', () => {
    p.mark('welcome', 'completed', '1.0.0');
    expect(p.hasSeen('welcome', '2.0.0')).toBe(false);
  });

  it('returns true when version matches', () => {
    p.mark('welcome', 'completed', '1.0.0');
    expect(p.hasSeen('welcome', '1.0.0')).toBe(true);
  });

  it('reset clears individual tour', () => {
    p.mark('a', 'completed');
    p.mark('b', 'completed');
    p.reset('a');
    expect(p.hasSeen('a')).toBe(false);
    expect(p.hasSeen('b')).toBe(true);
  });

  it('reset without args clears all', () => {
    p.mark('a', 'completed');
    p.reset();
    expect(p.hasSeen('a')).toBe(false);
  });

  it('getStatus returns null for unseen', () => {
    expect(p.getStatus('unknown')).toBe(null);
  });

  it('getStatus returns correct status', () => {
    p.mark('x', 'skipped');
    expect(p.getStatus('x')).toBe('skipped');
  });

  it('saveProgress restores via getProgress', () => {
    p.saveProgress('tour1', 'step3', 2);
    const prog = p.getProgress('tour1');
    expect(prog).not.toBeNull();
    expect(prog!.lastStepId).toBe('step3');
    expect(prog!.stepIndex).toBe(2);
  });

  it('getProgressIfValid respects TTL', () => {
    p.saveProgress('tour1', 'step2', 1);
    const shouldExist = p.getProgressIfValid('tour1', 100000);
    expect(shouldExist).not.toBeNull();
  });

  it('getProgressIfValid returns null after TTL expires', () => {
    p.saveProgress('tour1', 'step2', 1);
    const expired = p.getProgressIfValid('tour1', -1);
    expect(expired).toBeNull();
  });

  it('clearProgress removes progress entry', () => {
    p.saveProgress('tour1', 'step1', 0);
    p.clearProgress('tour1');
    expect(p.getProgress('tour1')).toBeNull();
  });

  it('mark clears associated progress', () => {
    p.saveProgress('tour1', 'step3', 2);
    p.mark('tour1', 'completed');
    expect(p.getProgress('tour1')).toBeNull();
  });
});
