// src/app/admin/rfqs/useRFQ.tsx
import { useAuth } from '@/src/context/AuthContext';
import { RFQ, RFQStats } from '@/src/lib/types/rfq';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useCallback } from 'react';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';
interface ApiResponse {
    success: boolean;
    data: RFQ[];
    count: number;
    error?: string;
    message?: string;
}

const useRFQ = () => {
    const [pendingRFQs, setPendingRFQs] = useState<RFQ[]>([]);
    const [activeRFQs, setActiveRFQs] = useState<RFQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingAction, setProcessingAction] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState<RFQStats>({ pending: 0, forwarded: 0, approved: 0, rejected: 0, total: 0 });
    const { authenticated, role, user: loggedInUser, authLoading: authStatusLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authStatusLoading && !authenticated) {
            router.push('/admin/signin');
        } else {
            setIsAuthenticated(authenticated);
            setStats(prev => ({
                ...prev,
                total: prev.pending + prev.approved + prev.rejected + prev.forwarded
            }));
        }
    }, [authenticated, role, router]);

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

    const fetchPendingRFQs = useCallback(async (): Promise<void> => {
        try {
            const data: ApiResponse = await apiCall('/rfq/pending');

            if (data.success) {
                setPendingRFQs(data.data);
                setStats(prev => ({ ...prev, pending: data.count }));
            } else {
                throw new Error(data.error || 'Failed to fetch pending RFQs');
            }
        } catch (error: any) {
            if (error.message.includes('HTTP 401')) {
                toast.error('Session expired. Please log in again.');
                logout();
                router.push('/admin/signin');
            } else {
                toast.error(`Error fetching pending RFQs: ${error.message}`);
            }
            console.error('Error fetching pending RFQs:', error);
        }
    }, []);

    const fetchForwardedRFQs = useCallback(async (): Promise<void> => {
        try {
            const data: ApiResponse = await apiCall('/rfq/forwarded');

            if (data.success) {
                setActiveRFQs(data.data);
                setStats(prev => ({ ...prev, approved: data.count }));
            } else {
                throw new Error(data.error || 'Failed to fetch approved RFQs');
            }
        } catch (error) {
            console.error('Error fetching approved RFQs:', error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }, []);

    const forwardRFQ = async (rfqId: string): Promise<void> => {
        setProcessingAction(rfqId);
        try {

            const data = await apiCall(`/rfq/forward/${rfqId}`, {
                method: 'POST',
            });

            if (data.success) {
                // Remove from pending list and update stats
                setPendingRFQs(prev => prev.filter(rfq => rfq.id !== rfqId));
                setStats(prev => ({
                    ...prev,
                    pending: prev.pending - 1,
                    approved: prev.approved + 1
                }));
                // Add to forwarded RFQs
                setActiveRFQs(prev => [...prev, data.rfq]);

                toast.success('RFQ approved successfully!');

                // Refresh forwarded RFQs if on that tab
                if (activeTab === 'forwarded') {
                    await fetchForwardedRFQs();
                }
            } else {
                throw new Error(data.error || 'Failed to approve RFQ');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to approve RFQ');
            if (error instanceof Error) {
                console.error('Error approving RFQ:', error);
            }
        } finally {
            setProcessingAction(null);
        }
    };

    const rejectRFQ = async (rfqId: string): Promise<void> => {
        if (!rejectionReason.trim()) {
            toast.warning('Please provide a rejection reason.');
            return;
        }

        setProcessingAction(rfqId);
        try {
            const response = await fetch(`${API_BASE_URL}/rfq/reject/${rfqId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason: rejectionReason }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reject RFQ');
            }

            const data = await response.json();

            if (data.success) {
                // Update local state
                setPendingRFQs(prev => prev.filter(rfq => rfq.id !== rfqId));
                setStats(prev => ({
                    ...prev,
                    pending: prev.pending - 1,
                    rejected: prev.rejected + 1
                }));

                toast.success('RFQ rejected successfully.');
                setRejectionReason('');
                setShowRejectModal(false);
                setSelectedRFQ(null);

                // Refresh data if on rejected tab
                if (activeTab === 'rejected') {
                    await fetchPendingRFQs();
                }
            } else {
                throw new Error(data.error || 'Failed to reject RFQ');
            }
        } catch (error) {
            console.error('Error rejecting RFQ:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred while rejecting the RFQ'
            );
        } finally {
            setProcessingAction(null);
        }
    };

    const handleViewRFQ = (rfq: RFQ): void => {
        setSelectedRFQ(rfq);
        setShowViewModal(true);
    };

    const handleRejectClick = (rfq: RFQ): void => {
        setSelectedRFQ(rfq);
        setShowRejectModal(true);
    };

    const refreshData = async (): Promise<void> => {
        setLoading(true);
        try {
            await Promise.all([fetchPendingRFQs(), fetchForwardedRFQs()]);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredRFQs = (rfqs: RFQ[]): RFQ[] => {
        if (!searchTerm) return rfqs;

        const searchLower = searchTerm.toLowerCase();
        return rfqs.filter(rfq =>
            rfq.product.name.toLowerCase().includes(searchLower) ||
            rfq.buyer.email.toLowerCase().includes(searchLower) ||
            (rfq.buyer.firstName && rfq.buyer.firstName.toLowerCase().includes(searchLower)) ||
            (rfq.buyer.lastName && rfq.buyer.lastName.toLowerCase().includes(searchLower)) ||
            (rfq.message && rfq.message.toLowerCase().includes(searchLower))
        );
    };

    useEffect(() => {
        const initializeData = async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                await Promise.all([fetchPendingRFQs(), fetchForwardedRFQs()]);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [isAuthenticated, fetchPendingRFQs, fetchForwardedRFQs]);

    useEffect(() => {
        setStats(prev => ({
            ...prev,
            total: prev.approved + prev.rejected + prev.pending
        }));
    }, [stats.approved, stats.rejected, stats.pending]);

    return ({
        pendingRFQs,
        activeRFQs,
        loading,
        selectedRFQ,
        showViewModal,
        showRejectModal,
        rejectionReason,
        processingAction,
        searchTerm,
        activeTab,
        stats,
        setSelectedRFQ,
        setShowViewModal,
        setShowRejectModal,
        setRejectionReason,
        forwardRFQ,
        rejectRFQ,
        handleViewRFQ,
        handleRejectClick,
        refreshData,
        setSearchTerm,
        setActiveTab,
        getFilteredRFQs
    } as const
    )
}

export default useRFQ