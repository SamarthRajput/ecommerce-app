import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/src/components/ui/table";
import { Heart, ShoppingCart, Trash2, ChevronRight } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";

const WishlistPage = () => {
  // Dummy wishlist data
  const wishlistItems = [
    {
      id: "WL-001",
      name: "iPhone 15 Pro Max",
      price: 1099,
      image: "/placeholder-phone.jpg",
      addedDate: "2025-06-15",
      status: "in-stock",
      inCart: false
    },
    {
      id: "WL-002",
      name: "MacBook Air M2",
      price: 999,
      image: "/placeholder-laptop.jpg",
      addedDate: "2025-06-10",
      status: "in-stock",
      inCart: true
    },
    {
      id: "WL-003",
      name: "Sony WH-1000XM5 Headphones",
      price: 399,
      image: "/placeholder-headphones.jpg",
      addedDate: "2025-05-28",
      status: "out-of-stock",
      inCart: false
    }
  ];

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>;
      case "out-of-stock":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Out of Stock</Badge>;
      case "on-sale":
        return <Badge className="bg-red-500 hover:bg-red-600">On Sale</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>
          <div className="text-sm text-gray-500">
            {wishlistItems.length} items
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wishlistItems.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {wishlistItems.filter(item => item.status === "in-stock").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Wishlist Items</CardTitle>
                    <CardDescription>Your saved products</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Search wishlist..." className="w-48" />
                    <Button variant="outline">Sort by <ChevronRight className="ml-1 h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wishlistItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 overflow-hidden rounded-md border">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.addedDate}</TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            variant={item.inCart ? "secondary" : "default"}
                            size="sm"
                            disabled={item.status !== "in-stock"}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {item.inCart ? "In Cart" : "Add to Cart"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Continue Shopping</Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  <Button>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WishlistPage;