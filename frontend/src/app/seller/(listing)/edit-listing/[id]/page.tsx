"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { ProductFormData } from '@/lib/types/listing';
import ProductForm from '@/src/components/CreateListingForm/ProductForm';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'sonner';
import { APIURL } from '@/src/config/env';

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams();
    const [initialData, setInitialData] = useState<Partial<ProductFormData> | null>(null);
    const [loading, setLoading] = useState(true);
    const { authLoading, isSeller, user } = useAuth();
    const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);

    useEffect(() => {
        if (!authLoading && !isSeller) {
            toast.error('You must be logged in as a seller to edit listings.');
            router.push('/seller/signin');
            return;
        }
    }, [authLoading, isSeller, router]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`${APIURL}/seller/product/${params.id}`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const productData = await response.json();
                setInitialData(productData);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Error loading product data');
                router.push('/seller/dashboard?tab=listings');
            } finally {
                setLoading(false);
            }
        };

        if (params.id && !authLoading && isSeller) {
            fetchProductData();
        }
    }, [params.id, router, authLoading, isSeller]);

    const handleSubmit = async (data: ProductFormData) => {
        try {
            const formData = new FormData();

            // Separate existing images (URLs) from new files
            const existingImages: string[] = [];
            const newFiles: File[] = [];

            if (data.images && Array.isArray(data.images)) {
                data.images.forEach((item) => {
                    if (item instanceof File) {
                        newFiles.push(item);
                    } else if (typeof item === 'string') {
                        existingImages.push(item);
                    }
                });
            }

            // Append new files
            newFiles.forEach((file) => {
                formData.append('files', file);
            });

            // Append existing image URLs
            existingImages.forEach((url) => {
                formData.append('existingImages', url);
            });

            // Append all other form fields
            Object.keys(data).forEach(key => {
                if (key === 'images') return; // Already handled above

                const value = data[key as keyof ProductFormData];
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });

            const response = await fetch(`${APIURL}/seller/edit-listing/${params.id}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            setSuccessfullyUpdated(true);
            setInitialData(responseData.listing);
            toast.success(responseData.message || 'Product updated successfully');

        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(`Error updating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };

    const handleCancel = (): any => {
        if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
            router.push('/seller/dashboard?tab=listings');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!isSeller) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                        <p className="text-gray-600 mb-4">You must be logged in as a seller to edit listings.</p>
                        <button
                            onClick={() => router.push('/seller/signin')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (successfullyUpdated) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <div className="mb-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Updated Successfully</h1>
                        <p className="text-gray-600 mb-6">Your product has been updated successfully and will be reviewed shortly by our team.</p>
                        <div className="space-x-4">
                            <button
                                onClick={() => router.push('/seller/dashboard?tab=listings')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Go to Listings
                            </button>
                            <button
                                onClick={() => {
                                    setSuccessfullyUpdated(false);
                                }}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Edit Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!initialData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                        <p className="text-gray-600 mb-4">The product you're trying to edit doesn't exist or you don't have permission to edit it.</p>
                        <button
                            onClick={() => router.push('/seller/dashboard?tab=listings')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Go to Listings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Product Listing</h1>
                        <p className="text-gray-600 mt-1">Update your product information below</p>
                    </div>
                    <div className="p-6">
                        <ProductForm
                            mode="edit"
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}