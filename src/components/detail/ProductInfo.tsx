import { categoryLabel, departmentOf } from '../../data/departments.ts'
import type { Product } from '../../types/product.ts'
import { Breadcrumb, type BreadcrumbItem } from '../common/Breadcrumb.tsx'
import { Price } from '../product/Price.tsx'
import { Stars } from '../product/Stars.tsx'
import { StockStatus } from './StockStatus.tsx'
import styles from './ProductInfo.module.css'

// A button rather than an <a href="#reviews">: a hash link would create a new
// history entry without the list the shopper came from, breaking previous / next.
function scrollToReviews() {
  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
}

export function ProductInfo({ product }: { product: Product }) {
  const department = departmentOf(product.category)
  const breadcrumb: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    ...(department
      ? [
          { label: department.name, to: `/d/${department.slug}` },
          { label: categoryLabel(product.category), to: `/d/${department.slug}?cat=${product.category}` },
        ]
      : []),
  ]
  const reviewCount = product.reviews.length
  const minimumOrder = product.minimumOrderQuantity

  return (
    <div className={styles.info}>
      <Breadcrumb items={breadcrumb} />

      <div>
        {product.brand && <p className={styles.brand}>{product.brand}</p>}
        <h1 className={styles.title}>{product.title}</h1>
      </div>

      <div className={styles.rating}>
        <Stars value={product.rating} />
        <span>{product.rating.toFixed(1)}</span>
        <span aria-hidden="true">·</span>
        <button type="button" className={styles.reviewsLink} onClick={scrollToReviews}>
          {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        </button>
      </div>

      <div className={styles.price}>
        <Price product={product} showBadge size="large" />
      </div>

      <StockStatus product={product} />

      <p className={styles.description}>{product.description}</p>

      <dl className={styles.details}>
        <dt>Warranty</dt>
        <dd>{product.warrantyInformation}</dd>
        <dt>Shipping</dt>
        <dd>{product.shippingInformation}</dd>
        <dt>Returns</dt>
        <dd>{product.returnPolicy}</dd>
        <dt>Minimum order</dt>
        <dd>
          {minimumOrder} {minimumOrder === 1 ? 'item' : 'items'}
        </dd>
        <dt>SKU</dt>
        <dd>{product.sku}</dd>
      </dl>

      {product.tags.length > 0 && (
        <ul className={styles.tags} aria-label="Tags">
          {product.tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
