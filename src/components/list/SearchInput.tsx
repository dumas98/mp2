import { useId } from 'react'
import { useFilterParams } from '../../hooks/useFilterParams.ts'
import styles from './SearchInput.module.css'

// Filters the results with every keystroke; the text lives in the URL (?q=)
export function SearchInput({ placeholder }: { placeholder: string }) {
  const { filters, setQuery } = useFilterParams()
  const inputId = useId()

  return (
    <div className={styles.search}>
      <label htmlFor={inputId} className="visually-hidden">
        Search products
      </label>
      <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        id={inputId}
        className={styles.input}
        type="search"
        placeholder={placeholder}
        value={filters.query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />
      {filters.query && (
        <button type="button" className={styles.clear} onClick={() => setQuery('')} aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  )
}
