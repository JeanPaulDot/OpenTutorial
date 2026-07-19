const STATS = [
  { label: 'Monthly revenue', value: '$48,290', delta: '+12.4%', up: true, spark: [22, 28, 25, 34, 31, 40, 44, 48] },
  { label: 'Active users', value: '8,142', delta: '+3.1%', up: true, spark: [60, 62, 58, 66, 71, 69, 76, 81] },
  { label: 'Conversion', value: '3.42%', delta: '-0.4%', up: false, spark: [40, 44, 41, 38, 42, 37, 35, 34] },
];

function Spark({ points, up }: { points: number[]; up: boolean }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const norm = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 96;
    const y = 28 - ((p - min) / (max - min || 1)) * 24;
    return `${x},${y}`;
  });
  return (
    <svg width="96" height="30" className="overflow-visible">
      <polyline
        points={norm.join(' ')}
        fill="none"
        stroke={up ? '#6d5cff' : '#f43f5e'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StatsRow() {
  return (
    <div data-tour="stats" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STATS.map((s) => (
        <div key={s.label} className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-medium text-slate-500">{s.label}</div>
              <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{s.value}</div>
            </div>
            <Spark points={s.spark} up={s.up} />
          </div>
          <div
            className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              s.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {s.delta} vs last week
          </div>
        </div>
      ))}
    </div>
  );
}
