"use client"
import { Badge } from "@/components/ui/badge"
import { FileText, ShoppingCart, Package } from 'lucide-react'

interface TabNavigationProps {
    activeTab: string
    setActiveTab: (tab: string) => void
    chatRooms: any[]
    rfqs: any[]
}

export const TabNavigation = ({ activeTab, setActiveTab, chatRooms, rfqs }: TabNavigationProps) => {
    const tabs = [
        {
            id: "rfqs",
            label: "RFQs",
            icon: FileText,
            count: rfqs.length,
            color: "purple",
        },
        {
            id: "buyer",
            label: "Buyers",
            icon: ShoppingCart,
            count: chatRooms.filter((r) => r.type === "BUYER").length,
            color: "blue",
        },
        {
            id: "seller",
            label: "Sellers",
            icon: Package,
            count: chatRooms.filter((r) => r.type === "SELLER").length,
            color: "green",
        },
    ]

    return (
        <div className="grid grid-cols-3 gap-1 mb-4">
            {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center py-3 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                                ? `bg-${tab.color}-50 text-${tab.color}-900 border border-${tab.color}-200 shadow-sm`
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                    >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="truncate">{tab.label}</span>
                        <Badge
                            className={`mt-1 text-xs min-w-[20px] h-5 ${isActive
                                    ? `bg-${tab.color}-500 text-white`
                                    : "bg-gray-400 text-white"
                                }`}
                        >
                            {tab.count}
                        </Badge>
                    </button>
                )
            })}
        </div>
    )
}
