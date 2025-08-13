"use client"

import Link from "next/link"
import { Package, Star, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/src/lib/types/product"

interface ProductCardProps {
  product: Product
  formatCategoryName: (cat: string) => string
  onQuoteClick: (productId: string) => void
}

export function ProductCard({ product, formatCategoryName, onQuoteClick }: ProductCardProps) {
  return (
    <Link href={`/products/${encodeURIComponent(product.category.name)}/${product.id}`} className="block h-full">
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 h-full group">
        <CardContent className="p-3 md:p-4 h-full flex flex-col">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
            {product.images?.[0] ? (
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.condition && (
                <Badge variant="secondary" className="text-xs">
                  {product.condition}
                </Badge>
              )}
              {product.quantity < 10 && (
                <Badge variant="destructive" className="text-xs">
                  Low Stock
                </Badge>
              )}
            </div>
          </div>
          {/* Product Info */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12 group-hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
            {/* Price */}
            <div className="mb-2">
              <p className="text-lg md:text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</p>
              <p className="text-xs text-gray-500">per unit</p>
            </div>
            {/* Rating and Reviews */}
            {product.averageRating && (
              <div className="flex items-center space-x-1 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= (product.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">({product.reviewCount || 0})</span>
              </div>
            )}
            {/* Category */}
            <div className="mb-2">
              <Badge variant="outline" className="text-xs">
                {formatCategoryName(product.category.name)}
              </Badge>
            </div>
            {/* Quick Actions */}
            <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                className="flex-1 h-8 bg-orange-600 hover:bg-orange-700 text-xs"
                onClick={(e) => {
                  e.preventDefault()
                  onQuoteClick(product.id)
                }}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Quote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
