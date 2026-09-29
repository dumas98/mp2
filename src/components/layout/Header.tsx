import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SearchBar } from './SearchBar.tsx'
import styles from './Header.module.css'

// Logo, search and cart, with the department nav passed in below them
export function Header({ children }: { children: ReactNode }) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <Link to="/" className={styles.logo}>
          corner
        </Link>
        <SearchBar className={styles.search} />
        <span className={styles.cart}>Cart (0)</span>
      </div>
      {children}
    </header>
  )
}
