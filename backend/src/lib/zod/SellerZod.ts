import { z } from 'zod';

export const registerSellerSchema = z.object({
    // Section 1: Account & Verification
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password must not exceed 32 characters'),
        // .regex(/[a-z]/, 'Must include at least one lowercase letter')
        // .regex(/[A-Z]/, 'Must include at least one uppercase letter')
        // .regex(/[0-9]/, 'Must include at least one number')
        // .regex(/[@$!%*?&]/, 'Must include at least one special character'),


    phone: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must not exceed 15 digits')
        .regex(/^\+?[0-9\s-]+$/, 'Invalid phone format'),

    countryCode: z.string().min(2).max(5),

    // Section 2: Business Profile & Address
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    businessName: z.string().min(1, 'Business name is required'),

    businessType: z.enum([
        'individual',
        'proprietorship',
        'partnership',
        'llp',
        'private_limited',
        'public_limited',
        'ngo',
        'government_entity',
        'other'
    ], { errorMap: () => ({ message: 'Invalid business type selected' }) }),

    registrationNo: z.string().optional(),
    taxId: z.string().min(1, 'Tax ID is required'),
    panOrTin: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(4, 'Zip code must be at least 4 characters'),

    website: z.string().url('Invalid website URL').optional(),
    linkedIn: z.string().url('Invalid LinkedIn URL').optional(),

    // Section 3: Documents
    govIdUrl: z.string().url().nullable().optional(),
    gstCertUrl: z.string().url().nullable().optional(),
    businessDocUrl: z.string().url().nullable().optional(),
    otherDocsUrl: z.string().url().nullable().optional(),

    // Section 4: Business Profile
    companyBio: z.string().max(1000, 'Company bio must not exceed 1000 characters').optional(),
    industryTags: z.array(z.string()).max(10, 'Maximum 10 industry tags allowed').optional(),
    keyProducts: z.array(z.string()).max(20, 'Maximum 20 products allowed').optional(),
    yearsInBusiness: z.string()
        .refine(val => /^\d+$/.test(val), { message: 'Years in business must be a number' })
        .optional(),

    // Section 5: Agreement
    agreedToTerms: z.boolean().refine(val => val === true, {
        message: 'You must agree to the Terms & Conditions'
    }),
})

export type RegisterSellerFormData = z.infer<typeof registerSellerSchema>;

export const loginSellerSchema = z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required')
});

const addressSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(4, 'Zip code must be at least 4 characters'),
    country: z.string().min(1, 'Country is required')
});

export const updateProfileSchema = z.object({
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: addressSchema
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