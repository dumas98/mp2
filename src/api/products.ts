import axios from 'axios'
import { api } from './client.ts'
import type { Product, ProductsResponse } from '../types/product.ts'

// Saved copy of the API data in public/, used only when the API is unavailable.
// BASE_URL keeps the /mp2/ prefix on GitHub Pages.
const FALLBACK_URL = `${import.meta.env.BASE_URL}fallback-products.json`

function productsFrom(data: ProductsResponse): Product[] {
  if (!Array.isArray(data?.products)) {
    throw new Error('Unexpected product data')
  }
  return data.products
}

// limit=0 asks DummyJSON for every product (194) in one request
export async function fetchAllProducts(signal?: AbortSignal): Promise<Product[]> {
  const { data } = await api.get<ProductsResponse>('/products', {
    params: { limit: 0 },
    signal,
  })
  return productsFrom(data)
}

export async function fetchFallbackProducts(signal?: AbortSignal): Promise<Product[]> {
  const { data } = await axios.get<ProductsResponse>(FALLBACK_URL, { signal })
  return productsFrom(data)
}
