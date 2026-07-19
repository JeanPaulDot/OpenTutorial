import { useTour } from '@opentutorial/core/adapters/react';
import { TourChecklist } from '@opentutorial/core/components';

const TOUR_BADGES: Record<string, { tag: string; tagClass: string }> = {
  welcome: { tag: 'spotlight', tagClass: 'bg-indigo-50 text-indigo-600' },
  'export-report': { tag: 'target-click', tagClass: 'bg-sky-50 text-sky-600' },
  customize: { tag: 'branching', tagClass: 'bg-amber-50 text-amber-600' },
  'hotspot-demo': { tag: 'hotspot', tagClass: 'bg-emerald-50 text-emerald-600' },
  'i18n-demo': { tag: 'i18n', tagClass: 'bg-rose-50 text-rose-600' },
};

export default function ToursPanel() {
  const { specs, start, activeId, hasSeen, resetTours, resetProgress } = useTour();

  return (
    <section data-tour="tours-panel" className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-900">Tours</h2>
        <button
          onClick={() => resetTours()}
          className="text-[11px] font-medium text-slate-400 transition hover:text-[#6d5cff]"
          title="Clear seen-state and saved progress"
        >
          Reset state
        </button>
      </div>

      <div className="mb-4">
        <TourChecklist
          specs={specs}
          getStatus={(id) =>
            hasSeen(id) ? 'completed' : activeId === id ? 'in_progress' : 'pending'
          }
          onStart={(id) => start(id)}
          title=""
        />
      </div>

      <div className="space-y-2.5">
        {specs.map((s) => {
          const running = activeId === s.id;
          const badge = TOUR_BADGES[s.id];
          return (
            <div
              key={s.id}
              className={`rounded-lg border p-3 transition ${
                running ? 'border-[#6d5cff]/50 bg-[#6d5cff]/5' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-slate-800">{typeof s.title === 'string' ? s.title : s.title.key}</span>
                {badge && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold ${badge.tagClass}`}>
                    {badge.tag}
                  </span>
                )}
                {hasSeen(s.id) && !running && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">seen</span>
                )}
                {running && (
                  <span className="rounded-full bg-[#6d5cff] px-1.5 py-0.5 text-[10px] font-semibold text-white">live</span>
                )}
              </div>
              <button
                onClick={() => start(s.id)}
                disabled={running}
                className="mt-2 rounded-md bg-slate-900 px-2.5 py-1 text-[11.5px] font-semibold text-white transition hover:bg-[#6d5cff] disabled:opacity-40"
              >
                {running ? 'Running…' : `Start (${s.steps.length} steps)`}
              </button>
              {hasSeen(s.id) && !running && (
                <button
                  onClick={() => { resetProgress(); start(s.id); }}
                  className="mt-2 ml-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-[11.5px] font-semibold text-slate-500 transition hover:border-[#6d5cff] hover:text-[#6d5cff]"
                  title="Clear saved progress and replay from the first step"
                >
                  Replay
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        Deep links: <code className="rounded bg-slate-100 px-1 text-slate-600">?tour=hotspot-demo</code> ·
        <code className="rounded bg-slate-100 px-1 text-slate-600">?tour=customize</code>
      </p>
    </section>
  );
}
