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

        let authenticatedRole: Role | null = null;

        for (const role of allowedRoles) {
            const token = req.cookies?.[cookieNames[role]];
            if (!token) continue;

            try {
                const decoded = jwt.verify(token, JWT_SECRET) as {
                    buyerId?: string;
                    sellerId?: string;
                    userId?: string;
                    email?: string;
                    role?: Role;
                };

                // Choose the appropriate ID based on role
                const userId = decoded.buyerId || decoded.sellerId || decoded.userId;
                const email = decoded.email;

                console.log(`Decoded token for role: ${role}, id: ${userId} email: ${email}`);

                if (!userId) continue;

                let user: any = null;
                if (role === "admin") {
                    user = await prisma.user.findUnique({
                        where: { id: userId },
                        select: { id: true, role: true, email: true }
                    });
                } else if (role === "seller") {
                    user = await prisma.seller.findUnique({
                        where: { id: userId },
                        select: { id: true, role: true, email: true }
                    });
                } else if (role === "buyer") {
                    user = await prisma.buyer.findUnique({
                        where: { id: userId },
                        select: { id: true, email: true }
                    });
                    if (user) user.role = "buyer";
                }

                if (user) {
                    authenticatedRole = role;
                    req.user = {
                        userId: user.id,
                        email: user.email,
                        role: role
                    };
                    break;
                }
            } catch (err) {
                console.warn(`Invalid token for role: ${role}`, err);
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