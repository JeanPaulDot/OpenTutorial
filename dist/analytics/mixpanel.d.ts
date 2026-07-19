import type { AnalyticsAdapter } from '../types';
interface MixpanelClient {
    track: (event: string, properties?: Record<string, unknown>) => void;
}
export declare function createMixpanelAdapter(client: MixpanelClient): AnalyticsAdapter;
export {};
