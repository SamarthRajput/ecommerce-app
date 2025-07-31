"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useListing } from '@/hooks/admin/useListing';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { ListingModals } from './components/ListingModals';
import { ListingsTabs } from './components/ListingsTabs';

const ListingsManagementDashboard = () => {
    const listingState = useListing();
    const { loading } = listingState;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading listings data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 space-y-8">
                <DashboardHeader />
                <StatsCards stats={listingState.stats} />
                <ListingsTabs listingState={listingState} />
                <ListingModals listingState={listingState} />
            </div>
        </div>
    );
};

export default ListingsManagementDashboard;
