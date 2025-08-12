import { prisma } from "../lib/prisma";

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

  // Step 3 — Create the chat room
  const chatRoom = await prisma.chatRoom.create({
    data: {
      productId,
      sellerId,
      adminId: admin.id,
      type: "SELLER",
      status: "ACTIVE"
    }
  });

  // Step 4 — Send initial message from admin
  await prisma.chatMessage.create({
    data: {
      chatRoomId: chatRoom.id,
      senderRole: "ADMIN",
      senderId: admin.id,
      content: "Your product has been listed successfully. Let us know if you have any questions.",
      sentAt: new Date(),
      read: false
    }
  });

  return chatRoom;
}
