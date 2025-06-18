// components/SellerRegistration.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const API_BASE_URL = 'http://localhost:3001/api/v1/seller';

// Zod validation schema
const sellerRegistrationSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password must be at least 1 characters'), // will be 8 in production
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
    businessName: z.string().min(1, 'Business name is required').max(100, 'Business name too long'),
    businessType: z.enum(['individual', 'company', 'partnership', 'llc'], {
        errorMap: () => ({ message: 'Please select a business type' })
    }),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number'),
    street: z.string().min(1, 'Street address is required').max(200, 'Address too long'),
    city: z.string().min(1, 'City is required').max(50, 'City name too long'),
    state: z.string().min(1, 'State is required').max(50, 'State name too long'),
    zipCode: z.string().min(1, 'Zip code is required').max(20, 'Zip code too long'),
    country: z.string().min(1, 'Country is required').max(50, 'Country name too long'),
    taxId: z.string().min(1, 'Tax ID is required').max(50, 'Tax ID too long')
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

type RegistrationData = z.infer<typeof sellerRegistrationSchema>;

interface VerifyResponse {
    message: string;
    seller: {
        id: string;
        email: string;
    };
}

const SellerRegistration = () => {
    const [formData, setFormData] = useState<RegistrationData>({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        businessName: '',
        businessType: 'individual',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        taxId: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
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
                    console.log('Already logged in, redirecting to dashboard');

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        try {
            sellerRegistrationSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach(err => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                profile: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    businessName: formData.businessName,
                    businessType: formData.businessType,
                    phone: formData.phone,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country
                    },
                    taxId: formData.taxId
                }
            };

            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Store the token and redirect
            localStorage.setItem('sellerToken', data.token);
            localStorage.setItem('sellerId', data.seller._id);

            // Redirect to dashboard
            router.push('/seller/dashboard');

        } catch (error) {
            setErrors({
                submit: error instanceof Error ? error.message : 'Registration failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        router.push('/');
    };

    const handleSignIn = () => {
        router.push('/seller/signin');
    };

    // Show loading spinner while verifying token
    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-white px-6 py-8 border-b border-gray-200">
                        <div className="text-center">
                            <button
                                onClick={handleBackToHome}
                                className="text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors mb-4"
                            >
                                <span className="text-orange-600">Trade</span>Connect
                            </button>
                            <h2 className="text-3xl font-extrabold text-gray-900">
                                Create Seller Account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Join our marketplace and start selling today
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-8">
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                                <p className="text-red-600 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Account Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                                    Account Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your email"
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.password ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Create a password"
                                            required
                                        />
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Password *
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Confirm your password"
                                            required
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="border-t pt-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your first name"
                                            required
                                        />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your last name"
                                            required
                                        />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Business Information */}
                            <div className="border-t pt-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                                    Business Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Business Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.businessName ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your business name"
                                            required
                                        />
                                        {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Business Type *
                                        </label>
                                        <select
                                            name="businessType"
                                            value={formData.businessType}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.businessType ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            required
                                        >
                                            <option value="individual">Individual</option>
                                            <option value="company">Company</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="llc">LLC</option>
                                        </select>
                                        {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tax ID *
                                    </label>
                                    <input
                                        type="text"
                                        name="taxId"
                                        value={formData.taxId}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.taxId ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your tax ID"
                                        required
                                    />
                                    {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="border-t pt-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
                                    Address Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.street ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your street address"
                                            required
                                        />
                                        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.city ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Enter your city"
                                                required
                                            />
                                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.state ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Enter your state"
                                                required
                                            />
                                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Zip Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.zipCode ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Enter your zip code"
                                                required
                                            />
                                            {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Country *
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${errors.country ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Enter your country"
                                                required
                                            />
                                            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="border-t pt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating Account...
                                        </span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={handleSignIn}
                                        className="font-medium text-orange-600 hover:text-orange-500"
                                    >
                                        Sign in here
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRegistration;