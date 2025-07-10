import { useState, useEffect, useRef, useCallback } from "react";

// Types
interface ChatRoom {
    id: string;
    rfqId: string;
    type: "BUYER" | "SELLER";
    buyerId?: string;
    sellerId?: string;
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface RFQ {
    id: string;
    product: {
        id: string;
        name: string;
    };
    buyer: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    status: "PENDING" | "COMPLETED" | "FORWARDED";
    createdAt: Date;
    updatedAt: Date;
}

export const useAdminChat = () => {
    // State management
    const [activeTab, setActiveTab] = useState<"buyer" | "seller" | "rfqs">("rfqs");
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingRfqs, setLoadingRfqs] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [creating, setCreating] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchRFQs = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/rfq/forwarded`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch RFQs");
            }

            const data = await response.json();

            // Handle different response formats
            let rfqArr: any[] = [];
            if (Array.isArray(data)) {
                rfqArr = data;
            } else if (Array.isArray(data.rfqs)) {
                rfqArr = data.rfqs;
            } else if (Array.isArray(data.data)) {
                rfqArr = data.data;
            }
            setRfqs(rfqArr);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoadingRfqs(false);
        }
    }, [BASE_URL]);

    const createChatRoom = useCallback(async (rfqId: string) => {
        setCreating(rfqId);
        try {
            const response = await fetch(`${BASE_URL}/chat/chatroom`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rfqId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create chat room");
            }

            const data = await response.json();
            setChatRooms((prev) => [...prev, data]);

            // Switch to seller tab and select the new room
            setActiveTab("seller");
            setSelectedRoom(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setCreating(null);
        }
    }, [BASE_URL]);

    const refreshData = useCallback(() => {
        setLoadingRooms(true);
        setLoadingRfqs(true);
        fetchRFQs();
    }, [fetchRFQs]);

    // Effects
    useEffect(() => {
        fetchRFQs();
    }, [fetchRFQs]);

    // Filter functions with debouncing
    const filteredRooms = chatRooms.filter(room => {
        const matchesTab = room.type === activeTab.toUpperCase();
        const matchesSearch = searchTerm === '' ||
            room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.rfqId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const filteredRfqs = rfqs.filter(rfq => {
        return searchTerm === '' ||
            rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rfq.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rfq.buyer.email.toLowerCase().includes(searchTerm.toLowerCase());
    });



    const getRoleColor = useCallback((role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'BUYER': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'SELLER': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    }, []);

    const sellerChatExists = useCallback((rfqId: string) => {
        return chatRooms.some(room => room.rfqId === rfqId && room.type === "SELLER");
    }, [chatRooms]);

    const getSellerChatRoom = useCallback((rfqId: string) => {
        return chatRooms.find(room => room.rfqId === rfqId && room.type === "SELLER");
    }, [chatRooms]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // State
        activeTab,
        setActiveTab,
        chatRooms,
        rfqs,
        error,
        loadingRooms,
        loadingRfqs,
        selectedRoom,
        searchTerm,
        setSearchTerm,
        creating,
        messagesEndRef,

        createChatRoom,
        refreshData,
        clearError,

        // Computed values
        filteredRooms,
        filteredRfqs,

        // Helper functions
        getRoleColor,
        sellerChatExists,
        getSellerChatRoom,
    };
};