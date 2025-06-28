// src: /app/products/page.tsx
// This page will display all products available in the marketplace

"use client";
import React, { useEffect, useState } from 'react'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api/v1';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    listingType: string;
    condition: string;
    validityPeriod: string;
    industry: string;
    category: string;
    productCode: string;
    model: string;
    specifications: string;
    countryOfSource: string;
    hsnCode: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    seller: {
        id: string;
        businessName: string;
        country: string;
        state: string;
        city: string;
    };
}
interface ProductsResponse {
    products: Product[];
    page: number;
    limit: number;
    total: number;
    message: string;
}
const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState<number>(1); // Default to page 1
    const [limitNumber, setLimitNumber] = useState<number>(10); // Default to 10 items per page

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${backendUrl}/products?page=${pageNumber}&limit=${limitNumber}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data: ProductsResponse = await response.json();
                setProducts(data.products);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pageNumber, limitNumber]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* // if no products are available, show a message */}
                {products.length === 0 && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center text-gray-500">
                        No products available at the moment.
                    </div>
                )}
                {products.map(product => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow"
                        onClick={() => window.location.href = `/product/${product.id}`}
                    >
                        <div className="w-full h-48 mb-4 bg-gray-100 flex items-center justify-center rounded">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="object-contain h-full max-w-full rounded"
                                />
                            ) : (
                                <span className="text-gray-400">No Image</span>
                            )}
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-lg font-bold text-blue-600">${product.price}</span>
                            <span className="text-xs bg-gray-200 rounded px-2 py-1">
                                {product.condition}
                            </span>
                        </div>
                        {/* <div className="mt-2 text-xs text-gray-500">
                            Seller: {product.seller.businessName} ({product.seller.city}, {product.seller.country})
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products
