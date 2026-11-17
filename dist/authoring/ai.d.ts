/**
 * Helpers for authoring tours with a language model.
 *
 * A model writing a tour needs three things it cannot guess: what a valid spec
 * looks like, which elements exist on the page, and whether what it wrote
 * actually works. This file supplies the first two — `createAuthoringPrompt`
 * and `collectAnchors` — and `validateSpec` plus `auditSelectors` close the
 * loop on the third.
 *
 * Nothing here calls a model. The library stays dependency-free and
 * vendor-neutral: you bring the model, this brings the grounding.
 */
import type { TutorialSpec } from '../types';
export interface PageAnchor {
    /** The most stable selector available for this element. */
    selector: string;
    /** 0–100. Above 70 is safe to ship; below 40 will probably break. */
    score: number;
    tag: string;
    /** ARIA role, explicit or implied by the tag. */
    role?: string;
    /** Visible text or accessible label, trimmed. */
    text?: string;
    /** False when the element currently has no box (hidden tab, closed menu). */
    visible: boolean;
}
export interface CollectAnchorsOptions {
    /** Maximum anchors to return. Default 60. */
    limit?: number;
    /** Drop anchors whose selector scores below this. Default 0 (keep all). */
    minScore?: number;
    /** Include elements that currently have no box. Default false. */
    includeHidden?: boolean;
}
/**
 * List the elements on the page a tour could target, each with its most stable
 * selector and a stability score.
 *
 * This is the grounding a model needs: handed a list of real selectors, it
 * picks from them; left to imagine, it invents `#submit-button` and the tour
 * breaks on the first step.
 */
export declare function collectAnchors(root?: ParentNode, opts?: CollectAnchorsOptions): PageAnchor[];
/**
 * Describe a spec in plain language.
 *
 * For showing a human (or a reviewing model) what a tour does without making
 * them read JSON: when it starts, who sees it, and what each step says, points
 * at and waits for.
 */
export declare function describeSpec(spec: TutorialSpec): string;
export interface AuthoringPromptOptions {
    /** What the tour should achieve, in the user's words. */
    goal?: string;
    /** Real elements on the page, from `collectAnchors()`. Strongly recommended. */
    anchors?: PageAnchor[];
    /** Keys available in the tour context, for `showIf` / `audience` / `nextWhen`. */
    contextKeys?: string[];
    /** Upper bound on steps. Default 6 — long tours are abandoned. */
    maxSteps?: number;
}
/**
 * Build a prompt that gets a valid `TutorialSpec` out of a language model.
 *
 * Deliberately compact: the rules that models actually get wrong (kebab-case
 * ids, required titles, the expression grammar, inventing selectors) rather
 * than the whole schema. Always run the result through `validateSpec` — the
 * prompt reduces failures, the validator catches them.
 */
export declare function createAuthoringPrompt(opts?: AuthoringPromptOptions): string;
/**
 * Pull a spec out of a model reply.
 *
 * Models wrap JSON in prose and code fences however firmly they are told not
 * to. This finds the outermost object and parses it; it returns null rather
 * than throwing, because a malformed reply is an expected outcome to retry on.
 */
export declare function extractSpec(reply: string): unknown | null;
