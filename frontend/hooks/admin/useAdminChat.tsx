"use client"
import { APIURL } from "@/src/config/env"
import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "sonner"

interface ChatRoom {
    id: string
    rfqId: string
    type: "BUYER" | "SELLER"
    buyerId?: string
    sellerId?: string
    adminId: string
    createdAt: Date
    updatedAt: Date
}

interface RFQ {
    id: string
    product: {
        id: string
        name: string
    }
    buyer: {
        id: string
        firstName: string
        lastName: string
        email: string
    }
    status: "PENDING" | "COMPLETED" | "FORWARDED"
    createdAt: Date
    updatedAt: Date
}

export const useAdminChat = () => {
    const [activeTab, setActiveTab] = useState<"buyer" | "seller" | "rfqs">("rfqs")
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
    const [rfqs, setRfqs] = useState<RFQ[]>([])
    const [totalRfqs, setTotalRfqs] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [loadingRooms, setLoadingRooms] = useState(true)
    const [loadingRfqs, setLoadingRfqs] = useState(true)
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [creating, setCreating] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const fetchRFQs = useCallback(async () => {
        try {
            const response = await fetch(`${APIURL}/rfq/forwarded`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to fetch RFQs")
            }

            const data = await response.json()
            let rfqArr: any[] = []
            if (Array.isArray(data)) {
                rfqArr = data
            } else if (data.data && Array.isArray(data.data)) {
                rfqArr = data.data
            } else if (Array.isArray(data.rfqs)) {
                rfqArr = data.rfqs
            } else {
                throw new Error("Unexpected response format")
            }
            toast.success("RFQs fetched successfully")
            setTotalRfqs(data.count || 0)
            setRfqs(rfqArr)
            setError(null)
        } catch (err) {
            toast.error((err as Error).message)
            setError((err as Error).message)
        } finally {
            setLoadingRfqs(false);
            setLoadingRooms(false);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [APIURL])

    const createChatRoom = useCallback(
        async (rfqId: string) => {
            setCreating(rfqId)
            try {
                const response = await fetch(`${APIURL}/chat/chatroom`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rfqId }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || "Failed to create chat room")
                }

                const data = await response.json()
                toast.success("Chat room created successfully")
                setError(null)
                fetchChatRooms()
                fetchRFQs()
                setActiveTab("seller")
                setSelectedRoom(data)
            } catch (err) {
                toast.error((err as Error).message)
                setError((err as Error).message)
            } finally {
                setCreating(null)
            }
        },
        [APIURL],
    )
    const fetchChatRooms = useCallback(async () => {
        try {
            const response = await fetch(`${APIURL}/chat/chatrooms`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to fetch chat rooms")
            }
            toast.success("Chat rooms fetched successfully")

            const data = await response.json()
            setChatRooms(data.chatRooms || [])
        } catch (err) {
            toast.error((err as Error).message)
        }
    }, [APIURL])

    const refreshData = useCallback(() => {
        setLoadingRooms(true)
        setLoadingRfqs(true)
        setError(null)
        fetchChatRooms()
        fetchRFQs()
    }, [fetchRFQs])

    useEffect(() => {
        fetchRFQs()
        fetchChatRooms()
    }, [fetchChatRooms, fetchRFQs])

    const filteredRooms = chatRooms.filter((room) => {
        const matchesTab = room.type === activeTab.toUpperCase()
        const matchesSearch =
            searchTerm === "" ||
            room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.rfqId.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesTab && matchesSearch
    })

    const filteredRfqs = rfqs.filter((rfq) => {
        return (
            searchTerm === "" ||
            rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rfq.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rfq.buyer.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    const getRoleColor = useCallback((role: string) => {
        switch (role) {
            case "ADMIN":
                return "bg-purple-100 text-purple-700 border-purple-200"
            case "BUYER":
                return "bg-blue-100 text-blue-700 border-blue-200"
            case "SELLER":
                return "bg-emerald-100 text-emerald-700 border-emerald-200"
            default:
                return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }, [])

    const sellerChatExists = useCallback(
        (rfqId: string) => {
            return chatRooms.some((room) => room.rfqId === rfqId && room.type === "SELLER")
        },
        [chatRooms],
    )

    const getSellerChatRoom = useCallback(
        (rfqId: string) => {
            return chatRooms.find((room) => room.rfqId === rfqId && room.type === "SELLER")
        },
        [chatRooms],
    )

    const formatRfqId = useCallback((id: string) => {
        return id.slice(0, 8).toUpperCase()
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        activeTab,
        setActiveTab,
        chatRooms,
        rfqs,
        error,
        loadingRooms,
        loadingRfqs,
        selectedRoom,
        searchTerm,
        setSearchTerm,
        creating,
        messagesEndRef,
        createChatRoom,
        refreshData,
        clearError,
        filteredRooms,
        filteredRfqs,
        getRoleColor,
        sellerChatExists,
        getSellerChatRoom,
        formatRfqId,
    }
}
