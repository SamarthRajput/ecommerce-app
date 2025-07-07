"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductFormData } from '@/src/lib/types/listing';
import ProductForm from '@/src/components/CreateListingForm/ProductForm';
import { toast } from "sonner"

export default function CreateListingPage() {
    const router = useRouter();

    const handleSubmit = async (data: ProductFormData, isDraft = false) => {
        try {
            const formData = new FormData();

            // Append all form fields
            Object.keys(data).forEach(key => {
                const value = data[key as keyof ProductFormData];
                if (key === 'images') {
                    // Handle file uploads
                    if (Array.isArray(value)) {
                        value.forEach(file => {
                            if (file instanceof File) {
                                formData.append('images', file);
                            }
                        });
                    }
                } else if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            formData.append('isDraft', isDraft ? 'true' : 'false');

            const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${BACKEND_URL}/seller/list-item`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });

            const result = await response.json();
            if (response.ok) {
                // alert(isDraft ? 'Product saved as draft!' : 'Product submitted for approval!');
                toast.success(isDraft ? 'Product saved as draft!' : 'Product submitted for approval!');
                router.push('/seller/dashboard?tab=listings');
            } else {
                toast.error(`Error: ${result.error || 'Unknown error'}`);
                throw new Error(`Failed to submit product: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            toast.error('Error submitting product. Please try again.');
            throw error;
        }
    };

    const handleCancel = () => {
        router.push('/seller/dashboard');
    };

    return (
        <ProductForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}