import { Request, Response, Router } from "express";
import { loginSellerSchema, registerSellerSchema, updateProfileSchema } from "../lib/zod/SellerZod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest, authenticateSeller } from "../middlewares/authSeller";

export const sellerRouter = Router();
console.log('Seller router initialized');
// auth routes: http://localhost:3001/api/v1/seller

sellerRouter.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Seller API");
}
);

// SignUp route
sellerRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        // Validate request body with Zod
        const validationResult = registerSellerSchema.safeParse(req.body)

        if (!validationResult.success) {
            res.status(400).json({
                details: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
                ,
                error: `Validation failed: ${validationResult.error.issues[0]?.message}`,
                message: `${validationResult.error.issues[0]?.message}`
            })
            console.error('Validation error:', validationResult.error.issues[0]?.message)
            return
        }

        const { email, password, profile } = validationResult.data
        console.log('Registering seller:', email, profile.businessName)

        // Check if seller exists
        console.log('Checking for existing seller with email:', email)
        const existingSeller = await prisma.seller.findUnique({
            where: { email }
        })

        if (existingSeller) {
            console.log('Seller already exists:', email)
            res.status(400).json({
                message: 'Seller already exists',
                error: 'Seller already exists'
            })
            return
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create seller
        console.log('Creating new seller:', email)
        const seller = await prisma.seller.create({
            data: {
                email,
                password: hashedPassword,
                firstName: profile.firstName,
                lastName: profile.lastName,
                role: 'seller', // Default role
                businessName: profile.businessName,
                businessType: profile.businessType,
                phone: profile.phone,
                street: profile.address.street,
                city: profile.address.city,
                state: profile.address.state,
                zipCode: profile.address.zipCode,
                country: profile.address.country,
                taxId: profile.taxId,
            }
        })

        // Generate JWT
        console.log('Generating JWT for seller:', seller.id)
        const token = jwt.sign(
            { sellerId: seller.id },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        )

        console.log('JWT generated for seller:', seller.id)

        res.status(201).json({
            message: 'Seller registered successfully',
            token,
            seller: {
                id: seller.id,
                email: seller.email,
                profile: {
                    firstName: seller.firstName,
                    lastName: seller.lastName,
                    businessName: seller.businessName,
                    businessType: seller.businessType,
                    phone: seller.phone,
                    address: {
                        street: seller.street,
                        city: seller.city,
                        state: seller.state,
                        zipCode: seller.zipCode,
                        country: seller.country
                    },
                    taxId: seller.taxId
                }
            }
        })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ error: 'Server error' })
    }
});

// signin route
sellerRouter.post("/signin", async (req: Request, res: Response) => {
    console.log('Received login request:', req.body)
    try {
        // Validate request body with Zod
        const validationResult = loginSellerSchema.safeParse(req.body)

        if (!validationResult.success) {
            res.status(400).json({
                error: `Validation failed: ${validationResult.error.issues[0]?.message}`,
                details: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            })
            return
        }
        console.log('Logging in seller:', validationResult.data.email)

        const { email, password } = validationResult.data

        // Find seller
        const seller = await prisma.seller.findUnique({
            where: { email }
        })

        if (!seller) {
            res.status(400).json({ error: 'Invalid credentials' })
            console.log('Seller not found:', email)
            return
        }

        console.log('Seller found:', seller.id)

        // Check password
        const isMatch = await bcrypt.compare(password, seller.password)
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid credentials' })
            console.log('Password mismatch for seller:', email)
            return
        }

        console.log('Password match for seller:', seller.id)
        // Generate JWT
        const token = jwt.sign(
            { sellerId: seller.id },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        )

        console.log('JWT generated for seller:', seller.id)
        res.json({
            message: 'Login successful',
            token,
            seller: {
                id: seller.id,
                email: seller.email,
                role: 'seller',
                profile: {
                    firstName: seller.firstName,
                    lastName: seller.lastName,
                    businessName: seller.businessName,
                    businessType: seller.businessType,
                    phone: seller.phone,
                    address: {
                        street: seller.street,
                        city: seller.city,
                        state: seller.state,
                        zipCode: seller.zipCode,
                        country: seller.country
                    },
                    taxId: seller.taxId
                }
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Server error' })
    }
});

// Verify seller token
sellerRouter.get("/verify", authenticateSeller, (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.seller) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        res.json({
            message: 'Seller verified successfully',
            seller: {
                id: req.seller.id,
                email: req.seller.email
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout route
sellerRouter.post("/logout", authenticateSeller, (req: AuthenticatedRequest, res: Response) => {
    try {
        res.json({ message: 'Seller logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// get seller details 
sellerRouter.get("/profile", authenticateSeller, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // get token from header and decode it
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { sellerId: string };
        const sellerId = decoded.sellerId;

        const seller = await prisma.seller.findUnique({
            where: { id: sellerId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                businessName: true,
                businessType: true,
                phone: true,
                street: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                taxId: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!seller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }

        res.json({
            message: 'Profile retrieved successfully',
            seller: {
                id: seller.id,
                email: seller.email,
                firstName: seller.firstName,
                lastName: seller.lastName,
                businessName: seller.businessName,
                businessType: seller.businessType,
                phone: seller.phone,
                address: {
                    street: seller.street,
                    city: seller.city,
                    state: seller.state,
                    zipCode: seller.zipCode,
                    country: seller.country
                },
                taxId: seller.taxId,
                createdAt: seller.createdAt,
                updatedAt: seller.updatedAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// update seller details
sellerRouter.put("/details", async (req: AuthenticatedRequest, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { sellerId: string };
        const sellerId = decoded.sellerId;
        console.log('Updating profile for seller:', sellerId);

        // Validate request body with Zod
        const validationResult = updateProfileSchema.safeParse(req.body);

        if (!validationResult.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
            return;
        }

        const { firstName, lastName, businessName, businessType, phone, address, taxId } = validationResult.data;

        // Check if seller exists
        const existingSeller = await prisma.seller.findUnique({
            where: { id: sellerId }
        });

        if (!existingSeller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }

        // Update seller profile
        const updatedSeller = await prisma.seller.update({
            where: { id: sellerId },
            data: {
                firstName,
                lastName,
                businessName,
                businessType,
                phone,
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
                taxId
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                businessName: true,
                businessType: true,
                phone: true,
                street: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                taxId: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json({
            message: 'Profile updated successfully',
            seller: {
                id: updatedSeller.id,
                email: updatedSeller.email,
                firstName: updatedSeller.firstName,
                lastName: updatedSeller.lastName,
                businessName: updatedSeller.businessName,
                businessType: updatedSeller.businessType,
                phone: updatedSeller.phone,
                address: {
                    street: updatedSeller.street,
                    city: updatedSeller.city,
                    state: updatedSeller.state,
                    zipCode: updatedSeller.zipCode,
                    country: updatedSeller.country
                },
                taxId: updatedSeller.taxId,
                createdAt: updatedSeller.createdAt,
                updatedAt: updatedSeller.updatedAt
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get seller listings
sellerRouter.get("/listings", authenticateSeller, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.id;

        if (!sellerId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const listings = await prisma.product.findMany({
            where: { sellerId },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                quantity: true,
                category: true,
                status: true
            }
        });

        res.json({
            message: 'Listings retrieved successfully',
            listings
        });
    } catch (error) {
        console.error('Get listings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
);
