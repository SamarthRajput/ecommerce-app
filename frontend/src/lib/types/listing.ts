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

export interface Seller {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
}

export interface Listing {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  createdAt: string;
  seller: Seller;
  _count: { rfqs: number };
}

export interface Stats {
  pending: number;
  active: number;
  rejected: number;
  total: number;
}