"use client";
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
  Phone,
  MapPin,
  CreditCard,
  Truck,
  ClipboardList,
  Send,
  Users,
  TrendingUp
} from 'lucide-react';
import { formatPrice } from '@/lib/listing-formatter';
import { RFQ } from '@/lib/types/rfq';
import useRFQ from '../../../../hooks/useRFQ';

const RFQManagementDashboard = () => {
  const {
    pendingRFQs,
    activeRFQs,
    loading,
    selectedRFQ,
    showViewModal,
    showRejectModal,
    rejectionReason,
    processingAction,
    searchTerm,
    activeTab,
    stats,
    setSelectedRFQ,
    setShowViewModal,
    setShowRejectModal,
    setRejectionReason,
    forwardRFQ,
    rejectRFQ,
    handleViewRFQ,
    handleRejectClick,
    refreshData,
    setSearchTerm,
    setActiveTab,
    getFilteredRFQs
  } = useRFQ();

  const [filterStatus, setFilterStatus] = useState('all');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current ) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

  const formatDate = useCallback((dateString: string | Date) => {
    if (typeof dateString === 'string') {
      dateString = new Date(dateString);
    }
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
      case 'APPROVED':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Forwarded to Sellers
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

  const RFQDetailModal = React.memo(({ rfq }: { rfq: RFQ }) => (
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            <Package className="w-5 h-5" />
          </div>
          {rfq.product.name}
        </DialogTitle>
        <DialogDescription>
          Complete RFQ Request Details and Information
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6">
        {/* RFQ Status and Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Request Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <div className="mt-1">
                {getStatusBadge(rfq.status)}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Requested Quantity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold">{rfq.quantity.toLocaleString()} units</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Submitted</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{formatDate(rfq.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commercial Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Commercial Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Product Unit Price</Label>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">{formatPrice(rfq.product.price)}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Total Estimated Value</Label>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  {formatPrice(rfq.product.price * rfq.quantity)}
                </span>
              </div>
            </div>
            {rfq.budget && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Buyer's Budget</Label>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600">
                    {formatPrice(rfq.budget)} {rfq.currency && `(${rfq.currency})`}
                  </span>
                </div>
              </div>
            )}
            {rfq.paymentTerms && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Payment Terms</Label>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{rfq.paymentTerms}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Requirements */}
        {rfq.deliveryDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Required Delivery Date</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">{formatDate(rfq.deliveryDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Buyer's Messages and Requirements */}
        {(rfq.message || rfq.specialRequirements || rfq.additionalNotes) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Buyer's Requirements & Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rfq.message && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Initial Message</Label>
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                    {(() => {
                      try {
                        const parsed = JSON.parse(rfq.message);
                        return (
                          <div className="space-y-2">
                            {parsed.deliveryDate && (
                              <div>
                                <span className="font-medium">Delivery Date:</span>{" "}
                                <span>{parsed.deliveryDate}</span>
                              </div>
                            )}
                            {parsed.budget && (
                              <div>
                                <span className="font-medium">Budget:</span>{" "}
                                <span>
                                  {parsed.budget} {parsed.currency ? `(${parsed.currency})` : ""}
                                </span>
                              </div>
                            )}
                            {parsed.paymentTerms && (
                              <div>
                                <span className="font-medium">Payment Terms:</span>{" "}
                                <span>{parsed.paymentTerms}</span>
                              </div>
                            )}
                            {parsed.specialRequirements && (
                              <div>
                                <span className="font-medium">Special Requirements:</span>{" "}
                                <span>{parsed.specialRequirements}</span>
                              </div>
                            )}
                            {parsed.additionalNotes && (
                              <div>
                                <span className="font-medium">Additional Notes:</span>{" "}
                                <span>{parsed.additionalNotes}</span>
                              </div>
                            )}
                          </div>
                        );
                      } catch {
                        return <p className="text-sm leading-relaxed">{rfq.message}</p>;
                      }
                    })()}
                  </div>
                </div>
              )}
              {rfq.specialRequirements && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Special Requirements</Label>
                  <div className="mt-2 p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm leading-relaxed">{rfq.specialRequirements}</p>
                  </div>
                </div>
              )}
              {rfq.additionalNotes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Additional Notes</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm leading-relaxed">{rfq.additionalNotes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Product Name</Label>
              <p className="text-sm mt-1 font-medium">{rfq.product.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Description</Label>
              <p className="text-sm mt-1 leading-relaxed">{rfq.product.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Unit Price</Label>
                <p className="text-sm mt-1 font-semibold text-green-600">{formatPrice(rfq.product.price)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Category</Label>
                <p className="text-sm mt-1">{rfq.product.category || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buyer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Buyer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Name</Label>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {`${rfq.buyer.firstName || ''} ${rfq.buyer.lastName || ''}`.trim() || 'N/A'}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Email</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{rfq.buyer.email}</span>
              </div>
            </div>
            {rfq.buyer.phoneNumber && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Phone</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{rfq.buyer.phoneNumber}</span>
                </div>
              </div>
            )}
            {(rfq.buyer.city || rfq.buyer.country) && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Location</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {[rfq.buyer.city, rfq.buyer.state, rfq.buyer.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Activity & Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Messages Count</Label>
              <div className="flex items-center gap-2 mt-1">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span className="text-sm">{rfq._count?.messages || 0} messages</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Chat Rooms</Label>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{rfq.chatRooms?.length || 0} active chats</span>
              </div>
            </div>
            {rfq.reviewedAt && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Last Reviewed</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{formatDate(rfq.reviewedAt)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rejection Reason (if applicable) */}
        {rfq.status === 'REJECTED' && rfq.rejectionReason && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <X className="w-5 h-5" />
                Rejection Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium text-red-700">Reason for Rejection</Label>
                <div className="mt-2 p-4 bg-red-100 rounded-lg">
                  <p className="text-sm leading-relaxed text-red-800">{rfq.rejectionReason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <DialogFooter className="gap-3 pt-6">
        <Button variant="outline" onClick={() => setShowViewModal(false)}>
          Close
        </Button>
        {rfq.status === 'PENDING' && (
          <>
            <Button
              onClick={() => {
                setShowViewModal(false);
                handleRejectClick(rfq);
              }}
              variant="destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Reject RFQ
            </Button>
            <Button
              onClick={() => {
                setShowViewModal(false);
                setSelectedRFQ(rfq);
                setShowForwardModal(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Forward to Sellers
            </Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  ));

  const ForwardConfirmModal = React.memo(() => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-600">
          <Send className="w-5 h-5" />
          Forward RFQ to Sellers
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to forward this RFQ to relevant sellers? This action will make the RFQ visible to sellers who can then submit quotes.
        </DialogDescription>
      </DialogHeader>

      {selectedRFQ && (
        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Product:</span>
              <span className="text-sm">{selectedRFQ.product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Quantity:</span>
              <span className="text-sm">{selectedRFQ.quantity.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Buyer:</span>
              <span className="text-sm">{selectedRFQ.buyer.email}</span>
            </div>
            {selectedRFQ.budget && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Budget:</span>
                <span className="text-sm font-semibold text-purple-600">{formatPrice(selectedRFQ.budget)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            setShowForwardModal(false);
            setSelectedRFQ(null);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (selectedRFQ) {
              forwardRFQ(selectedRFQ.id);
              setShowForwardModal(false);
              setSelectedRFQ(null);
            }
          }}
          disabled={processingAction === selectedRFQ?.id}
          className="bg-green-600 hover:bg-green-700"
        >
          {processingAction === selectedRFQ?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Send className="w-4 h-4 mr-2" />
          Forward RFQ
        </Button>
      </DialogFooter>
    </DialogContent>
  ));

  const RejectModal = React.memo(() => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-600">
          <X className="w-5 h-5" />
          Reject RFQ
        </DialogTitle>
        <DialogDescription>
          Please provide a clear reason for rejecting this RFQ request. This feedback will help the buyer understand your decision.
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
            <span>Be specific to help the buyer understand</span>
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
          onClick={() => selectedRFQ && rejectRFQ(selectedRFQ.id)}
          disabled={!rejectionReason.trim() || processingAction === selectedRFQ?.id}
        >
          {processingAction === selectedRFQ?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reject RFQ
        </Button>
      </DialogFooter>
    </DialogContent>
  ));

  const RFQRow = React.memo(({ rfq }: { rfq: RFQ }) => (
    <div className="flex items-center p-4 border-b border-border hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            <Package className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate" title={`${rfq.product.name}`}>{rfq.product.name}</div>
            <div className="text-sm text-muted-foreground truncate" title={`${rfq.buyer.firstName || ''} ${rfq.buyer.lastName || ''}`.trim() || rfq.buyer.email}>
              {`${rfq.buyer.firstName || ''} ${rfq.buyer.lastName || ''}`.trim() || rfq.buyer.email}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="w-3 h-3 text-green-600" />
            <span className="font-medium text-green-600" title={`${formatPrice(rfq.product.price)}`}>{formatPrice(rfq.product.price)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground" title={`Total Quantity: ${rfq.quantity.toLocaleString()} units`}>
            <Package className="w-3 h-3" />
            {rfq.quantity.toLocaleString()} units
          </div>
        </div>
      </div>

      <div className="flex-1 px-4" title={`Status: ${rfq.status}`}>
        {getStatusBadge(rfq.status)}
      </div>

      <div className="flex-1 px-4">
        <div className="space-y-1" title={`Budget: ${rfq.budget ? formatPrice(rfq.budget) : 'N/A'}`}>
          {rfq.budget && (
            <div className="flex items-center gap-1 text-sm">
              <CreditCard className="w-3 h-3 text-purple-600" />
              <span className="font-medium text-purple-600">{formatPrice(rfq.budget)}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(typeof rfq.createdAt === 'string' ? rfq.createdAt : rfq.createdAt.toISOString())}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewRFQ(rfq)}
          title='View RFQ Details'
        >
          <Eye className="w-4 h-4" />
        </Button>

        {rfq.status === 'PENDING' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedRFQ(rfq);
                setShowForwardModal(true);
              }}
              disabled={processingAction === rfq.id}
              className="text-green-600 hover:text-green-700"
              title='Forward RFQ'
            >
              {processingAction === rfq.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRejectClick(rfq)}
              disabled={processingAction === rfq.id}
              className="text-red-600 hover:text-red-700"
              title='Reject RFQ'
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  ));

  const TabContent = React.memo(({ data, type }: { data: RFQ[], type: string }) => {
    const filteredData = useMemo(() => getFilteredRFQs(data), [data, getFilteredRFQs]);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="capitalize">{type} RFQs</CardTitle>
              <CardDescription>Manage {type} RFQ requests</CardDescription>
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
                ref={searchInputRef}
                placeholder="Search RFQs..."
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
                <SelectItem value="approved">Forwarded</SelectItem>
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
                <div className="flex-1">Product & Buyer</div>
                <div className="flex-1 px-4">Price & Quantity</div>
                <div className="flex-1 px-4">Status</div>
                <div className="flex-1 px-4">Budget & Date</div>
                <div className="w-32 text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div>
              {filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Package className="w-12 h-12" />
                    <p>No {type} RFQs found</p>
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
                filteredData.map((rfq) => (
                  <RFQRow key={rfq.id} rfq={rfq} />
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
          <p className="text-muted-foreground">Loading RFQ data...</p>
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
          <span className="text-foreground">RFQ Management</span>
        </nav>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">RFQ Management</h1>
          <p className="text-muted-foreground mt-2">
            Review, approve, and manage Request for Quote (RFQ) submissions from buyers
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
            title="Forwarded RFQs"
            value={stats.approved}
            subtitle="Active with sellers"
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
            {/* all rfq  */}
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              All RFQs
              <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Review
              <Badge variant="secondary" className="ml-1">{stats.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Forwarded RFQs
              <Badge variant="secondary" className="ml-1">{stats.approved}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TabContent data={[...pendingRFQs, ...activeRFQs]} type="all" />
          </TabsContent>

          <TabsContent value="pending">
            <TabContent data={pendingRFQs} type="pending" />
          </TabsContent>

          <TabsContent value="approved">
            <TabContent data={activeRFQs} type="forwarded" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        {selectedRFQ && <RFQDetailModal rfq={selectedRFQ} />}
      </Dialog>

      <Dialog open={showForwardModal} onOpenChange={setShowForwardModal}>
        <ForwardConfirmModal />
      </Dialog>

      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <RejectModal />
      </Dialog>
    </div>
  );
};

export default RFQManagementDashboard;