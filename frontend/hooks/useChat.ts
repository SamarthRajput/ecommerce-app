import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../src/context/AuthContext';

// Types
interface ChatRoom {
    id: string;
    title: string;
    rfqId: string;
    type: Role;
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
}
export type Role = "SELLER" | "BUYER" | "ADMIN";

export type MessageStatus = 'sending' | 'sent' | 'read';

export interface ChatReaction {
    reactorId: string;
    reactorRole: Role;
    emoji: string;
    reactedAt: string; // ISO date
}

export interface ReplyToMessage {
    id: string;
    content: string | null;
    senderId: string;
    senderRole: Role;
    deleted: boolean;
}

export interface ChatMessage {
    id: string;
    chatRoomId: string;
    content: string | null;
    senderId: string;
    senderRole: Role;
    sentAt: string; // ISO date
    status: MessageStatus;
    read: boolean;
    edited: boolean;
    deleted: boolean;
    isPinned: boolean;
    isStarred: boolean;
    attachmentType: 'raw' | 'image';
    attachmentUrl: string;
    replyTo: ReplyToMessage | null;
    reactions: ChatReaction[];
}
export interface ChatMessagesResponse {
    success: boolean;
    chatRoomId: string;
    messages: ChatMessage[];
    pagination: {
        skip: number;
        take: number;
        count: number;
        hasMore: boolean;
    };
}
export const useChat = () => {
    // State management
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sending, setSending] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState("");
    const { authLoading, role, user } = useAuth();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!authLoading) {
            setCurrentUserRole(role || "");
        }
    }, [authLoading, role]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // API Functions
    const fetchChatRooms = async () => {
        setLoadingRooms(true);
        try {
            const response = await fetch(`${BASE_URL}/chat/chatrooms?page=1&limit=100`, {
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
                if (data.chatRooms.length === 0) {
                    toast.info("No chat rooms found");
                } else {
                    setChatRooms(data.chatRooms || []);
                }
                toast.success("Chat rooms fetched successfully");
            } else {
                setError(data.error || "Failed to fetch chat rooms");
            }
        } catch (err) {
            toast.error((err as Error).message || "An error occurred while fetching chat rooms");
            setError((err as Error).message);
        } finally {
            setLoadingRooms(false);
        }
    };

    const fetchChatMessages = async (chatRoomId: string) => {
        try {
            const response = await fetch(
                `${BASE_URL}/chat/chatroom/${chatRoomId}/messages?page=1&limit=100`,
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

            const data: ChatMessagesResponse = await response.json();
            setMessages(data.messages || []);
            setError(null);
            setSelectedRoom((prev) => {
                if (prev?.id === chatRoomId) {
                    return { ...prev, updatedAt: new Date() }; // Update timestamp if same room
                }
                return prev;
            });
            setLoadingRooms(false);
            toast.success("Chat messages fetched successfully");

            // Mark admin messages as read when viewing
            await markMessagesAsRead(chatRoomId);
        } catch (err) {
            toast.error((err as Error).message || "An error occurred while fetching chat messages");
            setError((err as Error).message);
            setMessages([]);
        }
    };

    const sendMessage = async (content: string = newMessage, replyToId?: string) => {
        if (!content.trim() || !selectedRoom || sending) return;
        // Add the new message to the local state
        setMessages(prevMessages => [
            ...prevMessages,
            {
                id: Date.now().toString(),
                chatRoomId: selectedRoom.id,
                content: content.trim(),
                senderId: user?.id || "",
                senderRole: currentUserRole.toUpperCase() as "SELLER" | "ADMIN" | "BUYER",
                sentAt: new Date().toISOString(),
                status: 'sending',
                read: false,
                edited: false,
                deleted: false,
                isPinned: false,
                isStarred: false,
                attachmentType: 'raw',
                attachmentUrl: '',
                replyTo: null,
                reactions: [],
            } as ChatMessage,
        ]);
        setSending(true);
        try {
            const response = await fetch(`${BASE_URL}/chat/chatroom/message`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatRoomId: selectedRoom.id,
                    content: content.trim(),
                    senderRole: currentUserRole,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            setNewMessage("");
            setError(null);

            toast.success("Message sent successfully");
            await fetchChatMessages(selectedRoom.id);
        } catch (err) {
            toast.error((err as Error).message || "An error occurred while sending the message");
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
            formData.append("senderRole", currentUserRole);

            const response = await fetch(`${BASE_URL}/chat/chatroom/${selectedRoom.id}/upload`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send file");
            }
            setError(null);
            toast.success("File uploaded successfully");

            await fetchChatMessages(selectedRoom.id);
        } catch (err) {
            toast.error((err as Error).message);    
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
                .filter(msg => msg.senderRole !== currentUserRole && !msg.read)
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
            (msg) => msg.chatRoomId === roomId && !msg.read && msg.senderRole.toUpperCase() !== currentUserRole.toUpperCase() && !msg.deleted
        ).length;
    }

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
            return fileName.split('_').slice(-1)[0] || 'document';
        } catch {
            return 'document';
        }
    };

    const editMessage = async (messageId: string, content: string): Promise<void> => {
        // Save the original message content before editing
        let originalContent: string | undefined;
        if (!content.trim()) {
            toast.error("Message content cannot be empty");
            return;
        }

        setMessages((prevMessages: ChatMessage[]) =>
            prevMessages.map((msg: ChatMessage) => {
                if (msg.id === messageId) {
                    originalContent = msg.content ?? "";
                    return { ...msg, content: content, edited: true };
                }
                return msg;
            })
        );

        // API Call to edit the message
        const response = await fetch(`${BASE_URL}/chat/message/${messageId}/edit`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.error || "Failed to edit message");

            // Revert the changes using the original content
            setMessages((prevMessages: ChatMessage[]) =>
                prevMessages.map((msg: ChatMessage) =>
                    msg.id === messageId ? { ...msg, content: originalContent ?? "", edited: false } : msg
                )
            );
            return;
        } else {
            toast.success(`${messageId} is edited successfully`);
        }
    };

    const deleteMessage = async (messageId: string): Promise<void> => {
        // Optimistically remove the message from the state
        setMessages((prevMessages: ChatMessage[]) =>
            prevMessages.map((msg: ChatMessage) =>
                msg.id === messageId ? { ...msg, deleted: true } : msg
            )
        );

        // API Call to delete the message
        const response = await fetch(`${BASE_URL}/chat/message/${messageId}/delete`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.error || "Failed to delete message");
            // If deletion fails, re-fetch messages or restore the deleted message
            await fetchChatMessages(selectedRoom?.id || "");
            return;
        } else {
            toast.success("Message deleted successfully");
        }

    }
    const pinMessage = async (messageId: string, pin: boolean): Promise<void> => {
        setMessages((prevMessages: ChatMessage[]) =>
            prevMessages.map((msg: ChatMessage) =>
                msg.id === messageId ? { ...msg, isPinned: pin } : msg
            )
        );

        // API Call to pin the message
        const response = await fetch(`${BASE_URL}/chat/message/${messageId}/pin`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.error || `Failed to ${pin ? "Pin" : "Unpin"} the message`);
            // If pinning fails, re-fetch messages or restore the unpinned state
            await fetchChatMessages(selectedRoom?.id || "");
            return;
        } else {
            toast.success(data.message);
        }

    }
    const reactToMessage = async (messageId: string, reaction: string): Promise<void> => {
        // Optimistically update the message state
        setMessages((prevMessages: ChatMessage[]) =>
            prevMessages.map((msg: ChatMessage) =>
                msg.id === messageId
                    ? {
                        ...msg,
                        reactions: [
                            ...msg.reactions,
                            {
                                reactorId: user?.id || "",
                                reactorRole: currentUserRole.toUpperCase() as Role,
                                emoji: reaction,
                                reactedAt: new Date().toISOString(),
                            },
                        ],
                    }
                    : msg
            )
        );

        // API Call to add reaction
        const response = await fetch(`${BASE_URL}/chat/message/${messageId}/react`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reaction }),
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.error || "Failed to react to message");
            // If reaction fails, re-fetch messages or restore the previous state
            await fetchChatMessages(selectedRoom?.id || "");
            return;
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


        editMessage,
        deleteMessage,
        pinMessage,
        reactToMessage,

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