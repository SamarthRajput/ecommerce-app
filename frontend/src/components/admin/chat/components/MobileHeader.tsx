"use client"
import { Button } from "@/components/ui/button"
import { Menu, RefreshCw } from 'lucide-react'

interface MobileHeaderProps {
    showSidebar: boolean
    setShowSidebar: (show: boolean) => void
    selectedRoom: any
    refreshData: () => void
    loadingRooms: boolean
    loadingRfqs: boolean
    formatRfqId: (id: string) => string
}

export const MobileHeader = ({
    showSidebar,
    setShowSidebar,
    selectedRoom,
    refreshData,
    loadingRooms,
    loadingRfqs,
    formatRfqId,
}: MobileHeaderProps) => {
    return (
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
                <RefreshCw className={`w-4 h-4 ${loadingRooms || loadingRfqs ? "animate-spin" : ""}`} />
            </Button>
        </div>
    )
}
