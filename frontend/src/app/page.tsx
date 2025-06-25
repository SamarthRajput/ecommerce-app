"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent } from '../../components/ui/card';

const HomePage = () => {
  const router = useRouter();

  const handleBuyerLogin = () => router.push('/buyer/signin');
  const handleSellerLogin = () => router.push('/seller/signin');

  const features = [
    {
      icon: '🔒',
      title: 'Verified Communication',
      description: 'Admin-moderated buyer-seller communication ensures security and trust.'
    },
    {
      icon: '📦',
      title: 'Easy Product Listing',
      description: 'Sellers can upload and track products with comprehensive analytics.'
    },
    {
      icon: '📊',
      title: 'Smart RFQ System',
      description: 'Buyers can raise RFQs and negotiate seamlessly through integrated chat.'
    }
  ];

  const buyerSteps = [
    'Login/Register as Buyer',
    'Browse products by category',
    'Click product → Send RFQ',
    'Admin verifies & connects you',
    'Chat, negotiate, and finalize deals'
  ];

  const sellerSteps = [
    'Login/Register as Seller',
    'Upload product with detailed specs',
    'Wait for admin approval',
    'Respond to incoming RFQs',
    'Track performance in dashboard'
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-orange-600">TradeConnect</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The premier B2B marketplace connecting verified buyers and sellers through intelligent RFQ management
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleBuyerLogin}
              className="px-8 py-3 text-lg bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              👤 Login as Buyer
            </Button>
            <Button
              onClick={handleSellerLogin}
              className="px-8 py-3 text-lg bg-gray-700 hover:bg-gray-800 transition-colors"
            >
              🧑‍💼 Login as Seller
            </Button>
          </div>
        </header>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
            Why Choose TradeConnect?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <CardHeader className="text-center pb-2">
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                </CardHeader>
                <CardContent className="text-center text-gray-600">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Buyers Section */}
            <Card className="p-6 border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">👤</div>
                <h3 className="text-2xl font-bold text-orange-600">For Buyers</h3>
              </div>
              <ol className="space-y-3">
                {buyerSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Sellers Section */}
            <Card className="p-6 border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🧑‍💼</div>
                <h3 className="text-2xl font-bold text-gray-700">For Sellers</h3>
              </div>
              <ol className="space-y-3">
                {sellerSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-8 mb-16 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Trusted by the Community
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Verified Sellers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-700 mb-2">1000+</div>
              <div className="text-gray-600">Active Buyers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">99%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-lg">
            Join the fastest-growing B2B marketplace for verified commerce
          </p>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gray-800 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of businesses already trading on TradeConnect
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={handleBuyerLogin}
              className="px-8 py-3 text-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              Start as Buyer
            </Button>
            <Button
              onClick={handleSellerLogin}
              className="px-8 py-3 text-lg bg-white text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Start as Seller
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;