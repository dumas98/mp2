import { categoryLabel, getDepartment } from '../../data/departments.ts'
import { useFilterParams } from '../../hooks/useFilterParams.ts'
import { AVAILABILITY_OPTIONS, PRICE_RANGES } from '../../lib/filtering.ts'
import styles from './ActiveFilterChips.module.css'

interface Chip {
  key: string
  label: string
  remove: () => void
}

// One removable chip per active filter (and the search text), plus "Clear all"
export function ActiveFilterChips() {
  const { filters, toggle, setQuery, setMinRating, setOnSale, clearAll } = useFilterParams()

  const chips: Chip[] = [
    ...(filters.query.trim()
      ? [{ key: 'query', label: `“${filters.query.trim()}”`, remove: () => setQuery('') }]
      : []),
    ...filters.departments.map((slug) => ({
      key: `dept-${slug}`,
      label: getDepartment(slug)?.name ?? slug,
      remove: () => toggle('departments', slug),
    })),
    ...filters.categories.map((category) => ({
      key: `cat-${category}`,
      label: categoryLabel(category),
      remove: () => toggle('categories', category),
    })),
    ...filters.prices.map((value) => ({
      key: `price-${value}`,
      label: PRICE_RANGES.find((r) => r.value === value)?.label ?? value,
      remove: () => toggle('prices', value),
    })),
    ...(filters.minRating !== null
      ? [{ key: 'rating', label: `${filters.minRating}★ and up`, remove: () => setMinRating(null) }]
      : []),
    ...filters.availability.map((status) => ({
      key: `avail-${status}`,
      label: AVAILABILITY_OPTIONS.find((o) => o.value === status)?.label ?? status,
      remove: () => toggle('availability', status),
    })),
    ...(filters.onSale ? [{ key: 'sale', label: 'On sale', remove: () => setOnSale(false) }] : []),
  ]

  if (chips.length === 0) return null

  return (
    <div className={styles.chips}>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className={styles.chip}
          onClick={chip.remove}
          aria-label={`Remove filter: ${chip.label}`}
        >
          {chip.label}
          <span aria-hidden="true" className={styles.x}>
            ×
          </span>
        </button>
      ))}
      <button type="button" className={styles.clear} onClick={clearAll}>
        Clear all
      </button>
    </div>
  )
}
