import { type DismissibleOptions, type SurfaceHandle } from './shared';
import type { I18nResolver, StepContent } from '../types';
export interface AnnouncementOptions extends DismissibleOptions {
    title: string;
    content: StepContent;
    /** Show only once. Default true. */
    once?: boolean;
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    dismissible?: boolean;
    allowHtml?: boolean;
    locale?: string;
    i18nResolver?: I18nResolver;
    userId?: string;
    className?: string;
    onDismiss?: () => void;
}
export interface AnnouncementHandle extends SurfaceHandle {
    close: () => void;
}
/**
 * A centered modal for product announcements, framework-free.
 *
 * Shares the tour content model, so images, video, lists and code blocks render
 * through exactly the same path a step body does.
 */
export declare function createAnnouncement(options: AnnouncementOptions): AnnouncementHandle;
