// components/dashboard/ProfileDashboard.tsx
import React from 'react';
import { Edit3, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import the separated components
import {
    ProfileHeader,
    BasicInfoSection,
    BusinessInfoSection,
    AddressSection,
    AccountInfoSection
} from './ProfileComponent';
import { ProfileEditForm } from './ProfileEditForm';
import { ProfileProps } from '@/lib/types/profile';

const ProfileDashboard: React.FC<ProfileProps> = ({
    seller,
    isEditing,
    setIsEditing,
    profileForm,
    setProfileForm,
    handleUpdateProfile,
    loading,
    error
}) => {
    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form to original seller data
        if (seller) {
            setProfileForm(seller);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card className="overflow-hidden">
                <ProfileHeader seller={seller} />

                {/* Edit Toggle Section */}
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                            <p className="text-gray-600 text-sm mt-1">
                                {isEditing
                                    ? 'Update your profile information below'
                                    : 'Manage your personal and business information'
                                }
                            </p>
                        </div>

                        {!isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                                className="flex items-center space-x-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Error/Success Message */}
            {error && (
                <Alert className={
                    error.includes('successfully') || error.includes('updated')
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                }>
                    {error.includes('successfully') || error.includes('updated') ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={
                        error.includes('successfully') || error.includes('updated')
                            ? 'text-green-700'
                            : 'text-red-700'
                    }>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content */}
            {isEditing ? (
                /* Edit Mode */
                <ProfileEditForm
                    profileForm={profileForm}
                    setProfileForm={setProfileForm}
                    handleUpdateProfile={handleUpdateProfile}
                    loading={loading}
                    onCancel={handleCancelEdit}
                />
            ) : (
                /* View Mode */
                <div className="space-y-6">
                    {/* Basic Information */}
                    <BasicInfoSection seller={seller} />

                    {/* Business Information */}
                    <BusinessInfoSection seller={seller} />

                    {/* Address Information */}
                    <AddressSection seller={seller} />

                    {/* Account Information */}
                    <AccountInfoSection seller={seller} />

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center justify-center space-x-2 h-12"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </Button>

                                {!seller?.isEmailVerified && (
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center space-x-2 h-12"
                                        onClick={() => {
                                            // Add email verification logic here
                                            console.log('Verify email clicked');
                                        }}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Verify Email</span>
                                    </Button>
                                )}

                                {!seller?.isPhoneVerified && (
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center space-x-2 h-12"
                                        onClick={() => {
                                            // Add phone verification logic here
                                            console.log('Verify phone clicked');
                                        }}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Verify Phone</span>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

// Export the main profile component
export const renderProfile = (props: ProfileProps) => <ProfileDashboard {...props} />;

export default ProfileDashboard;