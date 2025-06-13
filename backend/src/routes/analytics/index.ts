import { Router } from "express";
import { summaryRouter } from "./summary";
import { listingRouter } from "./listing";
import { tradeRouter } from "./trade";
import { rfqRouter } from "./rfq";

export const analyticsRouter = Router();

// any request that comes to /api/v1/analytics/summary/.. will go to this router
analyticsRouter.use("/summary", summaryRouter);

// any request that comes to /api/v1/analytics/listing/.. will go to this router
analyticsRouter.use("/listing", listingRouter);

// any request that comes to /api/v1/analytics/trade/.. will go to this router 
analyticsRouter.use("/trade", tradeRouter);

// any request that comes to /api/v1/analytics/rfq/.. will go to this router
// RFQ -> request for quotation
analyticsRouter.use("/rfq", rfqRouter);
