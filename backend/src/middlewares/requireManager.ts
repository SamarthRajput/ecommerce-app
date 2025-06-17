import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../routes/adminAuthRouter';

const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role?: string;
                [key: string]: any;
            };
        }
    }
}

interface User {
    id: string;
    role: string;
    email: string;
}

export async function requireManager(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // Check if user is authenticated
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access denied. Please log in as a manager.'
            });
            return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        // Check if user still exists and is admin
        const adminUser = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!adminUser || adminUser.role !== 'admin') {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Manager authentication error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during authentication.'
        });
    }
}

// Clean up Prisma connection
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});