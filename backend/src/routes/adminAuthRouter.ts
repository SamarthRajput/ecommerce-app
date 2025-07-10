import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { adminSignin, meRoute } from "../controllers/adminController";
import { requireAdmin } from "../middlewares/authAdmin";
import { apiLimiter } from "../utils/rateLimit";
import { clearAuthCookies } from "../utils/clearAuthCookies";
import asyncHandler from "../utils/asyncHandler";

export const authRouter = Router();

// Base URL: http://localhost:3001/api/v1/auth

// * Admin Login
authRouter.post('/admin/signin', apiLimiter, asyncHandler(adminSignin));

// * Admin Logout
authRouter.post('/admin/logout', requireAdmin, (req: Request, res: Response) => {
    clearAuthCookies(res);
    res.status(200).json({ message: "Logged out successfully" });
});

// * Get current logged-in user info
authRouter.get('/me', asyncHandler(meRoute));

// * Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
