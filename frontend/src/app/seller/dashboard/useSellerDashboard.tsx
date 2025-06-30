import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Package, BarChart3, MessageSquare, Settings, MessageCircle } from 'lucide-react';
import { renderProfile } from './Profile';
import ListingComponent from './Listing';
import RenderOverview from './Overview';
import { useAuth } from '@/src/context/AuthContext';
import RFQComponent from './RFQ';
import SettingsDashboard from './Settings';

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
    { id: 'chats', label: 'Chats', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type ViewType = typeof NAVIGATION_ITEMS[number]['id'];

const useSellerDashboard = () => {
    const [seller, setSeller] = useState<Seller | null>(null);
    const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [rfqRequests, setRfqRequests] = useState<RFQ[]>([]);
    const { user, loading } = useAuth();

    const router = useRouter();
    // State and handlers for profile editing
    const [isEditing, setIsEditing] = useState(false);
    const [profileForm, setProfileForm] = useState<Seller>(seller || {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        businessName: '',
        businessType: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        taxId: '',
        verificationStatus: 'pending',
        rating: 0,
        totalSales: 0,
        joinedDate: ''
    });
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
            const response = await fetch(`${API_BASE_URL}/details`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(profileForm),
                headers: {
                    'Content-Type': 'application/json',
                },
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
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setSeller(data.seller);
                setProfileForm(data.seller);
                setIsEditing(false);
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
            case 'chats':
                router.push('/seller/chats');
                return;
            case 'settings':
                return <SettingsDashboard />
            default:
                return <div className="p-4 text-center text-gray-500">Select a view from the sidebar</div>;
        }
    };
    return (
        {
            seller,
            dashboardLoading,
            currentView,
            setCurrentView,
            rfqRequests,
            renderCurrentView,
            NAVIGATION_ITEMS
        }

    )
}

export default useSellerDashboard
