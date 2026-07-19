import type { AnalyticsAdapter } from '../types';
interface PostHogClient {
    capture: (event: string, properties?: Record<string, unknown>) => void;
}
export declare function createPostHogAdapter(client: PostHogClient): AnalyticsAdapter;
export {};
