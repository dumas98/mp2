import { useState } from 'react'
import type { Product } from '../../types/product.ts'
import styles from './ImageGallery.module.css'

// Large image plus thumbnails. Rendered with key={product.id} so it goes back
// to the first image whenever previous / next change the product.
export function ImageGallery({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const [selected, setSelected] = useState(0)
  const hasThumbnails = images.length > 1

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <img
          src={images[selected]}
          alt={hasThumbnails ? `${product.title}, image ${selected + 1} of ${images.length}` : product.title}
          width={600}
          height={600}
        />
      </div>

      {hasThumbnails && (
        <ul className={styles.thumbnails}>
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                className={`${styles.thumbnail} ${index === selected ? styles.selected : ''}`}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-pressed={index === selected}
                onClick={() => setSelected(index)}
              >
                <img src={src} alt="" width={72} height={72} loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
