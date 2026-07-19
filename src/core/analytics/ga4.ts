import type { AnalyticsAdapter, TourEvent } from '../types';

export function createGA4Adapter(measurementId?: string): AnalyticsAdapter {
  return (event: TourEvent) => {
    try {
      const gtag = (window as unknown as Record<string, unknown>).gtag;
      if (typeof gtag === 'function') {
        gtag('event', 'opentutorial_' + event.type, {
          tour_id: event.tourId,
          step_id: event.stepId ?? '',
          event_label: event.message ?? '',
          send_to: measurementId,
        });
      }
    } catch { /* analytics must never break the tour */ }
  };
}
