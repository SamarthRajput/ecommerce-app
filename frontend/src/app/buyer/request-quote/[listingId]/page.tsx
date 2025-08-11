"use client";
import { showError, showInfo, showSuccess } from '@/lib/toast';
import { RFQForm } from '@/src/components/forms/RFQForm';
import { APIURL } from '@/src/config/env';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
// The path for this will be localhost:3000/buyer/request-quote/1
interface RequestQuotePageProps {
    params: {
        listingId: string;
    };
}
export interface ListingData {
    id: string;
    name: string;
    category: string;
    quantity: number;
    currency: string;
    price: number;
    minimumOrderQuantity: number;
    minimumDeliveryDateInDays: number;
    createdAt: Date;
    updatedAt: Date;
}

// check listing exists or not and buyer is logged in or not
export default function RequestQuotePage({ params }: RequestQuotePageProps) {
    const { authLoading, authenticated, isBuyer } = useAuth();
    const router = useRouter();
    const [listingData, setListingData] = useState<ListingData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!authenticated || !isBuyer)) {
            showError('You must be a logged-in buyer to request a quote.');
            router.push('/buyer/signin');
        }
    }, [authLoading, authenticated, isBuyer]);

    useEffect(() => {
        if (!params.listingId) {
            setError('Invalid listing ID');
            showError('Invalid listing ID');
            setLoading(false);
            return;
        }
        fetchListingData();
    }, [params]);

    const fetchListingData = async () => {
        try {
            const response = await fetch(`${APIURL}/rfq/info/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Failed to fetch listing data');
            }
            const data = await response.json();
            setListingData(data.data);
        } catch (error: any) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListingData();
    }, []);

    useEffect(() => {
        if (listingData) {
            setLoading(false);
        }
    }, [listingData]);

    if (loading) {
        return <div className='flex items-center justify-center py-8 min-h-screen'>Loading...</div>;
    }

    if (error) {
        return <div className='flex items-center justify-center py-8 min-h-screen text-red-500'>Error: {error}</div>;
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Request Quote</h1>
            {/* breadcrumb Home>Products>RequestRFQ  */}
            <nav className="mb-4">
                <ol className="list-reset flex">
                    <li>
                        <a href="/" className="text-blue-500 hover:underline">Home</a>
                    </li>
                    <li className="mx-2">-{'>'}</li>
                    <li>
                        <a href="/products" className="text-blue-500 hover:underline">Products</a>
                    </li>
                    <li className="mx-2">-{'>'}</li>
                    <li>
                        <a href={`/products/${encodeURIComponent(`${listingData?.category}`)}/${encodeURIComponent(`${listingData?.id}`)}`} className="text-blue-500 hover:underline">{listingData?.name}</a>
                    </li>
                    <li className="mx-2">-{'>'}</li>
                    <li>
                        <span className="text-gray-500">Request RFQ</span>
                    </li>
                </ol>
                {/* {JSON.stringify(listingData, null, 2)} */}

            </nav>
            <RFQForm listingId={params.listingId} listingData={listingData} />
        </div>
    );
}
