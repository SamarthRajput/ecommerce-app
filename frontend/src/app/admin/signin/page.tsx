"use client";
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, Loader2, Shield, ArrowRight, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        password: ''
    });
    const router = useRouter();
    const auth = useAuth();

    // Redirect to admin dashboard if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            router.push('/admin');
        }
    }, [isLoggedIn, router]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field-specific errors when user starts typing
        if (fieldErrors[name as keyof typeof fieldErrors]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear general errors when user starts typing
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateForm = () => {
        const errors = { email: '', password: '' };
        let isValid = true;

        // if (!formData.email.trim()) {
        //     errors.email = 'Email is required';
        //     isValid = false;
        // } else {
        //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //     if (!emailRegex.test(formData.email)) {
        //         errors.email = 'Please enter a valid email address';
        //         isValid = false;
        //     }
        // }

        // if (!formData.password.trim()) {
        //     errors.password = 'Password is required';
        //     isValid = false;
        // } else if (formData.password.length < 6) {
        //     errors.password = 'Password must be at least 6 characters';
        //     isValid = false;
        // }

        // setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (
        e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e) e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:3001/api/v1/auth/admin/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('Login successful! Welcome back.');
                setIsLoggedIn(true);

                // Clear form
                setFormData({ email: '', password: '' });

                // Redirect after a short delay to show success message
                setTimeout(() => {
                    router.push('/admin');
                }, 1000);
            } else {
                // Handle various error scenarios with better messaging
                switch (response.status) {
                    case 400:
                        setError(data.error || 'Invalid request. Please check your input.');
                        break;
                    case 401:
                        setError('Invalid email or password. Please verify your credentials.');
                        break;
                    case 403:
                        setError('Access denied. Administrator privileges required.');
                        break;
                    case 429:
                        setError('Too many login attempts. Please try again later.');
                        break;
                    case 500:
                        setError('Server error. Please try again in a few moments.');
                        break;
                    default:
                        setError(data.error || 'Login failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    setError('Unable to connect to server. Please check if the server is running.');
                } else if (error.name === 'NetworkError' || error.message.includes('network')) {
                    setError('Network error. Please check your internet connection.');
                } else {
                    setError('An unexpected error occurred. Please try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
            auth.refetch(); // Refresh auth state
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-purple-600/5"></div>

            <div className="relative min-h-screen flex">
                {/* Left Side - Brand/Info (Hidden on mobile) */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
                        <div className="text-center max-w-md">
                            {/* Logo */}
                            <div className="mb-8">
                                <div className="inline-flex p-6 bg-white/10 rounded-3xl backdrop-blur mb-6">
                                    <Shield className="w-16 h-16 text-orange-400" />
                                </div>
                                <h1 className="text-4xl font-bold mb-2">
                                    <span className="text-orange-400">Trade</span>
                                    <span className="text-purple-400">Connect</span>
                                </h1>
                                <p className="text-xl text-gray-300">Admin Portal</p>
                            </div>

                            {/* Feature highlights */}
                            <div className="space-y-4 text-left">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-200">Manage verified buyers and sellers</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-200">Monitor platform activities</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-200">Oversee communication channels</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-200">Access comprehensive analytics</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
                    <div className="max-w-md w-full">
                        {/* Mobile Logo (Visible only on mobile) */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="inline-flex p-4 bg-gray-100 rounded-2xl mb-4">
                                <Shield className="w-12 h-12 text-orange-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                <span className="text-orange-600">Trade</span>
                                <span className="text-purple-600">Connect</span>
                            </h1>
                            <p className="text-gray-600">Admin Portal</p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border-0 p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="hidden lg:block">
                                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-orange-600" />
                                    </div>
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome Back</h2>
                                <p className="text-gray-600 mt-2">Sign in to access your admin dashboard</p>
                            </div>

                            {/* Global Error Alert */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-in slide-in-from-top duration-300">
                                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-red-800 text-sm font-medium">Authentication Error</p>
                                        <p className="text-red-700 text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Success Alert */}
                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start animate-in slide-in-from-top duration-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-green-800 text-sm font-medium">Success</p>
                                        <p className="text-green-700 text-sm mt-1">{success}</p>
                                    </div>
                                </div>
                            )}

                            {/* Login Form */}
                            <div className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            className={`block w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-white/70 ${fieldErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your email address"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {fieldErrors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {fieldErrors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            className={`block w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-white/70 ${fieldErrors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your password"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                    {fieldErrors.password && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {fieldErrors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={() => handleSubmit()}
                                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <User className="w-4 h-4 mr-2" />
                                            Sign In to Admin Portal
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500">
                                    Protected by enterprise-grade security
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;