import React from 'react';
import { Edit3, User, Building, Phone, FileText, MapPin } from 'lucide-react';
import { Seller } from '@/src/lib/types/listing';

const renderProfile = ({ seller, isEditing, setIsEditing, profileForm, setProfileForm, handleUpdateProfile, loading, error }: {
    seller: Seller | null;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    profileForm: any;
    setProfileForm: React.Dispatch<React.SetStateAction<any>>;
    handleUpdateProfile: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    loading: boolean;
    error: string;
}) => (
    <div className="bg-white shadow rounded-lg" >
        <div className="px-6 py-4 border-b border-gray-200" >
            <div className="flex justify-between items-center" >
                <h2 className="text-lg font-medium text-gray-900" > Profile Information </h2>
                < button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                >
                    <Edit3 size={16} className="mr-1" />
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>
        </div>

        {
            error && (
                <div className={
                    `mx-6 mt-4 px-4 py-3 rounded-lg ${error.includes('successfully')
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`
                }>
                    {error}
                </div>
            )
        }

        <div className="px-6 py-4" >
            {
                isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6" >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" > First Name </label>
                                < input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.firstName}
                                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                />
                            </div>

                            < div >
                                <label className="block text-sm font-medium text-gray-700 mb-2" > Last Name </label>
                                < input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.lastName}
                                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                />
                            </div>

                            < div >
                                <label className="block text-sm font-medium text-gray-700 mb-2" > Business Name </label>
                                < input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.businessName}
                                    onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                                />
                            </div>

                            < div >
                                <label className="block text-sm font-medium text-gray-700 mb-2" > Business Type </label>
                                < input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.businessType}
                                    onChange={(e) => setProfileForm({ ...profileForm, businessType: e.target.value })}
                                />
                            </div>

                            < div >
                                <label className="block text-sm font-medium text-gray-700 mb-2" > Phone </label>
                                < input
                                    type="tel"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                />
                            </div>

                            < div >
                                <label className="block text-sm font-medium text-gray-700 mb-2" > Tax ID </label>
                                < input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={profileForm.taxId}
                                    onChange={(e) => setProfileForm({ ...profileForm, taxId: e.target.value })}
                                />
                            </div>
                        </div>

                        < div className="space-y-4" >
                            <h3 className="text-lg font-medium text-gray-800" > Address </h3>
                            < div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                                <div className="md:col-span-2" >
                                    <label className="block text-sm font-medium text-gray-700 mb-2" > Street </label>
                                    < input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={profileForm.address.street}
                                        onChange={(e) => setProfileForm({
                                            ...profileForm,
                                            address: { ...profileForm.address, street: e.target.value }
                                        })}
                                    />
                                </div>

                                < div >
                                    <label className="block text-sm font-medium text-gray-700 mb-2" > City </label>
                                    < input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={profileForm.address.city}
                                        onChange={(e) => setProfileForm({
                                            ...profileForm,
                                            address: { ...profileForm.address, city: e.target.value }
                                        })}
                                    />
                                </div>

                                < div >
                                    <label className="block text-sm font-medium text-gray-700 mb-2" > State </label>
                                    < input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={profileForm.address.state}
                                        onChange={(e) => setProfileForm({
                                            ...profileForm,
                                            address: { ...profileForm.address, state: e.target.value }
                                        })}
                                    />
                                </div>

                                < div >
                                    <label className="block text-sm font-medium text-gray-700 mb-2" > Zip Code </label>
                                    < input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={profileForm.address.zipCode}
                                        onChange={(e) => setProfileForm({
                                            ...profileForm,
                                            address: { ...profileForm.address, zipCode: e.target.value }
                                        })}
                                    />
                                </div>

                                < div >
                                    <label className="block text-sm font-medium text-gray-700 mb-2" > Country </label>
                                    < input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={profileForm.address.country}
                                        onChange={(e) => setProfileForm({
                                            ...profileForm,
                                            address: { ...profileForm.address, country: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        < div className="flex justify-end space-x-3" >
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            < button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6" >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                            <div className="flex items-center" >
                                <User className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500" > Name </p>
                                    < p className="font-medium" > {seller?.firstName} {seller?.lastName} </p>
                                </div>
                            </div>

                            < div className="flex items-center" >
                                <Building className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500" > Business Name </p>
                                    < p className="font-medium" > {seller?.businessName} </p>
                                </div>
                            </div>

                            < div className="flex items-center" >
                                <Building className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500" > Business Type </p>
                                    < p className="font-medium" > {seller?.businessType} </p>
                                </div>
                            </div>

                            < div className="flex items-center" >
                                <Phone className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500" > Phone </p>
                                    < p className="font-medium" > {seller?.phone} </p>
                                </div>
                            </div>

                            < div className="flex items-center" >
                                <FileText className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500" > Tax ID </p>
                                    < p className="font-medium" > {seller?.taxId} </p>
                                </div>
                            </div>

                            < div className="flex items-center" >
                                <User className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500" > Email </p>
                                    < p className="font-medium" > {seller?.email} </p>
                                </div>
                            </div>
                        </div>

                        < div className="border-t pt-6" >
                            <div className="flex items-start" >
                                <MapPin className="text-gray-400 mr-3 mt-1" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500" > Address </p>
                                    < p className="font-medium" >
                                        {seller?.address?.street} < br />
                                        {seller?.address?.city}, {seller?.address?.state} {seller?.address?.zipCode} <br />
                                        {seller?.address?.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {
                            seller?.createdAt && (
                                <div className="border-t pt-6" >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                                        <div>
                                            <p className="text-sm text-gray-500" > Account Created </p>
                                            < p className="font-medium" > {new Date(seller.createdAt).toLocaleDateString()} </p>
                                        </div>
                                        < div >
                                            <p className="text-sm text-gray-500" > Last Updated </p>
                                            < p className="font-medium" > {new Date(seller.updatedAt ?? '').toLocaleDateString()} </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )}
        </div>
    </div>
);

export { renderProfile };