import { useRef, useState } from 'react';
import {
  createTour,
  validateSpec,
  type SpecError,
  type TourEngine,
  type TutorialSpec,
} from '../../core';
import '../../core/styles.css';

const VALID_EXAMPLE = JSON.stringify(
  {
    specVersion: 1,
    id: 'playground-demo',
    title: 'Playground demo',
    version: '1.0.0',
    trigger: { type: 'manual' },
    steps: [
      {
        id: 'panel',
        target: { selector: "[data-tour='tours-panel']", padding: 8 },
        placement: 'left',
        title: 'Written by hand or by AI',
        content:
          'This spec was pasted as **raw JSON**, validated against the schema, and rendered without touching the app.',
      },
      {
        id: 'end',
        title: 'That is the whole workflow',
        content:
          'AI reads the codebase → emits this JSON → the runtime validates and plays it. Try the **broken example** to see validation fail loudly.',
      },
    ],
  },
  null,
  2,
);

const BROKEN_EXAMPLE = JSON.stringify(
  {
    specVersion: 2,
    id: 'Broken Spec!',
    title: 'This title is far too long to ever fit inside a small popover element nicely',
    steps: [
      {
        id: 'dup',
        target: { selector: '' },
        placement: 'somewhere',
        title: 'Duplicate id',
        content: 'Also broken advance mode.',
        advanceOn: 'event',
        next: 'does-not-exist',
      },
      { id: 'dup', title: 'Same id again', content: 'x' },
    ],
  },
  null,
  2,
);

type CheckResult =
  | { kind: 'idle' }
  | { kind: 'parse-error'; message: string }
  | { kind: 'invalid'; errors: SpecError[] }
  | { kind: 'valid'; steps: number };

export default function SpecPlayground() {
  const [text, setText] = useState(VALID_EXAMPLE);
  const [result, setResult] = useState<CheckResult>({ kind: 'idle' });
  const [running, setRunning] = useState(false);
  const engineRef = useRef<TourEngine | null>(null);

  const check = (): { spec?: TutorialSpec; res: CheckResult } => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      return { res: { kind: 'parse-error', message: err instanceof Error ? err.message : 'Invalid JSON' } };
    }
    const v = validateSpec(parsed);
    if (!v.ok) return { res: { kind: 'invalid', errors: v.errors } };
    return { spec: parsed as TutorialSpec, res: { kind: 'valid', steps: (parsed as TutorialSpec).steps.length } };
  };

  const onValidate = () => setResult(check().res);

  const onRun = () => {
    engineRef.current?.destroy();
    const { spec, res } = check();
    setResult(res);
    if (!spec) return;
    const engine = createTour(spec, {});
    engineRef.current = engine;
    setRunning(true);
    void engine.start();
  };

  const onStop = () => {
    engineRef.current?.destroy();
    setRunning(false);
  };

  return (
    <section
      id="playground"
      data-tour="playground"
      className="scroll-mt-20 rounded-2xl border border-slate-800/60 bg-[#0c0c16] p-6 shadow-2xl shadow-[#6d5cff]/10 sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="text-[17px] font-semibold text-white">Spec playground</h2>
          <p className="text-[13px] text-slate-400">
            The same contract AI authors use: <strong className="text-slate-200">TutorialSpec JSON → validate → run</strong>.
          </p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            onClick={() => {
              setText(VALID_EXAMPLE);
              setResult({ kind: 'idle' });
            }}
            className="rounded-md border border-slate-700 px-2.5 py-1.5 text-[12px] font-medium text-slate-300 transition hover:border-slate-500"
          >
            Load valid example
          </button>
          <button
            onClick={() => {
              setText(BROKEN_EXAMPLE);
              setResult({ kind: 'idle' });
            }}
            className="rounded-md border border-rose-800 bg-rose-950/40 px-2.5 py-1.5 text-[12px] font-medium text-rose-300 transition hover:border-rose-600"
          >
            Load broken example
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="h-80 w-full resize-none rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-[12px] leading-relaxed text-emerald-200 outline-none focus:border-[#6d5cff] focus:ring-2 focus:ring-[#6d5cff]/25"
          aria-label="TutorialSpec JSON editor"
        />

        <div className="flex h-80 flex-col rounded-lg border border-slate-800 bg-slate-900/40 p-4">
          <div className="flex gap-2">
            <button
              onClick={onValidate}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-[12.5px] font-semibold text-slate-200 transition hover:border-slate-500"
            >
              Validate spec
            </button>
            <button
              onClick={onRun}
              disabled={running}
              className="rounded-lg bg-[#6d5cff] px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
            >
              {running ? 'Tour running…' : 'Validate & run tour'}
            </button>
            {running && (
              <button
                onClick={onStop}
                className="rounded-lg border border-rose-700 bg-rose-950/40 px-3.5 py-2 text-[12.5px] font-semibold text-rose-300"
              >
                Stop
              </button>
            )}
          </div>

          <div className="mt-3 flex-1 overflow-y-auto">
            {result.kind === 'idle' && (
              <p className="rounded-lg border border-dashed border-slate-700 p-4 text-center text-[12px] text-slate-500">
                Validate the spec — or paste one your AI assistant generated from this codebase.
              </p>
            )}
            {result.kind === 'parse-error' && (
              <div className="rounded-lg border border-rose-800 bg-rose-950/40 p-3 text-[12px] text-rose-300">
                <strong>JSON parse error:</strong> {result.message}
              </div>
            )}
            {result.kind === 'invalid' && (
              <div className="rounded-lg border border-rose-800 bg-rose-950/40 p-3">
                <div className="mb-2 text-[12.5px] font-semibold text-rose-300">
                  {result.errors.length} schema violation{result.errors.length === 1 ? '' : 's'} — the app keeps running, the tour does not:
                </div>
                <ul className="space-y-1.5">
                  {result.errors.map((e, i) => (
                    <li key={i} className="rounded-md bg-black/30 px-2.5 py-1.5 font-mono text-[11px] text-rose-200">
                      <span className="text-rose-400">{e.path}</span> — {e.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.kind === 'valid' && (
              <div className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-4 text-[12.5px] text-emerald-300">
                <strong>Valid spec.</strong> {result.steps} step{result.steps === 1 ? '' : 's'}, all targets and branches check out.
                This is exactly what the runtime accepts — an AI author can rely on the same guarantee.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
