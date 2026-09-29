import type { Product } from '../../types/product.ts'
import styles from './DeptBanner.module.css'

export interface BannerStat {
  value: string
  label: string
}

interface DeptBannerProps {
  title: string
  description: string
  stats: BannerStat[]
  // Up to 3 products for the collage; the first one is shown largest
  collage: Product[]
}

// Collage slots in drawing order: the middle image first, so the side
// images overlap it
const SLOTS = [styles.center, styles.left, styles.right]

export function DeptBanner({ title, description, stats, collage }: DeptBannerProps) {
  return (
    <section className={styles.banner} aria-labelledby="banner-title">
      <div className={styles.text}>
        <h1 id="banner-title" className={styles.title}>
          {title}
        </h1>
        <p className={styles.description}>{description}</p>
        <ul className={styles.stats}>
          {stats.map((stat) => (
            <li key={stat.label} className={styles.stat}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.collage} aria-hidden="true">
        {collage.slice(0, SLOTS.length).map((product, index) => (
          <img key={product.id} src={product.thumbnail} alt="" className={SLOTS[index]} width={300} height={300} />
        ))}
      </div>
    </section>
  )
}
