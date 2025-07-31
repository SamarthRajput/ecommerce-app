"use client";
import { useChat } from '@/hooks/useChat';
import React, { useState } from 'react';
import { useAdminChat } from './useAdminChat';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Plus, FileText, ShoppingCart, Package, Shield, RefreshCw, MessageSquare, Phone, Video, MoreVertical, Menu, X, ArrowLeft } from 'lucide-react';
import ChatView from '@/src/components/Chat/ChatView';

const AdminChat = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const {
        // State
        chatRooms,
        loadingRooms,
        selectedRoom,
        messages,
        searchTerm,
        filteredRooms,

        setSearchTerm,
        sendMessage,
        uploadFile,
        handleRoomSelect,
        editMessage,
        deleteMessage,
        pinMessage,
        reactToMessage,

        // Utilities
        getUnreadCount,
        formatRfqId,
    } = useChat();

    const {
        // State
        activeTab,
        setActiveTab,
        rfqs,
        loadingRfqs,
        creating,

        // Actions
        createChatRoom,
        refreshData,

        // Computed values
        filteredRfqs,

        sellerChatExists,
        getSellerChatRoom,
    } = useAdminChat();

    // Handle room selection for mobile
    const handleRoomSelectMobile = (room: any) => {
        handleRoomSelect(room);
        setShowSidebar(false);
    };

    // Enhanced chat header content
    const chatHeaderContent = selectedRoom ? (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                {/* Mobile back button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-1"
                    onClick={() => setShowSidebar(true)}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>

                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${selectedRoom.type === 'BUYER' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                    {selectedRoom.type === 'BUYER' ? (
                        <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                    ) : (
                        <Package className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate text-sm lg:text-base">
                        {selectedRoom.title || (selectedRoom.type === 'BUYER' ? 'Buyer Chat' : 'Seller Chat')}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 truncate">
                        RFQ: <span className="font-mono">{formatRfqId(selectedRoom.rfqId)}</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-1 lg:space-x-2">
                <Badge className="bg-green-100 text-green-700 border border-green-200 hidden sm:inline-flex text-xs">
                    Active
                </Badge>
                <div className="hidden md:flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Video className="w-4 h-4" />
                    </Button>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </div>
        </div>
    ) : null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Mobile Header - Sticky */}
            <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0 sticky top-0 z-40">
                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="p-2"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Admin Chat</h1>
                        {selectedRoom && (
                            <p className="text-xs text-gray-600">
                                {selectedRoom.type} - {formatRfqId(selectedRoom.rfqId)}
                            </p>
                        )}
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshData}
                    disabled={loadingRooms || loadingRfqs}
                    className="p-2"
                >
                    <RefreshCw className={`w-4 h-4 ${(loadingRooms || loadingRfqs) ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Main Content Container - Fixed height accounting for header/footer */}
            <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
                {/* Sidebar - Mobile Overlay / Desktop Fixed */}
                <div className={`${showSidebar
                    ? 'fixed inset-0 z-50 bg-black bg-opacity-50 lg:bg-transparent lg:relative lg:inset-auto'
                    : 'hidden'
                    } lg:block lg:w-80 xl:w-96 lg:flex-shrink-0`}>

                    <div className={`h-full flex flex-col bg-white ${showSidebar ? 'w-80 shadow-xl' : 'w-full border-r'
                        }`}>
                        {/* Sidebar Header - Fixed */}
                        <div className="flex-shrink-0 p-4 lg:p-6 border-b bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5 text-purple-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={refreshData}
                                        disabled={loadingRooms || loadingRfqs}
                                        className="h-8 w-8 p-0"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${(loadingRooms || loadingRfqs) ? 'animate-spin' : ''}`} />
                                    </Button>

                                    {/* Mobile close button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="lg:hidden h-8 w-8 p-0"
                                        onClick={() => setShowSidebar(false)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Tab Navigation - Compact Grid */}
                            <div className="grid grid-cols-3 gap-1 mb-4">
                                <button
                                    onClick={() => setActiveTab("rfqs")}
                                    className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-colors ${activeTab === "rfqs"
                                        ? "bg-purple-100 text-purple-900 border border-purple-200"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <FileText className="w-4 h-4 mb-1" />
                                    <span>RFQs</span>
                                    <Badge className="mt-1 bg-purple-500 text-white text-xs min-w-[20px] h-5">
                                        {rfqs.length}
                                    </Badge>
                                </button>

                                <button
                                    onClick={() => setActiveTab("buyer")}
                                    className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-colors ${activeTab === "buyer"
                                        ? "bg-blue-100 text-blue-900 border border-blue-200"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <ShoppingCart className="w-4 h-4 mb-1" />
                                    <span>Buyers</span>
                                    <Badge className="mt-1 bg-blue-500 text-white text-xs min-w-[20px] h-5">
                                        {chatRooms.filter(r => r.type === "BUYER").length}
                                    </Badge>
                                </button>

                                <button
                                    onClick={() => setActiveTab("seller")}
                                    className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-colors ${activeTab === "seller"
                                        ? "bg-green-100 text-green-900 border border-green-200"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    <Package className="w-4 h-4 mb-1" />
                                    <span>Sellers</span>
                                    <Badge className="mt-1 bg-green-500 text-white text-xs min-w-[20px] h-5">
                                        {chatRooms.filter(r => r.type === "SELLER").length}
                                    </Badge>
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder={activeTab === "rfqs" ? "Search RFQs..." : "Search chats..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-9"
                                />
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto">
                            {/* RFQs Tab Content */}
                            {activeTab === "rfqs" && (
                                <div className="p-3">
                                    {loadingRfqs ? (
                                        <div className="flex items-center justify-center h-32">
                                            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                                        </div>
                                    ) : filteredRfqs.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8">
                                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm">No forwarded RFQs found</p>
                                            <p className="text-xs text-gray-400 mt-1">RFQs will appear here when forwarded by buyers</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredRfqs.map((rfq) => {
                                                const chatExists = sellerChatExists(rfq.id);
                                                const chatRoom = getSellerChatRoom(rfq.id);

                                                return (
                                                    <div
                                                        key={rfq.id}
                                                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
                                                                    {rfq.product.name}
                                                                </h4>
                                                                <p className="text-xs text-gray-600 mb-1 truncate">
                                                                    {rfq.buyer.firstName} {rfq.buyer.lastName}
                                                                </p>
                                                                <p className="text-xs text-gray-500 font-mono">
                                                                    {formatRfqId(rfq.id)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {chatExists ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full text-green-600 border-green-200 hover:bg-green-50 h-8"
                                                                onClick={() => {
                                                                    if (chatRoom) {
                                                                        handleRoomSelectMobile(chatRoom);
                                                                    }
                                                                }}
                                                            >
                                                                <MessageSquare className="w-3 h-3 mr-1" />
                                                                Open Chat
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                className="w-full h-8"
                                                                onClick={() => createChatRoom(rfq.id)}
                                                                disabled={creating === rfq.id}
                                                            >
                                                                {creating === rfq.id ? (
                                                                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                                                ) : (
                                                                    <Plus className="w-3 h-3 mr-1" />
                                                                )}
                                                                Start Chat
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Chat Rooms Tab Content */}
                            {(activeTab === "buyer" || activeTab === "seller") && (
                                <div className="p-3">
                                    {loadingRooms ? (
                                        <div className="flex items-center justify-center h-32">
                                            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                                        </div>
                                    ) : filteredRooms.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8">
                                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm">No {activeTab} chats found</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Chats will appear here when {activeTab}s start conversations
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {filteredRooms.map((room) => {
                                                const unreadCount = getUnreadCount(room.id);
                                                const isSelected = selectedRoom?.id === room.id;

                                                return (
                                                    <button
                                                        key={room.id}
                                                        onClick={() => handleRoomSelectMobile(room)}
                                                        className={`w-full p-3 rounded-lg text-left transition-colors ${isSelected
                                                            ? 'bg-blue-100 border border-blue-200 shadow-sm'
                                                            : 'hover:bg-gray-50 border border-transparent'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center space-x-2">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${room.type === 'BUYER' ? 'bg-blue-100' : 'bg-green-100'
                                                                    }`}>
                                                                    {room.type === 'BUYER' ? (
                                                                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                                                                    ) : (
                                                                        <Package className="w-4 h-4 text-green-600" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-sm text-gray-900 truncate">
                                                                        {room.type} Chat
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 font-mono truncate">
                                                                        {formatRfqId(room.rfqId)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {unreadCount > 0 && (
                                                                <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                                                                    {unreadCount}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            Last updated: {new Date(room.updatedAt).toLocaleDateString()}
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Area - Fixed Height, No External Scrolling */}
                <div className="flex-1 flex flex-col max-h-[100vh-20px]">
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
                            placeholder="Type your message..."
                        />
                    ) : (
                        /* No Chat Selected - Welcome Screen */
                        <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
                            <div className="text-center text-gray-500 max-w-md">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-purple-600" />
                                </div>
                                <h3 className="text-lg lg:text-xl font-semibold mb-3 text-gray-900">
                                    Admin Chat Center
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm lg:text-base mb-6">
                                    Manage conversations with buyers and sellers. Select a chat room or create new ones from RFQs.
                                </p>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">{rfqs.length}</div>
                                        <div className="text-xs text-gray-500">RFQs</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{chatRooms.filter(r => r.type === "BUYER").length}</div>
                                        <div className="text-xs text-gray-500">Buyers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">{chatRooms.filter(r => r.type === "SELLER").length}</div>
                                        <div className="text-xs text-gray-500">Sellers</div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                    <Button
                                        variant="outline"
                                        className="lg:hidden"
                                        onClick={() => setShowSidebar(true)}
                                    >
                                        <Menu className="w-4 h-4 mr-2" />
                                        Open Panel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={refreshData}
                                        disabled={loadingRooms || loadingRfqs}
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-2 ${(loadingRooms || loadingRfqs) ? 'animate-spin' : ''}`} />
                                        Refresh Data
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Spacer - Allows page to scroll to reveal footer */}
            <div className="h-20 flex-shrink-0 bg-gray-50"></div>
        </div>
    );
};

export default AdminChat;