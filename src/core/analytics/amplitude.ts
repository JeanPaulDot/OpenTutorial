import type { AnalyticsAdapter, TourEvent } from '../types';

interface AmplitudeClient {
  track: (event: string, properties?: Record<string, unknown>) => void;
}

export function createAmplitudeAdapter(client: AmplitudeClient): AnalyticsAdapter {
  return (event: TourEvent) => {
    try {
      const props = event as unknown as Record<string, unknown>;
      delete props.timestamp;
      client.track('[Opentutorial] ' + event.type, props);
    } catch { /* analytics must never break the tour */ }
  };
}
