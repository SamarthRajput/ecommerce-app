import express from 'express';
import { requireBuyer } from '../middlewares/authBuyer';
import { approveRFQ, createRFQ, getApprovedRFQs, getPendingRFQs, getRFQsByBuyer, getRFQStats, rejectRFQ } from '../controllers/rfq.controller';
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
rfqRouter.get('/approved', requireAdmin, getApprovedRFQs);
rfqRouter.post('/approve/:id', requireAdmin, approveRFQ);
rfqRouter.post('/reject/:id', requireAdmin, rejectRFQ);
rfqRouter.get('/stats', requireAdmin, getRFQStats);



export { rfqRouter };