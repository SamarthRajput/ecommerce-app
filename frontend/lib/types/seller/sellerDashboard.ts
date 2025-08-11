import { Key } from "lucide-react";

interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface Seller {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
    businessType: string;
    phone: string;
    countryCode: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isApproved: boolean;
    approvalNote: string;
    registrationNo: string;
    taxId: string;
    panOrTin: string;
    website: string;
    linkedIn: string;
    yearsInBusiness: number;
    industryTags: string[];
    keyProducts: string[];
    companyBio: string;
    govIdUrl: string;
    gstCertUrl: string;
    businessDocUrl: string;
    otherDocsUrl: string;
    address: Address;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    message: string;
    seller: Seller;
}

export interface SellerDashboardListing {
    id: string;
    productName: string;
    price: number;
    quantity: number;
    category: string;
    status: 'active' | 'inactive' | 'pending' | 'rejected';
    views: number;
    rfq: {
        [Key in string]: any;
    }
    createdAt: string;
    images: string[];
}

interface DashboardStats {
    totalListings: number;
    activeListings: number;
    totalViews: number;
    totalRFQs: number;
    totalRevenue: number;
    monthlyRevenue: number;
    responseRate: number;
    avgRating: number;
    recentOrders: number;
    pendingOrders: number;
}

export interface RFQ {
    id: string;
    productId: string;
    buyerId: string;

    // Core order details
    quantity: number;
    unit?: string; // e.g. KG, Ton, Box
    deliveryDate?: Date; // date by which buyer needs delivery
    currency?: string; // e.g. USD, INR

    // Payment terms & percentages
    paymentTerms?: string; // free-text summary
    advancePaymentPercentage?: number; // %
    cashAgainstDocumentsPercentage?: number; // CAD %
    documentsAgainstPaymentPercentage?: number; // DP %
    documentsAgainstAcceptancePercentage?: number; // DA %

    // Payment method
    paymentMethod?: 'TELEGRAPHIC_TRANSFER' | 'LETTER_OF_CREDIT';
    letterOfCreditDescription?: string; // extra details for LC

    // Buyer requests
    specialRequirements?: string; // free text
    requestChangeInDeliveryTerms?: boolean;
    servicesRequired?: string[]; // e.g. ["Supplier Verification Report", "Shipment Supervision"]
    additionalNotes?: string;
    message?: string; // buyer's message to seller

    // Status tracking
    status: 'PENDING' | 'FORWARDED' | 'APPROVED' | 'REJECTED' | 'CLOSED';
    rejectionReason?: string;
    reviewedAt?: Date;

    // Audit
    createdAt: Date;
    updatedAt: Date;
}


export type { Address, Seller, ApiResponse, DashboardStats };

export interface SellerDashboardRfq {
    id: string;
    productId: string;
    buyerId: string;
    quantity: number;
    unit: string | null;
    deliveryDate: Date;
    budget: number | null;
    currency: string;
    paymentTerms: string;
    advancePaymentPercentage: number;
    cashAgainstDocumentsPercentage: number;
    documentsAgainstPaymentPercentage: number;
    documentsAgainstAcceptancePercentage: number;
    paymentMethod: 'TELEGRAPHIC_TRANSFER' | 'LETTER_OF_CREDIT';
    letterOfCreditDescription: string | null;
    specialRequirements: string | null;
    requestChangeInDeliveryTerms: boolean;
    servicesRequired: string[];
    additionalNotes: string | null;
    message: string | null;
    status: 'FORWARDED';
    rejectionReason: string | null;
    reviewedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    product: {
        id: string;
        slug: string;
        name: string;
        description: string;
        price: number;
        currency: string;
        quantity: number;
        minimumOrderQuantity: number;
        listingType: string;
        condition: 'NEW';
        validityPeriod: number;
        expiryDate: Date;
        deliveryTimeInDays: number;
        logisticsSupport: string;
        industry: string;
        category: string;
        productCode: string;
        model: string;
        specifications: string;
        countryOfSource: string;
        hsnCode: string;
        certifications: string[];
        licenses: string[];
        warrantyPeriod: String;
        brochureUrl: string;
        videoUrl: string;
        images: string[];
        tags: string[];
        keywords: string[];
        status: "APPROVED" | String;
        rejectionReason: null;
        sellerId: String;
        createdAt: Date;
        updatedAt: Date;
    },
    buyer: {
        id: String,
        email: String,
        firstName: String,
        lastName: String,
        phoneNumber: String,
        street: String,
        state: String,
        city: String,
        zipCode: String,
        country: String,
        otp: String | null,
        otpExpiry: Date | null
    }
}