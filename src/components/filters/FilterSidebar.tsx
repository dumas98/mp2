import { useId, useMemo, useState } from 'react'
import { categoryLabel, DEPARTMENTS } from '../../data/departments.ts'
import { useFilterParams } from '../../hooks/useFilterParams.ts'
import { AVAILABILITY_OPTIONS, facetCounts, PRICE_RANGES, RATING_OPTIONS } from '../../lib/filtering.ts'
import type { Product } from '../../types/product.ts'
import { FilterGroup } from './FilterGroup.tsx'
import { FilterOption } from './FilterOption.tsx'
import styles from './FilterSidebar.module.css'

const CATEGORY_LIMIT = 6

interface FilterSidebarProps {
  // The page's starting set: every product on /all, one department on /d/:slug
  products: Product[]
  // The Department group only makes sense when several departments are shown
  showDepartment: boolean
  // The Sale page hides "On sale": everything there is on sale already
  showSaleFilter?: boolean
}

// Shared by the list and gallery pages. Reads and writes the filters in the
// URL. On phones it folds into a "Filters (2)" button above the results.
export function FilterSidebar({ products, showDepartment, showSaleFilter = true }: FilterSidebarProps) {
  const { filters, activeCount, toggle, setMinRating, setOnSale } = useFilterParams()
  const [openOnPhone, setOpenOnPhone] = useState(false)
  const panelId = useId()

  const counts = useMemo(() => facetCounts(products, filters), [products, filters])

  // Categories of the checked departments, or every category in the page's products
  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category))
    const departments =
      filters.departments.length > 0 ? DEPARTMENTS.filter((d) => filters.departments.includes(d.slug)) : DEPARTMENTS
    return departments.flatMap((d) => d.categories).filter((c) => present.has(c))
  }, [products, filters.departments])

  const hiddenCategoryChecked = categories.slice(CATEGORY_LIMIT).some((c) => filters.categories.includes(c))

  return (
    <aside className={styles.sidebar} aria-label="Filters">
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={openOnPhone}
        aria-controls={panelId}
        onClick={() => setOpenOnPhone(!openOnPhone)}
      >
        <span>Filters{activeCount > 0 ? ` (${activeCount})` : ''}</span>
        <span aria-hidden="true">{openOnPhone ? '−' : '+'}</span>
      </button>

      <div id={panelId} className={`${styles.panel} ${openOnPhone ? styles.open : ''}`}>
        <h2 className={styles.heading}>Filters</h2>

        {showDepartment && (
          <FilterGroup title="Department">
            {DEPARTMENTS.map((department) => (
              <FilterOption
                key={department.slug}
                type="checkbox"
                name="department"
                label={department.name}
                count={counts.departments[department.slug] ?? 0}
                checked={filters.departments.includes(department.slug)}
                onChange={() => toggle('departments', department.slug)}
              />
            ))}
          </FilterGroup>
        )}

        {categories.length > 1 && (
          <FilterGroup
            // Remount when the list changes so "Show all" starts in the right state
            key={categories.join()}
            title="Category"
            limit={CATEGORY_LIMIT}
            startExpanded={hiddenCategoryChecked}
          >
            {categories.map((category) => (
              <FilterOption
                key={category}
                type="checkbox"
                name="category"
                label={categoryLabel(category)}
                count={counts.categories[category] ?? 0}
                checked={filters.categories.includes(category)}
                onChange={() => toggle('categories', category)}
              />
            ))}
          </FilterGroup>
        )}

        <FilterGroup title="Price">
          {PRICE_RANGES.map((range) => (
            <FilterOption
              key={range.value}
              type="checkbox"
              name="price"
              label={range.label}
              count={counts.prices[range.value] ?? 0}
              checked={filters.prices.includes(range.value)}
              onChange={() => toggle('prices', range.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Rating">
          <FilterOption
            type="radio"
            name="rating"
            label="Any rating"
            count={counts.anyRating}
            checked={filters.minRating === null}
            onChange={() => setMinRating(null)}
          />
          {RATING_OPTIONS.map((min) => (
            <FilterOption
              key={min}
              type="radio"
              name="rating"
              label={`${min}★ and up`}
              count={counts.minRating[String(min)] ?? 0}
              checked={filters.minRating === min}
              onChange={() => setMinRating(min)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Availability">
          {AVAILABILITY_OPTIONS.map((option) => (
            <FilterOption
              key={option.slug}
              type="checkbox"
              name="availability"
              label={option.label}
              count={counts.availability[option.value] ?? 0}
              checked={filters.availability.includes(option.value)}
              onChange={() => toggle('availability', option.value)}
            />
          ))}
        </FilterGroup>

        {showSaleFilter && (
          <FilterGroup title="Deals">
            <FilterOption
              type="checkbox"
              name="sale"
              label="On sale"
              count={counts.onSale}
              checked={filters.onSale}
              onChange={() => setOnSale(!filters.onSale)}
            />
          </FilterGroup>
        )}
      </div>
    </aside>
  )
}
