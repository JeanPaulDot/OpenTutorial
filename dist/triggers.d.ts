/**
 * Trigger installation.
 *
 * Each trigger type is wired to a `fire` callback and returns its own teardown.
 * Triggers only ask "has this condition happened?" — whether the tour is *allowed*
 * to run (audience, frequency, one-at-a-time) is the orchestrator's decision.
 */
import type { TourTrigger } from './types';
export interface TriggerHandle {
    dispose: () => void;
}
/**
 * @param trigger  the spec's trigger definition
 * @param fire     called when the condition is met; may be called repeatedly
 *                 unless the trigger is `once`
 */
export declare function installTrigger(trigger: TourTrigger | undefined, fire: () => void): TriggerHandle;
