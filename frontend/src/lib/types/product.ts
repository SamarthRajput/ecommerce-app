export interface Product {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  listingType: string
  condition: string
  validityPeriod: string
  industry: string
  category: string
  productCode: string
  model: string
  specifications: string
  countryOfSource: string
  hsnCode: string
  images: string[]
  createdAt: string
  updatedAt: string
  seller: Seller
  averageRating?: number
  reviewCount?: number
}

export interface Seller {
  id: string
  businessName: string
  country: string
  state: string
  city: string
  slug?: string
}

export interface ProductsResponse {
  products: Product[]
  page: number
  limit: number
  total: number
  message: string
}

export interface FilterState {
  searchQuery: string
  category: string // Only used in the main products page
  priceRange: [number, number]
  condition: string[]
  industry: string[]
  country: string[]
  sortBy: string
  viewMode: "grid" | "list"
}

export interface CategoryData {
  category: string
  count: number
  image?: string
}
