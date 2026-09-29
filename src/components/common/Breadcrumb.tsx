import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  label: string
  // Leave out for the current page, which is the last item
  to?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.label} className={styles.item}>
            {item.to ? (
              <Link to={item.to} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
