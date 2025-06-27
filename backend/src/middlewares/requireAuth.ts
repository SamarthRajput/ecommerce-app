// /middlewares/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { JWT_SECRET } from "../config";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
                email?: string;
            };
        }
    }
}

type Role = "admin" | "seller" | "buyer";
type AuthOptions = {
    allowedRoles: Role[];
};

export function requireAuth(options: AuthOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { allowedRoles } = options;
        const cookieNames: { [key in Role]: string } = {
            admin: "AdminToken",
            seller: "SellerToken",
            buyer: "BuyerToken"
        };
        let decodedToken: any = null;
        let authenticatedRole: Role | null = null;

        // Try decoding token for each role
        for (const role of allowedRoles) {
            const token = req.cookies?.[cookieNames[role]];
            if (!token) continue;
            console.warn(`Token found for role: ${role}, token: ${token}`);
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email?: string; role?: Role };
                if (!decoded || !decoded.userId) {
                    // remove invalid token from cookies
                    // res.clearCookie(cookieNames[role]);
                    console.error(`Invalid token for role: ${role}`);
                    continue;
                }
                console.log(`Decoded token for role: ${role}, id: ${decoded.userId} email: ${decoded.email}`);

                let user: any = null;
                if (role === "admin") {
                    user = await prisma.user.findUnique({
                        where: { id: decoded.userId },
                        select: { id: true, role: true, email: true }
                    });
                    // console.warn(`User found for admin role: ${user?.email}`);
                } else if (role === "seller") {
                    user = await prisma.seller.findUnique({
                        where: { id: decoded.userId },
                        select: { id: true, role: true, email: true }
                    });
                } else if (role === "buyer") {
                    user = await prisma.buyer.findUnique({
                        where: { id: decoded.userId },
                        select: { id: true, email: true }
                    });
                    if (user) user.role = "buyer";
                }

                if (user) {
                    // console.log(`Authenticated user found: ${user.email}, role: ${role}`);
                    authenticatedRole = role;
                    req.user = {
                        userId: user.id,
                        email: user.email,
                        role: role
                    };
                    break;
                }
            } catch (_) {
                // console.error(`Error: Invalid token for role: ${role}`);
                continue;
            }
        }

        if (!req.user || !authenticatedRole || !allowedRoles.includes(authenticatedRole)) {
            console.warn(`Unauthorized access attempt with roles: ${allowedRoles.join(", ")} and user: ${req.user?.userId}
            current role: ${authenticatedRole} name: ${req.user?.email}`);
            res.status(403).json({ error: "Forbidden. Unauthorized access." });
            return;
        }

        next();
    };
}