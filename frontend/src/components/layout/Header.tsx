"use client";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  const handleBuyerLogin = () => router.push('/buyer/signin');
  const handleSellerLogin = () => router.push('/seller/signin');
  const handleAbout = () => router.push('/about');
  const handleContact = () => router.push('/contact');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center hover:cursor-pointer" onClick={() => router.push('/')}>
            <div className="text-2xl font-bold text-gray-900">
              <span className="text-orange-600">Trade</span>Connect
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-orange-600 transition-colors">
              How It Works
            </a>
            <button
              onClick={handleAbout}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              About
            </button>
            <button
              onClick={handleContact}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleBuyerLogin}
              variant="outline"
              className="hidden sm:flex border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              👤 Buyer Login
            </Button>
            <Button
              onClick={handleSellerLogin}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              🧑‍💼 Seller Login
            </Button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 