import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CoinDeskProvider } from '../CoinDeskProvider.js';

function makeJsonResponse(obj: unknown, okFlag = true) {
  return Promise.resolve({
    ok: okFlag,
    json: () => Promise.resolve(obj),
  }) as unknown as Response;
}

describe(CoinDeskProvider.name, () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns ok result with numeric price', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        Data: {
          'BTC-USD': {
            TYPE: '246',
            MARKET: 'ccix',
            INSTRUMENT: 'BTC-USD',
            VALUE: 45678.9,
            VALUE_FLAG: 'UP',
            VALUE_LAST_UPDATE_TS: 1234567890,
          },
        },
        Err: {},
      })
    ) as any;

    const p = new CoinDeskProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.value).toBe(45678.9);
    }
  });

  it('returns error when response not ok', async () => {
    globalThis.fetch = vi.fn(
      () =>
        Promise.resolve({ ok: false, status: 500, statusText: 'err' }) as any
    );

    const p = new CoinDeskProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('API request failed');
    }
  });

  it('returns error when no data found', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        Err: {},
      })
    ) as any;

    const p = new CoinDeskProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toMatch(/no data found/i);
    }
  });

  it('returns error when price shape is unexpected', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        Data: {
          'BTC-USD': {
            TYPE: '246',
            MARKET: 'ccix',
            INSTRUMENT: 'BTC-USD',
            // VALUE is missing
          },
        },
        Err: {},
      })
    ) as any;

    const p = new CoinDeskProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toMatch(/Invalid API response/i);
    }
  });

  it('correctly maps fiat to instrument code', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        Data: {
          'BTC-EUR': {
            TYPE: '246',
            MARKET: 'ccix',
            INSTRUMENT: 'BTC-EUR',
            VALUE: 42000.5,
            VALUE_FLAG: 'STABLE',
            VALUE_LAST_UPDATE_TS: 1234567890,
          },
        },
        Err: {},
      })
    ) as any;

    const p = new CoinDeskProvider();
    const res = await p.getCurrentPrice('eur');

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.value).toBe(42000.5);
    }

    // Verify the URL was called with the correct instrument
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('instruments=BTC-EUR'),
      expect.any(Object)
    );
  });
});
