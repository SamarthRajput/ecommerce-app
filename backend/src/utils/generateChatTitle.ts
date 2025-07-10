function generateChatTitle(chatRoom: any, currentUserRole: string): string {
    const productName = chatRoom.rfq.product?.name || "RFQ Chat Room";
    const buyerName = chatRoom.buyer?.name?.trim();
    const sellerName = chatRoom.seller?.name?.trim();

    // Admin sees buyer or seller
    if (currentUserRole === 'admin') {
        if (buyerName) return `${buyerName} • ${productName.trim().slice(0, 50)}`;
        if (sellerName) return `${sellerName} • ${productName.trim().slice(0, 50)}`;
        return productName.trim().slice(0, 50);
    }

    // Seller chatting with admin or buyer
    if (currentUserRole === 'seller') {
        if (buyerName) return `${buyerName} • ${productName.trim().slice(0, 50)}`;
        return productName.trim().slice(0, 50);
    }

    // Buyer chatting with admin or seller
    if (currentUserRole === 'buyer') {
        if (sellerName) return `${sellerName} • ${productName.trim().slice(0, 50)}`;
        return productName.trim().slice(0, 50);
    }

    return productName.trim().slice(0, 50);
}

export default generateChatTitle;