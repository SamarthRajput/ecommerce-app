import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../config";
import { setAuthCookie } from "../utils/setAuthCookie";

interface SigninBody {
    email: string;
    password: string;
}

// Admin Signin Route
export const adminSignin = async (req: Request, res: Response) => {
    try {
        // Validate presence of body
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Invalid request body'
            });
        }

        const { email, password }: SigninBody = req.body;

        // Simple input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log(`Admin login attempt for email: ${normalizedEmail}`);

        // Fetch admin user from DB
        const admin = await prisma.admin.findUnique({
            where: { email: normalizedEmail },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
                createdAt: true
            }
        });

        // Check if admin exists
        if (!admin) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Check for admin role
        if (admin.role !== 'ADMIN') {
            console.warn(`Unauthorized login attempt by ${email} with role ${admin.role}`);
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const tokenPayload = {
            userId: admin.id,
            email: admin.email,
            role: admin.role,
            name: admin.name
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET as jwt.Secret, {
            expiresIn: '7d' // 7 days
        });

        // Set cookie
        setAuthCookie({ res, token, cookieName: 'AdminToken' });
        console.log(`Admin login successful for: ${email}`);

        // Success response
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                createdAt: admin.createdAt
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error during authentication'
        });
    }
};

// General me route
export const meRoute = async (req: Request, res: Response) => {
    try {
        console.log('Checking authentication for user...');
        const { SellerToken, BuyerToken, AdminToken } = req.cookies;

        let role: 'seller' | 'buyer' | 'admin' | null = null;
        let userId: string | null = null;

        if (SellerToken) {
            const decoded = jwt.verify(SellerToken, JWT_SECRET) as { sellerId: string };
            role = 'seller';
            userId = decoded.sellerId;
        } else if (BuyerToken) {
            const decoded = jwt.verify(BuyerToken, JWT_SECRET) as { buyerId: string };
            role = 'buyer';
            userId = decoded.buyerId;
        } else if (AdminToken) {
            const decoded = jwt.verify(AdminToken, JWT_SECRET) as { userId: string };
            role = 'admin';
            userId = decoded.userId;
        }

        if (!role || !userId) {
            console.warn('No valid authentication token found');
            return res.status(401).json({ authenticated: false });
        }

        let user = null;
        if (role === 'seller') {
            user = await prisma.seller.findUnique({
                where: { id: userId },
                select: {
                    id: true, email: true, firstName: true, lastName: true,
                    businessName: true, role: true
                }
            });
        } else if (role === 'buyer') {
            user = await prisma.buyer.findUnique({
                where: { id: userId },
                select: {
                    id: true, email: true, firstName: true, lastName: true
                }
            });
        } else if (role === 'admin') {
            user = await prisma.admin.findUnique({
                where: { id: userId },
                select: {
                    id: true, email: true, name: true, role: true, createdAt: true
                }
            });
        }

        if (!user) {
            console.warn(`User not found for ID: ${userId}, Role: ${role}`);
            // Clear the cookie if user not found
            if (role === 'seller') {
                res.clearCookie('SellerToken');
            } else if (role === 'buyer') {
                res.clearCookie('BuyerToken');
            } else if (role === 'admin') {
                res.clearCookie('AdminToken');
            }
            console.warn('Cleared cookie for invalid user session');
            return res.status(404).json({ authenticated: false, error: "User not found" });
        }

        const userResponse = {
            id: user.id,
            email: user.email,
            role: role,
            name:
                role === 'admin'
                    ? (user as { name: string }).name
                    : `${(user as { firstName: string }).firstName} ${(user as { lastName: string }).lastName}`,
            createdAt: (user as { createdAt?: Date }).createdAt || undefined,
            businessName: (user as { businessName?: string }).businessName || undefined
        };

        console.log(`User authenticated: ${userResponse.email}, Role: ${role}`);
        res.json({
            authenticated: true,
            role,
            user: userResponse
        });
    } catch (error) {
        console.error('Error in meRoute:', error);
        res.status(401).json({ authenticated: false, error: 'Unauthorized or invalid token' });
    }
};

// get all sellers
export const getAllSellers = async (req: Request, res: Response) => {
    try {
        const sellers = await prisma.seller.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
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
            success: true,
            data: sellers
        });
    } catch (error) {
        console.error('Error fetching sellers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sellers'
        });
    }
};

// get all buyers
export const getAllBuyers = async (req: Request, res: Response) => {
    try {
        const buyers = await prisma.buyer.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                street: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
            }
        });
        res.json({
            success: true,
            data: buyers
        });
    } catch (error) {
        console.error('Error fetching buyers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch buyers'
        });
    }
};

// get admin summary
export const getAdminSummary = async (req: Request, res: Response) => {
    try {
        const totalSellers = await prisma.seller.count();
        const totalBuyers = await prisma.buyer.count();
        const totalRFQs = await prisma.rFQ.count();
        const completedTrades = await prisma.trade.count({
            where: {
                status: 'COMPLETED'
            }
        });
        const pendingProducts = await prisma.product.count({
            where: {
                status: 'PENDING'
            }
        });

        const totalProducts = await prisma.product.count();

        res.json({
            success: true,
            summary: {
                totalSellers,
                totalBuyers,
                totalRFQs,
                completedTrades,
                pendingProducts,
                totalProducts
            }
        });
    } catch (error) {
        console.error('Error fetching admin summary:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch admin summary'
        });
    }
}

// get recent RFQs
export const getRecentRFQs = async (req: Request, res: Response) => {
    try {
        const recentRFQs = await prisma.rFQ.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });
        res.json({
            success: true,
            data: recentRFQs
        });
    } catch (error) {
        console.error('Error fetching recent RFQs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recent RFQs'
        });
    }
};
