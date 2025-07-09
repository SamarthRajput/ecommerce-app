import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authSeller';
import { prisma } from '../lib/prisma';
// import PayPal SDK 

// Seller requests certification for a product
export const requestCertification = async (req: AuthenticatedRequest, res: Response) => {
  const { productId, amount } = req.body;
  const sellerId = req.seller?.sellerId;

  try {
    // Check if already requested
    if (sellerId) {
      const existing = await prisma.certification.findUnique({
        where: {
          sellerId_productId: {
            sellerId, productId
          }
        },
      });
      if (existing) {
        res.status(400).json({ message: 'Certification already requested.' });
        return;
      }
    }
    const cert = await prisma.certification.create({
      data: {
        sellerId: sellerId as string,
        productId,
        amount,
        status: 'PENDING'
      },
    });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to request certification.' });
  }
};

// Create PayPal payment (mock, to be replaced with real PayPal logic)
export const createPaypalPayment = async (req: Request, res: Response) => {
  const { certificationId } = req.body;
  // Here, integrate with PayPal and return approval URL
  // For now, just mock
  res.json({ approvalUrl: 'https://paypal.com/checkout?mock=1' });
};

// Handle PayPal payment success webhook/callback
export const handlePaypalSuccess = async (req: Request, res: Response) => {
  const { certificationId, paymentId } = req.body;
  try {
    await prisma.certification.update({
      where: { id: certificationId },
      data: { status: 'PAID', paymentId },
    });
    res.json({ message: 'Payment recorded.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment.' });
  }
};

// Admin issues certificate
export const issueCertificate = async (req: Request, res: Response) => {
  const { certificationId, certificateUrl } = req.body;
  try {
    const cert = await prisma.certification.update({
      where: { id: certificationId },
      data: { status: 'ISSUED', issuedAt: new Date(), certificateUrl },
    });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to issue certificate.' });
  }
};

// Get seller certifications (for profile)
export const getSellerCertifications = async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId;
  const certs = await prisma.certification.findMany({
    where: { sellerId, status: 'ISSUED' },
    include: { product: true },
  });
  res.json(certs);
};

// Get all certifications (admin)
export const getAllCertifications = async (req: Request, res: Response) => {
  const certs = await prisma.certification.findMany({
    include: {
      seller: { select: { firstName: true, lastName: true, email: true } },
      product: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(certs);
};
