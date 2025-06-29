import { useRouter } from 'next/navigation';
import React from 'react';
import {
    FaEdit,
    FaArchive,
    FaToggleOn,
    FaToggleOff,
    FaPlus,
    FaEye
} from 'react-icons/fa';

interface Listing {
    id: string;
    productName: string;
    name: string;
    description: string;
    listingType: string;
    industry: string;
    condition: string;
    productCode: string;
    model: string;
    specifications: string;
    hsnCode: string;
    countryOfSource: string;
    validityPeriod: string;
    images: string[];
    price: number;
    quantity: number;
    category: string;
    status: 'active' | 'inactive' | 'archived';
    createdAt: string;
    updatedAt?: string;
}

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const API_BASE_URL = `${API_BACKEND_URL}/seller`;

const Listing: React.FC = () => {
    const [listings, setListings] = React.useState<Listing[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedListing, setSelectedListing] = React.useState<Listing | null>(null);
    const [seeInDetailModal, setSeeInDetailModal] = React.useState<boolean>(false);

    const router = useRouter();

    React.useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/listings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }
            const data = await response.json();
            setListings(data.listings);
        }
        catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const editListing = async (listingId: string, updatedData: Partial<Listing>) => {
        const response = await fetch(`${API_BASE_URL}/edit-listing/${listingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to edit listing');
        }
        const data = await response.json();
        setListings(prevListings => prevListings.map(listing => listing.id === listingId ? data.listing : listing));
    };

    const handleSeeDetails = (listing: Listing) => {
        setSelectedListing(listing);
        setSeeInDetailModal(true);
    };

    const closeDetailModal = () => {
        setSeeInDetailModal(false);
        setSelectedListing(null);
    };

    // Toggle listing status (deactivate/activate/archive)
    const toggleListingStatus = async (listingId: string, action: 'deactivate' | 'activate' | 'archive') => {
        try {
            const response = await fetch(`${API_BASE_URL}/toggle-listing-status/${listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ listingId, action }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to toggle listing status');
            }
            setListings(prevListings => prevListings.map(listing => listing.id === listingId ? { ...listing, status: data.status } : listing));
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Modal for detailed view and edit
    const DetailedViewModal: React.FC<{
        listing: Listing;
        onClose: () => void;
        onSubmit: (updated: Partial<Listing>) => Promise<void>;
    }> = ({ listing, onClose, onSubmit }) => {
        const [isEdit, setIsEdit] = React.useState(false);
        const [form, setForm] = React.useState<Partial<Listing>>({ ...listing });
        const [submitError, setSubmitError] = React.useState<string | null>(null);
        const [submitting, setSubmitting] = React.useState(false);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setForm(prev => ({ ...prev, [name]: value }));          
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setSubmitting(true);
            setSubmitError(null);
            try {
                await onSubmit(form);
                setIsEdit(false);
            } catch (err: any) {
                setSubmitError(err.message || "Failed to update listing");
            } finally {
                setSubmitting(false);
            }
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
                    <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <div className="flex gap-6">
                        <div className="w-1/3">
                            {listing.images && listing.images.length > 0 ? (
                                <img
                                    src={listing.images[0]}
                                    alt={listing.name}
                                    className="rounded-lg object-cover w-full h-40"
                                />
                            ) : (
                                <div className="bg-gray-100 rounded-lg flex items-center justify-center h-40 text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="w-2/3">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold">{isEdit ? "Edit Listing" : listing.name}</h3>
                                {!isEdit && (
                                    <button
                                        className="text-blue-600 hover:underline text-sm"
                                        onClick={() => setIsEdit(true)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            {isEdit ? (
                                <form onSubmit={handleSubmit} className="space-y-2">
                                    <input
                                        className="w-full border rounded px-2 py-1"
                                        name="name"
                                        value={form.name || ""}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        required
                                    />
                                    <textarea
                                        className="w-full border rounded px-2 py-1"
                                        name="description"
                                        value={form.description || ""}
                                        onChange={handleChange}
                                        placeholder="Description"
                                    />
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="listingType"
                                            value={form.listingType || ""}
                                            onChange={handleChange}
                                            placeholder="Type"
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="industry"
                                            value={form.industry || ""}
                                            onChange={handleChange}
                                            placeholder="Industry"
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="condition"
                                            value={form.condition || ""}
                                            onChange={handleChange}
                                            placeholder="Condition"
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="productCode"
                                            value={form.productCode || ""}
                                            onChange={handleChange}
                                            placeholder="Product Code"
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="model"
                                            value={form.model || ""}
                                            onChange={handleChange}
                                            placeholder="Model"
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="hsnCode"
                                            value={form.hsnCode || ""}
                                            onChange={handleChange}
                                            placeholder="HSN Code"
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="countryOfSource"
                                            value={form.countryOfSource || ""}
                                            onChange={handleChange}
                                            placeholder="Country"
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="validityPeriod"
                                            value={form.validityPeriod || ""}
                                            onChange={handleChange}
                                            placeholder="Validity"
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="category"
                                            value={form.category || ""}
                                            onChange={handleChange}
                                            placeholder="Category"
                                        />
                                        <input
                                            className="border rounded px-2 py-1"
                                            name="specifications"
                                            value={form.specifications || ""}
                                            onChange={handleChange}
                                            placeholder="Specifications"
                                        />
                                    </div>
                                    <div className="flex gap-4 mt-2">
                                        <input
                                            className="border rounded px-2 py-1 w-24"
                                            name="price"
                                            type="number"
                                            value={form.price ?? ""}
                                            onChange={handleChange}
                                            placeholder="Price"
                                            min={0}
                                        />
                                        <input
                                            className="border rounded px-2 py-1 w-20"
                                            name="quantity"
                                            type="number"
                                            value={form.quantity ?? ""}
                                            onChange={handleChange}
                                            placeholder="Qty"
                                            min={0}
                                        />
                                    </div>
                                    {submitError && (
                                        <div className="text-red-600 text-sm">{submitError}</div>
                                    )}
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                                            disabled={submitting}
                                        >
                                            {submitting ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded"
                                            onClick={() => {
                                                setIsEdit(false);
                                                setForm({ ...listing });
                                                setSubmitError(null);
                                            }}
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p className="mb-1 text-gray-600">{listing.description}</p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                                        <div>
                                            <span className="font-semibold">Type:</span> {listing.listingType}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Industry:</span> {listing.industry}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Condition:</span> {listing.condition}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Product Code:</span> {listing.productCode}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Model:</span> {listing.model}
                                        </div>
                                        <div>
                                            <span className="font-semibold">HSN Code:</span> {listing.hsnCode}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Country:</span> {listing.countryOfSource}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Validity:</span> {listing.validityPeriod}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Category:</span> {listing.category}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Specifications:</span> {listing.specifications}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-4">
                                        <span className="text-lg font-semibold text-green-600">${listing.price}</span>
                                        <span className="text-sm text-gray-700">Qty: {listing.quantity}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${listing.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : listing.status === 'inactive'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`
                                        }>
                                            {listing.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400">
                                        Created: {new Date(listing.createdAt).toLocaleString()}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <section className="seller-listings">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">My Listings</h2>
                    <button
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition"
                        onClick={() => router.push('/seller/create-listing')}
                    >
                        <FaPlus /> Create New Listing
                    </button>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-40">
                        <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-3"></span>
                        <span className="text-gray-700 text-lg">Loading listings...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
                        Error: {error}
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center">
                        <p className="mb-4 text-gray-600 text-lg">No listings available.</p>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow"
                            onClick={() => router.push('/seller/create-listing')}
                        >
                            <FaPlus className="inline mr-2" /> Create New Listing
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow rounded-lg">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 border-b text-left">Image</th>
                                    <th className="py-3 px-4 border-b text-left">Name</th>
                                    <th className="py-3 px-4 border-b text-left">Price</th>
                                    <th className="py-3 px-4 border-b text-left">Quantity</th>
                                    <th className="py-3 px-4 border-b text-left">Category</th>
                                    <th className="py-3 px-4 border-b text-left">Status</th>
                                    <th className="py-3 px-4 border-b text-left">Created</th>
                                    <th className="py-3 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map(listing => (
                                    <tr key={listing.id} className="hover:bg-gray-50 transition">
                                        <td className="py-2 px-4 border-b">
                                            {listing.images && listing.images.length > 0 ? (
                                                <img
                                                    src={listing.images[0]}
                                                    alt={listing.name}
                                                    className="w-14 h-14 object-cover rounded-md border"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                                                    <FaArchive size={24} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b font-medium text-gray-800">{listing.productName}</td>
                                        <td className="py-2 px-4 border-b text-green-700 font-semibold">${listing.price}</td>
                                        <td className="py-2 px-4 border-b">{listing.quantity}</td>
                                        <td className="py-2 px-4 border-b">{listing.category}</td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold
                                                ${listing.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : listing.status === 'inactive'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`
                                            }>
                                                {listing.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b text-gray-500">{new Date(listing.createdAt).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b">
                                            <div className="flex gap-2">
                                                <button
                                                    title="See Details"
                                                    className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
                                                    onClick={() => handleSeeDetails(listing)}
                                                >
                                                    <FaEye />
                                                </button>
                                                {listing.status === 'active' ? (
                                                    <button
                                                        title="Deactivate"
                                                        className="p-2 rounded hover:bg-yellow-100 text-yellow-600 transition"
                                                        onClick={() => toggleListingStatus(listing.id, 'deactivate')}
                                                    >
                                                        <FaToggleOff />
                                                    </button>
                                                ) : (
                                                    <button
                                                        title="Activate"
                                                        className="p-2 rounded hover:bg-green-100 text-green-600 transition"
                                                        onClick={() => toggleListingStatus(listing.id, 'activate')}
                                                    >
                                                        <FaToggleOn />
                                                    </button>
                                                )}
                                                <button
                                                    title="Archive"
                                                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition"
                                                    onClick={() => toggleListingStatus(listing.id, 'archive')}
                                                >
                                                    <FaArchive />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {seeInDetailModal && selectedListing && (
                    <DetailedViewModal
                        listing={selectedListing}
                        onClose={closeDetailModal}
                        onSubmit={async (updated) => {
                            await editListing(selectedListing.id, updated);
                            await fetchListings();
                        }}
                    />
                )}
            </section>
        </div>
    );
};

export default Listing;
