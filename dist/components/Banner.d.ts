import type { KeyValueStorage } from '../types';
export interface BannerProps {
    /** Stable id — used to remember the dismissal. */
    id: string;
    /** Inline markdown: **bold**, *italic*, `code`, [links](https://…). */
    message: string;
    position?: 'top' | 'bottom';
    action?: {
        label: string;
        onClick: () => void;
    };
    dismissible?: boolean;
    /** Re-show after this many ms. Omit to dismiss permanently. */
    resurfaceAfter?: number;
    storage?: KeyValueStorage;
    keyPrefix?: string;
    className?: string;
    onDismiss?: () => void;
}
/**
 * A persistent announcement bar. Dismissal is stored alongside tour state, so a
 * banner the user closed does not come back on the next page load.
 */
export declare function Banner({ id, message, position, action, dismissible, resurfaceAfter, storage, keyPrefix, className, onDismiss, }: BannerProps): import("react").JSX.Element | null;
