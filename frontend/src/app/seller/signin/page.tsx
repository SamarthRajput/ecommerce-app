// components/SellerLogin.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:3001/api/v1/seller';

interface LoginFormData {
    email: string;
    password: string;
}

interface User {
    _id: string;
    email: string;
    role: 'seller' | 'admin';
    profile: {
        firstName: string;
        lastName: string;
        businessName?: string;
    };
}

interface LoginResponse {
    message: string;
    seller: User;
    token: string;
}

interface VerifyResponse {
    message: string;
    seller: {
        id: string;
        email: string;
    };
}

const SellerLogin = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [verifying, setVerifying] = useState<boolean>(true);
    const router = useRouter();

    // Check if user is already logged in
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('sellerToken');

                if (!token) {
                    setVerifying(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/verify`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data: VerifyResponse = await response.json();
                    console.log('Token verified, redirecting to dashboard');

                    // If token is valid, redirect to dashboard
                    router.push('/seller/dashboard');
                    return;
                } else {
                    // Token is invalid, remove it
                    localStorage.removeItem('sellerToken');
                    localStorage.removeItem('sellerId');
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                // Remove invalid token
                localStorage.removeItem('sellerToken');
                localStorage.removeItem('sellerId');
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data: LoginResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token in localStorage
            localStorage.setItem('sellerToken', data.token);
            localStorage.setItem('sellerId', data.seller._id);

            // Redirect based on role
            if (data.seller.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/seller/dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        router.push('/seller/forgot-password');
    };

    const handleSignUp = () => {
        router.push('/seller/signup');
    };

    const handleBackToHome = () => {
        router.push('/');
    };

    // Show loading spinner while verifying token
    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="text-center mb-6">
                        <button
                            onClick={handleBackToHome}
                            className="text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
                        >
                            <span className="text-orange-600">Trade</span>Connect
                        </button>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Seller Portal Login
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="font-medium text-orange-600 hover:text-orange-500"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={handleSignUp}
                                className="font-medium text-orange-600 hover:text-orange-500"
                            >
                                Register as a seller
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerLogin;