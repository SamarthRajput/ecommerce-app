// routes/productChat.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/authSeller';

// Get all product chat rooms for the authenticated user (seller)
export const getProductChatRooms = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;

        if (userRole !== 'SELLER') {
            res.status(403).json({ error: 'Only sellers can view product chat rooms' });
            return;
        }

        const chatRooms = await prisma.chatRoom.findMany({
            where: {
                sellerId: userId,
                type: 'SELLER',
                productId: { not: null }
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                admin: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        const formattedChatRooms = chatRooms.map(chatRoom => ({
            id: chatRoom.id,
            title: chatRoom.product?.name || `Product ${chatRoom.productId}`,
            productId: chatRoom.productId,
            type: chatRoom.type,
            adminId: chatRoom.adminId,
            sellerId: chatRoom.sellerId,
            status: chatRoom.status,
            createdAt: chatRoom.createdAt,
            updatedAt: chatRoom.updatedAt,
            product: chatRoom.product,
            admin: chatRoom.admin
        }));

        res.status(200).json({
            success: true,
            chatRooms: formattedChatRooms
        });
        return;

    } catch (error) {
        console.error('Get product chat rooms error:', error);
        res.status(500).json({ error: 'Server error' });
        return;
    }
};

// Get seller's product chats (for seller dashboard)
export const getSellerProductChats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.user?.userId;

        if (!sellerId) {
            res.status(401).json({ error: 'Unauthorized' });
            return ;
        }

        const chatRooms = await prisma.chatRoom.findMany({
            where: {
                sellerId,
                productId: {
                    not: null
                },
                type: 'SELLER',
                status: 'ACTIVE'
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        images: true
                    }
                },
                admin: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                messages: {
                    where: {
                        deleted: false
                    },
                    orderBy: {
                        sentAt: 'desc'
                    },
                    take: 1,
                    select: {
                        content: true,
                        sentAt: true,
                        senderRole: true,
                        read: true
                    }
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                read: false,
                                senderRole: 'ADMIN',
                                deleted: false
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        const formattedChatRooms = chatRooms.map(room => ({
            id: room.id,
            title: room.product?.name || `Product ${room.productId}`,
            productId: room.productId,
            type: room.type,
            adminId: room.adminId,
            sellerId: room.sellerId,
            status: room.status,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
            product: room.product,
            admin: room.admin,
            lastMessage: room.messages[0] || null,
            unreadCount: room._count.messages
        }));

        res.status(200).json({
            success: true,
            chatRooms: formattedChatRooms
        });
        return;

    } catch (error) {
        console.error('Get seller product chats error:', error);
        res.status(500).json({ error: 'Server error' });
        return
    }
};

// Update the createSellerAdminChatOnProduct function to return more data
export async function createSellerAdminChatOnProduct(productId: string, sellerId: string) {
    // Step 1 — Find an admin (first in DB)
    const admin = await prisma.admin.findFirst();
    if (!admin) {
        throw new Error("No admin account found");
    }

    // Step 2 — Check if chat already exists for this product & seller
    const existingChat = await prisma.chatRoom.findFirst({
        where: {
            productId,
            sellerId,
            adminId: admin.id,
            type: "SELLER"
        }
    });

    if (existingChat) {
        return existingChat;
    }

    // Step 3 — Get product info for better chat room title
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { name: true }
    });

    // Step 4 — Create the chat room
    const chatRoom = await prisma.chatRoom.create({
        data: {
            productId,
            sellerId,
            adminId: admin.id,
            type: "SELLER",
            status: "ACTIVE"
        }
    });

    // Step 5 — Send initial message from admin
    await prisma.chatMessage.create({
        data: {
            chatRoomId: chatRoom.id,
            senderRole: "ADMIN",
            senderId: admin.id,
            content: `Hello! Your product "${product?.name || 'Unknown Product'}" has been listed successfully. Let us know if you have any questions about your listing or need any assistance.`,
            sentAt: new Date(),
            read: false
        }
    });

    return chatRoom;
};

