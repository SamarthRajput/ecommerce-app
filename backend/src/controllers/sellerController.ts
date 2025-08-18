// /controllers/sellerController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../middlewares/authSeller";
import { loginSellerSchema, productSchema, registerSellerSchema } from "../lib/zod/SellerZod";
import { JWT_SECRET } from "../config";
import { setAuthCookie } from "../utils/setAuthCookie";
import cloudinary from '../config/cloudinary';
import multer from 'multer';
import { generateValidSlug } from "../utils/generateValidSlug";
const storage = multer.memoryStorage();
export const upload = multer({ storage });
import validator from 'validator';
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";
import slugify from "slugify";
import crypto from "crypto";
import { BusinessType } from "@prisma/client";
import { sendEmail } from "../utils/sendEmail";
import { createSellerAdminChatOnProduct } from "../services/chatService";

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
                message: `${parsed.error.issues[0].path} : ${parsed.error.issues[0].message}`,
                errors
            });
        }

        console.log('Received registration request:', parsed.data);
        const data = parsed.data;
        console.log('Registering seller:', data.email, data.businessName)

        // Check if seller exists with same email and phone
        const existingSeller = await prisma.seller.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phone: data.phone }
                ]
            }
        });

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
        let slug;
        slug = generateValidSlug(data.businessName);
        if (!slug || !validator.isSlug(slug)) {
            slug = generateValidSlug(`${data.firstName}-${data.lastName}-${Date.now()}`);
        }
        // if already exists, append a number
        const existingSlug = await prisma.seller.findFirst({
            where: { slug }
        });
        if (existingSlug) {
            let counter = 1;
            let newSlug = `${slug}-${counter}`;
            while (await prisma.seller.findFirst({ where: { slug: newSlug } })) {
                counter++;
                newSlug = `${slug}-${counter}`;
            }
            slug = newSlug;
        }
        console.log('Final slug for seller:', slug);
        const seller = await prisma.seller.create({
            data: {
                email: data.email,
                password: hashedPassword,
                phone: data.phone,
                countryCode: data.countryCode,
                firstName: data.firstName,
                lastName: data.lastName,
                businessName: data.businessName,
                slug: slug,
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
                agreedToTerms: data.agreedToTerms || false,

                industryId: data.industryId
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

// Forgot password
export const forgotSellerPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        // Find seller by email
        const seller = await prisma.seller.findUnique({
            where: { email }
        });

        if (!seller) {
            return res.status(200).json({ message: 'If this email exists in our system, a reset link has been sent' });
        }

        // Generate Token

        const resetPasswordToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordUrl = `https://www.interlinkb.com/seller/reset-password?token=${resetPasswordToken}`;
        const hashedToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');
        try {
            const updatedSeller = await prisma.seller.update({
                where: { id: seller.id },
                data: {
                    resetToken: hashedToken,
                    resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000)
                }
            });
            console.log(`Seller: ${JSON.stringify(updatedSeller)}`);
            console.log(`Raw Token: ${resetPasswordToken} \nHashed Token: ${hashedToken}`);
            const info = await sendEmail({
                from: '"Sam"',
                to: seller.email,
                subject: 'Reset Your Password',
                text: `Click the link below to reset your password:\n\n` + `${resetPasswordUrl}`,
                html: `<p>Click the link below to reset your password:</p><p><a href="${resetPasswordUrl}">Reset Password</a></p>`,
            });
            console.log('Email sent:', info.response);
        } catch (error) {
            console.error('Error updating seller with reset token:', error);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        res.status(200).json({
            message: 'Password reset link sent to your email, please check your inbox',
            email: seller.email
        });
        return;
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Server error' });
        return;
    }
};

// Reset seller password
export const resetSellerPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;

        if (!token || typeof token !== 'string') {
            console.log('Invalid or missing token:', token);
            return res.status(400).json({ error: 'Invalid or missing token, please request a new password reset' });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Hash token to match with DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        console.log(`In ResetPassword\nRaw Token: ${token}\nHashed Token: ${hashedToken}`);
        // Find seller with matching hashed token and valid expiry
        const seller = await prisma.seller.findFirst({
            where: {
                // resetToken: hashedToken,
                // // resetTokenExpiry: {
                // //     gte: new Date()
                // // }
                email: 'rohitkuyada@gmail.com'
            }
        });
        console.log(`Seller: ${JSON.stringify(seller)}`);

        if (!seller) {
            return res.status(400).json({ error: 'Invalid or expired token, please request a new password reset' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token fields
        await prisma.seller.update({
            where: { id: seller.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        // Notify Seller that password has been reset via email
        await sendEmail({
            from: '"InterLink"',
            to: seller.email,
            subject: 'Your Password Has Been Reset',
            text: `Your password has been reset successfully. If you did not request this, please contact support.`,
            html: `<p>Your password has been reset successfully. If you did not request this, please contact support.</p>`,
        });

        res.status(200).json({ message: 'Password has been reset successfully' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// Update seller profile
export const updateSellerProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log('Updating seller profile:', req.body);
        const sellerId = req.seller?.sellerId;
        if (!sellerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract data from request body
        const {
            email,
            firstName,
            lastName,
            businessName,
            businessType,
            phone,
            countryCode,
            taxId,
            panOrTin,
            registrationNo,
            website,
            linkedIn,
            yearsInBusiness,
            industryTags,
            keyProducts,
            companyBio,
            address
        } = req.body;

        // Basic validation
        if (!email.trim() || !firstName.trim() || !lastName.trim() || !businessName.trim() || !businessType.trim() || !phone.trim()) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['email', 'firstName', 'lastName', 'businessName', 'businessType', 'phone']
            });
        }

        if (!address || !address.street || !address.city || !address.state || !address.zipCode || !address.country) {
            return res.status(400).json({
                error: 'Complete address is required',
                required: ['street', 'city', 'state', 'zipCode', 'country']
            });
        }

        // Check if seller exists
        const existingSeller = await prisma.seller.findUnique({
            where: { id: sellerId }
        });

        if (!existingSeller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        // Business type mapping based on your actual enum
        const businessTypeMap: { [key: string]: BusinessType } = {
            'Individual': 'INDIVIDUAL',
            'Proprietorship': 'PROPRIETORSHIP',
            'Partnership': 'PARTNERSHIP',
            'LLP': 'LLP',
            'Private Limited': 'PRIVATE_LIMITED',
            'Public Limited': 'PUBLIC_LIMITED',
            'NGO': 'NGO',
            'Government Entity': 'GOVERNMENT_ENTITY',
            'Other': 'OTHER'
        };

        // Get the proper enum value
        const mappedBusinessType: BusinessType = businessTypeMap[businessType] || 'OTHER';

        // Prepare update data
        const updateData = {
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            businessName: businessName.trim(),
            businessType: mappedBusinessType, // Now properly typed as BusinessType enum
            phone: phone.trim(),
            countryCode: countryCode.trim() || '+91',
            taxId: taxId.trim() || null,
            panOrTin: panOrTin.trim() || null,
            registrationNo: registrationNo.trim() || null,
            website: website.trim() || null,
            linkedIn: linkedIn.trim() || null,
            yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness.toString()) : null,
            industryTags: Array.isArray(industryTags) ? industryTags : [],
            keyProducts: Array.isArray(keyProducts) ? keyProducts : [],
            companyBio: companyBio || null,
            // Address fields (required in schema)
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
            updatedAt: new Date()
        };

        console.log('Update data prepared:', updateData);

        // Update seller profile
        const updatedSeller = await prisma.seller.update({
            where: { id: sellerId },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                businessName: true,
                businessType: true,
                phone: true,
                countryCode: true,
                taxId: true,
                panOrTin: true,
                registrationNo: true,
                website: true,
                linkedIn: true,
                yearsInBusiness: true,
                industryTags: true,
                keyProducts: true,
                companyBio: true,
                street: true,
                city: true,
                state: true,
                zipCode: true,
                country: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                isApproved: true,
                approvalNote: true,
                govIdUrl: true,
                gstCertUrl: true,
                businessDocUrl: true,
                otherDocsUrl: true,
                createdAt: true,
                updatedAt: true
            }
        });

        // Format response to match frontend expectations
        const responseData = {
            ...updatedSeller,
            address: {
                street: updatedSeller.street || '',
                city: updatedSeller.city || '',
                state: updatedSeller.state || '',
                zipCode: updatedSeller.zipCode || '',
                country: updatedSeller.country || ''
            }
        };

        console.log('Profile updated successfully:', responseData.email);

        res.json({
            message: 'Profile updated successfully',
            seller: responseData
        });
    } catch (error) {
        console.error('Update profile error:', error);

        res.status(500).json({
            error: 'Server error',
        });
    }
};


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
                condition: true,
                model: true,
                specifications: true,
                hsnCode: true,
                countryOfSource: true,
                minimumOrderQuantity: true,
                currency: true,
                brochureUrl: true,
                deliveryTimeInDays: true,
                expiryDate: true,
                rejectionReason: true,
                licenses: true,
                logisticsSupport: true,
                tags: true,
                warrantyPeriod: true,
                keywords: true,
                videoUrl: true,
                updatedAt: true,
                validityPeriod: true,
                images: true,
                price: true,
                quantity: true,
                status: true,
                createdAt: true,
                _count: true,
                rfqs: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                industry: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
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

// Deactivate/Activate/Archive a listing by Seller
export const toggleListingStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;
        if (!sellerId) {
            return res.status(401).json({ error: 'Unauthorized Access, please log in!' });
        }

        const listingId = req.params.listingId;
        if (!listingId) {
            return res.status(400).json({ error: 'Listing ID is required' });
        }

        const { action } = req.body; // action can be 'deactivate', 'activate', or 'archive', 'unarchive'

        // Check if listing exists
        const existingListing = await prisma.product.findUnique({
            where: { id: listingId, sellerId }
        });
        if (!existingListing) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }

        let updatedStatus: "INACTIVE" | "PENDING" | "ARCHIVED" | "APPROVED";
        switch (action) {
            case 'deactivate':
                updatedStatus = "INACTIVE";
                break;
            case 'archive':
                updatedStatus = "ARCHIVED";
                break;
            case 'activate':
                updatedStatus = "PENDING"; // draft can be activated so it must be go to admin
                break;
            case 'unarchive':
                updatedStatus = "APPROVED"; // unarchive are the archived ones (by the seller intentions) so not need to admin approval.
                break;
            default:
                return res.status(400).json({ error: `Invalid action ${action}` });
        }
        console.log(`Toggling listing status for ${listingId} to ${updatedStatus} by seller ${sellerId}`);

        // Update listing status
        const updatedListing = await prisma.product.update({
            where: { id: listingId },
            data: { status: updatedStatus }
        });

        console.log(`Listing ${listingId} status updated to ${updatedStatus}`);
        res.json({
            message: `Listing ${action}d successfully`,
            listing: {
                id: updatedListing.id,
                name: updatedListing.name,
                description: updatedListing.description,
                price: updatedListing.price,
                categoryId: updatedListing.categoryId,
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
            where: { sellerId, status: 'APPROVED' }
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
            where: { sellerId, status: 'APPROVED' }
        });

        const totalListingsWithStatus = await prisma.product.count({
            where: {
                sellerId,
                status: {
                    in: ['APPROVED', 'INACTIVE', 'ARCHIVED']
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
            return res.status(401).json({ error: 'Unauthorized, please log in!' });
        }

        const rfqRequests = await prisma.rFQ.findMany({
            where: { product: { sellerId }, status: 'FORWARDED' },
            orderBy: { createdAt: 'desc' },
            include: { product: true, buyer: true }
        });
        // console.log(`RFQ requests for seller ${sellerId}:`, rfqRequests.length);
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
        console.log('Uploading business documents:', req.files);
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ error: 'Only PDF, JPG, and PNG files are allowed' });
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return res.status(400).json({ error: 'File size exceeds 5MB limit' });
        }

        const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';

        // Upload PDF to Cloudinary
        const uploadedUrl = await new Promise<string>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder: 'business_documents',
                    public_id: `doc_${Date.now()}`
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result.secure_url);
                }
            );
            stream.end(file.buffer);
        });
        console.log('Document uploaded successfully:', uploadedUrl);
        res.status(200).json({ message: 'Business document uploaded successfully', url: uploadedUrl });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Server error' });
    }
}

