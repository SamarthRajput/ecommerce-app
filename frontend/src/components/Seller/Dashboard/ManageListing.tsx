// components/dashboard/ListingDashboard.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import the separated components and hooks
import { useListingData, useListingFilters } from '@/hooks/useSDListing';
import { Listing } from '@/lib/types/seller/sellerDashboardListing';
import { ListingCard, ListingEmptyState, ListingErrorAlert, ListingFiltersSection, ListingLoadingState, ListingStatsCards, ListingTableView } from './ListingComponent';
import { ListingDetailModal } from './ListingDetailModel';
import { toast } from 'sonner';

const ListingDashboard: React.FC = () => {
    const router = useRouter();

    // Core listing data and operations
    const {
        listings,
        loading,
        error,
        actionLoading,
        fetchListings,
        editListing,
        toggleListingStatus,
        setError
    } = useListingData();

    // Filtering and sorting logic
    const {
        filters,
        filteredListings,
        categories,
        stats,
        handleFilterChange,
        clearFilters
    } = useListingFilters(listings);

    // UI state
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

    // Event handlers
    const handleViewDetails = (listing: Listing) => {
        setSelectedListing(listing);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedListing(null);
    };

    const handleEditListing = async (listingId: string, updatedData: Partial<Listing>) => {
        try {
            await editListing(listingId, updatedData);
            await fetchListings(); // Refresh the list
        } catch (error) {
            throw error; // Let the modal handle the error
        }
    };

    const handleToggleStatus = async (listingId: string, action: 'activate' | 'deactivate' | 'archive' | 'unarchive') => {
        await toggleListingStatus(listingId, action);
    };

    const hasActiveFilters = !!filters.search || filters.status !== 'all';

    // Show loading state
    if (loading) {
        return <ListingLoadingState />;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your product listings and track performance
                    </p>
                </div>
                <Button onClick={() => router.push('/seller/create-listing')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Listing
                </Button>
            </div>

            {/* Error Alert */}
            {error && <ListingErrorAlert error={error} />}

            {/* Stats Cards */}
            <ListingStatsCards stats={stats} />

            {/* Filters */}
            <ListingFiltersSection
                filters={filters}
                categories={categories}
                totalListings={listings.length}
                filteredCount={filteredListings.length}
                viewMode={viewMode}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                onRefresh={fetchListings}
                onViewModeChange={setViewMode}
            />

            {/* Content */}
            {filteredListings.length === 0 ? (
                <ListingEmptyState
                    hasFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                    onCreateListing={() => router.push('/seller/create-listing')}
                />
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <ListingTableView
                            listings={filteredListings}
                            actionLoading={actionLoading}
                            onViewDetails={handleViewDetails}
                            onToggleStatus={handleToggleStatus}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredListings.map((listing: Listing) => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    actionLoading={actionLoading}
                                    onViewDetails={handleViewDetails}
                                    onToggleStatus={handleToggleStatus}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedListing && (
                <ListingDetailModal
                    listing={selectedListing}
                    onClose={handleCloseModal}
                    onSubmit={handleEditListing}
                    toggle={handleToggleStatus}
                />
            )}
        </div>
    );
};

export default ListingDashboard;