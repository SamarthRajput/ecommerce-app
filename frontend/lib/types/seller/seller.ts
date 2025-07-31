
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

export interface Seller {
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
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type { SellerProfile };


export interface SellerResponse {
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