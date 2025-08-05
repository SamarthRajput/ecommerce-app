"use client"

import { APIURL } from "@/src/config/env"
import { useAuth } from "@/src/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"

// message: '{"deliveryDate":"2025-09-03","budget":0,"currency":"USD","paymentTerms":"30 days after delivery","specialRequirements":"","additionalNotes":""}'
interface Message {
    deliveryDate?: string
    budget?: number
    currency?: string
    paymentTerms?: string
    specialRequirements?: string
    additionalNotes?: string
}

export interface RFQ {
    id: string
    productId: string
    buyerId: string
    quantity: number
    productName: string
    price: number
    buyerEmail: string
    message?: Message
    status: "PENDING" | "APPROVED" | "REJECTED" | "FORWARDED"
    deliveryDate?: Date
    budget?: number
    currency?: string
    paymentTerms?: string
    specialRequirements?: string
    additionalNotes?: string
    forwardedToSellers?: string[]
    trade?: string
    chatRooms?: string[]
    updatedAt: Date
    rejectionReason?: string
    forwardedAt?: Date
    createdAt: Date
    reviewedAt?: Date
    product: {
        id: string
        name: string
        description: string
        price: number
        category?: string
    }
    buyer: {
        id: string
        email: string
        firstName?: string
        lastName?: string
        phoneNumber?: string
        city?: string
        state?: string
        country?: string
    }
    _count?: {
        messages?: number
    }
}

export interface RFQStats {
    pending: number
    approved: number
    rejected: number
    forwarded: number
    total: number
}

export interface RFQState {
    allRFQs: RFQ[]
    loading: boolean
    selectedRFQ: RFQ | null
    showViewModal: boolean
    showRejectModal: boolean
    showForwardModal: boolean
    rejectionReason: string
    processingAction: string | null
    searchTerm: string
    activeTab: string
    stats: RFQStats
    setSelectedRFQ: (rfq: RFQ | null) => void
    setShowViewModal: (show: boolean) => void
    setShowRejectModal: (show: boolean) => void
    setShowForwardModal: (show: boolean) => void
    setRejectionReason: (reason: string) => void
    forwardRFQ: (rfqId: string) => Promise<void>
    rejectRFQ: (rfqId: string) => Promise<void>
    handleViewRFQ: (rfq: RFQ) => void
    handleRejectClick: (rfq: RFQ) => void
    refreshData: () => Promise<void>
    setSearchTerm: (term: string) => void
    setActiveTab: (tab: string) => void
    getFilteredRFQs: (rfqs: RFQ[]) => RFQ[]
}

