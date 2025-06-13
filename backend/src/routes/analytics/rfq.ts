import { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";

export const rfqRouter = Router();

rfqRouter.get("/pending-rfq", async (req: Request, res: Response) => {
    try {
        const pendingRFQsCount = await prisma.rFQ.count({
            where: {
                status: "PENDING"
            }
        });
        // we can do pending rfq for particular seller and buyer also

        res.status(200).json({
            message: "Pending RFQs count fetched",
            count: pendingRFQsCount
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }

})