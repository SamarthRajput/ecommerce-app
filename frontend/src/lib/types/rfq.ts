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
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FORWARDED';
  deliveryDate?: Date;
  budget?: number;
  currency?: string;
  paymentTerms?: string;
  specialRequirements?: string;
  additionalNotes?: string;
  forwardedToSellers?: string[];
  trade?: string;
  chatRooms?: string[]; // Array of chat room IDs associated with the RFQ
  updatedAt: Date;
  rejectionReason?: string; // Reason for rejection if applicable
  forwardedAt?: Date; // Timestamp when the RFQ was forwarded to sellers
  createdAt: Date;
  reviewedAt?: Date;
  product: Product;
  buyer: Buyer;
  _count?: {
    messages?: number;
  };
}
/*Prisma schema for RFQ
model RFQ {
  id        String @id @default (uuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  buyerId   String
  buyer     Buyer @relation(fields: [buyerId], references: [id])

  quantity            Int
  deliveryDate        DateTime ?
    budget              Float ?
      currency            String ?
        paymentTerms        String ?
          specialRequirements String ?
            additionalNotes     String ?

              message         String ?
                status          RFQStatus
  rejectionReason String ?
    reviewedAt      DateTime ?

      forwardedToSellers RFQForward[]
  trade              Trade ?
    chatRooms          ChatRoom[]

  createdAt DateTime @default (now())
  updatedAt DateTime @default (now())
}
*/
export interface RFQStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}