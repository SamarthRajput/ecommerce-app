import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';


export async function isAdminLoggedIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    const JWT_SECRET = process.env.JWT_SECRET as string || 'jwtsecret';
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

    try {
        // get token from headers
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access denied. Please log in as an admin.'
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
        // Attach user info to request object
        req.user = {
            userId: adminUser.id,
            role: adminUser.role,
            email: adminUser.email,
            name: adminUser.name,
            createdAt: adminUser.createdAt
        };
        next();
    } catch (error) {
        console.error('Admin authentication error:', error);
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
}