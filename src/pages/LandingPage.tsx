import { useProducts } from '../hooks/useProducts.ts'
import styles from './Placeholder.module.css'

// Placeholder until step 5 (offers, deals and the "Browse all" button)
export function LandingPage() {
  const { products, usedFallback } = useProducts()

  return (
    <section>
      <h1 className={styles.title}>Limited time offers</h1>
      <p className={styles.lead}>{products.length} products loaded.</p>
      <p className={styles.note}>Source: {usedFallback ? 'saved copy' : 'DummyJSON'}</p>
    </section>
  )
}
