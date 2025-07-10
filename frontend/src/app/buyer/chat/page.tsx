"use client";
import React, { useState } from "react";
import { MessageSquare, Search, RefreshCw, AlertTriangle, MoreVertical, Shield, X, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ChatView from "@/src/components/Chat/ChatView";
import { useChat } from "@/src/hooks/useChat";

const ChatDashboard: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    chatRooms,
    error,
    loadingRooms,
    selectedRoom,
    messages,
    searchTerm,
    filteredRooms,
    setSearchTerm,
    setError,
    fetchChatRooms,
    sendMessage,
    uploadFile,
    editMessage,
    deleteMessage,
    pinMessage,
    reactToMessage,
    handleRoomSelect,
    getUnreadCount,
    formatRfqId,
  } = useChat();

  // Handle room selection with mobile sidebar toggle
  const handleRoomSelectMobile = (room: any) => {
    handleRoomSelect(room);
    setShowSidebar(false);
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
          <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-base lg:text-lg">
            Chat with {selectedRoom.title}
          </h3>
          <p className="text-xs lg:text-sm text-gray-600">
            RFQ: <span className="font-mono font-medium">{formatRfqId(selectedRoom.rfqId)}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Badge className="bg-green-100 text-green-700 border border-green-200 text-xs">
          Online
        </Badge>
        <Button variant="ghost" size="sm" className="p-1">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  ) : null;

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
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Chat with {selectedRoom?.title.slice(0, 50) || "Admin Support"}</h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Connect with admin support for your RFQs
              </p>
            </div>
          </div>

          {/* Show current room info on mobile */}
          {selectedRoom && (
            <div className="lg:hidden">
              <Badge className="bg-green-100 text-green-700 border border-green-200 text-xs">
                Online
              </Badge>
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>RFQ Chats</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchChatRooms}
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
                  <p className="text-xs mt-1">You can chat when RFQ will be submitted by Buyer.</p>
                </div>
              ) : (
                <div className="space-y-2 p-3">
                  {filteredRooms.map((room) => {
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
                              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate">
                                {/* {room.title.slice(0, 25) + "..."} */}
                                {room.title.length > 25 ? room.title.slice(0, 25) + "..." : room.title}
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
                placeholder="Type your message to admin..."
              />
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
                <div className="text-center text-gray-500 max-w-md">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                    <MessageSquare className="w-8 h-8 lg:w-12 lg:h-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold mb-3 text-gray-900">Welcome to Support Chat</h3>
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                    Select an RFQ chat room from the sidebar to start communicating with our admin support team.
                    Get help with your requests, clarifications, and any questions you may have.
                  </p>
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