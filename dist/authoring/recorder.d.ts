/**
 * Point-and-click tour recorder.
 *
 * Enable it in a dev build, hover to highlight, click to capture a step, and
 * export a ready-to-paste `TutorialSpec`. Selectors come from
 * `bestSelector`, which prefers explicit hooks and reports a stability score so
 * a fragile target is visible while authoring rather than after a deploy.
 *
 * ```ts
 * import { startRecorder } from '@opentutorial/core/authoring';
 * if (import.meta.env.DEV) startRecorder({ tourId: 'my-tour' });
 * ```
 */
import type { TutorialSpec } from '../types';
export interface RecorderOptions {
    tourId?: string;
    title?: string;
    /** Called with the spec each time it changes. */
    onChange?: (spec: TutorialSpec) => void;
    /** Called on "Copy" / "Done". Defaults to copying JSON to the clipboard. */
    onExport?: (spec: TutorialSpec, json: string) => void;
    /** Warn when a captured selector scores below this. Default 60. */
    minScore?: number;
}
export interface RecorderHandle {
    stop: () => void;
    getSpec: () => TutorialSpec;
    toJSON: () => string;
}
export declare function startRecorder(opts?: RecorderOptions): RecorderHandle;
/** Auto-start when the URL carries `?ot-record=1`. Call once during bootstrap. */
export declare function enableRecorderFromUrl(param?: string): RecorderHandle | null;
