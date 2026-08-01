'use client';

import { useState } from 'react';

// One definition, shared with the framework-free `createSurvey`.
export type { SurveyKind, SurveyResponse } from '../surfaces/survey';
import type { SurveyKind, SurveyResponse } from '../surfaces/survey';

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
export function Survey({
  id,
  kind = 'nps',
  question,
  options = [],
  lowLabel = 'Not likely',
  highLabel = 'Very likely',
  followUp,
  submitLabel = 'Submit',
  thanksMessage = 'Thanks for the feedback!',
  className = '',
  onSubmit,
  onDismiss,
}: SurveyProps) {
  const [score, setScore] = useState<number | null>(null);
  const [choice, setChoice] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className={`ot-survey ${className}`.trim()}>
        <p className="ot-survey-thanks">{thanksMessage}</p>
      </div>
    );
  }

  const scale = kind === 'nps'
    ? Array.from({ length: 11 }, (_, i) => i)
    : kind === 'rating'
      ? [1, 2, 3, 4, 5]
      : null;

  const canSubmit =
    (kind === 'nps' || kind === 'rating') ? score !== null
      : kind === 'choice' ? choice !== null
        : comment.trim().length > 0;

  const submit = (): void => {
    if (!canSubmit) return;
    onSubmit({
      surveyId: id,
      kind,
      score: score ?? undefined,
      choice: choice ?? undefined,
      comment: comment.trim() || undefined,
      submittedAt: Date.now(),
    });
    setDone(true);
  };

  return (
    <div className={`ot-survey ${className}`.trim()}>
      <p className="ot-survey-question" id={`ot-survey-q-${id}`}>{question}</p>

      {scale && (
        <>
          <div className="ot-survey-scale" role="radiogroup" aria-labelledby={`ot-survey-q-${id}`}>
            {scale.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={score === n}
                className={`ot-survey-score${score === n ? ' ot-survey-score--selected' : ''}`}
                onClick={() => setScore(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="ot-survey-labels">
            <span>{lowLabel}</span>
            <span>{highLabel}</span>
          </div>
        </>
      )}

      {kind === 'choice' && (
        <div className="ot-survey-options" role="radiogroup" aria-labelledby={`ot-survey-q-${id}`}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={choice === option}
              className={`ot-survey-option${choice === option ? ' ot-survey-option--selected' : ''}`}
              onClick={() => setChoice(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {(kind === 'text' || (followUp && (score !== null || choice !== null))) && (
        <textarea
          className="ot-survey-textarea"
          placeholder={kind === 'text' ? question : followUp}
          aria-label={kind === 'text' ? question : (followUp ?? 'Additional comments')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      )}

      <div className="ot-footer">
        {onDismiss ? (
          <button type="button" className="ot-btn ot-btn-ghost" onClick={onDismiss}>
            Not now
          </button>
        ) : <span />}
        <button type="button" className="ot-btn ot-btn-primary" disabled={!canSubmit} onClick={submit}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
