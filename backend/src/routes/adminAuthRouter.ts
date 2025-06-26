import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { adminSignin, meRoute } from "../controllers/adminController";
import { requireAdmin } from "../middlewares/authAdmin";

export const authRouter = Router();

// POST /api/v1/auth/admin/signin - Admin login
authRouter.post('/admin/signin', async (req: Request, res: Response) => {
    await adminSignin(req, res);
});


// POST /api/v1/auth/admin/logout - Admin logout
authRouter.post('/admin/logout', requireAdmin, async (req: Request, res: Response) => {
    res.clearCookie('AdminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/" // Ensure the path matches where the cookie was set
    });
    res.status(200).json({ message: "Logged out successfully" });
});


// /api/v1/auth/me - Get current Logged-in User
authRouter.get('/me', async (req: Request, res: Response) => {
    await meRoute(req, res);
});


// Clean up Prisma connection
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});