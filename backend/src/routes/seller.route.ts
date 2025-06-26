import { Request, Response, Router } from "express";
import { AuthenticatedRequest, requireSeller } from "../middlewares/authSeller";
import { createListing, getSellerListings, getSellerProfile, signinSeller, signupSeller, updateSellerProfile } from "../controllers/sellerController";

export const sellerRouter = Router();

sellerRouter.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Seller API");
}
);
// Seller Authentication Routes
// SignUp route
sellerRouter.post("/signup", async (req: Request, res: Response) => {
    await signupSeller(req, res);
});

// signin route
sellerRouter.post("/signin", async (req: Request, res: Response) => {
    console.log('Received login request:', req.body)
    await signinSeller(req, res);
});


// Logout route
sellerRouter.post("/logout", requireSeller, (req: AuthenticatedRequest, res: Response) => {
    res.clearCookie("SellerToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/" // Ensure the path matches where the cookie was set
    });
    res.status(200).json({ message: "Logged out successfully" });
});

// Seller Profile Routes
// get seller details
sellerRouter.get("/profile", requireSeller, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await getSellerProfile(req, res);
});

// update seller details
sellerRouter.put("/details", requireSeller, async (req: AuthenticatedRequest, res: Response) => {
    await updateSellerProfile(req, res);
});

// Seller Listings Routes
// Get seller listings
sellerRouter.get("/listings", requireSeller, async (req: AuthenticatedRequest, res: Response) => {
    await getSellerListings(req, res);
});

// Seller list post
sellerRouter.post("/list-item", requireSeller, async (req: AuthenticatedRequest, res: Response) => {
    await createListing(req, res);
});