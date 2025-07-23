import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { parsePagination } from "../utils/parsePagination";

// Get all listings
export const getAllListings = async (req: Request, res: Response) => {
    const { take, skip } = parsePagination(req.query);
    try {
        const listings = await prisma.product.findMany({
            include: {
                seller: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        businessName: true
                    }
                },
                rfqs: {
                    select: {
                        id: true,
                        quantity: true,
                        message: true,
                        status: true,
                        createdAt: true,
                        buyer: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                _count: {
                    select: { rfqs: true }
                }
            },
            orderBy: { id: 'desc' },
            take,
            skip
        });

        res.status(200).json({
            success: true,
            message: 'Listings fetched successfully',
            data: listings,
            count: await prisma.product.count(),
            pagination: {
                total: await prisma.product.count(),
                page: skip / take + 1,
                pageSize: take,
                hasNextPage: (skip + take) < (await prisma.product.count())
            }
        });
        return;
    } catch (error) {
        console.error('Error fetching pending listings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pending listings'
        });
        return;
    }
}
