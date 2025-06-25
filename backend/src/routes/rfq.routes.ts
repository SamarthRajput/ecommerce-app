import express from 'express';
import { requireBuyer } from '../middlewares/authBuyer';
import { createRFQ, getPendingRFQs, getRFQsByBuyer } from '../controllers/rfq.controller';
import { requireAdmin } from '../middlewares/authAdmin';

const rfqRouter = express.Router();

// Post RFQ from logged in buyer
rfqRouter.post('/create', requireBuyer, createRFQ);

// Get all RFQs for a buyer
rfqRouter.get('/buyer/:buyerId', requireBuyer, getRFQsByBuyer);

// Get all pendings RFQs to admin
rfqRouter.get('/admin/pending', requireAdmin, getPendingRFQs);

// Get all details of a specific RFQ to admin


export { rfqRouter };