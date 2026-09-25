import type { Department } from '../types/product.ts'

// DummyJSON has 24 small categories. The store groups them into 9 departments,
// which become the nav items and the gallery pages (/d/:slug).
export const DEPARTMENTS: Department[] = [
  {
    slug: 'home',
    name: 'Home',
    description: 'Kitchen tools, decor and furniture for every room.',
    categories: ['kitchen-accessories', 'home-decoration', 'furniture'],
  },
  {
    slug: 'electronics',
    name: 'Electronics',
    description: 'Phones, laptops, tablets and everything that plugs into them.',
    categories: ['smartphones', 'laptops', 'tablets', 'mobile-accessories'],
  },
  {
    slug: 'women',
    name: 'Women',
    description: 'Dresses, shoes, bags and jewellery.',
    categories: ['womens-dresses', 'tops', 'womens-shoes', 'womens-bags', 'womens-jewellery', 'womens-watches'],
  },
  {
    slug: 'men',
    name: 'Men',
    description: 'Shirts, shoes and watches.',
    categories: ['mens-shirts', 'mens-shoes', 'mens-watches'],
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    description: 'Makeup, fragrances and skin care.',
    categories: ['beauty', 'fragrances', 'skin-care'],
  },
  {
    slug: 'groceries',
    name: 'Groceries',
    description: 'Fresh food and pantry staples.',
    categories: ['groceries'],
  },
  {
    slug: 'sports',
    name: 'Sports',
    description: 'Gear for the court, the field and the gym.',
    categories: ['sports-accessories'],
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    description: 'Sunglasses for every face.',
    categories: ['sunglasses'],
  },
  {
    slug: 'vehicles',
    name: 'Vehicles',
    description: 'Cars and motorcycles.',
    categories: ['motorcycle', 'vehicle'],
  },
]

export function getDepartment(slug: string | undefined): Department | undefined {
  return DEPARTMENTS.find((d) => d.slug === slug)
}

export function departmentOf(category: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.categories.includes(category))
}

// Names that read better than the generated ones
const CATEGORY_LABELS: Record<string, string> = {
  beauty: 'Makeup',
  motorcycle: 'Motorcycles',
  vehicle: 'Cars',
}

// "mens-shirts" -> "Men's shirts", "mobile-accessories" -> "Mobile accessories"
export function categoryLabel(category: string): string {
  if (CATEGORY_LABELS[category]) return CATEGORY_LABELS[category]
  const words = category
    .replace(/^mens-/, "men's-")
    .replace(/^womens-/, "women's-")
    .split('-')
    .join(' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}
