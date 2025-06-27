import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

// Extend Express Request to include seller
export interface AuthenticatedRequest extends Request {
  seller?: {
    sellerId: string;
    email?: string;
  };
}

// Cookie-based authentication middleware
export const requireSeller = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.SellerToken;

    if (!token) {
      console.error("SellerToken cookie missing");
      res.status(401).json({ error: "Unauthorized: Please login" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      sellerId: string;
      email?: string;
    };

    if (!decoded?.sellerId) {
      res.status(403).json({ error: "Invalid token payload" });
      return;
    }

    req.seller = {
      sellerId: decoded.sellerId,
      email: decoded.email || "", // optional
    };

    next();
  } catch (error) {
    console.error("Seller auth error:", error);
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};
