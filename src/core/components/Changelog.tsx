'use client';

import { useEffect, useRef } from 'react';
import { createChangelog, type ChangelogEntry, type ChangelogHandle, type ChangelogOptions } from '../surfaces/changelog';

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
export function Changelog({ entries, ...options }: ChangelogProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<ChangelogHandle | null>(null);
  // Options are read once at mount; entries are pushed through `setEntries`.
  const optionsRef = useRef(options);

  useEffect(() => { optionsRef.current = options; });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const handle = createChangelog({
      ...optionsRef.current,
      entries: [],
      container: host,
    });
    handleRef.current = handle;

    return () => {
      handle.destroy();
      handleRef.current = null;
    };
    // Mount once: the factory owns its own DOM and updates through its handle.
  }, []);

  useEffect(() => {
    handleRef.current?.setEntries(entries);
  }, [entries]);

  return <div ref={hostRef} />;
}

/** Re-exported so consumers can type their feed without reaching into `/core`. */
export type ChangelogEntryList = ChangelogEntry[];
