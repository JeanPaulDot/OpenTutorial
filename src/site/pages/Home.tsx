import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import FeatureGrid from '../components/FeatureGrid';
import ModeShowcase from '../components/ModeShowcase';
import SpecPlayground from '../components/SpecPlayground';
import Comparison from '../components/Comparison';
import '../home.css';

const STATS = [
  { n: '0', l: 'runtime dependencies' },
  { n: '12.5 KB', l: 'gzip bundle' },
  { n: '79', l: 'unit tests' },
  { n: '24', l: 'schema checks' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-[#6d5cff]/20">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="hero-aurora" aria-hidden />
        <div className="hero-grid" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
          <a
            href="https://github.com/JeanPaulDot/OpenTutorial"
            className="home-pill mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-slate-600 shadow-sm backdrop-blur transition hover:border-[#6d5cff]/40 hover:text-slate-900"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#6d5cff]" />
            Now open source · MIT licensed
            <span className="text-slate-400">→</span>
          </a>

          <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            In-app tours that
            <span className="relative mx-2 inline-block bg-gradient-to-r from-[#6d5cff] via-[#8b5cf6] to-[#6d5cff] bg-clip-text text-transparent">
              speak JSON
            </span>
            <br className="hidden sm:block" />
            not framework lock-in.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-500">
            A spec-driven tour engine with zero runtime dependencies. Drop in a{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-700">
              TutorialSpec
            </code>
            , wrap your app once, and ship guided onboarding your users actually finish.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/demo')}
              className="h-12 rounded-xl bg-[#6d5cff] px-7 text-[15px] font-semibold text-white shadow-lg shadow-[#6d5cff]/25 transition hover:bg-[#5d4cf0] hover:shadow-xl hover:shadow-[#6d5cff]/30"
            >
              Try the live demo
              <span aria-hidden>→</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/demo')}
              className="h-12 rounded-xl border-slate-200 px-7 text-[15px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Read the docs
            </Button>
          </div>

          <div className="mt-7 flex items-center justify-center gap-5 text-[13px] text-slate-400">
            <span>React 19 + vanilla</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>3 display modes</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>i18n &amp; analytics</span>
          </div>
        </div>

        {/* CODE PREVIEW */}
        <div className="relative mx-auto max-w-4xl px-6">
          <div className="home-codecard overflow-hidden rounded-2xl border border-slate-800/60 bg-[#0c0c16] shadow-2xl shadow-[#6d5cff]/10">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-[12px] text-slate-500">tutorial.json</span>
              <span className="ml-auto rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-400">
                spec-driven
              </span>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed">
              <code className="text-slate-300">
                <span className="text-[#7c7c9c]">{'{'} </span>
                <span className="text-[#c792ea]">"specVersion"</span>
                <span className="text-slate-500">: </span>
                <span className="text-[#f78c6c]">1</span>
                <span className="text-slate-500">,</span>
                <span className="text-slate-400">{'  '}</span>
                <span className="text-[#c792ea]">"id"</span>
                <span className="text-slate-500">: </span>
                <span className="text-[#c3e88d]">"quick-start"</span>
                <span className="text-slate-500">,</span>
                <span className="text-slate-400">{'  '}</span>
                <span className="text-[#c792ea]">"steps"</span>
                <span className="text-slate-500">: [</span>
                <span className="text-slate-400">{' '}</span>
                <span className="text-slate-300">{'{'} </span>
                <span className="text-[#c792ea]">"id"</span>
                <span className="text-slate-500">: </span>
                <span className="text-[#c3e88d]">"hello"</span>
                <span className="text-slate-500">,</span>
                <span className="text-slate-400">{'  '}</span>
                <span className="text-[#c792ea]">"target"</span>
                <span className="text-slate-500">: </span>
                <span className="text-[#c3e88d]">"[data-tour='start']"</span>
                <span className="text-slate-500">,</span>
                <span className="text-slate-400">{'  '}</span>
                <span className="text-[#c792ea]">"title"</span>
                <span className="text-slate-500">: </span>
                <span className="text-[#c3e88d]">"Hello!"</span>
                <span className="text-slate-400"> </span>
                <span className="text-slate-300">{'}'}</span>
                <span className="text-slate-500"> ]</span>
                <span className="text-slate-400">{' '}</span>
                <span className="text-[#7c7c9c]">{'}'}</span>
              </code>
            </pre>
          </div>
          <div className="home-fade" aria-hidden />
        </div>
      </section>

      {/* STATS */}
      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="bg-white px-6 py-8 text-center">
              <div className="bg-gradient-to-br from-[#6d5cff] to-[#8b5cf6] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {s.n}
              </div>
              <div className="mt-1.5 text-[13px] font-medium text-slate-400">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <FeatureGrid />

      {/* MODES */}
      <ModeShowcase />

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="home-eyebrow">Three steps</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From install to guided tour
          </h2>
          <p className="mt-4 text-slate-500">
            No accounts, no API keys, no third-party scripts. Just a dependency and a spec.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Install',
              body: 'Add the package from GitHub. It ships with zero runtime dependencies — only React as a peer.',
              code: 'npm i @opentutorial/core',
            },
            {
              step: '02',
              title: 'Wrap',
              body: 'Mount TourProvider once at your app root and pass it an array of specs.',
              code: '<TourProvider specs={[spec]}>',
            },
            {
              step: '03',
              title: 'Mark targets',
              body: 'Tag any element with a data-tour attribute. The engine finds it — no fragile selectors.',
              code: "<button data-tour='start'>",
            },
          ].map((c) => (
            <div
              key={c.step}
              className="home-stepcard group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6"
            >
              <div className="font-mono text-[13px] font-semibold text-[#6d5cff]">{c.step}</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-500">{c.body}</p>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 px-4 py-3 font-mono text-[12px] text-emerald-300">
                {c.code}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* PLAYGROUND */}
      <section className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="home-eyebrow">Live validation</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Bad specs never crash the host
          </h2>
          <p className="mt-4 text-slate-500">
            Every spec is validated against 24+ checks before it runs. Paste your own — or one your
            AI assistant wrote from this codebase.
          </p>
        </div>
        <div className="mt-10">
          <SpecPlayground />
        </div>
      </section>

      {/* COMPARISON */}
      <Comparison />

      {/* CTA */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="home-cta relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="hero-aurora hero-aurora--soft" aria-hidden />
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Give it five minutes.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-slate-400">
            Install from GitHub, write your first spec, and watch your onboarding finally get
            finished.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/demo')}
              className="h-12 rounded-xl bg-white px-7 text-[15px] font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Open the demo →
            </Button>
            <a
              href="https://github.com/JeanPaulDot/OpenTutorial"
              className="inline-flex h-12 items-center rounded-xl border border-white/15 px-7 text-[15px] font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
