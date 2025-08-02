import React from 'react';
import { Save, X, Building, User, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// These are simplified for clarity.
export const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, name, ...props }) => (
  <div>
    <Label htmlFor={name}>{label}</Label>
    <input
      id={name}
      name={name}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

export const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, name, ...props }) => (
  <div>
    <Label htmlFor={name}>{label}</Label>
    <textarea
      id={name}
      name={name}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

interface ProfileFormData {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
  phone: string;
  countryCode?: string;
  taxId: string;
  panOrTin?: string;
  registrationNo?: string;
  website?: string;
  linkedIn?: string;
  yearsInBusiness?: number | string;
  industryTags?: string[];
  keyProducts?: string[];
  companyBio?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isApproved?: boolean;
  approvalNote?: string;
  govIdUrl?: string;
  gstCertUrl?: string;
  businessDocUrl?: string;
  otherDocsUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setProfileForm(prev => ({
      ...prev,
      [field]: tags
    }));
  };

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProfileForm(prev => ({
      ...prev,
      yearsInBusiness: value ? parseInt(value) : ''
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
            <FormInput label="First Name" name="firstName" value={profileForm.firstName} onChange={handleInputChange} required />
            <FormInput label="Last Name" name="lastName" value={profileForm.lastName} onChange={handleInputChange} required />
            <FormInput label="Email" name="email" type="email" value={profileForm.email} onChange={handleInputChange} required />
            <FormInput label="Phone Number" name="phone" type="tel" value={profileForm.phone} onChange={handleInputChange} required />
            <FormInput label="Country Code" name="countryCode" value={profileForm.countryCode || ''} onChange={handleInputChange} />
            <FormInput label="Tax ID" name="taxId" value={profileForm.taxId} onChange={handleInputChange} required />
            <FormInput label="PAN/TIN" name="panOrTin" value={profileForm.panOrTin || ''} onChange={handleInputChange} />
            <FormInput label="Registration Number" name="registrationNo" value={profileForm.registrationNo || ''} onChange={handleInputChange} />
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
            <FormInput label="Business Name" name="businessName" value={profileForm.businessName} onChange={handleInputChange} required />
            <div>
              <Label className="mb-2 block">Business Type *</Label>
              <select
                name="businessType"
                value={profileForm.businessType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select business type</option>
                <option value="Individual">Individual</option>
                <option value="Proprietorship">Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="LLP">LLP</option>
                <option value="Private Limited">Private Limited</option>
                <option value="Public Limited">Public Limited</option>
                <option value="NGO">NGO</option>
                <option value="Government Entity">Government Entity</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <FormInput
              label="Years in Business"
              name="yearsInBusiness"
              type="number"
              value={profileForm.yearsInBusiness?.toString() || ''}
              onChange={handleYearsChange}
            />
            <FormInput label="Website" name="website" type="url" value={profileForm.website || ''} onChange={handleInputChange} />
            <FormInput label="LinkedIn Profile" name="linkedIn" type="url" value={profileForm.linkedIn || ''} onChange={handleInputChange} />
          </div>

          <div className="mt-6 space-y-4">
            <FormTextarea
              label="Company Bio"
              name="companyBio"
              value={profileForm.companyBio || ''}
              onChange={handleInputChange}
              rows={4}
            />
            <div>
              <Label className="mb-2 block">Industry Tags</Label>
              <input
                type="text"
                value={profileForm.industryTags?.join(', ') || ''}
                onChange={(e) => handleArrayChange('industryTags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Manufacturing, Retail"
              />
            </div>
            <div>
              <Label className="mb-2 block">Key Products</Label>
              <input
                type="text"
                value={profileForm.keyProducts?.join(', ') || ''}
                onChange={(e) => handleArrayChange('keyProducts', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Gears, Sensors"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
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
              label="Street"
              name="street"
              value={profileForm.address.street}
              onChange={handleAddressChange}
              className="md:col-span-2"
            />
            <FormInput label="City" name="city" value={profileForm.address.city} onChange={handleAddressChange} />
            <FormInput label="State" name="state" value={profileForm.address.state} onChange={handleAddressChange} />
            <FormInput label="ZIP" name="zipCode" value={profileForm.address.zipCode} onChange={handleAddressChange} />
            <FormInput label="Country" name="country" value={profileForm.address.country} onChange={handleAddressChange} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4 border-t pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
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
