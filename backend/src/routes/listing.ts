import { Request, Response, Router } from "express";
import { ProductStatus } from "@prisma/client";
import { requireManager } from "../middlewares/requireManager";
import { prisma } from "../lib/prisma";

// Base url: http://localhost:3001/api/v1/listing

const listingRouter = Router();
console.log('Listing router called');

// Apply middleware to all routes
listingRouter.use(requireManager);

// GET /api/v1/listing/pending - Get all pending listings
listingRouter.get('/pending', async (req: Request, res: Response) => {
    try {
        console.log('Fetching pending listings...');

        const pendingListings = await prisma.product.findMany({
            where: {
                status: ProductStatus.PENDING
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        rfqs: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        console.log(`Found ${pendingListings.length} pending listings`);
        res.json({
            success: true,
            data: pendingListings,
            count: pendingListings.length
        });
    } catch (error) {
        console.error('Error fetching pending listings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pending listings'
        });
    }
});

// GET /api/v1/listing/active - Get all active listings
listingRouter.get('/active', async (req: Request, res: Response) => {
    try {
        const activeListings = await prisma.product.findMany({
            where: {
                status: ProductStatus.ACTIVE
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        rfqs: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        console.log(`Found ${activeListings.length} active listings`);
        res.json({
            success: true,
            data: activeListings,
            count: activeListings.length
        });
    } catch (error) {
        console.error('Error fetching active listings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch active listings'
        });
    }
});

// POST /api/v1/listing/approve/:id - Approve a listing
listingRouter.post('/approve/:id', async (req: Request, res: Response) => {
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
            data: { status: ProductStatus.ACTIVE }
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
listingRouter.post('/reject/:id', async (req: Request, res: Response) => {
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

        if (existingListing.status !== ProductStatus.PENDING) {
            res.status(400).json({
                success: false,
                error: `Cannot reject a listing with status: ${existingListing.status}`
            });
            return;
        }

        const rejectedListing = await prisma.product.update({
            where: { id },
            data: { status: ProductStatus.REJECTED }
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
                status: ProductStatus.ACTIVE
            }, // Filter by category and active status
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