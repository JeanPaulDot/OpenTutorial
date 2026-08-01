import type { I18nContent, I18nResolver } from '../types';
/**
 * Placeholder syntax inside `{{ … }}`:
 *
 *   {{name}}                                   → simple interpolation
 *   {{user.plan}}                              → dotted path
 *   {{count, plural, one {# tour} other {# tours}}}
 *
 * The plural form is a deliberately small subset of ICU MessageFormat: one
 * argument, the `plural` keyword, then `category {body}` pairs. `#` inside a
 * body is replaced with the locale-formatted count. Category selection uses
 * `Intl.PluralRules`, so Slavic `few`/`many`, Arabic `zero`/`two` and every
 * other CLDR category work without a rules table of our own.
 */
declare const PLURAL_CATEGORIES: readonly ["zero", "one", "two", "few", "many", "other"];
export type PluralCategory = (typeof PLURAL_CATEGORIES)[number];
export type PluralForms = Partial<Record<PluralCategory, string>>;
/**
 * Pick the plural form for `count`.
 *
 * Falls back to `other`, then to an empty string, so a message missing the
 * category a locale actually needs degrades instead of throwing.
 */
export declare function selectPlural(count: number, forms: PluralForms, locale?: string): string;
/**
 * Fill `{{…}}` placeholders from `params`.
 *
 * An unresolved placeholder is left verbatim rather than blanked, so a missing
 * value is visible in review instead of silently producing "Welcome, !".
 */
export declare function interpolate(template: string, params?: Record<string, unknown>, locale?: string): string;
export declare function resolveText(content: I18nContent, locale: string, resolver?: I18nResolver, params?: Record<string, unknown>): string;
/** Flat message map: `{ 'tour.title': 'Welcome' }`. */
export declare function createKeyResolver(messages: Record<string, string>): I18nResolver;
/** Per-locale maps, falling back "fr-CA" → "fr" → default. */
export declare function createLocaleResolver(messages: Record<string, Record<string, string>>, defaultLocale?: string): I18nResolver;
/** Default UI strings, overridable per locale through the resolver. */
export declare const DEFAULT_LABELS: {
    readonly next: "Next";
    readonly back: "Back";
    readonly done: "Done";
    readonly skip: "Skip tour";
};
export type LabelKey = keyof typeof DEFAULT_LABELS;
/** Resolves built-in button text via `opentutorial.<key>` message keys. */
export declare function resolveLabel(key: LabelKey, locale: string, resolver?: I18nResolver): string;
export declare function localeDirection(locale: string): 'ltr' | 'rtl';
export {};
