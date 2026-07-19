export default function SiteFooter() {
  const cols = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Display modes', href: '#modes' },
        { label: 'Live demo', href: '/demo' },
        { label: 'Spec playground', href: '#playground' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { label: 'GitHub', href: 'https://github.com/JeanPaulDot/OpenTutorial' },
        { label: 'Quick start', href: 'https://github.com/JeanPaulDot/OpenTutorial#readme' },
        { label: 'Schema spec', href: 'https://github.com/JeanPaulDot/OpenTutorial#spec-authoring' },
        { label: 'Analytics', href: 'https://github.com/JeanPaulDot/OpenTutorial#analytics' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'MIT License', href: 'https://github.com/JeanPaulDot/OpenTutorial/blob/main/LICENSE' },
        { label: 'Contributing', href: 'https://github.com/JeanPaulDot/OpenTutorial/blob/main/CONTRIBUTING.md' },
        { label: 'Changelog', href: 'https://github.com/JeanPaulDot/OpenTutorial/blob/main/CHANGELOG.md' },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6d5cff] to-[#9d8bff] text-[13px] font-bold text-white">
                OT
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-slate-900">
                OpenTutorials
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-slate-500">
              Spec-driven in-app tour engine. Zero runtime dependencies, three display modes,
              validated JSON — built to ship.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-[13px] font-semibold text-slate-900">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[13px] text-slate-500 transition hover:text-slate-900"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <span className="text-[13px] text-slate-400">
            © {new Date().getFullYear()} OpenTutorials · MIT Licensed
          </span>
          <span className="text-[13px] text-slate-400">
            Built dependency-free. Validated at runtime.
          </span>
        </div>
      </div>
    </footer>
  );
}
