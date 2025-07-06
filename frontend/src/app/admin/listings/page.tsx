// src/app/admin/listings/page.tsx
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Eye, Check, X, Building, User, Calendar, DollarSign, Package, MessageSquare, Search, RefreshCw, AlertCircle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { formatDate, formatPrice } from '@/src/lib/listing-formatter';
import useListing from './useListing';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Listing {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  seller: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
  };
  _count: {
    rfqs: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  pending: number;
  active: number;
  rejected: number;
  total: number;
}

const ListingsManagement = () => {
  const {
    pendingListings,
    activeListings,
    loading,
    selectedListing,
    showViewModal,
    showRejectModal,
    rejectionReason,
    processingAction,
    toasts,
    searchTerm,
    activeTab,
    stats,
    setSelectedListing,
    setShowViewModal,
    setShowRejectModal,
    setRejectionReason,
    approveListing,
    rejectListing,
    handleViewListing,
    handleRejectClick,
    refreshData,
    setSearchTerm,
    setActiveTab,
    getFilteredListings } = useListing();

 
  const renderListingCard = (listing: Listing) => (
    <Card key={listing.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold mb-1 line-clamp-2" title={listing.name}>
              {listing.name}
            </CardTitle>
            <CardDescription className="flex items-center text-sm text-gray-600">
              <Building className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {listing.seller.businessName ||
                  `${listing.seller.firstName || ''} ${listing.seller.lastName || ''}`.trim() ||
                  listing.seller.email}
              </span>
            </CardDescription>
          </div>
          <Badge
            variant={listing.status === 'PENDING' ? 'secondary' : listing.status === 'ACTIVE' ? 'default' : 'destructive'}
            className={
              listing.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                listing.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-200' :
                  'bg-red-100 text-red-800 border-red-200'
            }
          >
            {listing.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3" title={listing.description}>
          {listing.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600 mr-1 flex-shrink-0" />
            <span className="font-semibold text-green-700">{formatPrice(listing.price)}</span>
          </div>
          <div className="flex items-center">
            <Package className="h-4 w-4 text-blue-600 mr-1 flex-shrink-0" />
            <span className="text-blue-700">{(listing.quantity ?? 0).toLocaleString()} units</span>
          </div>
          <div className="flex items-center col-span-2">
            <User className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            <span className="truncate text-gray-600">{listing.seller.email}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 text-purple-600 mr-1 flex-shrink-0" />
            <span className="text-purple-700">{listing._count.rfqs} RFQs</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            <span className="text-gray-600 text-xs">{formatDate(listing.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewListing(listing)}
            className="flex-1 hover:bg-blue-50 hover:border-blue-300"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>

          {listing.status === 'PENDING' && (
            <>
              <Button
                size="sm"
                onClick={() => approveListing(listing.id)}
                disabled={processingAction === listing.id}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {processingAction === listing.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRejectClick(listing)}
                disabled={processingAction === listing.id}
                className="hover:bg-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Listings Management Dashboard
                </h1>
                <p className="text-gray-600 max-w-2xl">
                  Review, approve, and manage product listings from sellers. Monitor submission trends and maintain quality standards.
                </p>
              </div>
              <Button
                onClick={refreshData}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2 self-start sm:self-center"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </header>

          {/* Stats Dashboard */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8" aria-label="Statistics Overview">
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-800">Pending Review</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                    <p className="text-xs text-amber-600 mt-1">Needs attention</p>
                  </div>
                  <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Active Listings</p>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                    <p className="text-xs text-green-600 mt-1">Live & selling</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                    <p className="text-xs text-red-600 mt-1">Did not meet criteria</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total Processed</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-xs text-blue-600 mt-1">Lifetime reviews</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Search Section */}
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by product name, company, seller email, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11"
                      aria-label="Search listings"
                    />
                  </div>
                </div>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="whitespace-nowrap"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Toast Notifications */}
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
              <Alert
                key={toast.id}
                className={`max-w-sm shadow-lg ${toast.type === 'success' ? 'border-green-200 bg-green-50' :
                  toast.type === 'error' ? 'border-red-200 bg-red-50' :
                    'border-yellow-200 bg-yellow-50'
                  }`}
                role="alert"
              >
                <AlertDescription className={
                  toast.type === 'success' ? 'text-green-800' :
                    toast.type === 'error' ? 'text-red-800' :
                      'text-yellow-800'
                }>
                  {toast.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="pending" className="flex items-center gap-2 h-10">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Pending Review</span>
                <span className="sm:hidden">Pending</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                  {stats.pending}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2 h-10">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Active Listings</span>
                <span className="sm:hidden">Active</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  {stats.active}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Pending Listings Tab */}
            <TabsContent value="pending">
              {loading ? (
                <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading pending listings...</p>
                  </div>
                </div>
              ) : getFilteredListings(pendingListings).length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="p-12 text-center">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      {searchTerm ? 'No matching pending listings found' : 'No pending listings to review'}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {searchTerm
                        ? 'Try adjusting your search criteria or clear the search to see all pending listings.'
                        : 'All submissions have been reviewed. New listings will appear here when sellers submit them.'}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm('')}
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getFilteredListings(pendingListings).map(renderListingCard)}
                </div>
              )}
            </TabsContent>

            {/* Active Listings Tab */}
            <TabsContent value="active">
              {loading ? (
                <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading active listings...</p>
                  </div>
                </div>
              ) : getFilteredListings(activeListings).length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      {searchTerm ? 'No matching active listings found' : 'No active listings yet'}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {searchTerm
                        ? 'Try adjusting your search criteria or clear the search to see all active listings.'
                        : 'Active listings will appear here once you approve pending submissions.'}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm('')}
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getFilteredListings(activeListings).map(renderListingCard)}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* View Details Modal */}
          <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              {selectedListing && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
                      {selectedListing.name}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Complete listing details and seller information for review
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* Product Overview */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2 text-blue-600" />
                        Product Overview
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>
                          <p className="mt-1 text-gray-600 leading-relaxed">{selectedListing.description}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Price:</span>
                            <span className="font-semibold text-green-600">{formatPrice(selectedListing.price)}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Quantity:</span>
                            <span className="font-semibold text-blue-600">{(selectedListing.quantity ?? 0).toLocaleString()} units</span>
                          </div>
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Status:</span>
                            <Badge className={selectedListing.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
                              {selectedListing.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">RFQ Count:</span>
                            <span className="font-semibold text-purple-600">{selectedListing._count.rfqs}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Seller Information */}
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Building className="h-5 w-5 mr-2 text-blue-600" />
                        Seller Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedListing.seller.businessName && (
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Business Name:</span>
                            <span className="font-semibold">{selectedListing.seller.businessName}</span>
                          </div>
                        )}
                        {(selectedListing.seller.firstName || selectedListing.seller.lastName) && (
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Contact Name:</span>
                            <span className="font-semibold">
                              {selectedListing.seller.firstName} {selectedListing.seller.lastName}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between p-3 bg-white rounded border sm:col-span-2">
                          <span className="font-medium text-gray-700">Email Address:</span>
                          <span className="font-semibold text-blue-600">{selectedListing.seller.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Submission Details */}
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-green-600" />
                        Submission Details
                      </h3>
                      <div className="flex justify-between p-3 bg-white rounded border">
                        <span className="font-medium text-gray-700">Submitted On:</span>
                        <span className="font-semibold">{formatDate(selectedListing.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-3 pt-4">
                    <Button variant="outline" onClick={() => setShowViewModal(false)}>
                      Close
                    </Button>
                    {selectedListing.status === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => {
                            setShowViewModal(false);
                            handleRejectClick(selectedListing);
                          }}
                          variant="destructive"
                          className="hover:bg-red-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject Listing
                        </Button>
                        <Button
                          onClick={() => {
                            setShowViewModal(false);
                            approveListing(selectedListing.id);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve Listing
                        </Button>
                      </>
                    )}
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Reject Modal */}
          <Dialog open={showRejectModal} onOpenChange={(open) => {
            setShowRejectModal(open);
            if (!open) {
              setRejectionReason('');
              setSelectedListing(null);
            }
          }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-red-600">
                  Reject Listing
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Please provide a clear reason for rejecting "{selectedListing?.name}". This feedback will help the seller improve their future submissions.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="Enter detailed rejection reason (required)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                  required
                />
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Be specific to help the seller understand the issues</span>
                  <span>{rejectionReason.length}/500</span>
                </div>
              </div>

              <DialogFooter className="gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedListing(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedListing && rejectListing(selectedListing.id)}
                  disabled={!rejectionReason.trim() || processingAction === selectedListing?.id}
                  className="hover:bg-red-700"
                >
                  {processingAction === selectedListing?.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Reject Listing
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default ListingsManagement;