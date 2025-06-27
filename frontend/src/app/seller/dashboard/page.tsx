"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Package, LogOut, Building, BarChart3, MessageSquare, FileText, Settings, Plus, DollarSign, TrendingUp, Users, Eye, Bell, Search, Filter, Download, Calendar, Star, Shield, AlertCircle, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { renderProfile } from './Profile';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const API_BASE_URL = `${API_BACKEND_URL}/seller`;

// Types
interface Seller {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName: string;
    businessType: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    taxId: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    rating: number;
    totalSales: number;
    joinedDate: string;
}

interface Listing {
    id: string;
    productName: string;
    price: number;
    quantity: number;
    category: string;
    status: 'active' | 'inactive' | 'pending' | 'rejected';
    views: number;
    rfqCount: number;
    createdAt: string;
    images: string[];
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

interface RFQRequest {
    id: string;
    productName: string;
    buyerName: string;
    quantity: number;
    targetPrice: number;
    message: string;
    status: 'pending' | 'responded' | 'accepted' | 'rejected';
    createdAt: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
}

// Navigation items
const NAVIGATION_ITEMS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'rfqs', label: 'RFQ Requests', icon: MessageSquare },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type ViewType = typeof NAVIGATION_ITEMS[number]['id'];

const EnhancedSellerDashboard = () => {
    const [seller, setSeller] = useState<Seller | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [rfqRequests, setRfqRequests] = useState<RFQRequest[]>([]);
    const [notifications, setNotifications] = useState<number>(3);

    const router = useRouter();
    // State and handlers for profile editing
    const [isEditing, setIsEditing] = useState(false);
    const [profileForm, setProfileForm] = useState<any>(seller);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        try {
            // Example update logic
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(profileForm)
            });
            if (response.ok) {
                toast.success('Profile updated!');
                fetchProfile();
                setIsEditing(false);
            } else {
                setProfileError('Failed to update profile');
            }
        } catch (err) {
            setProfileError('Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };
    useEffect(() => {
        const savedToken = localStorage.getItem('sellerToken');
        if (savedToken) {
            setToken(savedToken);
            initializeDashboard(savedToken);
        } else {
            setDashboardLoading(false);
        }
    }, []);

    const initializeDashboard = async (tokenToVerify: string) => {
        try {
            setDashboardLoading(true);

            await Promise.all([
                fetchProfile(),
                fetchDashboardStats(),
                fetchListings(),
                fetchRFQRequests()

            ]);
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            localStorage.removeItem('sellerToken');
            router.push('/seller/signin');
        } finally {
            setDashboardLoading(false);
        }
    };

    const fetchProfile = async (    ) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setSeller(data.seller);
            } else {
                throw new Error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard-stats`, {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setDashboardStats(data.stats);
            } else {
                // Mock data for development
                setDashboardStats({
                    totalListings: 24,
                    activeListings: 18,
                    totalViews: 1547,
                    totalRFQs: 89,
                    totalRevenue: 45750,
                    monthlyRevenue: 8950,
                    responseRate: 94.5,
                    avgRating: 4.8,
                    recentOrders: 12,
                    pendingOrders: 3
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const fetchListings = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/listings`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setListings(data.listings || []);
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    const fetchRFQRequests = async (tokenToUse = token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/rfq-requests`, {
                headers: { Authorization: `Bearer ${tokenToUse}` }
            });

            if (response.ok) {
                const data = await response.json();
                setRfqRequests(data.rfqs || []);
            } else {
                // Mock data for development
                setRfqRequests([
                    {
                        id: '1',
                        productName: 'Industrial Pump Model X1',
                        buyerName: 'ABC Manufacturing Ltd.',
                        quantity: 50,
                        targetPrice: 1200,
                        message: 'Need immediate delivery for ongoing project',
                        status: 'pending',
                        createdAt: '2024-01-15T10:30:00Z',
                        urgency: 'high'
                    },
                    {
                        id: '2',
                        productName: 'Steel Pipes 2 inch',
                        buyerName: 'Construction Corp',
                        quantity: 200,
                        targetPrice: 85,
                        message: 'Bulk order for construction project',
                        status: 'pending',
                        createdAt: '2024-01-14T15:45:00Z',
                        urgency: 'medium'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching RFQ requests:', error);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setSeller(null);
        router.push('/seller/signin');
        toast.success('Logged out successfully');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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

    const renderOverview = () => (
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
                                    {formatCurrency(dashboardStats?.totalRevenue || 0)}
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
                                    {rfqRequests.filter(r => r.status === 'pending').length} pending
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
                            {rfqRequests.slice(0, 3).map((rfq) => (
                                <div key={rfq.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{rfq.productName}</p>
                                        <p className="text-xs text-gray-500">{rfq.buyerName}</p>
                                        <p className="text-xs text-gray-500">
                                            Qty: {rfq.quantity} • Target: {formatCurrency(rfq.targetPrice)}
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
                            {listings.slice(0, 3).map((listing) => (
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
                                        <p className="text-xs text-gray-500">{formatCurrency(listing.price)}</p>
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
                            onClick={() => setCurrentView('analytics')}
                        >
                            <BarChart3 className="w-6 h-6" />
                            <span>View Analytics</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderCurrentView = () => {
        switch (currentView) {
            case 'overview':
                return renderOverview();
            case 'listings':
                return <div className="p-4 text-center text-gray-500">Listings view - Coming soon</div>;
            case 'rfqs':
                return <div className="p-4 text-center text-gray-500">RFQ management - Coming soon</div>;
            case 'orders':
                return <div className="p-4 text-center text-gray-500">Orders view - Coming soon</div>;
            case 'analytics':
                return <div className="p-4 text-center text-gray-500">Analytics view - Coming soon</div>;
            case 'profile':
                // return <div className="p-4 text-center text-gray-500">Profile view - Coming soon</div>;
                return renderProfile({
                    seller,
                    isEditing,
                    setIsEditing,
                    profileForm,
                    setProfileForm,
                    handleUpdateProfile,
                    loading: profileLoading,
                    error: profileError
                });
            case 'settings':
                return <div className="p-4 text-center text-gray-500">Settings view - Coming soon</div>;
            default:
                return renderOverview();
        }
    };

    if (dashboardLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard</h2>
                    <p className="text-gray-600">Please wait while we fetch your data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Building className="text-orange-600 mr-3" size={28} />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">TradeConnect</h1>
                                <p className="text-xs text-gray-500">Seller Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="hidden md:block relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search listings, orders..."
                                    className="pl-10 w-64"
                                />
                            </div>

                            {/* Notifications */}
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="w-5 h-5" />
                                {notifications > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </Button>

                            {/* Profile Menu */}
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-gray-700">
                                        {seller?.firstName} {seller?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">{seller?.businessName}</p>
                                </div>
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-orange-100 text-orange-600">
                                        {seller?.firstName?.[0]}{seller?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-red-600"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto flex">
                {/* Sidebar Navigation */}
                <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4">
                    <div className="space-y-2">
                        {NAVIGATION_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive
                                        ? 'bg-orange-100 text-orange-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                    {item.id === 'rfqs' && rfqRequests.filter(r => r.status === 'pending').length > 0 && (
                                        <Badge className="ml-auto bg-red-100 text-red-600 text-xs">
                                            {rfqRequests.filter(r => r.status === 'pending').length}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Verification Status */}
                    <div className="mt-8 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-green-800">Verified Seller</p>
                                <p className="text-xs text-green-600">Your account is verified</p>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {renderCurrentView()}
                </main>
            </div>
        </div>
    );
};

export default EnhancedSellerDashboard;