import { useEffect, useId, useMemo, useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoryLabel, DEPARTMENTS } from '../../data/departments.ts'
import { useProducts } from '../../hooks/useProducts.ts'
import { searchSuggestions, splitHighlight } from '../../lib/suggestions.ts'
import type { BrowseState } from '../../types/navigation.ts'
import { Price } from '../product/Price.tsx'
import styles from './SearchBar.module.css'

// Where "See all results" and Enter go: Shop all with the search filled in
function resultsUrl(query: string, department: string): string {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  if (department) params.set('dept', department)
  const search = params.toString()
  return search ? `/all?${search}` : '/all'
}

// Header search with suggestions, following the accessible "combobox" pattern:
// ↓ ↑ move through the list, Enter opens the highlighted row (or searches),
// Esc closes it. Clicking a suggestion opens that product.
export function SearchBar({ className = '' }: { className?: string }) {
  const { products, status } = useProducts()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('')
  const [open, setOpen] = useState(false)
  // Highlighted row: a suggestion, the "See all" row (items.length), or none (-1)
  const [active, setActive] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const { items, matches, total } = useMemo(
    () => (status === 'ready' ? searchSuggestions(products, query, department) : { items: [], matches: [], total: 0 }),
    [products, status, query, department],
  )
  const showPanel = open && query.trim().length > 0
  const rowCount = items.length > 0 ? items.length + 1 : 0

  // Close when the shopper clicks anywhere outside the search
  useEffect(() => {
    if (!open) return
    function handleClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function reset() {
    setQuery('')
    setOpen(false)
    setActive(-1)
    inputRef.current?.blur()
  }

  function searchAll() {
    navigate(resultsUrl(query, department))
    reset()
  }

  function openProduct(index: number) {
    const state: BrowseState = {
      ids: matches.map((p) => p.id),
      from: resultsUrl(query, department),
      label: 'Back to search results',
    }
    navigate(`/product/${items[index].id}`, { state })
    reset()
  }

  function choose(index: number) {
    if (index === items.length) searchAll()
    else openProduct(index)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    searchAll()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      if (rowCount === 0) return
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (current === -1 && step === -1 ? rowCount - 1 : (current + step + rowCount) % rowCount))
    } else if (event.key === 'Enter' && showPanel && active >= 0) {
      event.preventDefault()
      choose(active)
    } else if (event.key === 'Escape') {
      if (showPanel) {
        // Browsers also empty search boxes on Escape; the first press only closes the list
        event.preventDefault()
        setOpen(false)
        setActive(-1)
      } else {
        setQuery('')
      }
    }
  }

  // Tabbing out of the search closes the list
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }

  const optionId = (index: number) => `${listboxId}-option-${index}`

  return (
    <div ref={wrapperRef} className={`${styles.wrapper} ${className}`} onBlur={handleBlur}>
      <form className={styles.bar} role="search" onSubmit={handleSubmit}>
        <select
          className={styles.select}
          aria-label="Department to search"
          value={department}
          onChange={(event) => {
            setDepartment(event.target.value)
            setActive(-1)
          }}
        >
          <option value="">All categories</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
        <input
          ref={inputRef}
          className={styles.input}
          type="search"
          placeholder="What are you looking for?"
          aria-label="Search products"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showPanel && items.length > 0}
          aria-controls={showPanel && items.length > 0 ? listboxId : undefined}
          aria-activedescendant={showPanel && active >= 0 ? optionId(active) : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.button} type="submit" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </form>

      {showPanel && (
        <div className={styles.panel}>
          {items.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label="Suggestions" className={styles.list}>
              {items.map((product, index) => (
                <li
                  key={product.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={active === index}
                  className={`${styles.option} ${active === index ? styles.active : ''}`}
                  // Keep focus in the input so the click isn't lost to a blur
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(index)}
                >
                  <span className={styles.thumb}>
                    <img src={product.thumbnail} alt="" width={44} height={44} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.name}>
                      {splitHighlight(product.title, query).map((part, i) =>
                        part.match ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>,
                      )}
                    </span>
                    <span className={styles.meta}>{categoryLabel(product.category)}</span>
                  </span>
                  <Price product={product} />
                </li>
              ))}
              <li
                id={optionId(items.length)}
                role="option"
                aria-selected={active === items.length}
                className={`${styles.option} ${styles.seeAll} ${active === items.length ? styles.active : ''}`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(items.length)}
                onClick={() => choose(items.length)}
              >
                See all {total} {total === 1 ? 'result' : 'results'} for “{query.trim()}”
              </li>
            </ul>
          ) : (
            <p className={styles.empty} role="status">
              No products match “{query.trim()}”
            </p>
          )}
        </div>
      )}
    </div>
  )
}
