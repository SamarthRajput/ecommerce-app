import express from 'express';
import { requireBuyer } from '../middlewares/authBuyer';
import { createRFQ, forwardRFQ, getAllRFQs, getForwardedRFQs, getRFQsByBuyer, getRFQStats, getSellerForwardedRFQs, rejectRFQ } from '../controllers/rfq.controller';
import { requireAdmin } from '../middlewares/authAdmin';
import { requireAuth } from '../middlewares/requireAuth';

const rfqRouter = express.Router();

// Base URL: http://localhost:3001/api/v1/rfq

// * Buyer Routes
rfqRouter.post('/create', requireAuth({ allowedRoles: ["buyer"] }), createRFQ);
rfqRouter.get('/buyer/:buyerId', requireBuyer, getRFQsByBuyer);

// * Admin Routes
rfqRouter.get('/all', requireAdmin, getAllRFQs);
rfqRouter.get('/forwarded', requireAdmin, getForwardedRFQs);
rfqRouter.post('/forward/:id', requireAdmin, forwardRFQ);
rfqRouter.post('/reject/:id', requireAdmin, rejectRFQ);
rfqRouter.get('/stats', requireAdmin, getRFQStats);

// * Seller Routes
rfqRouter.get('/seller/pending', requireAuth({ allowedRoles: ["seller"] }), getSellerForwardedRFQs);

export { rfqRouter };