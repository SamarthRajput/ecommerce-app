import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from "express";

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
        // if (!req.user || !req.user.userId) {
        //     res.status(401).json({
        //         success: false,
        //         error: 'Unauthorized. User not authenticated.'
        //     });
        //     return;
        // }

        // const { userId } = req.user;

        // // Validate userId format
        // if (typeof userId !== 'string' || userId.trim() === '') {
        //     res.status(401).json({
        //         success: false,
        //         error: 'Invalid user ID format.'
        //     });
        //     return;
        // }

        // // Find user in database
        // const user = await prisma.seller.findUnique({
        //     where: { id: userId.trim() },
        //     select: {
        //         id: true,
        //         role: true,
        //         email: true
        //     }
        // });

        // // Check if user exists
        // if (!user) {
        //     res.status(401).json({
        //         success: false,
        //         error: 'User not found.'
        //     });
        //     return;
        // }

        // // Check if user has manager/admin role
        // if (!user.role || user.role !== 'admin') {
        //     res.status(403).json({
        //         success: false,
        //         error: 'Access denied. Manager role required.'
        //     });
        //     return;
        // }

        // // Add user info to request for downstream use
        // req.user = {
        //     ...req.user,
        //     role: user.role,
        //     email: user.email
        // };

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