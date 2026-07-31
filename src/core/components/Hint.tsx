'use client';

import { useEffect, useRef, useState } from 'react';
import { resolveTarget } from '../dom/target';
import { renderInline } from '../markdown';
import type { TourTarget } from '../types';

export interface HintProps {
  target: TourTarget | string;
  content: string;
  /** Character shown in the dot. Default "?". */
  glyph?: string;
  /** Open on hover as well as click. */
  openOnHover?: boolean;
  zIndex?: number;
  className?: string;
}

/**
 * A standalone, always-available hint marker — not part of any flow.
 *
 * Useful for permanent "what is this?" affordances next to a dense control,
 * where a step-through tour would be overkill.
 */
export function Hint({
  target,
  content,
  glyph = '?',
  openOnHover = false,
  zIndex,
  className = '',
}: HintProps) {
  const [rect, setRect] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const frame = useRef(0);

  const resolvedTarget: TourTarget = typeof target === 'string' ? { selector: target } : target;
  const key = JSON.stringify(resolvedTarget);

  useEffect(() => {
    let alive = true;

    const measure = (): void => {
      if (!alive) return;
      const found = resolveTarget(JSON.parse(key) as TourTarget);
      if (!found) { setRect(null); return; }
      const r = found.element.getBoundingClientRect();
      setRect({
        x: r.x + found.frameOffset.x + r.width,
        y: r.y + found.frameOffset.y,
      });
    };

    const schedule = (): void => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);

    return () => {
      alive = false;
      cancelAnimationFrame(frame.current);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      observer.disconnect();
    };
  }, [key]);

  if (!rect) return null;

  return (
    <div
      className={`ot-hint ${className}`.trim()}
      style={{ left: rect.x, top: rect.y, ...(zIndex ? { zIndex } : {}) }}
      onMouseEnter={openOnHover ? () => setOpen(true) : undefined}
      onMouseLeave={openOnHover ? () => setOpen(false) : undefined}
    >
      <button
        type="button"
        className="ot-hint-dot"
        aria-expanded={open}
        aria-label={open ? 'Hide hint' : 'Show hint'}
        onClick={() => setOpen((o) => !o)}
      >
        {glyph}
      </button>
      {open && (
        <div
          className="ot-hint-panel"
          role="tooltip"
          dangerouslySetInnerHTML={{ __html: renderInline(content) }}
        />
      )}
    </div>
  );
}
