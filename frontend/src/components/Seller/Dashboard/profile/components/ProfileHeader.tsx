"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit3, User, Building, Mail, Phone, MapPin, Calendar, CheckCircle } from "lucide-react"
import { useProfile } from "../context/ProfileContext"
import { formatDate } from "@/lib/listing-formatter"

export const ProfileHeader = () => {
    const { seller, isEditing, setIsEditing } = useProfile()

    if (!seller) return null

    return (
        <Card className="overflow-hidden">
            {/* Header Background */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <CardContent className="relative -mt-16 pb-6">
                {/* Profile Avatar & Basic Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                           
                                <User className="w-12 h-12 text-gray-400" />
                            
                        </div>
                        {seller.isEmailVerified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {seller.businessName || `${seller.firstName || ""} ${seller.lastName || ""}`.trim() || "User Profile"}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        <span className="truncate">{seller.email}</span>
                                    </div>
                                    {seller.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            <span>
                                                {seller.countryCode} {seller.phone}
                                            </span>
                                        </div>
                                    )}
                                    {(seller.address.city || seller.address.country) && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{[seller.address.city, seller.address.country].filter(Boolean).join(", ")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Badge
                                variant={seller.isApproved ? "default" : "secondary"}
                                className={
                                    seller.isApproved
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-amber-100 text-amber-700 border-amber-200"
                                }
                            >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {seller.isApproved ? "Approved Seller" : "Pending Approval"}
                            </Badge>
                            <Badge
                                variant={seller.isEmailVerified ? "default" : "secondary"}
                                className={
                                    seller.isEmailVerified
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-amber-100 text-amber-700 border-amber-200"
                                }
                            >
                                <Mail className="w-3 h-3 mr-1" />
                                {seller.isEmailVerified ? "Email Verified" : "Email Pending"}
                            </Badge>
                            <Badge
                                variant={seller.isPhoneVerified ? "default" : "secondary"}
                                className={
                                    seller.isPhoneVerified
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-amber-100 text-amber-700 border-amber-200"
                                }
                            >
                                <Phone className="w-3 h-3 mr-1" />
                                {seller.isPhoneVerified ? "Phone Verified" : "Phone Pending"}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <Building className="w-3 h-3 mr-1" />
                                {seller.businessType}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                <Calendar className="w-3 h-3 mr-1" />
                                Joined {formatDate(seller.createdAt)}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Profile Completion Status */}
                <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Profile Completion</h3>
                        <span className="text-sm font-medium text-gray-600">
                            {Math.round(getProfileCompletionPercentage(seller))}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProfileCompletionPercentage(seller)}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                        Complete your profile to improve visibility and build trust with buyers
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

// Helper function to calculate profile completion percentage
const getProfileCompletionPercentage = (seller: any): number => {
    const fields = [
        seller.firstName,
        seller.lastName,
        seller.email,
        seller.phone,
        seller.businessName,
        seller.businessType,
        seller.registrationNo,
        seller.taxId,
        seller.panOrTin,
        seller.website,
        seller.street,
        seller.city,
        seller.state,
        seller.zipCode,
        seller.country,
        seller.companyBio,
        seller.isEmailVerified,
        seller.isPhoneVerified,
        seller.yearsInBusiness,
        seller.industryTags?.length > 0,
        seller.keyProducts?.length > 0,
    ]

    const completedFields = fields.filter(Boolean).length
    return (completedFields / fields.length) * 100
}
