/**
 * Exporting abstract PriceProvider class in case of custom implementations.
 */
export { PriceProvider } from './price/PriceProvider.js';

/**
 * Factory function to create price provider instances.
 */
export { createPriceProvider } from './price/createPriceProvider.js';

/**
 * Common types used across the library.
 */
export { FIAT } from './types.js';
export { PriceProviders } from './price/PriceProviders.js';

/**
 * Function to fetch the current price using the default provider.
 * FP approach.
 */
export { fetchCurrentPrice } from './price/fetchCurrentPrice.js';
