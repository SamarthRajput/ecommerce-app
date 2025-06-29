import React from 'react'
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Package, Eye, MessageSquare, User, Plus, ArrowUpRight, Clock, Badge } from 'lucide-react';
import { formatDate, formatPrice } from '@/src/lib/listing-formatter';

const getStatusColor = (status: string) => {
    const colors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
        verified: 'bg-green-100 text-green-800',
        urgent: 'bg-red-100 text-red-800',
        high: 'bg-orange-100 text-orange-800',
        medium: 'bg-blue-100 text-blue-800',
        low: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const RenderOverview = ({
    seller,
    dashboardStats,
    rfqRequests,
    listings,
    setCurrentView
}: {
    seller: any;
    dashboardStats: any;
    rfqRequests: any[];
    listings: any[];
    setCurrentView: React.Dispatch<React.SetStateAction<"overview" | "listings" | "rfqs" | "profile" | "settings">>
}) => {
    const router = useRouter();

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            Welcome back, {seller?.firstName}! 👋
                        </h2>
                        <p className="text-orange-100">
                            Here's what's happening with your business today
                        </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{seller?.rating || 4.8}</div>
                            <div className="text-orange-100 text-sm">Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{dashboardStats?.responseRate || 94}%</div>
                            <div className="text-orange-100 text-sm">Response Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatPrice(dashboardStats?.totalRevenue || 0)}
                                </p>
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    +12.5% from last month
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardStats?.activeListings || 0}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    of {dashboardStats?.totalListings || 0} total
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Views</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardStats?.totalViews?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-blue-600 flex items-center mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    +8.2% this week
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Eye className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">RFQ Requests</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardStats?.totalRFQs || 0}
                                </p>
                                <p className="text-xs text-orange-600 flex items-center mt-1">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {(rfqRequests?.filter(r => r.status === 'pending').length ?? 0)} pending
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent RFQs */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Recent RFQ Requests</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentView('rfqs')}
                        >
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {rfqRequests?.slice(0, 3).map((rfq) => (
                                <div key={rfq.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{rfq.productName}</p>
                                        <p className="text-xs text-gray-500">{rfq.buyerName}</p>
                                        <p className="text-xs text-gray-500">
                                            Qty: {rfq.quantity} • Target: {formatPrice(rfq.targetPrice)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={getStatusColor(rfq.urgency)}>
                                            {rfq.urgency}
                                        </Badge>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDate(rfq.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performing Listings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Top Performing Listings</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentView('listings')}
                        >
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {listings?.slice(0, 3).map((listing) => (
                                <div key={listing.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                        {listing.images?.[0] ? (
                                            <img
                                                src={listing.images[0]}
                                                alt={listing.productName}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <Package className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{listing.productName}</p>
                                        <p className="text-xs text-gray-500">{formatPrice(listing.price)}</p>
                                        <p className="text-xs text-gray-500">
                                            {listing.views} views • {listing.rfqCount} RFQs
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(listing.status)}>
                                        {listing.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            className="h-auto p-4 flex flex-col items-center space-y-2 bg-orange-600 hover:bg-orange-700"
                            onClick={() => router.push('/seller/create-listing')}
                        >
                            <Plus className="w-6 h-6" />
                            <span>Create New Listing</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center space-y-2"
                            onClick={() => setCurrentView('rfqs')}
                        >
                            <MessageSquare className="w-6 h-6" />
                            <span>Respond to RFQs</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center space-y-2"
                            onClick={() => setCurrentView('profile')}
                        >
                            <User className="w-6 h-6" />
                            <span>Update Profile</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RenderOverview;