"use client";
import { ListingForm } from '@/src/components/forms/ListingForm';
import React, { useEffect, useState } from 'react';

export default function CreateListingPage() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const storedToken = localStorage.getItem('sellerToken');
        if (storedToken) {
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-6"></div>
                <h1 className="text-2xl font-semibold mb-2 text-gray-700">Loading...</h1>
                <p className="text-gray-500">Please wait while we verify your credentials.</p>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6 w-full max-w-md text-center shadow">
                    <h1 className="text-2xl font-bold mb-2">Create New Listing</h1>
                    <p className="mb-4">You must be logged in to create a listing.</p>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                        onClick={() => window.location.href = '/seller/signin'}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <div className="bg-white rounded-lg shadow p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Listing</h1>
                <ListingForm token={token} />
            </div>
        </div>
    );
}