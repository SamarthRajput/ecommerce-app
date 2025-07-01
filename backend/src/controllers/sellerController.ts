// /controllers/sellerController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest, requireSeller } from "../middlewares/authSeller";
import { listingFormSchema, loginSellerSchema, registerSellerSchema, updateProfileSchema } from "../lib/zod/SellerZod";
import { JWT_SECRET } from "../config";
import { setAuthCookie } from "../utils/setAuthCookie";
import validator from "validator";
import cloudinary from '../config/cloudinary';
import multer from 'multer';
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Sign up seller
export const signupSeller = async (req: Request, res: Response) => {
    try {
        // Validate request body with Zod
        const parsed = registerSellerSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = Object.fromEntries(
                Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [key, value?.[0]])
            );
            return res.status(400).json({
                message: 'Validation failed',
                errors
            });
        }

        console.log('Received registration request:', parsed.data);
        const data = parsed.data;
        console.log('Registering seller:', data.email, data.businessName)

        // Check if seller exists with same email and phone
        const existingSeller = await prisma.seller.findUnique({
            where: {
                email: data.email,
                phone: data.phone,
                countryCode: data.countryCode
            }
        })

        if (existingSeller) {
            console.log('Seller already exists:', data.email)
            res.status(400).json({
                message: 'Seller already exists with this email and phone',
                error: 'Seller already exists'
            })
            return
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12)

        // Create seller
        console.log('Creating new seller:', data.email)
        // Map businessType to enum value (uppercase and underscores)
        const mapBusinessType = (type: string) => type.toUpperCase().replace(/ /g, "_");

        const seller = await prisma.seller.create({
            data: {
                email: data.email,
                password: hashedPassword,
                phone: data.phone,
                countryCode: data.countryCode,
                firstName: data.firstName,
                lastName: data.lastName,
                businessName: data.businessName,
                businessType: mapBusinessType(data.businessType) as any,
                registrationNo: data.registrationNo,
                taxId: data.taxId,
                panOrTin: data.panOrTin,
                country: data.country,
                street: data.street,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                website: data.website,
                linkedIn: data.linkedIn,
                govIdUrl: data.govIdUrl || null,
                gstCertUrl: data.gstCertUrl || null,
                businessDocUrl: data.businessDocUrl || null,
                otherDocsUrl: data.otherDocsUrl || null,
                companyBio: data.companyBio || '',
                industryTags: data.industryTags || [],
                keyProducts: data.keyProducts || [],
                yearsInBusiness: data.yearsInBusiness ? Number(data.yearsInBusiness) : 0,
                agreedToTerms: data.agreedToTerms || false
            }
        })

        // Generate JWT
        console.log('Generating JWT for seller:', seller.id)
        const token = jwt.sign(
            { sellerId: seller.id },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        // Set cookie with JWT
        setAuthCookie({ res, token, cookieName: 'SellerToken' });

        // Respond with success message and data
        console.log('Seller registered successfully:', seller.id)
        res.status(201).json({
            message: 'Registration successful',
            token,
            seller: {
                id: seller.id,
                email: seller.email,
                role: seller.role,
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
                },
                createdAt: seller.createdAt,
                updatedAt: seller.updatedAt
            }
        })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ error: 'Server error' })
    }
}

