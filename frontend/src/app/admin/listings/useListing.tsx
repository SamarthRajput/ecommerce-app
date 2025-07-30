// src/app/admin/listings/useListing.tsx
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useCallback } from 'react';
import { toast } from 'sonner';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Listing {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    quantity: number;
    minimumOrderQuantity?: number;
    listingType: 'SELL' | 'LEASE' | 'RENT';
    condition: string;
    validityPeriod: number;
    expiryDate?: string;
    deliveryTimeInDays?: number;
    logisticsSupport?: 'SELF' | 'INTERLINK' | 'BOTH';
    industry: string;
    category: string;
    productCode: string;
    model: string;
    specifications: string;
    countryOfSource: string;
    hsnCode: string;
    certifications: string[];
    licenses: string[];
    warrantyPeriod?: string;
    brochureUrl?: string;
    videoUrl?: string;
    images: string[];
    tags: string[];
    keywords: string[];
    status: 'PENDING' | 'ACTIVE' | 'REJECTED';
    seller: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        businessName: string;
    };
    rfqs: Array<{
        id: string;
        buyer: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        quantity: number;
        message?: string;
        status: string;
        createdAt: string;
    }>;
    _count: {
        rfqs: number;
    };
    createdAt: string;
    updatedAt: string;
}

interface Stats {
    pending: number;
    active: number;
    rejected: number;
    total: number;
}
// API Configuration
interface ApiResponse {
    success: boolean;
    data: Listing[];
    count: number;
    error?: string;
    message?: string;
    pagination?: {
        total: number;
        page: number;
        pageSize: number;
        hasNextPage: boolean;
    };
}

const useListing = () => {
    const [Listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingAction, setProcessingAction] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
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

    const fetchListings = useCallback(async (): Promise<void> => {
        try {
            const data: ApiResponse = await apiCall('/listing/all?page=1&limit=10');

            if (data.success) {
                setListings(data.data);
                setStats(prev => ({ ...prev, total: data.count }));
            } else {
                throw new Error(data.error || 'Failed to fetch listings');
            }
        } catch (error: any) {
            console.error('Error fetching listings:', error);
            toast.error(`${error}`);
        }
    }, [toast]);

    const approveListing = async (listingId: string): Promise<void> => {
        setProcessingAction(listingId);
        try {
            const data = await apiCall(`/listing/approve/${listingId}`, {
                method: 'POST',
            });

            if (data.success) {
                // Remove from listings and update stats
                setListings(prev => prev.filter(listing => listing.id !== listingId));
                setStats(prev => ({
                    ...prev,
                    pending: prev.pending - 1,
                    active: prev.active + 1
                }));
                // Update the listing data
                setListings(prev => prev.map(listing => listing.id === listingId ? { ...listing, status: 'ACTIVE' } : listing));

                toast.success('Listing approved successfully!');
                setSelectedListing(null);
                setShowViewModal(false);
            } else {
                throw new Error(data.error || 'Failed to approve listing');
            }
        } catch (error) {
            console.error('Error approving listing:', error);
        } finally {
            setProcessingAction(null);
        }
    };

    const rejectListing = async (listingId: string): Promise<void> => {
        if (!rejectionReason.trim()) {
            toast.warning('Please provide a rejection reason.');
            return;
        }

        setProcessingAction(listingId);
        try {
            const data = await apiCall(`/listing/reject/${listingId}`, {
                method: 'POST',
                body: JSON.stringify({ reason: rejectionReason }),
            });

            if (data.success) {
                // Remove from listings and update stats
                setListings(prev => prev.filter(listing => listing.id !== listingId));
                setStats(prev => ({
                    ...prev,
                    pending: prev.pending - 1,
                    rejected: prev.rejected + 1
                }));

                toast.success('Listing rejected successfully.');
                setRejectionReason('');
                setShowRejectModal(false);
                setSelectedListing(null);
            } else {
                throw new Error(data.error || 'Failed to reject listing');
            }
        } catch (error) {
            console.error('Error rejecting listing:', error);
            toast.error(`${error}`);
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
            await fetchListings();
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
                await fetchListings();
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [isAuthenticated]);

    // Update total stats
    useEffect(() => {
        setStats(prev => ({
            ...prev,
            total: prev.active + prev.rejected
        }));
    }, [stats.active, stats.rejected]);

    return ({
        Listings,
        loading,
        selectedListing,
        showViewModal,
        showRejectModal,
        rejectionReason,
        processingAction,
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
