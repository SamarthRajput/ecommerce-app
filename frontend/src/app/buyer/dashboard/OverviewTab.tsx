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
import { Package, ShoppingCart, History, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RFQ {
  id: string;
  product: {
    name: string;
  };
  quantity: number;
  message: string; // Contains the JSON string with RFQ details
  status: string;
  createdAt: string;
  trade?: {
    name: string;
  };
}

interface RFQDetails {
  deliveryDate: string;
  budget: number;
  currency: string;
  paymentTerms: string;
  specialRequirements: string;
  additionalNotes: string;
}

interface OverviewTabProps {
  buyerId?: string;
}

export const OverviewTab = ({ buyerId }: OverviewTabProps) => {
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
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${BASE_URL}/rfq/buyer/${buyerId}`, {
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

  const parseRFQDetails = (message: string): RFQDetails => {
    try {
      const parsed = JSON.parse(message);
      // Ensure all required properties exist with fallback values
      return {
        deliveryDate: parsed?.deliveryDate || "",
        budget: parsed?.budget || 0,
        currency: parsed?.currency || "USD",
        paymentTerms: parsed?.paymentTerms || "",
        specialRequirements: parsed?.specialRequirements || "",
        additionalNotes: parsed?.additionalNotes || ""
      };
    } catch (error) {
      // Return a complete RFQDetails object with default values
      return {
        deliveryDate: "",
        budget: 0,
        currency: "USD",
        paymentTerms: "",
        specialRequirements: "",
        additionalNotes: ""
      };
    }
  };

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
                {rfqs.filter((rfq) => rfq.trade !== null).length}
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
                    <TableHead>Budget</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfqs.length > 0 ? (
                    rfqs.map((rfq) => {
                      const details = parseRFQDetails(rfq.message);
                      return (
                        <TableRow key={rfq.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">{rfq.product.name}</TableCell>
                          <TableCell>{rfq.quantity}</TableCell>
                          <TableCell>
                            {details.currency} {details.budget?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell>
                            {details.deliveryDate ? formatDate(details.deliveryDate) : "-"}
                          </TableCell>
                          <TableCell>{details.paymentTerms || "-"}</TableCell>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>RFQ Details</DialogTitle>
            </DialogHeader>
            
            {selectedRFQ && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">RFQ ID</h3>
                    <p className="text-sm">{selectedRFQ.id}</p>
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
                    <p className="text-sm">{selectedRFQ.quantity}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 mb-2">Created On</h3>
                    <p className="text-sm">{formatDate(selectedRFQ.createdAt)}</p>
                  </div>
                  {selectedRFQ.trade && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500 mb-2">Trade Name</h3>
                      <p className="text-sm">{selectedRFQ.trade.name}</p>
                    </div>
                  )}
                </div>

                {/* RFQ Details */}
                {(() => {
                  const details = parseRFQDetails(selectedRFQ.message);
                  return (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Request Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-500 mb-2">Budget</h4>
                          <p className="text-sm font-medium">
                            {formatCurrency(details.budget || 0, details.currency || "USD")}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-500 mb-2">Delivery Date</h4>
                          <p className="text-sm">
                            {details.deliveryDate ? formatDate(details.deliveryDate) : "Not specified"}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-sm text-gray-500 mb-2">Payment Terms</h4>
                          <p className="text-sm">
                            {details.paymentTerms || "Not specified"}
                          </p>
                        </div>
                      </div>

                      {details.specialRequirements && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-500 mb-2">Special Requirements</h4>
                          <p className="text-sm bg-gray-50 p-3 rounded-lg">
                            {details.specialRequirements}
                          </p>
                        </div>
                      )}

                      {details.additionalNotes && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-500 mb-2">Additional Notes</h4>
                          <p className="text-sm bg-gray-50 p-3 rounded-lg">
                            {details.additionalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <div className="flex gap-2">
                <Button variant="outline">Edit RFQ</Button>
                <Button>Contact Suppliers</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};