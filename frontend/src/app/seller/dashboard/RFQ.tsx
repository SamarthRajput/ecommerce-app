import React, { useState, useMemo } from 'react';
import {
    Search,
    MessageSquare,
    User,
    Package,
    Calendar,
    DollarSign,
    Clock,
    Check,
    X,
    RefreshCw,
    Eye,
    MapPin,
    Phone,
    Mail,
    FileText,
    Truck,
    Shield,
    Tag,
    Globe,
    CreditCard,
    Percent,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellerDashboardRfq } from '@/lib/types/seller/sellerDashboard';
import { showInfo } from '@/lib/toast';

const RFQComponent = ({ rfqRequests }: { rfqRequests: SellerDashboardRfq[] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt-desc');
    const [selectedRFQ, setSelectedRFQ] = useState<SellerDashboardRfq | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = rfqRequests.length;
        const forwarded = rfqRequests.filter(rfq => rfq.status === 'FORWARDED').length;
        const totalBudget = rfqRequests.reduce((sum, rfq) => sum + (rfq.budget || 0), 0);

        return { total, forwarded, totalBudget };
    }, [rfqRequests]);

    // Filter and sort RFQs
    const filteredRFQs = useMemo(() => {
        let filtered = rfqRequests.filter(rfq => {
            const matchesSearch = rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rfq.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rfq.buyerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rfq.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rfq.buyer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rfq.buyer.lastName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        // Sort RFQs
        const [sortField, sortOrder] = sortBy.split('-');
        filtered.sort((a, b) => {
            let aValue, bValue;

            if (sortField === 'createdAt') {
                aValue = new Date(a.createdAt).getTime();
                bValue = new Date(b.createdAt).getTime();
            } else if (sortField === 'budget') {
                aValue = a.budget || 0;
                bValue = b.budget || 0;
            } else if (sortField === 'quantity') {
                aValue = a.quantity || 0;
                bValue = b.quantity || 0;
            } else {
                // fallback to createdAt if unknown field
                aValue = new Date(a.createdAt).getTime();
                bValue = new Date(b.createdAt).getTime();
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [rfqRequests, searchTerm, statusFilter, sortBy]);

    const handleViewDetails = (rfq: SellerDashboardRfq) => {
        setSelectedRFQ(rfq);
        setShowDetails(true);
    };

    const closeDetails = () => {
        setShowDetails(false);
        setSelectedRFQ(null);
    };

    const formatCurrency = (amount: number, currency?: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(Number(amount));
    };

    const handleAccept = (id: string) => {
        showInfo(`This API is not implemented yet`);
    };

    const handleReject = (id: string) => {
        showInfo(`This API is not implemented yet`);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header with Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">RFQ Requests</h1>
                    <p className="text-gray-600 mt-1">
                        Manage and respond to buyer requests for quotes
                    </p>
                    <div className="flex space-x-6 mt-3 text-sm text-gray-600">
                        <span>Total RFQs: <span className="font-semibold text-gray-900">{stats.total}</span></span>
                        <span>Forwarded: <span className="font-semibold text-blue-600">{stats.forwarded}</span></span>
                        <span>Total Budget: <span className="font-semibold text-green-600">{formatCurrency(stats.totalBudget, 'USD')}</span></span>
                    </div>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by RFQ ID, Product, Buyer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="FORWARDED">Forwarded</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                                <SelectItem value="budget-desc">Budget: High to Low</SelectItem>
                                <SelectItem value="budget-asc">Budget: Low to High</SelectItem>
                                <SelectItem value="quantity-desc">Quantity: High to Low</SelectItem>
                                <SelectItem value="quantity-asc">Quantity: Low to High</SelectItem>
                            </SelectContent>
                        </Select>

                        {(searchTerm || statusFilter !== 'all') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>

                    {(searchTerm || statusFilter !== 'all') && (
                        <div className="mt-3 text-sm text-gray-600">
                            Showing {filteredRFQs.length} of {rfqRequests.length} RFQs
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* RFQ List */}
            {filteredRFQs.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {rfqRequests.length === 0 ? 'No RFQ requests yet' : 'No RFQs match your filters'}
                        </h3>
                        <p className="text-gray-600">
                            {rfqRequests.length === 0
                                ? 'RFQ requests from buyers will appear here when they are interested in your products.'
                                : 'Try adjusting your search criteria or filters.'
                            }
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredRFQs.map((rfq: SellerDashboardRfq) => (
                        <Card key={rfq.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                RFQ #{rfq.id.slice(-8)}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(rfq.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                            <MessageSquare className="w-3 h-3 mr-1" />
                                            {rfq.status}
                                        </Badge>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewDetails(rfq)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>

                                {/* Product and Buyer Summary */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                                    {/* Product Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Package className="w-4 h-4 mr-2" />
                                            Product Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Name:</span> {rfq.product.name}</p>
                                            <p><span className="font-medium">Model:</span> {rfq.product.model}</p>
                                            <p><span className="font-medium">Category:</span> {rfq.product.category?.name}</p>
                                            <p><span className="font-medium">Price:</span> {formatCurrency(rfq.product.price, rfq.product.currency)}</p>
                                        </div>
                                    </div>

                                    {/* Buyer Info */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Buyer Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Name:</span> {rfq.buyer.firstName} {rfq.buyer.lastName}</p>
                                            <p><span className="font-medium">Email:</span> {rfq.buyer.email}</p>
                                            <p><span className="font-medium">Phone:</span> {rfq.buyer.phoneNumber}</p>
                                            <p><span className="font-medium">Location:</span> {rfq.buyer.city}, {rfq.buyer.country}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* RFQ Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Package className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Quantity</p>
                                            <p className="font-medium text-gray-900">{rfq.quantity.toLocaleString()} {rfq.unit}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Budget</p>
                                            <p className="font-medium text-gray-900">{rfq.budget ? formatCurrency(rfq.budget, rfq.currency) : 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Delivery Date</p>
                                            <p className="font-medium text-gray-900">{new Date(rfq.deliveryDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Payment Method</p>
                                            <p className="font-medium text-gray-900">{rfq.paymentMethod.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Terms */}
                                <div className="bg-green-50 rounded-lg p-3 mb-3">
                                    <p className="text-sm font-medium text-green-700 mb-2">Payment Terms:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-green-600">
                                        <span>Advance: {rfq.advancePaymentPercentage}%</span>
                                        <span>CAD: {rfq.cashAgainstDocumentsPercentage}%</span>
                                        <span>DAP: {rfq.documentsAgainstPaymentPercentage}%</span>
                                        <span>DAA: {rfq.documentsAgainstAcceptancePercentage}%</span>
                                    </div>
                                </div>

                                {/* Services Required */}
                                {rfq.servicesRequired && rfq.servicesRequired.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Services Required:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {rfq.servicesRequired.map((service, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {service}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Message Preview */}
                                {rfq.message && (
                                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Request Message:</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{rfq.message}</p>
                                    </div>
                                )}

                                {/* Special Requirements */}
                                {rfq.specialRequirements && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                                        <p className="text-sm font-medium text-yellow-700 mb-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Special Requirements:
                                        </p>
                                        <p className="text-sm text-yellow-600">{rfq.specialRequirements}</p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Created: {new Date(rfq.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Reviewed: {new Date(rfq.reviewedAt).toLocaleDateString()}
                                        </span>
                                        {rfq.requestChangeInDeliveryTerms && (
                                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                                                <Truck className="w-3 h-3 mr-1" />
                                                Delivery Terms Change Requested
                                            </Badge>
                                        )}
                                    </div>

                                    {rfq.status === 'FORWARDED' && (
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50"
                                                onClick={() => handleReject(rfq.id)}
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50"
                                                onClick={() => handleAccept(rfq.id)}
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                Accept
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Detailed Modal */}
            {showDetails && selectedRFQ && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-xl">RFQ Details - #{selectedRFQ.id}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={closeDetails}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* RFQ Overview */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            RFQ Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">RFQ ID</p>
                                            <p className="font-medium">{selectedRFQ.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <Badge className="bg-green-100 text-green-700">{selectedRFQ.status}</Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Quantity Requested</p>
                                            <p className="font-medium">{selectedRFQ.quantity.toLocaleString()} {selectedRFQ.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Budget</p>
                                            <p className="font-medium text-green-600">{selectedRFQ.budget ? formatCurrency(selectedRFQ.budget, selectedRFQ.currency) : 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Delivery Date</p>
                                            <p className="font-medium">{new Date(selectedRFQ.deliveryDate).toLocaleDateString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                                            <Package className="w-4 h-4 mr-2" />
                                            Product Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Product Name</p>
                                            <p className="font-medium">{selectedRFQ.product.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Model</p>
                                            <p className="font-medium">{selectedRFQ.product.model}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Category</p>
                                            <p className="font-medium">{selectedRFQ.product.category?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Price</p>
                                            <p className="font-medium text-green-600">{formatCurrency(selectedRFQ.product.price, selectedRFQ.product.currency)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Country of Origin</p>
                                            <p className="font-medium">{selectedRFQ.product.countryOfSource}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">HSN Code</p>
                                            <p className="font-medium">{selectedRFQ.product.hsnCode}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Buyer Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{selectedRFQ.buyer.firstName} {selectedRFQ.buyer.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Mail className="w-3 h-3 mr-1" />
                                                Email
                                            </p>
                                            <p className="font-medium">{selectedRFQ.buyer.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Phone className="w-3 h-3 mr-1" />
                                                Phone
                                            </p>
                                            <p className="font-medium">{selectedRFQ.buyer.phoneNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                Address
                                            </p>
                                            <p className="font-medium text-sm">{selectedRFQ.buyer.street}, {selectedRFQ.buyer.city}, {selectedRFQ.buyer.state} {selectedRFQ.buyer.zipCode}, {selectedRFQ.buyer.country}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Payment Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Payment & Financial Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Method</p>
                                            <p className="font-medium">{selectedRFQ.paymentMethod.replace('_', ' ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Currency</p>
                                            <p className="font-medium">{selectedRFQ.currency}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Percent className="w-3 h-3 mr-1" />
                                                Advance Payment
                                            </p>
                                            <p className="font-medium">{selectedRFQ.advancePaymentPercentage}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Cash Against Documents</p>
                                            <p className="font-medium">{selectedRFQ.cashAgainstDocumentsPercentage}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Documents Against Payment</p>
                                            <p className="font-medium">{selectedRFQ.documentsAgainstPaymentPercentage}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Documents Against Acceptance</p>
                                            <p className="font-medium">{selectedRFQ.documentsAgainstAcceptancePercentage}%</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-gray-500">Payment Terms</p>
                                            <p className="font-medium">{selectedRFQ.paymentTerms}</p>
                                        </div>
                                    </div>

                                    {selectedRFQ.letterOfCreditDescription && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm font-medium text-blue-700 mb-1">Letter of Credit Details:</p>
                                            <p className="text-sm text-blue-600">{selectedRFQ.letterOfCreditDescription}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Product Technical Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                        <Package className="w-5 h-5 mr-2" />
                                        Product Technical Specifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Product Code</p>
                                                <p className="font-medium">{selectedRFQ.product.productCode}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Specifications</p>
                                                <p className="font-medium">{selectedRFQ.product.specifications}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Condition</p>
                                                <p className="font-medium">{selectedRFQ.product.condition}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Warranty Period</p>
                                                <p className="font-medium">{selectedRFQ.product.warrantyPeriod}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Delivery Time</p>
                                                <p className="font-medium">{selectedRFQ.product.deliveryTimeInDays} days</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Industry</p>
                                                <p className="font-medium">{selectedRFQ.product.industry?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Minimum Order Quantity</p>
                                                <p className="font-medium">{selectedRFQ.product.minimumOrderQuantity.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Available Quantity</p>
                                                <p className="font-medium">{selectedRFQ.product.quantity.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Logistics Support</p>
                                                <p className="font-medium">{selectedRFQ.product.logisticsSupport}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Validity Period</p>
                                                <p className="font-medium">{selectedRFQ.product.validityPeriod} days</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Certifications and Licenses */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 flex items-center">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Certifications
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedRFQ.product.certifications.map((cert, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {cert}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 flex items-center">
                                                <FileText className="w-3 h-3 mr-1" />
                                                Licenses
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedRFQ.product.licenses.map((license, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {license}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags and Keywords */}
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2 flex items-center">
                                                <Tag className="w-3 h-3 mr-1" />
                                                Tags
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedRFQ.product.tags.map((tag, index) => (
                                                    <Badge key={index} className="text-xs bg-purple-100 text-purple-700">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">Keywords</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedRFQ.product.keywords.map((keyword, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {keyword}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Services and Requirements */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {selectedRFQ.servicesRequired && selectedRFQ.servicesRequired.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center">
                                                <Truck className="w-5 h-5 mr-2" />
                                                Services Required
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRFQ.servicesRequired.map((service, index) => (
                                                    <Badge key={index} className="bg-blue-100 text-blue-700">
                                                        {service}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center">
                                            <Globe className="w-5 h-5 mr-2" />
                                            Delivery & Terms
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Delivery Date Required</p>
                                            <p className="font-medium">{new Date(selectedRFQ.deliveryDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Change in Delivery Terms Requested</p>
                                            <Badge className={selectedRFQ.requestChangeInDeliveryTerms ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}>
                                                {selectedRFQ.requestChangeInDeliveryTerms ? "Yes" : "No"}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Messages and Notes */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        Communication
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {selectedRFQ.message && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Request Message:</p>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-600">{selectedRFQ.message}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedRFQ.specialRequirements && (
                                        <div>
                                            <p className="text-sm font-medium text-yellow-700 mb-2 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                Special Requirements:
                                            </p>
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <p className="text-sm text-yellow-700">{selectedRFQ.specialRequirements}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedRFQ.additionalNotes && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Additional Notes:</p>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <p className="text-sm text-blue-700">{selectedRFQ.additionalNotes}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                        <Clock className="w-5 h-5 mr-2" />
                                        Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Created</p>
                                            <p className="font-medium">{new Date(selectedRFQ.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Last Updated</p>
                                            <p className="font-medium">{new Date(selectedRFQ.updatedAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Reviewed At</p>
                                            <p className="font-medium">{new Date(selectedRFQ.reviewedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            {selectedRFQ.status === 'FORWARDED' && (
                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50"
                                        onClick={() => handleReject(selectedRFQ.id)}>
                                        <X className="w-4 h-4 mr-2" />
                                        Reject RFQ
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleAccept(selectedRFQ.id)}>
                                        <Check className="w-4 h-4 mr-2" />
                                        Accept RFQ
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default RFQComponent;