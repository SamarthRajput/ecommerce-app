import express from 'express';
import { requireBuyer } from '../middlewares/authBuyer';
import { createRFQ, forwardRFQ, getForwardedRFQs, getPendingRFQs, getRFQsByBuyer, getRFQStats, getSellerForwardedRFQs, rejectRFQ } from '../controllers/rfq.controller';
import { requireAdmin } from '../middlewares/authAdmin';
import { requireAuth } from '../middlewares/requireAuth';

const rfqRouter = express.Router();

// Base url: http://localhost:3001/api/v1/rfq


// Post RFQ from logged in buyer
rfqRouter.post('/create', requireAuth({ allowedRoles: ["buyer"] }), createRFQ);

// Get all RFQs for a buyer
rfqRouter.get('/buyer/:buyerId', requireBuyer, getRFQsByBuyer);

// Admin routes
rfqRouter.get('/pending', requireAdmin, getPendingRFQs);
rfqRouter.get('/forwarded', requireAdmin, getForwardedRFQs);
rfqRouter.post('/forward/:id', requireAdmin, forwardRFQ); // Changed from approveRFQ to forwardRFQ
rfqRouter.post('/reject/:id', requireAdmin, rejectRFQ);
rfqRouter.get('/stats', requireAdmin, getRFQStats);

// Get all RFQs for a Seller
rfqRouter.get('/seller/pending', requireAuth({ allowedRoles: ["seller"] }), getSellerForwardedRFQs);



export { rfqRouter };