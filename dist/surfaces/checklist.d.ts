import { type SurfaceHandle } from './shared';
import type { TourController } from './controller';
import type { I18nResolver, TutorialSpec } from '../types';
export type ChecklistStatus = 'pending' | 'in_progress' | 'completed';
export interface ChecklistOptions {
    layer: TourController;
    /** Defaults to every spec registered on the layer. */
    specs?: TutorialSpec[];
    /** Override the derived status. Omit to read it from persisted state. */
    getStatus?: (id: string) => ChecklistStatus;
    onStart?: (id: string) => void;
    title?: string;
    startLabel?: string;
    runningLabel?: string;
    /** Dock bottom-right as a floating card. */
    floating?: boolean;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    /** Hide entirely once every item is done. */
    hideWhenComplete?: boolean;
    locale?: string;
    i18nResolver?: I18nResolver;
    container?: HTMLElement | null;
    className?: string;
    onComplete?: () => void;
}
export interface ChecklistHandle extends SurfaceHandle {
    /** Re-derive every status and repaint. Called automatically on tour events. */
    refresh: () => void;
    setCollapsed: (collapsed: boolean) => void;
    getProgress: () => {
        completed: number;
        total: number;
        percent: number;
    };
}
/**
 * Onboarding checklist, framework-free.
 *
 * Status comes from persisted tour state by default, and the list repaints on
 * every tour event — so completing a tour ticks its row without the host
 * wiring up a single subscription.
 */
export declare function createChecklist(options: ChecklistOptions): ChecklistHandle;
