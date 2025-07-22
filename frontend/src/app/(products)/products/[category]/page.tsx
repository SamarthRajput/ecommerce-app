"use client";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Grid3X3,
    List,
    Star,
    Heart,
    Package,
    MapPin,
    Building,
    ArrowLeft,
    Home,
    SlidersHorizontal,
    X,
    RefreshCw,
    AlertTriangle,
    Eye,
    TrendingUp,
    Award,
    Zap,
    ShoppingCart,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
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
    averageRating?: number;
    reviewCount?: number;
}

interface Seller {
    id: string;
    businessName: string;
    country: string;
    state: string;
    city: string;
    slug: string;
}

interface FilterState {
    searchQuery: string;
    priceRange: [number, number];
    condition: string[];
    industry: string[];
    sortBy: string;
    viewMode: 'grid' | 'list';
}

const CategoryWiseProducts = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { category } = params as { category: string };
    const { isBuyer, authenticated } = useAuth();

    // State management
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const itemsPerPage = 24;

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        searchQuery: searchParams.get('search') || '',
        priceRange: [0, 1000000],
        condition: [],
        industry: [],
        sortBy: 'newest',
        viewMode: 'grid'
    });

    // Derived data for filters
    const uniqueConditions = useMemo(() => {
        const conditions = products.map(p => p.condition).filter(Boolean);
        return [...new Set(conditions)];
    }, [products]);

    const uniqueIndustries = useMemo(() => {
        const industries = products.map(p => p.industry).filter(Boolean);
        return [...new Set(industries)];
    }, [products]);

    const maxPrice = useMemo(() => {
        return products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000000;
    }, [products]);

    // Filtered and sorted products
    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            // Search query
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                const matchesName = product.name.toLowerCase().includes(query);
                const matchesDescription = product.description.toLowerCase().includes(query);
                const matchesSeller = product.seller.businessName.toLowerCase().includes(query);
                if (!matchesName && !matchesDescription && !matchesSeller) return false;
            }

            // Price range
            if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
                return false;
            }

            // Condition
            if (filters.condition.length > 0 && !filters.condition.includes(product.condition)) {
                return false;
            }

            // Industry
            if (filters.industry.length > 0 && !filters.industry.includes(product.industry)) {
                return false;
            }

            return true;
        });

        // Sort products
        switch (filters.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        return filtered;
    }, [products, filters]);

    // Pagination
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage]);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page when filters change
    }, [filteredProducts.length]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${backendUrl}/products/${category}?page=1&limit=1000`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Category not found');
                    }
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data.products || []);
                setTotalProducts(data.total || data.products?.length || 0);

                // Set initial price range based on actual data
                if (data.products && data.products.length > 0) {
                    const prices = data.products.map((p: Product) => p.price);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    setFilters(prev => ({
                        ...prev,
                        priceRange: [minPrice, maxPrice]
                    }));
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchProducts();
        }
    }, [category]);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            searchQuery: '',
            priceRange: [0, maxPrice],
            condition: [],
            industry: [],
            sortBy: 'newest',
            viewMode: filters.viewMode
        });
    };

    const formatCategoryName = (cat: string) => {
        return cat.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Product Card Components
    const ProductCard = ({ product }: { product: Product }) => (
        <Link href={`/products/${product.category}/${product.id}`} className="block h-full">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 h-full group"
            onClick={() => {
                router.push(`/products/${product.category}/${product.id}`);
            }}>
                <CardContent className="p-3 md:p-4 h-full flex flex-col">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                            </div>
                        )}

                        {/* Quick action buttons */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Add to wishlist logic
                                }}
                            >
                                <Heart className="w-3 h-3" />
                            </Button>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.condition && (
                                <Badge variant="secondary" className="text-xs">
                                    {product.condition}
                                </Badge>
                            )}
                            {product.quantity < 10 && (
                                <Badge variant="destructive" className="text-xs">
                                    Low Stock
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2 h-10 md:h-12 group-hover:text-orange-600 transition-colors">
                            {product.name}
                        </h3>

                        {/* Price */}
                        <div className="mb-2">
                            <p className="text-lg md:text-xl font-bold text-green-600">
                                ₹{product.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">per unit</p>
                        </div>

                        {/* Rating and Reviews */}
                        {product.averageRating && (
                            <div className="flex items-center space-x-1 mb-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3 h-3 ${star <= (product.averageRating || 0)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-600">
                                    ({product.reviewCount || 0})
                                </span>
                            </div>
                        )}

                        {/* Seller Info */}
                        <div className="mt-auto">
                            <div className="flex items-center space-x-1 mb-2">
                                <Building className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600 truncate">
                                    {product.seller?.businessName}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600 truncate">
                                    {product.seller?.city}, {product.seller?.state}
                                </span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                size="sm"
                                className="flex-1 h-8 bg-orange-600 hover:bg-orange-700 text-xs"
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`/buyer/request-quote/${product.id}`);
                                }}
                            >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Quote
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Contact seller logic
                                }}
                            >
                                <MessageSquare className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );

    const ProductListItem = ({ product }: { product: Product }) => (
        <Link href={`/products/${product.category}/${product.id}`} className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200 group">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-base md:text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
                                    {product.name}
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 flex-shrink-0"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Add to wishlist
                                    }}
                                >
                                    <Heart className="w-4 h-4" />
                                </Button>
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {product.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge variant="outline" className="text-xs">
                                    {product.condition}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    <Eye className="w-3 h-3 mr-1" />
                                    {product.quantity} available
                                </Badge>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xl font-bold text-green-600">
                                        ₹{product.price.toLocaleString()}
                                    </p>
                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                        <Building className="w-3 h-3" />
                                        <span>{product.seller?.businessName}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-orange-600 hover:bg-orange-700"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/buyer/request-quote/${product.id}`);
                                        }}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-1" />
                                        Get Quote
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );

    // Filter Sidebar
    const FilterSidebar = () => (
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
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <Input
                        placeholder="Search products..."
                        value={filters.searchQuery}
                        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                        className="h-9"
                    />
                </div>

                {/* Price Range */}
                <div>
                    <label className="text-sm font-medium mb-3 block">
                        Price Range: ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
                    </label>
                    <Slider
                        value={filters.priceRange}
                        onValueChange={(value: [number, number]) => handleFilterChange('priceRange', value)}
                        max={maxPrice}
                        min={0}
                        step={1000}
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
                                        id={condition}
                                        checked={filters.condition.includes(condition)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                handleFilterChange('condition', [...filters.condition, condition]);
                                            } else {
                                                handleFilterChange('condition', filters.condition.filter(c => c !== condition));
                                            }
                                        }}
                                    />
                                    <label htmlFor={condition} className="text-sm">
                                        {condition}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Industry */}
                {uniqueIndustries.length > 0 && (
                    <div>
                        <label className="text-sm font-medium mb-3 block">Industry</label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {uniqueIndustries.map((industry) => (
                                <div key={industry} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={industry}
                                        checked={filters.industry.includes(industry)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                handleFilterChange('industry', [...filters.industry, industry]);
                                            } else {
                                                handleFilterChange('industry', filters.industry.filter(i => i !== industry));
                                            }
                                        }}
                                    />
                                    <label htmlFor={industry} className="text-sm">
                                        {industry}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    // Loading Component
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Loading Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                        <div className="animate-pulse flex space-x-2">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                            <p className="text-gray-600">Loading products...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error Component
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {error === 'Category not found' ? 'Category Not Found' : 'Something went wrong'}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error === 'Category not found'
                                ? "The category you're looking for doesn't exist."
                                : error || 'An unexpected error occurred while loading products.'
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
                                Browse All Products
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
    }

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
                            <span className="text-gray-900 font-medium whitespace-nowrap">
                                {formatCategoryName(category)}
                            </span>
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

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                {/* Header Section */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                {formatCategoryName(category)}
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base">
                                {filteredProducts.length} of {products.length} products
                            </p>
                        </div>

                        {/* Category features */}
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Popular
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                Quality Assured
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Fast Delivery
                            </Badge>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                        {/* Mobile Filter Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex-1"
                            >
                                <SlidersHorizontal className="w-4 h-4 mr-2" />
                                Filters
                                {showFilters && <X className="w-4 h-4 ml-2" />}
                            </Button>
                            <div className="flex gap-1">
                                <Button
                                    variant={filters.viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilterChange('viewMode', 'grid')}
                                    className="p-2"
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={filters.viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilterChange('viewMode', 'list')}
                                    className="p-2"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Desktop Controls */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">View:</span>
                                <Button
                                    variant={filters.viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilterChange('viewMode', 'grid')}
                                    className="p-2"
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={filters.viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilterChange('viewMode', 'list')}
                                    className="p-2"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value) => handleFilterChange('sortBy', value)}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="name">Name: A to Z</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-6 lg:gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <FilterSidebar />
                    </div>

                    {/* Mobile Filters */}
                    {showFilters && (
                        <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
                            <div className="absolute right-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Filters</h3>
                                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <FilterSidebar />
                            </div>
                        </div>
                    )}

                    {/* Products Grid/List */}
                    <div className="flex-1 min-w-0">
                        {filteredProducts.length === 0 ? (
                            <Card className="p-8 md:p-12">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-600 mb-4">
                                        Try adjusting your search criteria or filters to find what you're looking for.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                        <Button onClick={clearFilters} variant="outline">
                                            Clear Filters
                                        </Button>
                                        <Button onClick={() => router.push('/products')}>
                                            Browse All Products
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <>
                                {/* Products Display */}
                                {filters.viewMode === 'grid' ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                                        {paginatedProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {paginatedProducts.map((product) => (
                                            <ProductListItem key={product.id} product={product} />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 md:mt-12">
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <div className="text-sm text-gray-600">
                                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                            disabled={currentPage === 1}
                                                        >
                                                            Previous
                                                        </Button>

                                                        <div className="flex items-center gap-1">
                                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                                let pageNum;
                                                                if (totalPages <= 5) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage <= 3) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage >= totalPages - 2) {
                                                                    pageNum = totalPages - 4 + i;
                                                                } else {
                                                                    pageNum = currentPage - 2 + i;
                                                                }

                                                                return (
                                                                    <Button
                                                                        key={pageNum}
                                                                        variant={currentPage === pageNum ? 'default' : 'outline'}
                                                                        size="sm"
                                                                        onClick={() => setCurrentPage(pageNum)}
                                                                        className="w-8 h-8 p-0"
                                                                    >
                                                                        {pageNum}
                                                                    </Button>
                                                                );
                                                            })}
                                                        </div>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Recently Viewed or Recommended Products */}
                {filteredProducts.length > 0 && (
                    <div className="mt-12">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">You might also like</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                                    {products
                                        .filter(p => !filteredProducts.includes(p))
                                        .slice(0, 6)
                                        .map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Floating Action Button for Mobile */}
            <div className="fixed bottom-4 right-4 lg:hidden z-20">
                <Button
                    className="rounded-full w-14 h-14 bg-orange-600 hover:bg-orange-700 shadow-lg"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal className="w-6 h-6" />
                </Button>
            </div>

            {/* Quick Stats Bar */}
            {products.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 lg:hidden z-10">
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                            <Package className="w-4 h-4 text-orange-600" />
                            <span className="font-medium">{filteredProducts.length}</span>
                            <span className="text-gray-600">products</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="font-medium">
                                ₹{Math.min(...filteredProducts.map(p => p.price)).toLocaleString()}
                            </span>
                            <span className="text-gray-600">starting</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryWiseProducts;