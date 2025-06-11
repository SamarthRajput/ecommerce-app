import { Request, Response, Router } from "express";
import { signinSchema, signupSchema } from "../lib/types/zod";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
                name: body.name,
                phoneNumber: body.phoneNumber,
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
            token: token
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
        const passwordMatch = await bcrypt.compare(existingBuyer.password, body.password);
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
            token: token
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