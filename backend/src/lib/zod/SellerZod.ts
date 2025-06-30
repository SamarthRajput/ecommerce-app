import { z } from "zod"

// Zod validation schemas
export const addressSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required')
});

export const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    businessName: z.string().min(1, 'Business name is required'),
    businessType: z.string().min(1, 'Business type is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: addressSchema,
    taxId: z.string().min(1, 'Tax ID is required')
});

export const registerSellerSchema = z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    profile: profileSchema
});

export const loginSellerSchema = z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    businessName: z.string().min(1, 'Business name is required'),
    businessType: z.string().min(1, 'Business type is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: addressSchema,
    taxId: z.string().min(1, 'Tax ID is required')
});

export const listingFormSchema = z.object({
    listingType: z.string().min(1, 'Listing type is required'),
    industry: z.string().min(1, 'Industry is required'),
    category: z.string().min(1, 'Category is required'),
    condition: z.string().min(1, 'Condition is required'),
    productCode: z.string().min(1, 'Product code is required'),
    productName: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Description is required'),
    model: z.string().min(1, 'Model is required'),
    specifications: z.string().min(1, 'Specifications are required'),
    hsnCode: z.string().min(1, 'HSN code is required'),
    quantity: z.number().int().nonnegative('Quantity must be a non-negative integer'),
    countryOfSource: z.string().min(1, 'Country of source is required'),
    validityPeriod: z.number().min(1, 'Validity period is required'),
    notes: z.string().optional(),
    images: z.array(z.string().url('Image URL must be valid'))
        .min(1, 'At least one image is required')
        .max(5, 'Maximum 5 images allowed'),
});