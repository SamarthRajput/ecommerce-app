import { z } from 'zod';

export const rfqFormSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  specialRequirements: z.string().optional(),
  budget: z.number().min(0, 'Budget must be a positive number'),
  currency: z.string().min(1, 'Currency is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  additionalNotes: z.string().optional(),
});

export type RFQFormSchema = z.infer<typeof rfqFormSchema>; 