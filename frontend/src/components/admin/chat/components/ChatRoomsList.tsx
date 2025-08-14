"use client"
import { Badge } from "@/components/ui/badge"
import { formatRfqId } from "@/lib/formatRFQ"
import { MessageSquare, ShoppingCart, Package, RefreshCw } from "lucide-react"

interface ChatRoomsListProps {
    activeTab: string
    chatState: any
    adminChatState: any
    onRoomSelect: (room: any) => void
}

export const ChatRoomsList = ({ activeTab, chatState, adminChatState, onRoomSelect }: ChatRoomsListProps) => {
    const { filteredRooms, loadingRooms } = adminChatState
    const { selectedRoom, getUnreadCount } = chatState

    if (loadingRooms) {
        return (
            <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        )
    }

    if (filteredRooms.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8 px-4">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">No {activeTab} chats found</p>
                <p className="text-xs text-gray-400 mt-1">Chats will appear here when {activeTab}s start conversations</p>
            </div>
        )
    }

    return (
        <div className="p-3 space-y-2">
            {filteredRooms.map((room: any) => {
                const unreadCount = getUnreadCount(room.id)
                const isSelected = selectedRoom?.id === room.id

                return (
                    <button
                        key={room.id}
                        onClick={() => onRoomSelect(room)}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${isSelected ? "bg-blue-50 border border-blue-200 shadow-sm" : "hover:bg-gray-50 border border-transparent"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${room.type === "BUYER" ? "bg-blue-100" : "bg-emerald-100"
                                        }`}
                                >
                                    {room.type === "BUYER" ? (
                                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                                    ) : (
                                        <Package className="w-4 h-4 text-emerald-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">{room.title}</p>
                                    <p className="text-xs text-gray-500 font-mono truncate">{formatRfqId(room.rfqId ?? room.productId ?? "")}</p>
                                </div>
                            </div>
                            {unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                                    {unreadCount}
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Last updated: {new Date(room.updatedAt).toLocaleDateString()}</p>
                    </button>
                )
            })}
        </div>
    )
}
