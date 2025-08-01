"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, X, User, Building, MapPin } from "lucide-react"
import { useProfile } from "../context/ProfileContext"
import { useCallback } from "react"

const businessTypeOptions = [
    { value: 'individual', label: 'Individual' },
    { value: 'proprietorship', label: 'Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
    { value: 'private_limited', label: 'Private Limited Company' },
    { value: 'public_limited', label: 'Public Limited Company' },
    { value: 'ngo', label: 'NGO/Non-Profit' },
    { value: 'government_entity', label: 'Government Entity' },
    { value: 'other', label: 'Other' }
];

const industryOptions = [
    'Agriculture', 'Manufacturing', 'Technology', 'Healthcare', 'Education',
    'Financial Services', 'Real Estate', 'Retail', 'Transportation', 'Energy',
    'Construction', 'Food & Beverage', 'Textiles', 'Chemicals', 'Automotive'
];

const yearsInBusinessOptions = [
    { value: 1, label: 'Less than 1 year' },
    { value: 2, label: '1-3 years' },
    { value: 3, label: '3-5 years' },
    { value: 4, label: '5-10 years' },
    { value: 5, label: '10+ years' }
];

export const ProfileEditForm = () => {
    const { profileForm, setProfileForm, handleUpdateProfile, loading, handleCancelEdit } = useProfile()

    const handleInputChange = useCallback(
        (field: string, value: string) => {
            setProfileForm((prev: any) => ({
                ...prev,
                [field]: value,
            }))
        },
        [setProfileForm],
    )

    // Memoized handlers for specific input types
    const handleTextChange = useCallback(
        (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            handleInputChange(field, e.target.value)
        },
        [handleInputChange],
    )

    const handleTextareaChange = useCallback(
        (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            handleInputChange(field, e.target.value)
        },
        [handleInputChange],
    )

    const handleSelectChange = useCallback(
        (field: string) => (value: string) => {
            handleInputChange(field, value)
        },
        [handleInputChange],
    )

    return (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Basic Information */}
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
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={profileForm.firstName || ""}
                                onChange={handleTextChange("firstName")}
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={profileForm.lastName || ""}
                                onChange={handleTextChange("lastName")}
                                placeholder="Enter your last name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileForm.email || ""}
                                onChange={handleTextChange("email")}
                                placeholder="Enter your email address"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="countryCode"
                                    value={profileForm.countryCode || ""}
                                    onChange={handleTextChange("countryCode")}
                                    placeholder="+1"
                                    className="w-20"
                                />
                                <Input
                                    id="phone"
                                    value={profileForm.phone || ""}
                                    onChange={handleTextChange("phone")}
                                    placeholder="Enter your phone number"
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Business Information */}
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
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input
                                id="businessName"
                                value={profileForm.businessName || ""}
                                onChange={handleTextChange("businessName")}
                                placeholder="Enter your business name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="businessType">Business Type</Label>
                            <Select
                                value={businessTypeOptions.find(option => option.value === profileForm.businessType)?.value || ""}
                                onValueChange={handleSelectChange("businessType")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessTypeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="registrationNo">Registration Number</Label>
                            <Input
                                id="registrationNo"
                                value={profileForm.registrationNo || ""}
                                onChange={(e) => handleTextChange("registrationNo")}
                                placeholder="Enter registration number"
                            />
                        </div>
                        <div>
                            <Label htmlFor="taxId">Tax ID</Label>
                            <Input
                                id="taxId"
                                value={profileForm.taxId || ""}
                                onChange={handleTextChange("taxId")}
                                placeholder="Enter your tax ID"
                            />
                        </div>
                        <div>
                            <Label htmlFor="panOrTin">PAN/TIN</Label>
                            <Input
                                id="panOrTin"
                                value={profileForm.panOrTin || ""}
                                onChange={handleTextChange("panOrTin")}
                                placeholder="Enter PAN or TIN"
                            />
                        </div>
                        <div>
                            <Label htmlFor="yearsInBusiness">Years in Business</Label>
                            <Select
                                value={profileForm.yearsInBusiness ? String(profileForm.yearsInBusiness) : ""}
                                onValueChange={handleSelectChange("yearsInBusiness")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select years in business" />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearsInBusinessOptions.map((option) => (
                                        <SelectItem key={option.value} value={String(option.value)}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={profileForm.website || ""}
                                onChange={handleTextChange("website")}
                                placeholder="https://your-website.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                            <Input
                                id="linkedIn"
                                type="url"
                                value={profileForm.linkedIn || ""}
                                onChange={handleTextChange("linkedIn")}
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="companyBio">Company Bio</Label>
                        <Textarea
                            id="companyBio"
                            value={profileForm.companyBio || ""}
                            onChange={handleTextareaChange("companyBio")}
                            placeholder="Describe your company..."
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Address Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                            id="street"
                            value={profileForm.address.street || ""}
                            onChange={handleTextChange("address.street")}
                            placeholder="Enter your street address"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={profileForm.address.city || ""}
                                onChange={handleTextChange("address.city")}
                                placeholder="Enter your city"
                            />
                        </div>
                        <div>
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                                id="state"
                                value={profileForm.address.state || ""}
                                onChange={handleTextChange("address.state")}
                                placeholder="Enter your state/province"
                            />
                        </div>
                        <div>
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input
                                id="zipCode"
                                value={profileForm.address.zipCode || ""}
                                onChange={handleTextChange("address.zipCode")}
                                placeholder="Enter your zip code"
                            />
                        </div>
                        <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={profileForm.address.country || ""}
                                onChange={handleTextChange("address.country")}
                                placeholder="Enter your country"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 bg-transparent"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex items-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
