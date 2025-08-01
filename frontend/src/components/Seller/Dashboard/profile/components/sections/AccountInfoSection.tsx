"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Calendar, Activity, CheckCircle, FileText } from "lucide-react"
import { useProfile } from "../../context/ProfileContext"
import { formatDate } from "@/lib/listing-formatter"

export const AccountInfoSection = () => {
    const { seller } = useProfile()

    if (!seller) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Account Status</label>
                        <div className="mt-1">
                            <Badge
                                variant={seller.isApproved ? "default" : "secondary"}
                                className={
                                    seller.isApproved
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-amber-100 text-amber-700 border-amber-200"
                                }
                            >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {seller.isApproved ? "Approved" : "Pending Approval"}
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Account Type</label>
                        <p className="text-sm mt-1">Business Account</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Created Date</label>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="text-sm">{formatDate(seller.createdAt)}</p>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Last Updated</label>
                        <div className="flex items-center gap-2 mt-1">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <p className="text-sm">{formatDate(seller.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Approval Note */}
                {seller.approvalNote && (
                    <div className="border-t pt-4">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                            Approval Note
                        </label>
                        <div className="bg-muted/30 p-4 rounded-lg">
                            <p className="text-sm leading-relaxed break-words">{seller.approvalNote}</p>
                        </div>
                    </div>
                )}

                {/* Verification Status */}
                <div className="border-t pt-4">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 block">
                        Verification Status
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${seller.isEmailVerified ? "text-emerald-600" : "text-gray-400"}`} />
                                <span className="text-sm font-medium">Email Verification</span>
                            </div>
                            <Badge
                                variant={seller.isEmailVerified ? "default" : "secondary"}
                                className={
                                    seller.isEmailVerified
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-amber-100 text-amber-700 border-amber-200"
                                }
                            >
                                {seller.isEmailVerified ? "Verified" : "Pending"}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${seller.isPhoneVerified ? "text-emerald-600" : "text-gray-400"}`} />
                                <span className="text-sm font-medium">Phone Verification</span>
                            </div>
                            <Badge
                                variant={seller.isPhoneVerified ? "default" : "secondary"}
                                className={
                                    seller.isPhoneVerified
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-amber-100 text-amber-700 border-amber-200"
                                }
                            >
                                {seller.isPhoneVerified ? "Verified" : "Pending"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Document Status */}
                <div className="border-t pt-4">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 block">
                        Document Status
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FileText className={`w-4 h-4 ${seller.govIdUrl ? "text-emerald-600" : "text-gray-400"}`} />
                                <span className="text-sm font-medium">Government ID</span>
                            </div>
                            <Badge
                                variant={seller.govIdUrl ? "default" : "secondary"}
                                className={
                                    seller.govIdUrl
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-gray-100 text-gray-700 border-gray-200"
                                }
                            >
                                {seller.govIdUrl ? "Uploaded" : "Missing"}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FileText className={`w-4 h-4 ${seller.gstCertUrl ? "text-emerald-600" : "text-gray-400"}`} />
                                <span className="text-sm font-medium">GST Certificate</span>
                            </div>
                            <Badge
                                variant={seller.gstCertUrl ? "default" : "secondary"}
                                className={
                                    seller.gstCertUrl
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-gray-100 text-gray-700 border-gray-200"
                                }
                            >
                                {seller.gstCertUrl ? "Uploaded" : "Missing"}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FileText className={`w-4 h-4 ${seller.businessDocUrl ? "text-emerald-600" : "text-gray-400"}`} />
                                <span className="text-sm font-medium">Business Document</span>
                            </div>
                            <Badge
                                variant={seller.businessDocUrl ? "default" : "secondary"}
                                className={
                                    seller.businessDocUrl
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-gray-100 text-gray-700 border-gray-200"
                                }
                            >
                                {seller.businessDocUrl ? "Uploaded" : "Missing"}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FileText className={`w-4 h-4 ${seller.otherDocsUrl ? "text-emerald-600" : "text-gray-400"}`} />
                                <span className="text-sm font-medium">Other Documents</span>
                            </div>
                            <Badge
                                variant={seller.otherDocsUrl ? "default" : "secondary"}
                                className={
                                    seller.otherDocsUrl
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-gray-100 text-gray-700 border-gray-200"
                                }
                            >
                                {seller.otherDocsUrl ? "Uploaded" : "Missing"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
