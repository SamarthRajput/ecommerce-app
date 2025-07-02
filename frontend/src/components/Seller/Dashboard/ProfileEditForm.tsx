// components/profile/ProfileEditForm.tsx
import React from 'react';
import { Save, X, Building, User, MapPin, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput, FormTextarea } from './ProfileComponent';
import { ProfileFormData } from '@/src/lib/types/profile';

interface ProfileEditFormProps {
    profileForm: ProfileFormData;
    setProfileForm: React.Dispatch<React.SetStateAction<ProfileFormData>>;
    handleUpdateProfile: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    loading: boolean;
    onCancel: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
    profileForm,
    setProfileForm,
    handleUpdateProfile,
    loading,
    onCancel
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const handleArrayChange = (field: 'industryTags' | 'keyProducts', value: string) => {
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        setProfileForm(prev => ({
            ...prev,
            [field]: tags
        }));
    };

    return (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Personal Information */}
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
                            value={profileForm.firstName || ''}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your first name"
                        />

                        <FormInput
                            label="Last Name"
                            name="lastName"
                            value={profileForm.lastName || ''}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your last name"
                        />

                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={profileForm.email || ''}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email address"
                        />

                        <FormInput
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={profileForm.phone || ''}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your phone number"
                        />

                        <FormInput
                            label="Country Code"
                            name="countryCode"
                            value={profileForm.countryCode || ''}
                            onChange={handleInputChange}
                            placeholder="+91"
                        />

                        <FormInput
                            label="Tax ID"
                            name="taxId"
                            value={profileForm.taxId || ''}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your tax ID"
                        />

                        <FormInput
                            label="PAN/TIN"
                            name="panOrTin"
                            value={profileForm.panOrTin || ''}
                            onChange={handleInputChange}
                            placeholder="Enter PAN or TIN number"
                        />

                        <FormInput
                            label="Registration Number"
                            name="registrationNo"
                            value={profileForm.registrationNo || ''}
                            onChange={handleInputChange}
                            placeholder="Business registration number"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Business Information */}
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
                            value={profileForm.businessName || ''}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your business name"
                        />

                        <FormInput
                            label="Business Type"
                            name="businessType"
                            value={profileForm.businessType || ''}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., Manufacturing, Trading, Services"
                        />

                        <FormInput
                            label="Years in Business"
                            name="yearsInBusiness"
                            type="number"
                            value={profileForm.yearsInBusiness || ''}
                            onChange={handleInputChange}
                            placeholder="Number of years"
                        />

                        <FormInput
                            label="Website"
                            name="website"
                            type="url"
                            value={profileForm.website || ''}
                            onChange={handleInputChange}
                            placeholder="https://www.yourwebsite.com"
                        />

                        <FormInput
                            label="LinkedIn Profile"
                            name="linkedIn"
                            type="url"
                            value={profileForm.linkedIn || ''}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="md:col-span-2"
                        />
                    </div>

                    <div className="mt-6 space-y-4">
                        <FormTextarea
                            label="Company Bio"
                            name="companyBio"
                            value={profileForm.companyBio || ''}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Tell us about your company, its mission, and what makes it unique..."
                        />

                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Industry Tags
                            </Label>
                            <input
                                type="text"
                                value={profileForm.industryTags?.join(', ') || ''}
                                onChange={(e) => handleArrayChange('industryTags', e.target.value)}
                                placeholder="Enter industry tags separated by commas (e.g., Manufacturing, Electronics, Automotive)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Separate multiple tags with commas
                            </p>
                        </div>

                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Key Products
                            </Label>
                            <input
                                type="text"
                                value={profileForm.keyProducts?.join(', ') || ''}
                                onChange={(e) => handleArrayChange('keyProducts', e.target.value)}
                                placeholder="Enter key products separated by commas (e.g., Industrial Machinery, Electronic Components)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Separate multiple products with commas
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Address Information */}
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
                            value={profileForm.address?.street || ''}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your street address"
                            className="md:col-span-2"
                        />

                        <FormInput
                            label="City"
                            name="city"
                            value={profileForm.address?.city || ''}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your city"
                        />

                        <FormInput
                            label="State/Province"
                            name="state"
                            value={profileForm.address?.state || ''}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your state or province"
                        />

                        <FormInput
                            label="ZIP/Postal Code"
                            name="zipCode"
                            value={profileForm.address?.zipCode || ''}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your ZIP or postal code"
                        />

                        <FormInput
                            label="Country"
                            name="country"
                            value={profileForm.address?.country || ''}
                            onChange={handleAddressChange}
                            required
                            placeholder="Enter your country"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-6"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="px-6"
                >
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
    );
};