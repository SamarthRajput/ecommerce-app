"use client";
import { useParams } from 'next/navigation';
import React from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api/v1';
const API_URL = `${BACKEND_URL}/seller`;

interface getSellerPublicProfileInterface {
    message: string;
    seller: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        countryCode: string;
        role: string;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        isApproved: boolean;
        businessName: string;
        businessType: string;
        registrationNo: string;
        taxId: string;
        website: string;
        linkedIn: string;
        yearsInBusiness: number;
        industryTags: string[];
        keyProducts: string[];
        companyBio: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        createdAt: Date;
        updatedAt: Date;
    };
    products: {
        id: string;
        name: string;
        description: string;
        price: number;
        currency: string;
        quantity: number;
        minimumOrderQuantity: number;
        listingType: string;
        condition: string;
        validityPeriod: number;
        expiryDate: Date | null;
        deliveryTimeInDays: number | null;
        logisticsSupport: boolean;
        industry: string;
        category: string;
        productCode: string;
        model: string | null;
        specifications: string | null;
        countryOfSource: string | null;
        hsnCode: string | null;
        certifications: string[] | null;
        warrantyPeriod: number | null;
        licenses: string[] | null;
        brochureUrl: string | null;
        videoUrl: string | null;
        images: string[];
        tags: string[];
    }[];
}
const BusinessPage = () => {
    const [sellerProfile, setSellerProfile] = React.useState<getSellerPublicProfileInterface | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    React.useEffect(() => {
        const fetchSellerProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/public-profile/${id}`);
                const dataResponse = await response.json();
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch seller profile: ${dataResponse.error || response.statusText}`
                    );
                }
                const data: getSellerPublicProfileInterface = dataResponse;
                setSellerProfile(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchSellerProfile();
    }, [id]);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!sellerProfile) {
        return <div>No seller profile found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <section className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                    <div className="flex-shrink-0 w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                        {sellerProfile.seller.businessName
                            ? sellerProfile.seller.businessName[0].toUpperCase()
                            : sellerProfile.seller.firstName[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {sellerProfile.seller.businessName}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {sellerProfile.seller.companyBio}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {sellerProfile.seller.industryTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Company Details
                        </h2>
                        <dl className="space-y-2">
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">Business Type</dt>
                                <dd className="text-gray-900 dark:text-white">{sellerProfile.seller.businessType}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">Registration No</dt>
                                <dd className="text-gray-900 dark:text-white">{sellerProfile.seller.registrationNo}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">Tax ID</dt>
                                <dd className="text-gray-900 dark:text-white">{sellerProfile.seller.taxId}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">Years in Business</dt>
                                <dd className="text-gray-900 dark:text-white">{sellerProfile.seller.yearsInBusiness}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">Key Products</dt>
                                <dd className="text-gray-900 dark:text-white">
                                    {sellerProfile.seller.keyProducts.join(', ')}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Contact & Address
                        </h2>
                        <dl className="space-y-2">
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">Website</dt>
                                <dd>
                                    <a
                                        href={sellerProfile.seller.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {sellerProfile.seller.website}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">LinkedIn</dt>
                                <dd>
                                    <a
                                        href={sellerProfile.seller.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {sellerProfile.seller.linkedIn}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">Email</dt>
                                <dd className="text-gray-900 dark:text-white">{sellerProfile.seller.email}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">Phone</dt>
                                <dd className="text-gray-900 dark:text-white">
                                    {sellerProfile.seller.countryCode} {sellerProfile.seller.phone}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-700 dark:text-gray-300">Address</dt>
                                <dd className="text-gray-900 dark:text-white">
                                    {`${sellerProfile.seller.street}, ${sellerProfile.seller.city}, ${sellerProfile.seller.state}, ${sellerProfile.seller.zipCode}, ${sellerProfile.seller.country}`}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Products
                    </h2>
                    {!sellerProfile.products || sellerProfile.products.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">No products listed.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sellerProfile.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col"
                                >
                                    <div className="mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            {product.category} &middot; {product.industry}
                                        </p>
                                    </div>
                                    <p className="flex-1 text-gray-700 dark:text-gray-200 mb-2">
                                        {product.description}
                                    </p>
                                    <div className="mt-auto">
                                        <span className="text-blue-600 font-semibold">
                                            {product.currency} {product.price}
                                        </span>
                                        <span className="ml-2 text-xs text-gray-500">
                                            Min. Order: {product.minimumOrderQuantity}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default BusinessPage;