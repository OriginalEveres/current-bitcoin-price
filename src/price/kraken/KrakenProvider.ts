import { PriceProvider } from '../PriceProvider.js';
import { err, ok } from '../../utils.js';
import { FIAT, type Result } from '../../types.js';

/**
 * Implementation of PriceProvider for Kraken API.
 * API Documentation: https://docs.kraken.com/rest/
 * Free API - no API key required
 */
export class KrakenProvider extends PriceProvider {
  protected baseApiUrl = 'https://api.kraken.com';

  protected endpoints = {
    ticker: '0/public/Ticker',
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
   * Map fiat to Kraken pair format.
   * Kraken uses format like XBTUSD, XBTEUR (XBT is Bitcoin)
   */
  protected mapFiatToPair(fiat: string): string {
    const f = fiat.toUpperCase();
    return `XBT${f}`;
  }

  async getCurrentPrice(fiat = 'usd'): Promise<Result<number, string>> {
    const pair = this.mapFiatToPair(fiat);
    const url = new URLSearchParams({
      pair: pair,
    });
    const endpoint = `${this.endpoints.ticker}?${url.toString()}`;

    type TickerData = {
      a: string[]; // ask array: [price, whole lot volume, lot volume]
      b: string[]; // bid array: [price, whole lot volume, lot volume]
      c: string[]; // last trade closed: [price, lot volume]
      v: string[]; // volume: [today, last 24 hours]
      p: string[]; // volume weighted average price: [today, last 24 hours]
      t: number[]; // number of trades: [today, last 24 hours]
      l: string[]; // low: [today, last 24 hours]
      h: string[]; // high: [today, last 24 hours]
      o: string; // today's opening price
    };

    type ApiResponse = {
      error: string[];
      result: Record<string, TickerData>;
    };

    const result = await this.queryApi<ApiResponse>(endpoint);
    if (!result.success) {
      return err(result.error);
    }

    const apiResult = result.value;

    // Check for API errors
    if (apiResult.error && apiResult.error.length > 0) {
      return err(`Kraken API error: ${apiResult.error.join(', ')}`);
    }

    if (!apiResult.result) {
      return err('Invalid API response: no result found');
    }

    // The result key might be in different formats (XXBTZUSD, XBTUSD, etc.)
    // Get the first key from the result object
    const resultKeys = Object.keys(apiResult.result);
    if (resultKeys.length === 0) {
      return err('Invalid API response: no pair data found');
    }

    const pairData = apiResult.result[resultKeys[0]];
    if (!pairData || !pairData.c || pairData.c.length === 0) {
      return err('Invalid API response: price not found');
    }

    // Get the last trade price (c[0])
    const priceStr = pairData.c[0];
    const price = Number(priceStr);

    if (Number.isNaN(price)) {
      return err('Invalid API response: price is not a valid number');
    }

    this.setTrend(price);
    this.price = price;

    return ok(price);
  }
}

export default KrakenProvider;
