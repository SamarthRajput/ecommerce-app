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