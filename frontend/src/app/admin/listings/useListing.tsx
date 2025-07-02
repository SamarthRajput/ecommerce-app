// src/app/admin/listings/useListing.tsx
import { useAuth } from '@/src/context/AuthContext';
import { Listing, Stats } from '@/src/lib/types/listing';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning';
}
const generateToastId = () => {
    return Math.random().toString(36).substring(2, 15);
};
// API Configuration
interface ApiResponse {
    success: boolean;
    data: Listing[];
    count: number;
    error?: string;
    message?: string;
}

const useListing = () => {
    const [pendingListings, setPendingListings] = useState<Listing[]>([]);
    const [activeListings, setActiveListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingAction, setProcessingAction] = useState<string | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('pending');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState<Stats>({ pending: 0, active: 0, rejected: 0, total: 0 });
    const { authenticated, role, user: loggedInUser, isSeller, authLoading: authStatusLoading, isBuyer, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authStatusLoading && !authenticated) {
            router.push('/admin/signin');
        } else {
            setIsAuthenticated(authenticated);
            setStats(prev => ({
                ...prev,
                total: prev.pending + prev.active + prev.rejected
            }));
        }
    }, [authenticated, role, router]);

    const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
        const id = generateToastId();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 5000);
    }, []);

    // API Functions with better error handling
    const apiCall = async (url: string, options: RequestInit = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                credentials: 'include',
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API call failed for ${url}:`, error);
            throw error;
        }
    };

    const fetchPendingListings = useCallback(async (): Promise<void> => {
        try {
            const data: ApiResponse = await apiCall('/listing/pending');

            if (data.success) {
                setPendingListings(data.data);
                setStats(prev => ({ ...prev, pending: data.count }));
            } else {
                throw new Error(data.error || 'Failed to fetch pending listings');
            }
        } catch (error: any) {
            console.error('Error fetching pending listings:', error);
            addToast(`${error}`, 'error');
        }
    }, [addToast]);

    // usecallback is used to memoize the function to prevent unnecessary re-creations
    const fetchActiveListings = useCallback(async (): Promise<void> => {
        try {
            const data: ApiResponse = await apiCall('/listing/active');

            if (data.success) {
                setActiveListings(data.data);
                setStats(prev => ({ ...prev, active: data.count }));
            } else {
                throw new Error(data.error || 'Failed to fetch active listings');
            }
        } catch (error) {
            console.error('Error fetching active listings:', error);
            addToast(`${error}`, 'error');
        }
    }, [addToast]);

    const approveListing = async (listingId: string): Promise<void> => {
        setProcessingAction(listingId);
        try {
            const data = await apiCall(`/listing/approve/${listingId}`, {
                method: 'POST',
            });

            if (data.success) {
                // Remove from pending list and update stats
                setPendingListings(prev => prev.filter(listing => listing.id !== listingId));
                setStats(prev => ({
                    ...prev,
                    pending: prev.pending - 1,
                    active: prev.active + 1
                }));

                addToast('Listing approved successfully!', 'success');

                // Refresh active listings if on that tab
                if (activeTab === 'active') {
                    await fetchActiveListings();
                }
            } else {
                throw new Error(data.error || 'Failed to approve listing');
            }
        } catch (error) {
            console.error('Error approving listing:', error);
            addToast(`${error}`, 'error');
        } finally {
            setProcessingAction(null);
        }
    };

    const rejectListing = async (listingId: string): Promise<void> => {
        if (!rejectionReason.trim()) {
            addToast('Please provide a rejection reason.', 'warning');
            return;
        }

        setProcessingAction(listingId);
        try {
            const data = await apiCall(`/listing/reject/${listingId}`, {
                method: 'POST',
                body: JSON.stringify({ reason: rejectionReason }),
            });

            if (data.success) {
                // Remove from pending list and update stats
                setPendingListings(prev => prev.filter(listing => listing.id !== listingId));
                setStats(prev => ({
                    ...prev,
                    pending: prev.pending - 1,
                    rejected: prev.rejected + 1
                }));

                addToast('Listing rejected successfully.', 'success');
                setRejectionReason('');
                setShowRejectModal(false);
                setSelectedListing(null);
            } else {
                throw new Error(data.error || 'Failed to reject listing');
            }
        } catch (error) {
            console.error('Error rejecting listing:', error);
            addToast(`${error}`, 'error');
        } finally {
            setProcessingAction(null);
        }
    };

    // Event handlers

    const handleViewListing = (listing: Listing): void => {
        setSelectedListing(listing);
        setShowViewModal(true);
    };

    const handleRejectClick = (listing: Listing): void => {
        setSelectedListing(listing);
        setShowRejectModal(true);
    };

    const refreshData = async (): Promise<void> => {
        setLoading(true);
        try {
            await Promise.all([fetchPendingListings(), fetchActiveListings()]);
        } finally {
            setLoading(false);
        }
    };

    // Filter listings based on search term
    const getFilteredListings = (listings: Listing[]): Listing[] => {
        if (!searchTerm) return listings;

        const searchLower = searchTerm.toLowerCase();
        return listings.filter(listing =>
            listing.name.toLowerCase().includes(searchLower) ||
            listing.seller.businessName?.toLowerCase().includes(searchLower) ||
            listing.seller.email.toLowerCase().includes(searchLower) ||
            listing.description.toLowerCase().includes(searchLower)
        );
    };
    // Effects
    useEffect(() => {
        const initializeData = async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                await Promise.all([fetchPendingListings(), fetchActiveListings()]);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [isAuthenticated, fetchPendingListings, fetchActiveListings]);

    // Update total stats
    useEffect(() => {
        setStats(prev => ({
            ...prev,
            total: prev.active + prev.rejected
        }));
    }, [stats.active, stats.rejected]);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3001/api/v1/auth/admin/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setIsAuthenticated(true);
                }
            } else {
                localStorage.removeItem('adminToken');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('adminToken');
        }
    };

    return ({
        pendingListings,
        activeListings,
        loading,
        selectedListing,
        showViewModal,
        showRejectModal,
        rejectionReason,
        processingAction,
        toasts,
        searchTerm,
        activeTab,
        stats,
        setSelectedListing,
        setShowViewModal,
        setShowRejectModal,
        setRejectionReason,
        approveListing,
        rejectListing,
        handleViewListing,
        handleRejectClick,
        refreshData,
        setSearchTerm,
        setActiveTab,
        getFilteredListings
    } as const
    )
}

export default useListing
