import { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";

export const listingRouter = Router();

// GET /api/v1/listing/active - Get all active listings
listingRouter.get('/active', async (req: Request, res: Response) => {
    try {
        const activeListings = await prisma.product.findMany({
            where: {
                status: "APPROVED"
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        rfqs: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        console.log(`Found ${activeListings.length} active listings`);
        res.json({
            success: true,
            data: activeListings,
            count: activeListings.length
        });
    } catch (error) {
        console.error('Error fetching active listings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch active listings'
        });
    }
});
