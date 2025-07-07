"use client";
import React from "react";
import {
  MessageSquare,
  Send,
  Search,
  User,
  Users,
  Package,
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
  Plus,
  Clock,
  ShoppingCart,
  FileText,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminChat } from './useAdminChat'; // Import the hook

const AdminChatDashboard: React.FC = () => {
  const {
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
  } = useAdminChat();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Chat Center</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage communications with buyers and sellers
              </p>
            </div>

            {/* Quick Stats - Hidden on mobile */}
            <div className="hidden lg:flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{rfqs.length}</div>
                <div className="text-xs text-gray-500">RFQs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {chatRooms.filter(r => r.type === "BUYER").length}
                </div>
                <div className="text-xs text-gray-500">Buyers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {chatRooms.filter(r => r.type === "SELLER").length}
                </div>
                <div className="text-xs text-gray-500">Sellers</div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={clearError}>
                  <X className="w-4 h-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 h-full">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span className="hidden sm:inline">Admin Panel</span>
                      <span className="sm:hidden">Panel</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshData}
                      disabled={loadingRooms || loadingRfqs}
                    >
                      <RefreshCw className={`w-4 h-4 ${(loadingRooms || loadingRfqs) ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>

                  {/* Tab Navigation */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveTab("rfqs")}
                      className={`w-full flex items-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "rfqs"
                        ? "bg-purple-100 text-purple-900 border border-purple-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Forwarded RFQs</span>
                      <span className="sm:hidden">RFQs</span>
                      <Badge className="ml-auto bg-purple-500 text-white text-xs">
                        {rfqs.length}
                      </Badge>
                    </button>
                    <button
                      onClick={() => setActiveTab("buyer")}
                      className={`w-full flex items-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "buyer"
                        ? "bg-blue-100 text-blue-900 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="hidden sm:inline">Buyer Chats</span>
                      <span className="sm:hidden">Buyers</span>
                      <Badge className="ml-auto bg-blue-500 text-white text-xs">
                        {chatRooms.filter(r => r.type === "BUYER").length}
                      </Badge>
                    </button>
                    <button
                      onClick={() => setActiveTab("seller")}
                      className={`w-full flex items-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "seller"
                        ? "bg-green-100 text-green-900 border border-green-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                    >
                      <Package className="w-4 h-4" />
                      <span className="hidden sm:inline">Seller Chats</span>
                      <span className="sm:hidden">Sellers</span>
                      <Badge className="ml-auto bg-green-500 text-white text-xs">
                        {chatRooms.filter(r => r.type === "SELLER").length}
                      </Badge>
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={activeTab === "rfqs" ? "Search RFQs..." : "Search chats..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-0">
                  {/* RFQs Tab */}
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
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-gray-900 truncate">
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
                                    className="w-full text-green-600 border-green-200 hover:bg-green-50"
                                    onClick={() => chatRoom && handleRoomSelect(chatRoom)}
                                  >
                                    <MessageSquare className="w-3 h-3 mr-1" />
                                    Open Chat
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="w-full"
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

                  {/* Chat Rooms Tab */}
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
                        </div>
                      ) : (
                        <div className="space-y-2">
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
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${room.type === 'BUYER' ? 'bg-blue-100' : 'bg-green-100'}`}>
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
                    <CardHeader className="border-b flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedRoom.type === 'BUYER' ? 'bg-blue-100' : 'bg-green-100'}`}>
                            {selectedRoom.type === 'BUYER' ? (
                              <ShoppingCart className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Package className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {selectedRoom.type} Conversation
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              RFQ: <span className="font-mono">{formatRfqId(selectedRoom.rfqId)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-700 border border-green-200 hidden sm:inline-flex">
                            Active
                          </Badge>
                          <div className="hidden sm:flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Video className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Messages Area */}
                    <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 min-h-0">
                      {/* Messages List */}
                      {loadingMessages ? (
                        <div className="flex items-center justify-center h-32">
                          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-500">
                          <div className="text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h4 className="font-semibold mb-2">No messages yet</h4>
                            <p className="text-sm">Start the conversation!</p>
                          </div>
                        </div>
                      ) : (
                            <div className="space-y-4 sm:space-y-6 h-42 overflow-y-auto">
                          {messages.map((message) => {
                            const isFromAdmin = message.senderRole === 'ADMIN';

                            return (
                              <div
                                key={message.id}
                                className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-xs sm:max-w-md ${isFromAdmin ? 'order-2' : 'order-1'}`}>
                                  <div className="flex items-center mb-2 space-x-2">
                                    {!isFromAdmin && (
                                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${message.senderRole === 'BUYER' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                        {message.senderRole === 'BUYER' ? (
                                          <ShoppingCart className="w-3 h-3 sm:w-3 sm:h-3 text-blue-600" />
                                        ) : (
                                          <Package className="w-3 h-3 sm:w-3 sm:h-3 text-green-600" />
                                        )}
                                      </div>
                                    )}
                                    <Badge className={`${getRoleColor(message.senderRole)} text-xs`}>
                                      {message.senderRole === 'ADMIN' ? 'You' : message.senderRole}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatMessageTime(message.sentAt)}
                                    </span>
                                  </div>
                                  <div
                                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm ${isFromAdmin
                                      ? 'bg-purple-600 text-white rounded-br-md'
                                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                                      }`}
                                  >
                                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                                  </div>
                                  {isFromAdmin && (
                                    <div className="flex justify-end mt-1">
                                      {message.read ? (
                                        <CheckCircle className="w-3 h-3 text-purple-500" />
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
                    <div className="border-t bg-white p-3 sm:p-4 flex-shrink-0">
                      <div className="flex items-end space-x-2 sm:space-x-3">
                        <div className="hidden sm:flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="mb-2">
                            <Paperclip className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="mb-2">
                            <Smile className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <Textarea
                            placeholder={`Send message to ${selectedRoom.type.toLowerCase()}...`}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            rows={1}
                            className="resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || sending}
                          className="h-10 bg-purple-600 hover:bg-purple-700 flex-shrink-0"
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
                  <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center text-gray-500 max-w-md">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">Admin Chat Center</h3>
                      <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                        Manage communications with buyers and sellers efficiently.
                      </p>
                      <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>Create seller chats from forwarded RFQs</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Manage existing buyer and seller conversations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Statistics Footer - Only visible on mobile */}
      <div className="lg:hidden flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-purple-600">{rfqs.length}</div>
            <div className="text-xs text-gray-500">RFQs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {chatRooms.filter(r => r.type === "BUYER").length}
            </div>
            <div className="text-xs text-gray-500">Buyers</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {chatRooms.filter(r => r.type === "SELLER").length}
            </div>
            <div className="text-xs text-gray-500">Sellers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatDashboard;