import type { KeyValueStorage } from '../types';
export interface CookieStorageOptions {
    /** Days until expiry. Default 365. */
    days?: number;
    path?: string;
    domain?: string;
    sameSite?: 'Lax' | 'Strict' | 'None';
    secure?: boolean;
}
/**
 * Cookie-backed storage, for hosts that need tour state to reach the server or
 * to survive across subdomains. Cookies cap at ~4KB, so this is only viable for
 * a modest number of tours — the persistence layer stores one compact record.
 */
export declare function createCookieStorage(opts?: CookieStorageOptions): KeyValueStorage;
