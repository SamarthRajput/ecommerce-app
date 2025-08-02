"use client"

import { useAuth } from "@/src/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export interface Listing {
    id: string
    slug: string
    name: string
    description: string
    price: number
    currency?: string
    quantity: number
    minimumOrderQuantity?: number
    listingType: "SELL" | "LEASE" | "RENT"
    condition: string
    validityPeriod: number
    expiryDate?: string
    deliveryTimeInDays?: number
    logisticsSupport?: "SELF" | "INTERLINK" | "BOTH"
    industry: string
    category: string
    productCode: string
    model: string
    specifications: string
    countryOfSource: string
    hsnCode: string
    certifications: string[]
    licenses: string[]
    warrantyPeriod?: string
    brochureUrl?: string
    videoUrl?: string
    images: string[]
    tags: string[]
    keywords: string[]
    status: "PENDING" | "ACTIVE" | "REJECTED" | "APPROVED"
    seller: {
        id: string
        email: string
        firstName: string
        lastName: string
        businessName: string
    }
    rfqs: Array<{
        id: string
        buyer: {
            id: string
            email: string
            firstName: string
            lastName: string
        }
        quantity: number
        message?: string
        status: string
        createdAt: string
    }>
    _count: {
        rfqs: number
    }
    createdAt: string
    updatedAt: string
}

export interface Stats {
    pending: number
    active: number
    rejected: number
    total: number
}

export interface ListingState {
    listings: Listing[]
    loading: boolean
    selectedListing: Listing | null
    showViewModal: boolean
    showRejectModal: boolean
    showApproveModal: boolean
    showRFQsModal: boolean
    rejectionReason: string
    processingAction: string | null
    searchTerm: string
    activeTab: string
    filterStatus: string
    stats: Stats
    setSelectedListing: (listing: Listing | null) => void
    setShowViewModal: (show: boolean) => void
    setShowRejectModal: (show: boolean) => void
    setShowApproveModal: (show: boolean) => void
    setShowRFQsModal: (show: boolean) => void
    setRejectionReason: (reason: string) => void
    approveListing: (listingId: string) => Promise<void>
    rejectListing: (listingId: string) => Promise<void>
    handleViewListing: (listing: Listing) => void
    handleRejectClick: (listing: Listing) => void
    refreshData: () => Promise<void>
    setSearchTerm: (term: string) => void
    setActiveTab: (tab: string) => void
    setFilterStatus: (status: string) => void
    getFilteredListings: (listings: Listing[]) => Listing[]
}

