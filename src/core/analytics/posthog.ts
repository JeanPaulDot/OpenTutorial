import type { AnalyticsAdapter, TourEvent } from '../types';

interface PostHogClient {
  capture: (event: string, properties?: Record<string, unknown>) => void;
}

export function createPostHogAdapter(client: PostHogClient): AnalyticsAdapter {
  return (event: TourEvent) => {
    try {
      client.capture('[Opentutorial] ' + event.type, event as unknown as Record<string, unknown>);
    } catch { /* analytics must never break the tour */ }
  };
}
