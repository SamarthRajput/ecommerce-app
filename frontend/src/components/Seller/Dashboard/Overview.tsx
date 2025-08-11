'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DollarSign,
    Package,
    Eye,
    MessageSquare,
    User,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    TrendingUp,
    TrendingDown,
    Star,
    CheckCircle,
    AlertCircle,
    XCircle,
    Calendar,
} from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/listing-formatter';
import { SellerDashboardListing, SellerDashboardRfq } from '@/lib/types/seller/sellerDashboard';

// Types
interface Seller {
    id: string;
    firstName: string;
    lastName: string;
    businessName: string;
    isApproved: boolean;
    avgRating?: number;
}

interface DashboardStats {
    totalListings: number;
    activeListings: number;
    totalViews: number;
    totalRFQs: number;
    totalRevenue: number;
    monthlyRevenue: number;
    responseRate: number;
    avgRating: number;
    recentOrders: number;
    pendingOrders: number;
}

interface OverviewProps {
    seller: Seller | null;
    dashboardStats: DashboardStats | null;
    rfqRequests: SellerDashboardRfq[];
    listings: SellerDashboardListing[];
    setCurrentView: React.Dispatch<React.SetStateAction<
        'overview' | 'listings' | 'rfqs' | 'profile' | 'certifications' | 'chats' | 'settings'
    >>;
}

// Utility functions
const getStatusConfig = (status: string) => {
    const configs = {
        active: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        inactive: { color: 'bg-gray-100 text-gray-700', icon: Clock },
        pending: { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
        rejected: { color: 'bg-red-100 text-red-700', icon: XCircle },
        PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        ACCEPTED: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        REJECTED: { color: 'bg-red-100 text-red-700', icon: XCircle },
    };
    return configs[status as keyof typeof configs] || configs.pending;
};

const calculateTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) return { percentage: 0, isPositive: true };
    const percentage = ((current - previous) / previous) * 100;
    return { percentage: Math.abs(percentage), isPositive: percentage >= 0 };
};

