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
            orderBy: { createdAt: 'desc' }, // 
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

// Get stats for admin listing
export const getStatsForAdminListing = async (req: Request, res: Response) => {
    try {
        const pendingCount = await prisma.product.count({ where: { status: 'PENDING' } });
        const activeCount = await prisma.product.count({ where: { status: 'APPROVED' } });
        const rejectedCount = await prisma.product.count({ where: { status: 'REJECTED' } });
        const totalCount = pendingCount + activeCount + rejectedCount;

        res.status(200).json({
            success: true,
            data: {
                pending: pendingCount,
                active: activeCount,
                rejected: rejectedCount,
                total: totalCount
            }
        });
    } catch (error) {
        console.error('Error fetching stats for admin listing:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stats for admin listing'
        });
    }
}