/**
 * Currency utility — V2 Paystack ready
 * Detects user currency and formats pricing accordingly
 * Currently stubbed for V1 — activated in V2 with Paystack
 */

export type SupportedCurrency = 'NGN' | 'GHS' | 'KES' | 'USD' | 'EUR' | 'GBP'

export interface PricingConfig {
  currency: SupportedCurrency
  symbol: string
  monthlyPrice: number
  weeklyPrice: number
  quarterlyPrice: number
  locale: string
}

// V2: prices per currency
export const PRICING: Record<SupportedCurrency, PricingConfig> = {
  NGN: {
    currency: 'NGN',
    symbol: '₦',
    monthlyPrice: 4500,
    weeklyPrice: 1500,
    quarterlyPrice: 11000,
    locale: 'en-NG',
  },
  GHS: {
    currency: 'GHS',
    symbol: 'GH₵',
    monthlyPrice: 25,
    weeklyPrice: 8,
    quarterlyPrice: 60,
    locale: 'en-GH',
  },
  KES: {
    currency: 'KES',
    symbol: 'KSh',
    monthlyPrice: 650,
    weeklyPrice: 200,
    quarterlyPrice: 1600,
    locale: 'en-KE',
  },
  USD: {
    currency: 'USD',
    symbol: '$',
    monthlyPrice: 3,
    weeklyPrice: 1,
    quarterlyPrice: 7,
    locale: 'en-US',
  },
  EUR: {
    currency: 'EUR',
    symbol: '€',
    monthlyPrice: 2.99,
    weeklyPrice: 0.99,
    quarterlyPrice: 6.99,
    locale: 'de-DE',
  },
  GBP: {
    currency: 'GBP',
    symbol: '£',
    monthlyPrice: 2.49,
    weeklyPrice: 0.79,
    quarterlyPrice: 5.99,
    locale: 'en-GB',
  },
}

// Format price with currency symbol
export function formatPrice(
  amount: number,
  currency: SupportedCurrency
): string {
  const config = PRICING[currency]
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: currency === 'NGN' ? 0 : 2,
  }).format(amount)
}

// V1: always returns NGN
// V2: detect from browser locale or user profile
export function detectCurrency(): SupportedCurrency {
  if (typeof window === 'undefined') return 'NGN'

  const locale = navigator.language || 'en-NG'

  const localeMap: Record<string, SupportedCurrency> = {
    'en-NG': 'NGN',
    'en-GH': 'GHS',
    'en-KE': 'KES',
    'en-US': 'USD',
    'en-GB': 'GBP',
    'de-DE': 'EUR',
    'de-AT': 'EUR',
    'de-CH': 'EUR',
  }

  return localeMap[locale] ?? 'NGN'
}

// Get pricing config for current user
export function getUserPricing(): PricingConfig {
  const currency = detectCurrency()
  return PRICING[currency]
}
