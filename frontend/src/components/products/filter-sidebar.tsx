"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { FilterState } from "@/src/lib/types/product"

interface FilterSidebarProps {
  filters: FilterState
  handleFilterChange: (key: keyof FilterState, value: any) => void
  clearFilters: () => void
  uniqueCategories?: string[] // Optional for category-specific page
  uniqueConditions: string[]
  uniqueIndustries: string[]
  uniqueCountries?: string[] // Optional for main products page
  maxPrice: number
  formatCategoryName: (cat: string) => string
}

export function FilterSidebar({
  filters,
  handleFilterChange,
  clearFilters,
  uniqueCategories,
  uniqueConditions,
  uniqueIndustries,
  uniqueCountries,
  maxPrice,
  formatCategoryName,
}: FilterSidebarProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="search-filter" className="text-sm font-medium mb-2 block">
            Search
          </label>
          <Input
            id="search-filter"
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            className="h-9"
          />
        </div>
        {/* Category (only for main products page) */}
        {uniqueCategories && uniqueCategories.length > 0 && (
          <div>
            <label htmlFor="category-filter" className="text-sm font-medium mb-2 block">
              Category
            </label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger id="category-filter" className="h-9">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {formatCategoryName(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Price Range: ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
          </label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value: [number, number]) => handleFilterChange("priceRange", value)}
            max={maxPrice}
            min={0}
            step={100}
            className="w-full"
          />
        </div>
        {/* Condition */}
        {uniqueConditions.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-3 block">Condition</label>
            <div className="space-y-2">
              {uniqueConditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={filters.condition.includes(condition)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFilterChange("condition", [...filters.condition, condition])
                      } else {
                        handleFilterChange(
                          "condition",
                          filters.condition.filter((c) => c !== condition),
                        )
                      }
                    }}
                  />
                  <label htmlFor={`condition-${condition}`} className="text-sm">
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Industry */}
        {/* {uniqueIndustries.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-3 block">Industry</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {uniqueIndustries.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={filters.industry.includes(industry)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFilterChange("industry", [...filters.industry, industry])
                      } else {
                        handleFilterChange(
                          "industry",
                          filters.industry.filter((i) => i !== industry),
                        )
                      }
                    }}
                  />
                  <label htmlFor={`industry-${industry}`} className="text-sm">
                    {industry}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )} */}
        {/* Country (only for main products page) */}
        {uniqueCountries && uniqueCountries.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-3 block">Country</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {uniqueCountries.map((country) => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={filters.country.includes(country)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFilterChange("country", [...filters.country, country])
                      } else {
                        handleFilterChange(
                          "country",
                          filters.country.filter((c) => c !== country),
                        )
                      }
                    }}
                  />
                  <label htmlFor={`country-${country}`} className="text-sm">
                    {country}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
