export interface RFQFormData {
  listingId: string;
  quantity: number;
  deliveryDate: string;
  specialRequirements: string;
  budget: number;
  currency: string;
  paymentTerms: string;
  additionalNotes: string;
}

export interface RFQFormErrors {
  [key: string]: string;
} 