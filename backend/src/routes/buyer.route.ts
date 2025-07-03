import { Request, Response, Router } from "express";
import { AuthenticatedRequest, requireBuyer } from "../middlewares/authBuyer";
import { getBuyerProfile, signinBuyer, signupBuyer, updateBuyerProfile, verifyBuyerProfile } from "../controllers/buyerController";
import { apiLimiter } from "../utils/rateLimit";

export const buyerRouter = Router();

// Base url: http://localhost:3001/api/v1/buyer

// Signup Route
buyerRouter.post("/signup", apiLimiter, async (req: Request, res: Response) => {
    await signupBuyer(req, res);
});

// Signin Route
buyerRouter.post("/signin", apiLimiter, async (req: Request, res: Response) => {
    await signinBuyer(req, res);
});

// get buyer details
buyerRouter.get("/profile", requireBuyer, async (req: AuthenticatedRequest, res: Response) => {
    await getBuyerProfile(req, res);
});

// update buyer details
buyerRouter.put("/update", requireBuyer, async (req: AuthenticatedRequest, res: Response) => {
    await updateBuyerProfile(req, res);
});

// verify buyer details
buyerRouter.get("/verify", requireBuyer, async (req: AuthenticatedRequest, res: Response) => {
    await verifyBuyerProfile(req, res);
})


buyerRouter.post("/logout", requireBuyer, (req, res) => {
    res.clearCookie("BuyerToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/" // Ensure the path matches where the cookie was set
    });
    res.status(200).json({ message: "Logged out successfully" });
});