"use client"
import { Button } from "@/components/ui/button"
import { Shield, Menu, RefreshCw, ArrowLeft, ShoppingCart, Package, Phone, Video, MoreVertical } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import ChatView from "../../../Chat/ChatView"
import { formatRfqId } from "@/lib/formatRFQ"

interface ChatAreaProps {
    chatState: any
    adminChatState: any
    setShowSidebar: (show: boolean) => void
}

export const ChatArea = ({ chatState, adminChatState, setShowSidebar }: ChatAreaProps) => {
    const { selectedRoom, messages, sendMessage, uploadFile, editMessage, deleteMessage, pinMessage, reactToMessage } = chatState
    const { refreshData, loadingRooms, loadingRfqs, chatRooms, rfqs } = adminChatState

    const chatHeaderContent = selectedRoom ? (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-1"
                    onClick={() => setShowSidebar(true)}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${selectedRoom.type === "BUYER" ? "bg-blue-100" : "bg-emerald-100"
                        }`}
                >
                    {selectedRoom.type === "BUYER" ? (
                        <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                    ) : (
                        <Package className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate text-sm lg:text-base">
                        {selectedRoom.title || `${selectedRoom.type} Chat`}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 truncate">
                        {selectedRoom.rfqId ? "RFQ:" : "ProductId:"}
                        <span className="font-mono">{formatRfqId(selectedRoom.rfqId ?? selectedRoom.productId ?? "")}</span>
                    </p>
                </div>
            </div>
            {/* <div className="flex items-center space-x-1 lg:space-x-2">
                <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 hidden sm:inline-flex text-xs">
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
            </div> */}
        </div>
    ) : null

    return (
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

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{rfqs.length}</div>
                                <div className="text-xs text-gray-500">RFQs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {chatRooms.filter((r: { type: string }) => r.type === "BUYER").length}
                                </div>
                                <div className="text-xs text-gray-500">Buyers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-600">
                                    {chatRooms.filter((r: { type: string }) => r.type === "SELLER").length}
                                </div>
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
                                <RefreshCw className={`w-4 h-4 mr-2 ${loadingRooms || loadingRfqs ? "animate-spin" : ""}`} />
                                Refresh Data
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
