/**
 * Shared plumbing for the framework-neutral guidance surfaces.
 *
 * Every surface is a plain function that builds DOM and returns a handle. No
 * framework, no virtual DOM, no lifecycle to integrate with — which is the point:
 * Vue, Svelte, Angular, Solid, the Web Component and plain scripts all get the
 * same surfaces React has, and they all share these helpers so the markup and
 * the persistence rules cannot drift between them.
 */
import type { KeyValueStorage } from '../types';
export interface SurfaceHandle {
    /** The root element. Already mounted unless `container: null` was passed. */
    readonly el: HTMLElement;
    /** Attach (or move) the surface into a parent. */
    mount: (parent?: HTMLElement) => void;
    /** Remove from the DOM and release every listener. */
    destroy: () => void;
}
export interface DismissibleOptions {
    /** Stable id — the key dismissal is remembered under. */
    id: string;
    storage?: KeyValueStorage;
    keyPrefix?: string;
    /** Where to mount. `null` leaves the element detached for manual placement. */
    container?: HTMLElement | null;
}
/** Build an element in one call — the vanilla surfaces do this constantly. */
export declare function h<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, props?: Partial<HTMLElementTagNameMap[K]> & {
    text?: string;
    html?: string;
}): HTMLElementTagNameMap[K];
export declare function button(className: string, label: string, onClick: () => void): HTMLButtonElement;
/**
 * Collects teardown callbacks so a surface's `destroy()` is one call rather
 * than a list of `removeEventListener`s that drifts out of sync with the adds.
 */
export declare class Disposers {
    private fns;
    add(fn: () => void): void;
    listen<T extends EventTarget>(target: T, type: string, handler: EventListenerOrEventListenerObject, options?: AddEventListenerOptions): void;
    run(): void;
}
/**
 * Seen/dismissed state for a surface.
 *
 * Reuses `TourPersistence` rather than inventing a second store, so a surface
 * honours the same `storage` adapter and `userId` namespacing tours do — a
 * banner dismissed as one user does not stay dismissed for the next.
 */
export declare class SurfaceState {
    readonly ready: Promise<void>;
    private persistence;
    constructor(storage: KeyValueStorage | undefined, keyPrefix: string, userId?: string);
    /** True when the surface should be shown. */
    shouldShow(id: string, opts?: {
        once?: boolean;
        resurfaceAfter?: number;
    }): boolean;
    markDismissed(id: string): void;
    markActed(id: string): void;
    reset(id?: string): void;
}
/** Resolve `container` to a parent, honouring `null` as "do not mount". */
export declare function attach(el: HTMLElement, container: HTMLElement | null | undefined): void;
/** Standard handle over an element plus its disposers. */
export declare function makeHandle(el: HTMLElement, disposers: Disposers): SurfaceHandle;
