// components/SellerDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SellerProfile } from '@/src/lib/types/seller';
interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'listings'>('overview');
    const [seller, setSeller] = useState<SellerProfile | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const mockSeller: SellerProfile = {
            id: '1',
            email: 'seller@example.com',
            profile: {
                firstName: 'Rohit',
                lastName: 'Kumar',
                businessName: 'Electronics ki dukaan',
                businessType: 'company',
                phone: '+916392177974',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                },
                taxId: 'TAX123456'
            }
        };

        const mockListings: Listing[] = [
            {
                id: '1',
                title: 'iPhone 15 Pro Max',
                description: 'Brand new iPhone 15 Pro Max',
                price: 1099,
                category: 'Electronics',
                status: 'active',
                createdAt: '2024-01-15'
            },
            {
                id: '2',
                title: 'MacBook Air M2',
                description: 'Excellent condition MacBook Air',
                price: 999,
                category: 'Electronics',
                status: 'inactive',
                createdAt: '2024-01-10'
            }
        ];

        setSeller(mockSeller);
        setListings(mockListings);
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sellerToken');
        router.push('/seller/signin');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Seller Dashboard
                            </h1>
                            <p className="text-sm text-gray-600">
                                Welcome, {seller?.profile.firstName}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'profile', label: 'Profile' },
                            { id: 'listings', label: 'Listings' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'overview' | 'profile' | 'listings')}
                                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <OverviewTab seller={seller} listings={listings} />
                )}
                {activeTab === 'profile' && (
                    <ProfileTab seller={seller} />
                )}
                {activeTab === 'listings' && (
                    <ListingsTab listings={listings} setListings={setListings} />
                )}
            </div>
        </div>
    );
};

// Overview Tab Component
const OverviewTab = ({ seller, listings }: { seller: SellerProfile | null; listings: Listing[] }) => {
    const activeListings = listings.filter(l => l.status === 'active').length;
    const totalListings = listings.length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Total Listings</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{totalListings}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{activeListings}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Business Name</h3>
                <p className="text-lg font-semibold text-gray-700 mt-2">{seller?.profile.businessName}</p>
            </div>

            <div className="md:col-span-3 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Listings</h3>
                {listings.length === 0 ? (
                    <p className="text-gray-500">No listings yet. Create your first listing!</p>
                ) : (
                    <div className="space-y-3">
                        {listings.slice(0, 3).map((listing) => (
                            <div key={listing.id} className="flex justify-between items-center p-3 border rounded">
                                <div>
                                    <h4 className="font-medium">{listing.title}</h4>
                                    <p className="text-sm text-gray-500">${listing.price}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${listing.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {listing.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Profile Tab Component
const ProfileTab = ({ seller }: { seller: SellerProfile | null }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<SellerProfile['profile']>(
        seller?.profile ?? {
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
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...((prev[parent as keyof typeof prev] as object) || {}),
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        
        
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    if (!seller) return null;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`px-4 py-2 rounded-md ${isEditing
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                    <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    >
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                        <option value="partnership">Partnership</option>
                        <option value="llc">LLC</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                    <input
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                        type="text"
                        name="address.street"
                        value={formData.address?.street}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                        type="text"
                        name="address.city"
                        value={formData.address?.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                        type="text"
                        name="address.state"
                        value={formData.address?.state}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                </div>
            </div>

            {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

// Listings Tab Component
const ListingsTab = ({ listings, setListings }: { listings: Listing[]; setListings: (listings: Listing[]) => void }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newListing, setNewListing] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Electronics'
    });

    const handleCreateListing = async (e: React.FormEvent) => {
        e.preventDefault();

        const listing: Listing = {
            id: Date.now().toString(),
            title: newListing.title,
            description: newListing.description,
            price: parseFloat(newListing.price),
            category: newListing.category,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
        };

        setListings([...listings, listing]);
        setNewListing({ title: '', description: '', price: '', category: 'Electronics' });
        setShowCreateForm(false);
        alert('Listing created successfully!');
    };

    const toggleListingStatus = (id: string) => {
        setListings(listings.map(listing =>
            listing.id === id
                ? { ...listing, status: listing.status === 'active' ? 'inactive' : 'active' }
                : listing
        ));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Your Listings</h3>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Create New Listing
                </button>
            </div>

            {/* Create Listing Form */}
            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h4 className="text-lg font-medium mb-4">Create New Listing</h4>
                    <form onSubmit={handleCreateListing} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newListing.title}
                                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    value={newListing.price}
                                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={newListing.category}
                                onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home">Home & Garden</option>
                                <option value="Books">Books</option>
                                <option value="Sports">Sports</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={3}
                                value={newListing.description}
                                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Create Listing
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Listings Grid */}
            {listings.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No listings yet. Create your first listing!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <div key={listing.id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-lg">{listing.title}</h4>
                                <span className={`px-2 py-1 rounded text-xs ${listing.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {listing.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{listing.description}</p>
                            <p className="text-xl font-bold text-blue-600 mb-2">${listing.price}</p>
                            <p className="text-sm text-gray-500 mb-4">Category: {listing.category}</p>
                            <button
                                onClick={() => toggleListingStatus(listing.id)}
                                className={`w-full py-2 rounded-md text-sm font-medium ${listing.status === 'active'
                                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                    }`}
                            >
                                {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;