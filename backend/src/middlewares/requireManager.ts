import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                [key: string]: any;
            };
        }
    }
}

export async function requireManager(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user || !req.user.userId) {
            res.status(401).json({ error: 'Unauthorized. User not authenticated.' });
            return;
        }
        const { userId } = req.user;

        const user = await prisma.seller.findUnique({
            where: { id: userId }
        });

        if (!user || user.role !== 'admin') {
            res.status(403).json({
                error: 'Access denied. Manager role required.'
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Manager auth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
} 