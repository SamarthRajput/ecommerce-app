import { Request, Response, Router } from "express";
import { AuthenticatedRequest, requireSeller } from "../middlewares/authSeller";
import { createListing, editListing, forgotSellerPassword, getDashboardStats, getSellerListings, getSellerProfile, getSellerPublicProfile, getSellerRFQRequests, getSingleListingForEdit, resetSellerPassword, signinSeller, signupSeller, toggleListingStatus, updateSellerProfile, upload, uploadDocuments } from "../controllers/sellerController";
import { apiLimiter } from "../utils/rateLimit";
import asyncHandler from "../utils/asyncHandler";
import { uploadMultipleFiles, uploadMultipleFilesCreateListing } from "../middlewares/multer";
import { clearAuthCookies } from "../utils/clearAuthCookies";
export const sellerRouter = Router();

// Base URL: http://localhost:3001/api/v1/seller

// * Authentication Routes
sellerRouter.post("/signup", apiLimiter, asyncHandler(signupSeller));
sellerRouter.post("/signin", apiLimiter, asyncHandler(signinSeller));
sellerRouter.post("/forgotPassword", apiLimiter, asyncHandler(forgotSellerPassword));
sellerRouter.post("/resetPassword", apiLimiter, asyncHandler(resetSellerPassword));

// * Logout
sellerRouter.post("/logout", requireSeller, (req: Request, res: Response) => {
	clearAuthCookies(res);
	res.status(200).json({ message: "Logged out successfully" });
});

// * Profile Routes
sellerRouter.get("/profile", requireSeller, asyncHandler(getSellerProfile));
sellerRouter.put("/details", requireSeller, asyncHandler(updateSellerProfile));

// * Listing Routes
sellerRouter.get("/listings", requireSeller, asyncHandler(getSellerListings));
sellerRouter.get("/product/:listingId", requireSeller, asyncHandler(getSingleListingForEdit));
sellerRouter.post("/list-item", requireSeller, uploadMultipleFilesCreateListing, asyncHandler(createListing));
sellerRouter.put("/edit-listing/:listingId", requireSeller, uploadMultipleFiles, asyncHandler(editListing));
sellerRouter.post("/toggle-listing-status/:listingId", requireSeller, asyncHandler(toggleListingStatus));

// * Dashboard Stats
sellerRouter.get("/dashboard-stats", requireSeller, asyncHandler(getDashboardStats));

// * RFQ Requests
sellerRouter.get("/rfq-requests", requireSeller, asyncHandler(getSellerRFQRequests));

// * Document Upload
sellerRouter.post("/upload-documents", upload.single('file'), asyncHandler(uploadDocuments));

// * Public Profile
sellerRouter.get("/public-profile/:sellerId", asyncHandler(getSellerPublicProfile));