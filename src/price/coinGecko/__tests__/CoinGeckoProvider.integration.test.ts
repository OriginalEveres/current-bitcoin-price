import { describe, it, expect } from 'vitest'
import {CoinGeckoProvider} from '../CoinGeckoProvider.js'

const runIntegration = Boolean(process.env.RUN_INTEGRATION)

describe('CoinGeckoProvider (integration)', () => {
  it('fetches real BTC price from CoinGecko (skip unless RUN_INTEGRATION=true)', async () => {
    if (!runIntegration) {
      console.warn('Skipping integration test - set RUN_INTEGRATION=true to enable')
      return
    }

    const p = new CoinGeckoProvider()
    const res = await p.getCurrentPrice('usd')

    expect(res.success).toBe(true)
    if (res.success) {
      expect(typeof res.value).toBe('number')
      expect(res.value).toBeGreaterThan(0)
    }
  })
})

