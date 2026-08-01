import { type SurfaceHandle } from './shared';
import type { TourController } from './controller';
import type { I18nResolver, TutorialSpec } from '../types';
export interface ResourceLink {
    label: string;
    href: string;
    description?: string;
}
export interface ResourceCenterOptions {
    layer: TourController;
    /** Defaults to every spec registered on the layer. */
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
    container?: HTMLElement | null;
    className?: string;
}
export interface ResourceCenterHandle extends SurfaceHandle {
    open: () => void;
    close: () => void;
    /** Set the search query programmatically. */
    search: (query: string) => void;
    refresh: () => void;
}
/**
 * Help hub: a searchable list of every available tour plus custom links.
 *
 * This is what makes one-shot onboarding safe to dismiss — there is always a
 * way back into guidance the user waved away.
 */
export declare function createResourceCenter(options: ResourceCenterOptions): ResourceCenterHandle;
