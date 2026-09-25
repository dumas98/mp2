import { useProducts } from '../hooks/useProducts.ts'
import styles from './Placeholder.module.css'

// Placeholder until step 2 (search, sorting and the filter sidebar)
export function ListPage() {
  const { products } = useProducts()

  return (
    <section>
      <h1 className={styles.title}>All products</h1>
      <p className={styles.lead}>{products.length} products</p>
    </section>
  )
}
