"use client";
import React, { useState, useEffect } from 'react';
import { User, Package, LogOut, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Listing, Seller } from '@/src/lib/types/listing';
import { renderListings } from './Listing';
import { renderProfile } from './Profile';
import { fi } from 'zod/v4/locales';

const API_BASE_URL = 'http://localhost:3001/api/v1/seller';

const SellerDashboard = () => {
    const [seller, setSeller] = useState<Seller | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [listings, setListings] = useState<Listing[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [currentView, setCurrentView] = useState<'dashboard' | 'listings'>('dashboard');

    const router = useRouter();

    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
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
        taxId: ''
    });

    useEffect(() => {
        const savedToken = localStorage.getItem('sellerToken');
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
                fetchListings();
            } else {
                localStorage.removeItem('sellerToken');
                router.push('/seller/signin');
            }
        } catch (err) {
            localStorage.removeItem('sellerToken');
            router.push('/seller/signin');
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
                router.push('/seller/signin');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/profile`, {
                headers: { Authorization: `Bearer ${tokenToUse}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSeller(data.seller);
                setProfileForm({
                    firstName: data.seller.firstName,
                    lastName: data.seller.lastName,
                    businessName: data.seller.businessName,
                    businessType: data.seller.businessType,
                    phone: data.seller.phone,
                    address: data.seller.address,
                    taxId: data.seller.taxId
                });
                setCurrentView('dashboard');
            }
            else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to fetch profile');
                toast.error(errorData.error || 'Failed to fetch profile');
                console.error('Error fetching profile:', errorData);;
            }
        } catch (err) {
            toast.error('Failed to fetch profile');
            setError('Failed to fetch profile');
            console.error('Error fetching profile:', err);
            localStorage.removeItem('sellerToken');
            router.push('/seller/signin');
        }
        finally {
            setDashboardLoading(false);
        }
    };

    const fetchListings = async () => {
        try {
            // alert(`JWT Token: ${token}`);
            const response = await fetch(`${API_BASE_URL}/listings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setListings(data.listings);
                // alert('Listings fetched successfully');
            }
        } catch (err) {
            alert('Failed to fetch listings');
            console.error('Error fetching listings:', err);
            setError('Failed to fetch listings');
        }
        finally {
            // alert('Finished fetching listings');
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
                setSeller(data.seller);
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
        localStorage.removeItem('sellerToken');
        setToken(null);
        setSeller(null);
        router.push('/seller/signin');
    };

    const renderDashboard = () => (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Building className="text-blue-600 mr-3" size={24} />
                            <h1 className="text-xl font-semibold text-gray-800">Seller Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Welcome, {seller?.firstName}!</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
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
                                setCurrentView('listings');
                                fetchListings();
                            }}
                            className={`py-4 px-2 border-b-2 font-medium text-sm ${currentView === 'listings'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Package className="inline mr-2" size={16} />
                            Listings
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {currentView === 'dashboard' && renderProfile({
                    seller,
                    profileForm,
                    setProfileForm,
                    isEditing,
                    setIsEditing,
                    handleUpdateProfile,
                    loading,
                    error
                })}
                {currentView === 'listings' && renderListings(listings, router)}
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
                            onClick={() => router.push('/seller/signin')}
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

export default SellerDashboard;