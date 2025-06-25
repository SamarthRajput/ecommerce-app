import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// POST /rfq
export const createRFQ = async (req: Request, res: Response) => {
    const { productId, buyerId, quantity, message } = req.body;

    try {
        const rfq = await prisma.rFQ.create({
            data: {
                productId,
                buyerId,
                quantity,
                message,
                status: "PENDING"
            }
        });
        res.status(201).json(rfq);
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
