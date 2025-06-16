/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, Check, X, Building, User, Calendar, DollarSign, Package, MessageSquare, Search, Filter } from 'lucide-react';

type Seller = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
};

type Listing = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: Date;
  seller: Seller;
  _count: { rfqs: number };
};

const ListingsManagement = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ pending: 0, active: 0, rejected: 0, total: 0 });

  // Simulated API calls (replace with actual API endpoints)
  const fetchPendingListings = async () => {
    setLoading(true);
    try {
      // Simulated API response
      const mockListings = [
        {
          id: '1',
          name: 'Premium Steel Rods',
          description: 'High-quality steel rods suitable for construction projects. Grade A material with excellent durability.',
          price: 45.99,
          quantity: 500,
          status: 'PENDING',
          createdAt: new Date('2024-06-10'),
          seller: {
            id: 's1',
            name: 'Steel Works Ltd.',
            email: 'contact@steelworks.com',
            company: 'Steel Works Ltd.',
            phone: '+1-555-0123'
          },
          _count: { rfqs: 3 }
        },
        {
          id: '2',
          name: 'Organic Cotton Fabric',
          description: 'Premium organic cotton fabric, GOTS certified. Perfect for high-end textile manufacturing.',
          price: 12.50,
          quantity: 1000,
          status: 'PENDING',
          createdAt: new Date('2024-06-12'),
          seller: {
            id: 's2',
            name: 'EcoTextiles Inc.',
            email: 'sales@ecotextiles.com',
            company: 'EcoTextiles Inc.',
            phone: '+1-555-0456'
          },
          _count: { rfqs: 1 }
        },
        {
          id: '3',
          name: 'Electronic Components Kit',
          description: 'Complete electronic components kit including resistors, capacitors, and microcontrollers.',
          price: 89.99,
          quantity: 200,
          status: 'PENDING',
          createdAt: new Date('2024-06-13'),
          seller: {
            id: 's3',
            name: 'TechParts Supply',
            email: 'orders@techparts.com',
            company: 'TechParts Supply Co.',
            phone: '+1-555-0789'
          },
          _count: { rfqs: 7 }
        }
      ];

      setListings(mockListings);
      setStats({ pending: 3, active: 15, rejected: 2, total: 20 });
    } catch {
      showToast('Failed to fetch listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  interface ApproveListingFn {
    (listingId: string): Promise<void>;
  }

  const approveListing: ApproveListingFn = async (listingId) => {
    setProcessingAction(listingId);
    try {
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      setListings(prev => prev.filter(listing => listing.id !== listingId));
      setStats(prev => ({ ...prev, pending: prev.pending - 1, active: prev.active + 1 }));
      showToast('Listing approved successfully', 'success');
    } catch (error) {
      showToast('Failed to approve listing', 'error');
    } finally {
      setProcessingAction(null);
    }
  };

  const rejectListing = async (listingId: string) => {
    setProcessingAction(listingId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setListings(prev => prev.filter(listing => listing.id !== listingId));
      setStats(prev => ({ ...prev, pending: prev.pending - 1, rejected: prev.rejected + 1 }));
      showToast('Listing rejected successfully', 'success');
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      showToast('Failed to reject listing', 'error');
    } finally {
      setProcessingAction(null);
    }
  };

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleViewListing = (listing: Listing) => {
    setSelectedListing(listing);
    setShowViewModal(true);
  };

  const handleRejectClick = (listing: Listing) => {
    setSelectedListing(listing);
    setShowRejectModal(true);
  };

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.seller.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPendingListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Listings Management</h1>
          <p className="text-gray-600">Review and manage pending product listings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search listings by name or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 right-4 z-50">
            <Alert className={`${toast.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <AlertDescription className={toast.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {toast.message}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : filteredListings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending listings</h3>
              <p className="text-gray-500">All listings have been reviewed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-1">{listing.name}</CardTitle>
                      <CardDescription className="flex items-center text-sm text-gray-600">
                        <Building className="h-3 w-3 mr-1" />
                        {listing.seller.company}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Pending
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="font-medium">${listing.price}</span>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{listing.quantity} units</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{listing.seller.name}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{listing._count.rfqs} RFQs</span>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Submitted: {listing.createdAt.toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewListing(listing)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approveListing(listing.id)}
                      disabled={processingAction === listing.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processingAction === listing.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRejectClick(listing)}
                      disabled={processingAction === listing.id}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View Details Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedListing && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedListing.name}</DialogTitle>
                  <DialogDescription>
                    Detailed listing information for review
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Product Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Description:</span> {selectedListing.description}</p>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <p><span className="font-medium">Price:</span> ${selectedListing.price}</p>
                        <p><span className="font-medium">Quantity:</span> {selectedListing.quantity} units</p>
                        <p><span className="font-medium">Status:</span>
                          <Badge className="ml-2 bg-orange-100 text-orange-800">{selectedListing.status}</Badge>
                        </p>
                        <p><span className="font-medium">RFQs:</span> {selectedListing._count.rfqs}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Seller Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Company:</span> {selectedListing.seller.company}</p>
                      <p><span className="font-medium">Contact Name:</span> {selectedListing.seller.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedListing.seller.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedListing.seller.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Submission Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">Submitted:</span> {selectedListing.createdAt.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowViewModal(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowViewModal(false);
                      handleRejectClick(selectedListing);
                    }}
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setShowViewModal(false);
                      approveListing(selectedListing.id);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div >
  );
};

export default ListingsManagement;