import { Request, response, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireManager } from "../middlewares/requireManager";
import { ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();
// Base url of backend: http://localhost:3001/api/v1/listing

export const listingRouter = Router();
console.log('Calling listing router...');

// / api/v1/listing/pending for getting all pending listings
listingRouter.use(requireManager);
listingRouter.get('/pending', async (req, res) => {
    try {
        console.log('Fetching pending listings...');
        const pendingListings = await prisma.product.findMany({
            where: {
                status: 'PENDING'
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
            }, // Include seller details and count of RFQs
            orderBy: {
                id: 'desc'
            } // Order by id descending
        });

        res.json({
            success: true,
            data: pendingListings,
            count: pendingListings.length
        });
        return;
    } catch (error) {
        console.error('Error fetching pending listings:', error);
        res.status(500).json({
            error: 'Failed to fetch pending listings'
        });
        return;
    }
});

// /api/v1/listing/approve/:id for approving a listing
listingRouter.post('/approve/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
        res.status(400).json({ error: 'Listing ID is required' });
        return;
    }

    console.log(`Approving listing with ID: ${id}`);

    try {
        const existingListing = await prisma.product.findUnique({
            where: { id: id },
        });

        if (!existingListing) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }

        if (existingListing.status !== 'PENDING') {
            res.status(400).json({
                error: `Cannot approve a listing with status: ${existingListing.status}`
            });
            return;
        }

        const listing = await prisma.product.update({
            where: { id: id },
            data: { status: 'ACTIVE' }
        });

        res.json({
            success: true,
            message: 'Listing approved successfully',
            data: listing
        });
        return;

    } catch (error) {
        console.error('Error approving listing:', error);
        res.status(500).json({
            error: 'Failed to approve listing'
        });
        return;
    }
});

// /api/v1/listing/reject/:id for rejecting a listing
listingRouter.post('/reject/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Listing ID is required' });
        return;
    }
    try {
        const listing = await prisma.product.update({
            where: { id: id },
            data: { status: 'REJECTED' }
        });

        res.json({
            success: true,
            message: 'Listing rejected successfully',
            data: listing
        });
        return;
    } catch (error) {
        console.error('Error rejecting listing:', error);
        res.status(500).json({
            error: 'Failed to reject listing'
        });
        return;
    }
});
// /api/v1/listing/active for getting all active listings
listingRouter.get('/active', async (req, res) => {
    try {
        const activeListings = await prisma.product.findMany({
            where: {
                status: 'ACTIVE'
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
            }, // Include seller details and count of RFQs
            orderBy: {
                id: 'desc'
            } // Order by id descending
        });

        res.json({
            success: true,
            data: activeListings,
            count: activeListings.length
        });
        return;
    } catch (error) {
        console.error('Error fetching active listings:', error);
        res.status(500).json({
            error: 'Failed to fetch active listings'
        });
        return;
    }
});

listingRouter.post('/test', async (req, res) => {
    try {
        const { name, description, price, quantity, sellerId } = req.body;

        if (!name || !description || !price || !quantity || !sellerId) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        const newListing = await prisma.product.create({
            data: {
                name,
                description,
                price,
                quantity,
                sellerId,
                status: ProductStatus.PENDING
            }
        });

        res.json({
            success: true,
            message: 'Listing created successfully',
            data: newListing
        });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({
            error: 'Failed to create listing'
        });
    }
});

// sample post body for testing