export const useListing = (): ListingState => {
    const [listings, setListings] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRFQsModal, setShowRFQsModal] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")
    const [processingAction, setProcessingAction] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [stats, setStats] = useState<Stats>({ pending: 0, active: 0, rejected: 0, total: 0 })

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
            const response = await fetch(`${API_BASE_URL}${url}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                ...options,
            })

            if (!response.ok) {
                try {
                    const errorData = await response.json()
                    console.error(`API Error: ${errorData.error || errorData.message}`)
                    throw new Error(errorData.error || errorData.message || "API call failed")
                } catch (error: any) {
                    console.error(`API Error: ${error.message || error}`)
                    throw error
                }
            }

            return await response.json()
        } catch (error) {
            console.error(`API call failed for ${url}:`, error)
            throw error
        }
    }

    const fetchListings = useCallback(async (): Promise<void> => {
        try {
            const [data, statsData] = await Promise.all([apiCall("/listing/all?page=1&limit=100"), apiCall("/listing/stats")])

            if (data.success && statsData.success) {
                setListings(data.data)
                setStats(statsData.data)
            } else {
                throw new Error(data.error || data.message || "Failed to fetch listings")
            }
        } catch (error: any) {
            console.error("Error fetching listings:", error)
            toast.error(error.message || "Failed to fetch listings")
        }
    }, [])

    const approveListing = async (listingId: string): Promise<void> => {
        setProcessingAction(listingId)
        try {
            const data = await apiCall(`/listing/approve/${listingId}`, {
                method: "POST",
            })

            if (data.success) {
                setListings((prev) =>
                    prev.map((listing) => (listing.id === listingId ? { ...listing, status: "ACTIVE" as const } : listing)),
                )
                setStats((prev) => ({
                    ...prev,
                    pending: prev.pending - 1,
                    active: prev.active + 1,
                }))
                toast.success("Listing approved successfully!")
                setSelectedListing(null)
                setShowViewModal(false)
            } else {
                throw new Error(data.error || "Failed to approve listing")
            }
        } catch (error) {
            console.error("Error approving listing:", error)
            toast.error("Failed to approve listing")
        } finally {
            setProcessingAction(null)
        }
    }

    const rejectListing = async (listingId: string): Promise<void> => {
        if (!rejectionReason.trim()) {
            toast.warning("Please provide a rejection reason.")
            return
        }

        setProcessingAction(listingId)
        try {
            const data = await apiCall(`/listing/reject/${listingId}`, {
                method: "POST",
                body: JSON.stringify({ reason: rejectionReason }),
            })

            if (data.success) {
                setListings((prev) =>
                    prev.map((listing) => (listing.id === listingId ? { ...listing, status: "REJECTED" as const } : listing)),
                )
                setStats((prev) => ({
                    ...prev,
                    pending: prev.pending - 1,
                    rejected: prev.rejected + 1,
                }))
                toast.success("Listing rejected successfully.")
                setRejectionReason("")
                setShowRejectModal(false)
                setSelectedListing(null)
            } else {
                throw new Error(data.error || data.message || "Failed to reject listing")
            }
        } catch (error: any) {
            console.error("Error rejecting listing:", error)
            toast.error(error.message || "Failed to reject listing")
        } finally {
            setProcessingAction(null)
        }
    }

    const handleViewListing = (listing: Listing): void => {
        setSelectedListing(listing)
        setShowViewModal(true)
    }

    const handleRejectClick = (listing: Listing): void => {
        setSelectedListing(listing)
        setShowRejectModal(true)
    }

    const refreshData = async (): Promise<void> => {
        setLoading(true)
        try {
            await fetchListings()
        } finally {
            setLoading(false)
        }
    }

    const getFilteredListings = (listings: Listing[]): Listing[] => {
        if (!searchTerm) return listings

        const searchLower = searchTerm.toLowerCase()
        return listings.filter(
            (listing) =>
                listing.name.toLowerCase().includes(searchLower) ||
                listing.seller.businessName?.toLowerCase().includes(searchLower) ||
                listing.seller.email.toLowerCase().includes(searchLower) ||
                listing.description.toLowerCase().includes(searchLower) ||
                listing.productCode.toLowerCase().includes(searchLower),
        )
    }

    useEffect(() => {
        const initializeData = async () => {
            if (!isAuthenticated) return
            setLoading(true)
            try {
                await fetchListings()
            } finally {
                setLoading(false)
            }
        }

        initializeData()
    }, [isAuthenticated, fetchListings])

    useEffect(() => {
        setStats((prev) => ({
            ...prev,
            total: prev.active + prev.rejected + prev.pending,
        }))
    }, [stats.active, stats.rejected, stats.pending])

    return {
        listings,
        loading,
        selectedListing,
        showViewModal,
        showRejectModal,
        showApproveModal,
        showRFQsModal,
        rejectionReason,
        processingAction,
        searchTerm,
        activeTab,
        filterStatus,
        stats,
        setSelectedListing,
        setShowViewModal,
        setShowRejectModal,
        setShowApproveModal,
        setShowRFQsModal,
        setRejectionReason,
        approveListing,
        rejectListing,
        handleViewListing,
        handleRejectClick,
        refreshData,
        setSearchTerm,
        setActiveTab,
        setFilterStatus,
        getFilteredListings,
    }
}
