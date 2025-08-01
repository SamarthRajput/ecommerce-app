"use client"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    Package,
    FileText,
    DollarSign,
    User,
    MessageSquare,
    Clock,
    CheckCircle,
    X,
    Send,
    Calendar,
    CreditCard,
    Truck,
    ClipboardList,
    Mail,
    Phone,
    MapPin,
    Users,
    AlertCircle,
} from "lucide-react"
import type { RFQ, RFQState } from "@/hooks/admin/useRFQ"
import { formatPrice, formatDateTime } from "@/lib/listing-formatter"

interface RFQDetailModalProps {
    rfq: RFQ
    rfqState: RFQState
}

export const RFQDetailModal = ({ rfq, rfqState }: RFQDetailModalProps) => {
    const { setShowViewModal, setShowForwardModal, handleRejectClick } = rfqState

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                    </Badge>
                )
            case "APPROVED":
            case "FORWARDED":
                return (
                    <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Forwarded to Sellers
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

    const parseBuyerMessage = (message?: string) => {
        if (!message) return null
        try {
            return JSON.parse(message)
        } catch {
            return null
        }
    }

    const parsedMessage = parseBuyerMessage(rfq.message?.additionalNotes)

    return (
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader className="pb-4 flex-shrink-0">
                <DialogTitle className="flex items-start gap-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <Package className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{rfq.product.name}</div>
                        <div className="text-sm text-muted-foreground font-normal">RFQ ID: {rfq.id}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-shrink-0">{getStatusBadge(rfq.status)}</div>
                </DialogTitle>
                <DialogDescription>Complete RFQ request details and information</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {/* RFQ Overview */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Request Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
                                <div className="mt-1">{getStatusBadge(rfq.status)}</div>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Requested Quantity
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Package className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-blue-600">{rfq.quantity.toLocaleString()} units</span>
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Submitted</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{formatDateTime(rfq.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Commercial Terms */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Commercial Terms
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Product Unit Price
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-semibold text-emerald-600">{formatPrice(rfq.product.price)}</span>
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Total Estimated Value
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <DollarSign className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-blue-600">
                                        {formatPrice(rfq.product.price * rfq.quantity)}
                                    </span>
                                </div>
                            </div>
                            {rfq.budget && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Buyer's Budget
                                    </Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <CreditCard className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-semibold text-purple-600">
                                            {formatPrice(rfq.budget)} {rfq.currency && `(${rfq.currency})`}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {rfq.paymentTerms && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Payment Terms
                                    </Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm break-words">{rfq.paymentTerms}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Requirements */}
                {rfq.deliveryDate && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                Delivery Requirements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Required Delivery Date
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="w-4 h-4 text-red-600" />
                                    <span className="text-sm font-semibold text-red-600">{formatDateTime(rfq.deliveryDate)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Buyer's Messages and Requirements */}
                {(rfq.message || rfq.specialRequirements || rfq.additionalNotes) && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Buyer's Requirements & Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rfq.message && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                                        Initial Message
                                    </Label>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        {parsedMessage ? (
                                            <div className="space-y-3">
                                                {parsedMessage.deliveryDate && (
                                                    <div className="flex items-start gap-2">
                                                        <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-sm">Delivery Date:</span>
                                                            <p className="text-sm mt-1">{parsedMessage.deliveryDate}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {parsedMessage.budget && (
                                                    <div className="flex items-start gap-2">
                                                        <DollarSign className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-sm">Budget:</span>
                                                            <p className="text-sm mt-1">
                                                                {parsedMessage.budget} {parsedMessage.currency ? `(${parsedMessage.currency})` : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {parsedMessage.paymentTerms && (
                                                    <div className="flex items-start gap-2">
                                                        <CreditCard className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-sm">Payment Terms:</span>
                                                            <p className="text-sm mt-1 break-words">{parsedMessage.paymentTerms}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {parsedMessage.specialRequirements && (
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-sm">Special Requirements:</span>
                                                            <p className="text-sm mt-1 break-words leading-relaxed">
                                                                {parsedMessage.specialRequirements}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {parsedMessage.additionalNotes && (
                                                    <div className="flex items-start gap-2">
                                                        <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-sm">Additional Notes:</span>
                                                            <p className="text-sm mt-1 break-words leading-relaxed">
                                                                {parsedMessage.additionalNotes}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm leading-relaxed break-words">{rfq.message?.additionalNotes}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {rfq.specialRequirements && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                                        Special Requirements
                                    </Label>
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                        <p className="text-sm leading-relaxed break-words">{rfq.specialRequirements}</p>
                                    </div>
                                </div>
                            )}
                            {rfq.additionalNotes && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                                        Additional Notes
                                    </Label>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm leading-relaxed break-words">{rfq.additionalNotes}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Product Information */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Product Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product Name</Label>
                            <p className="text-sm mt-1 font-medium break-words">{rfq.product.name}</p>
                        </div>
                        <div>
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</Label>
                            <p className="text-sm mt-1 leading-relaxed break-words">{rfq.product.description}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unit Price</Label>
                                <p className="text-sm mt-1 font-semibold text-emerald-600">{formatPrice(rfq.product.price)}</p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</Label>
                                <p className="text-sm mt-1 break-words">{rfq.product.category || "N/A"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Buyer Information */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Buyer Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm break-words">
                                        {`${rfq.buyer.firstName || ""} ${rfq.buyer.lastName || ""}`.trim() || "N/A"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm break-all">{rfq.buyer.email}</span>
                                </div>
                            </div>
                            {rfq.buyer.phoneNumber && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm break-words">{rfq.buyer.phoneNumber}</span>
                                    </div>
                                </div>
                            )}
                            {(rfq.buyer.city || rfq.buyer.country) && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm break-words">
                                            {[rfq.buyer.city, rfq.buyer.state, rfq.buyer.country].filter(Boolean).join(", ")}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Information */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" />
                            Activity & Communication
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Messages Count
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <MessageSquare className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm">{rfq._count?.messages || 0} messages</span>
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Chat Rooms</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm">{rfq.chatRooms?.length || 0} active chats</span>
                                </div>
                            </div>
                            {rfq.reviewedAt && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Last Reviewed
                                    </Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{formatDateTime(rfq.reviewedAt)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Rejection Reason (if applicable) */}
                {rfq.status === "REJECTED" && rfq.rejectionReason && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2 text-red-700">
                                <X className="w-4 h-4" />
                                Rejection Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label className="text-xs font-medium text-red-700 uppercase tracking-wide mb-2 block">
                                    Reason for Rejection
                                </Label>
                                <div className="bg-red-100 p-4 rounded-lg">
                                    <p className="text-sm leading-relaxed text-red-800 break-words">{rfq.rejectionReason}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <DialogFooter className="gap-2 pt-6 border-t flex-shrink-0">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                    Close
                </Button>
                {rfq.status === "PENDING" && (
                    <>
                        <Button
                            onClick={() => {
                                setShowViewModal(false)
                                handleRejectClick(rfq)
                            }}
                            variant="destructive"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Reject RFQ
                        </Button>
                        <Button
                            onClick={() => {
                                setShowViewModal(false)
                                setShowForwardModal(true)
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Forward to Sellers
                        </Button>
                    </>
                )}
            </DialogFooter>
        </DialogContent>
    )
}
