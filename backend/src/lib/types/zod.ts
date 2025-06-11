import zod from "zod";

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

export const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
})