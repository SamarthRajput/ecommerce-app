import { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import { apiLimiter } from "../../utils/rateLimit";

export const summaryRouter = Router();

// GET /api/v1/analytics/summary endpoint to get the summary
// Summary router which returns the summary of the active listing, pending rfqs, completed trade
summaryRouter.get("/", apiLimiter, async (req: Request, res: Response) => {
    try {
        const [pendingRFQsCount, completedRFQsCount, rejectedRFQsCount, completedTradesCount, inprogressTradesCount, activeListingCount,
            approvedListingCount, archivedListingCount, inactiveListingCount, pendingListingCount, rejectedListingCount
        ] = await Promise.all([
            prisma.rFQ.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma.rFQ.count({
                where: {
                    status: 'APPROVED'
                }
            }),
            prisma.rFQ.count({
                where: {
                    status: "REJECTED"
                }
            }),
            prisma.trade.count({
                where: {
                    status: "COMPLETED"
                }
            }),
            prisma.trade.count({
                where: {
                    status: "IN_PROGRESS"
                }
            }),
            prisma.product.count({
                where: {
                    status: "ACTIVE"
                }
            }),
            prisma.product.count({
                where: {
                    status: "APPROVED"
                }
            }),
            prisma.product.count({
                where: {
                    status: "ARCHIVED"
                }
            }),
            prisma.product.count({
                where: {
                    status: "INACTIVE"
                }
            }),
            prisma.product.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma.product.count({
                where: {
                    status: "REJECTED"
                }
            }),
        ]);

        res.json({
            message: "Summary Cards data fetched successfully",
            data: {
                pendingRFQsCount: pendingRFQsCount,
                completedRFQsCount: completedRFQsCount,
                rejectedRFQsCount: rejectedRFQsCount,
                completedTradesCount: completedTradesCount,
                inprogressTradesCount: inprogressTradesCount,
                activeListingCount: activeListingCount,
                approvedListingCount: approvedListingCount,
                archivedListingCount: archivedListingCount, 
                inactiveListingCount: inactiveListingCount, 
                pendingListingCount: pendingListingCount, 
                rejectedListingCount: rejectedListingCount
            }
        });
    }
    catch(error){
        console.log(error);
        res.status(401).json({
            message: "Internal server error"
        })
    }
});