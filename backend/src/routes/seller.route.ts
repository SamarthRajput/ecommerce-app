import { Request, Response, Router } from "express";
import { AuthenticatedRequest, requireSeller } from "../middlewares/authSeller";
import { createListing, editListing, getDashboardStats, getSellerListings, getSellerProfile, getSellerPublicProfile, getSellerRFQRequests, getSingleListingForEdit, signinSeller, signupSeller, toggleListingStatus, updateSellerProfile, upload, uploadDocuments } from "../controllers/sellerController";
import { apiLimiter } from "../utils/rateLimit";

export const sellerRouter = Router();

// Base url: http://localhost:3001/api/v1/seller

sellerRouter.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Seller API");
}
);
// Seller Authentication Routes
// SignUp route
sellerRouter.post("/signup",apiLimiter, async (req: Request, res: Response) => {
    await signupSeller(req, res);
});

// signin route
sellerRouter.post("/signin", apiLimiter, async (req: Request, res: Response) => {
    console.log('Received login request:', req.body)
    await signinSeller(req, res);
});


// Logout route
sellerRouter.post("/logout", requireSeller, (req: AuthenticatedRequest, res: Response) => {
    res.clearCookie("SellerToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
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

// Get Single Seller Listing for edit
sellerRouter.get("/product/:listingId", requireSeller, async (req: AuthenticatedRequest, res: Response) => {
    await getSingleListingForEdit(req, res);
});

// Seller list post
// the upload array need images
sellerRouter.post("/list-item", requireSeller, upload.array('images', 5), async (req: AuthenticatedRequest, res: Response) => {
    await createListing(req, res);
});

// Edit a listing by Seller
sellerRouter.put("/edit-listing/:listingId", requireSeller, async (req: AuthenticatedRequest, res: Response) => {
    await editListing(req, res);
});

// Toggle listing status (deactivate/activate/archive)
sellerRouter.post("/toggle-listing-status/:listingId", requireSeller, async (req: AuthenticatedRequest, res: Response) => {
    await toggleListingStatus(req, res);
});

// Get Dashboard Overview Stats
sellerRouter.get("/dashboard-stats", requireSeller, async (req: AuthenticatedRequest, res: Response) => {
    await getDashboardStats(req, res);
});

// Get seller RFQ requests
sellerRouter.get("/rfq-requests", requireSeller, async (req: AuthenticatedRequest, res: Response) => {
    await getSellerRFQRequests(req, res);
});

// Upload documents for seller
sellerRouter.post("/upload-documents", upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
    await uploadDocuments(req, res);
})

// get Seller public profile
sellerRouter.get("/public-profile/:sellerId", async (req: Request, res: Response) => {
    await getSellerPublicProfile(req, res);
});