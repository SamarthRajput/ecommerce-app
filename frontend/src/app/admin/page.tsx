"use client";
import React, { useEffect } from 'react';
import { BarChart3, Users, Package, FileText, LogOut, Loader2, MessageSquare, BookCheck } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';

// const quickLinks = [
//     { href: '/admin/listings', label: 'Manage Listings', icon: Package, description: 'Add, edit, and manage property listings' },
//     { href: '/admin/users', label: 'Manage Users', icon: Users, description: 'View and manage user accounts' },
//     { href: '/admin/rfqs', label: 'Manage RFQs', icon: FileText, description: 'Accept, Reject and manage RFQs' },
//     { href: '/admin/reports', label: 'View Reports', icon: BarChart3, description: 'Analytics and performance reports' },
//     { href: '/admin/chat', label: 'Chat Dashboard', icon: MessageSquare, description: 'Communicate with buyers and sellers' },
//     { href: '/admin/certifications', label: 'Certifications', icon: BookCheck, description: 'Seller Certification approval' },
// ];

const superAdminLinks = [
    { href: '/admin/listings', label: 'Manage Listings', icon: Package, description: 'Add, edit, and manage property listings' },
    { href: '/admin/users', label: 'Manage Users', icon: Users, description: 'View and manage user accounts' },
    { href: '/admin/rfqs', label: 'Manage RFQs', icon: FileText, description: 'Accept, Reject and manage RFQs' },
    { href: '/admin/reports', label: 'View Reports', icon: BarChart3, description: 'Analytics and performance reports' },
    { href: '/admin/chat', label: 'Chat Dashboard', icon: MessageSquare, description: 'Communicate with buyers and sellers' },
    { href: '/admin/certifications', label: 'Certifications', icon: BookCheck, description: 'Seller Certification approval' },
];

const adminLinks = [
    { href: '/admin/rfqs', label: 'Manage RFQs', icon: FileText, description: 'Accept, Reject and manage RFQs' },
    { href: '/admin/users', label: 'Manage Users', icon: Users, description: 'View and manage user accounts' },
    { href: '/admin/chat', label: 'Chat Dashboard', icon: MessageSquare, description: 'Communicate with buyers and sellers' },
];

const inspectorLinks = [
    { href: '/admin/listings', label: 'Manage Listings', icon: Package, description: 'Add, edit, and manage property listings' },
    { href: '/admin/certifications', label: 'Certifications', icon: BookCheck, description: 'Seller Certification approval' },
    { href: '/admin/analytics', label: 'Reports', icon: BarChart3, description: 'Submit reports for analysis' },
];
interface AdminUser {
    name: string;
    role: string;
    email: string;
    adminRole?: string;
};
interface AdminSummary {
    totalSellers: number;
    totalBuyers: number;
    totalRFQs: number;
    completedTrades: number;
    pendingProducts: number;
    totalProducts: number;
}
interface AdminResponse {
    success: boolean;
    summary: AdminSummary;
}

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [user, setUser] = React.useState<AdminUser | null>(null);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [adminSummary, setAdminSummary] = React.useState<AdminSummary | null>(null);
    const { authenticated, role, adminRole, user: loggedInUser, isSeller, authLoading, isBuyer, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !authenticated) router.push('/admin/signin');
    }, [authLoading, authenticated, router]);

    useEffect(() => {
        if (isSeller || isBuyer) {
            setError('You do not have access to the admin dashboard. Please log in as an admin.');
            logout();
            router.push('/admin/signin');
        }
        if (loggedInUser) {
            setUser({
                name: loggedInUser.name ?? '',
                email: loggedInUser.email ?? '',
                role: role || '',
                adminRole: adminRole || '',
            });
        } else {
            setUser(null);
        }
    }, [authenticated, role, loggedInUser]);

    useEffect(() => {
        const fetchAdminSummary = async () => {
            setIsLoading(true);
            try {
                const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${BASE_URL}/admin/dashboard-summary`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies for authentication
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch admin summary');
                }

                const data: AdminResponse = await response.json();
                if (data.success) {
                    setAdminSummary(data.summary);
                } else {
                    throw new Error('Failed to fetch admin summary');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminSummary();
    }, []);

    const getLinks = () => {
        if (adminRole === 'SUPER_ADMIN') {
            return superAdminLinks;
        }
        // manager -> admin
        if (adminRole === 'ADMIN') {
            return adminLinks;
        }
        if (adminRole === 'INSPECTOR') {
            return inspectorLinks;
        }
    }

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }
    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            setSuccess('Successfully logged out.');
            router.push('/admin/signin');
        } catch (err) {
            setError('Failed to log out. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-800 text-sm">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome, {user?.name || 'Admin'}!
                    </h2>
                    {user?.adminRole && (
                        <p className="text-sm text-gray-600 mb-2">{user.adminRole}</p>
                    )}
                    <p className="text-gray-600">
                        Manage your application from this central dashboard.
                        <span className="block text-sm text-gray-500 mt-1">
                            Only accessible by users with admin privileges.
                        </span>
                    </p>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getLinks()?.map(link => {
                            const Icon = link.icon;
                            return (
                                <a key={link.href} href={link.href} className="p-6 border rounded-lg bg-white hover:shadow-md">
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                                            <Icon className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">{link.label}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {adminSummary ? adminSummary.totalProducts : <Loader2 className="w-5 h-5 animate-spin mx-auto" />}
                            </div>
                            <div className="text-sm text-gray-500">Total Products</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {adminSummary ? adminSummary.totalSellers + adminSummary.totalBuyers : <Loader2 className="w-5 h-5 animate-spin mx-auto" />}
                            </div>
                            <div className="text-sm text-gray-500">Total Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {adminSummary ? adminSummary.pendingProducts : <Loader2 className="w-5 h-5 animate-spin mx-auto" />}
                            </div>
                            <div className="text-sm text-gray-500">Pending Products</div>
                        </div>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Logged in as <span className="font-medium text-gray-900">{user?.email}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Last login: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Log Out
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;