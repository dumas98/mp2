import { departmentOf } from '../data/departments.ts'
import type { BrowseState } from '../types/navigation.ts'
import type { Product } from '../types/product.ts'
import { sortProducts } from './sorting.ts'

// Router state can be anything (old links, other pages), so check its shape
// and drop IDs of products that don't exist. Returns null if it isn't usable.
export function readBrowseState(state: unknown, products: Product[]): BrowseState | null {
  if (typeof state !== 'object' || state === null) return null
  const { ids, from } = state as Record<string, unknown>
  if (!Array.isArray(ids) || typeof from !== 'string' || !from.startsWith('/')) return null

  const known = new Set(products.map((p) => p.id))
  const validIds = ids.filter((id): id is number => typeof id === 'number' && known.has(id))
  return validIds.length > 0 ? { ids: validIds, from } : null
}

// Used when a product is opened without a list (typed URL, bookmark):
// its department, sorted by name.
export function fallbackBrowseState(product: Product, products: Product[]): BrowseState {
  const department = departmentOf(product.category)
  if (!department) return { ids: [product.id], from: '/all' }

  const members = products.filter((p) => department.categories.includes(p.category))
  return {
    ids: sortProducts(members, 'title', 'asc').map((p) => p.id),
    from: `/d/${department.slug}`,
  }
}

export interface Neighbors {
  // 1-based, for "3 of 21"
  position: number
  total: number
  previousId: number
  nextId: number
}

// Previous and next wrap around: next after the last is the first.
// Returns null if the product isn't in the list.
export function getNeighbors(ids: number[], id: number): Neighbors | null {
  const index = ids.indexOf(id)
  if (index === -1) return null

  const total = ids.length
  return {
    position: index + 1,
    total,
    previousId: ids[(index - 1 + total) % total],
    nextId: ids[(index + 1) % total],
  }
}
