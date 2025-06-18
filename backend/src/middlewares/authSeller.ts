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
    // console.log("Authenticating seller...");
    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorised, please login" });
        console.error("Authorization header missing or invalid format");
        return;
    }

    // console.log("Authorization header found:", authHeader);
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as {
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
