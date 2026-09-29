import { Link } from 'react-router-dom'
import { categoryLabel } from '../../data/departments.ts'
import type { BrowseState } from '../../types/navigation.ts'
import type { Product } from '../../types/product.ts'
import { Price } from './Price.tsx'
import { Rating } from './Rating.tsx'
import { StockBadge } from './StockBadge.tsx'
import styles from './ProductRow.module.css'

interface ProductRowProps {
  product: Product
  // The visible list, so the detail page's previous / next can follow it
  browseState: BrowseState
}

export function ProductRow({ product, browseState }: ProductRowProps) {
  const meta = [product.brand, categoryLabel(product.category)].filter(Boolean).join(' · ')

  return (
    <Link to={`/product/${product.id}`} state={browseState} className={styles.row}>
      <div className={styles.thumb}>
        <img src={product.thumbnail} alt="" width={72} height={72} loading="lazy" />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.meta}>
          {meta}
          <StockBadge status={product.availabilityStatus} />
        </p>
      </div>
      <div className={styles.rating}>
        <Rating value={product.rating} />
      </div>
      <div className={styles.price}>
        <Price product={product} showBadge />
      </div>
    </Link>
  )
}
