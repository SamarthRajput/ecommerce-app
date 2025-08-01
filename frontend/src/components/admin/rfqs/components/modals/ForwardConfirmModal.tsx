"use client"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import type { RFQState } from "@/hooks/admin/useRFQ"
import { formatPrice } from "@/lib/listing-formatter"

interface ForwardConfirmModalProps {
    rfqState: RFQState
}

export const ForwardConfirmModal = ({ rfqState }: ForwardConfirmModalProps) => {
    const { selectedRFQ, processingAction, forwardRFQ, setShowForwardModal, setSelectedRFQ } = rfqState

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-emerald-600">
                    <Send className="w-5 h-5" />
                    Forward RFQ to Sellers
                </DialogTitle>
                <DialogDescription>
                    Are you sure you want to forward this RFQ to relevant sellers? This action will make the RFQ visible to
                    sellers who can then submit quotes.
                </DialogDescription>
            </DialogHeader>

            {selectedRFQ && (
                <div className="py-4">
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Product:</span>
                            <span className="text-sm font-medium">{selectedRFQ.product.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                            <span className="text-sm">{selectedRFQ.quantity.toLocaleString()} units</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Buyer:</span>
                            <span className="text-sm">{selectedRFQ.buyer.email}</span>
                        </div>
                        {selectedRFQ.budget && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Budget:</span>
                                <span className="text-sm font-semibold text-purple-600">{formatPrice(selectedRFQ.budget)}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => {
                        setShowForwardModal(false)
                        setSelectedRFQ(null)
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        if (selectedRFQ) {
                            forwardRFQ(selectedRFQ.id)
                            setShowForwardModal(false)
                            setSelectedRFQ(null)
                        }
                    }}
                    disabled={processingAction === selectedRFQ?.id}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    {processingAction === selectedRFQ?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Send className="w-4 h-4 mr-2" />
                    Forward RFQ
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
