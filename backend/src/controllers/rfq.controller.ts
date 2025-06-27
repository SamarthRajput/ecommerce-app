import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

interface BuyerTokenPayload {
    id: string;
    iat: number;
}

// POST /rfq
export const createRFQ = async (req: Request, res: Response) => {
    const { productId, buyerId, quantity, message } = req.body;
    console.log('Received buyerId:', buyerId);
    console.log('Received productId:', productId);
    if (!productId || !quantity) {
        res.status(400).json({
            message: 'productId and quantity are required'
        });
        return;
    }

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) {
        res.status(404).json({
            message: 'Product not found'
        });
        return;
    }

    const getBuyerIdFromToken = (token: string): string => {
        const decoded = jwt.verify(token, JWT_SECRET) as BuyerTokenPayload;
        console.log(decoded);
        return decoded.id;
    };

    const actualBuyerId = getBuyerIdFromToken(buyerId);
    console.log(actualBuyerId);
    const buyerExists = await prisma.buyer.findUnique({
        where: { id: actualBuyerId }
    });

    if (!buyerExists) {
        throw new Error(`Buyer with ID ${actualBuyerId} not found`);
    }


    try {
        const rfq = await prisma.rFQ.create({
            data: {
                product: {
                    connect: {
                        id: productId
                    }
                },
                buyer: {
                    connect: {
                        id: actualBuyerId
                    }
                },
                quantity,
                message,
                status: "PENDING"
            }
        });
        res.status(201).json({
            data: rfq
        });
    } catch (error) {
        console.error("Error creating RFQ:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// GET all RFQs for a buyer
export const getRFQsByBuyer = async (req: Request, res: Response) => {
    const { buyerId } = req.params;

    try {
        const rfqs = await prisma.rFQ.findMany({
            where: { buyerId },
            include: {
                product: true,
                trade: true
            }
        });
        res.status(200).json(rfqs);
    } catch (error) {
        console.error("Error fetching RFQs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getPendingRFQs = async (req: Request, res: Response) => {
    try {
        const pendingRFQs = await prisma.rFQ.findMany({
            where: { status: "PENDING" },
            include: {
                product: true,
                buyer: true
            }
        });
        res.status(200).json(pendingRFQs);
    } catch (error) {
        console.error("Error fetching pending RFQs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
