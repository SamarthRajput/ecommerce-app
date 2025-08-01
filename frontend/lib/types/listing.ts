// types/product-form.ts
import { z } from 'zod';

// Zod validation schema
export const productSchema = z.object({
  // Product Basics
  name: z.string().min(3, "Product name must be at least 3 characters"),
  slug: z.string().optional(),
  productCode: z.string().min(1, "Product code is required"),
  model: z.string().min(1, "Model is required"),
  category: z.string().min(1, "Category is required"),
  industry: z.string().min(1, "Industry is required"),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED', 'CUSTOM']),
  listingType: z.enum(['SELL', 'LEASE', 'RENT']),
  description: z.string().min(10, "Description must be at least 10 characters"),

  // Pricing & Quantity
  price: z.number().min(0.01, "Price must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  minimumOrderQuantity: z.number().min(1, "Minimum order quantity must be at least 1"),

  // Logistics & Validity
  deliveryTimeInDays: z.number().min(1, "Delivery time must be at least 1 day"),
  logisticsSupport: z.enum(['SELF', 'INTERLINK', 'BOTH']),
  countryOfSource: z.string().min(1, "Country of source is required"),
  validityPeriod: z.number().min(1, "Validity period must be at least 1 day"),

  // Product Details
  specifications: z.string().min(10, "Specifications must be at least 10 characters"),
  hsnCode: z.string().min(1, "HSN code is required"),
  warrantyPeriod: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  licenses: z.array(z.string()).optional(),

  // Media & Attachments
  images: z.array(z.any()).min(1, "At least one image is required").max(5, "Maximum 5 images allowed"),
  // brochureUrl: z.string().url().optional().nullable(),
  brochureUrl: z.string().url().or(z.literal("")).or(z.literal(null)).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),

  // SEO & Tagging
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),

  // Terms (only required in create mode)
  agreedToTerms: z.boolean().optional()
});

// Create a conditional schema for edit mode
export const createProductSchema = productSchema.extend({
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to terms and conditions")
});

export type ProductFormData = z.infer<typeof productSchema>;
export type CreateProductFormData = z.infer<typeof createProductSchema>;

// Constants
export const CURRENCIES = [
  { value: 'INR', label: '₹ INR' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' }
];

export const CATEGORIES = [
  'Electronics', 'Machinery', 'Textiles', 'Chemicals', 'Food & Beverages',
  'Automotive', 'Construction', 'Healthcare', 'Agriculture', 'Other'
];

export const INDUSTRIES = [
  'Manufacturing', 'Technology', 'Healthcare', 'Agriculture', 'Construction',
  'Automotive', 'Textiles', 'Food Processing', 'Chemical', 'Other'
];

export const COUNTRIES = [
  'India', 'United States', 'China', 'Germany', 'Japan', 'United Kingdom',
  'France', 'Italy', 'South Korea', 'Canada', 'Other'
];

// Form steps configuration
export const FORM_STEPS = [
  { id: 1, title: 'Product Basics', description: 'Basic product information' },
  { id: 2, title: 'Pricing & Quantity', description: 'Pricing and stock details' },
  { id: 3, title: 'Logistics & Validity', description: 'Shipping and validity' },
  { id: 4, title: 'Product Details', description: 'Specifications and certifications' },
  { id: 5, title: 'Media & Attachments', description: 'Images and documents' },
  { id: 6, title: 'SEO & Tagging', description: 'Tags and keywords' },
  { id: 7, title: 'Review & Submit', description: 'Review and submit' }
];

export interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData, isDraft?: boolean) => Promise<void>;
  onCancel?: () => void;
}