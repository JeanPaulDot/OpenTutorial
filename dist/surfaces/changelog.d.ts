import { type DismissibleOptions, type SurfaceHandle } from './shared';
import type { I18nResolver, StepContent } from '../types';
export interface ChangelogEntry {
    /** Stable id — drives the unread badge. */
    id: string;
    title: string;
    /** ISO date or any string you want rendered verbatim. */
    date?: string;
    /** Free-form tag: "New", "Fixed", "Improved". */
    tag?: string;
    content: StepContent;
    /** Optional deep link out to fuller release notes. */
    href?: string;
}
export interface ChangelogOptions extends Omit<DismissibleOptions, 'id'> {
    entries: ChangelogEntry[];
    title?: string;
    /** Render as a floating panel with a launcher that carries an unread count. */
    floating?: boolean;
    launcherGlyph?: string;
    emptyMessage?: string;
    /** Entries to render. Default 20. */
    limit?: number;
    allowHtml?: boolean;
    locale?: string;
    i18nResolver?: I18nResolver;
    userId?: string;
    className?: string;
    /** Fired with the ids that were unread when the panel was opened. */
    onRead?: (ids: string[]) => void;
}
export interface ChangelogHandle extends SurfaceHandle {
    open: () => void;
    close: () => void;
    /** Ids the current user has not seen yet. */
    unread: () => string[];
    /** Mark everything read without opening the panel. */
    markAllRead: () => void;
    /** Swap the entry list — for feeds fetched after mount. */
    setEntries: (entries: ChangelogEntry[]) => void;
}
/**
 * What's-new widget.
 *
 * Read state is per entry id, not a single "last seen" timestamp, so inserting
 * a backdated entry still surfaces it and re-ordering the feed never marks
 * anything unread again. The launcher carries the unread count, which is the
 * only part most users ever look at.
 */
export declare function createChangelog(options: ChangelogOptions): ChangelogHandle;
