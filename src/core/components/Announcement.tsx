'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { TourPersistence } from '../persist';
import { renderBlocks, normalizeContent } from '../content';
import { resolveText } from '../i18n';
import type { I18nResolver, KeyValueStorage, StepContent } from '../types';

export interface AnnouncementProps {
  /** Stable id — used to remember that it has been seen. */
  id: string;
  title: string;
  content: StepContent;
  /** Show only once. Default true. */
  once?: boolean;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  dismissible?: boolean;
  allowHtml?: boolean;
  storage?: KeyValueStorage;
  keyPrefix?: string;
  locale?: string;
  i18nResolver?: I18nResolver;
  className?: string;
  children?: ReactNode;
  onDismiss?: () => void;
}

/**
 * A centered modal for product announcements and what's-new notices.
 *
 * Shares the tour content model, so images, video, lists and code blocks all
 * work here without a second rendering path.
 */
export function Announcement({
  id,
  title,
  content,
  once = true,
  primaryAction,
  secondaryAction,
  dismissible = true,
  allowHtml,
  storage,
  keyPrefix = 'ot-announce',
  locale = 'en',
  i18nResolver,
  className = '',
  children,
  onDismiss,
}: AnnouncementProps) {
  const persistence = useMemo(() => new TourPersistence(storage, keyPrefix), [storage, keyPrefix]);
  const [visible, setVisible] = useState(false);
  const [host, setHost] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    void persistence.ready.then(() => {
      if (cancelled) return;
      setVisible(!once || !persistence.hasSeen(id));
    });
    return () => { cancelled = true; };
  }, [persistence, id, once]);

  const blocks = useMemo(
    () => normalizeContent(content, (c) => resolveText(c, locale, i18nResolver)),
    [content, locale, i18nResolver],
  );

  const dismiss = (): void => {
    if (once) persistence.mark(id, 'skipped');
    setVisible(false);
    onDismiss?.();
  };

  const act = (fn: () => void): void => {
    if (once) persistence.mark(id, 'completed');
    setVisible(false);
    fn();
  };

  useEffect(() => {
    if (!host) return;
    host.replaceChildren(renderBlocks(blocks, { allowHtml }));
  }, [host, blocks, allowHtml]);

  useEffect(() => {
    if (!visible || !dismissible) return;
    const onKey = (e: KeyboardEvent): void => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, dismissible]);

  if (!visible) return null;

  return (
    <div className="ot-root" data-opentutorial="">
      <svg className="ot-backdrop" width="100%" height="100%" aria-hidden="true">
        <rect className="ot-dim" x="0" y="0" width="100%" height="100%" />
      </svg>
      <div
        className={`ot-popover ot-modal ot-popover--modal-step ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`ot-announce-${id}`}
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="ot-body">
          {dismissible && (
            <button type="button" className="ot-skip" aria-label="Dismiss" onClick={dismiss}>
              &times;
            </button>
          )}
          <h2 className="ot-title" id={`ot-announce-${id}`}>{title}</h2>
          <div className="ot-content-wrap" ref={setHost} />
          {children}
          <div className="ot-footer">
            <span />
            <div className="ot-btns">
              {secondaryAction && (
                <button
                  type="button"
                  className="ot-btn ot-btn-ghost"
                  onClick={() => act(secondaryAction.onClick)}
                >
                  {secondaryAction.label}
                </button>
              )}
              <button
                type="button"
                className="ot-btn ot-btn-primary"
                onClick={() => (primaryAction ? act(primaryAction.onClick) : dismiss())}
              >
                {primaryAction?.label ?? 'Got it'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
