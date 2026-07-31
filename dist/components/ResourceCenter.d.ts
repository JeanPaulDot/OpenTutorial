import type { I18nResolver, TutorialSpec } from '../types';
export interface ResourceLink {
    label: string;
    href: string;
    description?: string;
}
export interface ResourceCenterProps {
    /** Defaults to every spec on the provider. */
    specs?: TutorialSpec[];
    /** Extra destinations — docs, support, changelog. */
    links?: ResourceLink[];
    title?: string;
    searchPlaceholder?: string;
    /** Render as a floating panel with its own launcher button. */
    floating?: boolean;
    launcherGlyph?: string;
    emptyMessage?: string;
    locale?: string;
    i18nResolver?: I18nResolver;
    className?: string;
}
/**
 * Help hub: a searchable list of every available tour plus custom links.
 *
 * Gives users a way back into guidance they dismissed, which is what makes
 * one-shot onboarding tours safe to dismiss in the first place.
 */
export declare function ResourceCenter({ specs: specsProp, links, title, searchPlaceholder, floating, launcherGlyph, emptyMessage, locale, i18nResolver, className, }: ResourceCenterProps): import("react").JSX.Element;
