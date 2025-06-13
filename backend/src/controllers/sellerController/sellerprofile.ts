// backend/src/controllers/sellerController/profile.ts

import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

// Extend the Request interface to include seller from auth middleware
interface AuthenticatedRequest extends Request {
    seller?: {
        id: string;
        email: string;
    }
}
 
const addressSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required')
})

const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    businessName: z.string().min(1, 'Business name is required'),
    businessType: z.string().min(1, 'Business type is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: addressSchema,
    taxId: z.string().min(1, 'Tax ID is required')
})

// Get seller profile
export const getSellerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const sellerId = req.seller?.id;

        if (!sellerId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const seller = await prisma.seller.findUnique({
            where: { id: sellerId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                businessName: true,
                businessType: true,
                phone: true,
                street: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                taxId: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!seller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }

        res.json({
            message: 'Profile retrieved successfully',
            seller: {
                id: seller.id,
                email: seller.email,
                firstName: seller.firstName,
                lastName: seller.lastName,
                businessName: seller.businessName,
                businessType: seller.businessType,
                phone: seller.phone,
                address: {
                    street: seller.street,
                    city: seller.city,
                    state: seller.state,
                    zipCode: seller.zipCode,
                    country: seller.country
                },
                taxId: seller.taxId,
                createdAt: seller.createdAt,
                updatedAt: seller.updatedAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update seller profile
export const updateSellerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const sellerId = req.seller?.id;

        if (!sellerId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Validate request body
        const validationResult = updateProfileSchema.safeParse(req.body);

        if (!validationResult.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
            return;
        }

        const { firstName, lastName, businessName, businessType, phone, address, taxId } = validationResult.data;

        // Check if seller exists
        const existingSeller = await prisma.seller.findUnique({
            where: { id: sellerId }
        });

        if (!existingSeller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }

        // Update seller profile
        const updatedSeller = await prisma.seller.update({
            where: { id: sellerId },
            data: {
                firstName,
                lastName,
                businessName,
                businessType,
                phone,
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
                taxId
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                businessName: true,
                businessType: true,
                phone: true,
                street: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                taxId: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json({
            message: 'Profile updated successfully',
            seller: {
                id: updatedSeller.id,
                email: updatedSeller.email,
                firstName: updatedSeller.firstName,
                lastName: updatedSeller.lastName,
                businessName: updatedSeller.businessName,
                businessType: updatedSeller.businessType,
                phone: updatedSeller.phone,
                address: {
                    street: updatedSeller.street,
                    city: updatedSeller.city,
                    state: updatedSeller.state,
                    zipCode: updatedSeller.zipCode,
                    country: updatedSeller.country
                },
                taxId: updatedSeller.taxId,
                createdAt: updatedSeller.createdAt,
                updatedAt: updatedSeller.updatedAt
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};