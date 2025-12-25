import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import BinanceProvider from '../BinanceProvider.js'
import {FIAT} from "../../../types.js";

function makeJsonResponse(obj: unknown): Promise<Response> {
  // Create a minimal object shaped like a Response and cast it to Response for typing in tests
  const fake = {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(obj),
  } as unknown as Response
  return Promise.resolve(fake)
}

describe('BinanceProvider (unit)', () => {
  let originalFetch: typeof globalThis.fetch | undefined
  beforeEach(() => {
    originalFetch = globalThis.fetch
    vi.restoreAllMocks()
  })
  afterEach(() => {
    if (originalFetch) globalThis.fetch = originalFetch
  })

  it('parses price correctly', async () => {
    globalThis.fetch = vi.fn(() => makeJsonResponse({ symbol: 'BTCUSDT', price: '60000.12' })) as unknown as typeof globalThis.fetch

    const p = new BinanceProvider()
    const res = await p.getCurrentPrice(FIAT.USD)

    expect(res.success).toBe(true)
    if (res.success) expect(res.value).toBeCloseTo(60000.12)
  })

  it('handles non-ok response', async () => {
    const fakeErrorResponse = Promise.resolve({ ok: false, status: 500, statusText: 'err' } as unknown as Response)
    globalThis.fetch = vi.fn(() => fakeErrorResponse) as unknown as typeof globalThis.fetch
    const p = new BinanceProvider()
    const res = await p.getCurrentPrice(FIAT.USD)
    expect(res.success).toBe(false)
    if (!res.success) expect(res.error).toMatch(/API request failed/)
  })

  it('handles invalid price', async () => {
    globalThis.fetch = vi.fn(() => makeJsonResponse({ symbol: 'BTCUSDT', price: 'NaN' })) as unknown as typeof globalThis.fetch
    const p = new BinanceProvider()
    const res = await p.getCurrentPrice(FIAT.USD)
    expect(res.success).toBe(false)
    if (!res.success) expect(res.error).toMatch(/Invalid API response/)
  })
})
