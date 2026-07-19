import { useEffect, useState } from 'react';
import type { TourEvent } from '@opentutorial/core';

const CHIP: Record<string, string> = {
  started: 'bg-indigo-50 text-indigo-600',
  'step-shown': 'bg-sky-50 text-sky-600',
  'step-hidden': 'bg-slate-100 text-slate-500',
  skipped: 'bg-amber-50 text-amber-600',
  completed: 'bg-emerald-50 text-emerald-600',
  error: 'bg-rose-50 text-rose-600',
};

export default function EventLog() {
  const [events, setEvents] = useState<TourEvent[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<TourEvent>).detail;
      setEvents((prev) => [...prev.slice(-39), detail]);
    };
    window.addEventListener('opentutorial', handler);
    return () => window.removeEventListener('opentutorial', handler);
  }, []);

  return (
    <section data-tour="event-log" className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-900">Event stream</h2>
        {events.length > 0 && (
          <button onClick={() => setEvents([])} className="text-[11px] font-medium text-slate-400 hover:text-slate-700">
            Clear
          </button>
        )}
      </div>
      <p className="mb-3 text-[11.5px] text-slate-500">
        Every engine event, ready to pipe into analytics via <code className="rounded bg-slate-100 px-1 text-slate-600">onEvent</code>.
      </p>
      <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
        {events.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-200 p-3 text-center text-[11.5px] text-slate-400">
            Waiting for tour events… start a tour.
          </p>
        )}
        {[...events].reverse().map((e, i) => (
          <div key={`${e.timestamp}-${i}`} className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px]">
            <span className={`rounded-full px-1.5 py-0.5 font-semibold ${CHIP[e.type] ?? 'bg-slate-100 text-slate-500'}`}>
              {e.type}
            </span>
            <span className="font-medium text-slate-700">{e.tourId}</span>
            {e.stepId && <span className="truncate text-slate-400">· {e.stepId}</span>}
            <span className="ml-auto shrink-0 text-slate-400">
              {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
