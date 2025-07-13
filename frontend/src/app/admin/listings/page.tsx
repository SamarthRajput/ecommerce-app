"use client";
import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  User,
  Calendar,
  DollarSign,
  Package,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  FileText,
  Building,
  Mail,
  Award,
  Image,
  Video,
  Tag,
  ShoppingCart,
  TrendingUp,
  Truck,
  ExternalLink
} from 'lucide-react';
import { formatDate, formatPrice } from '@/src/lib/listing-formatter';
import useListing from './useListing';

interface Listing {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  quantity: number;
  minimumOrderQuantity?: number;
  listingType: 'SELL' | 'LEASE' | 'RENT';
  condition: string;
  validityPeriod: number;
  expiryDate?: string;
  deliveryTimeInDays?: number;
  logisticsSupport?: 'SELF' | 'INTERLINK' | 'BOTH';
  industry: string;
  category: string;
  productCode: string;
  model: string;
  specifications: string;
  countryOfSource: string;
  hsnCode: string;
  certifications: string[];
  licenses: string[];
  warrantyPeriod?: string;
  brochureUrl?: string;
  videoUrl?: string;
  images: string[];
  tags: string[];
  keywords: string[];
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  seller: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
  };
  rfqs: Array<{
    id: string;
    buyer: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    quantity: number;
    message?: string;
    status: string;
    createdAt: string;
  }>;
  _count: {
    rfqs: number;
  };
  createdAt: string;
  updatedAt: string;
}

