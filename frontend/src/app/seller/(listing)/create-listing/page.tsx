"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductFormData } from '@/lib/types/listing';
import ProductForm from '@/src/components/CreateListingForm/ProductForm';
import { toast } from "sonner"
import { APIURL } from '@/src/config/env';
import { useAuth } from '@/src/context/AuthContext';

export default function CreateListingPage() {
    const router = useRouter();
    const { user, authLoading, authenticated } = useAuth();

    useEffect(() => {
        if (authLoading) return; // Wait for auth state to load
        if (!authenticated || !user) {
            toast.error('You must be logged in to create a listing.', { description: 'Please log in to continue.' });
            router.push('/seller/signin'); // Redirect to login if not authenticated
        }
    }, [authLoading, authenticated, user, router]);

    // In your CreateListingPage component - fix the handleSubmit function

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
            
            console.log('Frontend: isDraft parameter received:', isDraft);
            formData.append('isDraft', isDraft.toString());

            // Debug log to verify what's being sent
            console.log('Frontend: FormData isDraft value:', formData.get('isDraft'));

            const response = await fetch(`${APIURL}/seller/list-item`, {
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
                toast.success(isDraft ? 'Product saved as draft!' : 'Product submitted for approval!');
                router.push('/seller/dashboard?tab=listings');
            } else {
                throw new Error(`${result.error || 'Unknown error'}`);
            }
        } catch (error: any) {
            toast.error(`Error submitting product: ${error.message || 'Unknown error'}`);
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