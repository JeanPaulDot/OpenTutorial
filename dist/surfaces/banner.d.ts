import { type DismissibleOptions, type SurfaceHandle } from './shared';
export interface BannerOptions extends DismissibleOptions {
    /** Inline markdown: **bold**, *italic*, `code`, [links](https://…). */
    message: string;
    position?: 'top' | 'bottom';
    action?: {
        label: string;
        onClick: () => void;
    };
    dismissible?: boolean;
    /** Re-show this long after dismissal. Omit to dismiss permanently. */
    resurfaceAfter?: number;
    userId?: string;
    className?: string;
    onDismiss?: () => void;
}
export interface BannerHandle extends SurfaceHandle {
    /** Swap the message without rebuilding the banner. */
    setMessage: (message: string) => void;
    dismiss: () => void;
}
/**
 * A persistent announcement bar, framework-free.
 *
 * Hidden until persistence has hydrated, so a dismissed banner never flashes
 * on screen while an async storage adapter is still loading.
 */
export declare function createBanner(options: BannerOptions): BannerHandle;
