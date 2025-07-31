// Types
export interface Buyer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    joinedDate: string;
}

interface RFQ {
    id: string;
    productName: string;
    sellerName: string;
    quantity: number;
    targetPrice: number;
    message: string;
    status: 'pending' | 'responded' | 'accepted' | 'rejected';
    createdAt: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
}

interface Order {
    id: string;
    productName: string;
    sellerName: string;
    quantity: number;
    price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    orderDate: string;
    expectedDelivery: string;
    trackingNumber?: string;
}

interface DashboardStats {
    totalRFQs: number;
    pendingRFQs: number;
    activeOrders: number;
    completedOrders: number;
    totalSpend: number;
    monthlySpend: number;
    favoriteCategories: string[];
    recentActivity: number;
}

interface SavedListing {
    id: string;
    productName: string;
    price: number;
    sellerName: string;
    rating: number;
    savedDate: string;
}
