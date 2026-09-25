// Shapes of the DummyJSON product data (https://dummyjson.com/docs/products)
// plus the app's own filter and sort types.

export type AvailabilityStatus = 'In Stock' | 'Low Stock' | 'Out of Stock'

export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string // missing on 92 of the 194 products
  sku: string
  weight: number
  dimensions: Dimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: AvailabilityStatus
  reviews: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  images: string[]
  thumbnail: string
}

// Response of GET /products
export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

// A group of categories shown as one store section, e.g. Electronics
export interface Department {
  slug: string
  name: string
  description: string
  categories: string[]
}

export type SortKey = 'title' | 'price' | 'rating' | 'discount'
export type SortOrder = 'asc' | 'desc'

export type PriceRange = 'under-25' | '25-100' | '100-1000' | 'over-1000'

// Everything the filter sidebar and search can narrow by.
// Within one group any value may match; every group must match.
export interface Filters {
  query: string
  departments: string[]
  categories: string[]
  prices: PriceRange[]
  minRating: number | null
  availability: AvailabilityStatus[]
  onSale: boolean
}
