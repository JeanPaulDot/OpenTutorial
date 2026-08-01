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
/**
 * Assign `unit` to one of `variants`.
 *
 * Returns `null` when the unit falls in the holdout, or when there are no
 * variants to assign.
 */
export declare function assignVariant<T extends string>(experiment: string, unit: string, variants: Array<VariantInput<T>>, opts?: AssignOptions): T | null;
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
export declare function assignAll(unit: string, experiments: Record<string, VariantInput[] | {
    variants: VariantInput[];
    holdout?: number;
}>): Record<string, string | null>;
