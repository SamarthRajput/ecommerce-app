import { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";

export const summaryRouter = Router();

// GET /api/v1/analytics/summary endpoint to get the summary
// Summary router which returns the summary of the active listing, pending rfqs, completed trade
summaryRouter.get("/", async (req: Request, res: Response) => {
    try {
        const [activeListingCount, pendingRFQsCount, completedRFQsCount, completedTradesCount, inprogressTradesCount] = await Promise.all([
            prisma.product.count({
                where: {
                    status: "ACTIVE"
                }
            }),
            prisma.rFQ.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma.rFQ.count({
                where: {
                    status: "COMPLETED"
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
            })
        ]);

        res.json({
            message: "Summary Cards data fetched successfully",
            data: {
                activeListingCount: activeListingCount,
                pendingRFQsCount: pendingRFQsCount,
                completedRFQsCount: completedRFQsCount,
                completedTradesCount: completedTradesCount,
                inprogressTradesCount: inprogressTradesCount
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