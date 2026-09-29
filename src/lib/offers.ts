import { departmentOf } from '../data/departments.ts'
import type { Product } from '../types/product.ts'
import { isOnSale, SALE_THRESHOLD } from './pricing.ts'
import { biggestDiscounts } from './stats.ts'

// Categories featured as "limited time offers". The headline numbers and
// images are calculated from the data, never typed in by hand.
const OFFER_CATEGORIES = [
  { category: 'smartphones', label: 'Smartphones' },
  { category: 'furniture', label: 'Furniture' },
  { category: 'sports-accessories', label: 'Sports gear' },
]

export interface Offer {
  key: string
  label: string
  // Biggest discount in the category, rounded, for "up to 20% off"
  maxDiscount: number
  to: string
  // The 3 most-discounted products, for the collage
  products: Product[]
}

export function buildOffers(products: Product[]): Offer[] {
  return OFFER_CATEGORIES.flatMap(({ category, label }) => {
    const members = products.filter((p) => p.category === category)
    const department = departmentOf(category)
    if (members.length === 0 || !department) return []

    const top = biggestDiscounts(members)
    // A department with one category needs no category filter in the link
    const to =
      department.categories.length === 1 ? `/d/${department.slug}` : `/d/${department.slug}?cat=${category}`

    return [{ key: category, label, maxDiscount: Math.round(top[0].discountPercentage), to, products: top }]
  })
}

export interface Promo {
  key: string
  text: string
  linkText: string
  to: string
}

// Messages for the rotating banner at the top of every page
export function buildPromos(products: Product[]): Promo[] {
  const offers = buildOffers(products)
  const saleCount = products.filter(isOnSale).length

  return [
    ...offers.slice(0, 2).map((offer) => ({
      key: offer.key,
      text: `${offer.label} up to ${offer.maxDiscount}% off this week`,
      linkText: 'Shop now',
      to: offer.to,
    })),
    ...(saleCount > 0
      ? [
          {
            key: 'sale',
            text: `${saleCount} products at ${SALE_THRESHOLD}% off or more`,
            linkText: 'See the sale',
            to: '/sale',
          },
        ]
      : []),
  ]
}
