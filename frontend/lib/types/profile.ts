
// types/profile.ts
export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Seller {
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
    avgRating?: number;
}

export interface ProfileFormData extends Seller {
    // Any additional form-specific properties can be added here
}

export interface ProfileProps {
    seller: Seller | null;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    profileForm: ProfileFormData;
    setProfileForm: React.Dispatch<React.SetStateAction<ProfileFormData>>;
    handleUpdateProfile: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    loading: boolean;
    error: string;
}