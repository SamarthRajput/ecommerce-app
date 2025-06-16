import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireManager } from "../middlewares/requireManager";

const prisma = new PrismaClient();

export const listingRouter = Router();

listingRouter.get('/pending', async (req, res) => {
    try {
        const pendingListings = await prisma.product.findMany({
            where: {
                status: 'INACTIVE'
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
            }, // Include seller details and count of RFQs
            orderBy: {
                id: 'desc'
            } // Order by id descending
        });

        res.json({
            success: true,
            data: pendingListings,
            count: pendingListings.length
        });
        return;
    } catch (error) {
        console.error('Error fetching pending listings:', error);
        res.status(500).json({
            error: 'Failed to fetch pending listings'
        });
        return;
    }
});

