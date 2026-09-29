import { Link } from 'react-router-dom'
import type { Offer } from '../../lib/offers.ts'
import { Collage } from '../common/Collage.tsx'
import styles from './OfferTile.module.css'

// A "limited time offer": the category's most-discounted products as a
// collage, with the headline underneath. The whole tile is one link.
export function OfferTile({ offer }: { offer: Offer }) {
  return (
    <Link to={offer.to} className={styles.tile}>
      <div className={styles.image}>
        <Collage products={offer.products} size="tile" />
      </div>
      <p className={styles.caption}>
        {offer.label} up to {offer.maxDiscount}% off
      </p>
    </Link>
  )
}
