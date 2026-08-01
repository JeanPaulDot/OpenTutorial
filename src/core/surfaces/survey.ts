import { Disposers, attach, button, h, makeHandle, type SurfaceHandle } from './shared';

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
export function createSurvey(options: SurveyOptions): SurveyHandle {
  const {
    id, kind = 'nps', question, options: choices = [],
    lowLabel = 'Not likely', highLabel = 'Very likely', followUp,
    submitLabel = 'Submit', dismissLabel = 'Not now',
    thanksMessage = 'Thanks for the feedback!',
    container, className = '', onSubmit, onDismiss,
  } = options;

  const disposers = new Disposers();
  let score: number | null = null;
  let choice: string | null = null;

  const el = h('div', `ot-survey ${className}`.trim());

  const questionId = `ot-survey-q-${id}`;
  const questionEl = h('p', 'ot-survey-question', { text: question });
  questionEl.id = questionId;
  el.appendChild(questionEl);

  const scale = kind === 'nps'
    ? Array.from({ length: 11 }, (_, i) => i)
    : kind === 'rating' ? [1, 2, 3, 4, 5] : null;

  const scoreButtons: HTMLButtonElement[] = [];
  const choiceButtons: HTMLButtonElement[] = [];

  const textarea = h('textarea', 'ot-survey-textarea');
  textarea.placeholder = kind === 'text' ? question : (followUp ?? '');
  textarea.setAttribute('aria-label', kind === 'text' ? question : (followUp ?? 'Additional comments'));
  textarea.hidden = kind !== 'text';

  const submitBtn = h('button', 'ot-btn ot-btn-primary', { type: 'button', text: submitLabel });

  const refresh = (): void => {
    for (const btn of scoreButtons) {
      const selected = Number(btn.dataset.value) === score;
      btn.classList.toggle('ot-survey-score--selected', selected);
      btn.setAttribute('aria-checked', String(selected));
    }
    for (const btn of choiceButtons) {
      const selected = btn.dataset.value === choice;
      btn.classList.toggle('ot-survey-option--selected', selected);
      btn.setAttribute('aria-checked', String(selected));
    }
    // The follow-up only makes sense once there is something to follow up on.
    if (followUp && kind !== 'text') textarea.hidden = score === null && choice === null;

    const answered = (kind === 'nps' || kind === 'rating') ? score !== null
      : kind === 'choice' ? choice !== null
        : textarea.value.trim().length > 0;
    submitBtn.disabled = !answered;
  };

  if (scale) {
    const group = h('div', 'ot-survey-scale');
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-labelledby', questionId);
    for (const n of scale) {
      const btn = h('button', 'ot-survey-score', { type: 'button', text: String(n) });
      btn.dataset.value = String(n);
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.addEventListener('click', () => { score = n; refresh(); });
      scoreButtons.push(btn);
      group.appendChild(btn);
    }
    el.appendChild(group);

    const labels = h('div', 'ot-survey-labels');
    labels.appendChild(h('span', undefined, { text: lowLabel }));
    labels.appendChild(h('span', undefined, { text: highLabel }));
    el.appendChild(labels);
  }

  if (kind === 'choice') {
    const group = h('div', 'ot-survey-options');
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-labelledby', questionId);
    for (const option of choices) {
      const btn = h('button', 'ot-survey-option', { type: 'button', text: option });
      btn.dataset.value = option;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.addEventListener('click', () => { choice = option; refresh(); });
      choiceButtons.push(btn);
      group.appendChild(btn);
    }
    el.appendChild(group);
  }

  el.appendChild(textarea);
  textarea.addEventListener('input', refresh);

  const footer = h('div', 'ot-footer');
  if (onDismiss) footer.appendChild(button('ot-btn ot-btn-ghost', dismissLabel, onDismiss));
  else footer.appendChild(h('span'));
  footer.appendChild(submitBtn);
  el.appendChild(footer);

  const current = (): Omit<SurveyResponse, 'submittedAt'> => ({
    surveyId: id,
    kind,
    score: score ?? undefined,
    choice: choice ?? undefined,
    comment: textarea.value.trim() || undefined,
  });

  submitBtn.addEventListener('click', () => {
    if (submitBtn.disabled) return;
    onSubmit({ ...current(), submittedAt: Date.now() });
    el.replaceChildren(h('p', 'ot-survey-thanks', { text: thanksMessage }));
  });

  refresh();
  attach(el, container);

  return {
    ...makeHandle(el, disposers),
    getResponse: current,
    reset() {
      score = null;
      choice = null;
      textarea.value = '';
      refresh();
    },
  };
}
