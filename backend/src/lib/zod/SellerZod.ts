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
