"use client"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Package,
    FileText,
    DollarSign,
    Tag,
    Truck,
    Award,
    ImageIcon,
    Video,
    Building,
    MessageSquare,
    Clock,
    CheckCircle,
    X,
    Check,
    ExternalLink,
    Download,
    Eye,
    ZoomIn,
} from "lucide-react"
import type { Listing, ListingState } from "@/hooks/admin/useListing"
import { formatPrice, formatDateTime } from "@/lib/listing-formatter"

interface ListingDetailModalProps {
    listing: Listing
    listingState: ListingState
}

export const ListingDetailModal = ({ listing, listingState }: ListingDetailModalProps) => {
    const { setShowViewModal, setShowRFQsModal, setShowApproveModal, handleRejectClick } = listingState

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                    </Badge>
                )
            case "ACTIVE":
            case "APPROVED":
                return (
                    <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active Listing
                    </Badge>
                )
            case "REJECTED":
                return (
                    <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                        <X className="w-3 h-3 mr-1" />
                        Rejected
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getListingTypeBadge = (type: string) => {
        const colors = {
            SELL: "bg-blue-50 text-blue-700 border-blue-200",
            LEASE: "bg-purple-50 text-purple-700 border-purple-200",
            RENT: "bg-orange-50 text-orange-700 border-orange-200",
        }
        return (
            <Badge variant="outline" className={colors[type as keyof typeof colors] || "bg-gray-50 text-gray-700"}>
                {type}
            </Badge>
        )
    }

    return (
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader className="pb-4 flex-shrink-0">
                <DialogTitle className="flex items-start gap-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <Package className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{listing.name}</div>
                        <div className="text-sm text-muted-foreground font-normal">ID: {listing.productCode}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                        {getStatusBadge(listing.status)}
                        {getListingTypeBadge(listing.listingType)}
                    </div>
                </DialogTitle>
                <DialogDescription>Complete product listing details and information</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {/* Product Images */}
                {listing.images.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Product Images ({listing.images.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {listing.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square bg-muted/30 rounded-lg overflow-hidden border">
                                            <img
                                                src={image || `/placeholder.svg?height=200&width=200&text=Image ${index + 1}`}
                                                alt={`Product image ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement
                                                    target.src = `/placeholder.svg?height=200&width=200&text=Image ${index + 1}`
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => window.open(image, "_blank")}
                                                >
                                                    <ZoomIn className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Product Details */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Product Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</Label>
                            <p className="text-sm mt-1 leading-relaxed break-words">{listing.description}</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Model</Label>
                                <p className="text-sm mt-1 font-medium break-words">{listing.model}</p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Condition</Label>
                                <p className="text-sm mt-1 font-medium">{listing.condition}</p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Country</Label>
                                <p className="text-sm mt-1 font-medium">{listing.countryOfSource}</p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HSN Code</Label>
                                <p className="text-sm mt-1 font-mono break-all">{listing.hsnCode}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Specifications */}
                {listing.specifications && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Specifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{listing.specifications}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pricing & Inventory */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Pricing & Inventory
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Price</Label>
                                <div className="flex items-center gap-1 mt-1 flex-wrap">
                                    <span className="text-lg font-bold text-emerald-600">{formatPrice(listing.price)}</span>
                                    {listing.currency && <span className="text-sm text-muted-foreground">({listing.currency})</span>}
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quantity</Label>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-lg font-bold text-blue-600">{listing.quantity.toLocaleString()}</span>
                                    <span className="text-sm text-muted-foreground">units</span>
                                </div>
                            </div>
                            {listing.minimumOrderQuantity && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Min Order</Label>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-sm font-semibold">{listing.minimumOrderQuantity.toLocaleString()}</span>
                                        <span className="text-xs text-muted-foreground">units</span>
                                    </div>
                                </div>
                            )}
                            {listing.warrantyPeriod && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Warranty</Label>
                                    <p className="text-sm mt-1 font-medium break-words">{listing.warrantyPeriod}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Category & Classification */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Category & Classification
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Industry</Label>
                                <p className="text-sm mt-1 font-medium break-words">{listing.industry.name}</p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</Label>
                                <p className="text-sm mt-1 font-medium break-words">{listing.category.name}</p>
                            </div>
                        </div>
                        {listing.tags.length > 0 && (
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                                    Tags
                                </Label>
                                <div className="flex flex-wrap gap-1">
                                    {listing.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {listing.keywords.length > 0 && (
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                                    Keywords
                                </Label>
                                <div className="flex flex-wrap gap-1">
                                    {listing.keywords.map((keyword, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delivery & Logistics */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Delivery & Logistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {listing.deliveryTimeInDays && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Delivery Time
                                    </Label>
                                    <p className="text-sm mt-1 font-medium">{listing.deliveryTimeInDays} days</p>
                                </div>
                            )}
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Validity</Label>
                                <p className="text-sm mt-1 font-medium">{listing.validityPeriod} days</p>
                            </div>
                            {listing.logisticsSupport && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Logistics</Label>
                                    <div className="mt-1">
                                        <Badge variant="outline" className="text-xs">
                                            {listing.logisticsSupport}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Certifications & Licenses */}
                {(listing.certifications.length > 0 || listing.licenses.length > 0) && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Certifications & Licenses
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {listing.certifications.length > 0 && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                                        Certifications
                                    </Label>
                                    <div className="flex flex-wrap gap-1">
                                        {listing.certifications.map((cert, index) => (
                                            <Badge key={index} variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                                                {cert}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {listing.licenses.length > 0 && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                                        Licenses
                                    </Label>
                                    <div className="flex flex-wrap gap-1">
                                        {listing.licenses.map((license, index) => (
                                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                                {license}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Media & Documents */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Documents & Media
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {listing.brochureUrl && (
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span className="text-sm font-medium truncate">Product Brochure</span>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <Button size="sm" variant="ghost" className="h-8 text-xs" asChild>
                                        <a href={listing.brochureUrl} target="_blank" rel="noopener noreferrer">
                                            <Eye className="w-3 h-3 mr-1" />
                                            View
                                        </a>
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 text-xs" asChild>
                                        <a href={listing.brochureUrl} download>
                                            <Download className="w-3 h-3 mr-1" />
                                            Download
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )}
                        {listing.videoUrl && (
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Video className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                    <span className="text-sm font-medium truncate">Product Video</span>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 text-xs" asChild>
                                    <a href={listing.videoUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        Watch
                                    </a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Seller Information */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Seller Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {listing.seller.businessName && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Business Name
                                    </Label>
                                    <p className="text-sm mt-1 font-medium break-words">{listing.seller.businessName}</p>
                                </div>
                            )}
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Contact Person
                                </Label>
                                <p className="text-sm mt-1 break-words">
                                    {`${listing.seller.firstName || ""} ${listing.seller.lastName || ""}`.trim() || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</Label>
                                <p className="text-sm mt-1 break-all">{listing.seller.email}</p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Seller ID</Label>
                                <p className="text-xs mt-1 font-mono break-all">{listing.seller.id}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* RFQ Activity & Timeline */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Activity & Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total RFQs</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-purple-600">{listing._count.rfqs}</span>
                                {listing._count.rfqs > 0 && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 text-xs bg-transparent"
                                        onClick={() => setShowRFQsModal(true)}
                                    >
                                        View Details
                                    </Button>
                                )}
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</Label>
                                <p className="text-sm mt-1 break-words">{formatDateTime(listing.createdAt)}</p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Last Updated
                                </Label>
                                <p className="text-sm mt-1 break-words">{formatDateTime(listing.updatedAt)}</p>
                            </div>
                            {listing.expiryDate && (
                                <div className="sm:col-span-2">
                                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Expiry Date
                                    </Label>
                                    <p className="text-sm mt-1 text-red-600 break-words">{formatDateTime(listing.expiryDate)}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DialogFooter className="gap-2 pt-6 border-t flex-shrink-0">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                    Close
                </Button>
                {listing.status === "ACTIVE" && listing._count.rfqs > 0 && (
                    <Button onClick={() => setShowRFQsModal(true)} variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View RFQs ({listing._count.rfqs})
                    </Button>
                )}
                {listing.status === "PENDING" && (
                    <>
                        <Button
                            onClick={() => {
                                setShowViewModal(false)
                                handleRejectClick(listing)
                            }}
                            variant="destructive"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                        </Button>
                        <Button
                            onClick={() => {
                                setShowViewModal(false)
                                setShowApproveModal(true)
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                        </Button>
                    </>
                )}
            </DialogFooter>
        </DialogContent>
    )
}
