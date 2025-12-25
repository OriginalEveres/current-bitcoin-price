import { PriceProvider } from '../PriceProvider.js';
import { ok, err } from '../../utils.js';
import { FIAT, type Result } from '../../types.js';

/**
 * Implementation of PriceProvider for Binance public API.
 * Docs: https://api.binance.com
 */
export class BinanceProvider extends PriceProvider {
  protected baseApiUrl = 'https://api.binance.com';

  protected endpoints = {
    currentPrice: 'api/v3/ticker/price',
  };

  // Support common fiats; map usd to USDT for Binance pairs
  protected supportedFiat = [FIAT.USD, FIAT.EUR];

  protected price: number = 0;

  constructor(apiKey?: string) {
    super(apiKey);
  }

  protected prepareRequestHeaders(): Record<string, string> {
    return {
      Accept: 'application/json',
    };
  }

  /**
   * Map fiat to Binance symbol suffix. For USD we use USDT as Binance often provides BTCUSDT.
   */
  protected mapFiatToSymbolSuffix(fiat: FIAT): string {
    const f = fiat.toLowerCase();
    if (f === FIAT.USD) return 'USDT';
    if (f === FIAT.EUR) return 'EUR';
    return f.toUpperCase();
  }

  async getCurrentPrice(fiat = FIAT.USD): Promise<Result<number, string>> {
    const suffix = this.mapFiatToSymbolSuffix(fiat);
    const symbol = `BTC${suffix}`;

    const endpoint = `${this.endpoints.currentPrice}?symbol=${encodeURIComponent(symbol)}`;

    type ApiResponse = { symbol: string; price: string };

    const result = await this.queryApi<ApiResponse>(endpoint);
    if (!result.success) {
      return err(result.error);
    }

    const priceStr = result.value?.price;
    const price = Number(priceStr);
    if (!price || Number.isNaN(price)) {
      return err('Invalid API response: price not found');
    }

    this.setTrend(price);
    this.price = price;

    return ok(price);
  }
}

export default BinanceProvider;
