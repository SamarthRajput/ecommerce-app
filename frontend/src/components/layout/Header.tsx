"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, Package, MessageSquare, FileText, Plus, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { authenticated, role, user, isSeller, authLoading, isBuyer, logout, refetch } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Navigation items for different user types (now for dropdown only)
  const getNavigationItems = () => {
    if (isBuyer) {
      return [
        { href: "/buyer/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/buyer/requests", label: "My Requests", icon: FileText },
        { href: "/buyer/chat", label: "Messages", icon: MessageSquare },
      ];
    }

    if (isSeller) {
      return [
        { href: "/seller/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/seller/dashboard?tab=listings", label: "My Listings", icon: Package },
        { href: "/seller/create-listing", label: "Create Listing", icon: Plus },
        { href: "/seller/dashboard?tab=orders", label: "Orders", icon: FileText },
        { href: "/seller/dashboard?tab=chat", label: "Messages", icon: MessageSquare },
      ];
    }

    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center hover:cursor-pointer flex-shrink-0"
            onClick={() => router.push('/')}
          >
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              <span className="text-orange-600">Trade</span>Connect
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {authenticated ? (
              <>
                {/* Notifications */}
                {/* <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button> */}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3">
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline text-sm font-medium">
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                      </span>
                      <span className="hidden md:inline text-xs text-gray-500 capitalize">
                        ({role})
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm text-gray-700">
                      <div className="font-medium">{user?.name || 'User'}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <DropdownMenuSeparator />

                    {/* Role-specific Navigation Items */}
                    {navigationItems.length > 0 && (
                      <>
                        {navigationItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <DropdownMenuItem key={item.label} asChild>
                              <Link
                                href={item.href}
                                className={`flex items-center gap-2 ${pathname === item.href ? "bg-orange-50 text-orange-600" : ""
                                  }`}
                              >
                                <Icon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem asChild>
                      <Link href={`/${role}/settings`} className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Sign In Buttons */}
                <div className="hidden sm:flex items-center space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/buyer/signin">Buyer</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/seller/signin">Seller</Link>
                  </Button>
                </div>

                {/* Mobile Sign In Dropdown */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/buyer/signin">Sign In as Buyer</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/signin">Sign In as Seller</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}

            {/* Mobile Menu Button - Always show for public navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}