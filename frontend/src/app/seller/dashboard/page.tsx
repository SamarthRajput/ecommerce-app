"use client";
import React, { } from 'react';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import useSellerDashboard from './useSellerDashboard';


const EnhancedSellerDashboard = () => {
    const {
        seller,
        dashboardLoading,
        currentView,
        setCurrentView,
        rfqRequests,
        renderCurrentView,
        NAVIGATION_ITEMS
    } = useSellerDashboard();

    if (dashboardLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard</h2>
                    <p className="text-gray-600">Please wait while we fetch your data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto flex">
                {/* Sidebar Navigation */}
                <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4">
                    <div className="space-y-2">
                        {NAVIGATION_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive
                                        ? 'bg-orange-100 text-orange-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                    {item.id === 'rfqs' && rfqRequests.filter(r => r.status === 'PENDING').length > 0 && (
                                        <Badge className="ml-auto bg-red-100 text-red-600 text-xs">
                                            {rfqRequests.filter(r => r.status === 'PENDING').length}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Verification Status */}
                    <div className={`mt-6 p-4 rounded-lg ${seller?.verificationStatus === 'verified' ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        <div className="flex items-center space-x-3 mb-2">
                            <Shield className={`w-6 h-6 ${seller?.verificationStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'}`} />
                            <div>
                                <p className={`seller?.verificationStatus === 'verified' ? 'text-green-800 font-semibold' : 'text-yellow-800 font-semibold'}`}>
                                    {seller?.verificationStatus === 'verified' ? 'Account Verified' : 'Verification Pending'}</p>
                                <p className={`seller?.verificationStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {seller?.verificationStatus === 'verified' ? 'Your account is verified' : ''}</p>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {renderCurrentView()}
                </main>
            </div>
        </div>
    );
};

export default EnhancedSellerDashboard;
