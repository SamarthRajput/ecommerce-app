import { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";

export const tradeRouter = Router();

tradeRouter.get("/completed-trades", async (req: Request, res: Response) => {
    try {
        const completedTradesCount = await prisma.trade.count({
            where: {
                status: "COMPLETED"
            }
        })
        res.json({
            message: "Completed trades fetched",
            count: completedTradesCount
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
})