import { useEffect, useMemo, useState, type FocusEvent } from 'react'
import { Link } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { useProducts } from '../../hooks/useProducts.ts'
import { buildPromos, type Promo } from '../../lib/offers.ts'
import styles from './PromoBanner.module.css'

const ROTATE_EVERY_MS = 6000

// Shown while the products load, so the bar doesn't jump in later
const LOADING_PROMO: Promo = { key: 'loading', text: 'Limited time offers across the store', linkText: 'See the sale', to: '/sale' }

// Rotating deals at the top of every page, built from the product data.
// It pauses while hovered or focused, and never rotates on its own for
// visitors who asked their device for reduced motion.
export function PromoBanner() {
  const { products, status } = useProducts()
  const promos = useMemo(() => (status === 'ready' ? buildPromos(products) : []), [products, status])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  const count = promos.length
  const promo = count > 0 ? promos[index % count] : LOADING_PROMO

  useEffect(() => {
    if (count < 2 || paused || reduceMotion) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_EVERY_MS)
    return () => window.clearInterval(timer)
  }, [count, paused, reduceMotion])

  const show = (step: number) => setIndex((i) => (i + step + count) % count)

  // Resume only when focus leaves the banner, not when it moves between its buttons
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
  }

  return (
    <div
      className={styles.banner}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={handleBlur}
    >
      {count > 1 && (
        <button type="button" className={styles.arrow} aria-label="Previous offer" onClick={() => show(-1)}>
          ‹
        </button>
      )}

      {/* Announced only while the visitor is interacting, not on every automatic change */}
      <p className={styles.message} aria-live={paused ? 'polite' : 'off'}>
        {promo.text} ·{' '}
        <Link to={promo.to} className={styles.link}>
          {promo.linkText}
        </Link>
      </p>

      {count > 1 && (
        <button type="button" className={styles.arrow} aria-label="Next offer" onClick={() => show(1)}>
          ›
        </button>
      )}
    </div>
  )
}
