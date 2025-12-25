import { PriceProviders } from './PriceProviders.js';
import { createPriceProvider } from './createPriceProvider.js';
import { FIAT } from '../types.js';

type FetchCurrentPriceParams = {
  provider?: PriceProviders;
};

export const fetchCurrentPrice = async ({
  provider,
}: FetchCurrentPriceParams) => {
  const pricingProvider = createPriceProvider(
    provider || PriceProviders.COINGECKO
  );

  return await pricingProvider.getCurrentPrice(FIAT.USD);
};
