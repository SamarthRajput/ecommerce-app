"use client";
import React, { useState, useEffect } from 'react';
import { User, Package, LogOut, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { renderProfile } from './Profile';
import { BuyerDetails } from '@/src/lib/types/buyer';
import { OverviewTab } from '@/src/components/buyer/OverviewTab';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_BASE_URL = `${API_BACKEND_URL}/buyer`;

const BuyerDashboard = () => {
    const [buyer, setBuyer] = useState<BuyerDetails | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [currentView, setCurrentView] = useState<'dashboard' | 'overview'>('dashboard');

    const router = useRouter();

    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    useEffect(() => {
        const savedToken = localStorage.getItem('buyerToken');
        if (savedToken) {
            setToken(savedToken);
            verifyToken(savedToken);
        }
    }, []);

    const verifyToken = async (tokenToVerify: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/verify`, {
                headers: { Authorization: `Bearer ${tokenToVerify}` }
            });
            if (response.ok) {
                fetchProfile(tokenToVerify);
            } else {
                localStorage.removeItem('buyerToken');
                router.push('/buyer/signin');
            }
        } catch (err) {
            localStorage.removeItem('buyerToken');
            router.push('/buyer/signin');
            setError('Failed to verify token. Please sign in again.');
        } finally {
            setDashboardLoading(false);
        }
    };

    const fetchProfile = async (tokenToUse = token) => {
        setDashboardLoading(true);
        setError('');
        try {
            if (!tokenToUse) {
                toast.error('Please sign in to access your dashboard');
                router.push('/buyer/signin');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/profile`, {
                headers: { Authorization: `Bearer ${tokenToUse}` }
            });

            if (response.ok) {
                const data = await response.json();
                setBuyer(data.buyer);
                setProfileForm({
                    firstName: data.buyer.firstName,
                    lastName: data.buyer.lastName,
                    phoneNumber: data.buyer.phoneNumber,
                    street: data.buyer.street,
                    city: data.buyer.city,
                    state: data.buyer.state,
                    zipCode: data.buyer.zipCode,
                    country: data.buyer.country
                });
                setCurrentView('dashboard');
            }
            else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch profile');
            }
        } catch (err) {
            toast.error('Failed to fetch profile');
            setError('Failed to fetch profile');
            console.error('Error fetching profile:', err);
            localStorage.removeItem('buyerToken');
            router.push('/buyer/signin');
        }
        finally {
            setDashboardLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            setError('');
    
            try {
                const response = await fetch(`${API_BASE_URL}/details`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(profileForm)
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setBuyer(data.seller);
                    setIsEditing(false);
                    setError('Profile updated successfully');
                    setTimeout(() => setError(''), 3000);
                } else {
                    setError(data.error || 'Update failed');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
    };
    

    const handleLogout = () => {
        localStorage.removeItem('buyerToken');
        setToken(null);
        setBuyer(null);
        router.push('/buyer/signin');
    };

    const renderDashboard = () => (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Building className="text-blue-600 mr-3" size={24} />
                            <h1 className="text-xl font-semibold text-gray-800">Buyer Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Welcome, {buyer?.firstName}!</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                                title="Click to logout"
                            >
                                <LogOut size={20} className="mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm ${currentView === 'dashboard'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <User className="inline mr-2" size={16} />
                            Profile
                        </button>
                        <button
                            onClick={() => {
                                setCurrentView('overview');
                            }}
                            className={`py-4 px-2 border-b-2 font-medium text-sm ${currentView === 'overview'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Package className="inline mr-2" size={16} />
                            Overview
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {currentView === 'dashboard' && renderProfile({
                    buyer,
                    profileForm,
                    setProfileForm,
                    isEditing,
                    setIsEditing,
                    handleUpdateProfile,
                    loading,
                    error
                })}
                {currentView === 'overview' && buyer?.id && <OverviewTab buyerId={buyer?.id} />}
            </main>
        </div>
    );

    // Render loading state if dashboard is still loading
    if (dashboardLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            {token ? (
                renderDashboard()
            ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please sign in to access your dashboard</h2>
                        <button
                            onClick={() => router.push('/buyer/signin')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default BuyerDashboard;