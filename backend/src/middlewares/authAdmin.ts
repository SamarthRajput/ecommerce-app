import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { prisma } from '../lib/prisma';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
                adminRole?: string;
                email?: string;
            };
        }
    }
}
// Define allowed admin roles
const allowedAdminRoles: string[] = ['SUPER_ADMIN', 'ADMIN', 'INSPECTOR'];

export async function requireAdmin(req: Request, res: Response, next: NextFunction, roles: string[] = allowedAdminRoles) {
    // Check if the request has a valid admin token
    // if roles are given it must be one of the adminRoles else the role should
    try {
        const token = req.cookies?.AdminToken;

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access denied. Admin token missing.'
            });
            return;
        }

        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            role: string;
            email?: string;
        };

        // Check if user exists and is an admin
        const adminUser = await prisma.admin.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                role: true,
                adminRole: true,
                email: true
            }
        });

        if (!adminUser) {
            res.status(403).json({
                success: false,
                error: 'Forbidden. You must be an admin to access this resource.'
            });
            return;
        }
        // if the adminrole is from given roles
        if (!roles.includes(adminUser.adminRole)) {
            res.status(403).json({
                success: false,
                error: 'Forbidden. You do not have permission to access this resource.'
            });
            return;
        }

        // Attach user to request
        req.user = {
            userId: adminUser.id,
            role: adminUser.role,
            adminRole: adminUser.adminRole,
            email: adminUser.email
        };

        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(403).json({
            success: false,
            error: 'Invalid or expired admin token.'
        });
    }
}
