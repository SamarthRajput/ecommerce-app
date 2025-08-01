// hooks/useListing.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Listing, ListingFilters, ListingStats, API_BASE_URL } from '@/lib/types/seller/sellerDashboardListing';

export const useListingData = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Fetch listings from API
    const fetchListings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/listings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }

            const data = await response.json();
            setListings(data.listings || []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Edit listing
    const editListing = useCallback(async (listingId: string, updatedData: Partial<Listing>) => {
        const response = await fetch(`${API_BASE_URL}/edit-listing/${listingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to edit listing');
        }

        const data = await response.json();
        setListings(prevListings =>
            prevListings.map(listing =>
                listing.id === listingId ? data.listing : listing
            )
        );

        return data.listing;
    }, []);

    // Toggle listing status
    const toggleListingStatus = useCallback(async (
        listingId: string,
        action: 'deactivate' | 'activate' | 'archive'
    ) => {
        try {
            setActionLoading(listingId);
            const response = await fetch(`${API_BASE_URL}/toggle-listing-status/${listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ listingId, action }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to toggle listing status');
            }

            setListings(prevListings =>
                prevListings.map(listing =>
                    listing.id === listingId ? { ...listing, status: data.status } : listing
                )
            );

            return data.status;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setActionLoading(null);
        }
    }, []);

    // Initialize on mount
    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    return {
        listings,
        loading,
        error,
        actionLoading,
        fetchListings,
        editListing,
        toggleListingStatus,
        setError
    };
};

export const useListingFilters = (listings: Listing[]) => {
    const [filters, setFilters] = useState<ListingFilters>({
        search: '',
        status: 'all',
        category: 'all',
        sortBy: 'createdAt-desc'
    });

    // Get filtered and sorted listings
    const filteredListings = useMemo(() => {
        let filtered = listings.filter(listing => {
            const matchesSearch = listing.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                listing.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                listing.category?.toLowerCase().includes(filters.search.toLowerCase());
            const matchesStatus = filters.status === 'all' || listing.status === filters.status;
            const matchesCategory = filters.category === 'all' || listing.category === filters.category;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        // Sort listings
        const [sortField, sortOrder] = filters.sortBy.split('-');
        filtered.sort((a, b) => {
            let aValue = a[sortField as keyof Listing];
            let bValue = b[sortField as keyof Listing];

            if (typeof aValue === 'undefined' || aValue === null) aValue = '';
            if (typeof bValue === 'undefined' || bValue === null) bValue = '';

            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [listings, filters]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = [...new Set(listings.map(l => l.category).filter(Boolean))];
        return cats.sort();
    }, [listings]);

    // Calculate statistics
    const stats: ListingStats = useMemo(() => {
        const total = listings.length;
        const active = listings.filter(l => l.status === 'active').length;
        const inactive = listings.filter(l => l.status === 'inactive').length;
        const archived = listings.filter(l => l.status === 'archived').length;
        const totalValue = listings.reduce((sum, l) => sum + (l.price * l.quantity), 0);

        return { total, active, inactive, archived, totalValue };
    }, [listings]);

    const handleFilterChange = useCallback((key: keyof ListingFilters, value: string) => {
        setFilters((prev: ListingFilters) => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            status: 'all',
            category: 'all',
            sortBy: 'createdAt-desc'
        });
    }, []);

    return {
        filters,
        filteredListings,
        categories,
        stats,
        handleFilterChange,
        clearFilters
    };
};