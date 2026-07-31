/**
 * Trigger installation.
 *
 * Each trigger type is wired to a `fire` callback and returns its own teardown.
 * Triggers only ask "has this condition happened?" — whether the tour is *allowed*
 * to run (audience, frequency, one-at-a-time) is the orchestrator's decision.
 */

import type { TourTrigger } from './types';
import { currentPath, matchPath, onLocationChange } from './dom/navigation';
import { waitForTarget } from './dom/target';

export interface TriggerHandle {
  dispose: () => void;
}

/**
 * @param trigger  the spec's trigger definition
 * @param fire     called when the condition is met; may be called repeatedly
 *                 unless the trigger is `once`
 */
export function installTrigger(trigger: TourTrigger | undefined, fire: () => void): TriggerHandle {
  if (!trigger || trigger.type === 'manual') return { dispose: () => {} };

  const delay = trigger.delay ?? 0;
  const timers: number[] = [];
  const disposers: Array<() => void> = [];
  let spent = false;
  const once = trigger.once ?? true;

  const run = (): void => {
    if (spent) return;
    if (once) spent = true;
    if (delay > 0) timers.push(window.setTimeout(fire, delay));
    else fire();
  };

  switch (trigger.type) {
    case 'auto': {
      run();
      break;
    }

    case 'event': {
      const handler = (): void => run();
      window.addEventListener(trigger.event, handler);
      disposers.push(() => window.removeEventListener(trigger.event, handler));
      break;
    }

    case 'route': {
      const check = (): void => {
        if (matchPath(trigger.path, currentPath(), trigger.exact)) run();
        // Leaving and re-entering a route should be able to fire again when the
        // trigger is not `once`, so the spent flag is per-entry.
        else if (!once) spent = false;
      };
      disposers.push(onLocationChange(check));
      check();
      break;
    }

    case 'element': {
      let cancelled = false;
      void waitForTarget({ selector: trigger.selector, visible: true }, trigger.timeout ?? 30000)
        .then((found) => { if (found && !cancelled) run(); });
      disposers.push(() => { cancelled = true; });
      break;
    }

    case 'idle': {
      let timer = 0;
      const reset = (): void => {
        window.clearTimeout(timer);
        if (spent) return;
        timer = window.setTimeout(run, trigger.ms);
      };
      const events = ['pointerdown', 'keydown', 'scroll', 'pointermove'] as const;
      for (const name of events) {
        window.addEventListener(name, reset, { passive: true });
        disposers.push(() => window.removeEventListener(name, reset));
      }
      disposers.push(() => window.clearTimeout(timer));
      reset();
      break;
    }

    case 'scroll': {
      const check = (): void => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        if (scrollable <= 0) return;
        const pct = (doc.scrollTop / scrollable) * 100;
        if (pct >= trigger.percent) run();
      };
      window.addEventListener('scroll', check, { passive: true });
      disposers.push(() => window.removeEventListener('scroll', check));
      check();
      break;
    }
  }

  return {
    dispose: () => {
      timers.forEach((t) => window.clearTimeout(t));
      disposers.forEach((d) => { try { d(); } catch { /* noop */ } });
    },
  };
}
