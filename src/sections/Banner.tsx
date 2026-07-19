import { useTour } from '../core/adapters/react';

export default function Banner() {
  const { start } = useTour();

  return (
    <section
      data-tour="welcome-banner"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#171726] via-[#232043] to-[#3d3290] p-6 text-white sm:p-8"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, #8b7bff 0%, transparent 65%)' }}
      />
      <div className="relative max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          TUTORIALLAYER v0.1 — 5 TOURS LIVE
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          In-app tutorials that write themselves.
        </h1>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-slate-300">
          This dashboard is a host app. The tours you see are <strong className="text-white">JSON specs</strong> —
          validated against a strict schema, rendered by a dependency-free engine, with <strong className="text-white">spotlight</strong>,
          <strong className="text-white"> hotspot</strong>, and <strong className="text-white">beacon</strong> display modes.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11.5px] text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">spotlight</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">hotspot</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">beacon</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">i18n</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">checklist</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">resume</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => start('welcome')}
            className="rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-[#232043] shadow transition hover:bg-slate-100"
          >
            Replay welcome tour
          </button>
          <button
            onClick={() => start('hotspot-demo')}
            className="rounded-lg border border-white/25 bg-white/5 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-white/10"
          >
            Try hotspot mode
          </button>
          <button
            onClick={() => document.querySelector("[data-tour='playground']")?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="rounded-lg border border-white/25 bg-white/5 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-white/10"
          >
            Spec playground
          </button>
        </div>
      </div>
    </section>
  );
}
