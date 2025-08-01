import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogOverlay,
    DialogPortal
} from "@/components/ui/dialog"
import type { RFQState } from "@/hooks/admin/useRFQ"
import { RFQDetailModal } from "./modals/RFQDetailModal"
import { ForwardConfirmModal } from "./modals/ForwardConfirmModal"
import { RejectModal } from "./modals/RejectModal"

interface RFQModalsProps {
    rfqState: RFQState
}

export const RFQModals = ({ rfqState }: RFQModalsProps) => {
    const {
        showViewModal,
        setShowViewModal,
        showForwardModal,
        setShowForwardModal,
        showRejectModal,
        setShowRejectModal,
        selectedRFQ,
    } = rfqState

    return (
        <>
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                {selectedRFQ && <RFQDetailModal rfq={selectedRFQ} rfqState={rfqState} />}
            </Dialog>

            <Dialog open={showForwardModal} onOpenChange={setShowForwardModal}>
                <ForwardConfirmModal rfqState={rfqState} />
            </Dialog>

            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <RejectModal rfqState={rfqState} />
            </Dialog>
        </>
    )
}
