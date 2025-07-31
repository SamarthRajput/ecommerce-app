import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'sonner';
import { AdminUser, ApprovalData, BuyerUser, CreateAdminData, SellerUser, UpdateAdminData, UserStats } from '@/src/lib/types/admin/userManagementInterface';

export const useUserManagement = () => {
    const [sellers, setSellers] = useState<SellerUser[]>([]);
    const [buyers, setBuyers] = useState<BuyerUser[]>([]);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { authenticated, authLoading, isAdminAdmin, user, isSuperAdmin } = useAuth();

    // Calculate user statistics
    const stats: UserStats = {
        totalUsers: sellers.length + buyers.length + admins.length,
        totalSellers: sellers.length,
        totalBuyers: buyers.length,
        totalAdmins: admins.length,
        approvedSellers: sellers.filter(s => s.isApproved).length,
        pendingSellers: sellers.filter(s => !s.isApproved).length,
        verifiedSellers: sellers.filter(s => s.isEmailVerified && s.isPhoneVerified).length,
        unverifiedSellers: sellers.filter(s => !s.isEmailVerified || !s.isPhoneVerified).length,
    };

    // Fetch all users data
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const requests = [
                fetch(`${BASE_URL}/admin/sellers`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                }),
                fetch(`${BASE_URL}/admin/buyers`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                }),
            ];

            // Only fetch admins if user is SuperAdmin
            if (isSuperAdmin) {
                requests.push(
                    fetch(`${BASE_URL}/admin/admins`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                    })
                );
            }

            const responses = await Promise.all(requests);

            // Handle sellers response
            if (!responses[0].ok) {
                const errorData = await responses[0].json();
                toast.error('Seller data fetch failed');
                toast.error(errorData.error || 'Failed to fetch sellers');
                throw new Error(errorData.error || 'Failed to fetch sellers');
            }

            // Handle buyers response
            if (!responses[1].ok) {
                const errorData = await responses[1].json();
                toast.error('Buyer data fetch failed');
                toast.error(errorData.error || 'Failed to fetch buyers');
                throw new Error(errorData.error || 'Failed to fetch buyers');
            }

            // Handle admins response (if SuperAdmin)
            if (responses[2] && !responses[2].ok) {
                const errorData = await responses[2].json();
                toast.error('Admin data fetch failed');
                toast.error(errorData.error || 'Failed to fetch admins');
                throw new Error(errorData.error || 'Failed to fetch admins');
            }

            const sellersData = await responses[0].json();
            const buyersData = await responses[1].json();
            let adminsData = null;

            if (responses[2]) {
                adminsData = await responses[2].json();
            }

            setSellers(sellersData.data || []);
            setBuyers(buyersData.data || []);
            if (adminsData) {
                setAdmins(adminsData.data || []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [BASE_URL, isSuperAdmin]);

    // Create admin user (SuperAdmin only)
    const createAdminUser = async (data: CreateAdminData): Promise<boolean> => {
        if (!isSuperAdmin) {
            toast.error('Only SuperAdmins can create admin users');
            setError('Only SuperAdmins can create admin users');
            return false;
        }

        try {
            setActionLoading('creating-admin');
            setError(null);

            const response = await fetch(`${BASE_URL}/admin/admins`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create admin');
            }

            const responseData = await response.json();
            setAdmins(prev => [...prev, responseData.data]);
            toast.success('Admin user created successfully');
            return true;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            return false;
        } finally {
            setActionLoading(null);
        }
    };

    // Update admin user (SuperAdmin only)
    const updateAdminUser = async (id: string, data: UpdateAdminData): Promise<boolean> => {
        if (!isSuperAdmin) {
            toast.error('Only SuperAdmins can update admin users');
            setError('Only SuperAdmins can update admin users');
            return false;
        }

        try {
            setActionLoading(`updating-admin-${id}`);
            setError(null);

            const response = await fetch(`${BASE_URL}/admin/admins/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to update admin');
                throw new Error(errorData.error || 'Failed to update admin');
            }

            const updatedAdmin = await response.json();
            setAdmins(prev => prev.map(admin => admin.id === id ? updatedAdmin.data : admin));
            toast.success('Admin user updated successfully');
            setError(null);
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            return false;
        } finally {
            setActionLoading(null);
        }
    };

    // Delete admin user (SuperAdmin only)
    const deleteAdminUser = async (id: string): Promise<boolean> => {
        if (!isSuperAdmin) {
            toast.error('Only SuperAdmins can delete admin users');
            setError('Only SuperAdmins can delete admin users');
            return false;
        }
        // Check if the admin is trying to delete themselves
        if (id === admins.find(admin => admin.email === user?.email)?.id && String(user?.role) === 'SUPER_ADMIN') {
            toast.error('You cannot delete your own account');
            setError('You cannot delete your own account');
            return false;
        }

        try {
            setActionLoading(`deleting-admin-${id}`);
            setError(null);

            const response = await fetch(`${BASE_URL}/admin/admins/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to delete admin');
                throw new Error(errorData.error || 'Failed to delete admin');
            }

            setAdmins(prev => prev.filter(admin => admin.id !== id));
            toast.success('Admin user deleted successfully');
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            return false;
        } finally {
            setActionLoading(null);
        }
    };

    // Delete buyer user
    const deleteBuyerUser = async (id: string): Promise<boolean> => {
        try {
            setActionLoading(`deleting-buyer-${id}`);
            setError(null);

            const response = await fetch(`${BASE_URL}/admin/buyers/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to delete buyer');
                throw new Error(errorData.error || 'Failed to delete buyer');
            }

            setBuyers(prev => prev.filter(buyer => buyer.id !== id));
            toast.success('Buyer user deleted successfully');
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            return false;
        } finally {
            setActionLoading(null);
        }
    };

    // Approve/Reject seller
    const approveSeller = async (id: string, data: ApprovalData): Promise<boolean> => {
        try {
            setActionLoading(`approving-seller-${id}`);
            setError(null);

            const response = await fetch(`${BASE_URL}/admin/sellers/${id}/approve`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to update seller approval status');
                throw new Error(errorData.error || 'Failed to update seller approval status');
            }

            const updatedSeller = await response.json();
            setSellers(prev => prev.map(seller => seller.id === id ? updatedSeller.data : seller));
            toast.success(`Seller ${data.approved ? 'approved' : 'rejected'} successfully`);
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            return false;
        } finally {
            setActionLoading(null);
        }
    };

    // Clear error
    const clearError = () => setError(null);

    // Check if action is loading
    const isActionLoading = (action: string) => actionLoading === action;

    // Initialize data fetch
    useEffect(() => {
        if (!authLoading && authenticated && (isAdminAdmin || isSuperAdmin)) {
            fetchUsers();
        }
    }, [authLoading, authenticated, isAdminAdmin, isSuperAdmin, fetchUsers]);

    return {
        // Data
        sellers,
        buyers,
        admins,
        stats,

        // States
        loading,
        error,
        actionLoading,

        // Auth states
        authenticated,
        authLoading,
        isAdminAdmin,
        isSuperAdmin,

        // Actions
        fetchUsers,
        createAdminUser,
        updateAdminUser,
        deleteAdminUser,
        deleteBuyerUser,
        approveSeller,
        clearError,
        isActionLoading,
    };
};