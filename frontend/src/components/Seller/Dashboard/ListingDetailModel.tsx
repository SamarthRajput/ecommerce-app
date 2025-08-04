// components/listing/ListingDetailModal.tsx
import React, { useState } from 'react';
import { X, Edit, Check, RefreshCw, AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Listing, STATUS_CONFIG } from '@/lib/types/seller/sellerDashboardListing';
import { useRouter } from 'next/navigation';

/*
export interface Listing {
    id: string;
    productName: string;
    name: string;
    description: string;
    listingType: string;
    industry: string;
    condition: string;
    productCode: string;
    model: string;
    specifications: string;
    hsnCode: string;
    countryOfSource: string;
    validityPeriod: string;
    images: string[];
    price: number;
    quantity: number;
    category: string;
    status: 'active' | 'inactive' | 'archived' | 'rejected';
    createdAt: string;
    rejectionReason?: string; // Optional for rejected listings
    updatedAt?: string;
    views?: number;
    rfqCount?: number;
    slug: string;
    minimumOrderQuantity: number;
    currency?: string 
    brochureUrl?: string
    deliveryTimeInDays?: number,
    expiryDate?: string,
    licenses: string[],
    certifications: string[],
    logisticsSupport: boolean,
    tags: string[],
    warrantyPeriod?: string,
    keywords: string[],
    videoUrl: string,
}
    */

interface ListingDetailModalProps {
    listing: Listing;
    onClose: () => void;
    onSubmit: (listingId: string, updated: Partial<Listing>) => Promise<void>;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
    listing,
    onClose,
    onSubmit
}) => {
    const router = useRouter();

    // Normalize status to lowercase for STATUS_CONFIG
    const normalizedStatus = (listing.status || '').toLowerCase();

    // Format expiry date if present
    const expiryDateFormatted = listing.expiryDate
        ? new Date(listing.expiryDate).toLocaleDateString()
        : undefined;

    // Format delivery time
    const deliveryTime = listing.deliveryTimeInDays
        ? `${listing.deliveryTimeInDays} day${listing.deliveryTimeInDays > 1 ? 's' : ''}`
        : undefined;

    // Format validity period (number or string)
    const validityPeriod =
        typeof listing.validityPeriod === 'number'
            ? `${listing.validityPeriod} day${listing.validityPeriod > 1 ? 's' : ''}`
            : listing.validityPeriod;

    // Format logistics support
    // const logisticsSupport =
    //     typeof listing.logisticsSupport === 'string'
    //         ? listing.logisticsSupport.charAt(0).toUpperCase() + listing.logisticsSupport.slice(1).toLowerCase()
    //         : listing.logisticsSupport
    //             ? 'Yes'
    //             : 'No';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold">
                        Listing Details
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Image Gallery Section */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                {listing.images?.[0] ? (
                                    <img
                                        src={listing.images[0]}
                                        alt={listing.productName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-20 h-20 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Additional Images */}
                            {listing.images && listing.images.length > 1 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {listing.images.slice(1, 4).map((image: string, index: number) => (
                                        <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                                            <img
                                                src={image}
                                                alt={`${listing.productName} ${index + 2}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Status and Meta Info */}
                            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Status</span>
                                    <Badge
                                        className={
                                            STATUS_CONFIG[normalizedStatus as keyof typeof STATUS_CONFIG]?.color ??
                                            "bg-gray-300 text-gray-700"
                                        }
                                    >
                                        {STATUS_CONFIG[normalizedStatus as keyof typeof STATUS_CONFIG]?.label ?? listing.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Created</span>
                                    <span className="text-sm text-gray-900">
                                        {new Date(listing.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {listing.updatedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Last Updated</span>
                                        <span className="text-sm text-gray-900">
                                            {new Date(listing.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                {(listing.views || listing.rfqCount) && (
                                    <div className="pt-2 border-t border-gray-200">
                                        {listing.views && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600">Views</span>
                                                <span className="text-sm text-gray-900">{listing.views}</span>
                                            </div>
                                        )}
                                        {listing.rfqCount && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600">RFQ Requests</span>
                                                <span className="text-sm text-gray-900">{listing.rfqCount}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {listing.productName}
                                    </h2>
                                    <p className="text-3xl font-bold text-green-600">
                                        ₹{listing.price.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/products/${listing.category}/${listing.id}`)}>
                                        <Package className="w-4 h-4 mr-2" />
                                        View on Marketplace
                                    </Button>
                                    <Button onClick={() =>
                                        router.push(`/seller/edit-listing/${listing.slug}`)
                                    }>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Listing
                                    </Button>
                                </div>
                            </div>

                            {/* /* View Mode */}
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 block mb-1">Quantity Available</span>
                                                <p className="text-lg font-semibold">{listing.quantity.toLocaleString()} units</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 block mb-1">Category</span>
                                                <p className="text-gray-900">{listing.category || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 block mb-1">Minimum Order Quantity</span>
                                                <p className="text-gray-900">{listing.minimumOrderQuantity || 1}</p>
                                            </div>
                                            {listing.currency && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 block mb-1">Currency</span>
                                                    <p className="text-gray-900">{listing.currency}</p>
                                                </div>
                                            )}
                                            {listing.brochureUrl && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 block mb-1">Brochure</span>
                                                    <a href={listing.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Brochure</a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 block mb-1">Total Value</span>
                                                <p className="text-lg font-semibold text-green-600">
                                                    ₹{(listing.price * listing.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 block mb-1">Listing Type</span>
                                                <p className="text-gray-900">{listing.listingType || 'Not specified'}</p>
                                            </div>
                                            {deliveryTime && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 block mb-1">Delivery Time</span>
                                                    <p className="text-gray-900">{deliveryTime}</p>
                                                </div>
                                            )}
                                            {expiryDateFormatted && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 block mb-1">Expiry Date</span>
                                                    <p className="text-gray-900">{expiryDateFormatted}</p>
                                                </div>
                                            )}
                                            {validityPeriod && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 block mb-1">Validity Period</span>
                                                    <p className="text-gray-900">{validityPeriod}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {listing.description && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                        <div className="prose prose-sm max-w-none">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {listing.description}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Technical Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Industry', value: listing.industry },
                                            { label: 'Condition', value: listing.condition },
                                            { label: 'Product Code', value: listing.productCode },
                                            { label: 'Model', value: listing.model },
                                            { label: 'HSN Code', value: listing.hsnCode },
                                            { label: 'Country of Origin', value: listing.countryOfSource },
                                            { label: 'Validity Period', value: listing.validityPeriod },
                                        ].map((item) => (
                                            item.value && (
                                                <div key={item.label}>
                                                    <span className="text-sm font-medium text-gray-600 block mb-1">
                                                        {item.label}
                                                    </span>
                                                    <p className="text-gray-900">{item.value}</p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>

                                {/* Specifications */}
                                {listing.specifications && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                                        <div className="prose prose-sm max-w-none">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {listing.specifications}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Tags, Keywords, Video */}
                                {(listing.tags && listing.tags.length > 0) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.tags.map((tag, idx) => (
                                                <Badge key={idx} variant="secondary">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {(listing.keywords && listing.keywords.length > 0) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Keywords</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.keywords.map((kw, idx) => (
                                                <Badge key={idx} variant="outline">{kw}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {listing.videoUrl && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Video</h3>
                                        <a href={listing.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch Video</a>
                                    </div>
                                )}
                            </div>

                            {normalizedStatus === 'rejected' && (
                                <CardContent>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Rejection Reason</h3>
                                    <p className="text-gray-700">{listing.rejectionReason}</p>
                                </CardContent>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};