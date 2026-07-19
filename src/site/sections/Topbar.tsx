import { useNavigate } from 'react-router';
import { useTour } from '../../core/adapters/react';
import { Switch } from '../components/ui/switch';

export default function Topbar() {
  const navigate = useNavigate();
  const { context, setContext } = useTour();
  const isPro = context.plan === 'pro';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6d5cff] to-[#9d8bff] text-xs font-bold text-white">
            P
          </div>
          <span className="text-sm font-semibold">Pulseboard</span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mr-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
        >
          ← Home
        </button>

        <div data-tour="search" className="relative hidden w-full max-w-xs sm:block">
          <input
            placeholder="Search reports, customers…"
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-10 text-[13px] outline-none transition focus:border-[#6d5cff] focus:bg-white focus:ring-2 focus:ring-[#6d5cff]/20"
          />
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">⌕</span>
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 text-[10px] text-slate-400">/</kbd>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
            <span className={isPro ? 'text-slate-400' : 'text-slate-800'}>Free</span>
            <Switch
              checked={isPro}
              onCheckedChange={(v) => setContext({ plan: v ? 'pro' : 'free' })}
              aria-label="Toggle Pro plan (tour context)"
            />
            <span className={isPro ? 'font-semibold text-[#6d5cff]' : 'text-slate-400'}>Pro</span>
          </label>

          {isPro ? (
            <span className="hidden rounded-full bg-[#6d5cff]/10 px-3 py-1.5 text-[12px] font-semibold text-[#6d5cff] sm:block">
              Pro active
            </span>
          ) : (
            <button
              data-tour="upgrade"
              className="hidden rounded-lg bg-gradient-to-r from-[#6d5cff] to-[#8b7bff] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm transition hover:brightness-110 sm:block"
            >
              Upgrade to Pro
            </button>
          )}

          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-center text-[12px] font-bold leading-8 text-white">
            AK
          </div>
        </div>
      </div>
    </header>
  );
}
