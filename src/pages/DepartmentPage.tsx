import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { DeptBanner } from '../components/gallery/DeptBanner.tsx'
import { ProductGrid } from '../components/gallery/ProductGrid.tsx'
import { getDepartment } from '../data/departments.ts'
import { useProducts } from '../hooks/useProducts.ts'
import { formatPrice } from '../lib/format.ts'
import { isOnSale } from '../lib/pricing.ts'
import { sortProducts } from '../lib/sorting.ts'
import { collectionStats, topRated } from '../lib/stats.ts'
import { NotFoundPage } from './NotFoundPage.tsx'

interface DepartmentPageProps {
  // "sale" shows every discounted product instead of one department
  mode: 'department' | 'sale'
}

// In progress: banner and grid are real; filters, chips and the Sale banner
// arrive in step 4.5.
export function DepartmentPage({ mode }: DepartmentPageProps) {
  const { dept } = useParams()
  const { products } = useProducts()
  const location = useLocation()
  const department = mode === 'department' ? getDepartment(dept) : undefined

  const members = useMemo(
    () =>
      mode === 'sale'
        ? products.filter(isOnSale)
        : products.filter((p) => department?.categories.includes(p.category)),
    [mode, products, department],
  )
  const shown = useMemo(() => sortProducts(members, 'rating', 'desc'), [members])
  const browseState = useMemo(
    () => ({ ids: shown.map((p) => p.id), from: location.pathname + location.search }),
    [shown, location.pathname, location.search],
  )

  if (mode === 'department' && !department) {
    return (
      <NotFoundPage
        title="Department not found"
        message="That department doesn't exist. Try one of the sections above."
      />
    )
  }

  const stats = collectionStats(members)

  return (
    <div>
      <DeptBanner
        title={department?.name ?? 'Sale'}
        description={department?.description ?? 'Every product at 15% off or more.'}
        stats={[
          { value: String(stats.count), label: 'products' },
          { value: formatPrice(stats.minPrice), label: 'starting at' },
          { value: stats.averageRating.toFixed(1), label: 'average rating' },
          { value: String(stats.onSaleCount), label: 'on sale' },
        ]}
        collage={topRated(members)}
      />
      <ProductGrid products={shown} browseState={browseState} />
    </div>
  )
}
