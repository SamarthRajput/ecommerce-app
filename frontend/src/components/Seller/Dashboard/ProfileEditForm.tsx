"use client"

import React, { useCallback, useState, useMemo } from "react"
import { Save, X, Building, User, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FormInput, FormTextarea } from "./ProfileComponent"
import { ProfileFormData } from "@/lib/types/profile"
import { businessTypeOptions } from "@/src/app/seller/(auth)/signup/page"

interface ProfileEditFormProps {
    initialData: ProfileFormData
    onSubmit: (data: ProfileFormData) => Promise<void>
    loading: boolean
    onCancel: () => void
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ initialData, onSubmit, loading, onCancel }) => {
    // State to manage form data
    const [formData, setFormData] = useState(() => ({
        ...initialData,
        address: { ...initialData?.address },
    }))

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }, [])

    const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }))
    }, [])

    const handleArrayChange = useCallback((field: "industryTags" | "keyProducts", value: string) => {
        const tags = value
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        setFormData((prev) => ({
            ...prev,
            [field]: tags,
        }))
    }, [])

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            await onSubmit(formData)
        },
        [formData, onSubmit],
    )

    const handleCancel = useCallback(() => {
        // Reset form to initial data
        setFormData({
            ...initialData,
            address: { ...initialData?.address },
        })
        onCancel()
    }, [initialData, onCancel])

    // Memoize form sections to prevent unnecessary re-renders
    const personalInfoSection = useMemo(
        () => (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Personal Information</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="First Name"
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your first name"
                        />
                        <FormInput
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your last name"
                        />
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email address"
                        />
                        <FormInput
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your phone number"
                        />
                        <FormInput
                            label="Country Code"
                            name="countryCode"
                            value={formData.countryCode || ""}
                            onChange={handleInputChange}
                            placeholder="+91"
                        />
                        <FormInput
                            label="Tax ID"
                            name="taxId"
                            value={formData.taxId || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your tax ID"
                        />
                        <FormInput
                            label="PAN/TIN"
                            name="panOrTin"
                            value={formData.panOrTin || ""}
                            onChange={handleInputChange}
                            placeholder="Enter PAN or TIN number"
                        />
                        <FormInput
                            label="Registration Number"
                            name="registrationNo"
                            value={formData.registrationNo || ""}
                            onChange={handleInputChange}
                            placeholder="Business registration number"
                        />
                    </div>
                </CardContent>
            </Card>
        ),
        [
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.phone,
            formData.countryCode,
            formData.taxId,
            formData.panOrTin,
            formData.registrationNo,
            handleInputChange,
        ],
    )

    const businessInfoSection = useMemo(
        () => (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Building className="w-5 h-5" />
                        <span>Business Information</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="Business Name"
                            name="businessName"
                            value={formData.businessName || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your business name"
                        />
                        <FormInput
                            label="Business Type"
                            name="businessType"
                            value={formData.businessType || ""}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., Manufacturing, Trading, Services"
                        />
                        <FormInput
                            label="Years in Business"
                            name="yearsInBusiness"
                            type="number"
                            value={formData.yearsInBusiness || ""}
                            onChange={handleInputChange}
                            placeholder="Number of years"
                        />
                        <FormInput
                            label="Website"
                            name="website"
                            type="url"
                            value={formData.website || ""}
                            onChange={handleInputChange}
                            placeholder="https://www.yourwebsite.com"
                        />
                        <FormInput
                            label="LinkedIn Profile"
                            name="linkedIn"
                            type="url"
                            value={formData.linkedIn || ""}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="md:col-span-2"
                        />
                    </div>
                    <div className="mt-6 space-y-4">
                        <FormTextarea
                            label="Company Bio"
                            name="companyBio"
                            value={formData.companyBio || ""}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Tell us about your company, its mission, and what makes it unique..."
                        />
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">Industry Tags</Label>
                            <input
                                type="text"
                                value={formData.industryTags?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("industryTags", e.target.value)}
                                placeholder="Enter industry tags separated by commas (e.g., Manufacturing, Electronics, Automotive)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">Key Products</Label>
                            <input
                                type="text"
                                value={formData.keyProducts?.join(", ") || ""}
                                onChange={(e) => handleArrayChange("keyProducts", e.target.value)}
                                placeholder="Enter key products separated by commas (e.g., Industrial Machinery, Electronic Components)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate multiple products with commas</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ),
        [
            formData.businessName,
            formData.businessType,
            formData.yearsInBusiness,
            formData.website,
            formData.linkedIn,
            formData.companyBio,
            formData.industryTags,
            formData.keyProducts,
            handleInputChange,
            handleArrayChange,
        ],
    )

    const addressSection = useMemo(
        () => (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5" />
                        <span>Address Information</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="Street Address"
                            name="street"
                            value={formData.address?.street || ""}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your street address"
                            className="md:col-span-2"
                        />
                        <FormInput
                            label="City"
                            name="city"
                            value={formData.address?.city || ""}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your city"
                        />
                        <FormInput
                            label="State/Province"
                            name="state"
                            value={formData.address?.state || ""}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your state or province"
                        />
                        <FormInput
                            label="ZIP/Postal Code"
                            name="zipCode"
                            value={formData.address?.zipCode || ""}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your ZIP or postal code"
                        />
                        <FormInput
                            label="Country"
                            name="country"
                            value={formData.address?.country || ""}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your country"
                        />
                    </div>
                </CardContent>
            </Card>
        ),
        [formData.address, handleAddressChange],
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {personalInfoSection}
            {businessInfoSection}
            {addressSection}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 bg-transparent"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="px-6">
                    {loading ? (
                        <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Update Profile
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

export default React.memo(ProfileEditForm)
