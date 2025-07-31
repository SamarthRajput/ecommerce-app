"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign, MessageSquare, Calendar, Eye, Check, X, Loader2, Clock, CheckCircle } from "lucide-react"
import type { Listing, ListingState } from "@/hooks/admin/useListing"
import { formatPrice, formatDate } from "@/lib/listing-formatter"

interface ListingRowProps {
    listing: Listing
    listingState: ListingState
}

export const ListingRow = React.memo(({ listing, listingState }: ListingRowProps) => {
    const {
        handleViewListing,
        handleRejectClick,
        setSelectedListing,
        setShowApproveModal,
        setShowRFQsModal,
        processingAction,
    } = listingState

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                )
            case "ACTIVE":
            case "APPROVED":
                return (
                    <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                    </Badge>
                )
            case "REJECTED":
                return (
                    <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                        <X className="w-3 h-3 mr-1" />
                        Rejected
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getListingTypeBadge = (type: string) => {
        const colors = {
            SELL: "bg-blue-50 text-blue-700 border-blue-200",
            LEASE: "bg-purple-50 text-purple-700 border-purple-200",
            RENT: "bg-orange-50 text-orange-700 border-orange-200",
        }
        return (
            <Badge variant="outline" className={colors[type as keyof typeof colors] || "bg-gray-50 text-gray-700"}>
                {type}
            </Badge>
        )
    }

    return (
        <div className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors">
            {/* Product & Seller */}
            <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-medium truncate text-sm">{listing.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                        {listing.seller.businessName ||
                            `${listing.seller.firstName || ""} ${listing.seller.lastName || ""}`.trim() ||
                            listing.seller.email}
                    </div>
                    <div className="mt-1">{getListingTypeBadge(listing.listingType)}</div>
                </div>
            </div>

            {/* Price & Quantity */}
            <div className="col-span-2 space-y-1">
                <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="w-3 h-3 text-emerald-600" />
                    <span className="font-semibold text-emerald-600">{formatPrice(listing.price)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Package className="w-3 h-3" />
                    {listing.quantity.toLocaleString()} units
                </div>
            </div>

            {/* Status */}
            <div className="col-span-2">{getStatusBadge(listing.status)}</div>

            {/* RFQs & Date */}
            <div className="col-span-2 space-y-1">
                <div className="flex items-center gap-1 text-sm">
                    <MessageSquare className="w-3 h-3 text-purple-600" />
                    <span className="font-medium">{listing._count.rfqs}</span>
                    <span className="text-muted-foreground text-xs">RFQs</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(listing.createdAt)}
                </div>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center justify-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleViewListing(listing)} className="h-8 w-8 p-0">
                    <Eye className="w-4 h-4" />
                </Button>

                {listing.status === "ACTIVE" && listing._count.rfqs > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSelectedListing(listing)
                            setShowRFQsModal(true)
                        }}
                        className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                        <MessageSquare className="w-4 h-4" />
                    </Button>
                )}

                {listing.status === "PENDING" && (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedListing(listing)
                                setShowApproveModal(true)
                            }}
                            disabled={processingAction === listing.id}
                            className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                            {processingAction === listing.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectClick(listing)}
                            disabled={processingAction === listing.id}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
})

ListingRow.displayName = "ListingRow"
