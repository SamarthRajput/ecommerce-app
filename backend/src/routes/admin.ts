import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middlewares/authAdmin";
import { getAdminSummary, getAllBuyers, getAllSellers, getRecentRFQs } from "../controllers/adminController";
import { getRecentChats } from "../controllers/chatMessageController";
import bcrypt from "bcryptjs";

const adminRouter = Router();

// Base address: https://localhost:3001/api/v1/admin

// GET /api/v1/admin/sellers - Get all sellers
adminRouter.get('/sellers', requireAdmin, async (req: Request, res: Response) => {
    await getAllSellers(req, res);
});

// GET /api/v1/admin/buyers - Get all buyers
adminRouter.get('/buyers', requireAdmin, async (req: Request, res: Response) => {
    await getAllBuyers(req, res);
});

// GET /api/v1/admin/summary - Get admin summary (sellers, buyers, total RFQs etc)
adminRouter.get('/dashboard-summary', requireAdmin, async (req: Request, res: Response) => {
    await getAdminSummary(req, res);
});

// GET /api/v1/admin/rfqs/recent - Get recent RFQs
adminRouter.get('/rfqs/recent', requireAdmin, async (req: Request, res: Response) => {
    await getRecentRFQs(req, res);
});

// GET /api/v1/admin/chats/recent - Get recent chats
adminRouter.get('/chats/recent', requireAdmin, async (req: Request, res: Response) => {
    await getRecentChats(req, res);
});


// Clean up Prisma connection
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export { adminRouter };
