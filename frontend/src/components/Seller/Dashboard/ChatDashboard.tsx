"use client";
import React, { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, Search, User, CheckCircle, Circle, RefreshCw, AlertTriangle, MoreVertical, Paperclip, Smile, Shield } from "lucide-react";
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
    edited?: boolean;
}

const ChatDashboard: React.FC = () => {
    // State management
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
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

            // Mark admin messages as read when viewing
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

    // Format message time
    const formatMessageTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format RFQ ID for display
    const formatRfqId = (rfqId: string) => {
        return rfqId.length > 12 ? `${rfqId.slice(0, 8)}...${rfqId.slice(-4)}` : rfqId;
    };

    return (
        <div className="h-[calc(100vh-2rem)] max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Support Chat</h1>
                <p className="text-gray-600 mt-1">
                    Connect with admin support for your RFQs
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
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                    <span>RFQ Chats</span>
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={fetchChatRooms}
                                    disabled={loadingRooms}
                                >
                                    <RefreshCw className={`w-4 h-4 ${loadingRooms ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search RFQ ID..."
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
                                    <p className="text-sm">No chat rooms found</p>
                                    <p className="text-xs mt-1">Submit an RFQ to start chatting</p>
                                </div>
                            ) : (
                                <div className="space-y-2 p-3">
                                    {filteredRooms.map((room) => {
                                        const unreadCount = getUnreadCount(room.id);
                                        const isSelected = selectedRoom?.id === room.id;

                                        return (
                                            <button
                                                key={room.id}
                                                onClick={() => handleRoomSelect(room)}
                                                className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${isSelected
                                                    ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                                                    : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                                            <Shield className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm text-gray-900 truncate">
                                                                Admin Support
                                                            </p>
                                                            <p className="text-xs text-gray-600 font-mono">
                                                                {formatRfqId(room.rfqId)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {unreadCount > 0 && (
                                                        <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                                                            {unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Updated {new Date(room.updatedAt).toLocaleDateString()}
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
                                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                                <Shield className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    Admin Support Chat
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    RFQ: <span className="font-mono font-medium">{selectedRoom.rfqId}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-green-100 text-green-700 border border-green-200">
                                                Online
                                            </Badge>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                {/* Messages Area */}
                                <CardContent className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                    {loadingMessages ? (
                                        <div className="flex items-center justify-center h-32">
                                            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex items-center justify-center h-32 text-gray-500">
                                            <div className="text-center">
                                                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                <h4 className="font-semibold mb-2">No messages yet</h4>
                                                <p className="text-sm">Start the conversation with admin support!</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {messages.map((message) => {
                                                const isFromSeller = message.senderRole === 'SELLER';

                                                return (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${isFromSeller ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-md ${isFromSeller ? 'order-2' : 'order-1'}`}>
                                                            <div className="flex items-center mb-2 space-x-2">
                                                                {!isFromSeller && (
                                                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                                        <Shield className="w-3 h-3 text-blue-600" />
                                                                    </div>
                                                                )}
                                                                <Badge
                                                                    className={isFromSeller
                                                                        ? "bg-green-100 text-green-700 border-green-200"
                                                                        : "bg-blue-100 text-blue-700 border-blue-200"
                                                                    }
                                                                >
                                                                    {isFromSeller ? "You" : "Admin"}
                                                                </Badge>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatMessageTime(message.sentAt)}
                                                                </span>
                                                                {message.edited && (
                                                                    <span className="text-xs text-gray-400">(edited)</span>
                                                                )}
                                                            </div>
                                                            <div
                                                                className={`px-4 py-3 rounded-2xl shadow-sm ${isFromSeller
                                                                    ? 'bg-blue-600 text-white rounded-br-md'
                                                                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                                                                    }`}
                                                            >
                                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                            </div>
                                                            {isFromSeller && (
                                                                <div className="flex justify-end mt-1">
                                                                    {message.read ? (
                                                                        <CheckCircle className="w-3 h-3 text-blue-500" />
                                                                    ) : (
                                                                        <Circle className="w-3 h-3 text-gray-400" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </CardContent>

                                {/* Message Input */}
                                <div className="border-t bg-white p-4">
                                    <div className="flex items-end space-x-3">
                                        <Button variant="ghost" size="sm" className="mb-2">
                                            <Paperclip className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="mb-2">
                                            <Smile className="w-4 h-4" />
                                        </Button>
                                        <div className="flex-1">
                                            <Textarea
                                                placeholder="Type your message to admin..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                rows={1}
                                                className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <Button
                                            onClick={sendMessage}
                                            disabled={!newMessage.trim() || sending}
                                            className="h-10 bg-blue-600 hover:bg-blue-700"
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
                            <div className="flex-1 flex items-center justify-center bg-gray-50">
                                <div className="text-center text-gray-500 max-w-md">
                                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageSquare className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Welcome to Support Chat</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Select an RFQ chat room from the sidebar to start communicating with our admin support team.
                                        Get help with your requests, clarifications, and any questions you may have.
                                    </p>
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