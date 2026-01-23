import { PriceProvider } from '../PriceProvider.js';
import { err, ok } from '../../utils.js';
import { FIAT, type Result } from '../../types.js';

type ApiResponse = {
  ask: string;
  bid: string;
  volume: string;
  trade_id: number;
  price: string;
  size: string;
  time: string;
  rfq_volume?: string;
};

/**
 * Implementation of PriceProvider for Coinbase Exchange API.
 * API Documentation: https://docs.cloud.coinbase.com/exchange/docs
 * Free API - no API key required
 */
export class CoinBaseProvider extends PriceProvider {
  protected baseApiUrl = 'https://api.exchange.coinbase.com';

  protected endpoints = {
    ticker: 'products',
  };

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
   * Map fiat to Coinbase product ID.
   * Coinbase uses format like BTC-USD, BTC-EUR
   */
  protected mapFiatToProductId(fiat: string): string {
    const f = fiat.toUpperCase();
    return `BTC-${f}`;
  }

  async getCurrentPrice(fiat = 'usd'): Promise<Result<number, string>> {
    const productId = this.mapFiatToProductId(fiat);
    const endpoint = `${this.endpoints.ticker}/${productId}/ticker`;

    const result = await this.queryApi<ApiResponse>(endpoint);
    if (!result.success) {
      return err(result.error);
    }

    const priceStr = result.value?.price;
    if (!priceStr) {
      return err('Invalid API response: price not found');
    }

    const price = Number(priceStr);
    if (Number.isNaN(price)) {
      return err('Invalid API response: price is not a valid number');
    }

    this.setTrend(price);
    this.price = price;

    return ok(price);
  }
}

export default CoinBaseProvider;
