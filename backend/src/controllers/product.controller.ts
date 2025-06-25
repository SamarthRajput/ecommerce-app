import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
    const pageNumber = parseInt(page as string, 10); // Convert page to a number
    if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(400).json({ message: "Invalid page number" });
    }
    const limitNumber = parseInt(limit as string, 10); // Convert limit to a number
    if (isNaN(limitNumber) || limitNumber < 1) {
        return res.status(400).json({ message: "Invalid limit number" });
    }
    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;

    try {
        const products = await prisma.product.findMany({
            where: {
                status: "ACTIVE",
            },
            skip,
            take,
        });

        res.status(200).json({
            products,
            page: pageNumber,
            limit: limitNumber,
            total: await prisma.product.count({
                where: {
                    status: "ACTIVE",
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
    const { id } = req.params;
    // console.log("Fetching product with ID:", id);
    try {
        const product = await prisma.product.findFirst({
            where: {
                id,
                status: "ACTIVE",
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
                        businessName: true,
                        country: true,
                        state: true,
                        city: true,
                    },
                },
            },
        });

        if (!product) {
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
    try {
        const products = await prisma.product.findMany({
            where: {
                sellerId: id,
                status: "ACTIVE",
            },
        });

        res.status(200).json({ products });
    } catch (err) {
        console.error("Error fetching products by seller ID:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSimilarProducts = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            select: { category: true },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const similarProducts = await prisma.product.findMany({
            where: {
                category: product.category,
                status: "ACTIVE",
                id: { not: id }, // Exclude the current product
            },
        });

        res.status(200).json({ products: similarProducts });
    } catch (err) {
        console.error("Error fetching similar products:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProductReviews = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const reviews = await prisma.review.findMany({
            where: {
                productId: id,
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
