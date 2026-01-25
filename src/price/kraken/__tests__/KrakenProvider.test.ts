import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { KrakenProvider } from '../KrakenProvider.js';

function makeJsonResponse(obj: unknown, okFlag = true) {
  return Promise.resolve({
    ok: okFlag,
    json: () => Promise.resolve(obj),
  }) as unknown as Response;
}

describe(KrakenProvider.name, () => {
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
        error: [],
        result: {
          XXBTZUSD: {
            a: ['89468.50000', '5', '5.000'],
            b: ['89468.40000', '1', '1.000'],
            c: ['89468.50000', '0.00010958'],
            v: ['1466.47280552', '1476.89704981'],
            p: ['89585.77793', '89584.77415'],
            t: [59185, 60033],
            l: ['88470.90000', '88470.90000'],
            h: ['91099.50000', '91099.50000'],
            o: '89454.20000',
          },
        },
      })
    ) as any;

    const p = new KrakenProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.value).toBe(89468.5);
    }
  });

  it('returns error when response not ok', async () => {
    globalThis.fetch = vi.fn(
      () =>
        Promise.resolve({ ok: false, status: 500, statusText: 'err' }) as any
    );

    const p = new KrakenProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('API request failed');
    }
  });

  it('returns error when API returns errors', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        error: ['Invalid pair'],
        result: {},
      })
    ) as any;

    const p = new KrakenProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toMatch(/Kraken API error/i);
      expect(res.error).toContain('Invalid pair');
    }
  });

  it('returns error when no result found', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        error: [],
      })
    ) as any;

    const p = new KrakenProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toMatch(/no result found/i);
    }
  });

  it('returns error when no pair data found', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        error: [],
        result: {},
      })
    ) as any;

    const p = new KrakenProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toMatch(/no pair data found/i);
    }
  });

  it('returns error when price is missing', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        error: [],
        result: {
          XXBTZUSD: {
            a: ['89468.50000', '5', '5.000'],
            b: ['89468.40000', '1', '1.000'],
            // c is missing
          },
        },
      })
    ) as any;

    const p = new KrakenProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toMatch(/price not found/i);
    }
  });

  it('returns error when price is not a valid number', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        error: [],
        result: {
          XXBTZUSD: {
            a: ['89468.50000', '5', '5.000'],
            b: ['89468.40000', '1', '1.000'],
            c: ['invalid', '0.00010958'],
            v: ['1466.47280552', '1476.89704981'],
            p: ['89585.77793', '89584.77415'],
            t: [59185, 60033],
            l: ['88470.90000', '88470.90000'],
            h: ['91099.50000', '91099.50000'],
            o: '89454.20000',
          },
        },
      })
    ) as any;

    const p = new KrakenProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toMatch(/not a valid number/i);
    }
  });

  it('correctly maps fiat to pair format', async () => {
    globalThis.fetch = vi.fn(() =>
      makeJsonResponse({
        error: [],
        result: {
          XXBTZEUR: {
            a: ['82000.50000', '3', '3.000'],
            b: ['82000.40000', '2', '2.000'],
            c: ['82000.50000', '0.001'],
            v: ['1234.56', '1245.67'],
            p: ['82100.00', '82100.00'],
            t: [50000, 51000],
            l: ['81000.00', '81000.00'],
            h: ['83000.00', '83000.00'],
            o: '82500.00',
          },
        },
      })
    ) as any;

    const p = new KrakenProvider();
    const res = await p.getCurrentPrice('eur');

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.value).toBe(82000.5);
    }

    // Verify the URL was called with the correct pair
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('pair=XBTEUR'),
      expect.any(Object)
    );
  });
});
