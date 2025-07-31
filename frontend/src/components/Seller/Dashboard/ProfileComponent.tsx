// components/profile/ProfileComponents.tsx
import React from 'react';
import { User, Building, Phone, FileText, MapPin, Mail, Calendar, Globe, Briefcase, Star, CheckCircle, AlertCircle, Clock, LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Seller, ProfileFormData } from '@/lib/types/profile';

// Profile Info Item Component
interface ProfileInfoItemProps {
    icon: React.ComponentType<{ className?: string; size?: string | number }>;
    label: string;
    value: string | React.ReactNode;
    className?: string;
}

export const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({
    icon: Icon,
    label,
    value,
    className = ""
}) => (
    <div className={`flex items-start space-x-3 ${className}`}>
        <Icon className="text-gray-400 mt-1 flex-shrink-0" size={20} />
        <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <div className="text-gray-900">
                {typeof value === 'string' ? (
                    <p className="font-medium break-words">{value || 'Not provided'}</p>
                ) : (
                    value
                )}
            </div>
        </div>
    </div>
);

// Profile Header Component
interface ProfileHeaderProps {
    seller: Seller | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ seller }) => (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg p-6 text-white">
        <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
                <h2 className="text-2xl font-bold">
                    {seller?.firstName} {seller?.lastName}
                </h2>
                <p className="text-blue-100 text-lg">
                    {seller?.businessName}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                    {seller?.isApproved ? (
                        <Badge className="bg-green-500 text-white border-0">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approved
                        </Badge>
                    ) : (
                        <Badge className="bg-yellow-500 text-white border-0">
                            <Clock className="w-4 h-4 mr-1" />
                            Pending Approval
                        </Badge>
                    )}

                    {seller?.isEmailVerified && (
                        <Badge className="bg-blue-500 text-white border-0">
                            <Mail className="w-4 h-4 mr-1" />
                            Email Verified
                        </Badge>
                    )}

                    {seller?.avgRating && (
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{seller.avgRating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// Basic Information Section
interface BasicInfoSectionProps {
    seller: Seller | null;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ seller }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Basic Information</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInfoItem
                    icon={User}
                    label="Full Name"
                    value={`${seller?.firstName || ''} ${seller?.lastName || ''}`.trim()}
                />

                <ProfileInfoItem
                    icon={Mail}
                    label="Email Address"
                    value={seller?.email || ''}
                />

                <ProfileInfoItem
                    icon={Phone}
                    label="Phone Number"
                    value={seller?.phone ? `${seller.countryCode || ''} ${seller.phone}` : ''}
                />

                <ProfileInfoItem
                    icon={FileText}
                    label="Tax ID"
                    value={seller?.taxId || ''}
                />

                {seller?.panOrTin && (
                    <ProfileInfoItem
                        icon={FileText}
                        label="PAN/TIN"
                        value={seller.panOrTin}
                    />
                )}

                {seller?.registrationNo && (
                    <ProfileInfoItem
                        icon={FileText}
                        label="Registration Number"
                        value={seller.registrationNo}
                    />
                )}
            </div>
        </CardContent>
    </Card>
);

// Business Information Section
interface BusinessInfoSectionProps {
    seller: Seller | null;
}

export const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ seller }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Business Information</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInfoItem
                    icon={Building}
                    label="Business Name"
                    value={seller?.businessName || ''}
                />

                <ProfileInfoItem
                    icon={Briefcase}
                    label="Business Type"
                    value={seller?.businessType || ''}
                />

                <ProfileInfoItem
                    icon={Calendar}
                    label="Years in Business"
                    value={seller?.yearsInBusiness ? `${seller.yearsInBusiness} years` : ''}
                />

                {seller?.website && (
                    <ProfileInfoItem
                        icon={Globe}
                        label="Website"
                        value={
                            <a
                                href={seller.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                {seller.website}
                            </a>
                        }
                    />
                )}

                {seller?.linkedIn && (
                    <ProfileInfoItem
                        icon={LinkIcon}
                        label="LinkedIn"
                        value={
                            <a
                                href={seller.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                LinkedIn Profile
                            </a>
                        }
                    />
                )}
            </div>

            {seller?.companyBio && (
                <div className="pt-4 border-t">
                    <ProfileInfoItem
                        icon={FileText}
                        label="Company Bio"
                        value={seller.companyBio}
                    />
                </div>
            )}

            {seller?.industryTags && seller.industryTags.length > 0 && (
                <div className="pt-4 border-t">
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">Industry Tags</Label>
                    <div className="flex flex-wrap gap-2">
                        {seller.industryTags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {seller?.keyProducts && seller.keyProducts.length > 0 && (
                <div className="pt-4 border-t">
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">Key Products</Label>
                    <div className="flex flex-wrap gap-2">
                        {seller.keyProducts.map((product, index) => (
                            <Badge key={index} variant="outline">
                                {product}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </CardContent>
    </Card>
);

// Address Section
interface AddressSectionProps {
    seller: Seller | null;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ seller }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Address Information</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {seller?.address ? (
                <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                        {seller.address.street}
                    </p>
                    <p className="text-gray-700">
                        {seller.address.city}, {seller.address.state} {seller.address.zipCode}
                    </p>
                    <p className="text-gray-700">
                        {seller.address.country}
                    </p>
                </div>
            ) : (
                <p className="text-gray-500 italic">No address information provided</p>
            )}
        </CardContent>
    </Card>
);

// Account Information Section
interface AccountInfoSectionProps {
    seller: Seller | null;
}

export const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({ seller }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Account Information</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInfoItem
                    icon={Calendar}
                    label="Account Created"
                    value={seller?.createdAt ? new Date(seller.createdAt).toLocaleDateString() : ''}
                />

                <ProfileInfoItem
                    icon={Calendar}
                    label="Last Updated"
                    value={seller?.updatedAt ? new Date(seller.updatedAt).toLocaleDateString() : ''}
                />

                <div className="flex items-center space-x-3">
                    <Mail className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Email Verification</p>
                        <div className="flex items-center space-x-2">
                            {seller?.isEmailVerified ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-green-600 font-medium">Verified</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                    <span className="text-yellow-600 font-medium">Not Verified</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Phone className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Phone Verification</p>
                        <div className="flex items-center space-x-2">
                            {seller?.isPhoneVerified ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-green-600 font-medium">Verified</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                    <span className="text-yellow-600 font-medium">Not Verified</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {seller?.approvalNote && (
                <div className="pt-4 border-t">
                    <ProfileInfoItem
                        icon={FileText}
                        label="Approval Note"
                        value={seller.approvalNote}
                    />
                </div>
            )}
        </CardContent>
    </Card>
);

// Form Input Component
interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
    className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
    placeholder,
    className = ""
}) => (
    <div className={className}>
        <Label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="w-full"
        />
    </div>
);

// Form Textarea Component
interface FormTextareaProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    placeholder?: string;
    className?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
    label,
    name,
    value,
    onChange,
    rows = 3,
    placeholder,
    className = ""
}) => (
    <div className={className}>
        <Label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </Label>
        <Textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="w-full"
        />
    </div>
);