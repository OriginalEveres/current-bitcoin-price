import {FIAT, type Result, type Trend} from "../types.js";
import {ok, err} from "../utils.js";

export abstract class PriceProvider {
    /**
     * Base URL for the price service API.
     * @protected
     */
    protected abstract baseApiUrl: string;

    /**
     * API endpoints for the price service.
     * ROADMAP: consider adding types for endpoints. + support for history rates.
     * @protected
     */
    protected abstract endpoints: Record<string, string>;

    /**
     * Current price of the asset.
     * Used to determine trend.
     *
     * ROADMAP: implement a caching mechanism to store the previous price
     * @protected
     */
    protected price: number = 0;

    /**
     * Current trend of the asset price.
     * Compares to previously fetched price.
     * @protected
     */
    protected trend: Trend = 'stable';

    /**
     * API key for accessing the price service.
     * NULL by default, since default APIs are free.
     * @protected
     */
    private apiKey: string | null = null;

    /**
     * Provider supported fiat representation of BTC price.
     * @protected
     */
    protected abstract supportedFiat: Partial<FIAT>[];

    /**
     * Constructor for PriceProvider.
     * @param apiKey
     */
    constructor(apiKey?: string) {
        if (apiKey) this.apiKey = apiKey;
    }

    /**
     * Queries the API endpoint with optional parameters.
     * @param endpoint
     * @param params
     * @protected
     */
    protected async queryApi<T>(endpoint: string, params?: Record<string, string | number>): Promise<Result<T, string>> {
        const headers = this.prepareRequestHeaders() || {};
        const url = this.setupUrl(endpoint);

        const result = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!result.ok) {
            return err(`API request failed with status ${result.status}: ${result.statusText}`);
        }

        // ROADMAP: implement data validation here for T

        return ok(result.json() as T);
    }

    /**
     * Updates the trend based on the current price.
     * Has to be called after fetching a new price and before updating the price property.
     * @param currentPrice
     * @protected
     */
    protected setTrend(currentPrice: number): void {
        // if no previous price, cannot determine trend
        if (this.price === 0) {
            return;
        }

        if (currentPrice > this.price) {
            this.trend = 'up';
        } else if (currentPrice < this.price) {
            this.trend = 'down';
        } else {
            this.trend = 'stable';
        }
    }

    /**
     * Fetches the current price for Bitcoin.
     * Implementations are asynchronous and should return a Promise<number>.
     * @protected
     */
    protected abstract getCurrentPrice(): Promise<Result<number, string>>;

    /**
     * Constructs the full endpoint URL.
     * @param endpoint
     * @protected
     */
    protected setupUrl(endpoint: string): string {
        return `${this.baseApiUrl}/${endpoint}`;
    }

    /**
     * Prepares the request headers for API calls.
     * Provider-specific implementation required.
     * @protected
     */
    protected abstract prepareRequestHeaders(): Record<string, string>;
}