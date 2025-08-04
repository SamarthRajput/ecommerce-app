"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import { ProductListings } from "@/src/components/products/product-listings"

const CategoryWiseProductsPage = () => {
    const params = useParams()
    const { category } = params as { category: string }

    return (
        <Suspense fallback={<div>Loading category products...</div>}>
            <ProductListings initialCategory={category} />
        </Suspense>
    )
}

export default CategoryWiseProductsPage