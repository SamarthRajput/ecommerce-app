// src/app/admin/rfqs/page.tsx
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Eye, Check, X, User, Calendar, DollarSign, Package, MessageSquare, Search, RefreshCw, AlertCircle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { formatPrice } from '@/src/lib/listing-formatter';
import { RFQ } from '@/src/lib/types/rfq';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useRFQ from '../../../hooks/useRFQ';

const RFQsManagement = () => {
  const {
    pendingRFQs,
    activeRFQs,
    loading,
    selectedRFQ,
    showViewModal,
    showRejectModal,
    rejectionReason,
    processingAction,
    toasts,
    searchTerm,
    activeTab,
    stats,
    setSelectedRFQ,
    setShowViewModal,
    setShowRejectModal,
    setRejectionReason,
    approveRFQ,
    rejectRFQ,
    handleViewRFQ,
    handleRejectClick,
    refreshData,
    setSearchTerm,
    setActiveTab,
    getFilteredRFQs } = useRFQ();

  const renderRFQCard = (rfq: RFQ) => (
    <Card key={rfq.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold mb-1 line-clamp-2" title={rfq.product.name}>
              {rfq.product.name}
            </CardTitle>
            <CardDescription className="flex items-center text-sm text-gray-600">
              <User className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {`${rfq.buyer.firstName || ''} ${rfq.buyer.lastName || ''}`.trim() || rfq.buyer.email}
              </span>
            </CardDescription>
          </div>
          <Badge
            variant={rfq.status === 'PENDING' ? 'secondary' : rfq.status === 'APPROVED' ? 'default' : 'destructive'}
            className={
              rfq.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                rfq.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
                  'bg-red-100 text-red-800 border-red-200'
            }
          >
            {rfq.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {rfq.message && (
          <p className="text-sm text-gray-600 line-clamp-3" title={rfq.message}>
            {rfq.message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600 mr-1 flex-shrink-0" />
            <span className="font-semibold text-green-700">{formatPrice(rfq.product.price)}</span>
          </div>
          <div className="flex items-center">
            <Package className="h-4 w-4 text-blue-600 mr-1 flex-shrink-0" />
            <span className="text-blue-700">{rfq.quantity.toLocaleString()} units</span>
          </div>
          <div className="flex items-center col-span-2">
            <User className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            <span className="truncate text-gray-600">{rfq.buyer.email}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 text-purple-600 mr-1 flex-shrink-0" />
            <span className="text-purple-700">{rfq._count?.messages || 0} Messages</span>
          </div>
          {/* <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            <span className="text-gray-600 text-xs">{formatDate(rfq.createdAt)}</span>
          </div> */}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewRFQ(rfq)}
            className="flex-1 hover:bg-blue-50 hover:border-blue-300"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>

          {rfq.status === 'PENDING' && (
            <>
              <Button
                size="sm"
                onClick={() => approveRFQ(rfq.id)}
                disabled={processingAction === rfq.id}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {processingAction === rfq.id ? (
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
                onClick={() => handleRejectClick(rfq)}
                disabled={processingAction === rfq.id}
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
                  RFQs Management Dashboard
                </h1>
                <p className="text-gray-600 max-w-2xl">
                  Review, approve, and manage RFQs from buyers. Monitor requests and maintain quality standards.
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
                    <p className="text-sm font-medium text-green-800">Approved RFQs</p>
                    <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                    <p className="text-xs text-green-600 mt-1">Active requests</p>
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
                      placeholder="Search by product name, buyer name, email, or message..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11"
                      aria-label="Search RFQs"
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
              <TabsTrigger value="approved" className="flex items-center gap-2 h-10">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Approved RFQs</span>
                <span className="sm:hidden">Approved</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  {stats.approved}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Pending RFQs Tab */}
            <TabsContent value="pending">
              {loading ? (
                <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading pending RFQs...</p>
                  </div>
                </div>
              ) : getFilteredRFQs(pendingRFQs).length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="p-12 text-center">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      {searchTerm ? 'No matching pending RFQs found' : 'No pending RFQs to review'}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {searchTerm
                        ? 'Try adjusting your search criteria or clear the search to see all pending RFQs.'
                        : 'All requests have been reviewed. New RFQs will appear here when buyers submit them.'}
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
                  {getFilteredRFQs(pendingRFQs).map(renderRFQCard)}
                </div>
              )}
            </TabsContent>

            {/* Approved RFQs Tab */}
            <TabsContent value="approved">
              {loading ? (
                <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading approved RFQs...</p>
                  </div>
                </div>
              ) : getFilteredRFQs(activeRFQs).length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      {searchTerm ? 'No matching approved RFQs found' : 'No approved RFQs yet'}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {searchTerm
                        ? 'Try adjusting your search criteria or clear the search to see all approved RFQs.'
                        : 'Approved RFQs will appear here once you approve pending requests.'}
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
                  {getFilteredRFQs(activeRFQs).map(renderRFQCard)}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* View Details Modal */}
          <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              {selectedRFQ && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
                      {selectedRFQ.product.name}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Complete RFQ details and buyer information
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* RFQ Overview */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2 text-blue-600" />
                        RFQ Details
                      </h3>
                      <div className="space-y-3">
                        {selectedRFQ.message && (
                          <div>
                            <span className="font-medium text-gray-700">Buyer's Message:</span>
                            <p className="mt-1 text-gray-600 leading-relaxed">{selectedRFQ.message}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Product Price:</span>
                            <span className="font-semibold text-green-600">{formatPrice(selectedRFQ.product.price)}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Requested Quantity:</span>
                            <span className="font-semibold text-blue-600">{selectedRFQ.quantity.toLocaleString()} units</span>
                          </div>
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Status:</span>
                            <Badge className={selectedRFQ.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : selectedRFQ.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {selectedRFQ.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Messages:</span>
                            <span className="font-semibold text-purple-600">{selectedRFQ._count?.messages || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2 text-blue-600" />
                        Product Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>
                          <p className="mt-1 text-gray-600 leading-relaxed">{selectedRFQ.product.description}</p>
                        </div>
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Available Quantity:</span>
                            <span className="font-semibold">{(selectedRFQ.product.quantity ?? 0).toLocaleString()} units</span>
                          </div>
                          <div className="flex justify-between p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Seller:</span>
                            <span className="font-semibold">
                              {selectedRFQ.product.seller.businessName || 
                               `${selectedRFQ.product.seller.firstName || ''} ${selectedRFQ.product.seller.lastName || ''}`.trim()}
                            </span>
                          </div>
                        </div> */}
                      </div>
                    </div>

                    {/* Buyer Information */}
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-green-600" />
                        Buyer Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex justify-between p-3 bg-white rounded border">
                          <span className="font-medium text-gray-700">Name:</span>
                          <span className="font-semibold">
                            {selectedRFQ.buyer.firstName} {selectedRFQ.buyer.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between p-3 bg-white rounded border">
                          <span className="font-medium text-gray-700">Email:</span>
                          <span className="font-semibold text-blue-600">{selectedRFQ.buyer.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Submission Details */}
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                        Submission Details
                      </h3>
                      {/* <div className="flex justify-between p-3 bg-white rounded border">
                        <span className="font-medium text-gray-700">Submitted On:</span>
                        <span className="font-semibold">{formatDate(selectedRFQ.createdAt)}</span>
                      </div> */}
                    </div>
                  </div>

                  <DialogFooter className="gap-3 pt-4">
                    <Button variant="outline" onClick={() => setShowViewModal(false)}>
                      Close
                    </Button>
                    {selectedRFQ.status === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => {
                            setShowViewModal(false);
                            handleRejectClick(selectedRFQ);
                          }}
                          variant="destructive"
                          className="hover:bg-red-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject RFQ
                        </Button>
                        <Button
                          onClick={() => {
                            setShowViewModal(false);
                            approveRFQ(selectedRFQ.id);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve RFQ
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
              setSelectedRFQ(null);
            }
          }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-red-600">
                  Reject RFQ
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Please provide a clear reason for rejecting this request for "{selectedRFQ?.product.name}". This feedback will help the buyer understand your decision.
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
                  <span>Be specific to help the buyer understand the issues</span>
                  <span>{rejectionReason.length}/500</span>
                </div>
              </div>

              <DialogFooter className="gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedRFQ(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedRFQ && rejectRFQ(selectedRFQ.id)}
                  disabled={!rejectionReason.trim() || processingAction === selectedRFQ?.id}
                  className="hover:bg-red-700"
                >
                  {processingAction === selectedRFQ?.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Reject RFQ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default RFQsManagement;