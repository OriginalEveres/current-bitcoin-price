import { CoinGeckoProvider } from './coinGecko/CoinGeckoProvider.js';
import { PriceProviders } from './PriceProviders.js';
import BinanceProvider from './binance/BinanceProvider.js';
import CoinDeskProvider from './coinDesk/CoinDeskProvider.js';

export const createPriceProvider = (provider: PriceProviders) => {
  switch (provider) {
    case PriceProviders.COINGECKO:
      return new CoinGeckoProvider();
    case PriceProviders.BINANCE:
      return new BinanceProvider();
    case PriceProviders.COINDESK:
      return new CoinDeskProvider();
    default:
      throw new Error(`Unsupported price provider: ${provider}`);
  }
};
