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
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().optional(),
    phoneNumber: z.string().min(10).optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional()
})

