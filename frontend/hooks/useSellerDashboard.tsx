import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Package, BarChart3, MessageSquare, Settings, MessageCircle } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { Seller, Listing, DashboardStats, RFQ } from '@/lib/types/seller/sellerDashboard';
import RFQComponent from '@/src/app/seller/dashboard/RFQ';
import RenderOverview from '@/src/components/Seller/Dashboard/Overview';
import ListingDashboard from '@/src/components/Seller/Dashboard/ManageListing';
import ProfileDashboard from '@/src/components/Seller/Dashboard/ProfileDashboard';
import SellerCertifications from '@/src/components/Seller/Dashboard/Certifications';
import ChatDashboard from '@/src/components/Seller/Dashboard/ChatDashboard';
import SettingsDashboard from '@/src/components/Seller/Dashboard/SettingsDashboard';
import { APIURL } from '@/src/config/env';
import { toast } from 'sonner';

// Navigation configuration
const NAVIGATION_ITEMS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'rfqs', label: 'RFQ Requests', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'certifications', label: 'Certifications', icon: BarChart3 },
    { id: 'chats', label: 'Chats', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type ViewType = typeof NAVIGATION_ITEMS[number]['id'];

const useSellerDashboard = () => {
    const { user, authLoading } = useAuth();

    // Core dashboard state
    const [seller, setSeller] = useState<Seller | null>(null);
    const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
    const [rfqRequests, setRfqRequests] = useState<RFQ[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

    // Profile editing state
    const [isEditing, setIsEditing] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();

    const validTabs: ViewType[] = NAVIGATION_ITEMS.map(item => item.id);
    const initialTab = searchParams.get('tab');
    const initialView: ViewType = validTabs.includes(initialTab as ViewType) ? (initialTab as ViewType) : 'overview';

    const [currentView, setCurrentView] = useState<ViewType>(initialView);

    const updateUrlWithTab = useCallback(({ tab }: { tab: ViewType }) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', tab);
        router.replace(newUrl.toString(), { scroll: true });
    }, [router]);

    // Effect to update url when currentView changes
    useEffect(() => {
        updateUrlWithTab({ tab: currentView });
    }, [currentView, updateUrlWithTab]);

    // Authentication effect
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/seller/signin');
        } else if (user && !authLoading) {
            initializeDashboard();
        }
    }, [user, authLoading, router]);

    // Profile update handler - optimized
    const handleUpdateProfile = useCallback(async (updatedProfile: Seller) => {
        setProfileLoading(true);
        setProfileError('');

        try {
            const response = await fetch(`${APIURL}/seller/details`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile),
            });

            if (response.ok) {
                toast.success('Profile updated successfully!');
                await fetchProfile();
                setIsEditing(false);
            } else {
                try {
                    const data = await response.json();
                    const errorData = data.error || data.message || "Failed to update Profile...";
                    throw new Error(errorData);
                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
                }
            }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
            setProfileError(errorMessage);
            toast.error(errorMessage);
            console.error('Profile update error:', error);
        } finally {
            setProfileLoading(false);
        }
    }, []);

    // Dashboard initialization
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

    // API fetch functions
    const fetchProfile = async () => {
        try {
            const response = await fetch(`${APIURL}/seller/profile`, {
                credentials: 'include',
            });
            const responseData = await response.json();

            if (response.ok) {
                setSeller(responseData.seller);
                setIsEditing(false);
            } else {
                throw new Error(responseData.error || 'Failed to fetch profile');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
            console.error('Error fetching profile:', error);
            toast.error(errorMessage);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(`${APIURL}/seller/dashboard-stats`, {
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
            const response = await fetch(`${APIURL}/seller/listings`, {
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
            const response = await fetch(`${APIURL}/seller/rfq-requests`, {
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

    // View rendering logic
    const renderCurrentView = () => {
        switch (currentView) {
            case 'overview':
                return (
                    <RenderOverview
                        seller={seller}
                        dashboardStats={dashboardStats}
                        listings={listings}
                        rfqRequests={rfqRequests}
                        setCurrentView={setCurrentView}
                    />
                );
            case 'listings':
                return <ListingDashboard />;
            case 'rfqs':
                return <RFQComponent rfqRequests={rfqRequests} />;
            case 'profile':
                return (
                    <ProfileDashboard
                        seller={seller}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleUpdateProfile={handleUpdateProfile}
                        loading={profileLoading}
                        error={profileError}
                    />
                );
            case 'certifications':
                const sellerId = seller?.id;
                if (sellerId) {
                    return <SellerCertifications sellerId={sellerId} />;
                }
                break;
            case 'chats':
                return <ChatDashboard />;
            case 'settings':
                return <SettingsDashboard />;
            default:
                return (
                    <div className="p-4 text-center text-gray-500">
                        Select a view from the sidebar
                    </div>
                );
        }
    };

    // Return hook interface
    return {
        seller,
        dashboardLoading,
        currentView,
        setCurrentView,
        rfqRequests,
        renderCurrentView,
        NAVIGATION_ITEMS
    };
};

export default useSellerDashboard;
