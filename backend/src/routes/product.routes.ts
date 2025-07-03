import { Router } from "express";
import { getProductById, getProducts, getSimilarProducts, getProductsBySellerId, getProductReviews, postProductReviews } from "../controllers/product.controller";
import { requireBuyer } from "../middlewares/authBuyer";
import asyncHandler from "../utils/asyncHandler";

const productRouter = Router();

// 1. Get more products from the same seller
productRouter.get("/seller/:id", asyncHandler(getProductsBySellerId));

// 2. Get similar products
productRouter.get("/:id/similar", asyncHandler(getSimilarProducts));

// 3. Get reviews of a product
productRouter.get("/:category/:id/reviews", asyncHandler(getProductReviews));

// 4. Post a review (only for buyers)
productRouter.post("/:id/reviews", requireBuyer, asyncHandler(postProductReviews));

// 5. Get a single product by ID and category
productRouter.get("/:category/:id", asyncHandler(getProductById));

// 6. Get all products in a category (paginated)
productRouter.get("/:category", asyncHandler(getProducts));

export default productRouter;
