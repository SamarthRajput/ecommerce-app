import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { JWT_SECRET } from "../config";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                adminRole?: string;
                role: string;
                email?: string;
            };
        }
    }
}

type Role = "admin" | "seller" | "buyer";
type AllowedAdminRoles = "SUPER_ADMIN" | "ADMIN" | "INSPECTOR";

type AuthOptions = {
    allowedRoles: Role[];
    allowedAdminRoles?: AllowedAdminRoles[]; // Only applies when role === "admin"
};

export function requireAuth(options: AuthOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { allowedRoles, allowedAdminRoles = [] } = options;

        const cookieNames: { [key in Role]: string } = {
            admin: "AdminToken",
            seller: "SellerToken",
            buyer: "BuyerToken"
        };

        let authenticatedRole: Role | null = null;

        for (const role of allowedRoles) {
            const token = req.cookies?.[cookieNames[role]];

            if (!token) {
                console.warn(`[AUTH] No token found for role: ${role}`);
                continue;
            }

            try {
                const decoded = jwt.verify(token, JWT_SECRET) as {
                    buyerId?: string;
                    sellerId?: string;
                    userId?: string;
                    email?: string;
                    role?: Role;
                    adminRole?: AllowedAdminRoles;
                };

                const userId = decoded.buyerId || decoded.sellerId || decoded.userId;
                const email = decoded.email;
                const adminRole = decoded.adminRole;

                if (!userId) {
                    console.warn(`[AUTH] Token verified but user ID missing for role: ${role}`);
                    continue;
                }

                let user: any = null;

                if (role === "admin") {
                    user = await prisma.admin.findUnique({
                        where: { id: userId },
                        select: { id: true, role: true, email: true, adminRole: true }
                    });

                    if (!user) {
                        console.warn(`[AUTH] Admin user not found: ${userId}`);
                        continue;
                    }
                    const adminRole = user.adminRole;
                    // Validate admin role
                    // console.log(`[AUTH] Admin role: ${user.adminRole} and allowed roles: ${allowedAdminRoles}`);
                    if (allowedAdminRoles.length > 0 && (!adminRole || !allowedAdminRoles.includes(adminRole))) {
                        console.warn(`[AUTH] Admin role '${adminRole}' not allowed`);
                        continue;
                    }
                } else if (role === "seller") {
                    user = await prisma.seller.findUnique({
                        where: { id: userId },
                        select: { id: true, role: true, email: true }
                    });

                    if (!user) {
                        console.warn(`[AUTH] Seller user not found: ${userId}`);
                        continue;
                    }
                } else if (role === "buyer") {
                    user = await prisma.buyer.findUnique({
                        where: { id: userId },
                        select: { id: true, email: true }
                    });

                    if (!user) {
                        console.warn(`[AUTH] Buyer user not found: ${userId}`);
                        continue;
                    }

                    user.role = "buyer";
                }

                if (user) {
                    authenticatedRole = role;
                    req.user = {
                        userId: user.id,
                        email: user.email,
                        role: role,
                        ...(role === "admin" ? { adminRole } : {})
                    };
                    break;
                }
            } catch (err) {
                if (err instanceof TokenExpiredError) {
                    console.warn(`[AUTH] Token expired for role: ${role}`);
                    res.status(401).json({ error: `Session expired for ${role}. Please login again.` });
                    return;
                } else if (err instanceof JsonWebTokenError) {
                    console.warn(`[AUTH] Invalid token for role: ${role}`);
                    res.status(401).json({ error: `Invalid token for ${role}. Please login again.` });
                    return;
                } else {
                    console.error(`[AUTH] Unexpected token error for role: ${role}`, err);
                    res.status(500).json({ error: `Authentication failed due to server error.` });
                    return;
                }
            }
        }
        // console.log(`Request user: ${JSON.stringify(req.user)}, Authenticated role: ${authenticatedRole}`);
        if (!req.user || !authenticatedRole || !allowedRoles.includes(authenticatedRole)) {
            console.warn(`[AUTH] Access denied. Required roles: ${allowedRoles.join(", ")}, received role: ${authenticatedRole}`);
            res.status(403).json({ error: "Access denied. Unauthorized role or missing credentials." });
            return;
        }

        next();
    };
}
