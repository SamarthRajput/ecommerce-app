"use client"
import type React from "react"
import { ProfileProvider } from "./context/ProfileContext"
import { ProfileHeader } from "./components/ProfileHeader"
import { ProfileContent } from "./components/ProfileContent"
import { ProfileModals } from "./components/ProfileModals"
import type { ProfileProps } from "@/lib/types/profile"

const ProfileDashboard: React.FC<ProfileProps> = (props) => {
    return (
        <ProfileProvider {...props}>
            <div className="min-h-screen bg-background">
                <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                    <ProfileHeader />
                    <ProfileContent />
                    <ProfileModals />
                </div>
            </div>
        </ProfileProvider>
    )
}

export default ProfileDashboard
