import type { AnalyticsAdapter } from '../types';
interface AmplitudeClient {
    track: (event: string, properties?: Record<string, unknown>) => void;
}
export declare function createAmplitudeAdapter(client: AmplitudeClient): AnalyticsAdapter;
export {};
