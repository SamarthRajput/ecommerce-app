// Types for section1 for /seller/signup
export type Section1Props = {
    formData: {
        email: string;
        password: string;
        confirmPassword: string;
        phone: string;
        countryCode: string;
    };
    errors: { [key: string]: string };
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (show: boolean) => void;
    loading: boolean;
    handleInputChange: (field: string, value: any) => void;
};

// Types for section2 for /seller/signup
export type Section2Props = {
    formData: {
        firstName: string;
        lastName: string;
        businessName: string;
        businessType: string;
        taxId: string;
        registrationNo: string;
        street: string;
        city: string;
        zipCode: string;
        state: string;
        country: string;
        website: string;
        linkedIn: string;
    };
    errors: { [key: string]: string };
    handleInputChange: (field: string, value: any) => void;
    businessTypeOptions: { value: string; label: string }[];
    industryOptions: string[];
    yearsInBusinessOptions: { value: number; label: string }[];
};

// Types for section3 for /seller/signup
export type Section3Props = {
    formData: {
        govIdUrl: string | null;
        gstCertUrl: string | null;
        businessDocUrl: string | null;
        businessType: string;
        otherDocsUrl: string | null;
    };
    errors: { [key: string]: string };
    handleInputChange: (field: string, value: any) => void;
    handleFileUpload: (field: string, file: File | null) => void;
};

// Interface FormData for section4 for /seller/signup
export interface FormData {
    email: string;
    companyBio: string;
    industryTags: string[];
    yearsInBusiness: number;
    keyProducts: string[];
}

// Interface for section4 for /seller/signup
export interface Section4Props {
    formData: FormData;
    errors: Record<string, string>;
    handleInputChange: (field: string, value: any) => void;
    industryOptions: string[];
    yearsInBusinessOptions: { value: number; label: string }[];
}

// Types for section5 for /seller/signup
export type Section5Props = {
    formData: {
        businessName: string;
        email: string;
        phone: string;
        countryCode: string;
        businessType: string;
        city: string;
        state: string;
        industryTags: string[];
        agreedToTerms: boolean;
    };
    errors: { [key: string]: string };
    handleInputChange: (field: string, value: any) => void;
    businessTypeOptions: { value: string; label: string }[];
};