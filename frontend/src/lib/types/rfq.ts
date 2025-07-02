import { Buyer } from "./buyer/buyer";
import { Product } from "./dashboard";

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

export interface RFQ {
  id: string;
  productId: string;
  buyerId: string;
  quantity: number;
  message?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: Date;
  reviewedAt?: Date;
  product: Product;
  buyer: Buyer;
  _count?: {
    messages?: number;
  };
}

export interface RFQStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}