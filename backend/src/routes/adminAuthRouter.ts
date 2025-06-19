import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const authRouter = Router();
// Base address: https://localhost:3001/api/v1/auth
// will load from environment variables
export const JWT_SECRET = "egliejgoirhjgioetoebtjh";
export const JWT_EXPIRES_IN = "1d";

interface SigninBody {
    email: string;
    password: string;
}

// will implement rate limit later

// POST /api/v1/auth/admin/signin - Admin login
authRouter.post('/admin/signin', async (req: Request, res: Response) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            res.status(400).json({
                success: false,
                error: 'Invalid request body'
            });
            return;
        }
        const { email, password }: SigninBody = req.body;

        // Input validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
            return;
        }

        // Validate email format
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(email)) {
        //     res.status(400).json({
        //         success: false,
        //         error: 'Please provide a valid email address'
        //     });
        //     return;
        // }

        console.log(`Admin login attempt for email: ${email}`);

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { 
                email: email.toLowerCase().trim() 
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
                createdAt: true
            }
        });

        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
            return;
        }

        // Verify user has admin role
        if (user.role !== 'admin') {
            console.log(`Access denied for user ${email}: role is ${user.role}, expected admin`);
            res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log(`Invalid password for user: ${email}`);
            res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
            return;
        }

        // Generate JWT token
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        // Successful login
        console.log(`Admin login successful for: ${email}`);
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                },
                token,
                expiresIn: JWT_EXPIRES_IN
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during authentication'
        });
    }
});

// POST /api/v1/auth/admin/verify - Verify admin token
authRouter.post('/admin/verify', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'No token provided'
            });
            return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        // Check if user still exists and is admin
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user || user.role !== 'admin') {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
            return;
        }

        res.json({
            success: true,
            data: {
                user,
                valid: true
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
});

// POST /api/v1/auth/admin/logout - 

authRouter.post('/admin/logout', (req: Request, res: Response) => {

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Not required for admin signup, but included for adding test admin account
// POST /api/v1/auth/admin/signup - Create a new admin account
authRouter.post('/admin/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                error: 'Name, email, and password are required'
            });
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role: 'admin'
            }
        });

        res.json({
            success: true,
            message: 'Admin account created successfully',
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        console.error('Error during admin signup:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during signup'
        });
    }
}
);

// Clean up Prisma connection


process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export { authRouter };