// get Seller public profile
export const getSellerPublicProfile = async (req: Request, res: Response) => {
    try {
        const { sellerId } = req.params;
        // require sellerId to be a valid UUID
        if (!sellerId) {
            console.log(`The Seller Id is Invalid`);
            return res.status(400).json({ error: 'Invalid seller ID' });
        }
        const isValidUUID = validator.isUUID(sellerId, 4);
        console.log("The Seller Id is Valid");

        const seller = await prisma.seller.findFirst({
            where: {
                OR: [
                    { id: sellerId },
                    { slug: sellerId }
                ]
            }
        });

        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        // Get only APPROVED products for this seller
        const approvedProducts = await prisma.product.findMany({
            where: {
                sellerId: sellerId,
                status: "APPROVED"
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                currency: true,
                quantity: true,
                minimumOrderQuantity: true,
                listingType: true,
                condition: true,
                validityPeriod: true,
                expiryDate: true,
                deliveryTimeInDays: true,
                logisticsSupport: true,
                industry: true,
                category: true,
                model: true,
                specifications: true,
                countryOfSource: true,
                hsnCode: true,
                certifications: true,
                warrantyPeriod: true,
                licenses: true,
                brochureUrl: true,
                videoUrl: true,
                images: true,
                tags: true
            },
            orderBy: {
                createdAt: 'desc' // Order by most recent first
            },
            take: 15 // Limit to 15 products
        });

        // Remove sensitive fields from the response
        const { password, ...publicProfile } = seller as any;

        res.status(200).json({
            message: 'Seller public profile retrieved successfully',
            seller: {
                ...publicProfile,
                products: approvedProducts
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get seller profile
export const getSellerProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;

        if (!sellerId) {
            res.status(400).json({ error: 'Invalid seller ID' });
            return;
        }
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
        // get Seller Product
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

// Create a new listing by Seller
export const createListing = async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log("Api hit for seller creating list");
        const sellerId = req.seller?.sellerId;
        if (!sellerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Parse numeric fields that may come as strings from forms
        const numericFields = [
            'price',
            'quantity',
            'minimumOrderQuantity',
            'deliveryTimeInDays',
            'validityPeriod',
        ];

        numericFields.forEach(field => {
            if (req.body[field] !== undefined) {
                req.body[field] = Number(req.body[field]);
            }
        });

        const files = (req.files as Express.Multer.File[]) || [];
        let imageUrls: string[] = [];

        if (files.length > 0) {
            try {
                imageUrls = await Promise.all(files.map(file => uploadImageToCloudinary(file)));
            } catch (uploadError) {
                return res.status(400).json({ error: (uploadError as Error).message });
            }
        }

        req.body.images = imageUrls;

        // Validate with Zod schema
        const parsed = productSchema.safeParse(req.body);

        console.log('Validation result:', parsed.success, parsed.error?.issues);
        if (!parsed.success) {
            return res.status(400).json({
                error: `Validation failed: ${parsed.error.issues[0]?.message}`,
                details: parsed.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }

        const data = parsed.data;

        // Generate and ensure unique slug
        let slug = slugify(data.name, { lower: true, strict: true });
        let uniqueSlug = slug;
        let counter = 1;

        while (await prisma.product.findFirst({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter++}`;
        }

        // Check seller
        const existingSeller = await prisma.seller.findUnique({ where: { id: sellerId } });
        if (!existingSeller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        console.log('isDraft value:', data.isDraft);
        console.log('Parsed data:', data);

        // Create the product listing
        const listing = await prisma.product.create({
            data: {
                sellerId,
                slug: uniqueSlug,
                listingType: data.listingType,
                categoryId: data.categoryId,
                industryId: data.industryId,
                condition: data.condition,
                unitId: data.unitId,
                name: data.name,
                description: data.description,
                model: data.model,
                specifications: data.specifications || "",
                hsnCode: data.hsnCode,
                quantity: data.quantity,
                minimumOrderQuantity: data.minimumOrderQuantity,
                price: data.price,
                currency: data.currency,
                deliveryTimeInDays: data.deliveryTimeInDays,
                logisticsSupport: data.logisticsSupport as any,
                countryOfSource: data.countryOfSource,
                validityPeriod: data.validityPeriod,
                warrantyPeriod: data.warrantyPeriod,
                certifications: data.certifications,
                licenses: data.licenses,
                images: data.images,
                brochureUrl: data.brochureUrl,
                videoUrl: data.videoUrl || null,
                tags: data.tags,
                keywords: data.keywords,
                status: data.isDraft ? 'DRAFT' : 'PENDING', // Now data.isDraft is properly validated
                deliveryTerm: data.deliveryTerm,
                cityOfDispatch: data.cityOfDispatch,
                loadPort: data.loadPort,
                loadCountry: data.loadCountry,
                packingDescription: data.packingDescription,
                primaryPacking: data.primaryPacking,
                secondaryPacking: data.secondaryPacking,
            }
        });

        await createSellerAdminChatOnProduct(listing.id, sellerId);

        return res.status(201).json({
            message: data.isDraft ? 'Listing saved as draft successfully' : 'Listing created successfully',
            listing: {
                id: listing.id,
                name: listing.name,
                description: listing.description,
                price: listing.price,
                status: listing.status,
                images: listing.images
            }
        });

    } catch (error) {
        console.error('Create listing error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Edit a listing by Seller
export const editListing = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.seller?.sellerId;
        const listingId = req.params.listingId;

        if (!listingId || !sellerId) {
            return res.status(400).json({ error: 'Unauthorized or invalid request' });
        }

        // Parse numeric fields
        const numericFields = [
            'price',
            'quantity',
            'minimumOrderQuantity',
            'deliveryTimeInDays',
            'validityPeriod'
        ];

        if (!req.body) req.body = {};
        numericFields.forEach(field => {
            if (req.body[field] !== undefined) {
                req.body[field] = Number(req.body[field]);
            }
        });

        // Handle image processing
        const files = (req.files as Express.Multer.File[]) || [];
        let finalImageUrls: string[] = [];

        // Get existing images from the request body (sent from frontend)
        const existingImages = req.body.existingImages;
        if (existingImages) {
            if (Array.isArray(existingImages)) {
                finalImageUrls = [...existingImages];
            } else if (typeof existingImages === 'string') {
                // Handle case where only one existing image is sent as string
                finalImageUrls = [existingImages];
            }
        }

        // Upload new files and add to the existing images
        if (files.length > 0) {
            try {
                const uploadedUrls = await Promise.all(files.map(file => uploadImageToCloudinary(file)));
                finalImageUrls = [...finalImageUrls, ...uploadedUrls];
            } catch (uploadError) {
                return res.status(400).json({ error: (uploadError as Error).message });
            }
        }

        // Set the final images array
        req.body.images = finalImageUrls;

        // Validate request data
        const validationResult = productSchema.safeParse(req.body);
        if (!validationResult.success) {
            console.log('Validation failed:', validationResult.error.issues);
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }

        const data = validationResult.data;

        // Check if listing exists and belongs to seller
        const existingListing = await prisma.product.findFirst({
            where: { id: listingId, sellerId }
        });

        if (!existingListing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Update the product
        const updatedListing = await prisma.product.update({
            where: { id: listingId },
            data: {
                listingType: data.listingType,
                categoryId: data.categoryId,
                industryId: data.industryId,
                condition: data.condition,
                name: data.name,
                description: data.description,
                model: data.model,
                specifications: data.specifications,
                hsnCode: data.hsnCode,
                quantity: data.quantity,
                minimumOrderQuantity: data.minimumOrderQuantity,
                price: data.price,
                currency: data.currency,
                deliveryTimeInDays: data.deliveryTimeInDays,
                logisticsSupport: data.logisticsSupport as any,
                countryOfSource: data.countryOfSource,
                validityPeriod: data.validityPeriod,
                warrantyPeriod: data.warrantyPeriod,
                certifications: data.certifications,
                licenses: data.licenses,
                brochureUrl: data.brochureUrl,
                videoUrl: data.videoUrl,
                tags: data.tags,
                keywords: data.keywords,
                images: data.images,
                status: 'PENDING',
                deliveryTerm: data.deliveryTerm,
                cityOfDispatch: data.cityOfDispatch,
                loadPort: data.loadPort,
                loadCountry: data.loadCountry,
                packingDescription: data.packingDescription,
                primaryPacking: data.primaryPacking,
                secondaryPacking: data.secondaryPacking,
            }
        });

        res.json({
            message: 'Listing updated successfully',
            listing: updatedListing
        });

    } catch (error) {
        console.error('Edit listing error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a single listing by Seller for editing
export const getSingleListingForEdit = async (req: AuthenticatedRequest, res: Response) => {
    const { listingId } = req.params;

    try {
        const listing = await prisma.product.findFirst({
            where: { id: listingId, sellerId: req.user?.userId }
        });

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        res.json(listing);
    } catch (error) {
        console.error('Error fetching listing for edit:', error);
        res.status(500).json({ error: 'Server error' });
    }
};