import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Package, ShoppingCart, Star, History, Trash2, FileText } from "lucide-react";
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
  buyerId: string;
}

export const OverviewTab = ({ buyerId }: OverviewTabProps) => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buyerId) {
      setLoading(false);
      return;
    }

    const fetchRFQs = async () => {
      try {
        const token = localStorage.getItem('buyerToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${BASE_URL}/rfq/buyer/${buyerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch RFQs');
        }

        const data = await response.json();
        setRfqs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRFQs();
  }, [buyerId]);

  // Parse the message JSON string into RFQDetails
  const parseRFQDetails = (message: string): RFQDetails => {
    try {
      return JSON.parse(message);
    } catch (error) {
      return {
        deliveryDate: '',
        budget: 0,
        currency: 'USD',
        paymentTerms: '',
        specialRequirements: '',
        additionalNotes: ''
      };
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading RFQs...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
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
                {rfqs.filter(rfq => rfq.status === 'PENDING').length}
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
                {rfqs.filter(rfq => rfq.status === 'COMPLETED').length}
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
                {rfqs.filter(rfq => rfq.trade !== null).length}
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
                        <TableCell className="font-medium">{rfq.product.name}</TableCell>
                        <TableCell>{rfq.quantity}</TableCell>
                        <TableCell>
                          {details.currency} {details.budget.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {details.deliveryDate ? formatDate(details.deliveryDate) : '-'}
                        </TableCell>
                        <TableCell>
                          {details.paymentTerms || '-'}
                        </TableCell>
                        <TableCell>{formatDate(rfq.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            rfq.status === 'COMPLETED' ? 'default' : 
                            rfq.status === 'PENDING' ? 'secondary' : 'outline'
                          }>
                            {rfq.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View All RFQs</Button>
            <Button asChild>
              <Link href={'/dashboard'}>Create New RFQ</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};