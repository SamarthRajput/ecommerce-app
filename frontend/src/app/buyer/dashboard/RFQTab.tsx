import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Package, ShoppingCart, History, FileText, CreditCard, Truck, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APIURL } from "@/src/config/env";

interface RFQ {
  id: string;
  product: {
    name: string;
  };
  quantity: number;
  unit?: string;
  currency?: string;
  deliveryDate?: string | null;
  paymentTerms?: string;
  
  // New payment breakdown fields
  advancePaymentPercentage?: number;
  cashAgainstDocumentsPercentage?: number;
  documentsAgainstPaymentPercentage?: number;
  documentsAgainstAcceptancePercentage?: number;
  paymentMethod?: 'TT' | 'LC';
  letterOfCreditDescription?: string;
  
  specialRequirements?: string;
  requestChangeInDeliveryTerms?: boolean;
  servicesRequired?: string[];
  additionalNotes?: string;
  message?: string;
  status: string;
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  trade?: {
    name: string;
  };
}

interface OverviewTabProps {
  buyerId?: string;
}

export const RFQTab = ({ buyerId }: OverviewTabProps) => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (!buyerId) {
      setLoading(false);
      return;
    }

    const fetchRFQs = async () => {
      try {
        const response = await fetch(`${APIURL}/rfq/buyer/${buyerId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch RFQs");
        }

        const data = await response.json();
        setRfqs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRFQs();
  }, [buyerId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleViewDetails = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setIsDetailsOpen(true);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const getPaymentMethodBadge = (method?: string) => {
    if (!method) return null;
    return (
      <Badge variant={method === 'LC' ? 'default' : 'secondary'}>
        {method === 'TT' ? 'Telegraphic Transfer' : 'Letter of Credit'}
      </Badge>
    );
  };

  if (loading) {
    return <div className="w-full max-w-screen-xl mx-auto px-4 py-8">Loading RFQs...</div>;
  }

  if (error) {
    return <div className="w-full max-w-screen-xl mx-auto px-4 py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8 overflow-x-hidden">
      <div className="flex flex-col gap-6 w-full">

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 w-full">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total RFQs</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rfqs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending RFQs</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rfqs.filter((rfq) => rfq.status === "PENDING").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed RFQs</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rfqs.filter((rfq) => rfq.status === "COMPLETED").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
              <History className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rfqs.filter((rfq) => rfq.status === "FORWARDED").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RFQs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent RFQs</CardTitle>
            <CardDescription>Your recent requests for quotations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfqs.length > 0 ? (
                    rfqs.map((rfq) => {
                      return (
                        <TableRow key={rfq.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">{rfq.product.name}</TableCell>
                          <TableCell>
                            {rfq.quantity} {rfq.unit && <span className="text-gray-500">({rfq.unit})</span>}
                          </TableCell>
                          <TableCell>
                            {rfq.deliveryDate ? formatDate(rfq.deliveryDate) : "-"}
                          </TableCell>
                          <TableCell>
                            {getPaymentMethodBadge(rfq.paymentMethod) || <span className="text-gray-500">-</span>}
                          </TableCell>
                          <TableCell>{formatDate(rfq.createdAt)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                rfq.status === "COMPLETED"
                                  ? "default"
                                  : rfq.status === "PENDING"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {rfq.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(rfq)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No RFQs found. Create your first RFQ to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View All RFQs</Button>
            <Button asChild>
              <Link href={"/products"}>Create New RFQ</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* RFQ Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>RFQ Details</DialogTitle>
            </DialogHeader>
            
            {selectedRFQ && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">RFQ ID</h3>
                    <p className="text-sm font-mono">{selectedRFQ.id}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">Status</h3>
                    <Badge
                      variant={
                        selectedRFQ.status === "COMPLETED"
                          ? "default"
                          : selectedRFQ.status === "PENDING"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {selectedRFQ.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">Product</h3>
                    <p className="text-sm font-medium">{selectedRFQ.product.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">Quantity</h3>
                    <p className="text-sm">
                      {selectedRFQ.quantity} {selectedRFQ.unit && <span className="text-gray-500">({selectedRFQ.unit})</span>}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">Created On</h3>
                    <p className="text-sm">{formatDate(selectedRFQ.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">Last Updated</h3>
                    <p className="text-sm">{formatDate(selectedRFQ.updatedAt)}</p>
                  </div>
                  {selectedRFQ.trade && (
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-sm text-gray-500 mb-2">Associated Trade</h3>
                      <p className="text-sm font-medium">{selectedRFQ.trade.name}</p>
                    </div>
                  )}
                </div>

                {/* Financial Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Financial Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">Payment Method</h4>
                      <div className="flex gap-2">
                        {getPaymentMethodBadge(selectedRFQ.paymentMethod) || <span className="text-sm text-gray-500">Not specified</span>}
                      </div>
                    </div>
                  </div>

                  {/* Payment Terms Breakdown */}
                  {(selectedRFQ.advancePaymentPercentage || selectedRFQ.cashAgainstDocumentsPercentage || 
                    selectedRFQ.documentsAgainstPaymentPercentage || selectedRFQ.documentsAgainstAcceptancePercentage) && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-3">Payment Terms Breakdown</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedRFQ.advancePaymentPercentage && (
                          <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 mb-1">Advance Payment</p>
                            <p className="text-lg font-semibold text-blue-600">{selectedRFQ.advancePaymentPercentage}%</p>
                          </div>
                        )}
                        {selectedRFQ.cashAgainstDocumentsPercentage && (
                          <div className="bg-green-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 mb-1">Cash Against Documents</p>
                            <p className="text-lg font-semibold text-green-600">{selectedRFQ.cashAgainstDocumentsPercentage}%</p>
                          </div>
                        )}
                        {selectedRFQ.documentsAgainstPaymentPercentage && (
                          <div className="bg-orange-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 mb-1">Documents Against Payment</p>
                            <p className="text-lg font-semibold text-orange-600">{selectedRFQ.documentsAgainstPaymentPercentage}%</p>
                          </div>
                        )}
                        {selectedRFQ.documentsAgainstAcceptancePercentage && (
                          <div className="bg-purple-50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 mb-1">Documents Against Acceptance</p>
                            <p className="text-lg font-semibold text-purple-600">{selectedRFQ.documentsAgainstAcceptancePercentage}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Letter of Credit Description */}
                  {selectedRFQ.letterOfCreditDescription && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">Letter of Credit Details</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {selectedRFQ.letterOfCreditDescription}
                      </p>
                    </div>
                  )}

                  {/* Generic Payment Terms */}
                  {selectedRFQ.paymentTerms && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">Additional Payment Terms</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">
                        {selectedRFQ.paymentTerms}
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery & Logistics Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery & Logistics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">Delivery Date</h4>
                      <p className="text-sm">
                        {selectedRFQ.deliveryDate ? formatDate(selectedRFQ.deliveryDate) : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">Delivery Terms Change Requested</h4>
                      <Badge variant={selectedRFQ.requestChangeInDeliveryTerms ? "destructive" : "secondary"}>
                        {selectedRFQ.requestChangeInDeliveryTerms ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Services & Requirements */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Requirements & Services
                  </h3>

                  {/* Services Required */}
                  {selectedRFQ.servicesRequired && selectedRFQ.servicesRequired.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">Services Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRFQ.servicesRequired.map((service, index) => (
                          <Badge key={index} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Requirements */}
                  {selectedRFQ.specialRequirements && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">Special Requirements</h4>
                      <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        {selectedRFQ.specialRequirements}
                      </p>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {selectedRFQ.additionalNotes && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">Additional Notes</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">
                        {selectedRFQ.additionalNotes}
                      </p>
                    </div>
                  )}

                  {/* Message */}
                  {selectedRFQ.message && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-2">Message</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {selectedRFQ.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Review Information */}
                {(selectedRFQ.reviewedAt || selectedRFQ.rejectionReason) && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Review Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRFQ.reviewedAt && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-500 mb-2">Reviewed On</h4>
                          <p className="text-sm">{formatDate(selectedRFQ.reviewedAt)}</p>
                        </div>
                      )}
                    </div>

                    {selectedRFQ.rejectionReason && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-500 mb-2">Rejection Reason</h4>
                        <p className="text-sm bg-red-50 p-3 rounded-lg border border-red-200 text-red-800">
                          {selectedRFQ.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              {/* Uncomment when edit functionality is ready
              <div className="flex gap-2">
                <Button variant="outline">Edit RFQ</Button>
                <Button>Contact Suppliers</Button>
              </div> */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};