const FEATURES = [
  {
    icon: '◇',
    title: 'Spec-driven, not code-driven',
    body: 'Every tour is a plain JSON object. AI can write them, you can edit them, and a bad spec can never crash your app.',
  },
  {
    icon: '◈',
    title: 'Zero runtime dependencies',
    body: 'The core engine ships standalone. React is a peer dependency, and the vanilla adapter works without it at all.',
  },
  {
    icon: '✦',
    title: 'Three display modes',
    body: 'Spotlight for structured flows, hotspot for non-blocking hints, beacon for a quiet "look here" pulse.',
  },
  {
    icon: '✓',
    title: '24+ schema checks',
    body: 'Unknown keys, duplicate ids, dangling next refs, oversized copy — every violation is reported with its path.',
  },
  {
    icon: '⇄',
    title: 'Resume across sessions',
    body: 'Users pick up where they left off. Progress is stored in localStorage and expires on a TTL you control.',
  },
  {
    icon: '⌘',
    title: 'i18n & analytics ready',
    body: 'Key-based localization with a resolver you bring. First-class adapters for PostHog, Mixpanel, Amplitude, GA4.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="home-eyebrow">Why OpenTutorials</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          An engine, not a script tag
        </h2>
        <p className="mt-4 text-slate-500">
          Tour logic lives in a validated spec, not tangled in your component tree. That separation
          is what makes it embeddable, testable, and safe to hand to AI.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="home-featurecard group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-300"
          >
            <div className="home-featureicon flex h-10 w-10 items-center justify-center rounded-xl bg-[#6d5cff]/10 text-[#6d5cff]">
              {f.icon}
            </div>
            <h3 className="mt-4 text-[16px] font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-500">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
