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
export const requireSeller = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;
    
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorised, please login" });
      console.error("Authorization header missing or invalid format");
      return;
    }

    // console.log("Authorization header found:", authHeader);
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
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
