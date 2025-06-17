import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { signinSchema, signupSchema, updateProfileSchema } from "../lib/zod/BuyerZod";
import { authenticateBuyer, AuthenticatedRequest } from "../middlewares/authBuyer";
export const buyerRouter = Router();

// Signup Route
buyerRouter.post("/signup", async (req: Request, res: Response) => {
    const body = req.body;
    // doing input validation using zod
    const { success } = signupSchema.safeParse(body);
    if(!success){
        res.status(403).json({
            message: "Inputs are Incorrect"
        })
        return;
    }

    // Check if buyer already exists or not
    const existingBuyer = await prisma.buyer.findUnique({
        where: {
            email: body.email
        }
    });

    if(existingBuyer){
        res.status(400).json({
            message: "Buyer already Exists"
        });
        return;
    }

    // Hashing the password before storing it to database
    const hashPassword = await bcrypt.hash(body.password, 10);

    try {
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
    
        // Generate the JWT secret
        const token = jwt.sign({
            buyerId: buyer.id
        }, process.env.JWT_SECRET || "jwtsecret");
    
        res.json({
            message: "Signed Up Successfully",
            token: token,
            _id: buyer.id
        });
        return;
    }
    catch(e){
        console.log(e);
        res.status(411);
        res.json({
            message: "Invalid!"
        })
        return;
    }
}); 

// Signin Route
buyerRouter.post("/signin", async (req: Request, res: Response) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(body);
    if(!success){
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
    
        if(!existingBuyer){
            res.status(400).json({
                message: "User doesnot exists"
            })
            return;
        }
    
        // If user exists in database then
        const passwordMatch = await bcrypt.compare(body.password, existingBuyer.password);
        if(!passwordMatch){
            res.status(400).json({
                message: "Incorrect password"
            })
            return;
        } 
    
        const token = jwt.sign({
            id: existingBuyer.id
        }, process.env.JWT_SECRET || "jwtsecret");
    
        res.json({
            message: "Signed in successfully",
            token: token,
            _id: existingBuyer.id,
            firstName: existingBuyer.firstName,
            lastName: existingBuyer.lastName
        })
        return;
    }
    catch(e){
        console.log(e);
        res.status(400).json({
            message: "Invalid!"
        })
        return;
    }
});

// get buyer details
buyerRouter.get("/profile", authenticateBuyer, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const buyerId = req.buyer?.id;
    
        if(!buyerId){
            res.status(400).json({
                error: "Unauthorized"
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
    
        if(!buyer){
            res.status(404).json({ error: 'Buyer not found' });
            return;
        }
    
        res.json({
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
    catch(error){
        console.log(error);
        res.json({
            error: "Server error"
        });
    }
});

// update buyer details
buyerRouter.put("/update", authenticateBuyer, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const buyerId = req.buyer?.id;

        if(!buyerId){
            res.status(401).json({
                error: "Unauthorized"
            });
            return;
        }
        const body = req.body;
        // Validate request body
        const { success } = updateProfileSchema.safeParse(body);

        if(!success){
            res.status(401).json({
                error: "Wrong Inputs"
            });
            return;
        }

        // Check if buyer exists
        const existingBuyer = await prisma.buyer.findUnique({
            where:{
                id: buyerId
            }
        });
        if(!existingBuyer){
            res.status(401).json({
                error: "Buyer doesnt exist"
            });
            return;
        }

        // Update buyer profile
        const updateBuyer = await prisma.buyer.update({
            where: {
                id: buyerId
            },
            data: {
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName,
                phoneNumber: body.name,
                street: body.street,
                state: body.name,
                city: body.city,
                zipCode: body.zipCode,
                country: body.country
            }
        });

        res.json({
            message: "Profile Updated successfully"
        });
    }
    catch(error){
        console.log(error);
        res.status(501).json({
            message: "Server error"
        })
    }
});