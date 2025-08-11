import { z } from 'zod';

export const rfqFormSchema = z.object({
  listingId: z.string(),
  quantity: z.number().positive().min(1, 'Quantity is required'),
  currency: z.string().min(1, 'Currency is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  paymentTerms: z.string().optional(),
  advancePaymentPercentage: z.number().min(0).max(100).optional(),
  cashAgainstDocumentsPercentage: z.number().min(0).max(100).optional(),
  documentsAgainstPaymentPercentage: z.number().min(0).max(100).optional(),
  documentsAgainstAcceptancePercentage: z.number().min(0).max(100).optional(),
  paymentMethod: z.enum(['TELEGRAPHIC_TRANSFER', 'LETTER_OF_CREDIT']),
  letterOfCreditDescription: z.string().optional(),
  specialRequirements: z.string().optional(),
  requestChangeInDeliveryTerms: z.boolean().optional(),
  servicesRequired: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
  message: z.string().optional()
});

export type RFQFormSchema = z.infer<typeof rfqFormSchema>;
