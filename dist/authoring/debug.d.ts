/**
 * Dev-only debug overlay.
 *
 * Answers the questions that otherwise need a debugger: which step is live,
 * did the target resolve, what is in the context, and how did each `showIf`
 * actually evaluate.
 */
import type { TutorialSpec } from '../types';
export interface DebugPanelOptions {
    specs: TutorialSpec[];
    getContext: () => Record<string, unknown>;
    getActiveId: () => string | null;
    getState: () => {
        currentStepId: string | null;
        index: number;
        total: number;
        status: string;
    } | null;
}
export interface DebugPanelHandle {
    update: () => void;
    destroy: () => void;
}
export declare function createDebugPanel(opts: DebugPanelOptions): DebugPanelHandle;
/** Log every tour event with timings. Pairs well with the panel. */
export declare function logEvents(prefix?: string): () => void;
