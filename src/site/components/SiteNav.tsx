import { useNavigate } from 'react-router';

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Modes', href: '#modes' },
  { label: 'Playground', href: '#playground' },
  { label: 'Compare', href: '#compare' },
];

export default function SiteNav() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6d5cff] to-[#9d8bff] text-[13px] font-bold text-white shadow-sm">
            OT
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-900">
            OpenTutorials
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate-500 transition hover:text-slate-900"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/JeanPaulDot/OpenTutorial"
            className="hidden text-[14px] font-medium text-slate-500 transition hover:text-slate-900 sm:block"
          >
            GitHub
          </a>
          <button
            onClick={() => navigate('/demo')}
            className="rounded-lg bg-slate-900 px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-slate-700"
          >
            Demo →
          </button>
        </div>
      </nav>
    </header>
  );
}