const ListingsManagementDashboard = () => {
  const {
    Listings,
    loading,
    selectedListing,
    showViewModal,
    showRejectModal,
    rejectionReason,
    processingAction,
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
    getFilteredListings
  } = useListing();

  const [filterStatus, setFilterStatus] = useState('all');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRFQsModal, setShowRFQsModal] = useState(false);

  const formatDateLocal = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'ACTIVE':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active Listing
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }, []);

  const getListingTypeBadge = useCallback((type: string) => {
    const colors = {
      SELL: 'bg-blue-100 text-blue-800',
      LEASE: 'bg-purple-100 text-purple-800',
      RENT: 'bg-orange-100 text-orange-800'
    };
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  }, []);

  const StatCard = React.memo(({ title, value, subtitle, icon: Icon, color }: {
    title: string;
    value: number;
    subtitle?: string;
    icon: any;
    color: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  ));

  const ListingDetailModal = ({ listing }: { listing: Listing }) => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            <Package className="w-5 h-5" />
          </div>
          {listing.name}
        </DialogTitle>
        <DialogDescription>
          Complete Product Listing Details and Information
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6">
        {/* Product Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <div className="mt-1">
                {getStatusBadge(listing.status)}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Listing Type</Label>
              <div className="mt-1">
                {getListingTypeBadge(listing.listingType)}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Product Code</Label>
              <div className="mt-1">
                <span className="text-sm font-medium">{listing.productCode}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Description</Label>
              <p className="text-sm mt-1 leading-relaxed">{listing.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Model</Label>
                <p className="text-sm mt-1">{listing.model}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Condition</Label>
                <p className="text-sm mt-1">{listing.condition}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Country of Origin</Label>
                <p className="text-sm mt-1">{listing.countryOfSource}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">HSN Code</Label>
                <p className="text-sm mt-1">{listing.hsnCode}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Specifications</Label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm leading-relaxed">{listing.specifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing & Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Price</Label>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">
                  {formatPrice(listing.price)} {listing.currency && `(${listing.currency})`}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Available Quantity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">{listing.quantity.toLocaleString()} units</span>
              </div>
            </div>
            {listing.minimumOrderQuantity && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Minimum Order Quantity</Label>
                <div className="flex items-center gap-2 mt-1">
                  <ShoppingCart className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600">{listing.minimumOrderQuantity.toLocaleString()} units</span>
                </div>
              </div>
            )}
            {listing.warrantyPeriod && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Warranty Period</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{listing.warrantyPeriod}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category & Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Category & Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Industry</Label>
              <p className="text-sm mt-1">{listing.industry}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Category</Label>
              <p className="text-sm mt-1">{listing.category}</p>
            </div>
            {listing.tags.length > 0 && (
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-600">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {listing.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            {listing.keywords.length > 0 && (
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-600">Keywords</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {listing.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">{keyword}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery & Logistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Delivery & Logistics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {listing.deliveryTimeInDays && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Delivery Time</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">{listing.deliveryTimeInDays} days</span>
                </div>
              </div>
            )}
            {listing.logisticsSupport && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Logistics Support</Label>
                <div className="mt-1">
                  <Badge variant="outline">{listing.logisticsSupport}</Badge>
                </div>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-600">Validity Period</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{listing.validityPeriod} days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications & Licenses */}
        {(listing.certifications.length > 0 || listing.licenses.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certifications & Licenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {listing.certifications.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Certifications</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {listing.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700">{cert}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {listing.licenses.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Licenses</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {listing.licenses.map((license, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">{license}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Media & Resources */}
        {(listing.images.length > 0 || listing.brochureUrl || listing.videoUrl) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="w-5 h-5" />
                Media & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {listing.images.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Product Images</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Image className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{listing.images.length} images available</span>
                  </div>
                </div>
              )}
              {listing.brochureUrl && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Product Brochure</Label>
                  <div className="mt-1">
                    <Button variant="outline" size="sm" asChild>
                      <a href={listing.brochureUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-1" />
                        View Brochure
                      </a>
                    </Button>
                  </div>
                </div>
              )}
              {listing.videoUrl && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Product Video</Label>
                  <div className="mt-1">
                    <Button variant="outline" size="sm" asChild>
                      <a href={listing.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Video className="w-4 h-4 mr-1" />
                        Watch Video
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Seller Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="w-5 h-5" />
              Seller Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listing.seller.businessName && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Business Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{listing.seller.businessName}</span>
                </div>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-600">Contact Person</Label>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {`${listing.seller.firstName || ''} ${listing.seller.lastName || ''}`.trim() || 'N/A'}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Email</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{listing.seller.email}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Seller ID</Label>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-mono">{listing.seller.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RFQ Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              RFQ Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Total RFQs</Label>
              <div className="flex items-center gap-2 mt-1">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold">{listing._count.rfqs} requests</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Actions</Label>
              <div className="mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRFQsModal(true)}
                  disabled={listing._count.rfqs === 0}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  View RFQs ({listing._count.rfqs})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Created</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{formatDateLocal(listing.createdAt)}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{formatDateLocal(listing.updatedAt)}</span>
              </div>
            </div>
            {listing.expiryDate && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Expiry Date</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">{formatDateLocal(listing.expiryDate)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DialogFooter className="gap-3 pt-6">
        <Button variant="outline" onClick={() => setShowViewModal(false)}>
          Close
        </Button>
        {listing.status === 'ACTIVE' && listing._count.rfqs > 0 && (
          <Button
            onClick={() => setShowRFQsModal(true)}
            variant="outline"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            View RFQs ({listing._count.rfqs})
          </Button>
        )}
        {listing.status === 'PENDING' && (
          <>
            <Button
              onClick={() => {
                setShowViewModal(false);
                handleRejectClick(listing);
              }}
              variant="destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Reject Listing
            </Button>
            <Button
              onClick={() => {
                setShowViewModal(false);
                setSelectedListing(listing);
                setShowApproveModal(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve Listing
            </Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  );

  const ApproveConfirmModal = () => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-600">
          <Check className="w-5 h-5" />
          Approve Listing
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to approve this product listing? This will make it visible to buyers and they can submit RFQs.
        </DialogDescription>
      </DialogHeader>

      {selectedListing && (
        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Product:</span>
              <span className="text-sm">{selectedListing.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Price:</span>
              <span className="text-sm font-semibold text-green-600">{formatPrice(selectedListing.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Quantity:</span>
              <span className="text-sm">{selectedListing.quantity.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Seller:</span>
              <span className="text-sm">{selectedListing.seller.businessName || selectedListing.seller.email}</span>
            </div>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            setShowApproveModal(false);
            setSelectedListing(null);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (selectedListing) {
              approveListing(selectedListing.id);
              setShowApproveModal(false);
              setSelectedListing(null);
            }
          }}
          disabled={processingAction === selectedListing?.id}
          className="bg-green-600 hover:bg-green-700"
        >
          {processingAction === selectedListing?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Check className="w-4 h-4 mr-2" />
          Approve Listing
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  const RejectModal = () => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-600">
          <X className="w-5 h-5" />
          Reject Listing
        </DialogTitle>
        <DialogDescription>
          Please provide a clear reason for rejecting this product listing. This feedback will help the seller understand your decision.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="rejection-reason">Rejection Reason</Label>
          <Textarea
            id="rejection-reason"
            placeholder="Enter detailed rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Be specific to help the seller understand</span>
            <span>{rejectionReason.length}/500</span>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            setShowRejectModal(false);
            setRejectionReason('');
          }}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => selectedListing && rejectListing(selectedListing.id)}
          disabled={!rejectionReason.trim() || processingAction === selectedListing?.id}
        >
          {processingAction === selectedListing?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reject Listing
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  const RFQsModal = () => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          RFQs for {selectedListing?.name}
        </DialogTitle>
        <DialogDescription>
          All buyer requests for this product listing
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {selectedListing?.rfqs?.map((rfq) => (
          <Card key={rfq.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {`${rfq.buyer.firstName || ''} ${rfq.buyer.lastName || ''}`.trim() || rfq.buyer.email}
                      </div>
                      <div className="text-sm text-muted-foreground">{rfq.buyer.email}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="font-medium">Quantity: </span>
                      <span>{rfq.quantity.toLocaleString()} units</span>
                    </div>
                    <div>
                      <span className="font-medium">Status: </span>
                      <Badge variant="outline">{rfq.status}</Badge>
                    </div>
                  </div>

                  {rfq.message && (
                    <div className="mb-3">
                      <span className="font-medium text-sm">Message: </span>
                      <p className="text-sm text-gray-600 mt-1">{rfq.message}</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Submitted: {formatDateLocal(rfq.createdAt)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a
                      href={`/admin/chat?chatwith=${rfq.buyer.id}&rfqId=${rfq.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Chat
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!selectedListing?.rfqs || selectedListing.rfqs.length === 0) && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No RFQs found for this listing</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setShowRFQsModal(false)}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  const ListingRow = React.memo(({ listing }: { listing: Listing }) => (
    <div className="flex items-center p-4 border-b border-border hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            <Package className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{listing.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {listing.seller.businessName || `${listing.seller.firstName || ''} ${listing.seller.lastName || ''}`.trim() || listing.seller.email}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="w-3 h-3 text-green-600" />
            <span className="font-medium text-green-600">{formatPrice(listing.price)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Package className="w-3 h-3" />
            {listing.quantity.toLocaleString()} units
          </div>
        </div>
      </div>

      <div className="flex-1 px-4">
        {getStatusBadge(listing.status)}
      </div>

      <div className="flex-1 px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <MessageSquare className="w-3 h-3 text-purple-600" />
            {listing._count.rfqs} RFQs
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDateLocal(listing.createdAt)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewListing(listing)}
        >
          <Eye className="w-4 h-4" />
        </Button>

        {listing.status === 'ACTIVE' && listing._count.rfqs > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedListing(listing);
              setShowRFQsModal(true);
            }}
            className="text-purple-600 hover:text-purple-700"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        )}

        {listing.status === 'PENDING' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedListing(listing);
                setShowApproveModal(true);
              }}
              disabled={processingAction === listing.id}
              className="text-green-600 hover:text-green-700"
            >
              {processingAction === listing.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRejectClick(listing)}
              disabled={processingAction === listing.id}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  ));

  const TabContent = React.memo(({ data, type }: { data: Listing[], type: string }) => {
    const filteredData = useMemo(() => getFilteredListings(data), [data, getFilteredListings]);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="capitalize">{type} Listings</CardTitle>
              <CardDescription>Manage {type} product listings</CardDescription>
            </div>
            <Button onClick={refreshData} variant="outline" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-muted/50 border-b border-border">
              <div className="flex items-center p-4 font-medium text-sm">
                <div className="flex-1">Product & Seller</div>
                <div className="flex-1 px-4">Price & Quantity</div>
                <div className="flex-1 px-4">Status</div>
                <div className="flex-1 px-4">RFQs & Date</div>
                <div className="w-32 text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div>
              {filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Package className="w-12 h-12" />
                    <p>No {type} listings found</p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm('')}
                        className="mt-2"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                filteredData.map((listing) => (
                  <ListingRow key={listing.id} listing={listing} />
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading listings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground">
          <a href="/admin" className="hover:text-foreground">Admin Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">Listings Management</span>
        </nav>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Listings Management</h1>
          <p className="text-muted-foreground mt-2">
            Review, approve, and manage product listings from sellers
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Pending Review"
            value={stats.pending}
            subtitle="Awaiting approval"
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatCard
            title="Active Listings"
            value={stats.active}
            subtitle="Live & selling"
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            subtitle="Did not meet criteria"
            icon={X}
            color="bg-red-500"
          />
          <StatCard
            title="Total Processed"
            value={stats.total}
            subtitle="All time reviews"
            icon={TrendingUp}
            color="bg-blue-500"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              All Listings
              <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Review
              <Badge variant="secondary" className="ml-1">{stats.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Active Listings
              <Badge variant="secondary" className="ml-1">{stats.active}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <TabContent data={Listings} type="pending" />
          </TabsContent>
          <TabsContent value="pending">
            <TabContent data={Listings.filter(l => l.status === "PENDING")} type="pending" />
          </TabsContent>

          <TabsContent value="active">
            <TabContent data={Listings.filter(l => l.status === "ACTIVE")} type="active" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        {selectedListing && (
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  <Package className="w-5 h-5" />
                </div>
                {selectedListing.name}
              </DialogTitle>
              <DialogDescription>
                Complete Product Listing Details and Information
              </DialogDescription>
            </DialogHeader>
            <ListingDetailModal listing={selectedListing} key={selectedListing.id} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <ApproveConfirmModal />
      </Dialog>

      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <RejectModal />
      </Dialog>

      <Dialog open={showRFQsModal} onOpenChange={setShowRFQsModal}>
        <RFQsModal />
      </Dialog>
    </div>
  );
};

export default ListingsManagementDashboard;