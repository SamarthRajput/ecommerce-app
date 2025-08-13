import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../middlewares/authSeller";
import { createRFQRecord } from "../services/rfqService";
import { CreateRFQRequest } from "../types/rfq";
import { validateRFQInput } from "../validators/rfqValidator";

export const createRFQ = async (req: Request, res: Response) => {
  const buyerId = req.user?.userId;
  if (!req.body || !Object.keys(req.body).length) {
    return res.status(400).json({ message: 'Bad Request: RFQ data is required' });
  }

  if (!buyerId) {
    return res.status(401).json({ message: 'Unauthorized: Buyer ID is required' });
  }

  const validation = validateRFQInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const [product, buyer] = await Promise.all([
      prisma.product.findUnique({ where: { id: req.body.productId }, select: { id: true } }),
      prisma.buyer.findUnique({ where: { id: buyerId }, select: { id: true } })
    ]);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    const rfq = await createRFQRecord(buyerId, req.body as CreateRFQRequest);

    handleChatRoomCreation(rfq.id, buyerId).catch(err =>
      console.error('Chat room creation failed:', err)
    );

    return res.status(201).json({ data: rfq });
  } catch (error) {
    console.error('Error creating rfq:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getListingInfoForRfq = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Bad Request: Listing ID is required' });
  }

  try {
    const listing = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        industry: true,
        unit: true
      }
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found, please check the URL and try again.' });
    }
    const listingData = {
      id: listing.id,
      name: listing.name,
      unitId: listing.unitId,
      quantity: listing.quantity,
      currency: listing.currency,
      price: listing.price,
      minimumOrderQuantity: listing.minimumOrderQuantity,
      minimumDeliveryDateInDays: listing.deliveryTimeInDays,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      category: {
        id: listing.category.id,
        name: listing.category.name
      },
      industry: {
        id: listing.industry.id,
        name: listing.industry.name
      },
      unit: {
        id: listing.unit.id,
        name: listing.unit.name,
        symbol: listing.unit.symbol
      }
    };

    return res.status(200).json({ data: listingData });
  } catch (error) {
    console.error('Error fetching listing info:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

async function getOrCreateAdmin(): Promise<AdminUser> {
  // Try to find existing admin
  const existingAdmin = await prisma.admin.findFirst({
    where: { role: 'ADMIN' }
  });

  if (existingAdmin) {
    return existingAdmin;
  }
  const email = `1@1`;
  const password = `1`;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = await prisma.admin.create({
    data: {
      email,
      name: 'Admin',
      role: 'ADMIN',
      password: hashedPassword
    }
  });
  return newAdmin;
}

// Handle chat room creation
async function handleChatRoomCreation(rfqId: string, buyerId: string): Promise<void> {
  try {
    // Get or create admin user (guaranteed to return an AdminUser)
    const admin = await getOrCreateAdmin();

    // Check if chat room already exists
    const existingChatRoom = await prisma.chatRoom.findFirst({
      where: { rfqId, type: 'BUYER' }
    });

    if (!existingChatRoom) {
      // Create new chat room with guaranteed adminId
      const newChatRoom = await prisma.chatRoom.create({
        data: {
          rfqId,
          type: 'BUYER',
          buyerId,
          adminId: admin.id // This is now guaranteed to be a string
        }
      });

      // Send welcome message
      await prisma.chatMessage.create({
        data: {
          chatRoomId: newChatRoom.id,
          senderId: admin.id,
          senderRole: "ADMIN",
          content: "Welcome to the chat! How can we assist you?",
          sentAt: new Date(),
          read: false
        }
      });
    }
  } catch (chatError) {
    console.error("Error in chat room creation:", chatError);
  }
}

// GET all RFQs for a buyer
export const getRFQsByBuyer = async (req: Request, res: Response) => {
  const { buyerId } = req.params;

  try {
    const rfqs = await prisma.rFQ.findMany({
      where: { buyerId },
      include: {
        product: true,
        trade: true
      }
    });
    res.status(200).json(rfqs);
  } catch (error) {
    console.error("Error fetching RFQs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

interface RFQStats {
  pending: number;
  approved: number;
  rejected: number;
  forwarded: number;
  total: number;
}

// GET /rfq/pending - Get all pending RFQs
export const getAllRFQs = async (req: Request, res: Response) => {
  try {
    const allRFQs = await prisma.rFQ.findMany({
      include: {
        product: true,
        buyer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log("\n\n\n\nAll RFQs:", allRFQs);
    const count = await prisma.rFQ.count();
    console.log("All RFQs count:", count);
    res.status(200).json({
      success: true,
      data: allRFQs,
    });
  } catch (error) {
    console.error("Error fetching all RFQs:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};

// GET /rfq/forwarded - Get all forwarded RFQs
export const getForwardedRFQs = async (req: Request, res: Response) => {
  try {
    const forwardedRFQs = await prisma.rFQ.findMany({
      where: { status: "FORWARDED" },
      include: {
        product: {
          include: {
            seller: true
          }
        },
        buyer: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const count = await prisma.rFQ.count({
      where: { status: "FORWARDED" }
    });

    res.status(200).json({
      success: true,
      data: forwardedRFQs,
      count
    });
  } catch (error) {
    console.error("Error fetching approved RFQs:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};

// POST /rfq/forward/:id?sellerId=xxx
export const forwardRFQ = async (req: AuthenticatedRequest, res: Response) => {
  const { id, isUpdatedByAdmin = false } = req.params;

  try {
    // 1. Check RFQ exists
    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: {
        product: true,
        buyer: true
      }
    });

    if (!rfq) {
      res.status(404).json({
        success: false,
        error: "RFQ not found"
      });
      return;
    }

    // get seller id from product of rfq
    const sellerId = rfq.product.sellerId;

    // 2. Check if already forwarded to this seller
    const existingForward = await prisma.rFQForward.findUnique({
      where: {
        rfqId_sellerId: {
          rfqId: id,
          sellerId: sellerId
        }
      }
    });

    if (existingForward) {
      res.status(409).json({
        success: false,
        error: "RFQ has already been forwarded to this seller"
      });
      return;
    }

    // 3. Update RFQ status
    const updatedRFQ = await prisma.rFQ.update({
      where: { id },
      data: {
        status: "FORWARDED",
        reviewedAt: new Date(),
      }
    });

    // 4. Create RFQForward entry
    const forwardRecord = await prisma.rFQForward.create({
      data: {
        rfqId: id,
        sellerId: sellerId,
        isUpdatedByAdmin: isUpdatedByAdmin === 'true', // Convert string to boolean
        forwardedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      data: {
        rfq: updatedRFQ,
        forwardedTo: forwardRecord
      }
    });
    return;

  } catch (error) {
    console.error("Error forwarding RFQ:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
    return;
  }
};

// POST /rfq/reject/:id - Reject an RFQ
export const rejectRFQ = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        success: false,
        error: "Invalid request body"
      });
      return;
    }

    const { reason } = req.body;

    if (!reason || typeof reason !== 'string') {
      res.status(400).json({
        success: false,
        error: "Valid rejection reason is required"
      });
      return
    }

    // Check if RFQ exists and is pending
    const rfq = await prisma.rFQ.findUnique({
      where: { id }
    });

    if (!rfq) {
      res.status(404).json({
        success: false,
        error: "RFQ not found"
      });
      return;
    }

    if (rfq.status !== 'PENDING') {
      res.status(400).json({
        success: false,
        error: "Only pending RFQs can be rejected"
      });
      return;
    }

    // Update RFQ with proper typing
    const updatedRFQ = await prisma.rFQ.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        reviewedAt: new Date()
      },
      include: {
        product: true,
        buyer: true
      }
    });
    res.status(200).json({
      success: true,
      data: updatedRFQ
    });
    return;

  } catch (error) {
    console.error("Error in rejectRFQ:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while processing rejection"
    });
    return;
  }
};


// GET /rfq/stats - Get RFQ statistics
export const getRFQStats = async (req: Request, res: Response) => {
  try {
    const [pending, approved, rejected, forwarded, total] = await Promise.all([
      prisma.rFQ.count({ where: { status: "PENDING" } }),
      prisma.rFQ.count({ where: { status: "APPROVED" } }),
      prisma.rFQ.count({ where: { status: "REJECTED" } }),
      prisma.rFQ.count({ where: { status: "FORWARDED" } }),
      prisma.rFQ.count({}),
    ]);
    // const allRFQs = await prisma.rFQ.findMany();
    // console.log("\n\n\n\nAll RFQs:", allRFQs);
    const stats: RFQStats = {
      pending,
      approved,
      rejected,
      forwarded,
      total,
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching RFQ stats:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};

// GET /rfq/seller - Get all forwarded RFQs for a Seller
export const getSellerForwardedRFQs = async (req: Request, res: Response) => {
  const sellerId = req.user?.userId;

  if (!sellerId) {
    res.status(401).json({ success: false, error: "User not authenticated" });
    return;
  }

  try {
    const rfqs = await prisma.rFQ.findMany({
      where: {
        status: "FORWARDED",
        product: {
          sellerId: sellerId
        }
      },
      include: {
        product: true,
        buyer: true
      }
    });

    res.status(200).json({
      success: true,
      data: rfqs
    });
  } catch (error) {
    console.error("Error fetching seller RFQs:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};