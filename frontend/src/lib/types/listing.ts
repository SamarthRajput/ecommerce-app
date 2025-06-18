
export type ListingType = 'SELL' | 'RENT';

export type ProductCondition = 'NEW' | 'USED';

export interface ListingFormData {
  listingType: ListingType;
  industry: string;
  category: string;
  condition: ProductCondition;
  productCode: string;
  productName: string;
  description: string;
  model: string;
  specifications: string;
  hsnCode: string;
  quantity: number;
  countryOfSource: string;
  validityPeriod: number; // in days
  notes: string;
  images: File[];
}

export interface ListingFormErrors {
  [key: string]: string;
}

export interface Stats {
  pending: number;
  active: number;
  rejected: number;
  total: number;
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

export interface Listing {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE' | string;
  quantity?: number;
  seller: Seller;
  images: string[];
  _count: {
    rfqs: number;
  };
};
