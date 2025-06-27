"use client";
import React, { useEffect } from 'react'

interface SellerResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    businessName: string;
    businessType: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    taxId: string;
    createdAt: string;
    updatedAt: string;
}
interface BuyerResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

const UserManagement = () => {
    const [sellers, setSellers] = React.useState<SellerResponse[]>([]);
    const [buyers, setBuyers] = React.useState<BuyerResponse[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            const [sellerResponse, buyerResponse] = await Promise.all([
                fetch(`${BASE_URL}/admin/sellers`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies for authentication
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(`${BASE_URL}/admin/buyers`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies for authentication
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            ]);
            if (!sellerResponse.ok) {
                const errorData = await sellerResponse.json();
                setError(errorData.error + ' Failed to fetch sellers');
                setLoading(false);
                return;
            }
            if (!buyerResponse.ok) {
                const errorData = await buyerResponse.json();
                setError(errorData.error + ' Failed to fetch buyers');
                setLoading(false);
                return;
            }
            const sellersData = await sellerResponse.json();
            const buyersData = await buyerResponse.json();
            setSellers(sellersData.data || []);
            setBuyers(buyersData.data || []);
            setLoading(false);

        }
        fetchUsers().catch(err => {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setLoading(false);
        });
    }, [BASE_URL]);


    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">User Management | Admin Dashboard</h1>
            {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
            </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Sellers</h2>
                {sellers.length === 0 ? (
                <p className="text-gray-500">No sellers found.</p>
                ) : (
                <ul className="divide-y divide-gray-200">
                    {sellers.map(seller => (
                    <li key={seller.id} className="py-3">
                        <div className="font-medium">{seller.firstName} {seller.lastName}</div>
                        <div className="text-sm text-gray-600">{seller.email}</div>
                        <div className="text-xs text-gray-400">{seller.businessName} &middot; {seller.role}</div>
                    </li>
                    ))}
                </ul>
                )}
                {sellers.length > 0 && (
                <div className="mt-4 text-green-600 font-semibold">
                    Total Sellers: {sellers.length}
                </div>
                )}
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Buyers</h2>
                {buyers.length === 0 ? (
                <p className="text-gray-500">No buyers found.</p>
                ) : (
                <ul className="divide-y divide-gray-200">
                    {buyers.map(buyer => (
                    <li key={buyer.id} className="py-3">
                        <div className="font-medium">{buyer.firstName} {buyer.lastName}</div>
                        <div className="text-sm text-gray-600">{buyer.email}</div>
                        <div className="text-xs text-gray-400">{buyer.country}</div>
                    </li>
                    ))}
                </ul>
                )}
                {buyers.length > 0 && (
                <div className="mt-4 text-green-600 font-semibold">
                    Total Buyers: {buyers.length}
                </div>
                )}
            </div>
            </div>
            {sellers.length === 0 && buyers.length === 0 && !error && (
            <p className="text-gray-500 text-center mt-8">No users found.</p>
            )}
        </div>
    )
}

export default UserManagement

/*
const sellers = await prisma.seller.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                businessName: true,
                businessType: true,
                phone: true,
                street: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                taxId: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json({
            success: true,
            data: sellers
        });
        /*/

/*
try {
const buyers = await prisma.buyer.findMany({
    select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        street: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
    }
});
res.json({
    success: true,
    data: buyers
});
} catch (error) {
console.error('Error fetching buyers:', error);
res.status(500).json({
    success: false,
    error: 'Failed to fetch buyers'
});
}
*/