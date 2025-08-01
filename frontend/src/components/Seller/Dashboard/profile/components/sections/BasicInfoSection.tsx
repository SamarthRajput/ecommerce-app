"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, CheckCircle, X } from "lucide-react"
import { useProfile } from "../../context/ProfileContext"
import { formatDate } from "@/lib/listing-formatter"

export const BasicInfoSection = () => {
    const { seller } = useProfile()

    if (!seller) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">First Name</label>
                        <p className="text-sm mt-1 font-medium break-words">{seller.firstName || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Last Name</label>
                        <p className="text-sm mt-1 font-medium break-words">{seller.lastName || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Email Address</label>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm break-all">{seller.email}</p>
                            {seller.isEmailVerified ? (
                                <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                                    <X className="w-3 h-3 mr-1" />
                                    Unverified
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Phone Number</label>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm break-words">
                                {seller.phone ? `${seller.countryCode} ${seller.phone}` : "Not provided"}
                            </p>
                            {seller.phone &&
                                (seller.isPhoneVerified ? (
                                    <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                                        <X className="w-3 h-3 mr-1" />
                                        Unverified
                                    </Badge>
                                ))}
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Member Since</label>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="text-sm">{formatDate(seller.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
