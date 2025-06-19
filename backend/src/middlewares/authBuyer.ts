import { NextFunction, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    buyer?: {
        id: string,
        email: string
    }
}

export const authenticateBuyer = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const JWT_SECRET = process.env.JWT_SECRET as string || 'jwtsecret';
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

    const authHeader = req.headers.authorization;

    // Authorization header will in the form Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.json(403).json({
            error: "No token provided"
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string,
            email: string
        };

        // attach buyer info to request
        if (decoded) {
            req.buyer = {
                id: decoded.id,
                email: decoded.email
            }
            next();
        }
        else {
            res.status(403).json({ error: "Invalid token: buyerId missing" });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ error: "Invalid or expired token" });
        return;
    }
}