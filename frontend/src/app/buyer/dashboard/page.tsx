"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    User,
    Package,
    LogOut,
    Building,
    BarChart3,
    Settings,
    Plus,
    DollarSign,
    Bell,
    Search,
    CheckCircle,
    ArrowUpRight,
    ShoppingCart,
    Heart,
    List,
    FileSearch,
    MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { renderProfile } from './Profile';
import { useAuth } from '@/src/context/AuthContext';
import { APIURL } from '@/src/config/env';
import { RFQTab } from './RFQTab';

// Types
export interface Buyer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    joinedDate: string;
}

interface RFQ {
    id: string;
    productName: string;
    sellerName: string;
    quantity: number;
    targetPrice: number;
    message: string;
    status: string;
    createdAt: string;
}

interface Order {
    id: string;
    productName: string;
    sellerName: string;
    quantity: number;
    price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    orderDate: string;
    expectedDelivery: string;
    trackingNumber?: string;
}

interface DashboardStats {
    totalRFQs: number;
    pendingRFQs: number;
    activeOrders: number;
    completedOrders: number;
    totalSpend: number;
    monthlySpend: number;
    favoriteCategories: string[];
    recentActivity: number;
}

interface SavedListing {
    id: string;
    productName: string;
    price: number;
    sellerName: string;
    rating: number;
    savedDate: string;
}

// Navigation items
const NAVIGATION_ITEMS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'rfqs', label: 'My RFQs', icon: FileSearch },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'history', label: 'Purchase History', icon: List },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type ViewType = typeof NAVIGATION_ITEMS[number]['id'];