// Get specific product chat room
export const getProductChatRoom = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.userId;
        const userRole = req.user?.role;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        let whereCondition: any = {
            productId,
            type: 'SELLER',
            status: 'ACTIVE'
        };

        // Add role-specific filters
        if (userRole === 'SELLER') {
            whereCondition.sellerId = userId;
        } else if (userRole === 'ADMIN') {
            whereCondition.adminId = userId;
        } else {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        const chatRoom = await prisma.chatRoom.findFirst({
            where: whereCondition,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                seller: {
                    select: {
                        id: true,
                        businessName: true
                    }
                },
                admin: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!chatRoom) {
            res.status(404).json({ error: 'Chat room not found' });
            return;
        }

        const formattedChatRoom = {
            id: chatRoom.id,
            title: chatRoom.product?.name || `Product ${chatRoom.productId}`,
            productId: chatRoom.productId,
            type: chatRoom.type,
            adminId: chatRoom.adminId,
            sellerId: chatRoom.sellerId,
            status: chatRoom.status,
            createdAt: chatRoom.createdAt,
            updatedAt: chatRoom.updatedAt,
            product: chatRoom.product,
            seller: chatRoom.seller,
            admin: chatRoom.admin
        };

        res.status(200).json({
            success: true,
            chatRoom: formattedChatRoom
        });
        return;

    } catch (error) {
        console.error('Get product chat room error:', error);
         res.status(500).json({ error: 'Server error' });
         return
    }
};

// Get chat rooms for a specific product (admin view)
export const getChatRoomsByProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.userId;
        const userRole = req.user?.role;

        if (!userId) {
             res.status(401).json({ error: 'Unauthorized' });
            return
        }

        if (userRole !== 'ADMIN') {
             res.status(403).json({ error: 'Admin access required' });
             return
        }

        const chatRooms = await prisma.chatRoom.findMany({
            where: {
                productId,
                type: 'SELLER',
                status: 'ACTIVE'
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                seller: {
                    select: {
                        id: true,
                        businessName: true
                    }
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                read: false,
                                senderRole: 'SELLER'
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        const formattedChatRooms = chatRooms.map(room => ({
            id: room.id,
            title: `${room.product?.name} - ${room.seller?.businessName}`,
            productId: room.productId,
            type: room.type,
            adminId: room.adminId,
            sellerId: room.sellerId,
            status: room.status,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
            product: room.product,
            seller: room.seller,
            unreadCount: room._count.messages
        }));

         res.status(200).json({
            success: true,
            chatRooms: formattedChatRooms
        });
        return

    } catch (error) {
        console.error('Get chat rooms by product error:', error);
         res.status(500).json({ error: 'Server error' });
         return
    }
};

// Create or get existing product chat room
export const createOrGetProductChatRoom = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        const userId = req.user?.userId;
        const userRole = req.user?.role;

        if (!userId) {
             res.status(401).json({ error: 'Unauthorized' });
             return
        }

        if (userRole !== 'SELLER') {
             res.status(403).json({ error: 'Only sellers can create product chat rooms' });
             return
        }

        // Check if product exists and belongs to the seller
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                sellerId: userId
            }
        });

        if (!product) {
             res.status(404).json({ error: 'Product not found or access denied' });
             return
        }

        // Check if chat room already exists
        let chatRoom = await prisma.chatRoom.findFirst({
            where: {
                productId,
                sellerId: userId,
                type: 'SELLER'
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                admin: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (chatRoom) {
            res.status(200).json({
                success: true,
                chatRoom: {
                    id: chatRoom.id,
                    title: chatRoom.product?.name || `Product ${chatRoom.productId}`,
                    productId: chatRoom.productId,
                    type: chatRoom.type,
                    adminId: chatRoom.adminId,
                    sellerId: chatRoom.sellerId,
                    status: chatRoom.status,
                    createdAt: chatRoom.createdAt,
                    updatedAt: chatRoom.updatedAt,
                    product: chatRoom.product,
                    admin: chatRoom.admin
                },
                message: 'Chat room already exists'
            });
            return;
        }

        // Create new chat room using the existing function
        const newChatRoom = await createSellerAdminChatOnProduct(productId, userId);

        // Fetch the complete chat room data
        const completeChatRoom = await prisma.chatRoom.findUnique({
            where: { id: newChatRoom.id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                admin: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            chatRoom: {
                id: completeChatRoom!.id,
                title: completeChatRoom!.product?.name || `Product ${completeChatRoom!.productId}`,
                productId: completeChatRoom!.productId,
                type: completeChatRoom!.type,
                adminId: completeChatRoom!.adminId,
                sellerId: completeChatRoom!.sellerId,
                status: completeChatRoom!.status,
                createdAt: completeChatRoom!.createdAt,
                updatedAt: completeChatRoom!.updatedAt,
                product: completeChatRoom!.product,
                admin: completeChatRoom!.admin
            },
            message: 'Chat room created successfully'
        });
        return;

    } catch (error) {
        console.error('Create or get product chat room error:', error);
         res.status(500).json({ error: 'Server error' });
         return
    }
};