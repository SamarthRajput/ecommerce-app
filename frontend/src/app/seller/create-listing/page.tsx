"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertTriangle,
    Home,
    RefreshCw,
    Package,
    TrendingUp,
    Users,
    DollarSign,
    Lightbulb,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import { ListingForm } from '@/src/components/forms/ListingForm';

export default function EnhancedCreateListingPage() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        setLoading(true);
        const storedToken = localStorage.getItem('sellerToken');
        if (storedToken) {
            setToken(storedToken);
            // You can also fetch user profile here if needed
            // fetchUserProfile(storedToken);
        }
        setLoading(false);
    }, []);

    const handleRetry = () => {
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        </div>
                        <h1 className="text-2xl font-semibold mb-3 text-gray-800">Loading TradeConnect</h1>
                        <p className="text-gray-600">Verifying your credentials and preparing the listing form...</p>
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl shadow-lg">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-gray-900">Authentication Required</CardTitle>
                        <p className="text-gray-600 mt-2">You need to be logged in as a seller to create listings on TradeConnect</p>
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-900 mb-2">Why do I need to login?</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Verify your business credentials</li>
                                <li>• Ensure listing quality and authenticity</li>
                                <li>• Enable secure buyer-seller communication</li>
                                <li>• Access your seller dashboard and analytics</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                                onClick={() => window.location.href = '/seller/signin'}
                            >
                                <Users className="w-4 h-4" />
                                Login as Seller
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/seller/signup'}
                                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                            >
                                Create Seller Account
                            </Button>
                        </div>

                        <div className="text-center mt-6">
                            <Button
                                variant="ghost"
                                onClick={() => window.location.href = '/'}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Back to Homepage
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create Professional Listing</h1>
                            <p className="text-gray-600 mt-1">Reach thousands of verified buyers on TradeConnect marketplace</p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full flex items-center cursor-pointer hover:bg-orange-200 transition-colors"
                            title='Click to go back to your dashboard'
                            onClick={() => { window.location.href = '/seller/dashboard'; }}>

                            <Package className="w-4 h-4 mr-1" />
                            Seller Dashboard
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Success Tips Section */}
            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Marketplace Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">50K+</div>
                            <div className="text-sm text-gray-600">Active Buyers</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">95%</div>
                            <div className="text-sm text-gray-600">Success Rate</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
                                <DollarSign className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">$2M+</div>
                            <div className="text-sm text-gray-600">Monthly GMV</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">100K+</div>
                            <div className="text-sm text-gray-600">Products Listed</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Form */}
                <ListingForm token={token} />

                {/* Support Section */}
                <Card className="border border-gray-200 mt-8">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                            <p className="text-gray-600 mb-4">
                                Our team is here to help you create the perfect listing
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                                    📚 Listing Guidelines
                                </Button>
                                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                                    💬 Chat Support
                                </Button>
                                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                                    📞 Call Support
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}