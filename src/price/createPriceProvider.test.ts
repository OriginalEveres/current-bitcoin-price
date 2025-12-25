import {describe, it, assert} from "vitest";
import {createPriceProvider} from "./createPriceProvider.js";
import {CoinGeckoProvider} from "./coinGecko/CoinGeckoProvider.js";
import {PriceProviders} from "./PriceProviders.js";
import BinanceProvider from "./binance/BinanceProvider.js";

describe(createPriceProvider.name, () => {
    it("should resolve a correct provider (CoinGecko)", () => {
        const provider = createPriceProvider(PriceProviders.COINGECKO);
        assert.equal(provider.constructor.name, CoinGeckoProvider.name);
    })

    it("should resolve a correct provider (Binance)", () => {
        const provider = createPriceProvider(PriceProviders.BINANCE);
        assert.equal(provider.constructor.name, BinanceProvider.name);
    })

    it("should throw an error for unsupported provider", () => {
        try {
            // @ts-ignore
            createPriceProvider("unsupported_provider");
            assert.fail("Expected error was not thrown");
        } catch (e) {
            assert.equal((e as Error).message, "Unsupported price provider: unsupported_provider");
        }
    })
})
