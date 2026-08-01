/**
 * Variant assignment for A/B testing tours.
 *
 * Deliberately tiny: this assigns a bucket and nothing else. It does not collect
 * results, compute significance, or talk to a service — you already have an
 * analytics pipeline, and a tour library guessing at statistics would be worse
 * than the one you have.
 *
 * Assignment is a stable hash of `${experiment}:${unit}`, so:
 *   - the same user gets the same variant on every device, with no storage
 *   - two experiments never correlate, because the experiment id salts the hash
 *   - assignment works before persistence has hydrated, and offline
 *
 * ```ts
 * const variant = assignVariant('onboarding-length', userId, ['short', 'long']);
 * layer.setContext({ variant });
 * ```
 * ```jsonc
 * { "audience": { "showIf": "variant === 'short'" } }
 * ```
 */

import { sampleValue } from './analytics/sampling';

export interface VariantSpec<T extends string = string> {
  /** Variant name. */
  name: T;
  /** Relative weight. Defaults to 1 — equal split. */
  weight?: number;
}

export type VariantInput<T extends string = string> = T | VariantSpec<T>;

export interface AssignOptions {
  /**
   * Fraction of units excluded from the experiment entirely, 0–1.
   * Holdouts receive `null` and should see no tour at all — the control group
   * for "does this tour help?", which an A/B split between two tours cannot answer.
   */
  holdout?: number;
}

function normalize<T extends string>(variants: Array<VariantInput<T>>): Array<Required<VariantSpec<T>>> {
  return variants.map((v) =>
    (typeof v === 'string' ? { name: v, weight: 1 } : { name: v.name, weight: v.weight ?? 1 }));
}

/**
 * Assign `unit` to one of `variants`.
 *
 * Returns `null` when the unit falls in the holdout, or when there are no
 * variants to assign.
 */
export function assignVariant<T extends string>(
  experiment: string,
  unit: string,
  variants: Array<VariantInput<T>>,
  opts: AssignOptions = {},
): T | null {
  const pool = normalize(variants).filter((v) => v.weight > 0);
  if (pool.length === 0) return null;

  // A separate hash from the bucketing one, so the holdout decision and the
  // variant decision are independent rather than both keyed off the same value.
  const holdout = opts.holdout ?? 0;
  if (holdout > 0 && sampleValue(`holdout:${experiment}:${unit}`) < holdout) return null;

  const total = pool.reduce((sum, v) => sum + v.weight, 0);
  const point = sampleValue(`${experiment}:${unit}`) * total;

  let cursor = 0;
  for (const variant of pool) {
    cursor += variant.weight;
    if (point < cursor) return variant.name;
  }
  return pool[pool.length - 1].name;
}

/**
 * Assign several experiments at once, ready to spread into the tour context.
 *
 * ```ts
 * const context = assignAll(userId, {
 *   'onboarding-length': ['short', 'long'],
 *   'cta-copy': [{ name: 'control', weight: 3 }, { name: 'bold', weight: 1 }],
 * });
 * // → { 'onboarding-length': 'long', 'cta-copy': 'control' }
 * ```
 */
export function assignAll(
  unit: string,
  experiments: Record<string, VariantInput[] | { variants: VariantInput[]; holdout?: number }>,
): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const [name, config] of Object.entries(experiments)) {
    const { variants, holdout } = Array.isArray(config)
      ? { variants: config, holdout: undefined }
      : config;
    out[name] = assignVariant(name, unit, variants, { holdout });
  }
  return out;
}
