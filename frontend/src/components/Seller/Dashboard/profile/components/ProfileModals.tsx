import { Dialog } from "@/components/ui/dialog"
import { useProfile } from "../context/ProfileContext"
import { VerificationModal } from "./modals/VerificationModal"

export const ProfileModals = () => {
    const { showVerificationModal, setShowVerificationModal } = useProfile()

    return (
        <>
            <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
                <VerificationModal />
            </Dialog>
        </>
    )
}
