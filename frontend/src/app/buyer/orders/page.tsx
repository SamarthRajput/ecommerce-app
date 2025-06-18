import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";

const OrdersDashboard = () => {
  // Dummy data for orders
  const orders = [
    {
      id: "ORD-78945",
      date: "2025-06-15",
      items: [
        { name: "iPhone 15 Pro Max", price: 1099, quantity: 1, status: "Shipped" },
        { name: "Apple AirPods Pro", price: 249, quantity: 1, status: "Shipped" }
      ],
      total: 1348,
      status: "Shipped",
      tracking: "UPS-789456123"
    },
    {
      id: "ORD-78231",
      date: "2025-06-10",
      items: [
        { name: "MacBook Air M2", price: 999, quantity: 1, status: "Delivered" },
        { name: "USB-C Adapter", price: 29, quantity: 2, status: "Delivered" }
      ],
      total: 1057,
      status: "Delivered",
      tracking: "FEDEX-456123789"
    },
    {
      id: "ORD-77128",
      date: "2025-05-28",
      items: [
        { name: "Apple Watch Series 9", price: 399, quantity: 1, status: "Processing" }
      ],
      total: 399,
      status: "Processing",
      tracking: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipped":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
      case "delivered":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <div className="text-sm text-gray-500">Welcome back, Alex</div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Awaiting Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.status === "Shipped").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${orders.reduce((sum, order) => sum + order.total, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your recent purchase history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-sm">
                            {item.quantity} × {item.name}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                        {order.tracking && (
                          <Button variant="outline" size="sm">
                            Track
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrdersDashboard;