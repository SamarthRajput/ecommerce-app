"use client"

import { ProductListings } from "@/src/components/products/product-listings"
import { Suspense } from "react"

const ProductsPage = () => {
    return (
        <Suspense fallback={<div>Loading products...</div>}>
            <ProductListings />
        </Suspense>
    )
}

export default ProductsPage
