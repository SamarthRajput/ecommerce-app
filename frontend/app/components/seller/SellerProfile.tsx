// components/SellerProfile.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface SellerProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
    businessType: string;
    phone: string;
    address: Address;
    taxId: string;
}

interface ProfileFormData {
    firstName: string;
    lastName: string;
    businessName: string;
    businessType: string;
    phone: string;
    address: Address;
    taxId: string;
}

const SellerProfile = () => {
    const [profile, setProfile] = useState<SellerProfile | null>(null);
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        businessName: '',
        businessType: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        taxId: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    // Get token from localStorage or wherever you store it
    const getToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    };

    // Fetch seller profile data
    useEffect(() => {
        const fetchProfile = async () => {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/api/seller/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setProfile(data.seller);
                setFormData({
                    firstName: data.seller.firstName,
                    lastName: data.seller.lastName,
                    businessName: data.seller.businessName,
                    businessType: data.seller.businessType,
                    phone: data.seller.phone,
                    address: data.seller.address,
                    taxId: data.seller.taxId
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/seller/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setProfile(data.seller);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                businessName: profile.businessName,
                businessType: profile.businessType,
                phone: profile.phone,
                address: profile.address,
                taxId: profile.taxId
            });
        }
        setIsEditing(false);
        setError('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading profile...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">Failed to load profile</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-6 py-4 flex justify-between items-center border-b">
                        <h1 className="text-2xl font-bold text-gray-900">Seller Profile</h1>
                        <div className="flex space-x-4">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Edit Profile
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
                        {success}
                    </div>
                )}

                {/* Profile Form */}
                <div className="bg-white shadow rounded-lg">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                    />
                                </div>
                                <div></div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Business Type</label>
                                    <input
                                        type="text"
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tax ID</label>
                                    <input
                                        type="text"
                                        name="taxId"
                                        value={formData.taxId}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                    <input
                                        type="text"
                                        name="address.street"
                                        value={formData.address.street}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                            }`}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={formData.address.city}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State</label>
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={formData.address.state}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                        <input
                                            type="text"
                                            name="address.zipCode"
                                            value={formData.address.zipCode}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name="address.country"
                                            value={formData.address.country}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;