import { NextFunction, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    buyer?: {
        id: string,
        email: string
    }
}

export const authenticateBuyer = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    // Authorization header will in the form Bearer <token>
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.json(403).json({
            error: "No token provided"
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwtsecret") as { 
            id: string,
            email: string
        };

        // attach buyer info to request
        if(decoded){
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
    catch(error){
        console.log(error);
        res.status(403).json({ error: "Invalid or expired token" });
        return;
    }
}