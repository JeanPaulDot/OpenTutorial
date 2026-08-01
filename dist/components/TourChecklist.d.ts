import type { I18nResolver, TutorialSpec } from '../types';
export type { ChecklistStatus } from '../surfaces/checklist';
import type { ChecklistStatus } from '../surfaces/checklist';
export interface TourChecklistProps {
    /** Defaults to every spec registered on the provider. */
    specs?: TutorialSpec[];
    /** Override the derived status. Omit to read it from persisted state. */
    getStatus?: (id: string) => ChecklistStatus;
    onStart?: (id: string) => void;
    className?: string;
    title?: string;
    /** Dock bottom-right as a floating card. */
    floating?: boolean;
    /** Show a collapse toggle. */
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    /** Hide entirely once every item is done. */
    hideWhenComplete?: boolean;
    locale?: string;
    i18nResolver?: I18nResolver;
    onComplete?: () => void;
}
/**
 * Onboarding checklist.
 *
 * Status is derived from persisted tour state by default — v0.1 required the
 * host to compute it, which meant every consumer reimplemented the same lookup.
 * i18n content is resolved properly rather than falling back to the raw key.
 */
export declare function TourChecklist({ specs: specsProp, getStatus: getStatusProp, onStart, className, title, floating, collapsible, defaultCollapsed, hideWhenComplete, locale, i18nResolver, onComplete, }: TourChecklistProps): import("react").JSX.Element | null;