const EnhancedBuyerDashboard = () => {
    // Use the existing authLoading from your AuthContext
    const { user, isBuyer, authLoading, logout: authLogout } = useAuth();
    const [buyer, setBuyer] = useState<Buyer | null>(null);
    const [loading, setLoading] = useState(false);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [rfqsLoading, setRfqsLoading] = useState(false);
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
    const [notifications, setNotifications] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // State and handlers for profile editing
    const [isEditing, setIsEditing] = useState(false);
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        street: '',
        state: '',
        city: '',
        zipCode: '',
        country: ''
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');

    useEffect(() => {
        // Wait for auth loading to complete before making redirect decisions
        if (authLoading) {
            return;
        }

        // Only redirect if auth loading is complete and user is not authenticated
        if (!isBuyer && !user) {
            router.push('/buyer/signin');
            return;
        }

        // If user is authenticated, initialize dashboard
        if (isBuyer && user) {
            initializeDashboard();
        }
    }, [user, isBuyer, authLoading, router]);

    // Fetch RFQs once buyer data is available
    useEffect(() => {
        if (buyer?.id) {
            fetchRFQs(buyer.id);
        }
    }, [buyer?.id]);

    // Fetch buyer profile
    const fetchProfile = async () => {
        try {
            const response = await fetch(`${APIURL}/buyer/profile`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setBuyer(data.buyer);
                // Initialize profileForm with the current buyer data
                setProfileForm({
                    firstName: data.buyer.firstName || '',
                    lastName: data.buyer.lastName || '',
                    phoneNumber: data.buyer.phoneNumber || '',
                    street: data.buyer.street || '',
                    state: data.buyer.state || '',
                    city: data.buyer.city || '',
                    zipCode: data.buyer.zipCode || '',
                    country: data.buyer.country || ''
                });
            } else {
                throw new Error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        }
    };

    // Update buyer profile
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        
        try {
            const response = await fetch(`${APIURL}/buyer/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: profileForm.firstName,
                    lastName: profileForm.lastName,
                    phoneNumber: profileForm.phoneNumber,
                    street: profileForm.street,
                    state: profileForm.state,
                    city: profileForm.city,
                    zipCode: profileForm.zipCode,
                    country: profileForm.country
                })
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || 'Profile updated successfully!');
                
                // Update the buyer state with the new data
                setBuyer(data.buyer);
                setProfileForm(data.buyer);
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                setProfileError(errorData.error || 'Failed to update profile');
                toast.error(errorData.error || 'Failed to update profile');
            }
        } catch (err) {
            const errorMessage = 'Failed to update profile. Please try again.';
            setProfileError(errorMessage);
            toast.error(errorMessage);
            console.error('Profile update error:', err);
        } finally {
            setProfileLoading(false);
        }
    };

    // Initialize Buyer Dashboard 
    const initializeDashboard = async () => {
        try {
            setDashboardLoading(true);

            // First fetch the profile
            await fetchProfile();
            
            // RFQs will be fetched automatically once buyer data is available via useEffect
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setDashboardLoading(false);
        }
    };

    // Fetch Buyer rfqs 
    const fetchRFQs = async (buyerId: string) => {
        if (!buyerId) {
            console.log('No buyer ID provided');
            return;
        }
        
        try {
            setRfqsLoading(true);
            const response = await fetch(`${APIURL}/rfq/buyer/${buyerId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch RFQs");
            }

            const data = await response.json();
            setRfqs(data);
            console.log('RFQs fetched successfully:', data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            console.error('Error fetching RFQs:', err);
        } finally {
            setRfqsLoading(false);
        }
    };

    // Handle navigation item clicks
    const handleNavigation = (viewId: ViewType) => {
        if (viewId === 'chat') {
            router.push('/buyer/chat');
        } else {
            setCurrentView(viewId);
        }
    };

    const handleLogout = async () => {
        try {
            await authLogout();
            router.push('/buyer/signin');
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
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
            pending: 'bg-yellow-100 text-yellow-800',
            responded: 'bg-blue-100 text-blue-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            urgent: 'bg-red-100 text-red-800',
            high: 'bg-orange-100 text-orange-800',
            medium: 'bg-blue-100 text-blue-800',
            low: 'bg-gray-100 text-gray-800',
            verified: 'bg-green-100 text-green-800'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            Welcome back, {buyer?.firstName}! 👋
                        </h2>
                        <p className="text-blue-100">
                            Here's your procurement activity summary
                        </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{dashboardStats?.completedOrders || 0}</div>
                            <div className="text-blue-100 text-sm">Completed Orders</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{formatCurrency(dashboardStats?.totalSpend || 0)}</div>
                            <div className="text-blue-100 text-sm">Total Spend</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardStats?.activeOrders || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending RFQs</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {rfqsLoading ? (
                                        <span className="animate-pulse">...</span>
                                    ) : (
                                        rfqs.filter((rfq) => rfq.status === "PENDING" ).length
                                    )}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {rfqsLoading ? 'Loading...' : `of ${rfqs.length} total`}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <FileSearch className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Monthly Spend</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(dashboardStats?.monthlySpend || 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentView('orders')}
                        >
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orders.length > 0 ? (
                                orders.slice(0, 3).map((order) => (
                                    <div key={order.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <Package className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{order.productName}</p>
                                            <p className="text-xs text-gray-500">{order.sellerName}</p>
                                            <p className="text-xs text-gray-500">
                                                Qty: {order.quantity} • {formatCurrency(order.price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(order.orderDate)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>No orders yet</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent RFQs */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Recent RFQs</CardTitle>
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
                            {rfqsLoading ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p>Loading RFQs...</p>
                                </div>
                            ) : rfqs.length > 0 ? (
                                rfqs.slice(0, 3).map((rfq) => (
                                    <div key={rfq.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{rfq.productName}</p>
                                            <p className="text-xs text-gray-500">{rfq.sellerName}</p>
                                            <p className="text-xs text-gray-500">
                                                Qty: {rfq.quantity} • Target: {formatCurrency(rfq.targetPrice || 0)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={getStatusColor(rfq.status)}>
                                                {rfq.status}
                                            </Badge>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(rfq.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FileSearch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>No RFQs yet</p>
                                    <Button 
                                        className="mt-2" 
                                        size="sm" 
                                        onClick={() => router.push('/products')}
                                    >
                                        Create Your First RFQ
                                    </Button>
                                </div>
                            )}
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button
                            className="h-auto p-4 flex flex-col items-center space-y-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() => router.push('/products')}
                        >
                            <Plus className="w-6 h-6" />
                            <span>Create New RFQ</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center space-y-2"
                            onClick={() => setCurrentView('orders')}
                        >
                            <ShoppingCart className="w-6 h-6" />
                            <span>Track Orders</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center space-y-2"
                            onClick={() => router.push('/buyer/chat')}
                        >
                            <MessageSquare className="w-6 h-6" />
                            <span>Open Chat</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center space-y-2"
                            onClick={() => setCurrentView('rfqs')}
                        >
                            <FileSearch className="w-6 h-6" />
                            <span>View All RFQs</span>
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
            case 'rfqs':
                return <RFQTab buyerId={buyer?.id} />
            case 'orders':
                return <div className="p-4 text-center text-gray-500">All Orders history - Coming soon</div>;
            case 'history':
                return <div className="p-4 text-center text-gray-500">Purchase history - Coming soon</div>;
            case 'profile':
                return renderProfile({
                    buyer: buyer,
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

    // Show loading screen while authentication is being verified
    if (authLoading || dashboardLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {authLoading ? 'Verifying Authentication...' : 'Loading Dashboard'}
                    </h2>
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
                            <Building className="text-blue-600 mr-3" size={28} />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">InterLink</h1>
                                <p className="text-xs text-gray-500">Buyer Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="hidden md:block relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search products, orders..."
                                    className="pl-10 w-64"
                                />
                            </div>

                            {/* Profile Menu */}
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-gray-700">
                                        {buyer?.firstName} {buyer?.lastName}
                                    </p>
                                </div>
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {buyer?.firstName?.[0]}{buyer?.lastName?.[0]}
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
                            const isActive = currentView === item.id && item.id !== 'chat';

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                    {item.id === 'rfqs' && !rfqsLoading && rfqs.filter(r => r.status === 'pending' || r.status === 'PENDING').length > 0 && (
                                        <Badge className="ml-auto bg-red-100 text-red-600 text-xs">
                                            {rfqs.filter(r => r.status === 'pending' || r.status === 'PENDING').length}
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
                                <p className="text-sm font-medium text-green-800">Verified Buyer</p>
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

export default EnhancedBuyerDashboard;