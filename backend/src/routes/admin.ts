import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middlewares/authAdmin";

const adminRouter = Router();

// Base address: https://localhost:3001/api/v1/admin

// GET /api/v1/admin/sellers - Get all sellers
adminRouter.get('/sellers', requireAdmin, async (req: Request, res: Response) => {
    try {
        const sellers = await prisma.seller.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                businessName: true,
                businessType: true,
                phone: true,
                street: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                taxId: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json({
            success: true,
            data: sellers
        });
    } catch (error) {
        console.error('Error fetching sellers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sellers'
        });
    }
});

// GET /api/v1/admin/buyers - Get all buyers
adminRouter.get('/buyers', requireAdmin, async (req: Request, res: Response) => {
    try {
        const buyers = await prisma.buyer.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                street: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
            }
        });
        res.json({
            success: true,
            data: buyers
        });
    } catch (error) {
        console.error('Error fetching buyers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch buyers'
        });
    }
});


// Clean up Prisma connection
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export { adminRouter };