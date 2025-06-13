import zod from "zod";

// Buyer signup schema
export const signupSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
    name: zod.string(),
    phoneNumber: zod.number().min(10).max(10),
    state: zod.string(),
    city: zod.string(),
    zipCode: zod.string(),
    country: zod.string()
});
// Buyer signin schemas
export const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
});
// Buyer update schemas
export const updateProfileSchema = zod.object({
    email: zod.string().email().optional(),
    password: zod.string().min(6).optional(),
    name: zod.string().optional(),
    phoneNumber: zod.number().min(10).max(10).optional(),
    state: zod.string().optional(),
    city: zod.string().optional(),
    zipCode: zod.string().optional(),
    country: zod.string().optional()
})

