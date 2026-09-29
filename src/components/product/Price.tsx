import { formatPrice } from '../../lib/format.ts'
import { discountLabel, displayPrice, isOnSale } from '../../lib/pricing.ts'
import type { Product } from '../../types/product.ts'
import styles from './Price.module.css'

interface PriceProps {
  product: Product
  // Shows the "−20%" badge next to a sale price
  showBadge?: boolean
  size?: 'medium' | 'large'
}

export function Price({ product, showBadge = false, size = 'medium' }: PriceProps) {
  const sizeClass = size === 'large' ? styles.large : ''

  if (!isOnSale(product)) {
    return (
      <span className={`${styles.price} ${sizeClass}`}>
        <span className={styles.current}>{formatPrice(product.price)}</span>
      </span>
    )
  }

  return (
    <span className={`${styles.price} ${sizeClass}`}>
      <span className="visually-hidden">Sale price</span>
      <span className={`${styles.current} ${styles.sale}`}>{formatPrice(displayPrice(product))}</span>
      <span className="visually-hidden">, was</span>
      <s className={styles.original}>{formatPrice(product.price)}</s>
      {showBadge && <span className={styles.badge}>{discountLabel(product)}</span>}
    </span>
  )
}
