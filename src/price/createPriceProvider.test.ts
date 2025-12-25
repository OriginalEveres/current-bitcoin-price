import {describe, it, assert} from "vitest";
import {createPriceProvider, PriceProviders} from "./createPriceProvider.js";
import {CoinGeckoProvider} from "./coinGecko/CoinGeckoProvider.js";

describe(createPriceProvider.name, () => {
    it("should resolve a correct provider", () => {
        const provider = createPriceProvider(PriceProviders.COINGECKO);
        assert.equal(provider.constructor.name, CoinGeckoProvider.name);
    })
})
