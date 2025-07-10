import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middlewares/authAdmin";
import {
    getAdminSummary,
    getAllBuyers,
    getAllSellers,
    getRecentRFQs
} from "../controllers/adminController";
import { getRecentChats } from "../controllers/chatMessageController";

const adminRouter = Router();

// Base URL: http://localhost:3001/api/v1/admin

// * Sellers
adminRouter.get('/sellers', requireAdmin, async (req: Request, res: Response) => {
    await getAllSellers(req, res);
});

// * Buyers
adminRouter.get('/buyers', requireAdmin, async (req: Request, res: Response) => {
    await getAllBuyers(req, res);
});

// * Admin Dashboard Summary
adminRouter.get('/dashboard-summary', requireAdmin, async (req: Request, res: Response) => {
    await getAdminSummary(req, res);
});

// * Recent RFQs
adminRouter.get('/rfqs/recent', requireAdmin, async (req: Request, res: Response) => {
    await getRecentRFQs(req, res);
});

// * Recent Chats
adminRouter.get('/chats/recent', requireAdmin, async (req: Request, res: Response) => {
    await getRecentChats(req, res);
});

// * Graceful Shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export { adminRouter };
