import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
import { Search, ShoppingCart, User, Bell, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      {/* Top Bar */}
      {/* <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <Link href="/about" className="hover:text-gray-300">About Us</Link>
              <Link href="/contact" className="hover:text-gray-300">Contact</Link>
              <Link href="/help" className="hover:text-gray-300">Help Center</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/track-order" className="hover:text-gray-300">Track Order</Link>
              <Link href="/shipping" className="hover:text-gray-300">Shipping Info</Link>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MarketPlace
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for products, brands and more..."
                className="w-full pl-10 pr-4 py-2 rounded-full"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {/* Seller Portal */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>Seller Portal</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/seller/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/seller/listings">My Listings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/seller/create-listing">Create Listing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/seller/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/seller/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Buyer Portal */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>Buyer Portal</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/buyer/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/buyer/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/buyer/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/buyer/signin">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/categories">Categories</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/deals">Deals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/new-arrivals">New Arrivals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/brands">Brands</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex items-center space-x-8 py-3 text-sm">
            <Link href="/categories/electronics" className="hover:text-blue-600">Electronics</Link>
            <Link href="/categories/fashion" className="hover:text-blue-600">Fashion</Link>
            <Link href="/categories/home" className="hover:text-blue-600">Home & Living</Link>
            <Link href="/categories/beauty" className="hover:text-blue-600">Beauty</Link>
            <Link href="/categories/sports" className="hover:text-blue-600">Sports</Link>
            <Link href="/categories/books" className="hover:text-blue-600">Books</Link>
            <Link href="/categories/toys" className="hover:text-blue-600">Toys</Link>
            <Link href="/deals" className="text-red-600 font-medium">Deals of the Day</Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 