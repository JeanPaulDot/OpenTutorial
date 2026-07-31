import { type ReactNode } from 'react';
import type { I18nResolver, KeyValueStorage, StepContent } from '../types';
export interface AnnouncementProps {
    /** Stable id — used to remember that it has been seen. */
    id: string;
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
    storage?: KeyValueStorage;
    keyPrefix?: string;
    locale?: string;
    i18nResolver?: I18nResolver;
    className?: string;
    children?: ReactNode;
    onDismiss?: () => void;
}
/**
 * A centered modal for product announcements and what's-new notices.
 *
 * Shares the tour content model, so images, video, lists and code blocks all
 * work here without a second rendering path.
 */
export declare function Announcement({ id, title, content, once, primaryAction, secondaryAction, dismissible, allowHtml, storage, keyPrefix, locale, i18nResolver, className, children, onDismiss, }: AnnouncementProps): import("react").JSX.Element | null;
