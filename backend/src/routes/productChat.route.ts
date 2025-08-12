// routes/productChatRoutes.ts
import express from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import { requireSeller } from '../middlewares/authSeller';
import { requireAdmin } from '../middlewares/authAdmin';
import { createOrGetProductChatRoom, getChatRoomsByProduct, getProductChatRoom, getProductChatRooms, getSellerProductChats } from '../controllers/productChat.controller';

const productChat = express.Router();

// Get all product chat rooms for the authenticated user
productChat.get('/product-chatrooms', requireAuth({ allowedRoles: ["seller", "admin"]}), getProductChatRooms);

// Get specific product chat room
productChat.get('/product/:productId/chatroom', requireAuth({ allowedRoles: ["seller", "admin"]}), getProductChatRoom);

// Get chat rooms for a specific product (admin view)
productChat.get('/product/:productId/chatrooms', requireAdmin, getChatRoomsByProduct);

// Create or get existing product chat room
productChat.post('/product/chatroom', requireSeller, createOrGetProductChatRoom);

// Get seller's product chats (for seller dashboard)
productChat.get('/seller/product-chats', requireAuth({ allowedRoles: ["seller", "admin"]}), getSellerProductChats);

export default productChat;

// Example usage in your main app.ts or server.ts:
/*
import productChatRoutes from './routes/productChatRoutes';
app.use('/api/chat', productChatRoutes);
*/