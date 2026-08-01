import { type SurfaceHandle } from './shared';
export type SurveyKind = 'nps' | 'rating' | 'choice' | 'text';
export interface SurveyResponse {
    surveyId: string;
    kind: SurveyKind;
    score?: number;
    choice?: string;
    comment?: string;
    submittedAt: number;
}
export interface SurveyOptions {
    id: string;
    kind?: SurveyKind;
    question: string;
    /** Options for `kind: 'choice'`. */
    options?: string[];
    /** End labels for `nps` / `rating`. */
    lowLabel?: string;
    highLabel?: string;
    /** Ask for a written reason once a score is picked. */
    followUp?: string;
    submitLabel?: string;
    dismissLabel?: string;
    thanksMessage?: string;
    container?: HTMLElement | null;
    className?: string;
    onSubmit: (response: SurveyResponse) => void;
    onDismiss?: () => void;
}
export interface SurveyHandle extends SurfaceHandle {
    /** Current answer, before submission. */
    getResponse: () => Omit<SurveyResponse, 'submittedAt'>;
    reset: () => void;
}
/**
 * In-app survey — NPS (0–10), rating (1–5), single choice, or free text.
 *
 * Transport-agnostic on purpose: `onSubmit` hands you the response and you
 * decide where it goes, so this works with any backend or analytics pipeline.
 */
export declare function createSurvey(options: SurveyOptions): SurveyHandle;
