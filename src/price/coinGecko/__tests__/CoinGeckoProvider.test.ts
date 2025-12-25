import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {CoinGeckoProvider} from '../CoinGeckoProvider.js'

function makeJsonResponse(obj: unknown, okFlag = true) {
  return Promise.resolve({
    ok: okFlag,
    json: () => Promise.resolve(obj)
  }) as unknown as Response
}

describe(CoinGeckoProvider.name, () => {
  let originalFetch: typeof globalThis.fetch

  beforeEach(() => {
    originalFetch = globalThis.fetch
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('returns ok result with numeric price', async () => {
    globalThis.fetch = vi.fn(() => makeJsonResponse({ bitcoin: { usd: 12345 } })) as any

    const p = new CoinGeckoProvider()
    const res = await p.getCurrentPrice('usd')

    expect(res.success).toBe(true)
    if (res.success) {
      expect(res.value).toBe(12345)
    }
  })

  it('returns error when response not ok', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500, statusText: 'err' }) as any)

    const p = new CoinGeckoProvider()
    const res = await p.getCurrentPrice('usd')

    expect(res.success).toBe(false)
    if (!res.success) {
      expect(res.error).toContain('API request failed')
    }
  })

  it('returns error when price shape is unexpected', async () => {
    globalThis.fetch = vi.fn(() => makeJsonResponse({ btc: { usd: 'NaN' } })) as any

    const p = new CoinGeckoProvider()
    const res = await p.getCurrentPrice('usd')

    expect(res.success).toBe(false)
    if (!res.success) {
      expect(res.error).toMatch(/Invalid API response/i)
    }
  })
})

