import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    buyer?: {
        id: string;
        email?: string;
    };
}

export const requireBuyer = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const JWT_SECRET = process.env.JWT_SECRET as string;

    const token = req.cookies?.BuyerToken;

    if (!token) {
        res.status(401).json({
            error: "Unauthorized: Buyer token missing"
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            buyerId: string;
            email?: string;
        };

        if (!decoded?.buyerId) {
            res.status(403).json({ error: "Invalid token: buyerId missing" });
            return;
        }

        req.buyer = {
            id: decoded.buyerId,
            email: decoded.email || ""
        };

        next();
    } catch (error) {
        console.error("Buyer auth error:", error);
        res.status(403).json({ error: "Invalid or expired token" });
        return;
    }
};
