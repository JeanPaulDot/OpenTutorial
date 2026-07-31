export type SurveyKind = 'nps' | 'rating' | 'choice' | 'text';
export interface SurveyResponse {
    surveyId: string;
    kind: SurveyKind;
    score?: number;
    choice?: string;
    comment?: string;
    submittedAt: number;
}
export interface SurveyProps {
    id: string;
    kind?: SurveyKind;
    question: string;
    /** Options for `kind: 'choice'`. */
    options?: string[];
    /** End labels for `nps` / `rating`. */
    lowLabel?: string;
    highLabel?: string;
    /** Ask for a written reason after a score is picked. */
    followUp?: string;
    submitLabel?: string;
    thanksMessage?: string;
    className?: string;
    onSubmit: (response: SurveyResponse) => void;
    onDismiss?: () => void;
}
/**
 * In-app survey: NPS (0–10), star-style rating (1–5), single choice, or free text.
 *
 * Deliberately transport-agnostic — `onSubmit` hands you the response and you
 * decide where it goes, so this works with any backend or analytics pipeline.
 */
export declare function Survey({ id, kind, question, options, lowLabel, highLabel, followUp, submitLabel, thanksMessage, className, onSubmit, onDismiss, }: SurveyProps): import("react").JSX.Element;
