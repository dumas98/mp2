import { useParams } from 'react-router-dom'
import { getDepartment } from '../data/departments.ts'
import { useProducts } from '../hooks/useProducts.ts'
import { isOnSale, SALE_THRESHOLD } from '../lib/pricing.ts'
import { NotFoundPage } from './NotFoundPage.tsx'
import styles from './Placeholder.module.css'

interface DepartmentPageProps {
  // "sale" shows every discounted product instead of one department
  mode: 'department' | 'sale'
}

// Placeholder until step 4 (banner, filter sidebar and product grid)
export function DepartmentPage({ mode }: DepartmentPageProps) {
  const { dept } = useParams()
  const { products } = useProducts()

  if (mode === 'sale') {
    const onSale = products.filter(isOnSale)
    return (
      <section>
        <h1 className={styles.title}>Sale</h1>
        <p className={styles.lead}>
          {onSale.length} products at {SALE_THRESHOLD}% off or more
        </p>
      </section>
    )
  }

  const department = getDepartment(dept)
  if (!department) {
    return (
      <NotFoundPage
        title="Department not found"
        message="That department doesn't exist. Try one of the sections above."
      />
    )
  }

  const count = products.filter((p) => department.categories.includes(p.category)).length

  return (
    <section>
      <h1 className={styles.title}>{department.name}</h1>
      <p className={styles.lead}>{department.description}</p>
      <p className={styles.note}>{count} products</p>
    </section>
  )
}
