"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { ProductFormData } from '@/src/lib/types/listing';
import ProductForm from '@/src/components/CreateListingForm/ProductForm';
import { useAuth } from '@/src/context/AuthContext';
import RequestCertificationButton from '@/src/components/RequestCertificationButton';

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams();
    const [initialData, setInitialData] = useState<Partial<ProductFormData> | null>(null);
    const [loading, setLoading] = useState(true);
    const { authLoading, isSeller, user } = useAuth();

    useEffect(() => {
        if (!authLoading && !isSeller) {
            alert('You must be logged in as a seller to edit listings.');
            // router.push('/seller/signin');
        }
    }, [authLoading, isSeller, router]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${BACKEND_URL}/seller/product/${params.id}`, {
                    credentials: 'include',
                });

                const productData = await response.json();
                if (response.ok) {
                    setInitialData(productData);
                } else {
                    throw new Error(`Failed to fetch product data: ${productData.message} or ${productData.error}`);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                alert('Error loading product data');
                // router.push('/seller/listings');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProductData();
        }
    }, [params.id, router]);

    const handleSubmit = async (data: ProductFormData) => {
        try {
            const formData = new FormData();

            // Append all form fields
            Object.keys(data).forEach(key => {
                const value = data[key as keyof ProductFormData];
                if (key === 'images') {
                    // Handle file uploads - mix of existing URLs and new files
                    if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            if (item instanceof File) {
                                formData.append('newImages', item);
                            } else if (typeof item === 'string') {
                                formData.append('existingImages', item);
                            }
                        });
                    }
                } else if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${BACKEND_URL}/seller/edit-listing/${params.id}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                alert('Product updated successfully!');
                router.push('/seller/listings');
            } else {
                throw new Error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product. Please try again.');
            throw error;
        }
    };

    const handleCancel = () => {
        // confirm before navigating away
        
        router.push('/seller/dashboard?tab=listings');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                        <p className="text-gray-600 mb-4">The product you're trying to edit doesn't exist.</p>
                        <button
                            onClick={() => router.push('/seller/listings')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Back to Listings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Main Form Section */}
            <div className="p-6">
                <ProductForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>

            {/* Certification Section - Styled as a distinct box */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
                <RequestCertificationButton
                    productId={params.id as string}
                    amount={100}
                />
            </div>
        </div>
    );
}