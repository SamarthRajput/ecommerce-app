// components/listing/ListingComponents.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Plus,
    Eye,
    ToggleLeft,
    ToggleRight,
    Archive,
    Package,
    DollarSign,
    Check,
    AlertTriangle,
    RefreshCw,
    X,
    Grid,
    List
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Listing, ListingFilters, ListingStats, STATUS_CONFIG, SORT_OPTIONS } from '@/lib/types/seller/sellerDashboardListing';

// Stats Cards Component
export const ListingStatsCards: React.FC<{ stats: ListingStats }> = ({ stats }) => (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold">{stats.total}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <div>
                        <p className="text-sm text-gray-600">Active</p>
                        <p className="text-xl font-bold text-green-600">{stats.active}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                        <p className="text-sm text-gray-600">Inactive</p>
                        <p className="text-xl font-bold text-yellow-600">{stats.inactive}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                    <Archive className="w-5 h-5 text-gray-600" />
                    <div>
                        <p className="text-sm text-gray-600">Archived</p>
                        <p className="text-xl font-bold text-gray-600">{stats.archived}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <div>
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-xl font-bold text-purple-600">
                            ₹{stats.totalValue.toLocaleString()}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

// Filters Section Component
interface FiltersSectionProps {
    filters: ListingFilters;
    categories: string[];
    totalListings: number;
    filteredCount: number;
    viewMode: 'grid' | 'table';
    onFilterChange: (key: keyof ListingFilters, value: string) => void;
    onClearFilters: () => void;
    onRefresh: () => void;
    onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const ListingFiltersSection: React.FC<FiltersSectionProps> = ({
    filters,
    categories,
    totalListings,
    filteredCount,
    viewMode,
    onFilterChange,
    onClearFilters,
    onRefresh,
    onViewModeChange
}) => (
    <Card className="mb-6">
        <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search listings..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.sortBy} onValueChange={(value) => onFilterChange('sortBy', value)}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {SORT_OPTIONS.map((option: { value: string; label: string }) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
                        <X className="w-4 h-4 mr-1" />
                        Clear
                    </Button>
                    <Button variant="outline" size="sm" onClick={onRefresh}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Refresh
                    </Button>
                    <div className="flex border rounded-md">
                        <Button
                            variant={viewMode === 'table' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('table')}
                            className="rounded-r-none"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onViewModeChange('grid')}
                            className="rounded-l-none"
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {(filters.search || filters.status !== 'all' || filters.category !== 'all') && (
                <div className="mt-3 text-sm text-gray-600">
                    Showing {filteredCount} of {totalListings} listings
                </div>
            )}
        </CardContent>
    </Card>
);

// Action buttons for listings
interface ListingActionsProps {
    listing: Listing;
    actionLoading: string | null;
    onViewDetails: (listing: Listing) => void;
    onToggleStatus: (id: string, action: 'activate' | 'deactivate' | 'archive') => void;
}

export const ListingActions: React.FC<ListingActionsProps> = ({
    listing,
    actionLoading,
    onViewDetails,
    onToggleStatus
}) => (
    <div className="flex space-x-1">
        <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(listing)}
            title="View Details"
        >
            <Eye className="w-4 h-4" />
        </Button>

        {/* {listing.status === 'active' ? (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStatus(listing.id, 'deactivate')}
                disabled={actionLoading === listing.id}
                title="Deactivate Listing"
            >
                <ToggleRight className="w-4 h-4 text-yellow-600" />
            </Button>
        ) : (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStatus(listing.id, 'activate')}
                disabled={actionLoading === listing.id}
                title="Activate Listing"
            >
                <ToggleLeft className="w-4 h-4 text-green-600" />
            </Button>
        )}

        {listing.status !== 'archived' ? (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStatus(listing.id, 'archive')}
                disabled={actionLoading === listing.id}
                title="Archive Listing"
            >
                <Archive className="w-4 h-4 text-gray-600" />
            </Button>
        ) : (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStatus(listing.id, 'archive')}
                disabled={actionLoading === listing.id}
                title="Unarchive Listing"
            >
                <Archive className="w-4 h-4 text-gray-600" />
            </Button>
        )} */}

    </div>
);

// Grid Card Component
interface ListingCardProps {
    listing: Listing;
    actionLoading: string | null;
    onViewDetails: (listing: Listing) => void;
    onToggleStatus: (id: string, action: 'activate' | 'deactivate' | 'archive') => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
    listing,
    actionLoading,
    onViewDetails,
    onToggleStatus
}) => {
    const statusConfig = STATUS_CONFIG[listing.status];

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {listing.images?.[0] ? (
                            <img
                                src={listing.images[0]}
                                alt={listing.productName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 truncate">
                                    {listing.productName}
                                </h3>
                                <p className="text-sm text-gray-600 truncate">
                                    {listing.category}
                                </p>
                            </div>
                            <Badge className={statusConfig?.color ?? ''}>
                                {statusConfig?.label ?? listing.status}
                            </Badge>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <div>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{listing.price.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Qty: {listing.quantity}
                                </p>
                            </div>

                            <ListingActions
                                listing={listing}
                                actionLoading={actionLoading}
                                onViewDetails={onViewDetails}
                                onToggleStatus={onToggleStatus}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Table View Component
interface TableViewProps {
    listings: Listing[];
    actionLoading: string | null;
    onViewDetails: (listing: Listing) => void;
    onToggleStatus: (id: string, action: 'activate' | 'deactivate' | 'archive') => void;
}

export const ListingTableView: React.FC<TableViewProps> = ({
    listings,
    actionLoading,
    onViewDetails,
    onToggleStatus
}) => (
    <Card>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                Product
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                Price
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                Category
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                Created
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {listings.map((listing) => {
                            const statusConfig = STATUS_CONFIG[listing.status];
                            return (
                                <tr key={listing.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                                {listing.images?.[0] ? (
                                                    <img
                                                        src={listing.images[0]}
                                                        alt={listing.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {listing.productName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {listing.productCode}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-green-600">
                                        ₹{listing.price.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {listing.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {listing.category}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={statusConfig?.color ?? ''}>
                                            {statusConfig?.label ?? listing.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-sm">
                                        {new Date(listing.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <ListingActions
                                            listing={listing}
                                            actionLoading={actionLoading}
                                            onViewDetails={onViewDetails}
                                            onToggleStatus={onToggleStatus}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
);

// Empty State Component
interface EmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
    onCreateListing: () => void;
}

export const ListingEmptyState: React.FC<EmptyStateProps> = ({
    hasFilters,
    onClearFilters,
    onCreateListing
}) => (
    <Card>
        <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {hasFilters ? 'No listings match your filters' : 'No listings yet'}
            </h3>
            <p className="text-gray-600 mb-6">
                {hasFilters
                    ? 'Try adjusting your search criteria or filters'
                    : 'Create your first listing to start selling your products'
                }
            </p>
            {hasFilters ? (
                <Button variant="outline" onClick={onClearFilters}>
                    Clear Filters
                </Button>
            ) : (
                <Button onClick={onCreateListing}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Listing
                </Button>
            )}
        </CardContent>
    </Card>
);

// Loading Component
export const ListingLoadingState: React.FC = () => (
    <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading your listings...</p>
            </div>
        </div>
    </div>
);

// Error Alert Component
export const ListingErrorAlert: React.FC<{ error: string }> = ({ error }) => (
    <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">
            {error}
        </AlertDescription>
    </Alert>
);