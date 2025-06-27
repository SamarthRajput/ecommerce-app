"use client";
import React, { useEffect } from 'react';
import { BarChart3, Settings, Users, Package, FileText, LogOut, Bell, Search, Menu, Home, Loader2, HomeIcon, MessageSquare } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';

const quickLinks = [
    { href: '/admin/listings', label: 'Manage Listings', icon: Package, description: 'Add, edit, and manage property listings' },
    { href: '/admin/users', label: 'Manage Users', icon: Users, description: 'View and manage user accounts' },
    { href: '/admin/orders', label: 'Manage Orders', icon: FileText, description: 'Track and process orders' },
    { href: '/admin/reports', label: 'View Reports', icon: BarChart3, description: 'Analytics and performance reports' },
    { href: '/admin/chat', label: 'Chat Dashboard', icon: MessageSquare, description: 'Communicate with buyers and sellers' },
    { href: '/admin/settings', label: 'Settings', icon: Settings, description: 'System configuration and preferences' },
];

interface AdminUser {
    name: string;
    role: string;
    email: string;
    // add other properties as needed
};

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [user, setUser] = React.useState<AdminUser | null>(null);
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const { authenticated, role, user: loggedInUser, isSeller, loading, isBuyer, logout } = useAuth();
    const router = useRouter();

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
                role: role || '', // fallback to empty string if role is undefined
                // add other properties as needed
            });
        } else {
            setUser(null);
        }
        // if (!authenticated) {
        //     setError('You are not authenticated. Please log in.');
        // } else if (role !== 'admin') {
        //     setError('Access denied. Admins only.');
        // }
    }, [authenticated, role, loggedInUser]);

    if (loading) {
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
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <HomeIcon className="h-6 w-6 text-gray-600 mr-3" />
                                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                />
                            </div>

                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                                <Bell className="h-5 w-5" />
                            </button>

                            {user && (
                                <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.role}</p>
                                    </div>
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

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
                        Welcome back{user?.name ? `, ${user.name}` : ''}!
                    </h2>
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
                        {quickLinks.map((link) => {
                            const IconComponent = link.icon;
                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition duration-200 group"
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition duration-200">
                                                <IconComponent className="w-5 h-5 text-gray-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                                                {link.label}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {link.description}
                                            </p>
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
                            <div className="text-2xl font-bold text-gray-900">24</div>
                            <div className="text-sm text-gray-500">Active Listings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">156</div>
                            <div className="text-sm text-gray-500">Total Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">89</div>
                            <div className="text-sm text-gray-500">Pending Orders</div>
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