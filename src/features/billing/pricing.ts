export const PRICING = {
  month: { label: '₱149 / month', months: 1 },
  year: { label: '₱1,430 / year', months: 12 },
} as const

export type BillingInterval = keyof typeof PRICING
