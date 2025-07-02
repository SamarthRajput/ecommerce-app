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
    CheckCircle,
    XCircle,
    Filter,
    SortAsc
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RFQ {
    id: string;
    productId: string;
    buyerId: string;
    quantity: number;
    message?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    rejectionReason?: string;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface ParsedMessage {
    deliveryDate?: string;
    budget?: number;
    currency?: string;
    paymentTerms?: string;
    specialRequirements?: string;
    additionalNotes?: string;
    [key: string]: any;
}

const parseMessage = (message?: string): ParsedMessage | string | null => {
    if (!message) return null;
    try {
        return JSON.parse(message);
    } catch {
        return message;
    }
};

const STATUS_CONFIG = {
    PENDING: {
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: Clock,
        label: 'Pending Review',
        bgColor: 'bg-yellow-50'
    },
    ACCEPTED: {
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle,
        label: 'Accepted',
        bgColor: 'bg-green-50'
    },
    REJECTED: {
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle,
        label: 'Rejected',
        bgColor: 'bg-red-50'
    }
};

const RFQComponent = ({ rfqRequests }: { rfqRequests: RFQ[] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt-desc');
    const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = rfqRequests.length;
        const pending = rfqRequests.filter(rfq => rfq.status === 'PENDING').length;
        const accepted = rfqRequests.filter(rfq => rfq.status === 'ACCEPTED').length;
        const rejected = rfqRequests.filter(rfq => rfq.status === 'REJECTED').length;
        const responseRate = total > 0 ? Math.round(((accepted + rejected) / total) * 100) : 0;

        return { total, pending, accepted, rejected, responseRate };
    }, [rfqRequests]);

    // Filter and sort RFQs
    const filteredRFQs = useMemo(() => {
        let filtered = rfqRequests.filter(rfq => {
            const matchesSearch = rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rfq.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rfq.buyerId.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        // Sort RFQs
        const [sortField, sortOrder] = sortBy.split('-');
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            if (sortField === 'createdAt') {
                aValue = new Date(a.createdAt).getTime();
                bValue = new Date(b.createdAt).getTime();
            } else {
                aValue = a[sortField as keyof RFQ];
                bValue = b[sortField as keyof RFQ];
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [rfqRequests, searchTerm, statusFilter, sortBy]);

    const handleViewDetails = (rfq: RFQ) => {
        setSelectedRFQ(rfq);
        setShowDetails(true);
    };

    const closeDetails = () => {
        setShowDetails(false);
        setSelectedRFQ(null);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">RFQ Requests</h1>
                    <p className="text-gray-600 mt-1">
                        Manage and respond to buyer requests for quotes
                    </p>
                </div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-600">Total RFQs</p>
                                <p className="text-xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600">Accepted</p>
                                <p className="text-xl font-bold text-green-600">{stats.accepted}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="text-sm text-gray-600">Rejected</p>
                                <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-gray-600">Response Rate</p>
                                <p className="text-xl font-bold text-purple-600">{stats.responseRate}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by RFQ ID, Product ID, or Buyer ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                                <SelectItem value="status-asc">Status</SelectItem>
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
                    {filteredRFQs.map((rfq) => {
                        const statusConfig = STATUS_CONFIG[rfq.status];
                        const StatusIcon = statusConfig.icon;
                        const parsedMessage = parseMessage(rfq.message);

                        return (
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
                                            <Badge className={statusConfig.color}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {statusConfig.label}
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

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Package className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Product ID</p>
                                                <p className="font-medium text-gray-900">{rfq.productId}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Buyer ID</p>
                                                <p className="font-medium text-gray-900">{rfq.buyerId}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Quantity</p>
                                                <p className="font-medium text-gray-900">{rfq.quantity.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Preview */}
                                    {rfq.message && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Request Details:</p>
                                            {typeof parsedMessage === 'object' && parsedMessage ? (
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    {parsedMessage.deliveryDate && (
                                                        <p><span className="font-medium">Delivery:</span> {parsedMessage.deliveryDate}</p>
                                                    )}
                                                    {parsedMessage.budget && (
                                                        <p><span className="font-medium">Budget:</span> {parsedMessage.budget} {parsedMessage.currency || ''}</p>
                                                    )}
                                                    {parsedMessage.paymentTerms && (
                                                        <p><span className="font-medium">Payment:</span> {parsedMessage.paymentTerms}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-600 line-clamp-2">{rfq.message}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Rejection Reason */}
                                    {rfq.rejectionReason && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                            <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason:</p>
                                            <p className="text-sm text-red-600">{rfq.rejectionReason}</p>
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
                                                Updated: {new Date(rfq.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {rfq.status === 'PENDING' && (
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Accept
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                                    <X className="w-4 h-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Detail Modal */}
            {showDetails && selectedRFQ && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>RFQ Details - #{selectedRFQ.id}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={closeDetails}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Request Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">RFQ ID</p>
                                            <p className="font-medium">{selectedRFQ.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Product ID</p>
                                            <p className="font-medium">{selectedRFQ.productId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Buyer ID</p>
                                            <p className="font-medium">{selectedRFQ.buyerId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Quantity</p>
                                            <p className="font-medium">{selectedRFQ.quantity.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <Badge className={STATUS_CONFIG[selectedRFQ.status].color}>
                                                {STATUS_CONFIG[selectedRFQ.status].label}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Created</p>
                                            <p className="font-medium">{new Date(selectedRFQ.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Last Updated</p>
                                            <p className="font-medium">{new Date(selectedRFQ.updatedAt).toLocaleString()}</p>
                                        </div>
                                        {selectedRFQ.reviewedAt && (
                                            <div>
                                                <p className="text-sm text-gray-500">Reviewed</p>
                                                <p className="font-medium">{new Date(selectedRFQ.reviewedAt).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Message */}
                            {selectedRFQ.message && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Request Details</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        {(() => {
                                            const parsedMessage = parseMessage(selectedRFQ.message);
                                            if (typeof parsedMessage === 'object' && parsedMessage) {
                                                return (
                                                    <div className="space-y-3">
                                                        {Object.entries(parsedMessage).map(([key, value]) => (
                                                            <div key={key}>
                                                                <p className="text-sm font-medium text-gray-700 capitalize">
                                                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                                </p>
                                                                <p className="text-gray-900">{value || '-'}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            } else {
                                                return <p className="text-gray-900">{selectedRFQ.message}</p>;
                                            }
                                        })()}
                                    </div>
                                </div>
                            )}

                            {/* Rejection Reason */}
                            {selectedRFQ.rejectionReason && (
                                <div>
                                    <h4 className="font-semibold text-red-700 mb-3">Rejection Reason</h4>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-700">{selectedRFQ.rejectionReason}</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            {selectedRFQ.status === 'PENDING' && (
                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                        <X className="w-4 h-4 mr-2" />
                                        Reject RFQ
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700">
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