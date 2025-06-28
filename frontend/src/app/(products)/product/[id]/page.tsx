"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/src/context/AuthContext';

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

const IndividualProductPage = () => {
    const params = useParams();
    const { id } = params;
    const { isBuyer, authenticated, user, logout } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<ReviewProduct[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [reviewForm, setReviewForm] = useState({
        rating: 0,
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

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

                const data = await response.json();
                if (!data.product) {
                    throw new Error('Product not found');
                }
                setProduct(data.product);

                if (reviewsResponse.ok) {
                    const reviewsData = await reviewsResponse.json();
                    // Handle both array and message responses
                    if (Array.isArray(reviewsData.reviews)) {
                        setReviews(reviewsData.reviews);
                    } else if (reviewsData.message) {
                        setReviews([]);
                    }
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unexpected error occurred');
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            if (!authenticated || !isBuyer) {
                throw new Error('Please login as a buyer to submit a review');
            }
            if (reviewForm.rating === 0) {
                throw new Error('Please select a rating');
            }

            const response = await fetch(`${backendUrl}/products/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(reviewForm),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit review');
            }

            const data = await response.json();
            setReviews([data.review, ...reviews]);
            setReviewForm({ rating: 0, comment: '' });
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const StarRatingInput = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
        return (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                            fontSize: '24px',
                            color: star <= rating ? '#f39c12' : '#ddd',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0
                        }}
                    >
                        {star <= rating ? '★' : '☆'}
                    </button>
                ))}
            </div>
        );
    };

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
                            <div style={{ marginTop: 24 }}>
                                <div className="flex gap-4">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors" asChild size="lg">
                                        <Link href={`/buyer/request-quote/${product.id}`}>
                                            Request RFQ
                                        </Link>
                                    </Button>
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
                    
                    {/* Reviews Section */}
                    <div style={{ marginTop: 32 }}>
                        <h3>Customer Reviews ({reviews.length})</h3>
                        
                        {/* Review Form */}
                        <div style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
                            <h4>Write a Review</h4>
                            <form onSubmit={handleReviewSubmit} style={{ marginTop: 16 }}>
                                <StarRatingInput 
                                    rating={reviewForm.rating} 
                                    setRating={(rating) => setReviewForm({...reviewForm, rating})} 
                                />
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', marginBottom: 8 }}>Your Review</label>
                                    <Textarea
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                        placeholder="Share your experience with this product..."
                                        style={{ width: '100%', minHeight: 100, padding: 8 }}
                                    />
                                </div>
                                {submitError && <p style={{ color: 'red', marginBottom: 16 }}>{submitError}</p>}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || reviewForm.rating === 0}
                                    style={{ background: '#1976d2', color: 'white', padding: '8px 16px', borderRadius: 4 }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </Button>
                            </form>
                        </div>
                        
                        {/* Reviews List */}
                        {reviews.length > 0 ? (
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
                        ) : (
                            <div style={{ marginTop: 32, color: "#888", textAlign: 'center' }}>
                                <p>No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default IndividualProductPage;