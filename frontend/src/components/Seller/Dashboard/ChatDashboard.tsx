"use client";
import React, { useState, useEffect } from "react";
import {
    MessageSquare,
    Search,
    RefreshCw,
    AlertTriangle,
    MoreVertical,
    Shield,
    X,
    ChevronLeft,
    Package,
    FileText,
    Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatView from "../../Chat/ChatView";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/src/context/AuthContext";
import { formatRfqId } from "@/lib/formatRFQ";

type ChatType = 'rfq' | 'product';

const ChatDashboard: React.FC = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState<ChatType>('rfq');
    const { role } = useAuth();

    const {
        // State
        chatRooms,
        productChatRooms,
        error,
        loadingRooms,
        selectedRoom,
        messages,
        searchTerm,
        filteredRooms,
        filteredProductRooms,

        // Actions
        setSearchTerm,
        setError,
        fetchChatRooms,
        fetchProductChatRooms,
        sendMessage,
        uploadFile,
        editMessage,
        deleteMessage,
        pinMessage,
        reactToMessage,
        handleRoomSelect,

        // Utilities
        getUnreadCount,
    } = useChat();

    // Load data based on active tab
    useEffect(() => {
        if (activeTab === 'rfq') {
            fetchChatRooms();
        } else if (activeTab === 'product') {
            fetchChatRooms();
        }
    }, [activeTab]);

    // Handle room selection with mobile sidebar toggle
    const handleRoomSelectMobile = (room: any) => {
        handleRoomSelect(room);
        setShowSidebar(false);
    };

    // Get current chat rooms based on active tab
    const getCurrentChatRooms = () => {
        return activeTab === 'rfq' ? filteredRooms : filteredProductRooms;
    };

    // Get unread count for current tab
    const getTotalUnreadCount = () => {
        const rooms = getCurrentChatRooms();
        return rooms.reduce((total, room) => total + getUnreadCount(room.id), 0);
    };

    // Chat header content
    const chatHeaderContent = selectedRoom ? (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-1"
                    onClick={() => setShowSidebar(true)}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    {activeTab === 'product' ? (
                        <Package className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                    ) : (
                        <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-base lg:text-lg">
                        {activeTab === 'product' ? `${selectedRoom.title}` : 'Admin Support Chat'}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600">
                        {activeTab === 'product' ? (
                            selectedRoom.productId ? (
                                <span>Product: <span className="font-mono font-medium">{selectedRoom.title}</span></span>
                            ) : (
                                <span>Product Chat</span>
                            )
                        ) : (
                            <span>{selectedRoom.rfqId ? "RFQ: " : "Product Id: "}<span className="font-mono font-medium">{formatRfqId(selectedRoom.rfqId ?? selectedRoom.productId ?? '')}</span></span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    ) : null;

    interface ChatRoom {

    }
    // Render chat room item
    const renderChatRoomItem = (room: any, isProduct: boolean = false) => {
        const unreadCount = getUnreadCount(room.id);
        const isSelected = selectedRoom?.id === room.id;

        return (
            <button
                key={room.id}
                onClick={() => handleRoomSelectMobile(room)}
                className={`w-full p-3 lg:p-4 rounded-lg text-left transition-all duration-200 ${isSelected
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            {isProduct ? (
                                <Package className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                            ) : (
                                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">
                                {isProduct ? 'Product Support' : 'Admin Support'}
                            </p>
                            <p className="text-xs text-gray-600 font-mono">
                                {isProduct ?
                                    (room.productId ? `Product: ${room.title}` : 'Product Chat') :
                                    formatRfqId(room.rfqId || '')
                                }
                            </p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                            {unreadCount}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Updated {new Date(room.updatedAt).toLocaleDateString()}
                    </p>
                    {isProduct && room.product?.status && (
                        <Badge
                            variant="outline"
                            className={`text-xs ${room.product.status === 'APPROVED' ? 'border-green-200 text-green-700' :
                                room.product.status === 'PENDING' ? 'border-yellow-200 text-yellow-700' :
                                    'border-red-200 text-red-700'
                                }`}
                        >
                            {room.product.status}
                        </Badge>
                    )}
                </div>
            </button>
        );
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 relative">
            {/* Header - Fixed */}
            <div className="bg-white border-b px-4 py-3 lg:px-6 lg:py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Mobile sidebar toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setShowSidebar(!showSidebar)}
                        >
                            <MessageSquare className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Support Chat</h1>
                            <p className="text-sm text-gray-600 hidden sm:block">
                                Connect with admin support for your products and RFQs
                            </p>
                        </div>
                    </div>

                    {/* Show current room info on mobile */}
                    {selectedRoom && (
                        <div className="lg:hidden flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-700 border border-green-200 text-xs">
                                Online
                            </Badge>
                            {activeTab === 'product' && (
                                <Package className="w-4 h-4 text-blue-600" />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Alert - Fixed below header */}
            {error && (
                <Alert className="mx-4 mt-2 border-red-200 bg-red-50 flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700 flex items-center justify-between">
                        <span className="text-sm">{error}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setError(null)}
                            className="h-6 w-6 p-0 ml-2"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Hidden on mobile unless toggled */}
                <div className={`${showSidebar ? 'fixed inset-0 z-50 bg-black bg-opacity-50 lg:bg-transparent lg:relative lg:inset-auto' : 'hidden'
                    } lg:block lg:w-80 lg:flex-shrink-0`}>
                    <Card className={`h-full flex flex-col ${showSidebar ? 'w-80 bg-white ml-0' : 'w-full'
                        } lg:rounded-none lg:border-l-0 lg:border-t-0 lg:border-b-0`}>
                        <CardHeader className="pb-4 flex-shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <CardTitle className="flex items-center space-x-2">
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                    <span>Support Chats</span>
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (activeTab === 'rfq') {
                                                fetchChatRooms();
                                            } else {
                                                fetchProductChatRooms();
                                            }
                                        }}
                                        disabled={loadingRooms}
                                    >
                                        <RefreshCw className={`w-4 h-4 ${loadingRooms ? 'animate-spin' : ''}`} />
                                    </Button>
                                    {/* Mobile close button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="lg:hidden"
                                        onClick={() => setShowSidebar(false)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Chat Type Tabs */}
                            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ChatType)} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="rfq" className="flex items-center space-x-2">
                                        <FileText className="w-4 h-4" />
                                        <span>RFQ Chats</span>
                                        {activeTab === 'rfq' && filteredRooms.length > 0 && (
                                            <Badge variant="secondary" className="ml-1 text-xs">
                                                {filteredRooms.length}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="product" className="flex items-center space-x-2">
                                        <Package className="w-4 h-4" />
                                        <span>Product Chats</span>
                                        {activeTab === 'product' && filteredProductRooms.length > 0 && (
                                            <Badge variant="secondary" className="ml-1 text-xs">
                                                {filteredProductRooms.length}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                </TabsList>

                                {/* Search */}
                                <div className="relative mt-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder={activeTab === 'rfq' ? "Search RFQ ID..." : "Search Product..."}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <TabsContent value="rfq" className="mt-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                            <span>RFQ Support Chats</span>
                                            <span>{filteredRooms.length} chats</span>
                                        </div>
                                    </div>

                                    {filteredRooms.map(room => renderChatRoomItem(room, false))}
                                </TabsContent>

                                <TabsContent value="product" className="mt-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                            <span>Product Support Chats</span>
                                            <span>{filteredProductRooms.length} chats</span>
                                        </div>
                                    </div>

                                    {productChatRooms.map(room => renderChatRoomItem(room, true))}
                                </TabsContent>
                            </Tabs>
                        </CardHeader>
                    </Card>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Card className="h-full flex flex-col rounded-none border-0">
                        {selectedRoom ? (
                            <ChatView
                                chatRoomId={selectedRoom.id}
                                messages={messages}
                                onSendMessage={sendMessage}
                                onUploadFile={uploadFile}
                                onEditMessage={editMessage}
                                onDeleteMessage={deleteMessage}
                                onPinMessage={pinMessage}
                                onReactToMessage={reactToMessage}
                                headerContent={chatHeaderContent}
                                placeholder={`Type your message to admin about ${activeTab === 'product' ? 'your product' : 'your RFQ'
                                    }...`}
                            />
                        ) : (
                            /* No Chat Selected */
                            <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
                                <div className="text-center text-gray-500 max-w-md">
                                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                                        {activeTab === 'product' ? (
                                            <Package className="w-8 h-8 lg:w-12 lg:h-12 text-blue-600" />
                                        ) : (
                                            <MessageSquare className="w-8 h-8 lg:w-12 lg:h-12 text-blue-600" />
                                        )}
                                    </div>
                                    <h3 className="text-lg lg:text-xl font-semibold mb-3 text-gray-900">
                                        Welcome to {activeTab === 'product' ? 'Product' : 'RFQ'} Support
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base mb-4">
                                        {activeTab === 'product' ? (
                                            'Select a product chat from the sidebar to get support for your listed products. Get help with approvals, modifications, and product-related questions.'
                                        ) : (
                                            'Select an RFQ chat room from the sidebar to start communicating with our admin support team. Get help with your requests, clarifications, and any questions you may have.'
                                        )}
                                    </p>

                                    {/* Quick Stats */}
                                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-4">
                                        <div className="flex items-center space-x-1">
                                            <FileText className="w-3 h-3" />
                                            <span>{filteredRooms.length} RFQ chats</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Package className="w-3 h-3" />
                                            <span>{filteredProductRooms.length} Product chats</span>
                                        </div>
                                        {getTotalUnreadCount() > 0 && (
                                            <div className="flex items-center space-x-1">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span>{getTotalUnreadCount()} unread</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="mt-4 lg:hidden"
                                        onClick={() => setShowSidebar(true)}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        View Chat Rooms
                                    </Button>
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