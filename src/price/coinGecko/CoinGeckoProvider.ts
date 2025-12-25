import { PriceProvider } from '../PriceProvider.js';
import { err, ok } from '../../utils.js';
import { FIAT, type Result } from '../../types.js';

/**
 * Implementation of PriceProvider for CoinGecko API.
 * API Documentation: https://www.coingecko.com/en/api/documentation
 */
export class CoinGeckoProvider extends PriceProvider {
  protected baseApiUrl = 'https://api.coingecko.com/api/v3';

  protected endpoints = {
    currentPrice: 'simple/price',
  };

  protected supportedFiat = [FIAT.USD, FIAT.EUR];

  protected price: number = 0;

  constructor(apiKey?: string) {
    super(apiKey);
  }

  // CoinGecko doesn't need special headers for the public endpoints
  protected prepareRequestHeaders(): Record<string, string> {
    return {
      Accept: 'application/json',
    };
  }

  async getCurrentPrice(fiat = 'usd'): Promise<Result<number, string>> {
    const url = new URLSearchParams({
      ids: 'bitcoin',
      vs_currencies: fiat,
    });
    const endpoint = `${this.endpoints.currentPrice}?${url.toString()}`;

    type ApiResponse = Record<string, Record<string, number>>;

    const result = await this.queryApi<ApiResponse>(endpoint);
    if (!result.success) {
      return err(result.error);
    }

    const price = result.value['bitcoin']?.[fiat];
    if (typeof price !== 'number') {
      return err('Invalid API response: price not found');
    }

    this.setTrend(price);
    this.price = price;

    return ok(price);
  }
}
