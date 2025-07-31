
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

interface Listing {
    id: string;
    productName: string;
    price: number;
    quantity: number;
    category: string;
    status: 'active' | 'inactive' | 'pending' | 'rejected';
    views: number;
    rfqCount: number;
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

interface RFQ {
    id: string;
    productId: string;
    buyerId: string;
    quantity: number;
    message?: string;
    status: 'FORWARDED';
    rejectionReason?: string;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type { Address, Seller, ApiResponse, Listing, DashboardStats, RFQ };