export const useRFQ = (): RFQState => {
    const [allRFQs, setallRFQs] = useState<RFQ[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showForwardModal, setShowForwardModal] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const [processingAction, setProcessingAction] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [stats, setStats] = useState<RFQStats>({ pending: 0, approved: 0, rejected: 0, forwarded: 0, total: 0 })

    const { authenticated, authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !authenticated) {
            router.push("/admin/signin")
        } else {
            setIsAuthenticated(authenticated)
        }
    }, [authenticated, router, authLoading])

    const apiCall = async (url: string, options: RequestInit = {}) => {
        try {
            const response = await fetch(`${APIURL}${url}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                ...options,
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error(`API call failed for ${url}:`, error)
            throw error
        }
    }

    const fetchRFQStats = useCallback(async (): Promise<void> => {
        try {
            const data = await apiCall("/rfq/stats")
            if (data.success) {
                setStats(data.data)
            } else {
                throw new Error(data.error || "Failed to fetch RFQ stats")
            }
        } catch (error) {
            console.error("Error fetching RFQ stats:", error)
            toast.error("Failed to fetch RFQ stats")
        }
    }, [])

    const fetchAllRFQs = useCallback(async (): Promise<void> => {
        try {
            const data = await apiCall("/rfq/all")
            if (data.success) {
                setallRFQs(data.data)
                toast.success(`Fetched ${data.data.length} RFQs successfully!`)
            } else {
                throw new Error(data.error || "Failed to fetch all RFQs")
            }
        } catch (error: any) {
            console.error("Error fetching all RFQs:", error)
            toast.error("Failed to fetch all RFQs")
        }
    }, [])

    const forwardRFQ = async (rfqId: string): Promise<void> => {
        setProcessingAction(rfqId)
        try {
            const data = await apiCall(`/rfq/forward/${rfqId}`, {
                method: "POST",
            })

            if (data.success) {
                setStats((prev) => ({
                    ...prev,
                    pending: prev.pending - 1,
                    forwarded: prev.forwarded + 1,
                }))
                /// remove the forwarded RFQ from the list
                setallRFQs((prev) => prev.filter((rfq) => rfq.id !== rfqId))
                // add the forwarded RFQ to the list
                setallRFQs((prev) => [...prev, data.data.rfq])
                toast.success("RFQ forwarded successfully!")
                setSelectedRFQ(null)
                setShowViewModal(false)
            } else {
                toast.error(data.error || data.message || "Failed to forward RFQ")
                throw new Error(data.error || data.message || "Failed to forward RFQ")
            }
        } catch (error) {
            console.error("Error forwarding RFQ:", error)
            toast.error("Failed to forward RFQ")
        } finally {
            setProcessingAction(null)
        }
    }

    const rejectRFQ = async (rfqId: string): Promise<void> => {
        if (!rejectionReason.trim()) {
            toast.warning("Please provide a rejection reason.")
            return
        }

        setProcessingAction(rfqId)
        try {
            const data = await apiCall(`/rfq/reject/${rfqId}`, {
                method: "POST",
                body: JSON.stringify({ reason: rejectionReason }),
            })

            if (data.success) {
                setStats((prev) => ({
                    ...prev,
                    pending: prev.pending - 1,
                    rejected: prev.rejected + 1,
                }))
                toast.success("RFQ rejected successfully.")
                setRejectionReason("")
                setShowRejectModal(false)
                setSelectedRFQ(null)
            } else {
                throw new Error(data.error || "Failed to reject RFQ")
            }
        } catch (error) {
            console.error("Error rejecting RFQ:", error)
            toast.error("Failed to reject RFQ")
        } finally {
            setProcessingAction(null)
        }
    }

    const handleViewRFQ = (rfq: RFQ): void => {
        setSelectedRFQ(rfq)
        setShowViewModal(true)
    }

    const handleRejectClick = (rfq: RFQ): void => {
        setSelectedRFQ(rfq)
        setShowRejectModal(true)
    }

    const refreshData = async (): Promise<void> => {
        setLoading(true)
        try {
            await Promise.all([fetchAllRFQs(), fetchRFQStats()])
            toast.success("RFQ data refreshed successfully.")
        } finally {
            setLoading(false)
        }
    }

    const getFilteredRFQs = (rfqs: RFQ[]): RFQ[] => {
        if (!searchTerm) return rfqs

        const searchLower = searchTerm.toLowerCase()
        return rfqs.filter(
            (rfq) =>
                rfq.product.name.toLowerCase().includes(searchLower) ||
                rfq.buyer.email.toLowerCase().includes(searchLower) ||
                (rfq.buyer.firstName && rfq.buyer.firstName.toLowerCase().includes(searchLower)) ||
                (rfq.buyer.lastName && rfq.buyer.lastName.toLowerCase().includes(searchLower))
        )
    }

    useEffect(() => {
        const initializeData = async () => {
            if (!isAuthenticated) return
            setLoading(true)
            try {
                await Promise.all([fetchAllRFQs(), fetchRFQStats()])
            } finally {
                setLoading(false)
            }
        }

        initializeData()
    }, [isAuthenticated, fetchAllRFQs, fetchRFQStats])

    useEffect(() => {
        fetchRFQStats();
    }, [stats.approved, stats.rejected, stats.pending, stats.forwarded])

    return {
        allRFQs,
        loading,
        selectedRFQ,
        showViewModal,
        showRejectModal,
        showForwardModal,
        rejectionReason,
        processingAction,
        searchTerm,
        activeTab,
        stats,
        setSelectedRFQ,
        setShowViewModal,
        setShowRejectModal,
        setShowForwardModal,
        setRejectionReason,
        forwardRFQ,
        rejectRFQ,
        handleViewRFQ,
        handleRejectClick,
        refreshData,
        setSearchTerm,
        setActiveTab,
        getFilteredRFQs,
    }
}
