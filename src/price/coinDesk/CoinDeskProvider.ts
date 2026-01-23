import { PriceProvider } from '../PriceProvider.js';
import { err, ok } from '../../utils.js';
import { FIAT, type Result } from '../../types.js';

type InstrumentData = {
  TYPE: string;
  MARKET: string;
  INSTRUMENT: string;
  VALUE: number;
  VALUE_FLAG: string;
  VALUE_LAST_UPDATE_TS: number;
};

type ApiResponse = {
  Data: Record<string, InstrumentData>;
  Err: Record<string, unknown>;
};

/**
 * Implementation of PriceProvider for CoinDesk API.
 * API Documentation: https://data-api.coindesk.com/
 * Free API - no API key required
 */
export class CoinDeskProvider extends PriceProvider {
  protected baseApiUrl = 'https://data-api.coindesk.com';

  protected endpoints = {
    currentPrice: 'index/cc/v1/latest/tick',
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
   * Map fiat to CoinDesk instrument code.
   * CoinDesk uses format like BTC-USD, BTC-EUR
   */
  protected mapFiatToInstrument(fiat: string): string {
    const f = fiat.toUpperCase();
    return `BTC-${f}`;
  }

  async getCurrentPrice(fiat = 'usd'): Promise<Result<number, string>> {
    const instrument = this.mapFiatToInstrument(fiat);
    const url = new URLSearchParams({
      market: 'ccix',
      instruments: instrument,
    });
    const endpoint = `${this.endpoints.currentPrice}?${url.toString()}`;

    const result = await this.queryApi<ApiResponse>(endpoint);
    if (!result.success) {
      return err(result.error);
    }

    const data = result.value?.Data;
    if (!data) {
      return err('Invalid API response: no data found');
    }

    const instrumentData = data[instrument];
    if (!instrumentData) {
      return err(`Invalid API response: instrument ${instrument} not found`);
    }

    const price = instrumentData.VALUE;
    if (typeof price !== 'number') {
      return err('Invalid API response: price not found');
    }

    this.setTrend(price);
    this.price = price;

    return ok(price);
  }
}

export default CoinDeskProvider;
