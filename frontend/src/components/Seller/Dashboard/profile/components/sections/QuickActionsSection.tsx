"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit3, Mail, Phone, Shield, Settings } from "lucide-react"
import { useProfile } from "../../context/ProfileContext"

export const QuickActionsSection = () => {
    const { seller, setIsEditing, handleVerifyEmail, handleVerifyPhone } = useProfile()

    if (!seller) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-center gap-2 h-12 hover:bg-blue-50 hover:border-blue-200"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                    </Button>

                    {!seller.isEmailVerified && (
                        <Button
                            variant="outline"
                            onClick={handleVerifyEmail}
                            className="flex items-center justify-center gap-2 h-12 hover:bg-emerald-50 hover:border-emerald-200 bg-transparent"
                        >
                            <Mail className="w-4 h-4" />
                            <span>Verify Email</span>
                        </Button>
                    )}

                    {!seller.isPhoneVerified && seller.phone && (
                        <Button
                            variant="outline"
                            onClick={handleVerifyPhone}
                            className="flex items-center justify-center gap-2 h-12 hover:bg-emerald-50 hover:border-emerald-200 bg-transparent"
                        >
                            <Phone className="w-4 h-4" />
                            <span>Verify Phone</span>
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 h-12 hover:bg-purple-50 hover:border-purple-200 bg-transparent"
                        onClick={() => {
                            // Add security settings logic here
                            console.log("Security settings clicked")
                        }}
                    >
                        <Shield className="w-4 h-4" />
                        <span>Security Settings</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
