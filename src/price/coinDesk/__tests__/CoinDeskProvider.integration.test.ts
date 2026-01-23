import { describe, it, expect } from 'vitest';
import { CoinDeskProvider } from '../CoinDeskProvider.js';

const runIntegration = Boolean(process.env.RUN_INTEGRATION);

describe('CoinDeskProvider (integration)', () => {
  it('fetches real BTC price from CoinDesk (skip unless RUN_INTEGRATION=true)', async () => {
    if (!runIntegration) {
      console.warn(
        'Skipping integration test - set RUN_INTEGRATION=true to enable'
      );
      return;
    }

    const p = new CoinDeskProvider();
    const res = await p.getCurrentPrice('usd');

    expect(res.success).toBe(true);
    if (res.success) {
      expect(typeof res.value).toBe('number');
      expect(res.value).toBeGreaterThan(0);
    }
  });

  it('fetches EUR price from CoinDesk (skip unless RUN_INTEGRATION=true)', async () => {
    if (!runIntegration) {
      console.warn(
        'Skipping integration test - set RUN_INTEGRATION=true to enable'
      );
      return;
    }

    const p = new CoinDeskProvider();
    const res = await p.getCurrentPrice('eur');

    expect(res.success).toBe(true);
    if (res.success) {
      expect(typeof res.value).toBe('number');
      expect(res.value).toBeGreaterThan(0);
    }
  });
});
