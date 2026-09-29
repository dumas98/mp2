import { formatDate } from '../../lib/format.ts'
import type { Product } from '../../types/product.ts'
import { Stars } from '../product/Stars.tsx'
import styles from './ReviewList.module.css'

// Reviewer emails are left out on purpose: they look like personal data
export function ReviewList({ product }: { product: Product }) {
  const reviews = [...product.reviews].sort((a, b) => b.date.localeCompare(a.date))
  const count = reviews.length

  return (
    <section id="reviews" className={styles.section} aria-labelledby="reviews-heading">
      <div className={styles.header}>
        <h2 id="reviews-heading" className={styles.heading}>
          Reviews
        </h2>
        <p className={styles.summary}>
          <Stars value={product.rating} size="small" />
          {product.rating.toFixed(1)} out of 5 · {count} {count === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {count > 0 ? (
        <ul className={styles.list}>
          {reviews.map((review) => (
            <li key={`${review.reviewerName}-${review.date}`} className={styles.card}>
              <Stars value={review.rating} size="small" />
              <p className={styles.comment}>{review.comment}</p>
              <p className={styles.byline}>
                <span className={styles.name}>{review.reviewerName}</span>
                <span className={styles.date}>{formatDate(review.date)}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No reviews yet.</p>
      )}
    </section>
  )
}
