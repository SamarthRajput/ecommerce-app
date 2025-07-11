import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../middlewares/authSeller";

// POST /rfq
export const createRFQ = async (req: Request, res: Response) => {
  const { productId, quantity, message } = req.body;
  const buyerId = req.user?.userId;

  if (!buyerId) {
    res.status(401).json({ message: 'Unauthorized: Buyer ID is required' });
    return;
  }

  if (!productId || !quantity) {
    res.status(400).json({ message: 'productId and quantity are required' });
    return;
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    res.status(400).json({ message: 'quantity must be a positive number' });
    return;
  }

  // handle rfq creation
  try {
    const [product, buyer] = await Promise.all([
      prisma.product.findUnique({
        where: { id: productId },
        select: { id: true }
      }),
      prisma.buyer.findUnique({
        where: { id: buyerId },
        select: { id: true }
      })
    ]);

    if (!product) {
      res.status(404).json({ message: 'Product not found' }); return;
    }

    if (!buyer) {
      res.status(404).json({ message: 'Buyer not found' }); return;
    }

    const rfq = await prisma.rFQ.create({
      data: {
        productId,
        buyerId,
        quantity,
        message,
        status: 'PENDING',
      }
    });

    // Handle chat room creation. (wont block rfq creation)
    await handleChatRoomCreation(rfq.id, buyerId);

    res.status(201).json({ data: rfq });
    return;
  }
  catch (error) {
    console.error("Error creating rfq:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
  total: number;
}

// GET /rfq/pending - Get all pending RFQs
export const getPendingRFQs = async (req: Request, res: Response) => {
  try {
    const pendingRFQs = await prisma.rFQ.findMany({
      where: { status: "PENDING" },
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
      where: { status: "PENDING" }
    });
    console.log("Pending RFQs count:", count);
    // console.log("Pending RFQs data:", pendingRFQs);

    res.status(200).json({
      success: true,
      data: pendingRFQs,
      count
    });
  } catch (error) {
    console.error("Error fetching pending RFQs:", error);
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
    const [pending, approved, rejected] = await Promise.all([
      prisma.rFQ.count({ where: { status: "PENDING" } }),
      prisma.rFQ.count({ where: { status: "APPROVED" } }),
      prisma.rFQ.count({ where: { status: "REJECTED" } })
    ]);

    const stats: RFQStats = {
      pending,
      approved,
      rejected,
      total: pending + approved + rejected
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