import type { Product } from '../../types/product.ts'
import styles from './Collage.module.css'

// Drawing order: the middle image first, so the side images overlap it
const SLOTS = [styles.center, styles.left, styles.right]

interface CollageProps {
  // Up to 3 products; the first one is shown largest
  products: Product[]
  // "banner": wide and short (gallery banner); "tile": square (landing offers)
  size?: 'banner' | 'tile'
}

// Three overlapping product cutouts. Positions come from CSS classes because
// inline styles aren't allowed.
export function Collage({ products, size = 'banner' }: CollageProps) {
  return (
    <div className={`${styles.collage} ${styles[size]}`} aria-hidden="true">
      {products.slice(0, SLOTS.length).map((product, index) => (
        <img key={product.id} src={product.thumbnail} alt="" className={SLOTS[index]} width={300} height={300} />
      ))}
    </div>
  )
}
