'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DollarSign,
    Package,
    Eye,
    MessageSquare,
    User,
    Plus,
    ArrowUpRight,
    Clock,
} from 'lucide-react';
import { formatDate, formatPrice } from '@/src/lib/listing-formatter';
import { badgeVariants } from '@/components/ui/badge';

const getStatusColor = (status: string) => {
    const variants: Record<string, string> = {
        active: badgeVariants({ variant: 'default' }),
        inactive: badgeVariants({ variant: 'secondary' }),
        pending: badgeVariants({ variant: 'outline' }),
        rejected: badgeVariants({ variant: 'destructive' }),
        verified: badgeVariants({ variant: 'default' }),
        urgent: badgeVariants({ variant: 'destructive' }),
        high: badgeVariants({ variant: 'default' }),
        medium: badgeVariants({ variant: 'outline' }),
        low: badgeVariants({ variant: 'secondary' }),
    };

    return variants[status] || badgeVariants({ variant: 'secondary' });
};

const RenderOverview = ({
    seller,
    dashboardStats,
    rfqRequests,
    listings,
    setCurrentView,
}: {
    seller: any;
    dashboardStats: any;
    rfqRequests: any[];
    listings: any[];
    setCurrentView: React.Dispatch<
        React.SetStateAction<'overview' | 'listings' | 'rfqs' | 'profile' | 'chats' | 'settings'>
    >;
}) => {
    const router = useRouter();

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            Welcome back, {seller?.firstName}! 👋
                        </h2>
                        <p className="text-sm text-orange-100">Here's your dashboard overview</p>
                    </div>
                    <div className="flex space-x-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{seller?.rating || 4.8}</div>
                            <div className="text-sm text-orange-100">Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{dashboardStats?.responseRate || 94}%</div>
                            <div className="text-sm text-orange-100">Response Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">{formatPrice(dashboardStats?.totalRevenue || 0)}</p>
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                    +12.5% from last month
                                </p>
                            </div>
                            <div className="bg-green-100 p-2 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Listings */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Listings</p>
                                <p className="text-2xl font-bold">{dashboardStats?.activeListings || 0}</p>
                                <p className="text-xs text-gray-500">
                                    of {dashboardStats?.totalListings || 0} total
                                </p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Views */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Views</p>
                                <p className="text-2xl font-bold">
                                    {dashboardStats?.totalViews?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-blue-600 flex items-center mt-1">
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                    +8.2% this week
                                </p>
                            </div>
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Eye className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* RFQ Requests */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-muted-foreground">RFQ Requests</p>
                                <p className="text-2xl font-bold">{dashboardStats?.totalRFQs || 0}</p>
                                <p className="text-xs text-orange-600 flex items-center mt-1">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {(rfqRequests?.filter((r) => r.status === 'pending').length ?? 0)} pending
                                </p>
                            </div>
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <MessageSquare className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RFQ + Listings Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent RFQs */}
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Recent RFQ Requests</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentView('rfqs')}>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {rfqRequests?.slice(0, 3).map((rfq) => (
                            <div
                                key={rfq.id}
                                className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition"
                            >
                                <div>
                                    <p className="text-sm font-medium">{rfq.productName}</p>
                                    <p className="text-xs text-muted-foreground">{rfq.buyerName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Qty: {rfq.quantity} • Target: {formatPrice(rfq.targetPrice)}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className={getStatusColor(rfq.urgency)}>{rfq.urgency}</span>
                                    <p className="text-xs text-muted-foreground">{formatDate(rfq.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Top Listings */}
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Top Performing Listings</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentView('listings')}>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {listings?.slice(0, 3).map((listing) => (
                            <div
                                key={listing.id}
                                className="flex items-center space-x-4 p-3 rounded-md hover:bg-muted transition"
                            >
                                <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                                    {listing.images?.[0] ? (
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Package className="w-6 h-6 text-muted-foreground mx-auto my-3" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{listing.productName}</p>
                                    <p className="text-xs text-muted-foreground">{formatPrice(listing.price)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {listing.views} views • {listing.rfqCount} RFQs
                                    </p>
                                </div>
                                <span className={getStatusColor(listing.status)}>{listing.status}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            className="flex flex-col items-center justify-center gap-2 h-28 bg-orange-600 text-white hover:bg-orange-700"
                            onClick={() => router.push('/seller/create-listing')}
                        >
                            <Plus className="w-6 h-6" />
                            Create New Listing
                        </Button>
                        <Button
                            variant="outline"
                            className="flex flex-col items-center justify-center gap-2 h-28"
                            onClick={() => setCurrentView('rfqs')}
                        >
                            <MessageSquare className="w-6 h-6" />
                            Respond to RFQs
                        </Button>
                        <Button
                            variant="outline"
                            className="flex flex-col items-center justify-center gap-2 h-28"
                            onClick={() => setCurrentView('profile')}
                        >
                            <User className="w-6 h-6" />
                            Update Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RenderOverview;
