import type { Product } from '../types/product.ts'

// Every DummyJSON product has a discount between 0% and 20%. Only the larger
// ones count as a sale, otherwise every price would be crossed out.
export const SALE_THRESHOLD = 15

export function isOnSale(product: Product): boolean {
  return product.discountPercentage >= SALE_THRESHOLD
}

// The API price is the price before the discount
export function salePrice(product: Product): number {
  const discounted = product.price * (1 - product.discountPercentage / 100)
  return Math.round(discounted * 100) / 100
}

// The price shown to shoppers, also used for sorting and price filters
export function displayPrice(product: Product): number {
  return isOnSale(product) ? salePrice(product) : product.price
}

// e.g. 19.61 -> "−20%"
export function discountLabel(product: Product): string {
  return `−${Math.round(product.discountPercentage)}%`
}
