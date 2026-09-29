import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DealsRow } from '../components/landing/DealsRow.tsx'
import { OfferTile } from '../components/landing/OfferTile.tsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts'
import { useProducts } from '../hooks/useProducts.ts'
import { buildOffers } from '../lib/offers.ts'
import { biggestDiscounts } from '../lib/stats.ts'
import styles from './LandingPage.module.css'

export function LandingPage() {
  const { products } = useProducts()
  useDocumentTitle()

  const offers = useMemo(() => buildOffers(products), [products])
  const deals = useMemo(() => biggestDiscounts(products, 5), [products])

  return (
    <div className={styles.page}>
      <section className={styles.offers} aria-labelledby="offers-heading">
        <h1 id="offers-heading" className={styles.title}>
          Limited time offers
        </h1>
        <ul className={styles.offerGrid}>
          {offers.map((offer) => (
            <li key={offer.key} className={styles.offerItem}>
              <OfferTile offer={offer} />
            </li>
          ))}
        </ul>
        <Link to="/all" className={styles.browseAll}>
          Browse all {products.length} products <span aria-hidden="true">→</span>
        </Link>
      </section>

      <DealsRow products={deals} />
    </div>
  )
}
