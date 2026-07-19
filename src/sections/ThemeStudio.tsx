import { useState } from 'react';
import { useTour } from '../core/adapters/react';
import type { ThemeOverrides } from '../core';

const PRESETS: Array<{ name: string; swatch: string; theme: ThemeOverrides }> = [
  { name: 'Violet', swatch: '#6d5cff', theme: { accent: '#6d5cff', bg: '#ffffff', fg: '#181822', muted: '#67677c', backdrop: 'rgba(12,12,22,0.55)' } },
  { name: 'Emerald', swatch: '#10b981', theme: { accent: '#10b981', bg: '#ffffff', fg: '#101816', muted: '#5b6f66', backdrop: 'rgba(6,20,14,0.5)' } },
  { name: 'Sunset', swatch: '#f97316', theme: { accent: '#f97316', bg: '#fffaf3', fg: '#241505', muted: '#8a6a4d', backdrop: 'rgba(30,15,5,0.5)' } },
  { name: 'Midnight', swatch: '#8b7bff', theme: { accent: '#8b7bff', bg: '#1c1c28', fg: '#f1f1f8', muted: '#a2a2bd', backdrop: 'rgba(3,3,10,0.65)' } },
  { name: 'Candy', swatch: '#ec4899', theme: { accent: '#ec4899', bg: '#ffffff', fg: '#2a0a1c', muted: '#96607e', backdrop: 'rgba(30,5,20,0.5)' } },
];

export default function ThemeStudio() {
  const { setTheme } = useTour();
  const [preset, setPreset] = useState('Violet');
  const [radius, setRadius] = useState(14);

  const apply = (name: string, r: number) => {
    const p = PRESETS.find((x) => x.name === name) ?? PRESETS[0];
    setTheme({ ...p.theme, radius: r });
  };

  return (
    <section data-tour="theme-studio" className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <h2 className="text-[15px] font-semibold text-slate-900">Theme studio</h2>
      <p className="mt-0.5 text-[11.5px] text-slate-500">
        Rewrites the tour layer's <code className="rounded bg-slate-100 px-1 text-slate-600">--ot-*</code> variables live.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => { setPreset(p.name); apply(p.name, radius); }}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition ${
              preset === p.name ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.swatch }} />
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[11.5px] font-medium text-slate-500">
          <span>Corner radius</span>
          <span className="text-slate-800">{radius}px</span>
        </div>
        <input
          type="range"
          min={2}
          max={24}
          value={radius}
          onChange={(e) => { const r = Number(e.target.value); setRadius(r); apply(preset, r); }}
          className="w-full accent-[#6d5cff]"
          aria-label="Popover corner radius"
        />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        Start any tour after changing the theme — or change it mid-tour. Per-tour and per-step
        overrides live in the spec itself.
      </p>
    </section>
  );
}
