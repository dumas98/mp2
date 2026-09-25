import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DEPARTMENTS } from '../../data/departments.ts'
import styles from './Header.module.css'

// Logo, search bar and cart, with the department nav passed in below them.
// The search bar is visual only until step 5 connects it.
export function Header({ children }: { children: ReactNode }) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <Link to="/" className={styles.logo}>
          corner
        </Link>

        <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
          <select className={styles.select} aria-label="Department to search">
            <option value="">All categories</option>
            {DEPARTMENTS.map((department) => (
              <option key={department.slug} value={department.slug}>
                {department.name}
              </option>
            ))}
          </select>
          <input
            className={styles.input}
            type="search"
            placeholder="What are you looking for?"
            aria-label="Search products"
          />
          <button className={styles.button} type="submit" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </form>

        <span className={styles.cart}>Cart (0)</span>
      </div>
      {children}
    </header>
  )
}
