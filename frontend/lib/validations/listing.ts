import { z } from 'zod';

export const listingFormSchema = z.object({
  listingType: z.enum(['SELL', 'RENT']),
  industry: z.string().min(1, 'Industry is required'),
  category: z.string().min(1, 'Category is required'),
  condition: z.enum(['NEW', 'USED']),
  productCode: z.string().min(1, 'Product code is required'),
  productName: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  model: z.string().min(1, 'Model is required'),
  specifications: z.string().min(10, 'Specifications must be at least 10 characters'),
  hsnCode: z.string().min(1, 'HSN code is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  countryOfSource: z.string().min(1, 'Country of source is required'),
  validityPeriod: z.number().min(1, 'Validity period must be at least 1 day'),
  notes: z.string().optional(),
  images: z.array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed'),
});

export type ListingFormSchema = z.infer<typeof listingFormSchema>; 