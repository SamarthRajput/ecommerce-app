import express, { Request, Response, NextFunction, Router } from "express";
import { getProductById, getProductReviews, getProducts, getProductsBySellerId, getSimilarProducts, postProductReviews } from "../controllers/product.controller";
import { AuthenticatedRequest, requireBuyer } from "../middlewares/authBuyer";

const productRouter = Router();
const BASE_API_URL = "/api/v1/products";

// Base url: http://localhost:3001/api/v1/products

// Route to get all products with pagination
productRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getProducts(req, res);
    } catch (error) {
        next(error);
    }
});

// Route to get a product by ID
productRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log("Fetching product by ID:", req.params.id);
        await getProductById(req, res);
    } catch (error) {
        next(error);
    }
});

// Route to get products similar to a given product
productRouter.get("/:id/similar", async (req: Request, res: Response, next: NextFunction) => {

    try {
        await getSimilarProducts(req, res);
    } catch (error) {
        next(error);
    }
});

// Route to get more products by same seller using product ID
productRouter.get("/seller/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getProductsBySellerId(req, res);
    } catch (error) {
        next(error);
    }
});

productRouter.get("/:id/reviews", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getProductReviews(req, res);
    } catch (error) {
        next(error);
    }
});

productRouter.post("/:id/reviews", requireBuyer, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    await postProductReviews(req, res);
})

export default productRouter;
