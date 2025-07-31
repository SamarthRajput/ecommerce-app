import React from 'react';
import { Edit3, User, Phone, MapPin } from 'lucide-react';
import { BuyerDetails } from '@/lib/types/buyer/buyer';

const renderProfile = ({ buyer, isEditing, setIsEditing, profileForm, setProfileForm, handleUpdateProfile, loading, error }: {
    buyer: BuyerDetails | null;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    profileForm: any;
    setProfileForm: React.Dispatch<React.SetStateAction<any>>;
    handleUpdateProfile: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    loading: boolean;
    error: string;
}) => (
    <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                >
                    <Edit3 size={16} className="mr-1" />
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>
        </div>

        {error && (
            <div className={`mx-6 mt-4 px-4 py-3 rounded-lg ${error.includes('successfully')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                {error}
            </div>
        )}

        <div className="px-6 py-4">
            {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={profileForm.firstName || ''}
                                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={profileForm.lastName || ''}
                                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={profileForm.phoneNumber || ''}
                                onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.street || ''}
                                    onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.city || ''}
                                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.state || ''}
                                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.zipCode || ''}
                                    onChange={(e) => setProfileForm({ ...profileForm, zipCode: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.country || ''}
                                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center">
                            <User className="text-gray-400 mr-3" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{buyer?.firstName} {buyer?.lastName}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Phone className="text-gray-400 mr-3" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{buyer?.phoneNumber || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <User className="text-gray-400 mr-3" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{buyer?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex items-start">
                            <MapPin className="text-gray-400 mr-3 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">
                                    {buyer?.street ? (
                                        <>
                                            {buyer.street}<br />
                                            {buyer.city}, {buyer.state} {buyer.zipCode}<br />
                                            {buyer.country}
                                        </>
                                    ) : (
                                        'Address not provided'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);

export { renderProfile };