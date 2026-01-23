import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CoinBaseProvider } from '../CoinBaseProvider.js';

function makeJsonResponse(obj: unknown, okFlag = true) {
  return Promise.resolve({
    ok: okFlag,
    json: () => Promise.resolve(obj),
  }) as unknown as Response;
}

describe(CoinBaseProvider.name, () => {
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
        ask: '89525.39',
        bid: '89525.38',
        volume: '7418.81727101',
        trade_id: 942571767,
        price: '89525.38',
        size: '0.00001117',
        time: '2026-01-23T22:47:24.582946336Z',
        rfq_volume: '69.490064',
      })
    ) as any;

    const p = new CoinBaseProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.value).toBe(89525.38);
    }
  });

  it('returns error when response not ok', async () => {
    globalThis.fetch = vi.fn(
      () =>
        Promise.resolve({ ok: false, status: 500, statusText: 'err' }) as any
    );

    const p = new CoinBaseProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('API request failed');
    }
  });

  it('returns error when price is missing', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        ask: '89525.39',
        bid: '89525.38',
        volume: '7418.81727101',
        trade_id: 942571767,
        // price is missing
      })
    ) as any;

    const p = new CoinBaseProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toMatch(/price not found/i);
    }
  });

  it('returns error when price is not a valid number', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        ask: '89525.39',
        bid: '89525.38',
        volume: '7418.81727101',
        trade_id: 942571767,
        price: 'invalid',
        size: '0.00001117',
        time: '2026-01-23T22:47:24.582946336Z',
      })
    ) as any;

    const p = new CoinBaseProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toMatch(/not a valid number/i);
    }
  });

  it('correctly maps fiat to product ID', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        ask: '82000.50',
        bid: '82000.49',
        volume: '1234.56',
        trade_id: 123456789,
        price: '82000.50',
        size: '0.001',
        time: '2026-01-23T22:47:24.582946336Z',
      })
    ) as any;

    const p = new CoinBaseProvider();
    const res = await p.getCurrentPrice('eur');

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.value).toBe(82000.5);
    }

    // Verify the URL was called with the correct product ID
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('products/BTC-EUR/ticker'),
      expect.any(Object)
    );
  });
});
