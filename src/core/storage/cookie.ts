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
export function createCookieStorage(opts: CookieStorageOptions = {}): KeyValueStorage {
  const { days = 365, path = '/', domain, sameSite = 'Lax', secure } = opts;

  const read = (): Record<string, string> => {
    const out: Record<string, string> = {};
    if (typeof document === 'undefined') return out;
    for (const part of document.cookie.split(';')) {
      const eq = part.indexOf('=');
      if (eq < 0) continue;
      out[decodeURIComponent(part.slice(0, eq).trim())] = decodeURIComponent(part.slice(eq + 1));
    }
    return out;
  };

  const write = (key: string, value: string, maxAgeDays: number): void => {
    if (typeof document === 'undefined') return;
    const bits = [
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      `path=${path}`,
      `max-age=${Math.floor(maxAgeDays * 86400)}`,
      `SameSite=${sameSite}`,
    ];
    if (domain) bits.push(`domain=${domain}`);
    if (secure ?? sameSite === 'None') bits.push('Secure');
    document.cookie = bits.join('; ');
  };

  return {
    getItem: (k) => read()[k] ?? null,
    setItem: (k, v) => write(k, v, days),
    removeItem: (k) => write(k, '', -1),
  };
}
