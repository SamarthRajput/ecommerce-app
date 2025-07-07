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

interface ChatMessage {
    id: string;
    chatRoomId: string;
    senderId: string;
    senderRole: "ADMIN" | "BUYER" | "SELLER";
    content: string;
    sentAt: Date;
    read: boolean;
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
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingRfqs, setLoadingRfqs] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sending, setSending] = useState(false);
    const [creating, setCreating] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Auto-scroll to bottom of messages
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom]);

    // API Functions
    const fetchChatRooms = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/chat/chatrooms`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch chat rooms");
            }

            const data = await response.json();
            if (data.success) {
                setChatRooms(data.chatRooms || []);
            } else {
                throw new Error(data.error || "Failed to fetch chat rooms");
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoadingRooms(false);
        }
    }, [BASE_URL]);

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

    const fetchChatMessages = useCallback(async (chatRoomId: string) => {
        setLoadingMessages(true);
        try {
            const response = await fetch(
                `${BASE_URL}/chat/chatroom/${chatRoomId}/messages`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch chat messages");
            }

            const data: ChatMessage[] = await response.json();
            setMessages(data);

            // Mark non-admin messages as read
            await markMessagesAsRead(chatRoomId);
        } catch (err) {
            setError((err as Error).message);
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    }, [BASE_URL]);

    const sendMessage = useCallback(async () => {
        if (!newMessage.trim() || !selectedRoom || sending) return;

        setSending(true);
        try {
            const response = await fetch(`${BASE_URL}/chat/chatroom/message`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatRoomId: selectedRoom.id,
                    content: newMessage.trim(),
                    senderRole: "ADMIN",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            setNewMessage("");
            await fetchChatMessages(selectedRoom.id);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSending(false);
        }
    }, [newMessage, selectedRoom, sending, BASE_URL, fetchChatMessages]);

    const markMessagesAsRead = useCallback(async (chatRoomId: string) => {
        try {
            const response = await fetch(
                `${BASE_URL}/chat/chatroom/${chatRoomId}/messages`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const data: ChatMessage[] = await response.json();
            const unreadMessageIds = data
                .filter(msg => msg.senderRole !== "ADMIN" && !msg.read)
                .map(msg => msg.id);

            if (unreadMessageIds.length === 0) return;

            await fetch(`${BASE_URL}/chat/chatroom/${chatRoomId}/mark-read`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageIds: unreadMessageIds,
                    chatRoomId,
                }),
            });
        } catch (err) {
            console.error("Error marking messages as read:", err);
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
            fetchChatMessages(data.id);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setCreating(null);
        }
    }, [BASE_URL, fetchChatMessages]);

    const refreshData = useCallback(() => {
        setLoadingRooms(true);
        setLoadingRfqs(true);
        fetchChatRooms();
        fetchRFQs();
    }, [fetchChatRooms, fetchRFQs]);

    // Effects
    useEffect(() => {
        fetchChatRooms();
        fetchRFQs();
    }, [fetchChatRooms, fetchRFQs]);

    // Handle room selection
    const handleRoomSelect = useCallback((room: ChatRoom) => {
        setSelectedRoom(room);
        fetchChatMessages(room.id);
        setError(null);
    }, [fetchChatMessages]);

    // Handle message send on Enter
    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

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

    // Helper functions
    const getUnreadCount = useCallback((roomId: string) => {
        // This would need to be implemented based on your backend
        return 0;
    }, []);

    const formatMessageTime = useCallback((date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, []);

    const formatRfqId = useCallback((rfqId: string) => {
        return rfqId.length > 12 ? `${rfqId.slice(0, 8)}...${rfqId.slice(-4)}` : rfqId;
    }, []);

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
        loadingMessages,
        loadingRfqs,
        selectedRoom,
        messages,
        newMessage,
        setNewMessage,
        searchTerm,
        setSearchTerm,
        sending,
        creating,
        messagesEndRef,

        // Functions
        handleRoomSelect,
        handleKeyPress,
        sendMessage,
        createChatRoom,
        refreshData,
        clearError,

        // Computed values
        filteredRooms,
        filteredRfqs,

        // Helper functions
        getUnreadCount,
        formatMessageTime,
        formatRfqId,
        getRoleColor,
        sellerChatExists,
        getSellerChatRoom,
    };
};