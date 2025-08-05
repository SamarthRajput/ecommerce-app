"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign, Calendar, Eye, Send, X, Loader2, Clock, CheckCircle, CreditCard } from "lucide-react"
import type { RFQ, RFQState } from "@/hooks/admin/useRFQ"
import { formatPrice, formatDate } from "@/lib/listing-formatter"

interface RFQRowProps {
    rfq: RFQ
    rfqState: RFQState
}

export const RFQRow = React.memo(({ rfq, rfqState }: RFQRowProps) => {
    const { handleViewRFQ, handleRejectClick, setSelectedRFQ, setShowForwardModal, processingAction } = rfqState

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                )
            case "APPROVED":
            case "FORWARDED":
                return (
                    <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Forwarded
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

    // Safe access to product data with fallbacks
    const productName = rfq.product?.name || rfq.productName || "Product name not available"
    const productPrice = rfq.product?.price || rfq.price || 0
    const buyerName = `${rfq.buyer?.firstName || ""} ${rfq.buyer?.lastName || ""}`.trim() || 
                     rfq.buyer?.email || 
                     rfq.buyerEmail || 
                     "Buyer information not available"

    return (
        <div className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors">
            {/* Product & Buyer */}
            <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-medium truncate text-sm" title={productName}>
                        {productName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate" title={buyerName}>
                        {buyerName}
                    </div>
                </div>
            </div>

            {/* Price & Quantity */}
            <div className="col-span-2 space-y-1">
                <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="w-3 h-3 text-emerald-600" />
                    <span className="font-semibold text-emerald-600">
                        {formatPrice(productPrice)}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Package className="w-3 h-3" />
                    {(rfq.quantity || 0).toLocaleString()} units
                </div>
            </div>

            {/* Status */}
            <div className="col-span-2">{getStatusBadge(rfq.status)}</div>

            {/* Budget & Date */}
            <div className="col-span-2 space-y-1">
                {rfq.message?.budget ? (
                    <div className="flex items-center gap-1 text-sm">
                        <CreditCard className="w-3 h-3 text-purple-600" />
                        <span className="font-medium text-purple-600">
                            {formatPrice(rfq.message.budget, rfq.message.currency)}
                        </span>
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground">No budget specified</div>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(rfq.createdAt)}
                </div>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center justify-center gap-1">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewRFQ(rfq)} 
                    className="h-8 w-8 p-0"
                    title="View RFQ details"
                >
                    <Eye className="w-4 h-4" />
                </Button>

                {rfq.status === "PENDING" && (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedRFQ(rfq)
                                setShowForwardModal(true)
                            }}
                            disabled={processingAction === rfq.id}
                            className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Forward RFQ"
                        >
                            {processingAction === rfq.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectClick(rfq)}
                            disabled={processingAction === rfq.id}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Reject RFQ"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
})

RFQRow.displayName = "RFQRow"