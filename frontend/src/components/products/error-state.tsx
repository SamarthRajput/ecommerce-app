"use client"
import { AlertTriangle, RefreshCw, Home, Search, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ErrorStateProps {
  error: string | null
  isCategoryPage?: boolean
}

export function ErrorState({ error, isCategoryPage = false }: ErrorStateProps) {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {error === "Category not found" ? "Category Not Found" : "Something went wrong"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error === "Category not found"
              ? "The category you're looking for doesn't exist."
              : error || "An unexpected error occurred while loading products."}
          </p>
          <div className="space-y-3">
            {isCategoryPage && (
              <Button onClick={() => router.back()} className="w-full" variant="default">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            )}
            <Button onClick={() => window.location.reload()} className="w-full" variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => router.push("/products")} className="w-full" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Browse All Products
            </Button>
            <Button onClick={() => router.push("/")} className="w-full" variant="ghost">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
