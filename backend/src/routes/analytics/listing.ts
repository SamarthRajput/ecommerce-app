import { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";

export const listingRouter = Router();

listingRouter.get("/active-listing", async (req: Request, res: Response) => {
    try {
        const activeListingCount = await prisma.product.count({
            where: {
                status: "ACTIVE"
            }
            // we can return the active status listing for a particular seller also 
        });
        res.json({
            message: "Active listing count fetched",
            count: activeListingCount
        });
    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});