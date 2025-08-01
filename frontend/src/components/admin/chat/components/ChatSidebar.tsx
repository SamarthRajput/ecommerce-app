"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, RefreshCw, X, Search } from 'lucide-react'
import { TabNavigation } from "./TabNavigation"
import { RFQsList } from "./RFQsList"
import { ChatRoomsList } from "./ChatRoomsList"

interface ChatSidebarProps {
    showSidebar: boolean
    setShowSidebar: (show: boolean) => void
    chatState: any
    adminChatState: any
    onRoomSelect: (room: any) => void
}

export const ChatSidebar = ({
    showSidebar,
    setShowSidebar,
    chatState,
    adminChatState,
    onRoomSelect,
}: ChatSidebarProps) => {
    const {
        activeTab,
        setActiveTab,
        chatRooms,
        rfqs,
        searchTerm,
        setSearchTerm,
        refreshData,
        loadingRooms,
        loadingRfqs,
    } = adminChatState

    return (
        <div
            className={`${showSidebar
                    ? "fixed inset-0 z-50 bg-black bg-opacity-50 lg:bg-transparent lg:relative lg:inset-auto"
                    : "hidden"
                } lg:block lg:w-80 xl:w-96 lg:flex-shrink-0`}
        >
            <div className={`h-full flex flex-col bg-white ${showSidebar ? "w-80 shadow-xl" : "w-full border-r"}`}>
                {/* Sidebar Header */}
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
                                <RefreshCw className={`w-4 h-4 ${loadingRooms || loadingRfqs ? "animate-spin" : ""}`} />
                            </Button>
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

                    <TabNavigation
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        chatRooms={chatRooms}
                        rfqs={rfqs}
                    />

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

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === "rfqs" ? (
                        <RFQsList
                            adminChatState={adminChatState}
                            onRoomSelect={onRoomSelect}
                        />
                    ) : (
                        <ChatRoomsList
                            activeTab={activeTab}
                            chatState={chatState}
                            adminChatState={adminChatState}
                            onRoomSelect={onRoomSelect}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
