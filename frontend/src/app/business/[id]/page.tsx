"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
    Building,
    Globe,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Package,
    Star,
    ExternalLink,
    LinkIcon,
    Verified,
    Clock,
    Users,
    TrendingUp,
    Shield,
    RefreshCw,
    MessageSquare,
    Heart,
    Share2,
    Filter,
    Grid,
    List,
    Search,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_URL = `${BACKEND_URL}/seller`;

interface SellerProfileData {
    message: string;
    seller: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        countryCode: string;
        role: string;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        isApproved: boolean;
        businessName: string;
        businessType: string;
        registrationNo: string;
        taxId: string;
        website: string;
        linkedIn: string;
        yearsInBusiness: number;
        industryTags: string[];
        keyProducts: string[];
        companyBio: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        createdAt: Date;
        updatedAt: Date;
        products: {
            id: string;
            name: string;
            description: string;
            price: number;
            currency: string;
            quantity: number;
            minimumOrderQuantity: number;
            listingType: string;
            condition: string;
            validityPeriod: number;
            expiryDate: Date | null;
            deliveryTimeInDays: number | null;
            logisticsSupport: boolean;
            industry: string;
            category: string;
            productCode: string;
            model: string | null;
            specifications: string | null;
            countryOfSource: string | null;
            hsnCode: string | null;
            certifications: string[] | null;
            warrantyPeriod: number | null;
            licenses: string[] | null;
            brochureUrl: string | null;
            videoUrl: string | null;
            images: string[];
            tags: string[];
        }[];
    }
}

