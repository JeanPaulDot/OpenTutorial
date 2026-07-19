import type { TutorialSpec } from '../types';

export type ChecklistStatus = 'pending' | 'in_progress' | 'completed';

export interface TourChecklistProps {
  specs: TutorialSpec[];
  getStatus: (id: string) => ChecklistStatus;
  onStart: (id: string) => void;
  className?: string;
  title?: string;
}

export function TourChecklist({
  specs,
  getStatus,
  onStart,
  className = '',
  title = 'Onboarding',
}: TourChecklistProps) {
  const completed = specs.filter((s) => getStatus(s.id) === 'completed').length;
  const pct = specs.length > 0 ? Math.round((completed / specs.length) * 100) : 0;

  return (
    <div className={`ot-checklist ${className}`}>
      {title && (
        <div className="ot-checklist-header">
          <h3 className="ot-checklist-title">{title}</h3>
          <span className="ot-checklist-count">{completed}/{specs.length}</span>
        </div>
      )}
      <div className="ot-checklist-bar-track">
        <div className="ot-checklist-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <ul className="ot-checklist-items">
        {specs.map((spec) => {
          const status: ChecklistStatus = getStatus(spec.id);
          const icon = status === 'completed' ? '✓' : status === 'in_progress' ? '◌' : '○';
          return (
            <li key={spec.id} className={`ot-checklist-item ot-checklist-item--${status}`}>
              <span className="ot-checklist-icon">{icon}</span>
              <div className="ot-checklist-info">
                <span className="ot-checklist-name">{typeof spec.title === 'string' ? spec.title : spec.title.key}</span>
                {spec.description && (
                  <span className="ot-checklist-desc">{typeof spec.description === 'string' ? spec.description : ''}</span>
                )}
              </div>
              {status !== 'completed' && (
                <button
                  className="ot-checklist-btn"
                  onClick={() => onStart(spec.id)}
                  disabled={status === 'in_progress'}
                >
                  {status === 'in_progress' ? 'Continue' : 'Start'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
