import { useParams } from 'react-router-dom'
import { categoryLabel } from '../data/departments.ts'
import { useProducts } from '../hooks/useProducts.ts'
import { formatPrice } from '../lib/format.ts'
import { displayPrice } from '../lib/pricing.ts'
import { NotFoundPage } from './NotFoundPage.tsx'
import styles from './Placeholder.module.css'

// Placeholder until step 3 (images, details, reviews and previous/next)
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

  return (
    <section>
      <h1 className={styles.title}>{product.title}</h1>
      <p className={styles.lead}>{formatPrice(displayPrice(product))}</p>
      <p className={styles.note}>{categoryLabel(product.category)}</p>
    </section>
  )
}
