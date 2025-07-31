export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    adminRole: string;
    createdAt: string;
}

export interface SellerUser {
    id: string;
    email: string;
    role: string;
    slug: string;
    firstName: string;
    lastName: string;
    businessDocUrl: string;
    govIdUrl: string;
    gstCertUrl: string;
    otherDocsUrl: string;
    approvalNote: string;
    isApproved: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    phone: string;
    countryCode: string;
    businessName: string;
    businessType: string;
    registrationNo: string;
    taxId: string;
    panOrTin: string;
    website: string;
    linkedIn: string;
    yearsInBusiness: string;
    industryTags: string[];
    keyProducts: string[];
    companyBio: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    createdAt: string;
    updatedAt: string;
}

export interface BuyerUser {
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

export interface UserStats {
    totalUsers: number;
    totalSellers: number;
    totalBuyers: number;
    totalAdmins: number;
    approvedSellers: number;
    pendingSellers: number;
    verifiedSellers: number;
    unverifiedSellers: number;
}

export interface CreateAdminData {
    email: string;
    password: string;
    name: string;
    adminRole: string;
}

export interface UpdateAdminData {
    email: string;
    name: string;
    adminRole: string;
    password?: string;
}

export interface ApprovalData {
    approved: boolean;
    approvalNote: string;
}