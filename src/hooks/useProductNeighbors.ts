import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { departmentOf } from '../data/departments.ts'
import { fallbackBrowseState, getNeighbors, readBrowseState } from '../lib/navigation.ts'
import type { BrowseState } from '../types/navigation.ts'
import type { Product } from '../types/product.ts'
import { useProducts } from './useProducts.ts'

export interface ProductNeighbors {
  position: number
  total: number
  previous: Product
  next: Product
  // Passed on by the previous / next links so the whole trip follows one list
  linkState: BrowseState
  backTo: string
  backLabel: string
}

// Previous / next for the detail page: the list the shopper came from if the
// link carried one, otherwise the product's department sorted by name.
export function useProductNeighbors(product: Product): ProductNeighbors {
  const { products } = useProducts()
  const location = useLocation()

  return useMemo(() => {
    const carried = readBrowseState(location.state, products)
    const fromList = carried && getNeighbors(carried.ids, product.id) ? carried : null
    const linkState = fromList ?? fallbackBrowseState(product, products)
    const neighbors = getNeighbors(linkState.ids, product.id) ?? {
      position: 1,
      total: 1,
      previousId: product.id,
      nextId: product.id,
    }
    const byId = (id: number) => products.find((p) => p.id === id) ?? product

    return {
      position: neighbors.position,
      total: neighbors.total,
      previous: byId(neighbors.previousId),
      next: byId(neighbors.nextId),
      linkState,
      backTo: linkState.from,
      backLabel: fromList
        ? 'Back to results'
        : `Back to ${departmentOf(product.category)?.name ?? 'all products'}`,
    }
  }, [location.state, products, product])
}
