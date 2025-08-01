import { Request, Response, Router } from "express";
enum ProductStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
import { requireAdmin } from "../middlewares/authAdmin";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middlewares/requireAuth";
import asyncHandler from "../utils/asyncHandler";
import { getAllListings, getStatsForAdminListing } from "../controllers/listing.controller";

// Base url: http://localhost:3001/api/v1/listing

const listingRouter = Router();
console.log('Listing router called');

// Apply middleware to all routes
listingRouter.use(requireAdmin);

// GET /api/v1/listing/pending - Get all pending listings
listingRouter.get('/all', requireAuth({ allowedRoles: ['admin'], allowedAdminRoles: ["SUPER_ADMIN", "INSPECTOR", "ADMIN"] }), asyncHandler(getAllListings));
listingRouter.get('/stats', requireAuth({ allowedRoles: ['admin'], allowedAdminRoles: ["SUPER_ADMIN", "INSPECTOR", "ADMIN"] }), asyncHandler(getStatsForAdminListing));


// POST /api/v1/listing/approve/:id - Approve a listing
listingRouter.post('/approve/:id', requireAuth({ allowedRoles: ['admin'], allowedAdminRoles: ["SUPER_ADMIN", "INSPECTOR", "ADMIN"] }), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            console.error('Listing ID is required for approval');
            res.status(400).json({
                success: false,
                error: 'Listing ID is required'
            });
            return;
        }

        console.log(`Approving listing with ID: ${id}`);

        const existingListing = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingListing) {
            res.status(404).json({
                success: false,
                error: 'Listing not found'
            });
            return;
        }

        if (existingListing.status !== ProductStatus.PENDING) {
            console.log(`Cannot approve listing with status: ${existingListing.status}`);
            res.status(400).json({
                success: false,
                error: `Cannot approve a listing with status: ${existingListing.status}`
            });
            return;
        }

        const approvedListing = await prisma.product.update({
            where: { id },
            data: { status: ProductStatus.APPROVED }
        });

        console.log(`Listing with ID: ${id} approved successfully`);
        res.json({
            success: true,
            message: 'Listing approved successfully',
            data: approvedListing
        });
    } catch (error) {
        console.error('Error approving listing:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to approve listing'
        });
    }
});

// POST /api/v1/listing/reject/:id - Reject a listing
listingRouter.post('/reject/:id', requireAuth({ allowedRoles: ['admin'], allowedAdminRoles: ["SUPER_ADMIN", "INSPECTOR", "ADMIN"] }), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Listing ID is required'
            });
            return;
        }

        const existingListing = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingListing) {
            res.status(404).json({
                success: false,
                error: 'Listing not found'
            });
            return;
        }

        // get reason from request body
        const { reason } = req.body;
        if (!reason || reason.trim() === "") {
            res.status(400).json({
                success: false,
                error: 'Reason is required to reject a listing'
            });
            return;
        }

        if (existingListing.status !== ProductStatus.PENDING) {
            res.status(400).json({
                success: false,
                error: `Cannot reject a listing with status: ${existingListing.status}`
            });
            return;
        }

        const rejectedListing = await prisma.product.update({
            where: { id },
            data: {
                status: ProductStatus.REJECTED,
                rejectionReason: reason
            }
        });

        res.json({
            success: true,
            message: 'Listing rejected successfully',
            data: rejectedListing
        });
    } catch (error) {
        console.error('Error rejecting listing:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reject listing'
        });
    }
});

// Developer 3 : Get listing by category
listingRouter.get('/category/:category', async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        if (!category) {
            res.status(400).json({
                success: false,
                error: 'Category ID is required'
            });
            return;
        }

        const listings = await prisma.product.findMany({
            where: {
                category: category,
                status: "APPROVED"
            }, // Filter by category and approved status
            include: {
                seller: {
                    select: {
                        id: true,
                        email: true
                    }
                }, // Include seller information
                _count: {
                    select: {
                        rfqs: true
                    }
                } // Include count of RFQs
            },
            orderBy: {
                id: 'desc'
            }
        });

        res.json({
            success: true,
            data: listings,
            count: listings.length
        });
    } catch (error) {
        console.error('Error fetching listings by category:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch listings by category'
        });
    }
});

// Clean up Prisma connection on process termination
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export { listingRouter };