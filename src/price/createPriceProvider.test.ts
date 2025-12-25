import {describe, it, assert} from "vitest";
import {createPriceProvider} from "./createPriceProvider.js";
import {CoinGeckoProvider} from "./coinGecko/CoinGeckoProvider.js";
import {PriceProviders} from "./PriceProviders.js";

describe(createPriceProvider.name, () => {
    it("should resolve a correct provider", () => {
        const provider = createPriceProvider(PriceProviders.COINGECKO);
        assert.equal(provider.constructor.name, CoinGeckoProvider.name);
    })
})
