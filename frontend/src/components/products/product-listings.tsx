"use client"

import { CardContent } from "@/components/ui/card"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Package,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { ProductCard } from "./product-card"
import { ProductListItem } from "./product-list-item"
import { FilterSidebar } from "./filter-sidebar"
import { PaginationControls } from "./pagination-controls"
import { LoadingState } from "./loading-state"
import { ErrorState } from "./error-state"
import { NoProductsFound } from "./no-products-found"
import { CategoryCard } from "./category-card"

import type { Product, ProductsResponse, FilterState, CategoryData } from "@/src/lib/types/product";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/api/v1"

interface ProductListingsProps {
  initialCategory?: string // Optional for the main products page
}

export function ProductListings({ initialCategory }: ProductListingsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [featuredCategories, setFeaturedCategories] = useState<CategoryData[]>([])

  const itemsPerPage = 24

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: searchParams.get("search") || "",
    category: initialCategory || searchParams.get("category") || "",
    priceRange: [0, 1000000],
    condition: [],
    industry: [],
    country: [],
    sortBy: "newest",
    viewMode: "grid",
  })

  // Derived data for filters
  const uniqueCategories = useMemo(() => {
    const categories = products.map((p) => p.category).filter(Boolean)
    return [...new Set(categories)]
  }, [products])

  const uniqueConditions = useMemo(() => {
    const conditions = products.map((p) => p.condition).filter(Boolean)
    return [...new Set(conditions)]
  }, [products])

  const uniqueIndustries = useMemo(() => {
    const industries = products.map((p) => p.industry).filter(Boolean)
    return [...new Set(industries)]
  }, [products])

  const uniqueCountries = useMemo(() => {
    const countries = products.map((p) => p.seller?.country).filter(Boolean)
    return [...new Set(countries)]
  }, [products])

  const maxPrice = useMemo(() => {
    return products.length > 0 ? Math.max(...products.map((p) => p.price)) : 1000000
  }, [products])

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesDescription = product.description.toLowerCase().includes(query)
        const matchesSeller = product.seller?.businessName?.toLowerCase().includes(query)
        const matchesCategory = product.category.toLowerCase().includes(query)
        if (!matchesName && !matchesDescription && !matchesSeller && !matchesCategory) return false
      }
      // Category (only apply if not on a specific category page, or if it matches the current category)
      if (!initialCategory && filters.category && product.category !== filters.category) {
        return false
      }
      // Price range
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }
      // Condition
      if (filters.condition.length > 0 && !filters.condition.includes(product.condition)) {
        return false
      }
      // Industry
      if (filters.industry.length > 0 && !filters.industry.includes(product.industry)) {
        return false
      }
      // Country (only for main products page)
      if (!initialCategory && filters.country.length > 0 && !filters.country.includes(product.seller?.country || "")) {
        return false
      }
      return true
    })

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "rating":
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        break
      case "popular":
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }
    return filtered
  }, [products, filters, initialCategory])

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProducts, currentPage])

  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [filteredProducts.length])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = initialCategory
          ? `${backendUrl}/products/${initialCategory}?page=1&limit=1000`
          : `${backendUrl}/products/all?page=1&limit=1000`

        const response = await fetch(url, {
          credentials: "include",
        })

        if (!response.ok) {
          if (response.status === 404 && initialCategory) {
            throw new Error("Category not found")
          }
          throw new Error("Failed to fetch products")
        }
        const data: ProductsResponse = await response.json()
        setProducts(data.products || [])

        // Set initial price range based on actual data
        if (data.products && data.products.length > 0) {
          const prices = data.products.map((p: Product) => p.price)
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          setFilters((prev) => ({
            ...prev,
            priceRange: [minPrice, maxPrice],
          }))

          // Calculate featured categories only for the main products page
          if (!initialCategory) {
            const categoryCount = data.products.reduce((acc: Record<string, number>, product: Product) => {
              acc[product.category] = (acc[product.category] || 0) + 1
              return acc
            }, {})
            const featured = Object.entries(categoryCount)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([category, count]) => ({ category, count }))
            setFeaturedCategories(featured)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [initialCategory]) // Re-fetch when initialCategory changes

  // Use string for key to match expected prop type in children
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key as keyof FilterState]: value }))
  }

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      category: initialCategory || "", // Keep initial category if on category page
      priceRange: [0, maxPrice],
      condition: [],
      industry: [],
      country: [],
      sortBy: "newest",
      viewMode: filters.viewMode,
    })
  }

  const clearSearch = () => {
    handleFilterChange("searchQuery", "")
  }

  const formatCategoryName = (cat: string) => {
    return cat
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const handleQuoteClick = (productId: string) => {
    router.push(`/buyer/request-quote/${productId}`)
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} isCategoryPage={!!initialCategory} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <nav className="text-xs md:text-sm text-gray-600 flex items-center overflow-x-auto">
              <Link href="/" className="hover:text-orange-600 whitespace-nowrap">
                Home
              </Link>
              <span className="mx-1 md:mx-2">/</span>
              <Link href="/products" className="hover:text-orange-600 whitespace-nowrap">
                Products
              </Link>
              {initialCategory && (
                <>
                  <span className="mx-1 md:mx-2">/</span>
                  <span className="text-gray-900 font-medium whitespace-nowrap">
                    {formatCategoryName(decodeURIComponent(initialCategory))}
                  </span>
                </>
              )}
            </nav>
            {initialCategory && (
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="ml-2 flex-shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Hero Section / Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="text-center mb-8">
            {/* Main Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search products, categories, or sellers..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                  className="pl-10 h-12 text-base"
                />
                {filters.searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => handleFilterChange("searchQuery", "")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {initialCategory ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {formatCategoryName(decodeURIComponent(initialCategory))}
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  {filteredProducts.length} of {products.length} products
                </p>
              </div>
              {/* Category features */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Popular
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Quality Assured
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Fast Delivery
                </Badge>
              </div>
            </div>
          ) : (
            <>
              {featuredCategories.length > 0 && (
                <div className="mb-8 md:mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular Categories</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent"
                    >
                      View All Categories
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
                    {featuredCategories.map((cat) => (
                      <CategoryCard key={cat.category} category={cat} formatCategoryName={formatCategoryName} />
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">All Products</h2>
                <p className="text-gray-600 text-sm md:text-base">
                  {filteredProducts.length} of {products.length} products
                  {filters.searchQuery && (
                    <span className="ml-2">
                      for "<span className="font-medium">{filters.searchQuery}</span>"
                    </span>
                  )}
                </p>
              </div>
            </>
          )}

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex-1">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {showFilters && <X className="w-4 h-4 ml-2" />}
              </Button>
              <div className="flex gap-1">
                <Button
                  variant={filters.viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("viewMode", "grid")}
                  className="p-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={filters.viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("viewMode", "list")}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <Button
                  variant={filters.viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("viewMode", "grid")}
                  className="p-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={filters.viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("viewMode", "list")}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.searchQuery ||
            filters.category ||
            filters.condition.length > 0 ||
            filters.industry.length > 0 ||
            filters.country.length > 0) && (
              <div className="mb-6 mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filters.searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {filters.searchQuery}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleFilterChange("searchQuery", "")}
                      />
                    </Badge>
                  )}
                  {!initialCategory && filters.category && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {formatCategoryName(filters.category)}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleFilterChange("category", "")}
                      />
                    </Badge>
                  )}
                  {filters.condition.map((condition) => (
                    <Badge key={condition} variant="secondary" className="gap-1">
                      {condition}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() =>
                          handleFilterChange(
                            "condition",
                            filters.condition.filter((c) => c !== condition),
                          )
                        }
                      />
                    </Badge>
                  ))}
                  {filters.industry.map((industry) => (
                    <Badge key={industry} variant="secondary" className="gap-1">
                      {industry}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() =>
                          handleFilterChange(
                            "industry",
                            filters.industry.filter((i) => i !== industry),
                          )
                        }
                      />
                    </Badge>
                  ))}
                  {!initialCategory &&
                    filters.country.map((country) => (
                      <Badge key={country} variant="secondary" className="gap-1">
                        {country}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() =>
                            handleFilterChange(
                              "country",
                              filters.country.filter((c) => c !== country),
                            )
                          }
                        />
                      </Badge>
                    ))}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                    Clear All
                  </Button>
                </div>
              </div>
            )}
        </div>

        {/* Main Content */}
        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              handleFilterChange={handleFilterChange as (key: string | number | symbol, value: any) => void}
              clearFilters={clearFilters}
              uniqueCategories={!initialCategory ? uniqueCategories : undefined}
              uniqueConditions={uniqueConditions}
              uniqueIndustries={uniqueIndustries}
              uniqueCountries={!initialCategory ? uniqueCountries : undefined}
              maxPrice={maxPrice}
              formatCategoryName={formatCategoryName}
            />
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
              <div
                className="absolute right-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <FilterSidebar
                  filters={filters}
                  handleFilterChange={handleFilterChange as (key: string | number | symbol, value: any) => void}
                  clearFilters={clearFilters}
                  uniqueCategories={!initialCategory ? uniqueCategories : undefined}
                  uniqueConditions={uniqueConditions}
                  uniqueIndustries={uniqueIndustries}
                  uniqueCountries={!initialCategory ? uniqueCountries : undefined}
                  maxPrice={maxPrice}
                  formatCategoryName={formatCategoryName}
                />
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <NoProductsFound filters={filters} clearFilters={clearFilters} clearSearch={clearSearch} />
            ) : (
              <>
                {/* Products Display */}
                {filters.viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        formatCategoryName={formatCategoryName}
                        onQuoteClick={handleQuoteClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product) => (
                      <ProductListItem
                        key={product.id}
                        product={product}
                        formatCategoryName={formatCategoryName}
                        onQuoteClick={handleQuoteClick}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    filteredProductsLength={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Recently Viewed or Recommended Products (only for category page) */}
        {initialCategory && filteredProducts.length > 0 && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">You might also like</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {products
                    .filter((p) => !filteredProducts.includes(p))
                    .slice(0, 6)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        formatCategoryName={formatCategoryName}
                        onQuoteClick={handleQuoteClick}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-4 right-4 lg:hidden z-20">
        <Button
          className="rounded-full w-14 h-14 bg-orange-600 hover:bg-orange-700 shadow-lg"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-6 h-6" />
        </Button>
      </div>

      {/* Quick Stats Bar for Mobile */}
      {products.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 lg:hidden z-10">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4 text-orange-600" />
              <span className="font-medium">{filteredProducts.length}</span>
              <span className="text-gray-600">products</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-medium">
                ₹
                {filteredProducts.length > 0 ? Math.min(...filteredProducts.map((p) => p.price)).toLocaleString() : "0"}
              </span>
              <span className="text-gray-600">starting</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
