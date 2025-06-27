// /controllers/buyerController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { signinSchema, signupSchema, updateProfileSchema } from "../lib/zod/BuyerZod";
import { AuthenticatedRequest } from "../middlewares/authBuyer";
import { JWT_SECRET } from "../config";
import { setAuthCookie } from "../utils/setAuthCookie";

export const signupBuyer = async (req: Request, res: Response) => {
    const body = req.body;

    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: validation.error.flatten().fieldErrors
        });
    }

    try {
        const existingBuyer = await prisma.buyer.findUnique({
            where: { email: body.email }
        });

        if (existingBuyer) {
            return res.status(400).json({ message: "Buyer already exists" });
        }

        const hashPassword = await bcrypt.hash(body.password, 10);

        const buyer = await prisma.buyer.create({
            data: {
                email: body.email,
                password: hashPassword,
                firstName: body.firstName,
                lastName: body.lastName,
                phoneNumber: body.phoneNumber,
                street: body.street,
                state: body.state,
                city: body.city,
                zipCode: body.zipCode,
                country: body.country
            }
        });

        const token = jwt.sign({ buyerId: buyer.id, email: buyer.email, role: 'buyer' }, JWT_SECRET, { expiresIn: "7d" });

        setAuthCookie({ res, token, cookieName: "BuyerToken" });

        return res.status(201).json({
            message: "Signup successful",
            buyer: {
                id: buyer.id,
                email: buyer.email,
                role: 'buyer'
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Signin buyer
export const signinBuyer = async (req: Request, res: Response) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(body);
    if (!success) {
        res.status(400).json({
            message: "Invalid inputs",
        })
        return;
    }

    // Checking is buyer exists in database or not
    try {
        const existingBuyer = await prisma.buyer.findUnique({
            where: {
                email: body.email
            }
        });

        if (!existingBuyer) {
            res.status(400).json({
                message: "User doesnot exists"
            })
            return;
        }

        // If user exists in database then
        const passwordMatch = await bcrypt.compare(body.password, existingBuyer.password);
        if (!passwordMatch) {
            res.status(400).json({
                message: "Incorrect password"
            })
            return;
        }

        const token = jwt.sign(
            {
                buyerId: existingBuyer.id,
                email: existingBuyer.email,
                role: 'buyer'
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set the token in a cookie
        setAuthCookie({ res, token, cookieName: "BuyerToken" });
        res.status(200).json({
            message: "Signed in successfully",
            buyer: {
                id: existingBuyer.id,
                firstName: existingBuyer.firstName,
                lastName: existingBuyer.lastName,
                email: existingBuyer.email,
                city: existingBuyer.city,
                country: existingBuyer.country
            }
        });

    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            message: "Invalid!"
        })
        return;
    }
}

// Get buyer profile
export const getBuyerProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const buyerId = req.buyer?.buyerId;

        if (!buyerId) {
            res.status(400).json({
                error: "Buyer ID is required"
            });
            return;
        }

        const buyer = await prisma.buyer.findUnique({
            where: {
                id: buyerId
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                street: true,
                state: true,
                city: true,
                zipCode: true,
                country: true
            }
        });

        if (!buyer) {
            res.status(404).json({ error: 'Buyer not found' });
            return;
        }

        res.status(200).json({
            message: "Profile received",
            buyer: {
                id: buyer.id,
                email: buyer.email,
                firstName: buyer.firstName,
                lastName: buyer.lastName,
                phoneNumber: buyer.phoneNumber,
                street: buyer.street,
                state: buyer.state,
                city: buyer.city,
                zipCode: buyer.zipCode,
                country: buyer.country
            }
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            error: "Server error"
        });
    }
};

// Update buyer profile
export const updateBuyerProfile = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const buyerId = req.buyer?.buyerId;

        if (!buyerId) {
            res.status(401).json({
                error: "Unauthorized"
            });
            return;
        }
        const body = req.body;
        // Validate request body
        const { success } = updateProfileSchema.safeParse(body);

        if (!success) {
            res.status(401).json({
                error: "Wrong Inputs"
            });
            return;
        }

        // Check if buyer exists
        const existingBuyer = await prisma.buyer.findUnique({
            where: {
                id: buyerId
            }
        });
        if (!existingBuyer) {
            res.status(401).json({
                error: "Buyer doesnt exist"
            });
            return;
        }

        // Update buyer profile
        const updateBuyer = await prisma.buyer.update({
            where: { id: buyerId },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                phoneNumber: body.phoneNumber,
                street: body.street,
                state: body.state,
                city: body.city,
                zipCode: body.zipCode,
                country: body.country
            }
        });

        res.json({
            message: "Profile Updated successfully",
            buyer: {
                id: updateBuyer.id,
                email: updateBuyer.email,
                firstName: updateBuyer.firstName,
                lastName: updateBuyer.lastName,
                phoneNumber: updateBuyer.phoneNumber,
                street: updateBuyer.street,
                state: updateBuyer.state,
                city: updateBuyer.city,
                zipCode: updateBuyer.zipCode,
                country: updateBuyer.country
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(501).json({
            message: "Server error"
        })
    }
};

export const verifyBuyerProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.buyer) {
            res.status(401).json({
                error: "Unauthorized"
            });
            return;
        }
        res.json({
            message: "Buyer verified Successfullly",
            buyer: {
                id: req.buyer.buyerId,
                email: req.buyer.email
            }
        })
    }
    catch (error) {
        console.log(error);
        res.status(501).json({
            message: "server error"
        })
    };
}