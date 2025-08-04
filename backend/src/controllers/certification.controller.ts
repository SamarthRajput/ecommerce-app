import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authSeller';
import { prisma } from '../lib/prisma';
import cloudinary from '../config/cloudinary';

// Seller requests certification for a product
export const requestCertification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
export const createPaypalPayment = async (req: Request, res: Response): Promise<void> => {
  const { certificationId } = req.body;
  // Here, integrate with PayPal and return approval URL
  res.json({ approvalUrl: 'https://paypal.com/checkout?mock=1' });
};

// Handle PayPal payment success webhook/callback
export const handlePaypalSuccess = async (req: Request, res: Response): Promise<void> => {
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
export const issueCertificate = async (req: Request, res: Response): Promise<void> => {
  const { certificationId } = req.body;
  try {
    const cert = await prisma.certification.findUnique({
      where: { id: certificationId },
    });

    if (!cert) {
      res.status(404).json({ error: 'Certification not found.' });
      return;
    }

    // if (cert.status !== 'PAID') {
    //   res.status(400).json({ error: 'Certification must be paid before issuing certificate.' });
    //   return;
    // }

    // PDF upload
    if (!req.file) {
      res.status(400).json({ error: 'Certificate PDF file is required.' });
      return;
    }
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'certificates' },
      async (error, uploadResult) => {
        if (error || !uploadResult) {
          return res.status(500).json({ error: 'Cloudinary upload failed.' });
        }
        const updatedCert = await prisma.certification.update({
          where: { id: certificationId },
          data: {
            status: 'ISSUED',
            issuedAt: new Date(),
            certificateUrl: uploadResult.secure_url,
          },
        });
        res.json(updatedCert);
      }
    );
    result.end(req.file.buffer);
  } catch (error) {
    console.error('Issue certificate error:', error);
    res.status(500).json({ error: 'Failed to issue certificate.' });
  }
};
// Seller views certificate PDF
export const viewCertificate = async (req: Request, res: Response): Promise<void> => {
  const certificateId = req.params.certificateId;
  try {
    const cert = await prisma.certification.findUnique({
      where: { id: certificateId },
    });
    if (!cert || cert.status !== 'ISSUED') {
      res.status(404).json({ error: 'Certificate not found.' });
      return;
    }
    res.json({ certificateUrl: cert.certificateUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certificate.' });
  }
};

// Get seller certifications (for profile)
export const getSellerCertifications = async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.params.sellerId;
  const certs = await prisma.certification.findMany({
    where: { sellerId, status: 'ISSUED' },
    include: { product: true },
  });
  res.json(certs);
};

// Get all certifications (admin)
export const getAllCertifications = async (req: Request, res: Response): Promise<void> => {
  const certs = await prisma.certification.findMany({
    include: {
      seller: { select: { firstName: true, lastName: true, email: true } },
      product: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(certs);
};
