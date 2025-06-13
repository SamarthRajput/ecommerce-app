import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to include seller
export interface AuthenticatedRequest extends Request {
  seller?: {
    id: string;
    email: string;
  };
}

// authenticate Seller middleware
export const authenticateSeller = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwtsecret") as {
      id: string;
      email: string;
    };

    // Attach seller info to request
    req.seller = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};