const RenderOverview: React.FC<OverviewProps> = ({
    seller,
    dashboardStats,
    rfqRequests,
    listings,
    setCurrentView,
}) => {
    const router = useRouter();

    // Calculate derived metrics
    const pendingRFQs = rfqRequests?.filter(rfq => rfq.status === 'FORWARDED') || [];
    const recentRFQs = rfqRequests?.slice(0, 5) || [];
    const topListings = listings
        ?.sort((a, b) => {
            if (b.rfq && b.rfq.length !== a.rfq && a.rfq.length) {
                return b.rfq.length - a.rfq.length;
            }
            return b.views - a.views;
        })
        ?.slice(0, 5) || [];

    const activeListingsCount = listings?.filter(listing => listing.status === 'active').length || 0;
    const totalViews = listings?.reduce((sum, listing) => sum + listing.views, 0) || 0;
    const avgRating = dashboardStats?.avgRating || seller?.avgRating || 0;

    // Stats cards data
    const statsCards = [
        {
            title: 'Total Revenue',
            value: formatPrice(dashboardStats?.totalRevenue || 0),
            icon: DollarSign,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            trend: dashboardStats?.monthlyRevenue
                ? calculateTrend(dashboardStats.totalRevenue, dashboardStats.totalRevenue - dashboardStats.monthlyRevenue)
                : null,
            subtitle: `₹${dashboardStats?.monthlyRevenue || 0} this month`,
        },
        {
            title: 'Active Listings',
            value: activeListingsCount.toString(),
            icon: Package,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            subtitle: `${dashboardStats?.totalListings || listings?.length || 0} total listings`,
        },
        {
            title: 'Total Views',
            value: totalViews.toLocaleString(),
            icon: Eye,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            subtitle: `Across ${activeListingsCount} active listings`,
        },
        {
            title: 'RFQ Requests',
            value: rfqRequests?.length?.toString() || '0',
            icon: MessageSquare,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            subtitle: `${pendingRFQs.length} pending review`,
            highlight: pendingRFQs.length > 0,
        },
    ];

    // Quick stats for header
    const quickStats = [
        {
            label: 'Rating',
            value: avgRating > 0 ? avgRating.toFixed(1) : 'N/A',
            icon: Star,
        },
        {
            label: 'Response Rate',
            value: dashboardStats?.responseRate ? `${dashboardStats.responseRate}%` : 'N/A',
            icon: TrendingUp,
        },
        {
            label: 'Recent Orders',
            value: dashboardStats?.recentOrders?.toString() || '0',
            icon: Package,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-0">
                <CardContent className="p-6 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl lg:text-3xl font-bold">
                                Welcome back, {seller?.firstName || 'Seller'}! 👋
                            </h1>
                            <p className="text-orange-100 text-sm lg:text-base">
                                {seller?.businessName && `${seller.businessName} • `}
                                Here's your business overview
                            </p>
                            {!seller?.isApproved && (
                                <Badge className="bg-yellow-500 text-white">
                                    Approval Pending
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-6">
                            {quickStats.map((stat, index) => (
                                <div key={index} className="text-center min-w-[80px]">
                                    <div className="flex items-center justify-center mb-1">
                                        <stat.icon className="w-4 h-4 mr-1" />
                                        <span className="text-xl lg:text-2xl font-bold">
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p className="text-xs lg:text-sm text-orange-100">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statsCards.map((card, index) => (
                    <Card key={index} className={card.highlight ? 'ring-2 ring-orange-200' : ''}>
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground font-medium">
                                        {card.title}
                                    </p>
                                    <p className="text-2xl lg:text-3xl font-bold">
                                        {card.value}
                                    </p>
                                    {card.trend && (
                                        <div className={`flex items-center text-xs ${card.trend.isPositive ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {card.trend.isPositive ? (
                                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                            ) : (
                                                <ArrowDownRight className="w-4 h-4 mr-1" />
                                            )}
                                            {card.trend.percentage.toFixed(1)}% from last period
                                        </div>
                                    )}
                                    {card.subtitle && !card.trend && (
                                        <p className="text-xs text-muted-foreground">
                                            {card.subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={cn('p-3 rounded-lg', card.iconBg)}>
                                    <card.icon className={cn('w-5 h-5 lg:w-6 lg:h-6', card.iconColor)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/*Quick action button above recent rFQ requests*/}
            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                            className="flex flex-col items-center justify-center gap-3 h-24 bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => router.push('/seller/create-listing')}
                        >
                            <Plus className="w-6 h-6" />
                            <span className="text-sm font-medium">Add New Product</span>
                        </Button>

                        <Button
                            variant="outline"
                            className="flex flex-col items-center justify-center gap-3 h-24 hover:bg-orange-50 hover:border-orange-200"
                            onClick={() => setCurrentView('rfqs')}
                        >
                            <MessageSquare className="w-6 h-6" />
                            <span className="text-sm font-medium">
                                Review RFQs ({pendingRFQs.length})
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            className="flex flex-col items-center justify-center gap-3 h-24 hover:bg-blue-50 hover:border-blue-200"
                            onClick={() => setCurrentView('listings')}
                        >
                            <Eye className="w-6 h-6" />
                            <span className="text-sm font-medium">View Active Listings</span>
                        </Button>

                        <Button
                            variant="outline"
                            className="flex flex-col items-center justify-center gap-3 h-24 hover:bg-green-50 hover:border-green-200"
                            onClick={() => setCurrentView('settings')}
                        >
                            <TrendingUp className="w-6 h-6" />
                            <span className="text-sm font-medium">Upload Certificates</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent RFQ Requests */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg font-semibold">
                            Recent RFQ Requests
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentView('rfqs')}
                            className="text-orange-600 hover:text-orange-700"
                        >
                            View All ({rfqRequests?.length || 0})
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentRFQs.length > 0 ? (
                            recentRFQs.map((rfq) => {
                                const statusConfig = getStatusConfig(rfq.status);
                                return (
                                    <div
                                        key={rfq.id}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="space-y-1 flex-1">
                                            <p className="font-medium text-sm">
                                                {rfq.product.name || 'Product Inquiry'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Quantity: {rfq.quantity}
                                                {rfq.product.price && ` • Target: ${formatPrice(rfq.product.price)}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3 inline mr-1" />
                                                {formatDate(typeof rfq.createdAt === 'string' ? rfq.createdAt : rfq.createdAt.toISOString())}
                                            </p>
                                        </div>
                                        <Badge className={statusConfig.color}>
                                            {rfq.status.toLowerCase()}
                                        </Badge>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No RFQ requests yet</p>
                                <p className="text-sm">Requests will appear here when buyers are interested</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Performing Listings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg font-semibold">
                            Top Performing Listings
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentView('listings')}
                            className="text-orange-600 hover:text-orange-700"
                        >
                            View All ({listings?.length || 0})
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {topListings.length > 0 ? (
                            topListings.map((listing) => {
                                const statusConfig = getStatusConfig(listing.status);
                                return (
                                    <div
                                        key={listing.id}
                                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                            {listing.images?.[0] ? (
                                                <img
                                                    src={listing.images[0]}
                                                    alt={listing.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <p className="font-medium text-sm truncate">
                                                {listing.productName}
                                            </p>
                                            <p className="text-sm font-semibold text-green-600">
                                                {formatPrice(listing.price)}
                                            </p>
                                            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                                <span className="flex items-center">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    {listing.views || 0}
                                                </span>
                                                <span className="flex items-center">
                                                    <MessageSquare className="w-3 h-3 mr-1" />
                                                    {listing.rfq && listing.rfq.length || 0}
                                                </span>
                                            </div>
                                        </div>

                                        <Badge className={statusConfig.color}>
                                            {listing.status}
                                        </Badge>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No listings yet</p>
                                <p className="text-sm">Create your first listing to start selling</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>


        </div>
    );
};

export default RenderOverview;