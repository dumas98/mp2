import { categoryLabel, departmentOf } from '../data/departments.ts'
import type { AvailabilityStatus, Filters, PriceRange, Product } from '../types/product.ts'
import { displayPrice, isOnSale } from './pricing.ts'

export const PRICE_RANGES: { value: PriceRange; label: string; test: (price: number) => boolean }[] = [
  { value: 'under-25', label: 'Under $25', test: (price) => price < 25 },
  { value: '25-100', label: '$25 to $100', test: (price) => price >= 25 && price < 100 },
  { value: '100-1000', label: '$100 to $1,000', test: (price) => price >= 100 && price < 1000 },
  { value: 'over-1000', label: '$1,000 and up', test: (price) => price >= 1000 },
]

// slug is the value used in the URL (?avail=low-stock)
export const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; slug: string; label: string }[] = [
  { value: 'In Stock', slug: 'in-stock', label: 'In stock' },
  { value: 'Low Stock', slug: 'low-stock', label: 'Low stock' },
  { value: 'Out of Stock', slug: 'out-of-stock', label: 'Out of stock' },
]

export const RATING_OPTIONS = [4, 3]

export const EMPTY_FILTERS: Filters = {
  query: '',
  departments: [],
  categories: [],
  prices: [],
  minRating: null,
  availability: [],
  onSale: false,
}

// One key per filter group; used to leave a group out when counting
export type FilterKey = keyof Filters

// Case-insensitive. Every word must appear in the title, brand or category,
// so "apple watch" needs both words.
export function matchesQuery(product: Product, query: string): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const text = [product.title, product.brand ?? '', categoryLabel(product.category)].join(' ').toLowerCase()
  return words.every((word) => text.includes(word))
}

// Within a group any value may match; every active group must match.
function matchesFilters(product: Product, filters: Filters, skip?: FilterKey): boolean {
  if (skip !== 'query' && !matchesQuery(product, filters.query)) return false

  if (skip !== 'departments' && filters.departments.length > 0) {
    const slug = departmentOf(product.category)?.slug
    if (!slug || !filters.departments.includes(slug)) return false
  }

  if (skip !== 'categories' && filters.categories.length > 0 && !filters.categories.includes(product.category)) {
    return false
  }

  if (skip !== 'prices' && filters.prices.length > 0) {
    const price = displayPrice(product)
    const inRange = PRICE_RANGES.some((range) => filters.prices.includes(range.value) && range.test(price))
    if (!inRange) return false
  }

  if (skip !== 'minRating' && filters.minRating !== null && product.rating < filters.minRating) return false

  if (
    skip !== 'availability' &&
    filters.availability.length > 0 &&
    !filters.availability.includes(product.availabilityStatus)
  ) {
    return false
  }

  if (skip !== 'onSale' && filters.onSale && !isOnSale(product)) return false

  return true
}

// skip leaves one group out, which the sidebar counts need
export function applyFilters(products: Product[], filters: Filters, skip?: FilterKey): Product[] {
  return products.filter((product) => matchesFilters(product, filters, skip))
}

export interface FacetCounts {
  departments: Record<string, number>
  categories: Record<string, number>
  prices: Record<string, number>
  minRating: Record<string, number>
  availability: Record<string, number>
  onSale: number
  // Results with no rating filter, shown next to "Any rating"
  anyRating: number
}

function countBy(products: Product[], keyOf: (product: Product) => string | undefined): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const product of products) {
    const key = keyOf(product)
    if (key) counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

// For each sidebar option: how many results there would be if it were checked,
// given the search and every other active group.
export function facetCounts(products: Product[], filters: Filters): FacetCounts {
  const forPrices = applyFilters(products, filters, 'prices')
  const forRating = applyFilters(products, filters, 'minRating')

  return {
    departments: countBy(applyFilters(products, filters, 'departments'), (p) => departmentOf(p.category)?.slug),
    categories: countBy(applyFilters(products, filters, 'categories'), (p) => p.category),
    prices: Object.fromEntries(
      PRICE_RANGES.map((range) => [range.value, forPrices.filter((p) => range.test(displayPrice(p))).length]),
    ),
    minRating: Object.fromEntries(
      RATING_OPTIONS.map((min) => [String(min), forRating.filter((p) => p.rating >= min).length]),
    ),
    availability: countBy(applyFilters(products, filters, 'availability'), (p) => p.availabilityStatus),
    onSale: applyFilters(products, filters, 'onSale').filter(isOnSale).length,
    anyRating: forRating.length,
  }
}
