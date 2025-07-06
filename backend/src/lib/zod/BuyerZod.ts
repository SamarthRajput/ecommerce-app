import { z } from "zod";


// Buyer signup schema
export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string().min(10),
    street: z.string(),
    state: z.string(),
    city: z.string(),
    zipCode: z.string(),
    country: z.string()
});
// Buyer signin schemas
export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

// Buyer update schemas
export const updateProfileSchema = z.object({
    password: z.string().min(8).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phoneNumber: z.string().min(10).optional(),
    street: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    zipCode: z.string().min(1).optional(),
    country: z.string().min(1).optional()
});

