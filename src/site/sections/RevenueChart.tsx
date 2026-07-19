import { useState } from 'react';

const DATA: Record<string, number[]> = {
  '7d': [4200, 5100, 4700, 6300, 5900, 7100, 6800],
  '30d': [3200, 4100, 3800, 4500, 5200, 4900, 5600, 6100, 5800, 6400, 6200, 7100, 6900, 7400],
  '90d': [2800, 3400, 3100, 3900, 4200, 4700, 4400, 5100, 5500, 5300, 5900, 6200, 6600, 6400, 7000, 7300],
};

export default function RevenueChart() {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [exported, setExported] = useState(false);
  const values = DATA[range];
  const max = Math.max(...values);

  const onExport = () => {
    setExported(true);
    window.setTimeout(() => setExported(false), 2200);
  };

  return (
    <section data-tour="revenue-chart" className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">Revenue trend</h2>
          <p className="text-[12px] text-slate-500">Daily gross volume · USD</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 p-0.5">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
                  range === r ? 'bg-[#6d5cff] text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            data-tour="export-btn"
            onClick={onExport}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold shadow-sm transition ${
              exported
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-700'
            }`}
          >
            {exported ? '✓ Exported' : 'Export CSV'}
          </button>
        </div>
      </div>

      <div className="flex h-44 items-end gap-1.5 sm:gap-2.5">
        {values.map((v, i) => (
          <div key={`${range}-${i}`} className="group relative flex-1">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-[#6d5cff]/70 to-[#9d8bff] transition-all duration-300 group-hover:from-[#6d5cff] group-hover:to-[#7f6fff]"
              style={{ height: `${(v / max) * 160}px` }}
            />
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100">
              ${v.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
