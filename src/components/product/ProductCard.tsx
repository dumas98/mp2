import { Link } from 'react-router-dom'
import { categoryLabel } from '../../data/departments.ts'
import { discountLabel, isOnSale } from '../../lib/pricing.ts'
import type { BrowseState } from '../../types/navigation.ts'
import type { Product } from '../../types/product.ts'
import { Price } from './Price.tsx'
import { Rating } from './Rating.tsx'
import { StockBadge } from './StockBadge.tsx'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  // The visible grid, so the detail page's previous / next can follow it
  browseState: BrowseState
}

// Image-first card for the gallery. srcSet lets the browser pick the 300px
// thumbnail or the 1000px photo depending on the card's size on screen.
export function ProductCard({ product, browseState }: ProductCardProps) {
  const meta = [product.brand, categoryLabel(product.category)].filter(Boolean).join(' · ')
  const photo = product.images[0] ?? product.thumbnail

  return (
    <Link to={`/product/${product.id}`} state={browseState} className={styles.card}>
      <div className={styles.image}>
        <img
          src={product.thumbnail}
          srcSet={`${product.thumbnail} 300w, ${photo} 1000w`}
          sizes="(max-width: 760px) 45vw, 300px"
          alt=""
          width={300}
          height={300}
          loading="lazy"
        />
        {isOnSale(product) && <span className={styles.sale}>{discountLabel(product)}</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.meta}>{meta}</p>
        <StockBadge status={product.availabilityStatus} />
        {/* Pinned to the bottom so prices line up across a row */}
        <div className={styles.footer}>
          <Price product={product} />
          <Rating value={product.rating} />
        </div>
      </div>
    </Link>
  )
}
