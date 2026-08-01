import { type ChangelogEntry, type ChangelogOptions } from '../surfaces/changelog';
export type { ChangelogEntry } from '../surfaces/changelog';
export interface ChangelogProps extends Omit<ChangelogOptions, 'container'> {
    className?: string;
}
/**
 * What's-new widget.
 *
 * A thin wrapper over the framework-free `createChangelog` factory rather than a
 * reimplementation — read state, badge counting and markup stay identical to
 * what Vue, Svelte and plain-script users get.
 */
export declare function Changelog({ entries, ...options }: ChangelogProps): import("react").JSX.Element;
/** Re-exported so consumers can type their feed without reaching into `/core`. */
export type ChangelogEntryList = ChangelogEntry[];
