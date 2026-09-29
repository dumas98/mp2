import type { Product } from '../../types/product.ts'
import styles from './StockStatus.module.css'

// A colored dot plus how many are left
export function StockStatus({ product }: { product: Product }) {
  if (product.availabilityStatus === 'Out of Stock') {
    return <p className={`${styles.status} ${styles.out}`}>Out of stock</p>
  }

  if (product.availabilityStatus === 'Low Stock') {
    return (
      <p className={`${styles.status} ${styles.low}`}>
        Low stock · only {product.stock} left
      </p>
    )
  }

  return (
    <p className={`${styles.status} ${styles.in}`}>
      In stock · {product.stock} available
    </p>
  )
}
