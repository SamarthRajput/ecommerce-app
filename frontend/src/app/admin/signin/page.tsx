"use client";
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'sonner';
import { APIURL } from '@/src/config/env';

const API_BASE_URL = `${APIURL}/auth/admin`;

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };

    const validateForm = () => {
        const errors = { email: '', password: '' };
        let isValid = true;

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else {
            // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // if (!emailRegex.test(formData.email)) {
            //     errors.email = 'Please enter a valid email address';
            //     isValid = false;
            // }
        }

        if (!formData.password.trim()) {
            errors.password = 'Password is required';
            isValid = false;
        // } else if (formData.password.length < 6) {
        //     errors.password = 'Password must be at least 6 characters';
        //     isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
        if (e) e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Login Successful\nWelcome back! Redirecting to dashboard...");

                setIsLoggedIn(true);
                setFormData({ email: '', password: '' });

                setTimeout(() => {
                    router.push('/admin');
                }, 1000);
            } else {
                let errorMessage = '';
                switch (response.status) {
                    case 400:
                        errorMessage = data.error || 'Invalid request. Please check your input.';
                        break;
                    case 401:
                        errorMessage = 'Invalid email or password. Please verify your credentials.';
                        break;
                    case 403:
                        errorMessage = 'Access denied. Administrator privileges required.';
                        break;
                    case 429:
                        errorMessage = 'Too many login attempts. Please try again later.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again in a few moments.';
                        break;
                    default:
                        errorMessage = data.error || 'Login failed. Please try again.';
                }
                toast.error(`Login Failed\n${errorMessage}`);
            }
        } catch (error: any) {
            let errorMessage = '';
            if (error instanceof Error) {
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    errorMessage = 'Unable to connect to server. Please check if the server is running.';
                } else if (error.name === 'NetworkError' || error.message.includes('network')) {
                    errorMessage = 'Network error. Please check your internet connection.';
                } else {
                    errorMessage = error.message;
                }
            } else {
                errorMessage = 'An unknown error occurred.';
            }
            toast.error(`Login Failed\n${errorMessage}`);
        } finally {
            setIsLoading(false);
            auth.refetch(); // Refresh auth state
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-600">Sign in to access your dashboard</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            // Move focus to password field
                                            const passwordInput = document.getElementById('password');
                                            if (passwordInput) {
                                                (passwordInput as HTMLInputElement).focus();
                                            }
                                        }
                                    }}
                                    className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${fieldErrors.email
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${fieldErrors.password
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Secure admin access
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;