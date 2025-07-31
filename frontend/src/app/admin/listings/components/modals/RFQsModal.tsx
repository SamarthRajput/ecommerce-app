"use client"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, User, Package, ExternalLink, Mail, Download, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react'
import type { ListingState } from "@/hooks/admin/useListing"
import { formatDateTime, formatPrice } from "@/lib/listing-formatter"

interface RFQsModalProps {
    listingState: ListingState
}

interface BuyerMessage {
    deliveryDate?: string
    budget?: number
    currency?: string
    paymentTerms?: string
    specialRequirements?: string
    additionalNotes?: string
}

export const RFQsModal = ({ listingState }: RFQsModalProps) => {
    const { selectedListing, setShowRFQsModal } = listingState

    const getStatusBadge = (status: string) => {
        const statusColors = {
            PENDING: "bg-amber-50 text-amber-700 border-amber-200",
            APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
            REJECTED: "bg-red-50 text-red-700 border-red-200",
            COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
        }

        return (
            <Badge
                variant="outline"
                className={`text-xs ${statusColors[status as keyof typeof statusColors] || "bg-gray-50 text-gray-700"}`}
            >
                {status}
            </Badge>
        )
    }

    const parseBuyerMessage = (message?: string): BuyerMessage | null => {
        if (!message) return null

        try {
            return JSON.parse(message) as BuyerMessage
        } catch {
            return null
        }
    }

    const formatCurrency = (amount: number, currencyCode?: string) => {
        if (currencyCode && currencyCode !== "USD") {
            return `${amount.toLocaleString()} ${currencyCode}`
        }
        return formatPrice(amount)
    }

    return (
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader className="pb-4 flex-shrink-0">
                <DialogTitle className="flex items-center gap-2 text-xl">
                    <MessageSquare className="w-5 h-5" />
                    <span className="truncate">RFQs for {selectedListing?.name}</span>
                </DialogTitle>
                <DialogDescription>
                    All buyer requests for this product listing ({selectedListing?.rfqs?.length || 0} total)
                </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {selectedListing?.rfqs && selectedListing.rfqs.length > 0 ? (
                    selectedListing.rfqs.map((rfq, index) => {
                        const parsedMessage = parseBuyerMessage(rfq.message)

                        return (
                            <Card key={rfq.id} className="border border-border">
                                <CardContent className="p-4">
                                    <div className="space-y-4">
                                        {/* Header Section */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    #{index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h4 className="font-semibold text-sm truncate">
                                                            {`${rfq.buyer.firstName || ""} ${rfq.buyer.lastName || ""}`.trim() || "Anonymous Buyer"}
                                                        </h4>
                                                        {getStatusBadge(rfq.status)}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Mail className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{rfq.buyer.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex-shrink-0">
                                                {formatDateTime(rfq.createdAt)}
                                            </div>
                                        </div>

                                        {/* Basic RFQ Info */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                    Quantity Requested
                                                </Label>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Package className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                    <span className="font-bold text-blue-600">{rfq.quantity.toLocaleString()}</span>
                                                    <span className="text-xs text-muted-foreground">units</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                    Request Status
                                                </Label>
                                                <div className="mt-1">{getStatusBadge(rfq.status)}</div>
                                            </div>
                                            <div className="sm:col-span-2 lg:col-span-1">
                                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                    Buyer ID
                                                </Label>
                                                <div className="mt-1">
                                                    <span className="text-xs font-mono break-all">{rfq.buyer.id}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Parsed Message Details */}
                                        {parsedMessage && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 block">
                                                        Request Details
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {parsedMessage.budget && (
                                                            <div className="bg-muted/30 p-3 rounded-lg">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                        Budget
                                                                    </Label>
                                                                </div>
                                                                <p className="text-sm font-semibold text-emerald-600">
                                                                    {formatCurrency(parsedMessage.budget, parsedMessage.currency)}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {parsedMessage.deliveryDate && (
                                                            <div className="bg-muted/30 p-3 rounded-lg">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Calendar className="w-4 h-4 text-blue-600" />
                                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                        Delivery Date
                                                                    </Label>
                                                                </div>
                                                                <p className="text-sm font-semibold">
                                                                    {new Date(parsedMessage.deliveryDate).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {parsedMessage.paymentTerms && (
                                                            <div className="bg-muted/30 p-3 rounded-lg sm:col-span-2">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <FileText className="w-4 h-4 text-purple-600" />
                                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                        Payment Terms
                                                                    </Label>
                                                                </div>
                                                                <p className="text-sm break-words">{parsedMessage.paymentTerms}</p>
                                                            </div>
                                                        )}

                                                        {parsedMessage.specialRequirements && (
                                                            <div className="bg-muted/30 p-3 rounded-lg sm:col-span-2">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <AlertCircle className="w-4 h-4 text-orange-600" />
                                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                        Special Requirements
                                                                    </Label>
                                                                </div>
                                                                <p className="text-sm break-words leading-relaxed">{parsedMessage.specialRequirements}</p>
                                                            </div>
                                                        )}

                                                        {parsedMessage.additionalNotes && (
                                                            <div className="bg-muted/30 p-3 rounded-lg sm:col-span-2">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <MessageSquare className="w-4 h-4 text-gray-600" />
                                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                        Additional Notes
                                                                    </Label>
                                                                </div>
                                                                <p className="text-sm break-words leading-relaxed">{parsedMessage.additionalNotes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Raw Message Fallback */}
                                        {rfq.message && !parsedMessage && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                                                        Buyer Message
                                                    </Label>
                                                    <div className="bg-muted/30 p-3 rounded-lg">
                                                        <p className="text-sm leading-relaxed break-words">{rfq.message}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap items-center gap-2 pt-2">
                                            <Button size="sm" variant="outline" asChild>
                                                <a
                                                    href={`/admin/chat?chatwith=${rfq.buyer.id}&rfqId=${rfq.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2"
                                                >
                                                    <MessageSquare className="w-3 h-3" />
                                                    Chat
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="ghost" asChild>
                                                <a href={`mailto:${rfq.buyer.email}`} className="flex items-center gap-2">
                                                    <Mail className="w-3 h-3" />
                                                    Email
                                                </a>
                                            </Button>
                                            {/* <Button size="sm" variant="ghost">
                                                <User className="w-3 h-3 mr-1" />
                                                View Profile
                                            </Button> */}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <div className="text-center py-12">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-medium text-lg">No RFQs found</p>
                                <p className="text-sm">This listing hasn't received any buyer requests yet</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter className="gap-2 pt-6 border-t flex-shrink-0">
                <Button variant="outline" onClick={() => setShowRFQsModal(false)}>
                    Close
                </Button>
                {/* {selectedListing?.rfqs && selectedListing.rfqs.length > 0 && (
                    <Button variant="default">
                        <Download className="w-4 h-4 mr-2" />
                        Export RFQs ({selectedListing.rfqs.length})
                    </Button>
                )} */}
            </DialogFooter>
        </DialogContent>
    )
}
