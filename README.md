# 🚀 current-bitcoin-price

A tiny, friendly TypeScript library to get the current Bitcoin price from pluggable providers (CoinGecko, Binance, ...). 🎯

**Quick summary** (2 lines)
- Use `fetchCurrentPrice()` for a one-line price lookup (defaults to CoinGecko). ⚡
- The library uses a Result pattern (ok / err) — no throws for expected failures. ✅

🔔 More providers coming soon — this is the strength of the package
- We ship a few providers today (CoinGecko default, Binance support) and will add more exchanges and data sources in upcoming releases. The pluggable provider design makes it easy to add and swap providers without changing your application logic. 🌐🔌

## ✨ Quick example (public usage)

```ts
import { fetchCurrentPrice } from './src/price/fetchCurrentPrice.js'

const res = await fetchCurrentPrice({}) // defaults to CoinGecko, USD (you can override both)
if (res.success) {
  console.log('BTC (USD):', res.value) // → 12345.67
} else {
  console.warn('Could not fetch price:', res.error)
}
```

## 📈 Get price + trend from a provider (advanced & small extra step)

```ts
import { createPriceProvider } from './src/price/createPriceProvider.js'
import { PriceProviders } from './src/price/PriceProviders.js'

const provider = createPriceProvider(PriceProviders.COINGECKO)
// first call will populate the provider's last price
const res = await provider.getCurrentPrice('usd')
if (res.success) {
  console.log('BTC (USD):', res.value)
  console.log('trend:', provider.getTrend()) // 'up' | 'down' | 'stable' 🔺/🔻/➡️
}
```

## 🧩 Result pattern
- Every call returns either `{ success: true, value }` or `{ success: false, error }`.
- This makes error handling explicit and composable — you check `res.success` and handle both cases. 🛡️

## 🔧 Using a provider directly (advanced)

```ts
import { createPriceProvider } from './src/price/createPriceProvider.js'
import { PriceProviders } from './src/price/PriceProviders.js'

const provider = createPriceProvider(PriceProviders.BINANCE)
const res = await provider.getCurrentPrice('usd')
if (res.success) console.log('price:', res.value)
```

## 📊 Trend (up / down / stable)
- Providers internally compute a simple trend when they fetch a new price by comparing to the previous value.
- The trend is one of: `"up" | "down" | "stable"`.
- Want the trend? Use `provider.getTrend()` after a successful call. 👍

---

## ❤️ Feel free to support
Lately, I've been spending a lot of time building open-source libraries like this one. If you find it useful, consider supporting my work: `bc1qh9nvunhut73hqwf9rsd6l6c0dqqlkv9j3a723n`. More cool libraries are coming soon! 🙏

---

(Full developer docs, tests, and implementation details remain in the repo for contributors — see the rest of this README.)
