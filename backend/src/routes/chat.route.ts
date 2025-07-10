import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { requireAdmin } from "../middlewares/authAdmin";
import { requireAuth } from "../middlewares/requireAuth";
import { uploadSingleFile } from "../middlewares/multer";
import { createChatRoomBetweenAdminAndSeller, sendChatMessage, getChatMessages, getUserChatRooms, markMessagesAsRead, editChatMessage, deleteChatMessage, pinChatMessage, unpinChatMessage, uploadMediaToChatRoom, reactOnMessage } from "../controllers/chatMessageController";

const chatRouter = Router();

// Base address: https://localhost:3001/api/v1/chat

// ==========================
// Admin-only routes
// ==========================
chatRouter.post("/chatroom", requireAdmin, asyncHandler(createChatRoomBetweenAdminAndSeller));

// ==========================
// Common routes for Admin, Seller, Buyer
// ==========================

// Chat room management
chatRouter.get("/chatrooms", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), asyncHandler(getUserChatRooms));

// Message operations
chatRouter.post("/chatroom/message", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), asyncHandler(sendChatMessage));
chatRouter.get("/chatroom/:id/messages", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), asyncHandler(getChatMessages));
chatRouter.post("/chatroom/:id/mark-read", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), asyncHandler(markMessagesAsRead));

// Message modifications
chatRouter.put("/message/:messageId/edit", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), asyncHandler(editChatMessage));
chatRouter.delete("/message/:messageId/delete", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), asyncHandler(deleteChatMessage));

// Pin/Unpin messages
chatRouter.patch("/message/:messageId/pin", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), asyncHandler(pinChatMessage));
chatRouter.patch("/message/:messageId/unpin", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), asyncHandler(unpinChatMessage));
chatRouter.post("/message/:messageId/react", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), asyncHandler(reactOnMessage));

// Upload media/documents
chatRouter.post("/chatroom/:roomId/upload", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), uploadSingleFile, asyncHandler(uploadMediaToChatRoom));

export default chatRouter;
