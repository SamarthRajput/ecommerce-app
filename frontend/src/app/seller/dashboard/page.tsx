"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import useSellerDashboard from '@/src/hooks/useSellerDashboard';

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

    // Calculate pending RFQs count
    const pendingRFQsCount = rfqRequests.filter(rfq => rfq.status === 'PENDING').length;

    // Loading state component
    const LoadingSpinner = () => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Loading Dashboard
                </h2>
                <p className="text-gray-600">
                    Please wait while we fetch your data...
                </p>
            </div>
        </div>
    );

    // Navigation item component
    const NavigationItem = ({ item }: { item: typeof NAVIGATION_ITEMS[number] }) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        const showBadge = item.id === 'rfqs' && pendingRFQsCount > 0;

        return (
            <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`
          w-full flex items-center justify-between px-3 py-2 rounded-lg 
          text-left transition-all duration-200 ease-in-out
          ${isActive
                        ? 'bg-orange-100 text-orange-700 font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
                    }
        `}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
            >
                <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                </div>

                {showBadge && (
                    <Badge
                        className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1"
                        aria-label={`${pendingRFQsCount} pending RFQ requests`}
                    >
                        {pendingRFQsCount}
                    </Badge>
                )}
            </button>
        );
    };

    // Sidebar component
    const Sidebar = () => (
        <nav
            className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-4rem)]"
            role="navigation"
            aria-label="Dashboard navigation"
        >
            <div className="p-4">
                {/* Seller info header */}
                {seller && (
                    <div className="mb-6 pb-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 truncate">
                            {seller.businessName || `${seller.firstName} ${seller.lastName}`}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                            {seller.email}
                        </p>
                        {seller.isApproved && (
                            <Badge className="mt-2 bg-green-100 text-green-700 text-xs">
                                Approved
                            </Badge>
                        )}
                    </div>
                )}

                {/* Navigation items */}
                <div className="space-y-1">
                    {NAVIGATION_ITEMS.map((item) => (
                        <NavigationItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </nav>
    );

    // Main content component
    const MainContent = () => (
        <main
            className="flex-1 p-6 overflow-auto"
            role="main"
            aria-label="Dashboard main content"
        >
            <div className="max-w-full">
                {renderCurrentView()}
            </div>
        </main>
    );

    // Show loading state
    if (dashboardLoading) {
        return <LoadingSpinner />;
    }

    // Main dashboard layout
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto flex">
                <Sidebar />
                <MainContent />
            </div>
        </div>
    );
};

export default EnhancedSellerDashboard;