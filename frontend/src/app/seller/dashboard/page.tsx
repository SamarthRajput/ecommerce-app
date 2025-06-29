"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Package, BarChart3, MessageSquare, Settings, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { renderProfile } from './Profile';
import ListingComponent from './Listing';
import RenderOverview from './Overview';
import { useAuth } from '@/src/context/AuthContext';
import RFQComponent from './RFQ';

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
interface RFQ {
    id: string;
    productId: string;
    buyerId: string;
    quantity: number;
    message?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    rejectionReason?: string;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Navigation items
const NAVIGATION_ITEMS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'rfqs', label: 'RFQ Requests', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type ViewType = typeof NAVIGATION_ITEMS[number]['id'];

const EnhancedSellerDashboard = () => {
    const [seller, setSeller] = useState<Seller | null>(null);
    const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [rfqRequests, setRfqRequests] = useState<RFQ[]>([]);
    const [notifications, setNotifications] = useState<number>(3);
    const { user, loading } = useAuth();

    const router = useRouter();
    // State and handlers for profile editing
    const [isEditing, setIsEditing] = useState(false);
    const [profileForm, setProfileForm] = useState<Seller>({} as Seller);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            // If user is not authenticated, redirect to signin page
            router.push('/seller/signin');
        } else if (user && !loading) {
            initializeDashboard();
        }
    }, [user, loading, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        try {
            // Example update logic
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                credentials: 'include',
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


    const initializeDashboard = async () => {
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
            toast.error('Failed to load dashboard data');
        } finally {
            setDashboardLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setSeller(data.seller);
                setProfileForm({
                    ...data.seller,
                    address: {
                        ...data.seller.address,
                        street: data.seller.address.street || '',
                        city: data.seller.address.city || '',
                        state: data.seller.address.state || '',
                        zipCode: data.seller.address.zipCode || '',
                        country: data.seller.address.country || ''
                    }
                });
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

    const fetchRFQRequests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/rfq-requests`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setRfqRequests(data.rfqRequests || []);
            }
        } catch (error) {
            console.error('Error fetching RFQ requests:', error);
        }
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'overview':
                return <RenderOverview
                    seller={seller}
                    dashboardStats={dashboardStats}
                    listings={listings}
                    rfqRequests={rfqRequests}
                    setCurrentView={setCurrentView}
                />;
            case 'listings':
                return <ListingComponent />
            case 'rfqs':
                return <RFQComponent rfqRequests={rfqRequests} />;
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
                return <div className="p-4 text-center text-gray-500">Select a view from the sidebar</div>;
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
                                    {item.id === 'rfqs' && rfqRequests.filter(r => r.status === 'PENDING').length > 0 && (
                                        <Badge className="ml-auto bg-red-100 text-red-600 text-xs">
                                            {rfqRequests.filter(r => r.status === 'PENDING').length}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Verification Status */}
                    <div className={`mt-6 p-4 rounded-lg ${seller?.verificationStatus === 'verified' ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        <div className="flex items-center space-x-3 mb-2">
                            <Shield className={`w-6 h-6 ${seller?.verificationStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'}`} />
                            <div>
                                <p className={`seller?.verificationStatus === 'verified' ? 'text-green-800 font-semibold' : 'text-yellow-800 font-semibold'}`}>
                                    {seller?.verificationStatus === 'verified' ? 'Account Verified' : 'Verification Pending'}</p>
                                <p className={`seller?.verificationStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {seller?.verificationStatus === 'verified' ? 'Your account is verified' : ''}</p>
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
