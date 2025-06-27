import { AuthenticatedRequest } from "../middlewares/authBuyer";
import { Response } from "express";
import { prisma } from "../lib/prisma";
import { DEFAULT_ADMIN_ID } from "../config";

// Create a new chat room between admin and seller
export const createChatRoomBetweenAdminAndSeller = async (req: AuthenticatedRequest, res: Response) => {
    const { rfqId, sellerId } = req.body;
    const adminId = DEFAULT_ADMIN_ID;
    if (!rfqId || !sellerId) {
        res.status(400).json({ error: "RFQ ID and Seller ID are required" });
        return;
    }
    try {
        // Check if the chat room already exists
        const existingChatRoom = await prisma.chatRoom.findFirst({
            where: {
                rfqId: rfqId,
                sellerId: sellerId,
                type: 'SELLER',
            }
        });

        if (existingChatRoom) {
            res.status(200).json({ message: "Chat room already exists", chatRoom: existingChatRoom });
            return;
        }

        // Create a new chat room
        const newChatRoom = await prisma.chatRoom.create({
            data: {
                rfqId: rfqId,
                type: 'SELLER',
                sellerId: sellerId,
                adminId: adminId,
            }
        });
        // a welcome message from the admin
        await prisma.chatMessage.create({
            data: {
                chatRoomId: newChatRoom.id,
                senderId: adminId,
                senderRole: "ADMIN",
                content: "Welcome to the chat!",
            }
        });
        res.status(201).json({ message: "Chat room created successfully", chatRoom: newChatRoom });
    } catch (error) {
        console.error("Error creating chat room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// send a message to a chat room
export const sendChatMessage = async (req: AuthenticatedRequest, res: Response) => {
    // Validate request body
    const { chatRoomId, senderRole, content } = req.body;
    if (!chatRoomId || !senderRole || !content) {
        res.status(400).json({ error: "Chat Room ID, sender role, and message content are required" });
        return;
    }
    // Only valid roles are 'ADMIN', 'BUYER', or 'SELLER'
    if (!['ADMIN', 'BUYER', 'SELLER'].includes(senderRole)) {
        res.status(400).json({ error: "Invalid sender role" });
        return;
    }
    const senderId = req.user?.userId;
    // Check if the logged-in user is part of the chat room
    const chatRoom = await prisma.chatRoom.findUnique({
        where: { id: chatRoomId },
        select: {
            adminId: true,
            sellerId: true,
            buyerId: true,
        }
    });
    if (!chatRoom) {
        res.status(404).json({ error: "Chat room not found" });
        return;
    }
    const isUserInChatRoom = senderId === chatRoom.adminId || senderId === chatRoom.sellerId || senderId === chatRoom.buyerId;
    if (!isUserInChatRoom) {
        res.status(403).json({ error: "User not authorized to access this chat room" });
        return;
    }

    try {
        const newMessage = await prisma.chatMessage.create({
            data: {
                chatRoomId: chatRoomId,
                senderId: senderId,
                senderRole: senderRole,
                content: content,
            }
        });
        res.status(201).json({ message: "Message sent successfully", chatMessage: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all message of a chat room
export const getChatMessages = async (req: AuthenticatedRequest, res: Response) => {
    const chatRoomId = req.params.id;
    const userId = req.user?.userId;
    if (!chatRoomId) {
        res.status(400).json({ error: "Chat Room ID is required" });
        return;
    }
    // Validate user ID
    if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }
    // find chatroom and the user in this chatroom
    try {
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: chatRoomId }
        });
        if (!chatRoom) {
            res.status(404).json({ error: "Chat room not found" });
            return;
        }

        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const isUserInChatRoom = userId === chatRoom.adminId || userId === chatRoom.sellerId || userId === chatRoom.buyerId;
        if (!isUserInChatRoom) {
            res.status(403).json({ error: "User not authorized to access this chat room" });
            return;
        }
        const messages = await prisma.chatMessage.findMany({
            where: { chatRoomId: chatRoomId },
            orderBy: { sentAt: 'asc' }
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// get recent chats
export const getRecentChats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const adminId = req.user?.userId;

        const recentChatRooms = await prisma.chatRoom.findMany({
            where: {
                adminId,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take: 10,
            include: {
                rfq: {
                    select: {
                        id: true,
                        status: true,
                        product: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        businessName: true,
                    },
                },
                messages: {
                    take: 1,
                    orderBy: {
                        sentAt: 'desc',
                    },
                    select: {
                        id: true,
                        content: true,
                        senderRole: true,
                        sentAt: true,
                        read: true,
                    },
                },
            },
        });

        const response = recentChatRooms.map((room) => ({
            chatRoomId: room.id,
            type: room.type,
            rfqId: room.rfqId,
            rfqStatus: room.rfq.status,
            productName: room.rfq.product.name,
            with: room.type === 'BUYER'
                ? `${room.buyer?.firstName} ${room.buyer?.lastName}`
                : `${room.seller?.businessName || room.seller?.firstName}`,
            lastMessage: room.messages[0] || null,
        }));

        res.status(200).json({
            success: true,
            chats: response,
        });

    } catch (error) {
        console.error('Error fetching recent chats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recent chats',
        });
    }
};

// Get all chat rooms of admin
export const getAdminChatRooms = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const adminId = req.user?.userId;

        const chatRooms = await prisma.chatRoom.findMany({
            where: {
                adminId,
            },
            include: {
                buyer: true,
                seller: true,
                messages: true,
            },
        });

        res.status(200).json({
            success: true,
            chatRooms,
        });
    } catch (error) {
        console.error('Error fetching admin chat rooms:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch admin chat rooms',
        });
    }
};

// export const sampleDataInsert = async () => {
//     try {
//         await prisma.chatRoom.create({
//             data: {
//                 rfqId: 'sample-rfq-id',
//                 buyerId: 'sample-buyer-id',
//                 sellerId: 'sample-seller-id',
//                 adminId: 'sample-admin-id',
//                 type: 'BUYER',
//                 messages: {
//                     create: {
//                         content: 'Hello, this is a sample message.',
//                         senderRole: 'ADMIN',
//                     },
//                 },
//             },
//         });

//         console.log('Sample data inserted successfully.');
//     } catch (error) {
//         console.error('Error inserting sample data:', error);
//     }
// };

/*

model ChatRoom {
  id        String        @id @default(uuid())
  rfqId     String
  rfq       RFQ           @relation(fields: [rfqId], references: [id])

  buyerId   String?       // Admin ↔ Buyer
  buyer     Buyer?        @relation(fields: [buyerId], references: [id])

  sellerId  String?       // Admin ↔ Seller
  seller    Seller?       @relation(fields: [sellerId], references: [id])

  adminId   String
  admin     User          @relation(fields: [adminId], references: [id])

  type      ChatRoomType

  messages  ChatMessage[]

  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@unique([rfqId, type]) // only one chat room per RFQ type
}
*/
interface ChatRoom {
    id: string;
    rfqId: string;
    type: 'BUYER' | 'SELLER';
    buyerId?: string;
    sellerId?: string;
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
}
interface ChatMessage {
    id: string;
    chatRoomId: string;
    senderId: string;
    senderRole: 'ADMIN' | 'BUYER' | 'SELLER';
    content: string;
    sentAt: Date;
    read: boolean;
}
interface RFQ {
    id: string;
    product: {
        name: string;
    };
    status: string;
}
interface API_RESPONSE {
    success: boolean;
    error?: string;
    chatRooms?: ChatRoom[];
}