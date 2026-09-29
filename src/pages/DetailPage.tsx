import { useParams } from 'react-router-dom'
import { ImageGallery } from '../components/detail/ImageGallery.tsx'
import { NeighborCards } from '../components/detail/NeighborCards.tsx'
import { PrevNextNav } from '../components/detail/PrevNextNav.tsx'
import { ProductInfo } from '../components/detail/ProductInfo.tsx'
import { ReviewList } from '../components/detail/ReviewList.tsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts'
import { useProductNeighbors } from '../hooks/useProductNeighbors.ts'
import { useProducts } from '../hooks/useProducts.ts'
import type { Product } from '../types/product.ts'
import styles from './DetailPage.module.css'
import { NotFoundPage } from './NotFoundPage.tsx'

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

  return <ProductDetail product={product} />
}

// Split out so the hooks below only run once the product exists
function ProductDetail({ product }: { product: Product }) {
  const neighbors = useProductNeighbors(product)
  useDocumentTitle(product.title)

  return (
    <article className={styles.page}>
      <PrevNextNav neighbors={neighbors} />

      <div className={styles.columns}>
        <ImageGallery key={product.id} product={product} />
        <ProductInfo product={product} />
      </div>

      <ReviewList product={product} />
      <NeighborCards neighbors={neighbors} />
    </article>
  )
}
