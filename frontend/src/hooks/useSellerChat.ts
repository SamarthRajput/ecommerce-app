import { useState, useEffect, useRef } from 'react';

// Types
interface ChatRoom {
    id: string;
    rfqId: string;
    type: "SELLER";
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ChatMessage {
    id: string;
    chatRoomId: string;
    senderId: string;
    senderRole: "SELLER" | "ADMIN";
    content: string;
    sentAt: Date;
    read: boolean;
    deleted: boolean;
    isPinned: boolean;
    attachmentUrl?: string;
    attachmentType?: "image" | "raw"; // 'raw' for non-image files
    edited?: boolean;
}

export const useSellerChat = () => {
    // State management
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // API Functions
    const fetchChatRooms = async () => {
        setLoadingRooms(true);
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
                setError(data.error || "Failed to fetch chat rooms");
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoadingRooms(false);
        }
    };

    const fetchChatMessages = async (chatRoomId: string) => {
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

            // Mark admin messages as read when viewing
            await markMessagesAsRead(chatRoomId);
        } catch (err) {
            setError((err as Error).message);
            setMessages([]);
        }
    };

    const sendMessage = async () => {
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
                    senderRole: "SELLER",
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
    };

    const uploadFile = async (file: File) => {
        if (!selectedRoom || sending) return;

        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf'
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed");
            return;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setError("File size must be less than 10MB");
            return;
        }

        setSending(true);
        try {
            const formData = new FormData();
            formData.append("chatRoomId", selectedRoom.id);
            formData.append("file", file);
            formData.append("senderRole", "SELLER");

            const response = await fetch(`${BASE_URL}/chat/chatroom/${selectedRoom.id}/upload`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send file");
            }

            await fetchChatMessages(selectedRoom.id);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSending(false);
        }
    };

    const markMessagesAsRead = async (chatRoomId: string) => {
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
                .filter(msg => msg.senderRole === "ADMIN" && !msg.read)
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
    };

    // Effects
    useEffect(() => {
        fetchChatRooms();
    }, []);

    // Handle room selection
    const handleRoomSelect = (room: ChatRoom) => {
        setSelectedRoom(room);
        fetchChatMessages(room.id);
        setError(null);
    };

    // Handle message send on Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Filter chat rooms based on search
    const filteredRooms = chatRooms.filter(room => {
        return searchTerm === '' ||
            room.rfqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.id.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Get unread message count for a room (admin messages only)
    const getUnreadCount = (roomId: string) => {
        return messages.filter(
            (msg) => msg.chatRoomId === roomId && !msg.read && msg.senderRole === "ADMIN"
        ).length;
    };

    // Utility functions
    const formatMessageTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatRfqId = (rfqId: string) => {
        return rfqId.length > 12 ? `${rfqId.slice(0, 8)}...${rfqId.slice(-4)}` : rfqId;
    };

    const isImageFile = (fileName: string) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const extension = fileName.split('.').pop()?.toLowerCase();
        return imageExtensions.includes(extension || '');
    };

    const isPdfFile = (fileName: string) => {
        return fileName.toLowerCase().endsWith('.pdf');
    };

    const isImageAttachment = (message: ChatMessage) => {
        return message.attachmentType === 'image' && message.attachmentUrl;
    };

    const isPdfAttachment = (message: ChatMessage) => {
        return message.attachmentType === 'raw' && message.attachmentUrl;
    };

    const getFileName = (url: string) => {
        try {
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            // Remove cloudinary transformations and get clean filename
            return fileName.split('_').slice(-1)[0] || 'document';
        } catch {
            return 'document';
        }
    };

    return {
        // State
        chatRooms,
        error,
        loadingRooms,
        selectedRoom,
        messages,
        newMessage,
        searchTerm,
        sending,
        messagesEndRef,
        filteredRooms,

        // Actions
        setNewMessage,
        setSearchTerm,
        setError,
        fetchChatRooms,
        fetchChatMessages,
        sendMessage,
        uploadFile,
        handleRoomSelect,
        handleKeyPress,

        // Utilities
        getUnreadCount,
        formatMessageTime,
        formatRfqId,
        isImageFile,
        isPdfFile,

        isImageAttachment,
        isPdfAttachment,
        getFileName,
    };
};