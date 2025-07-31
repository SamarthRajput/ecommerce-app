"use client"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import type { ListingState } from "@/hooks/admin/useListing"
import { formatPrice } from "@/lib/listing-formatter"

interface ApproveConfirmModalProps {
    listingState: ListingState
}

export const ApproveConfirmModal = ({ listingState }: ApproveConfirmModalProps) => {
    const { selectedListing, processingAction, approveListing, setShowApproveModal, setSelectedListing } = listingState

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-emerald-600">
                    <Check className="w-5 h-5" />
                    Approve Listing
                </DialogTitle>
                <DialogDescription>
                    Are you sure you want to approve this product listing? This will make it visible to buyers and they can submit
                    RFQs.
                </DialogDescription>
            </DialogHeader>

            {selectedListing && (
                <div className="py-4">
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Product:</span>
                            <span className="text-sm font-medium">{selectedListing.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Price:</span>
                            <span className="text-sm font-semibold text-emerald-600">{formatPrice(selectedListing.price)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                            <span className="text-sm">{selectedListing.quantity.toLocaleString()} units</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Seller:</span>
                            <span className="text-sm">{selectedListing.seller.businessName || selectedListing.seller.email}</span>
                        </div>
                    </div>
                </div>
            )}

            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => {
                        setShowApproveModal(false)
                        setSelectedListing(null)
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        if (selectedListing) {
                            approveListing(selectedListing.id)
                            setShowApproveModal(false)
                            setSelectedListing(null)
                        }
                    }}
                    disabled={processingAction === selectedListing?.id}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    {processingAction === selectedListing?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Check className="w-4 h-4 mr-2" />
                    Approve Listing
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
