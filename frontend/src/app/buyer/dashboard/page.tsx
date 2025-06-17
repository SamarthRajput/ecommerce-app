// components/SellerDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BuyerProfile } from '@/src/lib/types/buyer';
import { OverviewTab } from '@/src/components/buyer/OverviewTab';
import { ProfileTab } from '@/src/components/buyer/ProfileTab';


const BuyerDashboard = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'profile'>('overview');
    const [buyer, setBuyer] = useState<BuyerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const mockBuyer: BuyerProfile = {
            id: '1',
            email: 'buyer@example.com',
            profile: {
                firstName: 'Samarth',
                lastName: 'Rajput',
                phoneNumber: '+916392177974',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                },
            }
        };

        setBuyer(mockBuyer);
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('buyerToken');
        router.push('/buyer/signin');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Buyer Dashboard
                            </h1>
                            <p className="text-sm text-gray-600">
                                Welcome, {buyer?.profile.firstName}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'profile', label: 'Profile' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'overview' | 'profile' )}
                                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <OverviewTab />
                )}
                {activeTab === 'profile' && (
                    <ProfileTab buyer={buyer} />
                )}
            </div>
        </div>
    );
};

export default BuyerDashboard;