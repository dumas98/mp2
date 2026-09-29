import { useParams } from 'react-router-dom'
import { StockStatus } from '../components/detail/StockStatus.tsx'
import { Stars } from '../components/product/Stars.tsx'
import { categoryLabel } from '../data/departments.ts'
import { useProductNeighbors } from '../hooks/useProductNeighbors.ts'
import { useProducts } from '../hooks/useProducts.ts'
import { formatPrice } from '../lib/format.ts'
import { displayPrice } from '../lib/pricing.ts'
import type { Product } from '../types/product.ts'
import { NotFoundPage } from './NotFoundPage.tsx'
import styles from './Placeholder.module.css'

// Placeholder until step 3.7 (images, details, reviews and previous/next)
export function DetailPage() {
  const { id } = useParams()
  const { products } = useProducts()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <NotFoundPage
        title="Product not found"
        message="We couldn't find a product with that link. It may have been removed."
      />
    )
  }

  return <DetailPlaceholder product={product} />
}

function DetailPlaceholder({ product }: { product: Product }) {
  const neighbors = useProductNeighbors(product)

  return (
    <section>
      <h1 className={styles.title}>{product.title}</h1>
      <p className={styles.lead}>{formatPrice(displayPrice(product))}</p>
      <p className={styles.note}>{categoryLabel(product.category)}</p>
      <p className={styles.note}>
        <Stars value={product.rating} /> {product.rating}
      </p>
      <StockStatus product={product} />
      <p className={styles.note} data-testid="neighbors">
        {neighbors.position} of {neighbors.total} · previous: {neighbors.previous.title} · next:{' '}
        {neighbors.next.title} · {neighbors.backLabel} → {neighbors.backTo}
      </p>
    </section>
  )
}
