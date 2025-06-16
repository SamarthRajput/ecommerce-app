
interface SellerProfile {
    id: string;
    email: string;
    profile: {
        firstName: string;
        lastName: string;
        businessName: string;
        businessType: string;
        phone: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
        taxId: string;
    };
}

export type { SellerProfile };