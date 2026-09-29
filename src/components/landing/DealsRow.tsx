import { Link } from 'react-router-dom'
import type { BrowseState } from '../../types/navigation.ts'
import type { Product } from '../../types/product.ts'
import { ProductCard } from '../product/ProductCard.tsx'
import styles from './DealsRow.module.css'

// "Biggest discounts right now": a row of product cards. Opening one lets the
// shopper step through just these deals, with "Back to deals" leading home.
export function DealsRow({ products }: { products: Product[] }) {
  const browseState: BrowseState = { ids: products.map((p) => p.id), from: '/', label: 'Back to deals' }

  return (
    <section className={styles.section} aria-labelledby="deals-heading">
      <div className={styles.header}>
        <h2 id="deals-heading" className={styles.heading}>
          Biggest discounts right now
        </h2>
        <Link to="/sale" className={styles.more}>
          See all deals <span aria-hidden="true">→</span>
        </Link>
      </div>

      <ul className={styles.row}>
        {products.map((product) => (
          <li key={product.id} className={styles.item}>
            <ProductCard product={product} browseState={browseState} />
          </li>
        ))}
      </ul>
    </section>
  )
}
