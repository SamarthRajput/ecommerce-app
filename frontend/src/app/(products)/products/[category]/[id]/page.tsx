// src: /app/products/[category]/[id]/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Heart, Share2, ShoppingCart, MessageSquare, Package, Truck, Shield, MapPin, Building, User, ChevronLeft, ChevronRight, Plus, Minus, RefreshCw, AlertTriangle, CheckCircle, ArrowLeft, Home, Search, Award, Eye, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

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
    slug: string;
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

const ProductPage = () => {
    const params = useParams();
    const { category, id } = params as { category: string; id: string };
    const { isBuyer, authenticated, user } = useAuth();
    const router = useRouter();

    // State management
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<ReviewProduct[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [imageZoomed, setImageZoomed] = useState(false);
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
                    fetch(`${backendUrl}/products/${category}/${id}`),
                    fetch(`${backendUrl}/products/${category}/${id}/reviews`)
                ]);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Product not found');
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
                    if (Array.isArray(reviewsData.reviews)) {
                        setReviews(reviewsData.reviews);
                    } else {
                        setReviews([]);
                    }
                }

                // Fetch similar and seller products
                fetchSimilarProducts();
                fetchSellerProducts();
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    const fetchSimilarProducts = async () => {
        try {
            const response = await fetch(`${backendUrl}/products/${id}/similar?page=1&limit=8`);
            if (response.ok) {
                const data = await response.json();
                setSimilarProducts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching similar products:', error);
        }
    };

    const fetchSellerProducts = async () => {
        try {
            const response = await fetch(`${backendUrl}/products/seller/${id}?page=1&limit=8`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setSellerProducts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching seller products:', error);
        }
    };

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
                headers: { 'Content-Type': 'application/json' },
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
            setShowReviewForm(false);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShare = () => {
        const title = "Check out this product: " + product?.name;
        const url = `${window.location.origin}/products/${category}/${id}`;

        if (navigator.share) {
            navigator.share({
                title,
                url,
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Product link copied to clipboard!');
        }
    };

    const StarRating = ({ rating, onRatingChange, readonly = false }: {
        rating: number;
        onRatingChange?: (rating: number) => void;
        readonly?: boolean;
    }) => (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readonly && onRatingChange?.(star)}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
                    disabled={readonly}
                >
                    <Star
                        className={`w-4 h-4 md:w-5 md:h-5 ${star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                    />
                </button>
            ))}
        </div>
    );

    // Enhanced Image Gallery with laptop-optimized sizing
    const ImageGallery = () => {
        if (!product?.images || product.images.length === 0) {
            return (
                <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {/* Main Image - Optimized for different screen sizes */}
                <div className="relative">
                    <div
                        className={`relative w-full bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in transition-all duration-300 ${imageZoomed
                            ? 'h-[50vh] md:h-[60vh] lg:h-[70vh]'
                            : 'h-64 md:h-80 lg:h-96'
                            }`}
                        onClick={() => setImageZoomed(!imageZoomed)}
                    >
                        <img
                            src={product.images[activeImage]}
                            alt={product.name}
                            className={`w-full h-full transition-all duration-300 ${imageZoomed ? 'object-contain' : 'object-cover'
                                }`}
                        />

                        {/* Zoom indicator */}
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {imageZoomed ? 'Click to zoom out' : 'Click to zoom in'}
                        </div>

                        {/* Navigation arrows */}
                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImage(activeImage === 0 ? product.images.length - 1 : activeImage - 1);
                                    }}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
                                >
                                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImage(activeImage === product.images.length - 1 ? 0 : activeImage + 1);
                                    }}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
                                >
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Thumbnail Navigation */}
                {product.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-colors ${index === activeImage ? 'border-orange-500' : 'border-gray-200'
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <Link href={`/products/${product.category}/${product.id}`} className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200 h-full">
                <CardContent className="p-3 md:p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <h4 className="font-semibold text-xs md:text-sm line-clamp-2 mb-2 h-8 md:h-10">
                        {product.name}
                    </h4>
                    <p className="text-sm md:text-lg font-bold text-green-600">
                        ₹{product.price.toLocaleString()}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                        {product.seller?.businessName}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );

    // Enhanced Error Component with Quick CTAs
    const ErrorComponent = () => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {error === 'Product not found' ? 'Product Not Found' : 'Something went wrong'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error === 'Product not found'
                            ? "The product you're looking for doesn't exist or has been removed."
                            : error || 'An unexpected error occurred while loading the product.'
                        }
                    </p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.back()}
                            className="w-full"
                            variant="default"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                        <Button
                            onClick={() => router.push('/products')}
                            className="w-full"
                            variant="outline"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Browse Products
                        </Button>
                        <Button
                            onClick={() => router.push('/')}
                            className="w-full"
                            variant="ghost"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return <ErrorComponent />;
    }

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Enhanced Breadcrumb */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <nav className="text-xs md:text-sm text-gray-600 flex items-center overflow-x-auto">
                            <Link href="/" className="hover:text-orange-600 whitespace-nowrap">Home</Link>
                            <span className="mx-1 md:mx-2">/</span>
                            <Link href="/products" className="hover:text-orange-600 whitespace-nowrap">Products</Link>
                            <span className="mx-1 md:mx-2">/</span>
                            <Link href={`/products/${category}`} className="hover:text-orange-600 whitespace-nowrap">
                                {decodeURIComponent(category).charAt(0).toUpperCase() + decodeURIComponent(category).slice(1)}
                            </Link>
                            <span className="mx-1 md:mx-2">/</span>
                            <span className="text-gray-900 truncate max-w-32 md:max-w-none">{product.name}</span>
                        </nav>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="ml-2 flex-shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
                {/* Main Product Section - Improved Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
                    {/* Image Gallery - Takes up 3 columns on large screens */}
                    <div className="lg:col-span-3">
                        <ImageGallery />
                    </div>

                    {/* Product Info - Takes up 2 columns on large screens */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        {/* Product Header */}
                        <div>
                            <div className="flex items-start justify-between mb-3">
                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 pr-4 leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex space-x-1 md:space-x-2 flex-shrink-0">
                                    <Button variant="outline" size="sm" className="p-2">
                                        <Heart className="w-3 h-3 md:w-4 md:h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="p-2" onClick={handleShare}>
                                        <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
                                <div className="flex items-center space-x-2">
                                    <StarRating rating={Math.round(averageRating)} readonly />
                                    <span className="text-xs md:text-sm text-gray-600">
                                        {averageRating.toFixed(1)} ({reviews.length} reviews)
                                    </span>
                                </div>
                                <Badge variant="outline" className="text-xs">{product.condition}</Badge>
                                <Badge variant="secondary" className="text-xs">
                                    <Eye className="w-3 h-3 mr-1" />
                                    {product.quantity} available
                                </Badge>
                            </div>

                            <p className="text-sm md:text-base text-gray-700 leading-relaxed line-clamp-3 md:line-clamp-none">
                                {product.description}
                            </p>
                        </div>

                        {/* Price and Purchase */}
                        <Card className="border-2 border-orange-100">
                            <CardContent className="p-4 md:p-6">
                                <div className="space-y-4">
                                    <div className="bg-green-50 rounded-lg p-3 md:p-4">
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-2xl md:text-3xl font-bold text-green-600">
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                            <span className="text-sm md:text-base text-gray-600">per unit</span>
                                        </div>
                                        <div className="text-xs md:text-sm text-green-700 mt-1">
                                            Best price guaranteed
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                                        <div className="bg-gray-50 rounded p-2 md:p-3">
                                            <span className="text-gray-600 block">Available:</span>
                                            <span className="font-medium">{product.quantity} units</span>
                                        </div>
                                        <div className="bg-gray-50 rounded p-2 md:p-3">
                                            <span className="text-gray-600 block">Code:</span>
                                            <span className="font-medium">{product.productCode}</span>
                                        </div>
                                    </div>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Quantity:</span>
                                        <div className="flex items-center border rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                            >
                                                <Minus className="w-3 h-3 md:w-4 md:h-4" />
                                            </button>
                                            <span className="px-3 md:px-4 py-2 border-x bg-white font-medium min-w-[3rem] text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                            >
                                                <Plus className="w-3 h-3 md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:space-y-3">
                                        <Link
                                            href={`/buyer/request-quote/${product.id}`}
                                            className="block"
                                        >
                                            <Button className="w-full bg-orange-600 hover:bg-orange-700 h-10 md:h-12">
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Request Quote
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Trust indicators */}
                                    <div className="flex justify-between text-xs text-gray-600 pt-2 border-t">
                                        <div className="flex items-center">
                                            <Shield className="w-3 h-3 mr-1 text-green-600" />
                                            Secure
                                        </div>
                                        <div className="flex items-center">
                                            <Truck className="w-3 h-3 mr-1 text-blue-600" />
                                            Fast delivery
                                        </div>
                                        <div className="flex items-center">
                                            <ThumbsUp className="w-3 h-3 mr-1 text-purple-600" />
                                            Quality assured
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seller Info - Compact */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-sm md:text-base">Seller Information</h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const sellerPath = product.seller.slug
                                                ? `/business/${product.seller.slug}`
                                                : `/business/${product.seller.id}`;
                                            router.push(sellerPath);
                                        }}
                                        className="text-xs"
                                    >
                                        View Profile
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Building className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                                        <span className="font-medium text-sm">{product.seller.businessName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                                        <span className="text-xs md:text-sm text-gray-600">
                                            {product.seller.city}, {product.seller.state}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Product Details - Responsive Tabs */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
                    {/* Specifications */}
                    <div className="xl:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg md:text-xl">Product Specifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                    {[
                                        { label: 'Category', value: product.category },
                                        { label: 'Industry', value: product.industry },
                                        { label: 'Model', value: product.model || 'N/A' },
                                        { label: 'HSN Code', value: product.hsnCode },
                                        { label: 'Country of Origin', value: product.countryOfSource },
                                        { label: 'Validity Period', value: product.validityPeriod },
                                    ].map((spec) => (
                                        <div key={spec.label} className="bg-gray-50 rounded-lg p-3">
                                            <span className="text-xs md:text-sm font-medium text-gray-500 block mb-1">
                                                {spec.label}
                                            </span>
                                            <p className="text-sm md:text-base text-gray-900 font-medium">{spec.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {product.specifications && (
                                    <div className="pt-4 border-t">
                                        <span className="text-sm font-medium text-gray-500 block mb-2">
                                            Detailed Specifications
                                        </span>
                                        <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                                            <p className="text-sm md:text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
                                                {product.specifications}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Features - Compact */}
                    <div className="xl:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Why Choose This?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { icon: CheckCircle, label: 'Quality Assured', color: 'text-green-500' },
                                    { icon: Truck, label: 'Fast Delivery', color: 'text-blue-500' },
                                    { icon: Shield, label: 'Secure Transaction', color: 'text-purple-500' },
                                    { icon: Award, label: 'Expert Support', color: 'text-orange-500' },
                                ].map((feature) => (
                                    <div key={feature.label} className="flex items-center space-x-3">
                                        <feature.icon className={`w-4 h-4 md:w-5 md:h-5 ${feature.color}`} />
                                        <span className="text-xs md:text-sm font-medium">{feature.label}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Reviews Section - Improved */}
                <Card className="mb-8 md:mb-12">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <CardTitle className="text-lg md:text-xl">
                                Customer Reviews ({reviews.length})
                            </CardTitle>
                            {authenticated && isBuyer && (
                                <Button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    variant="outline"
                                    size="sm"
                                >
                                    Write Review
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Review Form */}
                        {showReviewForm && (
                            <form onSubmit={handleReviewSubmit} className="mb-6 p-3 md:p-4 border rounded-lg bg-gray-50">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rating</label>
                                        <StarRating
                                            rating={reviewForm.rating}
                                            onRatingChange={(rating) => setReviewForm(prev => ({ ...prev, rating }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Comment</label>
                                        <Textarea
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                            placeholder="Share your experience with this product..."
                                            rows={3}
                                            className="text-sm"
                                        />
                                    </div>
                                    {submitError && (
                                        <Alert className="border-red-200 bg-red-50">
                                            <AlertTriangle className="h-4 w-4 text-red-600" />
                                            <AlertDescription className="text-red-700 text-sm">
                                                {submitError}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button type="submit" disabled={isSubmitting} size="sm">
                                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowReviewForm(false)}
                                            size="sm"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Reviews List */}
                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <div className="text-center py-6 md:py-8 text-gray-500">
                                    <MessageSquare className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm md:text-base">No reviews yet. Be the first to review this product!</p>
                                </div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <User className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-2">
                                                        <span className="font-medium text-sm md:text-base">
                                                            {review.buyer.firstName} {review.buyer.lastName}
                                                        </span>
                                                        <StarRating rating={review.rating} readonly />
                                                        <span className="text-xs md:text-sm text-gray-500">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm md:text-base text-gray-700 mb-1">{review.comment}</p>
                                                    <p className="text-xs md:text-sm text-gray-500">
                                                        {review.buyer.city}, {review.buyer.country}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Similar Products - Responsive Grid */}
                {similarProducts.length > 0 && (
                    <Card className="mb-6 md:mb-8">
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Similar Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                {similarProducts.slice(0, 12).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* More from Seller - Responsive Grid */}
                {sellerProducts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg md:text-xl">More from {product.seller.businessName}</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const sellerPath = product.seller.slug
                                            ? `/business/${product.seller.slug}`
                                            : `/business/${product.seller.id}`;
                                        router.push(sellerPath);
                                    }}
                                    className="text-xs"
                                >
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                {sellerProducts.slice(0, 12).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Floating Action Button for Mobile */}
            <div className="fixed bottom-4 right-4 md:hidden z-20">
                <Button
                    className="rounded-full w-14 h-14 bg-orange-600 hover:bg-orange-700 shadow-lg"
                    onClick={() => {
                        document.querySelector('[href*="request-quote"]')?.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }}
                >
                    <ShoppingCart className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
};

export default ProductPage;