// Sign in seller
export const signinSeller = async (req: Request, res: Response) => {
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
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        // Set cookie with JWT
        setAuthCookie({ res, token, cookieName: 'SellerToken' });

        // Respond with success message and data
        res.status(200).json({
            message: 'Login successful',
            token,
            seller: {
                id: seller.id,
                email: seller.email,
                role: seller.role,
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
}

// Get seller profile
export const getSellerProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;

        const seller = await prisma.seller.findUnique({
            where: { id: sellerId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                businessName: true,
                businessType: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                isApproved: true,
                approvalNote: true,
                registrationNo: true,
                panOrTin: true,
                website: true,
                linkedIn: true,
                yearsInBusiness: true,
                industryTags: true,
                keyProducts: true,
                companyBio: true,
                govIdUrl: true,
                gstCertUrl: true,
                businessDocUrl: true,
                otherDocsUrl: true,
                phone: true,
                countryCode: true,
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
                countryCode: seller.countryCode,
                isEmailVerified: seller.isEmailVerified,
                isPhoneVerified: seller.isPhoneVerified,
                isApproved: seller.isApproved,
                approvalNote: seller.approvalNote,
                registrationNo: seller.registrationNo,
                taxId: seller.taxId,
                panOrTin: seller.panOrTin,
                website: seller.website,
                linkedIn: seller.linkedIn,
                yearsInBusiness: seller.yearsInBusiness,
                industryTags: seller.industryTags,
                keyProducts: seller.keyProducts,
                companyBio: seller.companyBio,
                govIdUrl: seller.govIdUrl,
                gstCertUrl: seller.gstCertUrl,
                businessDocUrl: seller.businessDocUrl,
                otherDocsUrl: seller.otherDocsUrl,
                address: {
                    street: seller.street,
                    city: seller.city,
                    state: seller.state,
                    zipCode: seller.zipCode,
                    country: seller.country
                },
                createdAt: seller.createdAt,
                updatedAt: seller.updatedAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Update seller profile
export const updateSellerProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log('Updating seller profile:', req.body);
        const sellerId = req.seller?.sellerId;
        if (!sellerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate request body with Zod
        const parsed = registerSellerSchema.safeParse(req.body);

        // 2. If validation fails, return error
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const data = parsed.data;
        console.log('Updating seller:', data.email, data.businessName)

        // Check if seller exists
        const existingSeller = await prisma.seller.findUnique({
            where: { id: sellerId }
        });

        if (!existingSeller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }

        // Map businessType to enum value (uppercase and underscores)
        const mapBusinessType = (type: string) => type.toUpperCase().replace(/ /g, "_");

        // Update seller profile
        const updatedSeller = await prisma.seller.update({
            where: { id: sellerId },
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                businessName: data.businessName,
                businessType: mapBusinessType(data.businessType) as any,
                phone: data.phone,
                street: data.street,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                country: data.country,
                taxId: data.taxId
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
}

// Get Seller Listings
export const getSellerListings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;
        if (!sellerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const listings = await prisma.product.findMany({
            where: { sellerId },
            select: {
                id: true,
                name: true,
                description: true,
                listingType: true,
                industry: true,
                condition: true,
                productCode: true,
                model: true,
                specifications: true,
                hsnCode: true,
                countryOfSource: true,
                validityPeriod: true,
                images: true,
                price: true,
                quantity: true,
                category: true,
                status: true,
                createdAt: true,
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


// Create a new listing by Seller
export const createListing = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;
        if (!sellerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Handle images
        let imageUrls: string[] = [];
        const files = req.files as Express.Multer.File[];
        if (files && files.length > 0) {
            for (const file of files) {
                const uploadResult = await new Promise<string>((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error || !result) return reject(error);
                        resolve(result.secure_url);
                    });
                    stream.end(file.buffer);
                });
                imageUrls.push(uploadResult);
            }
        }

        req.body.quantity = parseInt(req.body.quantity || '0');
        req.body.validityPeriod = parseInt(req.body.validityPeriod || '0');
        req.body.images = imageUrls;

        // Validate request body with Zod
        const validationResult = listingFormSchema.safeParse(req.body);
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
        const {
            listingType,
            industry,
            category,
            condition,
            productCode,
            productName,
            description,
            model,
            specifications,
            hsnCode,
            quantity,
            countryOfSource,
            validityPeriod,
            notes,
        } = validationResult.data;

        // Check if seller exists
        const existingSeller = await prisma.seller.findUnique({
            where: { id: sellerId }
        });
        if (!existingSeller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }

        const existingListing = await prisma.product.findFirst({
            where: {
                sellerId,
                productCode
            }
        });
        if (existingListing) {
            return res.status(400).json({ error: "Listing already exists with this product code" });
        }

        // Create listing
        const listing = await prisma.product.create({
            data: {
                sellerId,
                listingType,
                industry,
                category,
                condition,
                productCode,
                name: productName,
                description,
                model,
                specifications,
                hsnCode,
                quantity,
                price: 0,
                validityPeriod: Number(validityPeriod),
                countryOfSource,
                images: imageUrls,
                status: 'PENDING' // Default status
            }
        });

        res.status(201).json({
            message: 'Listing created successfully',
            listing: {
                id: listing.id,
                name: listing.name,
                description: listing.description,
                price: listing.price,
                category: listing.category,
                status: listing.status,
                images: listing.images,
            }
        });
    } catch (error) {
        console.error('Create listing error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Edit a listing by Seller
export const editListing = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;
        if (!sellerId || validator.isUUID(sellerId)) {
            return res.status(401).json({ error: 'Unauthorized Access' });
        }

        const listingId = req.params.listingId;
        // console.log(`Request.params:`, req.params);
        // console.log(`Request.body:`, req.body);
        if (!listingId) {
            return res.status(400).json({ error: 'Listing ID is required' });
        }

        // Validate request body with Zod
        const validationResult = listingFormSchema.safeParse(req.body);
        if (!validationResult.success) {
            console.error('Validation error:', validationResult.error.issues);
            res.status(400).json({
                error: `Validation failed: ${validationResult.error.issues[0]?.message} ${validationResult.error.issues[0]?.path.join('.')}`,
                details: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
            return;
        }
        const {
            listingType,
            industry,
            category,
            condition,
            productCode,
            productName,
            description,
            model,
            specifications,
            hsnCode,
            quantity,
            countryOfSource,
            validityPeriod,
            notes,
        } = validationResult.data;

        // Check if listing exists
        const existingListing = await prisma.product.findUnique({
            where: { id: listingId, sellerId }
        });
        if (!existingListing) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }

        // if (existingListing.stat)
        // Update listing
        const updatedListing = await prisma.product.update({
            where: { id: listingId },
            data: {
                listingType,
                industry,
                category,
                condition,
                productCode,
                name: productName,
                description,
                model,
                specifications,
                hsnCode,
                quantity,
                price: 100,
                validityPeriod: Number(validityPeriod),
                countryOfSource,
                status: "PENDING"
            }
        });

        res.json({
            message: 'Listing updated successfully',
            listing: {
                id: updatedListing.id,
                name: updatedListing.name,
                description: updatedListing.description,
                price: updatedListing.price,
                category: updatedListing.category,
                status: updatedListing.status
            }
        });
    }
    catch (error) {
        console.error('Edit listing error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Deactivate/Activate/Archive a listing by Seller
export const toggleListingStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;
        if (!sellerId || validator.isUUID(sellerId)) {
            return res.status(401).json({ error: 'Unauthorized Access' });
        }

        const listingId = req.params.listingId;
        if (!listingId) {
            return res.status(400).json({ error: 'Listing ID is required' });
        }

        const { action } = req.body; // action can be 'deactivate', 'activate', or 'archive'

        // Check if listing exists
        const existingListing = await prisma.product.findUnique({
            where: { id: listingId, sellerId }
        });
        if (!existingListing) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }

        let updatedStatus: "INACTIVE" | "ACTIVE" | "ARCHIVED";
        switch (action) {
            case 'deactivate':
                updatedStatus = "INACTIVE";
                break;
            case 'activate':
                updatedStatus = "ACTIVE";
                break;
            case 'archive':
                updatedStatus = "ARCHIVED";
                break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

        // Update listing status
        const updatedListing = await prisma.product.update({
            where: { id: listingId },
            data: { status: updatedStatus }
        });

        res.json({
            message: `Listing ${action}d successfully`,
            listing: {
                id: updatedListing.id,
                name: updatedListing.name,
                description: updatedListing.description,
                price: updatedListing.price,
                category: updatedListing.category,
                status: updatedListing.status
            }
        });
    } catch (error) {
        console.error('Toggle listing status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get Dashboard Overview Stats
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;
        if (!sellerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get total listings
        const totalListings = await prisma.product.count({
            where: { sellerId }
        });

        // Get active listings
        const activeListings = await prisma.product.count({
            where: { sellerId, status: 'ACTIVE' }
        });

        // Get inactive listings
        const inactiveListings = await prisma.product.count({
            where: { sellerId, status: 'INACTIVE' }
        });

        // Get archived listings
        const archivedListings = await prisma.product.count({
            where: { sellerId, status: 'ARCHIVED' }
        });

        // Get total revenue (assuming price is stored in the product)
        const totalRevenue = await prisma.product.aggregate({
            _sum: {
                price: true
            },
            where: { sellerId, status: 'ACTIVE' }
        });

        const totalListingsWithStatus = await prisma.product.count({
            where: {
                sellerId,
                status: {
                    in: ['ACTIVE', 'INACTIVE', 'ARCHIVED']
                }
            }
        });

        const totalRFQs = await prisma.rFQ.count({
            where: { product: { sellerId } }
        });

        return res.json({
            message: 'Dashboard stats retrieved successfully',
            stats: {
                totalListings,
                activeListings,
                inactiveListings,
                archivedListings,
                totalRevenue: totalRevenue._sum.price || 0,
                totalRFQs,
                totalViews: 0, // Assuming you will implement views tracking later
                totalOrders: totalListingsWithStatus,
                recentOrders: 0, // Assuming you will implement recent orders tracking later
                pendingOrders: 0, // Assuming you will implement pending orders tracking later  
                responseRate: 0, // Assuming you will implement response rate tracking later
                avgRating: 0, // Assuming you will implement average rating tracking later
                monthlyRevenue: 0 // Assuming you will implement monthly revenue tracking later
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Seller RFQ Requests
export const getSellerRFQRequests = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;
        if (!sellerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const rfqRequests = await prisma.rFQ.findMany({
            where: { product: { sellerId } },
            include: { product: true }
        });
        // console.log(`RFQ requests for seller ${sellerId}:`, rfqRequests);
        return res.json({
            message: 'RFQ requests retrieved successfully',
            rfqRequests
        });
    } catch (error) {
        console.error('Get seller RFQ requests error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Upload business documents
// This endpoint allows sellers to upload business documents like GST registration, business license, etc.
export const uploadDocuments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;
        if (!sellerId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const file = files[0];
        if (file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Only PDF files are allowed' });
        }
        // Upload PDF to Cloudinary
        const pdfUrl = await new Promise<string>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { 
                    resource_type: 'raw', 
                    folder: 'business_documents', 
                    public_id: `business_doc_${sellerId}_${Date.now()}` 
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result.secure_url);
                }
            );
            stream.end(file.buffer);
        });
        // Optionally: Save pdfUrl to seller profile in DB here
        res.status(200).json({ message: 'Business document uploaded successfully', url: pdfUrl });
    }   
    catch(e){
        console.log(e);
        res.status(500).json({ error: 'Server error' });
    }
}
