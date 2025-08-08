"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Package, Users, Star, Globe, Shield, MessageSquare, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const router = useRouter();
  const { authenticated, role, isAdmin, authLoading, isBuyer, isSeller } = useAuth();
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if(!consentGiven){
      setShowCookieBanner(true);
    }
  }, []);


  // Auto-redirect authenticated users immediately
  useEffect(() => {
    if (!authLoading && authenticated) {
      if (isAdmin) {
        router.replace('/admin');
      } else if (isSeller) {
        router.replace('/seller/dashboard');
      } else if (isBuyer) {
        router.replace('/products');
      }
    }
  }, [authLoading, authenticated, isAdmin, isBuyer, isSeller, router]);


  const handleAcceptCookies = () => {
    // set cookie that will accessible across multiple subdomains
    document.cookie = `cookieConsent=true; path=/; SameSite=None; Secure`;

    // also store in localStorage for easy client side access
    localStorage.setItem('cookieConsent', 'true');
    
    // this will allow third party cookies for cross origin requests
    if(navigator.cookieEnabled){
      document.cookie = `thirdPartyCookiesAllowed=true; path=/; SameSite=None; Secure`;
    }
    setShowCookieBanner(false);
  }

  const goToBuyerSignin = () => router.push('/buyer/signin');
  const goToSellerSignin = () => router.push('/seller/signin');

  // Show loading only during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold text-gray-900">
            <span className="text-orange-600">Inter</span>Link
          </div>
          <div className="w-8 h-8 border-3 border-gray-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, do not render the homepage content
  if (authenticated) {
    return null;
  }

  // Simplified data structures 
  const features = [
    { icon: Shield, title: 'Verified Communication', description: 'Secure admin-moderated buyer-seller interactions' },
    { icon: Package, title: 'Smart Product Management', description: 'Advanced listing tools with analytics' },
    { icon: MessageSquare, title: 'Intelligent RFQ System', description: 'AI-powered matching and negotiation tools' }
  ];

  const stats = [
    { value: '2,500+', label: 'Verified Sellers', icon: Users },
    { value: '5,000+', label: 'Active Buyers', icon: Users },
    { value: '99.2%', label: 'Success Rate', icon: Star },
    { value: '50+', label: 'Countries', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold text-gray-900">We use cookies</h2>
              <p className="text-gray-600">
                Cookies help us deliver the best experience on our website. By using our website, you agree to the use of cookies.
              </p>
            </div>
            <Button
              onClick={handleAcceptCookies}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white"
            >
              ACCEPT
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-orange-600">Inter</span>
              <span className="text-purple-600">Link</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              The premier B2B marketplace connecting verified buyers and sellers through intelligent RFQ management
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={goToBuyerSignin}
                size="lg"
                className="px-8 py-4 text-lg bg-orange-600 hover:bg-orange-700 transition-all duration-300 shadow-lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Start as Buyer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                onClick={goToSellerSignin}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2 hover:bg-gray-50 transition-all duration-300"
              >
                <Package className="w-5 h-5 mr-2" />
                Start as Seller
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {/* Stats Section */}
        <section className="py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose InterLink?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your B2B trading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex p-4 rounded-2xl bg-gray-50 mb-4">
                      <Icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to start your B2B trading journey</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Buyers */}
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-orange-100 rounded-full mb-4">
                  <Users className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-orange-700">For Buyers</h3>
                <p className="text-orange-600 mt-2">Find the right suppliers</p>
              </div>
              <div className="space-y-4">
                {['Register & Get Verified', 'Browse Products', 'Send RFQ', 'Get Connected', 'Close Deals'].map((step, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{step}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sellers */}
            <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <Package className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Sellers</h3>
                <p className="text-gray-600 mt-2">Grow your business</p>
              </div>
              <div className="space-y-4">
                {['Create Account', 'List Products', 'Get Approved', 'Receive RFQs', 'Grow Business'].map((step, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses already trading on InterLink
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={goToBuyerSignin}
                size="lg"
                className="px-8 py-4 text-lg bg-orange-600 hover:bg-orange-700"
              >
                <Users className="w-5 h-5 mr-2" />
                Start as Buyer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={goToSellerSignin}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Package className="w-5 h-5 mr-2" />
                Start as Seller
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;