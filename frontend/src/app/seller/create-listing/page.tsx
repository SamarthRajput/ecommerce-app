"use client";
import { ListingForm } from '@/src/components/forms/ListingForm';
import React, { useEffect, useState } from 'react';

export default function CreateListingPage() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('sellerToken');
        if (storedToken) {
            setToken(storedToken);
        } else {
            alert("Please login to create a listing");
        }
    }, []);
    if (!token) {
        return (
            <div className="container py-8">
                <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
                <p className="text-red-500">You must be logged in to create a listing.</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => window.location.href = '/seller/signin'}
                >
                    Login
                </button>
            </div>
        );
    }
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
            <ListingForm token={token} />
        </div>
    );
} 