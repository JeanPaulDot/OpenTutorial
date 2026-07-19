const MODES = [
  {
    tag: 'S',
    name: 'Spotlight',
    title: 'Full attention, guided flow',
    body: 'A dimmed backdrop with a cutout around the target. Progress dots, prev/next navigation, and a keyboard focus trap. The default for structured onboarding.',
    points: ['Backdrop + spotlight cutout', 'Progress + keyboard nav', 'flip-away positioning'],
  },
  {
    tag: 'H',
    name: 'Hotspot',
    title: 'A hint, not a wall',
    body: 'A pulsing dot with a tooltip and no backdrop. Users keep interacting with the page freely. Ideal for feature callouts and non-blocking guidance.',
    points: ['Pulsing dot + tooltip', 'Page stays interactive', 'scroll-aware placement'],
  },
  {
    tag: 'B',
    name: 'Beacon',
    title: 'Just enough signal',
    body: 'A tiny pulsing ring with no popover and no text. Enough to say "look here" when a new feature ships, and nothing that interrupts the flow.',
    points: ['Minimal indicator', 'No popover', 'auto-advances on click'],
  },
];

export default function ModeShowcase() {
  return (
    <section
      id="modes"
      className="relative scroll-mt-20 border-y border-slate-100 bg-gradient-to-b from-white to-slate-50/60 py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="home-eyebrow">Display modes</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            One spec, three levels of presence
          </h2>
          <p className="mt-4 text-slate-500">
            Change a single field to switch how intrusive a tour feels. The same step format works
            everywhere.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {MODES.map((m) => (
            <div
              key={m.name}
              className="home-modecard relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-7"
            >
              <div className="flex items-center gap-3">
                <span className="home-modetag flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-[14px] font-bold text-white">
                  {m.tag}
                </span>
                <span className="text-[15px] font-semibold text-slate-900">{m.name}</span>
              </div>
              <h3 className="mt-4 text-[17px] font-semibold text-slate-900">{m.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-500">{m.body}</p>
              <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                {m.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[13px] text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6d5cff]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
