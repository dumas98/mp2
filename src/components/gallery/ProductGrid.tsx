import type { BrowseState } from '../../types/navigation.ts'
import type { Product } from '../../types/product.ts'
import { ProductCard } from '../product/ProductCard.tsx'
import styles from './ProductGrid.module.css'

export function ProductGrid({ products, browseState }: { products: Product[]; browseState: BrowseState }) {
  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} browseState={browseState} />
        </li>
      ))}
    </ul>
  )
}
