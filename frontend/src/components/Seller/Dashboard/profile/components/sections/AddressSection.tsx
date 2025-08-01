"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { useProfile } from "../../context/ProfileContext"

export const AddressSection = () => {
    const { seller } = useProfile()

    if (!seller) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Street Address</label>
                        <p className="text-sm mt-1 break-words">{seller.address.street || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">City</label>
                        <p className="text-sm mt-1 break-words">{seller.address.city || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">State/Province</label>
                        <p className="text-sm mt-1 break-words">{seller.address.state || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Postal Code</label>
                        <p className="text-sm mt-1 break-words">{seller.address.zipCode || "Not provided"}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Country</label>
                        <p className="text-sm mt-1 break-words">{seller.address.country || "Not provided"}</p>
                    </div>
                </div>
                {(seller.address.city || seller.address.country) && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Full Address</span>
                        </div>
                        <p className="text-sm mt-2 text-gray-600">
                            {[seller.address.street, seller.address.city, seller.address.state, seller.address.zipCode, seller.address.country]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
