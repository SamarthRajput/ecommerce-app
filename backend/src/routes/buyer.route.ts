import { Request, Response, Router } from "express";
import {
    forgotPassword,
    getBuyerProfile,
    signinBuyer,
    signupBuyer,
    updateBuyerProfile,
    updatePassword
} from "../controllers/buyerController";
import { AuthenticatedRequest, requireBuyer } from "../middlewares/authBuyer";
import { apiLimiter } from "../utils/rateLimit";
import { clearAuthCookies } from "../utils/clearAuthCookies";
import asyncHandler from "../utils/asyncHandler";

export const buyerRouter = Router();

// Base URL: http://localhost:3001/api/v1/buyer

// * Auth Routes
buyerRouter.post("/signup", apiLimiter, asyncHandler(signupBuyer));
buyerRouter.post("/signin", apiLimiter, asyncHandler(signinBuyer));
buyerRouter.post("/logout", requireBuyer, (req: AuthenticatedRequest, res: Response) => {
    clearAuthCookies(res);
});

// * Password Management
buyerRouter.post("/forgotPassword", asyncHandler(forgotPassword));
buyerRouter.post("/updatePassword", asyncHandler(updatePassword));

// * Profile Routes
buyerRouter.get("/profile", requireBuyer, asyncHandler(getBuyerProfile));
buyerRouter.put("/update", requireBuyer, asyncHandler(updateBuyerProfile));
