// File: backend/src/controllers/chatMessageController.ts
import { AuthenticatedRequest } from "../middlewares/authBuyer";
import { Response, Request } from "express";
import { prisma } from "../lib/prisma";
import validator from 'validator';
import sanitizeHtml from 'sanitize-html';
import { parsePagination } from "../utils/parsePagination";
import { v2 as cloudinary } from "cloudinary";
import generateChatTitle from "../utils/generateChatTitle";
import MasterDataService from "../services/masterData";

// Create a new chat room between admin and seller
export const createChatRoomBetweenAdminAndSeller = async (req: AuthenticatedRequest, res: Response) => {
    const { rfqId } = req.body;
    if (!rfqId) {
        res.status(400).json({ error: "RFQ ID is required" });
        return;
    }
    // get product details from RFQ
    const rfq = await prisma.rFQ.findUnique({
        where: { id: rfqId },
        select: {
            id: true,
            product: {
                select: {
                    name: true,
                    sellerId: true,
                }
            }
        }
    });
    if (!rfq) {
        res.status(404).json({ error: "RFQ not found" });
        return;
    }
    if (!rfq.product) {
        res.status(404).json({ error: "Product not found for the RFQ" });
        return;
    }
    // Get sellerId details from product
    const sellerId = rfq.product.sellerId;
    if (!sellerId) {
        res.status(404).json({ error: "Seller not found for the product" });
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
        // Get adminId from logged in admin as only admin can create chat rooms
        const adminId = req.user?.userId;
        if (!adminId) {
            res.status(401).json({ error: "Admin not authenticated" });
            return;
        }
        const admin = await prisma.admin.findUnique({
            where: { id: adminId }
        });
        if (!admin) {
            res.status(404).json({ error: "Admin not found" });
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
    const { chatRoomId, content } = req.body;
    if (!chatRoomId || !content) {
        res.status(400).json({ error: "Chat Room ID and message content are required" });
        return;
    }

    if (typeof content !== 'string' || content.trim().length === 0) {
        res.status(400).json({ error: "Message content cannot be empty" });
        return;
    }
    if (!validator.isLength(content, { min: 1, max: 5000 })) {
        res.status(400).json({ error: "Message content must be between 1 and 5000 characters" });
        return;
    }

    // sanitize content
    const sanitizedContent = sanitizeHtml(content);
    if (sanitizedContent !== content) {
        console.warn("Content was sanitized, potential XSS attack prevented");
    }
    // get sender details
    const senderRole = req.user?.role;
    if (!senderRole) {
        res.status(401).json({ error: "User unauthenticated" });
        return;
    }

    // Only valid roles are 'admin', 'buyer', or 'seller'
    if (!['admin', 'buyer', 'seller'].includes(senderRole)) {
        res.status(400).json({ error: "Unauthorized request" });
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
                senderRole: senderRole.toUpperCase() as any,
                content: sanitizedContent,
            }
        });
        res.status(201).json({ message: "Message sent successfully", chatMessage: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all messages of a chat room (with full data for UI)
export const getChatMessages = async (req: AuthenticatedRequest, res: Response) => {
    const chatRoomId = req.params.id;
    const { take, skip } = parsePagination(req.query);
    const userId = req.user?.userId;

    if (!chatRoomId) {
        return res.status(400).json({ error: "Invalid Chat Room ID format" });
    }

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        // Validate chat room and access
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
            select: {
                id: true,
                adminId: true,
                sellerId: true,
                buyerId: true
            }
        });

        if (!chatRoom) {
            return res.status(404).json({ error: "Chat room not found" });
        }

        const isUserInChatRoom = [chatRoom.adminId, chatRoom.sellerId, chatRoom.buyerId].includes(userId);
        if (!isUserInChatRoom) {
            return res.status(403).json({ error: "User not authorized to access this chat room" });
        }

        // Fetch messages with full data for UI
        const messages = await prisma.chatMessage.findMany({
            where: { chatRoomId },
            orderBy: { sentAt: 'asc' },
            skip,
            take,
            select: {
                id: true,
                chatRoomId: true,
                content: true,
                senderId: true,
                senderRole: true,
                sentAt: true,
                read: true,
                edited: true,
                deleted: true,
                isPinned: true,
                isStarred: true,
                attachmentType: true,
                attachmentUrl: true,

                // Reply-to preview
                replyTo: {
                    select: {
                        id: true,
                        content: true,
                        senderId: true,
                        senderRole: true,
                        deleted: true
                    }
                },

                // Reactions list
                reactions: {
                    select: {
                        reactorId: true,
                        reactorRole: true,
                        emoji: true,
                        createdAt: true
                    }
                }
            }
        });

        // Prepare final response structure
        type MessageStatus = 'sending' | 'sent' | 'read';

        const messagesWithStatus = messages.map((msg) => ({
            ...msg,
            status: msg.read ? 'read' : 'sent' as MessageStatus,
        })); return res.status(200).json({
            success: true,
            chatRoomId,
            messages: messagesWithStatus,
            pagination: {
                skip,
                take,
                count: messagesWithStatus.length,
                hasMore: messagesWithStatus.length === take
            }
        });
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error("Chat fetch error:", error);
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

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

        type RecentChatRoom = typeof recentChatRooms[number];
        const response = recentChatRooms.map((room: RecentChatRoom) => ({
            chatRoomId: room.id,
            type: room.type,
            rfqId: room.rfqId,
            rfqStatus: room.rfq?.status,
            productName: room.rfq?.product.name,
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
export const getUserChatRooms = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { take, skip } = parsePagination(req.query);

        if (!userId) {
            res.status(400).json({ error: "Invalid User ID format" });
            return;
        }

        if (!userRole) {
            res.status(400).json({ error: "User role is required" });
            return;
        }

        let whereClause: any = {};
        switch (userRole) {
            case 'admin':
                whereClause = { adminId: userId };
                break;
            case 'seller':
                whereClause = { sellerId: userId };
                break;
            case 'buyer':
                whereClause = { buyerId: userId };
                break;
            default:
                res.status(403).json({ error: "Unauthorized role" });
                return;
        }

        const chatRooms = await prisma.chatRoom.findMany({
            where: whereClause,
            include: {
                buyer: true,
                seller: true,
                messages: {
                    orderBy: { sentAt: 'desc' },
                    take: 1
                },
                rfq: {
                    select: {
                        id: true,
                        status: true,
                        product: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
            skip,
            take,
        });

        const chatRoomsWithTitles = chatRooms.map((chatRoom) => {
            let title;
            try {
                // Add null checking before calling generateChatTitle
                if (chatRoom.rfq && chatRoom.rfq.product) {
                    title = generateChatTitle(chatRoom, userRole);
                } else {
                    // Fallback title when RFQ or product is missing
                    if (chatRoom.type === 'BUYER' && chatRoom.buyer) {
                        title = `Chat with ${chatRoom.buyer.firstName} ${chatRoom.buyer.lastName}`;
                    } else if (chatRoom.type === 'SELLER' && chatRoom.seller) {
                        title = `Chat with ${chatRoom.seller.businessName || chatRoom.seller.firstName + ' ' + chatRoom.seller.lastName}`;
                    } else {
                        title = 'Chat Room';
                    }
                }
            } catch (error) {
                console.error('Error generating chat title:', error);
                // Fallback title in case of any error
                title = 'Chat Room';
            }

            return {
                ...chatRoom,
                title,
            };
        });

        res.status(200).json({
            success: true,
            role: userRole,
            chatRooms: chatRoomsWithTitles
        });

    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch chat rooms',
        });
    }
};

// Mark messages as read
export const markMessagesAsRead = async (req: AuthenticatedRequest, res: Response) => {
    const chatRoomId = req.params.id;
    const messageIds = req.body.messageIds;
    const userId = req.user?.userId;

    if (!chatRoomId || !messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        console.log("Invalid request data:", { chatRoomId, messageIds });
        res.status(400).json({ error: "Chat Room ID and message IDs are required" });
        return;
    }

    if (messageIds.length > 100) {
        res.status(400).json({ error: "Too many message IDs provided. Maximum allowed is 100." });
        return;
    }

    if (!validator.isUUID(chatRoomId)) {
        res.status(400).json({ error: "Invalid Chat Room ID format" });
        return;
    }
    if (!messageIds.every(id => validator.isUUID(id))) {
        res.status(400).json({ error: "Invalid Message IDs format" });
        return;
    }

    // Validate user ID
    if (!userId) {
        res.status(401).json({ error: "User unauthenticated" });
        return;
    }

    // Check if the user is part of the chat room
    const chatRoom = await prisma.chatRoom.findUnique({
        where: {
            id: chatRoomId,
        },
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
    const isUserInChatRoom = userId === chatRoom.adminId || userId === chatRoom.sellerId || userId === chatRoom.buyerId;
    if (!isUserInChatRoom) {
        res.status(403).json({ error: "User not authorized to mark messages as read" });
        return;
    }
    try {
        const updatedMessages = await prisma.chatMessage.updateMany({
            where: {
                id: { in: messageIds },
                chatRoomId,
                read: false,
                senderId: { not: userId }, // Only mark messages sent by others as read
            },
            data: {
                read: true,
            }
        });
        console.log(`Marked ${updatedMessages.count} messages as read in chat room ${chatRoomId}`);
        if (updatedMessages.count === 0) {
            res.status(404).json({ message: "No unread messages found to mark as read" });
            return;
        }
        res.status(200).json({ message: "Messages marked as read", updatedCount: updatedMessages.count });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Edit a single message
export const editChatMessage = async (req: AuthenticatedRequest, res: Response) => {
    const { content } = req.body;
    const messageId = req.params.id;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // Basic validation
    if (!messageId || !content) {
        return res.status(400).json({ error: "Message ID and new content are required" });
    }
    if (!validator.isUUID(messageId)) {
        return res.status(400).json({ error: "Invalid Message ID format" });
    }

    if (!userId || !userRole || !['admin', 'buyer', 'seller'].includes(userRole)) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    if (typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ error: "Message content cannot be empty" });
    }

    try {
        // Find the message
        const message = await prisma.chatMessage.findUnique({
            where: { id: messageId }
        });

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Ownership check
        if (message.senderId !== userId) {
            return res.status(403).json({ error: "You can only edit your own messages" });
        }

        const now = new Date();
        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
        if (message.sentAt < fifteenMinutesAgo) {
            return res.status(403).json({ error: "Message editing time window has expired" });
        }
        // Sanitize content
        const sanitizedContent = sanitizeHtml(content);
        if (sanitizedContent !== content) {
            console.warn("Content was sanitized, potential XSS attack prevented");
        }

        if (validator.isLength(sanitizedContent, { max: 5000 }) || sanitizedContent.trim().length === 0) {
            return res.status(400).json({ error: "Message content exceeds maximum length of 5000 characters or is empty" });
        }

        // if no changes in content, return early
        if (message.content.trim() === sanitizedContent.trim()) {
            return res.status(200).json({
                message: "No changes made to the message content",
                updatedMessage: message
            });
        }

        // Update content and mark as edited
        const updatedMessage = await prisma.chatMessage.update({
            where: { id: messageId },
            data: {
                content: sanitizedContent.trim(),
                edited: true
            }
        });

        return res.status(200).json({
            message: "Message updated successfully",
            updatedMessage
        });

    } catch (error) {
        console.error("Error editing chat message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Soft delete a message
export const deleteChatMessage = async (req: AuthenticatedRequest, res: Response) => {
    const messageId = req.params.id;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // Basic validation
    if (!messageId || !validator.isUUID(messageId)) {
        return res.status(400).json({ error: "Message ID is required and must be a valid UUID" });
    }

    if (!userId || !userRole || !['ADMIN', 'BUYER', 'SELLER'].includes(userRole)) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        // Find the message
        const message = await prisma.chatMessage.findUnique({
            where: { id: messageId }
        });

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Ownership check
        if (message.senderId !== userId) {
            return res.status(403).json({ error: "You can only delete your own messages" });
        }

        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        if (message.sentAt < fifteenMinutesAgo) {
            return res.status(403).json({ error: "You can only delete messages within 15 minutes" });
        }

        // Check if the message is already deleted
        if (message.deleted) {
            return res.status(400).json({ error: "Message is already deleted" });
        }

        // Soft delete the message
        await prisma.chatMessage.update({
            where: { id: messageId },
            data: { deleted: true }
        });

        return res.status(200).json({ message: "Message deleted successfully" });

    } catch (error) {
        console.error("Error deleting chat message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Pin a message in a chat room
export const pinChatMessage = async (req: AuthenticatedRequest, res: Response) => {
    const messageId = req.params.messageId;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // Basic validation
    if (!messageId) {
        return res.status(400).json({ error: "Message ID is required" });
    }

    if (!userId || !userRole || !['ADMIN', 'BUYER', 'SELLER'].includes(userRole.toUpperCase())) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        // Find the message
        const message = await prisma.chatMessage.findUnique({
            where: { id: messageId }
        });

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // check for already pinned messages in the same chat room
        if (message.isPinned) {
            // Unpin the message
            const updatedMessage = await prisma.chatMessage.update({
                where: { id: messageId },
                data: { isPinned: false }
            });
            return res.status(200).json({
                message: "Message unpinned successfully",
                updatedMessage
            });
        } else {

            const pinnedCount = await prisma.chatMessage.count({
                where: {
                    chatRoomId: message.chatRoomId,
                    isPinned: true,
                    deleted: false, // Ensure we only count non-deleted messages
                }
            });

            if (pinnedCount >= 3) {
                return res.status(400).json({ error: "Pin limit reached (max 3 messages per room)" });
            }
        }

        // Update the message to pin it
        const updatedMessage = await prisma.chatMessage.update({
            where: { id: messageId },
            data: { isPinned: true }
        });

        return res.status(200).json({
            message: "Message pinned successfully",
            updatedMessage
        });

    } catch (error) {
        console.error("Error pinning chat message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Upload media and documents to a chat room
export const uploadMediaToChatRoom = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const senderId = req.user?.userId;
        const roomId = req.params.roomId;
        const userRole = req.user?.role;
        const content = req.body;
        if (!senderId || !roomId || !userRole) {
            return res.status(400).json({ error: 'User ID, room ID, and role are required' });
        }
        console.log('Uploading documents in chatrooms:', req.files);
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

        // Upload PDF/Image to Cloudinary
        const uploadedUrl = await new Promise<string>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder: 'chat_documents',
                    public_id: `${Date.now()}_${file.originalname}_${Math.random().toString(36).substring(2, 15)}`,
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result.secure_url);
                }
            );
            stream.end(file.buffer);
        });
        console.log('Document uploaded successfully:', uploadedUrl);

        // Save the uploaded file URL to the database in the chat room as a message
        await prisma.chatMessage.create({
            data: {
                chatRoomId: roomId,
                senderId: senderId,
                senderRole: userRole.toUpperCase() as any,
                content: "",
                attachmentType: resourceType,
                attachmentUrl: uploadedUrl,
            },
        });
        res.status(200).json({ message: 'File uploaded and message created successfully', url: uploadedUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};

// React on message reactOnMessage
export const reactOnMessage = async (req: AuthenticatedRequest, res: Response) => {
    const { messageId } = req.params;
    const { reaction } = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
        return res.status(400).json({ error: 'User ID and role are required' });
    }

    if (!reaction) {
        return res.status(400).json({ error: 'Emoji is required' });
    }

    try {
        // Check if the message exists
        const message = await prisma.chatMessage.findUnique({
            where: { id: messageId },
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Create a new reaction
        const reactionResponse = await prisma.messageReaction.create({
            data: {
                messageId: message.id,
                reactorId: userId,
                reactorRole: userRole.toUpperCase() as any,
                emoji: reaction,
            },
        });

        return res.status(200).json({ message: 'Reaction added successfully', reactionResponse });
    } catch (error) {
        console.error('Error reacting to message:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
