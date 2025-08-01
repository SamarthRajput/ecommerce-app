"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building } from "lucide-react"
import { useProfile } from "../../context/ProfileContext"
import { Badge } from "@/components/ui/badge"

export const BusinessInfoSection = () => {
    const { seller } = useProfile()

    if (!seller) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Business Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Business Name</label>
                        <p className="text-sm mt-1 font-medium break-words">{seller.businessName || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Business Type</label>
                        <p className="text-sm mt-1 break-words">{seller.businessType || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Registration No.
                        </label>
                        <p className="text-sm mt-1 font-mono break-all">{seller.registrationNo || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Tax ID</label>
                        <p className="text-sm mt-1 font-mono break-all">{seller.taxId || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">PAN/TIN</label>
                        <p className="text-sm mt-1 font-mono break-all">{seller.panOrTin || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Years in Business
                        </label>
                        <p className="text-sm mt-1">
                            {seller.yearsInBusiness ? `${seller.yearsInBusiness} years` : "Not provided"}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Website</label>
                        <p className="text-sm mt-1 break-all">
                            {seller.website ? (
                                <a
                                    href={seller.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {seller.website}
                                </a>
                            ) : (
                                "Not provided"
                            )}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">LinkedIn</label>
                        <p className="text-sm mt-1 break-all">
                            {seller.linkedIn ? (
                                <a
                                    href={seller.linkedIn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {seller.linkedIn}
                                </a>
                            ) : (
                                "Not provided"
                            )}
                        </p>
                    </div>
                </div>

                {/* Industry Tags */}
                {seller.industryTags && seller.industryTags.length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                            Industry Tags
                        </label>
                        <div className="flex flex-wrap gap-1">
                            {seller.industryTags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Key Products */}
                {seller.keyProducts && seller.keyProducts.length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                            Key Products
                        </label>
                        <div className="flex flex-wrap gap-1">
                            {seller.keyProducts.map((product, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                                >
                                    {product}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Company Bio */}
                {seller.companyBio && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Company Bio</label>
                        <div className="bg-muted/30 p-4 rounded-lg mt-2">
                            <p className="text-sm leading-relaxed break-words">{seller.companyBio}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
