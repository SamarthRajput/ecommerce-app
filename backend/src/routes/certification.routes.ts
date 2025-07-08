import { Router } from 'express';
import {
  requestCertification,
  createPaypalPayment,
  handlePaypalSuccess,
  issueCertificate,
  getSellerCertifications,
  getAllCertifications,
} from '../controllers/certification.controller';
import { requireSeller } from '../middlewares/authSeller';

const router = Router();

// Seller requests certification
router.post('/request', requireSeller, requestCertification);
// Seller initiates PayPal payment
router.post('/paypal/create', createPaypalPayment);
// PayPal payment success webhook/callback
router.post('/paypal/success', handlePaypalSuccess);
// Admin issues certificate
router.post('/issue', issueCertificate);
// Get seller certifications (for profile)
router.get('/seller/:sellerId', getSellerCertifications);
// Admin: get all certifications
router.get('/all', getAllCertifications);

export default router;
