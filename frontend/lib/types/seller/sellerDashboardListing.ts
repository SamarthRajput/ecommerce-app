// types/listing.ts
import { Check, AlertTriangle, Archive } from 'lucide-react';

// Core Types
export interface Listing {
    id: string;
    productName: string;
    name: string;
    description: string;
    listingType: string;
    industry: string;
    condition: string;
    productCode: string;
    model: string;
    specifications: string;
    hsnCode: string;
    countryOfSource: string;
    validityPeriod: string;
    images: string[];
    price: number;
    quantity: number;
    category: string;
    status: 'active' | 'inactive' | 'archived' | 'rejected';
    createdAt: string;
    rejectionReason?: string; // Optional for rejected listings
    updatedAt?: string;
    views?: number;
    rfqCount?: number;
    slug: string;
    minimumOrderQuantity: number;
    currency?: string 
    brochureUrl?: string
    deliveryTimeInDays?: number,
    expiryDate?: string,
    licenses: string[],
    certifications: string[],
    logisticsSupport: boolean,
    tags: string[],
    warrantyPeriod?: string,
    keywords: string[],
    videoUrl: string,
}

export interface ListingFilters {
    search: string;
    status: string;
    category: string;
    sortBy: string;
}

export interface ListingStats {
    total: number;
    active: number;
    inactive: number;
    archived: number;
    totalValue: number;
}

// Constants
export const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
export const API_BASE_URL = `${API_BACKEND_URL}/seller`;

export const STATUS_CONFIG = {
    active: {
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: Check,
        label: 'Active'
    },
    inactive: {
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: AlertTriangle,
        label: 'Inactive'
    },
    archived: {
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: Archive,
        label: 'Archived'
    },
    rejected: {
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: AlertTriangle,
        label: 'Rejected'
    },
    approved: {
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Check,
        label: 'Approved'
    }
} as const;

export const SORT_OPTIONS = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'price-asc', label: 'Price: Low to High' },
    // { value: 'productName-asc', label: 'Name: A to Z' },
    // { value: 'productName-desc', label: 'Name: Z to A' },
] as const;

