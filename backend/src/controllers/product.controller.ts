import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../middlewares/authBuyer";
import { parsePagination } from "../utils/parsePagination";

export const getProducts = async (req: Request, res: Response) => {
    const { skip, take } = parsePagination(req.query);
    const { category } = req.params;
    console.log("Fetching products for category:", category);
    const categoryStr = typeof category === "string" ? category : undefined;
    if (!categoryStr) {
        return res.status(400).json({ message: "Category is required" });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                status: "APPROVED",
                category: categoryStr === "all" ? undefined : {
                    equals: categoryStr,
                    mode: "insensitive",
                },
            },
            skip,
            take,
        });

        res.status(200).json({
            products,
            page: typeof req.query.page === "string" ? parseInt(req.query.page) : 1,
            limit: take,
            total: await prisma.product.count({
                where: {
                    status: "APPROVED",
                    category: categoryStr === "all" ? undefined : {
                        equals: categoryStr,
                        mode: "insensitive",
                    },
                },
            }),
            message: products.length > 0 ? "Products fetched successfully" : "No products found",
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { category, id } = req.params;
    console.log("Fetching product with ID:", id);
    try {
        const product = await prisma.product.findFirst({
            where: {
                id,
                status: "APPROVED",
                category: category ? {
                    equals: category,
                    mode: "insensitive",
                } : undefined,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                quantity: true,
                listingType: true,
                condition: true,
                validityPeriod: true,
                industry: true,
                category: true,
                productCode: true,
                model: true,
                specifications: true,
                countryOfSource: true,
                hsnCode: true,
                images: true,
                createdAt: true,
                updatedAt: true,
                seller: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        slug: true,
                        email: true,
                        businessName: true,
                        country: true,
                        state: true,
                        city: true,
                    },
                },
            },
        });

        if (!product) {
            console.log("Product not found with ID:", id);
            return res.status(404).json({ message: "Product not found or not ACTIVE" });
        }

        res.status(200).json({
            product,
            message: "Product fetched successfully",
        });
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProductsBySellerId = async (req: Request, res: Response) => {
    const { id } = req.params; // Product id, Get Seller id from product
    const { skip, take } = parsePagination(req.query);

    // Find Seller ID from Product ID
    // fix this route
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            select: { sellerId: true },
        });

        if (!product) return res.status(404).json({ message: "Product not found" });
        if (!product.sellerId) return res.status(404).json({ message: "Seller not found" });

        const sellerId = product.sellerId;

        const products = await prisma.product.findMany({
            where: {
                id,
                status: "APPROVED",
            },
            skip,
            take,
        });

        res.status(200).json({ products });
    } catch (err) {
        console.error("Error fetching products by seller ID:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSimilarProducts = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { skip, take } = parsePagination(req.query);

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            select: { category: true },
        });

        if (!product) {
            console.log("Product not found with ID:", id);
            return res.status(404).json({ message: "Product not found" });
        }

        const similarProducts = await prisma.product.findMany({
            where: {
                category: product.category,
                status: "APPROVED",
                id: { not: id },
            },
            skip,
            take,
        });

        res.status(200).json({ products: similarProducts });
    } catch (err) {
        console.error("Error fetching similar products:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProductReviews = async (req: Request, res: Response) => {
    const { category, id } = req.params;

    try {
        const reviews = await prisma.review.findMany({
            where: {
                productId: id,
                product: {
                    category: category ? {
                        equals: category,
                        mode: "insensitive",
                    } : undefined,
                    status: "APPROVED",
                },
            },
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                buyer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        city: true,
                        country: true,
                    },
                },
            },
        });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }

        res.status(200).json({
            reviews,
            message: "Product reviews fetched successfully",
        });
    } catch (err) {
        console.error("Error fetching product reviews:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const postProductReviews = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id: productId } = req.params;
        const buyerId = req.buyer?.buyerId;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            res.status(400).json({
                message: "Invalid Inputs"
            })
            return;
        }

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        // Check if buyer already reviewed this product or not 
        const existingReview = await prisma.review.findFirst({
            where: { productId, buyerId, rating, comment },
            select: { id: true }
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = await prisma.review.create({
            data: {
                rating: Number(rating),
                comment,
                product: { connect: { id: productId } },
                buyer: { connect: { id: buyerId } },
            },
            include: {
                buyer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        city: true,
                        country: true,
                    },
                },
            },
        });

        res.status(201).json({ review, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
}