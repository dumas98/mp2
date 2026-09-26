import { DEPARTMENTS } from '../data/departments.ts'
import type { Filters, PriceRange, SortKey, SortOrder } from '../types/product.ts'
import { AVAILABILITY_OPTIONS, PRICE_RANGES, RATING_OPTIONS } from './filtering.ts'
import { isSortKey, SORT_OPTIONS } from './sorting.ts'

// Everything the list and gallery pages keep in the URL
export interface BrowseParams {
  filters: Filters
  sort: SortKey
  order: SortOrder
}

export const DEFAULT_SORT: SortKey = 'title'

const DEPARTMENT_SLUGS = DEPARTMENTS.map((d) => d.slug)
const CATEGORY_SLUGS = DEPARTMENTS.flatMap((d) => d.categories)
const PRICE_VALUES = PRICE_RANGES.map((r) => r.value)
const AVAILABILITY_SLUGS = AVAILABILITY_OPTIONS.map((o) => o.slug)

// Lists use repeated keys (?cat=laptops&cat=tablets), which stay readable in
// the address bar. Unknown or repeated values are dropped.
function readList<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[]): T[] {
  const values = params.getAll(key).filter((v): v is T => allowed.includes(v as T))
  return [...new Set(values)]
}

export function parseBrowseParams(params: URLSearchParams): BrowseParams {
  const sortParam = params.get('sort')
  const sort = isSortKey(sortParam) ? sortParam : DEFAULT_SORT

  const orderParam = params.get('order')
  const order: SortOrder = orderParam === 'asc' || orderParam === 'desc' ? orderParam : SORT_OPTIONS[sort].natural

  const rating = Number(params.get('rating'))
  const availability = readList(params, 'avail', AVAILABILITY_SLUGS).map(
    (slug) => AVAILABILITY_OPTIONS.find((o) => o.slug === slug)!.value,
  )

  return {
    filters: {
      // Kept exactly as typed (not trimmed), so spaces survive while typing
      query: params.get('q') ?? '',
      departments: readList(params, 'dept', DEPARTMENT_SLUGS),
      categories: readList(params, 'cat', CATEGORY_SLUGS),
      prices: readList<PriceRange>(params, 'price', PRICE_VALUES),
      minRating: RATING_OPTIONS.includes(rating) ? rating : null,
      availability,
      onSale: params.get('sale') === '1',
    },
    sort,
    order,
  }
}

// Default values are left out, so plain /all means "no filters, name A to Z"
export function toSearchParams({ filters, sort, order }: BrowseParams): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.query) params.set('q', filters.query)
  for (const slug of filters.departments) params.append('dept', slug)
  for (const category of filters.categories) params.append('cat', category)
  for (const range of filters.prices) params.append('price', range)
  if (filters.minRating !== null) params.set('rating', String(filters.minRating))
  for (const status of filters.availability) {
    params.append('avail', AVAILABILITY_OPTIONS.find((o) => o.value === status)!.slug)
  }
  if (filters.onSale) params.set('sale', '1')
  if (sort !== DEFAULT_SORT) params.set('sort', sort)
  if (order !== SORT_OPTIONS[sort].natural) params.set('order', order)
  return params
}

// Filter groups that hold a list of checked values
export type ListFilterKey = 'departments' | 'categories' | 'prices' | 'availability'

// Checks or unchecks one value. Changing departments also drops categories
// that no longer belong to a checked department, so no hidden filter stays active.
export function toggleFilterValue<K extends ListFilterKey>(
  filters: Filters,
  key: K,
  value: Filters[K][number],
): Filters {
  const current = filters[key] as string[]
  const wasChecked = current.includes(value)
  const next: Filters = {
    ...filters,
    [key]: wasChecked ? current.filter((v) => v !== value) : [...current, value],
  }
  if (key !== 'departments') return next

  const removed = wasChecked ? (DEPARTMENTS.find((d) => d.slug === value)?.categories ?? []) : []
  const allowed = DEPARTMENTS.filter((d) => next.departments.includes(d.slug)).flatMap((d) => d.categories)
  return {
    ...next,
    categories: next.categories.filter(
      (c) => !removed.includes(c) && (next.departments.length === 0 || allowed.includes(c)),
    ),
  }
}

// Number of active filters, not counting the search text. Shown on the
// "Filters (2)" button on phones.
export function countActiveFilters(filters: Filters): number {
  return (
    filters.departments.length +
    filters.categories.length +
    filters.prices.length +
    (filters.minRating !== null ? 1 : 0) +
    filters.availability.length +
    (filters.onSale ? 1 : 0)
  )
}
