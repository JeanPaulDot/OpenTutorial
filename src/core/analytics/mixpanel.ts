import type { AnalyticsAdapter, TourEvent } from '../types';

interface MixpanelClient {
  track: (event: string, properties?: Record<string, unknown>) => void;
}

export function createMixpanelAdapter(client: MixpanelClient): AnalyticsAdapter {
  return (event: TourEvent) => {
    try {
      client.track('[Opentutorial] ' + event.type, event as unknown as Record<string, unknown>);
    } catch { /* analytics must never break the tour */ }
  };
}
