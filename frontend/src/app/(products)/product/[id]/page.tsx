// src: frontend/src/app/product/[id]/page.tsx
// This page will display individual product details based on the product ID in the URL

"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
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
    seller: Seller;
}
interface Seller {
    id: string;
    businessName: string;
    country: string;
    state: string;
    city: string;
}

interface ReviewProduct {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    buyer: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        city: string;
        country: string;
    };
}

interface ProductResponse {
    product: Product;
}

const IndividualProductPage = () => {
    const params = useParams();
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<ReviewProduct[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    // Fetch product details from the backend using the product ID
    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const [response, reviewsResponse] = await Promise.all([
                    fetch(`${backendUrl}/products/${id}`),
                    fetch(`${backendUrl}/products/${id}/reviews`)
                ]);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Product not found');
                    }
                    if (response.status === 500) {
                        throw new Error('Internal Server Error');
                    }
                    throw new Error(response.statusText);
                }

                const data: ProductResponse = await response.json();
                if (!data.product) {
                    throw new Error('Product not found');
                }
                setProduct(data.product);

                if (reviewsResponse.ok) {
                    const reviewsData = await reviewsResponse.json();
                    setReviews(reviewsData.reviews || []);
                }

                console.log(data.product);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unexpected error occurred');
                console.error('Error fetching product details:', error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    return (
        <div style={{ maxWidth: 900, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
            {loading ? (
                <p style={{ color: '#888', textAlign: 'center' }}>Loading product details...</p>
            ) : !product ? (
                <p style={{ color: 'red', textAlign: 'center' }}>Product not found</p>
            ) : (
                <>
                    <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 320px", minWidth: 320 }}>
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    style={{ width: "100%", borderRadius: 8, objectFit: "cover", maxHeight: 350 }}
                                />
                            ) : (
                                <div style={{ width: "100%", height: 350, background: "#eee", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span>No Image</span>
                                </div>
                            )}
                        </div>
                        <div style={{ flex: "2 1 400px", minWidth: 320 }}>
                            <h1 style={{ marginBottom: 8 }}>{product.name}</h1>
                            <p style={{ color: "#666", marginBottom: 16 }}>{product.description}</p>
                            <div style={{ marginBottom: 16 }}>
                                <span style={{ fontWeight: 600, fontSize: 24, color: "#1976d2" }}>₹{product.price.toLocaleString()}</span>
                                <span style={{ marginLeft: 16, color: "#888" }}>({product.quantity} available)</span>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Category:</strong> {product.category} &nbsp;|&nbsp;
                                <strong>Industry:</strong> {product.industry}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Condition:</strong> {product.condition} &nbsp;|&nbsp;
                                <strong>Listing Type:</strong> {product.listingType}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Model:</strong> {product.model} &nbsp;|&nbsp;
                                <strong>Product Code:</strong> {product.productCode}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>HSN Code:</strong> {product.hsnCode} &nbsp;|&nbsp;
                                <strong>Country of Source:</strong> {product.countryOfSource}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Validity:</strong> {product.validityPeriod}
                            </div>
                            <div style={{ marginTop: 24 }}>
                                <h3>Seller Info</h3>
                                <div style={{ background: "#f7f7f7", padding: 12, borderRadius: 6 }}>
                                    <div><strong>Business:</strong> {product.seller.businessName}</div>
                                    <div>
                                        <strong>Location:</strong> {product.seller.city}, {product.seller.state}, {product.seller.country}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {product.specifications && (
                        <div style={{ marginTop: 32 }}>
                            <h3>Specifications</h3>
                            <div style={{ background: "#fafafa", padding: 16, borderRadius: 6, whiteSpace: "pre-line" }}>
                                {product.specifications}
                            </div>
                        </div>
                    )}
                    <div style={{ marginTop: 32, color: "#aaa", fontSize: 13 }}>
                        <span>Created: {new Date(product.createdAt).toLocaleString()}</span>
                        <span style={{ marginLeft: 16 }}>Updated: {new Date(product.updatedAt).toLocaleString()}</span>
                    </div>
                    {reviews.length > 0 && (
                        <div style={{ marginTop: 32 }}>
                            <h3>Reviews ({reviews.length})</h3>
                            <div style={{ marginTop: 16 }}>
                                {reviews.map((review) => (
                                    <div key={review.id} style={{ marginBottom: 16, padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
                                        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                                            <strong>{review.buyer.firstName} {review.buyer.lastName}</strong>
                                            <span style={{ marginLeft: 8, color: "#888" }}>({review.buyer.city}, {review.buyer.country})</span>
                                        </div>
                                        <div style={{ color: "#f39c12" }}>
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </div>
                                        <p style={{ marginTop: 8 }}>{review.comment}</p>
                                        <span style={{ fontSize: 12, color: "#aaa" }}>{new Date(review.createdAt).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {reviews.length === 0 && (
                        <div style={{ marginTop: 32, color: "#888" }}>
                            <h3>No Reviews Yet</h3>
                            <p>Be the first to review this product!</p>
                        </div>
                    )}

                </>
            )}
        </div>
    )
}

export default IndividualProductPage;