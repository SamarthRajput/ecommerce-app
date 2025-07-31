import { Dialog } from "@/components/ui/dialog"
import type { ListingState } from "@/hooks/admin/useListing"
import { ListingDetailModal } from "./modals/ListingDetailModal"
import { ApproveConfirmModal } from "./modals/ApproveConfirmModal"
import { RejectModal } from "./modals/RejectModal"
import { RFQsModal } from "./modals/RFQsModal"

interface ListingModalsProps {
    listingState: ListingState
}

export const ListingModals = ({ listingState }: ListingModalsProps) => {
    const {
        showViewModal,
        setShowViewModal,
        showApproveModal,
        setShowApproveModal,
        showRejectModal,
        setShowRejectModal,
        showRFQsModal,
        setShowRFQsModal,
        selectedListing,
    } = listingState

    return (
        <>
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                {selectedListing && <ListingDetailModal listing={selectedListing} listingState={listingState} />}
            </Dialog>

            <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
                <ApproveConfirmModal listingState={listingState} />
            </Dialog>

            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <RejectModal listingState={listingState} />
            </Dialog>

            <Dialog open={showRFQsModal} onOpenChange={setShowRFQsModal}>
                <RFQsModal listingState={listingState} />
            </Dialog>
        </>
    )
}
