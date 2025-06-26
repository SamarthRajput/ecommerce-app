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

// Will replace 3 different middlewares for admin, seller, and buyer with a single function in few days.
export function requireAuth(role: Role, cookieName: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.[cookieName];

            if (!token) {
                return res.status(401).json({ error: "Access denied. Token missing." });
            }

            const decoded = jwt.verify(token, JWT_SECRET) as {
                id: string;
                email?: string;
            };

            let user: any = null;

            if (role === "admin") {
                user = await prisma.user.findUnique({
                    where: { id: decoded.id },
                    select: { id: true, role: true, email: true }
                });
            } else if (role === "seller") {
                user = await prisma.seller.findUnique({
                    where: { id: decoded.id },
                    select: { id: true, role: true, email: true }
                });
            } else if (role === "buyer") {
                user = await prisma.buyer.findUnique({
                    where: { id: decoded.id },
                    select: { id: true, email: true }
                });
                if (user) {
                    user.role = "buyer";
                }
            }

            if (!user || user.role !== role) {
                return res.status(403).json({ error: `Forbidden. Must be a valid ${role}.` });
            }

            req.user = {
                userId: user.id,
                email: user.email,
                role: user.role
            };

            next();
        } catch (error) {
            console.error(`${role} authentication error:`, error);
            res.status(403).json({ error: "Invalid or expired token." });
        }
    };
}

// Will be called as :
// requireAuth("admin", "AdminToken") for admin,
// requireAuth("seller", "SellerToken") for seller,
// and requireAuth("buyer", "BuyerToken") for buyer.