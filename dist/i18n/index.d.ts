import type { I18nContent, I18nResolver } from '../types';
export declare function interpolate(template: string, params?: Record<string, unknown>): string;
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
