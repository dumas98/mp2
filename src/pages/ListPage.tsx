import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumb } from '../components/common/Breadcrumb.tsx'
import { EmptyState, type EmptyStateAction } from '../components/common/EmptyState.tsx'
import { ActiveFilterChips } from '../components/filters/ActiveFilterChips.tsx'
import { FilterSidebar } from '../components/filters/FilterSidebar.tsx'
import { ResultCount } from '../components/list/ResultCount.tsx'
import { SearchInput } from '../components/list/SearchInput.tsx'
import { SortControls } from '../components/list/SortControls.tsx'
import { ProductRow } from '../components/product/ProductRow.tsx'
import { useFilterParams } from '../hooks/useFilterParams.ts'
import { useProducts } from '../hooks/useProducts.ts'
import { toSearchParams } from '../lib/filterParams.ts'
import { applyFilters, EMPTY_FILTERS } from '../lib/filtering.ts'
import { sortProducts } from '../lib/sorting.ts'
import type { BrowseState } from '../types/navigation.ts'
import styles from './ListPage.module.css'

function withParams(path: string, params: URLSearchParams): string {
  const query = params.toString()
  return query ? `${path}?${query}` : path
}

// "Shop all": every product, with search, sorting and the filter sidebar.
export function ListPage() {
  const { products } = useProducts()
  const { filters, sort, order, activeCount } = useFilterParams()
  const location = useLocation()

  const results = useMemo(
    () => sortProducts(applyFilters(products, filters), sort, order),
    [products, filters, sort, order],
  )

  // Passed to every row, so the detail page's previous / next follow this exact list
  const browseState: BrowseState = useMemo(
    () => ({ ids: results.map((p) => p.id), from: location.pathname + location.search }),
    [results, location.pathname, location.search],
  )

  const query = filters.query.trim()
  const emptyActions: EmptyStateAction[] = [
    ...(query
      ? [{ label: 'Clear search', to: withParams('/all', toSearchParams({ filters: { ...filters, query: '' }, sort, order })) }]
      : []),
    ...(activeCount > 0
      ? [{ label: 'Clear filters', to: withParams('/all', toSearchParams({ filters: { ...EMPTY_FILTERS, query: filters.query }, sort, order })) }]
      : []),
  ]

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'All products' }]} />
      <h1 className={styles.title}>All products</h1>

      <div className={styles.layout}>
        <FilterSidebar products={products} showDepartment />

        <section className={styles.results} aria-labelledby="results-heading">
          <h2 id="results-heading" className="visually-hidden">
            Results
          </h2>
          <SearchInput placeholder={`Search ${products.length} products`} />

          <div className={styles.toolbar}>
            <ResultCount count={results.length} query={filters.query} />
            <SortControls />
          </div>

          <ActiveFilterChips />

          {results.length > 0 ? (
            <ul className={styles.list}>
              {results.map((product) => (
                <li key={product.id} className={styles.item}>
                  <ProductRow product={product} browseState={browseState} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              headingLevel={2}
              title={query ? `No products match “${query}”` : 'No products match these filters'}
              message="Try a different search or remove a filter."
              actions={emptyActions}
            />
          )}
        </section>
      </div>
    </div>
  )
}
