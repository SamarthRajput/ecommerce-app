"use client";
import React, { useEffect, useState, useRef } from "react";
import {
    MessageSquare,
    Send,
    Search,
    User,
    Clock,
    CheckCircle,
    Circle,
    RefreshCw,
    AlertTriangle,
    Phone,
    Video,
    MoreVertical,
    Paperclip,
    Smile,
    X,
    Users,
    Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    status: "PENDING" | "COMPLETED";
    createdAt: Date;
    updatedAt: Date;
}

const ChatDashboard: React.FC = () => {
    // State management
    const [activeTab, setActiveTab] = useState<"buyer" | "seller">("seller");
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingRfqs, setLoadingRfqs] = useState(false);
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
            const response = await fetch(`${BASE_URL}/chat/chatrooms/seller`, {
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

    const fetchRFQs = async () => {
        setLoadingRfqs(true);
        try {
            const response = await fetch(`${BASE_URL}/rfq/seller/pending`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch RFQs");
            }

            const data = await response.json();
            setRfqs(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoadingRfqs(false);
        }
    };

    const fetchChatMessages = async (chatRoomId: string) => {
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

            // Mark messages as read when viewing
            await markMessagesAsRead(chatRoomId);
        } catch (err) {
            setError((err as Error).message);
            setMessages([]);
        } finally {
            setLoadingMessages(false);
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
                .filter(msg => msg.senderRole !== "SELLER" && !msg.read) // Only mark messages from other then seller as read
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
        fetchRFQs();
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

    // Filter chat rooms based on search and active tab
    const filteredRooms = chatRooms.filter(room => {
        const matchesTab = room.type === activeTab.toUpperCase();
        const matchesSearch = searchTerm === '' ||
            room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.rfqId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Get unread message count for a room
    const getUnreadCount = (roomId: string) => {
        // This would need to be implemented based on your API
        return 0;
    };

    // Format message time
    const formatMessageTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get user role color
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-100 text-purple-700';
            case 'BUYER': return 'bg-blue-100 text-blue-700';
            case 'SELLER': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Chat Center</h1>
                <p className="text-gray-600 mt-1">
                    Communicate with buyers and sellers
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
                {/* Chat List Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <MessageSquare className="w-5 h-5" />
                                    <span>Conversations</span>
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        fetchChatRooms();
                                        fetchRFQs();
                                    }}
                                    disabled={loadingRooms}
                                >
                                    <RefreshCw className={`w-4 h-4 ${loadingRooms ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>

                            {/* Tab Navigation */}
                            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">

                                <button
                                    onClick={() => setActiveTab("seller")}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "seller"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <Package className="w-4 h-4 inline mr-1" />
                                    Sellers
                                </button>
                                <button
                                    onClick={() => setActiveTab("buyer")}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "buyer"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Buyers
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search conversations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-y-auto p-0">
                            {loadingRooms ? (
                                <div className="flex items-center justify-center h-32">
                                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : filteredRooms.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">No conversations found</p>
                                </div>
                            ) : (
                                <div className="space-y-1 p-3">
                                    {filteredRooms.map((room) => {
                                        const unreadCount = getUnreadCount(room.id);
                                        const isSelected = selectedRoom?.id === room.id;

                                        return (
                                            <button
                                                key={room.id}
                                                onClick={() => handleRoomSelect(room)}
                                                className={`w-full p-3 rounded-lg text-left transition-colors ${isSelected
                                                    ? 'bg-blue-100 border border-blue-200'
                                                    : 'hover:bg-gray-50 border border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <User className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-gray-900">
                                                                {room.type} Chat
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                RFQ: {room.rfqId.slice(-8)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {unreadCount > 0 && (
                                                        <Badge className="bg-red-500 text-white text-xs">
                                                            {unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(room.updatedAt).toLocaleDateString()}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-3">
                    <Card className="h-full flex flex-col">
                        {selectedRoom ? (
                            <>
                                {/* Chat Header */}
                                <CardHeader className="border-b">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {selectedRoom.type} Conversation
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    RFQ ID: {selectedRoom.rfqId}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm">
                                                <Phone className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Video className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                {/* Messages Area */}
                                <CardContent className="flex-1 overflow-y-auto p-4">
                                    {loadingMessages ? (
                                        <div className="flex items-center justify-center h-32">
                                            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex items-center justify-center h-32 text-gray-500">
                                            <div className="text-center">
                                                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                <p>No messages yet</p>
                                                <p className="text-sm">Start the conversation!</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((message) => {
                                                const isAdmin = message.senderRole === 'ADMIN';

                                                return (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-xs lg:max-w-md ${isAdmin ? 'order-2' : 'order-1'}`}>
                                                            <div
                                                                className={`px-4 py-2 rounded-lg ${isAdmin
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-gray-100 text-gray-900'
                                                                    }`}
                                                            >
                                                                <p className="text-sm">{message.content}</p>
                                                            </div>
                                                            <div className={`flex items-center mt-1 space-x-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                                <Badge className={getRoleColor(message.senderRole)}>
                                                                    {message.senderRole}
                                                                </Badge>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatMessageTime(message.sentAt)}
                                                                </span>
                                                                {isAdmin && (
                                                                    message.read ? (
                                                                        <CheckCircle className="w-3 h-3 text-blue-500" />
                                                                    ) : (
                                                                        <Circle className="w-3 h-3 text-gray-400" />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </CardContent>

                                {/* Message Input */}
                                <div className="border-t p-4">
                                    <div className="flex items-end space-x-2">
                                        <Button variant="ghost" size="sm">
                                            <Paperclip className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Smile className="w-4 h-4" />
                                        </Button>
                                        <div className="flex-1">
                                            <Textarea
                                                placeholder="Type your message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                rows={1}
                                                className="resize-none"
                                            />
                                        </div>
                                        <Button
                                            onClick={sendMessage}
                                            disabled={!newMessage.trim() || sending}
                                            className="h-10"
                                        >
                                            {sending ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* No Chat Selected */
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                                    <p>Choose a conversation from the sidebar to start chatting</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ChatDashboard;