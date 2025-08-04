"use client"
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FilterState } from "@/types/product"

interface NoProductsFoundProps {
  filters: FilterState
  clearFilters: () => void
  clearSearch: () => void
}

export function NoProductsFound({ filters, clearFilters, clearSearch }: NoProductsFoundProps) {
  return (
    <Card className="p-8 md:p-12">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-4">
          {filters.searchQuery
            ? `No results found for "${filters.searchQuery}". Try adjusting your search or filters.`
            : "Try adjusting your filters to find what you're looking for."}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
          {filters.searchQuery && <Button onClick={clearSearch}>Clear Search</Button>}
        </div>
      </div>
    </Card>
  )
}
