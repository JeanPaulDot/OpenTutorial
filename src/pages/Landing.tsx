import { useNavigate } from 'react-router';

const SPEC = `{
  "specVersion": 1,
  "id": "quick-start",
  "title": "Quick Start",
  "trigger": { "type": "auto", "once": true },
  "steps": [
    {
      "id": "hello",
      "target": "#start-btn",
      "title": "Hello!",
      "content": "This is your **first step**."
    }
  ]
}`;

const COMP = [
  ['Core deps', '0', '2', '1', '0'],
  ['Size (gzip)', '12.5 KB', '18 KB', '22 KB', '16 KB'],
  ['Display modes', '3', '1', '1', '1'],
  ['Schema validation', '24 checks', '0', '0', '0'],
  ['Hotspot / Beacon', '✓', '✗', '✗', '✗'],
  ['Vanilla JS', '✓', '✗', '✗', '✗'],
  ['i18n', '✓', '✗', '✗', '✓'],
  ['Resume progress', '✓', '✗', '✗', '✗'],
  ['React 19', '✓', '✗', '✓', '✓'],
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">

      <nav className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-5">
          <span className="text-sm font-bold tracking-tight text-black">Opentutorial</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/jeanpaul/html-aau" className="text-[13px] text-black/40 hover:text-black/60 transition">GitHub</a>
            <button onClick={() => navigate('/demo')} className="rounded-lg bg-black px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-black/80 transition">
              Demo →
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-16 sm:py-24">

        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-black">
            A tour engine that runs on<br />
            <span className="text-black/80">plain JSON.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-black/50 leading-relaxed max-w-lg">
            No runtime deps. Three display modes. 24 schema checks. Install from git, write a spec, get a tour.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => navigate('/demo')} className="rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-black/80 transition shadow-sm">
              Live demo →
            </button>
            <a href="https://github.com/jeanpaul/html-aau" className="rounded-xl border border-black/15 px-5 py-2.5 text-[13px] font-semibold text-black/60 hover:border-black/30 hover:text-black/80 transition">
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-black/10 bg-black overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-red-400/60" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
            <span className="h-2 w-2 rounded-full bg-green-400/60" />
            <span className="ml-2 text-[11px] font-mono text-white/30">tutorial.json</span>
          </div>
          <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-white/70 font-mono">{SPEC}</pre>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-black/10 p-5">
            <div className="text-xs font-semibold text-black/30 mb-1">STEP 1</div>
            <h3 className="font-semibold text-black">Install</h3>
            <pre className="mt-2 text-[12px] font-mono text-black/50 bg-black/[0.04] rounded-lg p-2.5 overflow-x-auto">npm install git+https://github.com/jeanpaul/html-aau</pre>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <div className="text-xs font-semibold text-black/30 mb-1">STEP 2</div>
            <h3 className="font-semibold text-black">Wrap</h3>
            <pre className="mt-2 text-[12px] font-mono text-black/50 bg-black/[0.04] rounded-lg p-2.5 overflow-x-auto">{`<TourProvider specs={[spec]}>
  <App />
</TourProvider>`}</pre>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <div className="text-xs font-semibold text-black/30 mb-1">STEP 3</div>
            <h3 className="font-semibold text-black">Mark targets</h3>
            <pre className="mt-2 text-[12px] font-mono text-black/50 bg-black/[0.04] rounded-lg p-2.5 overflow-x-auto">{`<button data-tour="btn">
  Start
</button>`}</pre>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-xl font-bold text-black">Spec-driven, not code-driven</h2>
          <p className="mt-1.5 text-sm text-black/50">Every tour is a plain JSON object. AI can write them. You can edit them. The engine never crashes from a bad spec.</p>

          <div className="mt-8 space-y-3">
            {[
              { label: 'display', val: '"spotlight" | "hotspot" | "beacon"', desc: 'Three rendering modes, same spec format. Change one field to switch.' },
              { label: 'advanceOn', val: '"button" | "target-click" | "auto" | "event"', desc: 'Control how users progress: explicit button, clicking the target, timed auto-advance, or a custom DOM event.' },
              { label: 'showIf', val: '"plan === \'pro\' && !user.toured"', desc: 'Conditional steps. Safe expression evaluator — no eval(). Supports dot-path context access, &&, ||, !, parens, ===, !==.' },
              { label: 'trigger', val: '{ type: "auto", once: true, delay: 500 }', desc: 'Auto-start on page load, manual via API, or on a custom event. Built-in one-time gating per spec version.' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-black/10 p-4">
                <div className="flex items-baseline gap-3">
                  <code className="text-[13px] font-semibold font-mono text-black">{s.label}</code>
                  <code className="text-[12px] font-mono text-black/40">{s.val}</code>
                </div>
                <p className="mt-1 text-[13px] text-black/50">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-xl font-bold text-black">Display modes</h2>
          <p className="mt-1.5 text-sm text-black/50">Three levels of intrusiveness from the same spec format.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-black/10 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-black text-[10px] text-white font-bold">S</span>
                <span className="font-semibold text-sm text-black">Spotlight</span>
              </div>
              <p className="text-[13px] text-black/50 leading-relaxed">Full backdrop with a cutout around the target. Progress indicator, navigation, keyboard traps. Default mode for structured flows.</p>
            </div>
            <div className="rounded-xl border border-black/10 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-black text-[10px] text-white font-bold">H</span>
                <span className="font-semibold text-sm text-black">Hotspot</span>
              </div>
              <p className="text-[13px] text-black/50 leading-relaxed">Pulsing dot + tooltip, no backdrop. Users can interact with the page freely. Good for feature hints and non-blocking guidance.</p>
            </div>
            <div className="rounded-xl border border-black/10 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-black text-[10px] text-white font-bold">B</span>
                <span className="font-semibold text-sm text-black">Beacon</span>
              </div>
              <p className="text-[13px] text-black/50 leading-relaxed">Tiny pulsing ring, no popover, no text. Just enough signal to say "look here." New-feature indicators that never interrupt.</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-xl font-bold text-black">Compared to alternatives</h2>
          <p className="mt-1.5 text-sm text-black/50">Opentutorial focuses on being embeddable, spec-driven, and dependency-free.</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left py-2.5 pr-4 font-medium text-black/40">Feature</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-black">Opentutorial</th>
                  <th className="text-left py-2.5 px-3 font-medium text-black/40">Reactour</th>
                  <th className="text-left py-2.5 px-3 font-medium text-black/40">Shepherd</th>
                  <th className="text-left py-2.5 px-3 font-medium text-black/40">Intro.js</th>
                </tr>
              </thead>
              <tbody>
                {COMP.map(([feat, ot, r, s, ij]) => (
                  <tr key={feat} className="border-b border-black/5">
                    <td className="py-2.5 pr-4 text-black/60">{feat}</td>
                    <td className="py-2.5 px-3 text-black font-medium">{ot}</td>
                    <td className="py-2.5 px-3 text-black/40">{r}</td>
                    <td className="py-2.5 px-3 text-black/40">{s}</td>
                    <td className="py-2.5 px-3 text-black/40">{ij}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-xl font-bold text-black">Why another tour library?</h2>
          <div className="mt-4 space-y-3 text-[14px] text-black/60 leading-relaxed">
            <p>
              Existing tour libraries couple the tour logic to the UI framework, ship with runtime dependencies, and have no spec validation. A bad step definition crashes the whole tour.
            </p>
            <p>
              Opentutorial treats the tour spec as a separate artifact. The core is framework-agnostic. The React adapter is a thin wrapper. If your spec is wrong, the engine tells you exactly which field violated the schema and continues running other tours.
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { n: '0', l: 'runtime deps' },
            { n: '12.5 KB', l: 'gzip bundle' },
            { n: '79', l: 'unit tests' },
            { n: '24', l: 'schema checks' },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-black/10 p-4 text-center">
              <div className="text-2xl font-bold text-black">{s.n}</div>
              <div className="text-[12px] text-black/40 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-xl bg-black p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Give it 5 minutes</h2>
          <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">Install from GitHub, write your first spec, and see it running. No account, no API key, no third-party script.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('/demo')} className="rounded-xl bg-white px-5 py-2.5 text-[13px] font-semibold text-black hover:bg-white/80 transition">
              Live demo →
            </button>
            <a href="https://github.com/jeanpaul/html-aau" className="rounded-xl border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white/60 hover:border-white/40 hover:text-white/80 transition">
              GitHub
            </a>
          </div>
        </div>

      </main>

      <footer className="border-t border-black/10 py-8 px-5">
        <div className="mx-auto max-w-5xl flex items-center justify-between text-[12px] text-black/40">
          <span>Opentutorial · MIT</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/jeanpaul/html-aau" className="hover:text-black/60 transition">GitHub</a>
            <span>Spec-driven in-app tours</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
