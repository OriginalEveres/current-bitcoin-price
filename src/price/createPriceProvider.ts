import {CoinGeckoProvider} from "./coinGecko/CoinGeckoProvider.js";

export enum PriceProviders {
    COINGECKO = 'coingecko',
}

export const createPriceProvider = (provider: PriceProviders) => {
    switch (provider) {
        case PriceProviders.COINGECKO:
            return new CoinGeckoProvider();
    }

    // ROADMAP implement factory logic to create and return different price provider instances
}