export interface Product {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  listingType: string
  condition: string
  validityPeriod: string
  industry: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
  }
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
  category: string
  priceRange: [number, number]
  condition: string[]
  industry: string
  country: string[]
  sortBy: string
  viewMode: "grid" | "list"
}

export interface CategoryData {
  category: {
    id: string
    name: string
  }
  count: number
  image?: string
}
