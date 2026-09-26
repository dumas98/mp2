import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  countActiveFilters,
  parseBrowseParams,
  toggleFilterValue,
  toSearchParams,
  type BrowseParams,
  type ListFilterKey,
} from '../lib/filterParams.ts'
import { EMPTY_FILTERS } from '../lib/filtering.ts'
import { SORT_OPTIONS } from '../lib/sorting.ts'
import type { Filters, SortKey } from '../types/product.ts'

// Reads the search, filters and sort from the URL and returns setters that
// write them back. Typing replaces the history entry (Back doesn't undo one
// letter at a time); every other change adds one (Back undoes it).
export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const state = useMemo(() => parseBrowseParams(searchParams), [searchParams])

  const update = useCallback(
    (change: (current: BrowseParams) => BrowseParams, replace = false) => {
      setSearchParams((previous) => toSearchParams(change(parseBrowseParams(previous))), { replace })
    },
    [setSearchParams],
  )

  const setQuery = useCallback(
    (query: string) => update((s) => ({ ...s, filters: { ...s.filters, query } }), true),
    [update],
  )

  const toggle = useCallback(
    <K extends ListFilterKey>(key: K, value: Filters[K][number]) =>
      update((s) => ({ ...s, filters: toggleFilterValue(s.filters, key, value) })),
    [update],
  )

  const setMinRating = useCallback(
    (minRating: number | null) => update((s) => ({ ...s, filters: { ...s.filters, minRating } })),
    [update],
  )

  const setOnSale = useCallback(
    (onSale: boolean) => update((s) => ({ ...s, filters: { ...s.filters, onSale } })),
    [update],
  )

  // Picking a key starts in its natural direction, e.g. rating highest first
  const setSort = useCallback(
    (sort: SortKey) => update((s) => ({ ...s, sort, order: SORT_OPTIONS[sort].natural })),
    [update],
  )

  const toggleOrder = useCallback(
    () => update((s) => ({ ...s, order: s.order === 'asc' ? 'desc' : 'asc' })),
    [update],
  )

  // Clears the search and every filter, keeps the sort
  const clearAll = useCallback(() => update((s) => ({ ...s, filters: EMPTY_FILTERS })), [update])

  const activeCount = countActiveFilters(state.filters)

  return {
    ...state,
    activeCount,
    setQuery,
    toggle,
    setMinRating,
    setOnSale,
    setSort,
    toggleOrder,
    clearAll,
  }
}
