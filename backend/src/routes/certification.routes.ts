import { Router } from 'express';
import {
  requestCertification,
  createPaypalPayment,
  handlePaypalSuccess,
  issueCertificate,
  getSellerCertifications,
  getAllCertifications
} from '../controllers/certification.controller';
import { requireSeller } from '../middlewares/authSeller';
import { uploadSingleFile } from '../middlewares/multer';
import { viewCertificate } from '../controllers/certification.controller';

const router = Router();

// Base URL: http://localhost:3001/api/v1/certification

// * Seller: Request certification
router.post('/request', requireSeller, requestCertification);

// * Seller: Initiate PayPal payment
router.post('/paypal/create', createPaypalPayment);

// * PayPal: Payment success callback/webhook
router.post('/paypal/success', handlePaypalSuccess);

// * Admin: Issue certificate (PDF upload)
router.post('/issue', uploadSingleFile, issueCertificate);

// * Seller: Get own certifications
router.get('/seller/:sellerId', getSellerCertifications);

// * Seller: View certificate PDF
router.get('/view/:certificateId', requireSeller, viewCertificate);

// * Admin: Get all certification records
router.get('/all', getAllCertifications);

export default router;
