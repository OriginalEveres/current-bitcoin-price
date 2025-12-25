import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';

// Mock the createPriceProvider module before importing the function under test
vi.mock('../createPriceProvider.js', () => ({
  createPriceProvider: vi.fn(),
}));

import { fetchCurrentPrice } from '../fetchCurrentPrice.js';
import { PriceProviders } from '../PriceProviders.js';
import * as cpModule from '../createPriceProvider.js';

describe(fetchCurrentPrice.name, () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('uses CoinGecko by default and returns success result', async () => {
    const fakeProvider = {
      getCurrentPrice: vi
        .fn()
        .mockResolvedValue({ success: true, value: 4242 }),
    };

    const mockedCreate = cpModule.createPriceProvider as unknown as Mock;
    mockedCreate.mockReturnValue(fakeProvider);

    const res = await fetchCurrentPrice({});

    expect(cpModule.createPriceProvider).toHaveBeenCalledWith(
      PriceProviders.COINGECKO
    );
    expect(res).toEqual({ success: true, value: 4242 });
    expect(fakeProvider.getCurrentPrice).toHaveBeenCalledWith('usd');
  });

  it('passes provided provider to factory and returns error result', async () => {
    const fakeProvider = {
      getCurrentPrice: vi
        .fn()
        .mockResolvedValue({ success: false, error: 'oops' }),
    };

    const mockedCreate = cpModule.createPriceProvider as unknown as Mock;
    mockedCreate.mockReturnValue(fakeProvider);

    const res = await fetchCurrentPrice({ provider: PriceProviders.BINANCE });

    expect(cpModule.createPriceProvider).toHaveBeenCalledWith(
      PriceProviders.BINANCE
    );
    expect(res).toEqual({ success: false, error: 'oops' });
    expect(fakeProvider.getCurrentPrice).toHaveBeenCalledWith('usd');
  });
});
