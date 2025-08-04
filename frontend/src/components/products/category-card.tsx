import Link from "next/link"
import { Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CategoryData } from "@/src/lib/types/product"

interface CategoryCardProps {
  category: CategoryData
  formatCategoryName: (cat: string) => string
}

export function CategoryCard({ category, formatCategoryName }: CategoryCardProps) {
  return (
    <Link href={`/products/${category.category}`} className="block">
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 group h-full">
        <CardContent className="p-4 text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-colors">
            <Package className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="font-semibold text-sm md:text-base mb-1 group-hover:text-orange-600 transition-colors">
            {formatCategoryName(category.category)}
          </h3>
          <p className="text-xs text-gray-600">{category.count} products</p>
        </CardContent>
      </Card>
    </Link>
  )
}
