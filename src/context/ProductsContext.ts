import { createContext } from 'react'
import type { Product } from '../types/product.ts'

export type ProductsStatus = 'loading' | 'error' | 'ready'

export interface ProductsState {
  status: ProductsStatus
  products: Product[]
  // true when the API failed and the saved copy in public/ was loaded instead
  usedFallback: boolean
  retry: () => void
}

export const ProductsContext = createContext<ProductsState | null>(null)
