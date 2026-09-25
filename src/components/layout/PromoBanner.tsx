import { Link } from 'react-router-dom'
import styles from './PromoBanner.module.css'

// Static for now; step 5 rotates deals calculated from the product data
export function PromoBanner() {
  return (
    <div className={styles.banner}>
      Smartphones up to 20% off this week ·{' '}
      <Link to="/d/electronics" className={styles.link}>
        Shop now
      </Link>
    </div>
  )
}
