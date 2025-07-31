"use client"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Loader2 } from "lucide-react"
import type { ListingState } from "@/hooks/admin/useListing"

interface RejectModalProps {
    listingState: ListingState
}

export const RejectModal = ({ listingState }: RejectModalProps) => {
    const { selectedListing, rejectionReason, setRejectionReason, processingAction, rejectListing, setShowRejectModal } =
        listingState

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                    <X className="w-5 h-5" />
                    Reject Listing
                </DialogTitle>
                <DialogDescription>
                    Please provide a clear reason for rejecting this product listing. This feedback will help the seller
                    understand your decision.
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="rejection-reason">Rejection Reason</Label>
                    <Textarea
                        id="rejection-reason"
                        placeholder="Enter detailed rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                        maxLength={500}
                        className="resize-none"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Be specific to help the seller understand</span>
                        <span>{rejectionReason.length}/500</span>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => {
                        setShowRejectModal(false)
                        setRejectionReason("")
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => selectedListing && rejectListing(selectedListing.id)}
                    disabled={!rejectionReason.trim() || processingAction === selectedListing?.id}
                >
                    {processingAction === selectedListing?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <X className="w-4 h-4 mr-2" />
                    Reject Listing
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
