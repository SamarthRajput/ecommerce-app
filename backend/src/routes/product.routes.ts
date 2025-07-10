import { Router } from "express";
import { getProductById, getProducts, getSimilarProducts, getProductsBySellerId, getProductReviews, postProductReviews } from "../controllers/product.controller";
import { requireBuyer } from "../middlewares/authBuyer";
import asyncHandler from "../utils/asyncHandler";

const productRouter = Router();

// * Seller-Specific Products
productRouter.get("/seller/:id", asyncHandler(getProductsBySellerId));

// * Similar Products
productRouter.get("/:id/similar", asyncHandler(getSimilarProducts));

// * Product Reviews
productRouter.get("/:category/:id/reviews", asyncHandler(getProductReviews));
productRouter.post("/:id/reviews", requireBuyer, asyncHandler(postProductReviews));

// * Individual Product
productRouter.get("/:category/:id", asyncHandler(getProductById));

// * Category-Wise Product Listing (Paginated)
productRouter.get("/:category", asyncHandler(getProducts));

export default productRouter;