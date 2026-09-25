import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import axios from 'axios'
import { fetchAllProducts, fetchFallbackProducts } from '../api/products.ts'
import { ProductsContext, type ProductsState } from './ProductsContext.ts'

type LoadResult = Omit<ProductsState, 'retry'>

const LOADING: LoadResult = { status: 'loading', products: [], usedFallback: false }

// Loads every product once when the app starts and shares them with all pages.
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<LoadResult>(LOADING)
  // Bumping this re-runs the effect below, which is how retry() works
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Cancels the request if the effect is cleaned up. React runs effects
    // twice in development, so without this the data would load twice.
    const controller = new AbortController()

    async function load() {
      try {
        const products = await fetchAllProducts(controller.signal)
        setResult({ status: 'ready', products, usedFallback: false })
      } catch (error) {
        if (axios.isCancel(error)) return
        console.warn('Product API unavailable, loading saved data instead', error)
        try {
          const products = await fetchFallbackProducts(controller.signal)
          setResult({ status: 'ready', products, usedFallback: true })
        } catch (fallbackError) {
          if (axios.isCancel(fallbackError)) return
          setResult({ status: 'error', products: [], usedFallback: false })
        }
      }
    }

    load()
    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setResult(LOADING)
    setAttempt((n) => n + 1)
  }, [])

  const value = useMemo(() => ({ ...result, retry }), [result, retry])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}
