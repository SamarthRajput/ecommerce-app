"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { useProfile } from "../context/ProfileContext"
import { ProfileEditForm } from "./ProfileEditForm"
import { ProfileViewSections } from "./ProfileViewSections"

export const ProfileContent = () => {
    const { isEditing, error } = useProfile()

    return (
        <div className="space-y-6">
            {/* Error/Success Message */}
            {error && (
                <Alert
                    className={
                        error.includes("successfully") || error.includes("updated")
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-red-200 bg-red-50"
                    }
                >
                    {error.includes("successfully") || error.includes("updated") ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription
                        className={
                            error.includes("successfully") || error.includes("updated") ? "text-emerald-700" : "text-red-700"
                        }
                    >
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content */}
            {isEditing ? <ProfileEditForm /> : <ProfileViewSections />}
        </div>
    )
}
