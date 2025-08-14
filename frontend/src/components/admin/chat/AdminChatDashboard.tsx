"use client"
import { useState } from "react"
import { useAdminChat } from "@/hooks/admin/useAdminChat"
import { useChat } from "@/hooks/useChat"
import { MobileHeader } from "./components/MobileHeader"
import { ChatSidebar } from "./components/ChatSidebar"
import { ChatArea } from "./components/ChatArea"

const AdminChatDashboard = () => {
    const [showSidebar, setShowSidebar] = useState(false)

    const chatState = useChat()
    const adminChatState = useAdminChat()

    const handleRoomSelectMobile = (room: any) => {
        chatState.handleRoomSelect(room)
        setShowSidebar(false)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <MobileHeader
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                selectedRoom={chatState.selectedRoom}
                refreshData={adminChatState.refreshData}
                loadingRooms={adminChatState.loadingRooms}
                loadingRfqs={adminChatState.loadingRfqs}
            />

            <div className="flex-1 flex overflow-hidden">
                <ChatSidebar
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                    chatState={chatState}
                    adminChatState={adminChatState}
                    onRoomSelect={handleRoomSelectMobile}
                />

                <ChatArea chatState={chatState} adminChatState={adminChatState} setShowSidebar={setShowSidebar} />
            </div>

            <div className="h-20 flex-shrink-0 bg-gray-50" />
        </div>
    )
}

export default AdminChatDashboard
