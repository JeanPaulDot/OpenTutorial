'use client';

import { useMemo, useState } from 'react';
import { useTour } from '../adapters/react';
import { resolveText } from '../i18n';
import type { I18nContent, I18nResolver, TutorialSpec } from '../types';

// One definition, shared with the framework-free `createChecklist`.
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
export function TourChecklist({
  specs: specsProp,
  getStatus: getStatusProp,
  onStart,
  className = '',
  title = 'Onboarding',
  floating = false,
  collapsible = false,
  defaultCollapsed = false,
  hideWhenComplete = false,
  locale,
  i18nResolver,
  onComplete,
}: TourChecklistProps) {
  const tour = useTour();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const specs = specsProp ?? tour.specs;
  const activeLocale = locale ?? 'en';

  const getStatus = useMemo(() => {
    if (getStatusProp) return getStatusProp;
    return (id: string): ChecklistStatus => {
      if (tour.activeId === id) return 'in_progress';
      return tour.hasSeen(id) ? 'completed' : 'pending';
    };
    // `activeId` is the reactive input here — recompute whenever it changes.
  }, [getStatusProp, tour]);

  const statuses = specs.map((s) => getStatus(s.id));
  const completed = statuses.filter((s) => s === 'completed').length;
  const pct = specs.length > 0 ? Math.round((completed / specs.length) * 100) : 0;
  const allDone = specs.length > 0 && completed === specs.length;

  if (allDone && hideWhenComplete) {
    onComplete?.();
    return null;
  }

  const text = (content: I18nContent | undefined): string =>
    (content === undefined ? '' : resolveText(content, activeLocale, i18nResolver, tour.context));

  const start = (id: string): void => {
    if (onStart) onStart(id);
    else tour.start(id);
  };

  const classes = [
    'ot-checklist',
    floating ? 'ot-checklist--floating' : '',
    collapsed ? 'ot-checklist--collapsed' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {title && (
        <div className="ot-checklist-header">
          <h3 className="ot-checklist-title">{title}</h3>
          <span className="ot-checklist-count">{completed}/{specs.length}</span>
          {collapsible && (
            <button
              type="button"
              className="ot-checklist-toggle"
              aria-expanded={!collapsed}
              aria-label={collapsed ? 'Expand checklist' : 'Collapse checklist'}
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? '▸' : '▾'}
            </button>
          )}
        </div>
      )}

      <div
        className="ot-checklist-bar-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${completed} of ${specs.length} complete`}
      >
        <div className="ot-checklist-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <ul className="ot-checklist-items">
        {specs.map((spec, i) => {
          const status = statuses[i];
          const icon = status === 'completed' ? '✓' : status === 'in_progress' ? '◌' : '○';
          const description = text(spec.description);
          return (
            <li key={spec.id} className={`ot-checklist-item ot-checklist-item--${status}`}>
              <span className="ot-checklist-icon" aria-hidden="true">{icon}</span>
              <div className="ot-checklist-info">
                <span className="ot-checklist-name">{text(spec.title)}</span>
                {description && <span className="ot-checklist-desc">{description}</span>}
              </div>
              {status !== 'completed' && (
                <button
                  type="button"
                  className="ot-checklist-btn"
                  onClick={() => start(spec.id)}
                  disabled={status === 'in_progress'}
                >
                  {status === 'in_progress' ? 'Running' : 'Start'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
