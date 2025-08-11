import express from 'express';
import { requireBuyer } from '../middlewares/authBuyer';
import { createRFQ, forwardRFQ, getAllRFQs, getForwardedRFQs, getListingInfoForRfq, getRFQsByBuyer, getRFQStats, getSellerForwardedRFQs, rejectRFQ } from '../controllers/rfq.controller';
import { requireAdmin } from '../middlewares/authAdmin';
import { requireAuth } from '../middlewares/requireAuth';
import asyncHandler from '../utils/asyncHandler';

const rfqRouter = express.Router();

// Base URL: http://localhost:3001/api/v1/rfq

// * Buyer Routes
// rfqRouter.post('/create',asyncHandler(createRFQ));
rfqRouter.post('/create', requireAuth({ allowedRoles: ["buyer"] }), asyncHandler(createRFQ));
rfqRouter.post('/info/:id', requireAuth({ allowedRoles: ["buyer"] }), asyncHandler(getListingInfoForRfq));
rfqRouter.get('/buyer/:buyerId', requireBuyer, asyncHandler(getRFQsByBuyer));

// * Admin Routes
rfqRouter.get('/all', requireAdmin, asyncHandler(getAllRFQs));
rfqRouter.get('/forwarded', requireAdmin, asyncHandler(getForwardedRFQs));
rfqRouter.post('/forward/:id', requireAdmin, asyncHandler(forwardRFQ));
rfqRouter.post('/reject/:id', requireAdmin, asyncHandler(rejectRFQ));
rfqRouter.get('/stats', requireAdmin, asyncHandler(getRFQStats));

// * Seller Routes
rfqRouter.get('/seller/pending', requireAuth({ allowedRoles: ["seller"] }), asyncHandler(getSellerForwardedRFQs));

export { rfqRouter };