const SellerPublicProfileComponent: React.FC = () => {
    const [sellerProfile, setSellerProfile] = useState<SellerProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [industryFilter, setIndustryFilter] = useState('all');
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    React.useEffect(() => {
        const fetchSellerProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/public-profile/${id}`);
                const dataResponse = await response.json();

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch seller profile: ${dataResponse.error || response.statusText}`
                    );
                }

                setSellerProfile(dataResponse);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSellerProfile();
        }
    }, [id]);

    // Function to handle sharing the seller profile
    const handleSellerShare = (sellerId: string) => {
        const shareUrl = `${window.location.origin}/business/${sellerId}`;
        const title = `Check out ${sellerProfile?.seller.businessName}'s profile on our platform!`;
        const text = `Explore the products and services offered by ${sellerProfile?.seller.businessName}.`;
        navigator.share({
            title,
            text,
            url: shareUrl
        });
    };

    // Filter products based on search and filters
    const filteredProducts = React.useMemo(() => {
        if (!sellerProfile?.seller?.products) return [];

        return sellerProfile.seller.products.filter(product => {
            const matchesSearch = searchTerm === '' ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesIndustry = industryFilter === 'all' || product.industry === industryFilter;

            return matchesSearch && matchesCategory && matchesIndustry;
        });
    }, [sellerProfile?.seller?.products, searchTerm, categoryFilter, industryFilter]);

    // Get unique categories and industries
    const categories = React.useMemo(() => {
        if (!sellerProfile?.seller?.products) return [];
        return [...new Set(sellerProfile.seller.products.map(p => p.category))].filter(Boolean);
    }, [sellerProfile?.seller?.products]);

    const industries = React.useMemo(() => {
        if (!sellerProfile?.seller?.products) return [];
        return [...new Set(sellerProfile.seller.products.map(p => p.industry))].filter(Boolean);
    }, [sellerProfile?.seller?.products]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading seller profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <Alert className="max-w-md border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                        Error: {error}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!sellerProfile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No seller profile found</h3>
                    <p className="text-gray-600">The requested seller profile could not be found.</p>
                </div>
            </div>
        );
    }

    const { seller } = sellerProfile;
    const products = seller.products;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                        {/* Company Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl lg:text-5xl font-bold text-white border-4 border-white/30">
                                {seller.businessName ? seller.businessName[0].toUpperCase() : seller.firstName[0].toUpperCase()}
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                        {seller.businessName}
                                    </h1>
                                    <p className="text-xl text-orange-100 mb-4">
                                        {seller.firstName} {seller.lastName}
                                    </p>
                                    <p className="text-orange-100 mb-4 max-w-3xl leading-relaxed">
                                        {seller.companyBio}
                                    </p>
                                </div>

                                <div className="flex space-x-2">
                                    <Button variant="secondary" size="sm">
                                        <Heart className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                    <Button variant="secondary" size="sm"
                                        onClick={() => {
                                            handleSellerShare(seller.id);
                                        }}
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {seller.isApproved && (
                                    <Badge className="bg-green-500 text-white border-0">
                                        <Verified className="w-3 h-3 mr-1" />
                                        Verified Business
                                    </Badge>
                                )}
                                {seller.isEmailVerified && (
                                    <Badge className="bg-blue-500 text-white border-0">
                                        <Mail className="w-3 h-3 mr-1" />
                                        Email Verified
                                    </Badge>
                                )}
                                {seller.isPhoneVerified && (
                                    <Badge className="bg-purple-500 text-white border-0">
                                        <Phone className="w-3 h-3 mr-1" />
                                        Phone Verified
                                    </Badge>
                                )}
                                <Badge className="bg-orange-500 text-white border-0">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {seller.yearsInBusiness} Years in Business
                                </Badge>
                            </div>

                            {/* Industry Tags */}
                            <div className="flex flex-wrap gap-2">
                                {seller.industryTags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Package className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-2xl font-bold">{products.length}</p>
                                    <p className="text-sm text-gray-600">Products</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold">{seller.yearsInBusiness}</p>
                                    <p className="text-sm text-gray-600">Years Active</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <p className="text-2xl font-bold">4.8</p>
                                    <p className="text-sm text-gray-600">Rating</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-2xl font-bold">95%</p>
                                    <p className="text-sm text-gray-600">Response Rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Company Details */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Company Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Building className="w-5 h-5" />
                                    <span>Company Details</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Business Type</p>
                                    <p className="text-gray-900">{seller.businessType}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Registration Number</p>
                                    <p className="text-gray-900">{seller.registrationNo}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Tax ID</p>
                                    <p className="text-gray-900">{seller.taxId}</p>
                                </div>

                                {seller.keyProducts.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Key Products</p>
                                        <div className="flex flex-wrap gap-2">
                                            {seller.keyProducts.map((product) => (
                                                <Badge key={product} variant="outline">
                                                    {product}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Mail className="w-5 h-5" />
                                    <span>Contact Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {seller.website && (
                                    <div className="flex items-center space-x-2">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <a
                                            href={seller.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            {seller.website}
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    </div>
                                )}

                                {seller.linkedIn && (
                                    <div className="flex items-center space-x-2">
                                        <LinkIcon className="w-4 h-4 text-gray-400" />
                                        <a
                                            href={seller.linkedIn}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            LinkedIn Profile
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{seller.email}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">
                                        {seller.countryCode} {seller.phone}
                                    </span>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                    <div className="text-gray-900">
                                        <p>{seller.street}</p>
                                        <p>{seller.city}, {seller.state} {seller.zipCode}</p>
                                        <p>{seller.country}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Get in Touch</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Send Message
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Request Call
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Package className="w-4 h-4 mr-2" />
                                    Request Quote
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Products Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2">
                                        <Package className="w-5 h-5" />
                                        <span>Products ({filteredProducts.length})</span>
                                    </CardTitle>

                                    <div className="flex items-center space-x-2">
                                        <div className="flex border rounded-md">
                                            <Button
                                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setViewMode('grid')}
                                                className="rounded-r-none"
                                            >
                                                <Grid className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setViewMode('list')}
                                                className="rounded-l-none"
                                            >
                                                <List className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map(category => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={industryFilter} onValueChange={setIndustryFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Industries</SelectItem>
                                            {industries.map(industry => (
                                                <SelectItem key={industry} value={industry}>
                                                    {industry}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {products.length === 0 ? 'No products listed' : 'No products match your filters'}
                                        </h3>
                                        <p className="text-gray-600">
                                            {products.length === 0
                                                ? 'This seller has not listed any products yet.'
                                                : 'Try adjusting your search criteria or filters.'
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                            : 'space-y-4'
                                    }>
                                        {filteredProducts.map((product) => (
                                            <Card
                                                key={product.id}
                                                className={`hover:shadow-md transition-shadow cursor-pointer ${viewMode === 'list' ? 'p-4' : ''
                                                    }`}
                                            >
                                                <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-0'}>
                                                    <div className={viewMode === 'list' ? 'flex items-center space-x-4' : ''}>

                                                        {/* Product Image Placeholder */}
                                                        <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${viewMode === 'list' ? 'w-16 h-16' : 'w-full h-32 mb-4'
                                                            }`}>
                                                            <Package className={`text-gray-400 ${viewMode === 'list' ? 'w-6 h-6' : 'w-8 h-8'
                                                                }`} />
                                                        </div>

                                                        <div className="flex-1"
                                                            onClick={() => router.push(`/products/${product.category}/${product.id}`)}
                                                            title='Click to view product details.'
                                                        >
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div>
                                                                    <h3 className={`font-semibold text-gray-900 ${viewMode === 'list' ? 'text-base' : 'text-lg'
                                                                        }`}>
                                                                        {product.name}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-600">
                                                                        {product.category} • {product.industry}
                                                                    </p>
                                                                </div>
                                                                {viewMode === 'grid' && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {product.condition}
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <p className={`text-gray-700 mb-3 ${viewMode === 'list' ? 'text-sm line-clamp-1' : 'text-sm line-clamp-2'
                                                                }`}>
                                                                {product.description}
                                                            </p>

                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <span className="text-lg font-bold text-green-600">
                                                                        {product.currency} {product.price.toLocaleString()}
                                                                    </span>
                                                                    <p className="text-xs text-gray-500">
                                                                        Min. Order: {product.minimumOrderQuantity}
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    {product.logisticsSupport && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            Logistics
                                                                        </Badge>
                                                                    )}
                                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SellerPublicProfileComponent;