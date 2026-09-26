import type { Product, SortKey, SortOrder } from '../types/product.ts'
import { displayPrice } from './pricing.ts'

interface SortOption {
  label: string
  // Direction used when this key is picked, e.g. highest rating first
  natural: SortOrder
  // How each direction reads for this key
  asc: string
  desc: string
}

export const SORT_OPTIONS: Record<SortKey, SortOption> = {
  title: { label: 'Name', natural: 'asc', asc: 'A to Z', desc: 'Z to A' },
  price: { label: 'Price', natural: 'asc', asc: 'Low to high', desc: 'High to low' },
  rating: { label: 'Rating', natural: 'desc', asc: 'Lowest first', desc: 'Highest first' },
  discount: { label: 'Discount', natural: 'desc', asc: 'Smallest first', desc: 'Biggest first' },
}

export const SORT_KEYS = Object.keys(SORT_OPTIONS) as SortKey[]

export function isSortKey(value: unknown): value is SortKey {
  return SORT_KEYS.includes(value as SortKey)
}

// numeric: true puts "iPhone 6" before "iPhone 13"
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true })

const NUMERIC_VALUE: Record<Exclude<SortKey, 'title'>, (product: Product) => number> = {
  price: displayPrice,
  rating: (product) => product.rating,
  discount: (product) => product.discountPercentage,
}

// Returns a new array. Ties are always broken by name A to Z, then id,
// so equal items never swap places between renders.
export function sortProducts(products: Product[], key: SortKey, order: SortOrder): Product[] {
  const direction = order === 'asc' ? 1 : -1

  return [...products].sort((a, b) => {
    const diff =
      key === 'title' ? collator.compare(a.title, b.title) : NUMERIC_VALUE[key](a) - NUMERIC_VALUE[key](b)
    if (diff !== 0) return diff * direction
    return collator.compare(a.title, b.title) || a.id - b.id
  })
}
