import { useContext } from 'react'
import { ProductsContext, type ProductsState } from '../context/ProductsContext.ts'

export function useProducts(): ProductsState {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used inside <ProductsProvider>')
  }
  return context
}
