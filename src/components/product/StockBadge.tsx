import type { AvailabilityStatus } from '../../types/product.ts'
import styles from './StockBadge.module.css'

// Only the unusual states get a badge; "In stock" on 176 rows would be noise
export function StockBadge({ status }: { status: AvailabilityStatus }) {
  if (status === 'Low Stock') return <span className={`${styles.badge} ${styles.low}`}>Low stock</span>
  if (status === 'Out of Stock') return <span className={`${styles.badge} ${styles.out}`}>Out of stock</span>
  return null
}
