import { Request, Response, Router } from "express";
import { requireAdmin } from "../middlewares/authAdmin";
import { AuthenticatedRequest } from "../middlewares/authBuyer";
import { requireAuth } from "../middlewares/requireAuth";
import { createChatRoomBetweenAdminAndSeller, deleteChatMessage, editChatMessage, getAdminChatRooms, getChatMessages, markMessagesAsRead, pinChatMessage, sendChatMessage, unpinChatMessage } from "../controllers/chatMessageController";

const chatRouter = Router();
// Base address: https://localhost:3001/api/v1/chat

// Create a new chat room between admin and seller
chatRouter.post("/chatroom", requireAdmin, async (req: Request, res: Response) => {
    await createChatRoomBetweenAdminAndSeller(req as AuthenticatedRequest, res);
});

// Send a message in a chat room
chatRouter.post("/chatroom/message", requireAuth({ allowedRoles: ["admin", "seller"] }), async (req: Request, res: Response) => {
    await sendChatMessage(req as AuthenticatedRequest, res);
});

// Get all message of a chat room
chatRouter.get("/chatroom/:id/messages", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), async (req: Request, res: Response) => {
    await getChatMessages(req as AuthenticatedRequest, res);
});

// Get all chat rooms of admin
chatRouter.get("/chatrooms/admin", requireAuth({ allowedRoles: ["admin"] }), async (req: Request, res: Response) => {
    await getAdminChatRooms(req as AuthenticatedRequest, res);
});

// Mark message as read
chatRouter.post("/chatroom/:id/mark-read", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), async (req: Request, res: Response) => {
    await markMessagesAsRead(req as AuthenticatedRequest, res);
});

// Edit a message in a chat room
chatRouter.put("/message/:messageId/edit", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), async (req: Request, res: Response) => {
    await editChatMessage(req as AuthenticatedRequest, res);
});

// Soft delete a message in a chat room
chatRouter.delete("/message/:messageId/delete", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), async (req: Request, res: Response) => {
    await deleteChatMessage(req as AuthenticatedRequest, res);
});

// pin a message in a chat room
chatRouter.patch("/message/:messageId/pin", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), async (req: Request, res: Response) => {
    await pinChatMessage(req as AuthenticatedRequest, res);
});

// unpin a message in a chat room
chatRouter.patch("/message/:messageId/unpin", requireAuth({ allowedRoles: ["admin", "seller", "buyer"] }), async (req: Request, res: Response) => {
    await unpinChatMessage(req as AuthenticatedRequest, res);
});

// Export the router
export default chatRouter;