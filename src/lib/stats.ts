import { departmentOf } from '../data/departments.ts'
import type { Product } from '../types/product.ts'
import { displayPrice, isOnSale } from './pricing.ts'
import { sortProducts } from './sorting.ts'

export interface CollectionStats {
  count: number
  // Lowest price a shopper pays (sale price when on sale)
  minPrice: number
  averageRating: number
  onSaleCount: number
  // Biggest discount in percent, e.g. 19.61
  maxDiscount: number
  departmentCount: number
}

// Figures for a gallery banner. They describe the whole department (or the
// whole sale), not the filtered results, so they don't change while filtering.
export function collectionStats(products: Product[]): CollectionStats {
  if (products.length === 0) {
    return { count: 0, minPrice: 0, averageRating: 0, onSaleCount: 0, maxDiscount: 0, departmentCount: 0 }
  }

  const totalRating = products.reduce((sum, p) => sum + p.rating, 0)
  return {
    count: products.length,
    minPrice: Math.min(...products.map(displayPrice)),
    averageRating: totalRating / products.length,
    onSaleCount: products.filter(isOnSale).length,
    maxDiscount: Math.max(...products.map((p) => p.discountPercentage)),
    departmentCount: new Set(products.map((p) => departmentOf(p.category)?.slug)).size,
  }
}

export function topRated(products: Product[], count = 3): Product[] {
  return sortProducts(products, 'rating', 'desc').slice(0, count)
}

export function biggestDiscounts(products: Product[], count = 3): Product[] {
  return sortProducts(products, 'discount', 'desc').slice(0, count)
}
