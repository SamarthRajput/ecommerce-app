"use client"
import { Button } from "@/components/ui/button"
import { FileText, RefreshCw, Plus, MessageSquare } from 'lucide-react'

interface RFQsListProps {
    adminChatState: any
    onRoomSelect: (room: any) => void
}

export const RFQsList = ({ adminChatState, onRoomSelect }: RFQsListProps) => {
    const {
        filteredRfqs,
        loadingRfqs,
        creating,
        createChatRoom,
        sellerChatExists,
        getSellerChatRoom,
        formatRfqId,
    } = adminChatState

    if (loadingRfqs) {
        return (
            <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        )
    }

    if (filteredRfqs.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8 px-4">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">No forwarded RFQs found</p>
                <p className="text-xs text-gray-400 mt-1">RFQs will appear here when forwarded by buyers</p>
            </div>
        )
    }

    return (
        <div className="p-3 space-y-3">
            {filteredRfqs.map((rfq: any) => {
                const chatExists = sellerChatExists(rfq.id)
                const chatRoom = getSellerChatRoom(rfq.id)

                return (
                    <div
                        key={rfq.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="space-y-3">
                            {/* RFQ Header */}
                            <div>
                                <h4 className="font-semibold text-sm text-gray-900 truncate mb-1">
                                    {rfq.product.name}
                                </h4>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="truncate">
                                        {rfq.buyer.firstName} {rfq.buyer.lastName}
                                    </span>
                                    <span className="font-mono">{formatRfqId(rfq.id)}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {chatExists ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-8"
                                    onClick={() => {
                                        if (chatRoom) {
                                            onRoomSelect(chatRoom)
                                        }
                                    }}
                                >
                                    <MessageSquare className="w-3 h-3 mr-2" />
                                    Open Chat
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    className="w-full h-8 bg-blue-600 hover:bg-blue-700"
                                    onClick={() => createChatRoom(rfq.id)}
                                    disabled={creating === rfq.id}
                                >
                                    {creating === rfq.id ? (
                                        <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                                    ) : (
                                        <Plus className="w-3 h-3 mr-2" />
                                    )}
                                    Start Chat
                                </Button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
