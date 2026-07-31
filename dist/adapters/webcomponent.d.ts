/**
 * `<open-tutorial>` custom element.
 *
 * The universal adapter: works in Angular, Solid, Lit, Astro, Rails, Django, or
 * a plain HTML file. Specs come from a `specs` property, a `specs` attribute
 * holding JSON, or an inline `<script type="application/json">` child.
 *
 * ```html
 * <open-tutorial auto-start="welcome">
 *   <script type="application/json">
 *     { "specVersion": 1, "id": "welcome", "title": "Hi", "steps": [ ... ] }
 *   </script>
 * </open-tutorial>
 * ```
 */
import { type VanillaTutorialLayer } from './vanilla';
import type { TutorialSpec } from '../types';
export declare class OpenTutorialElement extends HTMLElement {
    static get observedAttributes(): string[];
    private layer;
    private _specs;
    private _context;
    /** Assign specs as a property when they are not serializable into an attribute. */
    set specs(value: TutorialSpec[]);
    get specs(): TutorialSpec[];
    set context(value: Record<string, unknown>);
    get context(): Record<string, unknown>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
    private collectSpecs;
    private rebuild;
    start(tourId: string, stepId?: string): void;
    stop(): void;
    pause(): void;
    resumeTour(): void;
    next(): void;
    prev(): void;
    reset(): void;
    getState(tourId?: string): import("..").TourState | null;
    getLayer(): VanillaTutorialLayer | null;
}
/** Registers `<open-tutorial>`. Safe to call more than once. */
export declare function defineOpenTutorialElement(tagName?: string): void;
