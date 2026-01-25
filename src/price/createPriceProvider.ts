import { CoinGeckoProvider } from './coinGecko/CoinGeckoProvider.js';
import { PriceProviders } from './PriceProviders.js';
import BinanceProvider from './binance/BinanceProvider.js';
import CoinDeskProvider from './coinDesk/CoinDeskProvider.js';
import CoinBaseProvider from './coinbase/CoinBaseProvider.js';
import KrakenProvider from './kraken/KrakenProvider.js';

export const createPriceProvider = (provider: PriceProviders) => {
  switch (provider) {
    case PriceProviders.COINGECKO:
      return new CoinGeckoProvider();
    case PriceProviders.BINANCE:
      return new BinanceProvider();
    case PriceProviders.COINDESK:
      return new CoinDeskProvider();
    case PriceProviders.COINBASE:
      return new CoinBaseProvider();
    case PriceProviders.KRAKEN:
      return new KrakenProvider();
    default:
      throw new Error(`Unsupported price provider: ${provider}`);
  }
};
