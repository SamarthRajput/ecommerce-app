"use client"
import type React from "react"
import { createContext, useContext, useState } from "react"
import type { ProfileProps } from "@/lib/types/profile"

interface ProfileContextType extends ProfileProps {
    showVerificationModal: boolean
    setShowVerificationModal: (show: boolean) => void
    verificationType: "email" | "phone" | null
    setVerificationType: (type: "email" | "phone" | null) => void
    handleCancelEdit: () => void
    handleVerifyEmail: () => void
    handleVerifyPhone: () => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const useProfile = () => {
    const context = useContext(ProfileContext)
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider")
    }
    return context
}

interface ProfileProviderProps extends ProfileProps {
    children: React.ReactNode
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children, ...props }) => {
    const [showVerificationModal, setShowVerificationModal] = useState(false)
    const [verificationType, setVerificationType] = useState<"email" | "phone" | null>(null)

    const handleCancelEdit = () => {
        props.setIsEditing(false)
        // Reset form to original seller data
        if (props.seller) {
            props.setProfileForm(props.seller)
        }
    }

    const handleVerifyEmail = () => {
        setVerificationType("email")
        setShowVerificationModal(true)
        console.log("Verify email clicked")
    }

    const handleVerifyPhone = () => {
        setVerificationType("phone")
        setShowVerificationModal(true)
        console.log("Verify phone clicked")
    }

    const contextValue: ProfileContextType = {
        ...props,
        showVerificationModal,
        setShowVerificationModal,
        verificationType,
        setVerificationType,
        handleCancelEdit,
        handleVerifyEmail,
        handleVerifyPhone,
    }

    return <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>
}
