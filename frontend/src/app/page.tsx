"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { Shield, Package, MessageSquare, TrendingUp, Users, Star, ArrowRight, CheckCircle, BarChart3, Globe, Zap, ShoppingCart, Search } from 'lucide-react';

/*
routing structure:
- Seller dashboard: "/seller/dashboard"
- Buyer Dashboard: "/buyer/dashboard"  
- Browse Products: "/products" (for buyers)
- Seller Analytics: "/seller/analytics" (instead of dashboard?view=analytics)
- Seller Products: "/seller/products" (seller's own products)
- Buyer Browse: "/buyer/browse" (buyer product browsing)
- Buyer Orders: "/buyer/orders" (buyer order history)
- Seller Signin: "/seller/signin"
- Buyer Signin: "/buyer/signin"
- Profile Settings: "/profile" (role-agnostic)
- Messages: "/messages" (role-specific routing inside)
*/

const HomePage = () => {
  const router = useRouter();
  const { authenticated, role, user, isSeller, authLoading, isBuyer } = useAuth();

  // Enhanced routing functions with better role handling
  const handleBuyerAction = () => {
    if (authenticated && isBuyer) {
      router.push('/buyer/dashboard');
    } else if (authenticated && !isBuyer) {
      // If authenticated but not a buyer, show role conflict
      router.push('/profile?message=role-mismatch');
    } else {
      router.push('/buyer/signin');
    }
  };

  const handleSellerAction = () => {
    if (authenticated && isSeller) {
      router.push('/seller/dashboard');
    } else if (authenticated && !isSeller) {
      // If authenticated but not a seller, show role conflict
      router.push('/profile?message=role-mismatch');
    } else {
      router.push('/seller/signin');
    }
  };
  // Navigation functions for authenticated users
  const navigateToProducts = () => {
    if (isBuyer) {
      router.push('/products');
    } else if (isSeller) {
      router.push('/seller/dashboard?view=products');
    } else {
      router.push('/products');
    }
  };

  const navigateToAnalytics = () => {
    if (isSeller) {
      router.push('/seller/dashboard?view=analytics');
    } else {
      router.push('/buyer/dashboard?view=analytics');
    }
  };

  const navigateToMessages = () => {
    router.push('/messages');
  };

  const navigateToOrders = () => {
    if (isBuyer) {
      router.push('/buyer/dashboard?view=orders');
    } else if (isSeller) {
      router.push('/seller/dashboard?view=orders');
    }
  };

  // Auto-redirect based on role and intended destination
  useEffect(() => {
    if (!authLoading && authenticated) {
      // Check if user landed on homepage with specific intent
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');

      if (redirect) {
        switch (redirect) {
          case 'dashboard':
            if (isBuyer) router.push('/buyer/dashboard');
            else if (isSeller) router.push('/seller/dashboard');
            break;
          case 'products':
            navigateToProducts();
            break;
          case 'analytics':
            navigateToAnalytics();
            break;
          default:
            break;
        }
      }
    }
  }, [authLoading, authenticated, isBuyer, isSeller, router]);

  const features = [
    {
      icon: Shield,
      title: 'Verified Communication',
      description: 'Admin-moderated buyer-seller communication ensures security and trust in every transaction.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Package,
      title: 'Smart Product Management',
      description: 'Advanced listing tools with comprehensive analytics and inventory tracking capabilities.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: MessageSquare,
      title: 'Intelligent RFQ System',
      description: 'Streamlined request handling with AI-powered matching and integrated negotiation tools.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      title: 'Market Analytics',
      description: 'Real-time market insights and performance metrics to optimize your trading strategy.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with verified businesses worldwide through our extensive network.',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Quick response times and automated workflows to accelerate your business deals.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const buyerSteps = [
    { step: 'Register & Get Verified', desc: 'Quick signup with business verification' },
    { step: 'Browse Products', desc: 'Explore categories with advanced filters' },
    { step: 'Send RFQ', desc: 'Submit detailed requests with specifications' },
    { step: 'Get Connected', desc: 'Admin verification and seller matching' },
    { step: 'Close Deals', desc: 'Negotiate and finalize through secure chat' }
  ];

  const sellerSteps = [
    { step: 'Create Account', desc: 'Register with business credentials' },
    { step: 'List Products', desc: 'Upload with detailed specifications' },
    { step: 'Get Approved', desc: 'Admin review and verification process' },
    { step: 'Receive RFQs', desc: 'Get matched buyer requests instantly' },
    { step: 'Grow Business', desc: 'Track performance and scale operations' }
  ];

  const stats = [
    { value: '2,500+', label: 'Verified Sellers', icon: Users },
    { value: '5,000+', label: 'Active Buyers', icon: TrendingUp },
    { value: '99.2%', label: 'Success Rate', icon: Star },
    { value: '50+', label: 'Countries', icon: Globe }
  ];

  // Function to get hero content based on authentication and role
  const getHeroContent = () => {
    if (authenticated && isBuyer) {
      return {
        title: `Welcome back, ${user?.name || 'Buyer'}!`,
        subtitle: 'Continue exploring products and managing your requests',
        primaryAction: {
          label: 'Go to Dashboard',
          icon: BarChart3,
          onClick: () => router.push('/buyer/dashboard')
        },
        secondaryAction: {
          label: 'Browse Products',
          icon: Search,
          onClick: navigateToProducts
        },
        quickActions: [
          { label: 'My Orders', icon: ShoppingCart, onClick: navigateToOrders },
          { label: 'Messages', icon: MessageSquare, onClick: navigateToMessages }
        ]
      };
    } else if (authenticated && isSeller) {
      return {
        title: `Welcome back, ${user?.name || 'Seller'}!`,
        subtitle: 'Manage your listings and respond to new RFQs',
        primaryAction: {
          label: 'Go to Dashboard',
          icon: BarChart3,
          onClick: () => router.push('/seller/dashboard')
        },
        secondaryAction: {
          label: 'View Analytics',
          icon: TrendingUp,
          onClick: navigateToAnalytics
        },
        quickActions: [
          { label: 'My Products', icon: Package, onClick: navigateToProducts },
          { label: 'Messages', icon: MessageSquare, onClick: navigateToMessages }
        ]
      };
    } else {
      return {
        title: 'Welcome to TradeConnect',
        subtitle: 'The premier B2B marketplace connecting verified buyers and sellers through intelligent RFQ management',
        primaryAction: {
          label: 'Start as Buyer',
          icon: Users,
          onClick: handleBuyerAction
        },
        secondaryAction: {
          label: 'Start as Seller',
          icon: Package,
          onClick: handleSellerAction
        }
      };
    }
  };

  const heroContent = getHeroContent();

  if (authLoading) {
    return (
      <div className="text-center min-h-screen flex flex-col items-center justify-center space-y-6">
        {/* Loading Title */}
        <div className="mb-8">
          <div className="text-4xl font-bold text-gray-900 animate-pulse">
            <span className="text-orange-600">Trade</span>Connect
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-orange-300 rounded-full animate-spin mx-auto mt-2 ml-2" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">Setting up your workspace...</p>
          <p className="text-sm text-gray-500">This will just take a moment</p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-purple-600/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            {authenticated && (
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                {isBuyer ? 'Buyer Account' : 'Seller Account'}
              </Badge>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {authenticated ? (
                heroContent.title
              ) : (
                <>
                  Welcome to <span className="text-orange-600">Trade</span>
                  <span className="text-purple-600">Connect</span>
                </>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              {heroContent.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={heroContent.primaryAction.onClick}
                size="lg"
                className="px-8 py-4 text-lg bg-orange-600 hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <heroContent.primaryAction.icon className="w-5 h-5 mr-2" />
                {heroContent.primaryAction.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                onClick={heroContent.secondaryAction.onClick}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                <heroContent.secondaryAction.icon className="w-5 h-5 mr-2" />
                {heroContent.secondaryAction.label}
              </Button>
            </div>

            {/* Quick Action Buttons for Authenticated Users */}  
            {authenticated && heroContent.quickActions && (
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                {heroContent.quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.onClick}
                    variant="ghost"
                    size="sm"
                    className="px-4 py-2 text-sm hover:bg-gray-100 transition-all duration-200"
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
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
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TradeConnect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your B2B trading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur">
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to start your B2B trading journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Buyers Section */}
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-orange-100 rounded-full mb-4">
                  <Users className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-orange-700">For Buyers</h3>
                <p className="text-orange-600 mt-2">Find the right suppliers for your business</p>
              </div>
              <div className="space-y-4">
                {buyerSteps.map((item, index) => (
                  <div key={index} className="flex items-start group">
                    <span className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.step}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sellers Section */}
            <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <Package className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Sellers</h3>
                <p className="text-gray-600 mt-2">Grow your business with qualified leads</p>
              </div>
              <div className="space-y-4">
                {sellerSteps.map((item, index) => (
                  <div key={index} className="flex items-start group">
                    <span className="flex-shrink-0 w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.step}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 sm:p-12 text-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20"></div>
            <div className="relative text-center">
              {authenticated ? (
                <>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Ready to {isBuyer ? 'Find Suppliers' : 'Get More Orders'}?
                  </h2>
                  <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                    {isBuyer
                      ? 'Explore thousands of verified products and connect with trusted sellers.'
                      : 'Reach thousands of active buyers looking for your products.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                      onClick={heroContent.primaryAction.onClick}
                      size="lg"
                      className="px-8 py-4 text-lg bg-orange-600 hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      onClick={heroContent.secondaryAction.onClick}
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    >
                      {isBuyer ? 'Browse Products' : 'View Analytics'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                  <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                    Join thousands of businesses already trading on TradeConnect. Start your journey today!
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                      onClick={handleBuyerAction}
                      size="lg"
                      className="px-8 py-4 text-lg bg-orange-600 hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Start as Buyer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      onClick={handleSellerAction}
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    >
                      <Package className="w-5 h-5 mr-2" />
                      Start as Seller
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;