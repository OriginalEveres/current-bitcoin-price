import { describe, it, assert } from 'vitest';
import { createPriceProvider } from './createPriceProvider.js';
import { CoinGeckoProvider } from './coinGecko/CoinGeckoProvider.js';
import { PriceProviders } from './PriceProviders.js';
import BinanceProvider from './binance/BinanceProvider.js';
import CoinDeskProvider from './coinDesk/CoinDeskProvider.js';
import CoinBaseProvider from './coinbase/CoinBaseProvider.js';
import KrakenProvider from './kraken/KrakenProvider.js';

describe(createPriceProvider.name, () => {
  it('should resolve a correct provider (CoinGecko)', () => {
    const provider = createPriceProvider(PriceProviders.COINGECKO);
    assert.equal(provider.constructor.name, CoinGeckoProvider.name);
  });

  it('should resolve a correct provider (Binance)', () => {
    const provider = createPriceProvider(PriceProviders.BINANCE);
    assert.equal(provider.constructor.name, BinanceProvider.name);
  });

  it('should resolve a correct provider (CoinDesk)', () => {
    const provider = createPriceProvider(PriceProviders.COINDESK);
    assert.equal(provider.constructor.name, CoinDeskProvider.name);
  });

  it('should resolve a correct provider (CoinBase)', () => {
    const provider = createPriceProvider(PriceProviders.COINBASE);
    assert.equal(provider.constructor.name, CoinBaseProvider.name);
  });

  it('should resolve a correct provider (Kraken)', () => {
    const provider = createPriceProvider(PriceProviders.KRAKEN);
    assert.equal(provider.constructor.name, KrakenProvider.name);
  });

  it('should throw an error for unsupported provider', () => {
    try {
      // @ts-expect-error - intentionally passing invalid provider to exercise error path
      createPriceProvider('unsupported_provider');
      assert.fail('Expected error was not thrown');
    } catch (e) {
      assert.equal(
        (e as Error).message,
        'Unsupported price provider: unsupported_provider'
      );
    }
  });
});
