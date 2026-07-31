'use client';

import { useEffect, useMemo, useState } from 'react';
import { TourPersistence } from '../persist';
import { renderInline } from '../markdown';
import type { KeyValueStorage } from '../types';

export interface BannerProps {
  /** Stable id — used to remember the dismissal. */
  id: string;
  /** Inline markdown: **bold**, *italic*, `code`, [links](https://…). */
  message: string;
  position?: 'top' | 'bottom';
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  /** Re-show after this many ms. Omit to dismiss permanently. */
  resurfaceAfter?: number;
  storage?: KeyValueStorage;
  keyPrefix?: string;
  className?: string;
  onDismiss?: () => void;
}

/**
 * A persistent announcement bar. Dismissal is stored alongside tour state, so a
 * banner the user closed does not come back on the next page load.
 */
export function Banner({
  id,
  message,
  position = 'top',
  action,
  dismissible = true,
  resurfaceAfter,
  storage,
  keyPrefix = 'ot-banner',
  className = '',
  onDismiss,
}: BannerProps) {
  const persistence = useMemo(
    () => new TourPersistence(storage, keyPrefix),
    [storage, keyPrefix],
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void persistence.ready.then(() => {
      if (cancelled) return;
      const record = persistence.getRecord(id);
      if (!record?.at) { setVisible(true); return; }
      const expired = resurfaceAfter !== undefined && Date.now() - record.at > resurfaceAfter;
      setVisible(expired);
    });
    return () => { cancelled = true; };
  }, [persistence, id, resurfaceAfter]);

  if (!visible) return null;

  const dismiss = (): void => {
    persistence.mark(id, 'skipped');
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`ot-banner ot-banner--${position} ${className}`.trim()} role="status">
      <span
        className="ot-banner-content"
        // Markdown is escaped before formatting, so no host content reaches the DOM raw.
        dangerouslySetInnerHTML={{ __html: renderInline(message) }}
      />
      {action && (
        <button type="button" className="ot-banner-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {dismissible && (
        <button type="button" className="ot-banner-dismiss" aria-label="Dismiss" onClick={dismiss}>
          &times;
        </button>
      )}
    </div>
  );
}
