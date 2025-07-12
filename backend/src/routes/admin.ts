import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middlewares/authAdmin";
import {
    getAdminSummary,
    getAllAdmins,
    getAllBuyers,
    getAllSellers,
    getRecentRFQs
} from "../controllers/adminController";
import { getRecentChats } from "../controllers/chatMessageController";
import { requireAuth } from "../middlewares/requireAuth";
import asyncHandler from "../utils/asyncHandler";
import { approveSeller, createAdmin, deleteAdmin, deleteBuyer, updateAdmin } from "../controllers/userManagementController";

const adminRouter = Router();

// Base URL: http://localhost:3001/api/v1/admin

// * Sellers
adminRouter.get('/sellers', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN", "ADMIN"] }), asyncHandler(getAllSellers));
adminRouter.get('/buyers', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN", "ADMIN"] }), asyncHandler(getAllBuyers));
adminRouter.get('/admins', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN"] }), asyncHandler(getAllAdmins));
adminRouter.post('/admins', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN"] }), asyncHandler(createAdmin));
adminRouter.put('/admins/:id', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN"] }), asyncHandler(updateAdmin));
adminRouter.delete('/admins/:id', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN"] }), asyncHandler(deleteAdmin));
adminRouter.delete('/buyers/:id', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN"] }), asyncHandler(deleteBuyer));
adminRouter.post('/sellers/:id/approve', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN"] }), asyncHandler(approveSeller));

// * Admin Dashboard Summary
adminRouter.get('/dashboard-summary', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN", "ADMIN","INSPECTOR"] }), asyncHandler(getAdminSummary));

// * Recent RFQs
adminRouter.get('/rfqs/recent', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN"] }), asyncHandler(getRecentRFQs));

// * Recent Chats
adminRouter.get('/chats/recent', requireAuth({ allowedRoles: ["admin"], allowedAdminRoles: ["SUPER_ADMIN", "ADMIN"] }), asyncHandler(getRecentChats));

// * Graceful Shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export { adminRouter };
