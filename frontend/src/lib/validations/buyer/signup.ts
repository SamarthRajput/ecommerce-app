import { z } from "zod";

// Zod validation schema, for buyer signup schema
export const buyerSignUpSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password must be at least 1 characters'), 
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
    phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number'),
    street: z.string().min(1, 'Street address is required').max(200, 'Address too long'),
    city: z.string().min(1, 'City is required').max(50, 'City name too long'),
    state: z.string().min(1, 'State is required').max(50, 'State name too long'),
    zipCode: z.string().min(1, 'Zip code is required').max(20, 'Zip code too long'),
    country: z.string().min(1, 'Country is required').max(50, 'Country name too long'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export type RegistrationData = z.infer<typeof buyerSignUpSchema>;
