"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { ProductFormData } from '@/lib/types/listing';
import ProductForm from '@/src/components/CreateListingForm/ProductForm';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'sonner';

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams();
    const [initialData, setInitialData] = useState<Partial<ProductFormData> | null>(null);
    const [loading, setLoading] = useState(true);
    const { authLoading, isSeller, user } = useAuth();
    const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);

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
                                formData.append('files', item);
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

            if (typeof window === "undefined") {
                throw new Error("Form submission with FormData must be done on the client side.");
            }
            const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${BACKEND_URL}/seller/edit-listing/${params.id}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });
            const responseData = await response.json();
            if (response.ok) {
                setSuccessfullyUpdated(true);
                setInitialData(responseData.listing);
                toast.success(responseData.message || 'Product updated successfully');
                // router.push(`/products/${responseData.listing.category}/${responseData.listing.id}`);
            } else {
                throw new Error(`Failed to update product: ${responseData.message || responseData.error}`);
            }
        } catch (error) {
            toast.error(`Error updating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
            router.push('/seller/dashboard?tab=listings');
        }
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

    if (successfullyUpdated) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Updated Successfully</h1>
                        <p className="text-gray-600 mb-4">Your product has been updated successfully, and will be reviewed shortly by our team.</p>
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

    if (!initialData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                        <p className="text-gray-600 mb-4">The product you're trying to edit doesn't exist.</p>
                        <button
                            onClick={() => router.back()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Go Back
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
        </div>
    );
}