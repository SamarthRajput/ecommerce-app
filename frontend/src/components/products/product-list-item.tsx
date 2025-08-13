"use client"

import Link from "next/link"
import { Package, Eye, Building, ShoppingCart, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/src/lib/types/product"

interface ProductListItemProps {
  product: Product
  formatCategoryName: (cat: string) => string
  onQuoteClick: (productId: string) => void
}

export function ProductListItem({ product, formatCategoryName, onQuoteClick }: ProductListItemProps) {
  return (
    <Link href={`/products/${encodeURIComponent(product.category.name.toLocaleLowerCase())}/${product.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200 group">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.images?.[0] ? (
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-base md:text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {product.condition}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {formatCategoryName(product.category.name)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  {product.quantity} available
                </Badge>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</p>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Building className="w-3 h-3" />
                    <span>{product.seller?.businessName}</span>
                    {product.seller?.city || product.seller?.country && (
                      <span className="mx-1">•</span>
                    )}
                    <span>
                      {product.seller?.city}, {product.seller?.country}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={(e) => {
                      e.preventDefault()
                      onQuoteClick(product.id)
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Get Quote
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 bg-transparent"
                    onClick={(e) => {
                      e.preventDefault()
                      // Contact seller logic
                    }}
                  >
                    <MessageSquare className="w-3 h-3" />
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
