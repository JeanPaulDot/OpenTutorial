const ROWS = [
  { feat: 'Runtime dependencies', ot: '0', a: '2', b: '1', c: '1' },
  { feat: 'Bundle (gzip)', ot: '12.5 KB', a: '18 KB', b: '22 KB', c: '16 KB' },
  { feat: 'Display modes', ot: '3', a: '1', b: '1', c: '1' },
  { feat: 'Schema validation', ot: '24 checks', a: '—', b: '—', c: '—' },
  { feat: 'Hotspot / Beacon', ot: '✓', a: '✗', b: '✗', c: '✗' },
  { feat: 'Vanilla JS adapter', ot: '✓', a: '✗', b: '✗', c: '✗' },
  { feat: 'i18n', ot: '✓', a: '✗', b: '✗', c: '✓' },
  { feat: 'Resume progress', ot: '✓', a: '✗', b: '✗', c: '✗' },
  { feat: 'React 19', ot: '✓', a: '✗', b: '✓', c: '✓' },
];

const HEADERS = ['OpenTutorials', 'Reactour', 'Shepherd', 'Intro.js'];

function Cell({ value, highlight }: { value: string; highlight: boolean }) {
  if (highlight) {
    return <span className="font-semibold text-slate-900">{value}</span>;
  }
  const isDash = value === '—' || value === '✗';
  return (
    <span className={isDash ? 'text-slate-300' : 'text-slate-400'}>{value}</span>
  );
}

export default function Comparison() {
  return (
    <section id="compare" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="home-eyebrow">The field</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Built to be embedded
        </h2>
        <p className="mt-4 text-slate-500">
          Most tour libraries couple logic to the framework and ship dependencies. OpenTutorials
          stays out of your way.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-4 text-left text-[13px] font-medium text-slate-400">
                Capability
              </th>
              {HEADERS.map((h, i) => (
                <th
                  key={h}
                  className={`px-5 py-4 text-left text-[14px] ${
                    i === 0
                      ? 'font-semibold text-[#6d5cff]'
                      : 'font-medium text-slate-400'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, ri) => (
              <tr
                key={r.feat}
                className={ri % 2 ? 'bg-slate-50/50' : 'bg-white'}
              >
                <td className="px-5 py-3.5 text-slate-600">{r.feat}</td>
                <td className="home-col-ot px-5 py-3.5">
                  <Cell value={r.ot} highlight />
                </td>
                <td className="px-5 py-3.5">
                  <Cell value={r.a} highlight={false} />
                </td>
                <td className="px-5 py-3.5">
                  <Cell value={r.b} highlight={false} />
                </td>
                <td className="px-5 py-3.5">
                  <Cell value={r.c} highlight={false} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
