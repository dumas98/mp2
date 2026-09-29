import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Breadcrumb } from '../components/common/Breadcrumb.tsx'
import { EmptyState } from '../components/common/EmptyState.tsx'
import { ActiveFilterChips } from '../components/filters/ActiveFilterChips.tsx'
import { FilterSidebar } from '../components/filters/FilterSidebar.tsx'
import { DeptBanner, type BannerStat } from '../components/gallery/DeptBanner.tsx'
import { ProductGrid } from '../components/gallery/ProductGrid.tsx'
import { getDepartment } from '../data/departments.ts'
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts'
import { useFilterParams } from '../hooks/useFilterParams.ts'
import { useProducts } from '../hooks/useProducts.ts'
import { applyFilters } from '../lib/filtering.ts'
import { formatPrice } from '../lib/format.ts'
import { isOnSale, SALE_THRESHOLD } from '../lib/pricing.ts'
import { sortProducts } from '../lib/sorting.ts'
import { biggestDiscounts, collectionStats, topRated } from '../lib/stats.ts'
import type { BrowseState } from '../types/navigation.ts'
import type { Department } from '../types/product.ts'
import browse from './BrowsePage.module.css'
import styles from './DepartmentPage.module.css'
import { NotFoundPage } from './NotFoundPage.tsx'

interface DepartmentPageProps {
  // "sale" shows every discounted product instead of one department
  mode: 'department' | 'sale'
}

export function DepartmentPage({ mode }: DepartmentPageProps) {
  const { dept } = useParams()

  if (mode === 'sale') return <Gallery key="sale" />

  const department = getDepartment(dept)
  if (!department) {
    return (
      <NotFoundPage
        title="Department not found"
        message="That department doesn't exist. Try one of the sections above."
      />
    )
  }

  // The key starts each department fresh; React would otherwise reuse the
  // page (and its open panels) when only :dept changes
  return <Gallery key={department.slug} department={department} />
}

// Image gallery for one department, or for the whole Sale when department is
// undefined. Cards are always shown top-rated first.
function Gallery({ department }: { department?: Department }) {
  const { products } = useProducts()
  const { filters } = useFilterParams()
  const location = useLocation()
  const isSale = department === undefined
  const title = department?.name ?? 'Sale'
  const pagePath = department ? `/d/${department.slug}` : '/sale'
  useDocumentTitle(title)

  const members = useMemo(
    () => (department ? products.filter((p) => department.categories.includes(p.category)) : products.filter(isOnSale)),
    [department, products],
  )
  const results = useMemo(() => sortProducts(applyFilters(members, filters), 'rating', 'desc'), [members, filters])

  // Passed to every card, so the detail page's previous / next follow this grid
  const browseState: BrowseState = useMemo(
    () => ({ ids: results.map((p) => p.id), from: location.pathname + location.search }),
    [results, location.pathname, location.search],
  )

  const stats = useMemo(() => collectionStats(members), [members])
  const bannerStats: BannerStat[] = isSale
    ? [
        { value: String(stats.count), label: 'products' },
        { value: `${Math.round(stats.maxDiscount)}%`, label: 'biggest discount' },
        { value: formatPrice(stats.minPrice), label: 'starting at' },
        { value: String(stats.departmentCount), label: 'departments' },
      ]
    : [
        { value: String(stats.count), label: 'products' },
        { value: formatPrice(stats.minPrice), label: 'starting at' },
        { value: stats.averageRating.toFixed(1), label: 'average rating' },
        // "0 on sale" would read like a complaint, so it's left out
        ...(stats.onSaleCount > 0 ? [{ value: String(stats.onSaleCount), label: 'on sale' }] : []),
      ]

  return (
    <div className={styles.page}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: title }]} />

      <DeptBanner
        title={title}
        description={department?.description ?? `Everything at ${SALE_THRESHOLD}% off or more, across the whole store.`}
        stats={bannerStats}
        collage={isSale ? biggestDiscounts(members) : topRated(members)}
      />

      <div className={browse.layout}>
        <FilterSidebar products={members} showDepartment={isSale} showSaleFilter={!isSale} />

        <section className={browse.results} aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="visually-hidden">
            Products
          </h2>

          <div className={browse.toolbar}>
            <p className={styles.count} role="status">
              <strong className={styles.number}>{results.length}</strong>
              {results.length === members.length ? ' products' : ` of ${members.length} products`}
            </p>
            <p className={styles.sortNote}>Sorted by rating</p>
          </div>

          <ActiveFilterChips />

          {results.length > 0 ? (
            <ProductGrid products={results} browseState={browseState} />
          ) : (
            <EmptyState
              headingLevel={2}
              title="No products match these filters"
              message="Try removing a filter to see more."
              actions={[{ label: 'Clear filters', to: pagePath }]}
            />
          )}
        </section>
      </div>
    </div>
  )
}
