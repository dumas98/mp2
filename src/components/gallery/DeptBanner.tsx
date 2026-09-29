import type { Product } from '../../types/product.ts'
import { Collage } from '../common/Collage.tsx'
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

      <Collage products={collage} size="banner" />
    </section>
  )
}
