import { describe, expect, it } from 'vitest';
import BinanceProvider from '../BinanceProvider.js';
import { FIAT } from '../../../types.js';

const runIntegration = Boolean(process.env.RUN_INTEGRATION);

describe('BinanceProvider (integration)', () => {
  it('fetches real BTC price from Binance (skip unless RUN_INTEGRATION=true)', async () => {
    if (!runIntegration) {
      console.warn(
        'Skipping integration test - set RUN_INTEGRATION=true to enable'
      );
      return;
    }

    const p = new BinanceProvider();
    const res = await p.getCurrentPrice(FIAT.USD);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(typeof res.value).toBe('number');
      expect(res.value).toBeGreaterThan(0);
    }
  });
});
