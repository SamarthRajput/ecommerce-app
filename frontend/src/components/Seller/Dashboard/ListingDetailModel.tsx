// components/listing/ListingDetailModal.tsx
import React, { useState } from 'react';
import { X, Edit, Check, RefreshCw, AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Listing, STATUS_CONFIG } from '@/src/lib/types/seller/sellerDashboardListing';
import { useRouter } from 'next/navigation';

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
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState<Partial<Listing>>({ ...listing });
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'quantity' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);

        try {
            await onSubmit(listing.id, form);
            setIsEdit(false);
        } catch (err: any) {
            setSubmitError(err.message || "Failed to update listing");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsEdit(false);
        setForm({ ...listing });
        setSubmitError(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold">
                        {isEdit ? "Edit Listing" : "Listing Details"}
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
                                    <Badge className={STATUS_CONFIG[listing.status]?.color ?? "bg-gray-300 text-gray-700"}>
                                        {STATUS_CONFIG[listing.status]?.label ?? listing.status}
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
                            {!isEdit && (
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
                                        <Button onClick={() => setIsEdit(true)}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Listing
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Edit Form */}
                            {isEdit ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Product Name *
                                                </label>
                                                <Input
                                                    name="productName"
                                                    value={form.productName || ""}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Category
                                                </label>
                                                <Input
                                                    name="category"
                                                    value={form.category || ""}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Price (₹) *
                                                </label>
                                                <Input
                                                    name="price"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={form.price || ""}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Quantity *
                                                </label>
                                                <Input
                                                    name="quantity"
                                                    type="number"
                                                    min="0"
                                                    value={form.quantity || ""}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Listing Type
                                                </label>
                                                <Input
                                                    name="listingType"
                                                    value={form.listingType || ""}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Industry
                                                </label>
                                                <Input
                                                    name="industry"
                                                    value={form.industry || ""}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Condition
                                                </label>
                                                <Input
                                                    name="condition"
                                                    value={form.condition || ""}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Product Code
                                                </label>
                                                <Input
                                                    name="productCode"
                                                    value={form.productCode || ""}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Model
                                                </label>
                                                <Input
                                                    name="model"
                                                    value={form.model || ""}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    HSN Code
                                                </label>
                                                <Input
                                                    name="hsnCode"
                                                    value={form.hsnCode || ""}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Country of Origin
                                                </label>
                                                <Input
                                                    name="countryOfSource"
                                                    value={form.countryOfSource || ""}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Validity Period
                                                </label>
                                                <Input
                                                    name="validityPeriod"
                                                    value={form.validityPeriod || ""}
                                                    onChange={handleChange}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description and Specifications */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={form.description || ""}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                                                placeholder="Describe your product..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Specifications
                                            </label>
                                            <textarea
                                                name="specifications"
                                                value={form.specifications || ""}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                                                placeholder="Technical specifications..."
                                            />
                                        </div>
                                    </div>

                                    {/* Error Display */}
                                    {submitError && (
                                        <Alert className="border-red-200 bg-red-50">
                                            <AlertTriangle className="h-4 w-4 text-red-600" />
                                            <AlertDescription className="text-red-700">
                                                {submitError}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Form Actions */}
                                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                                        <Button type="submit" disabled={submitting} className="flex-1 sm:flex-none">
                                            {submitting ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={submitting}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                /* View Mode */
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
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};