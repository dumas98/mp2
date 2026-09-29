import { Link } from 'react-router-dom'
import type { ProductNeighbors } from '../../hooks/useProductNeighbors.ts'
import type { Product } from '../../types/product.ts'
import { Price } from '../product/Price.tsx'
import styles from './NeighborCards.module.css'

interface CardProps {
  product: Product
  direction: 'previous' | 'next'
  neighbors: ProductNeighbors
}

function NeighborCard({ product, direction, neighbors }: CardProps) {
  const isNext = direction === 'next'

  return (
    <Link
      to={`/product/${product.id}`}
      state={neighbors.linkState}
      replace
      className={`${styles.card} ${isNext ? styles.next : ''}`}
    >
      <div className={styles.thumb}>
        <img src={product.thumbnail} alt="" width={64} height={64} loading="lazy" />
      </div>
      <div className={styles.text}>
        <p className={styles.label}>
          {isNext ? 'Next product →' : '← Previous product'}
        </p>
        <p className={styles.title}>{product.title}</p>
        <Price product={product} />
      </div>
    </Link>
  )
}

// Bottom-of-page version of previous / next, showing which products they lead to
export function NeighborCards({ neighbors }: { neighbors: ProductNeighbors }) {
  if (neighbors.total < 2) return null

  return (
    <nav className={styles.cards} aria-label="Previous and next product">
      <NeighborCard product={neighbors.previous} direction="previous" neighbors={neighbors} />
      <NeighborCard product={neighbors.next} direction="next" neighbors={neighbors} />
    </nav>
  )
}
