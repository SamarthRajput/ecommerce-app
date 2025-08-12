"use client";
import { showError, showSuccess } from '@/lib/toast';
import { APIURL } from '@/src/config/env';
import { useAuth } from '@/src/context/AuthContext';
import { CategoryMasterDataTypes, IndustryMasterDataTypes, UnitMasterDataTypes } from '@/src/types/masterdata';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

// export interface CategoryMasterDataTypes {
//     id: string;
//     name: string;
//     createdAt: string;
//     updatedAt: string;
// }

// export interface IndustryMasterDataTypes {
//     id: string;
//     name: string;
//     createdAt: string;
//     updatedAt: string;
// }

// export interface UnitMasterDataTypes {
//     id: string;
//     name: string;
//     symbol?: string;
//     createdAt: string;
//     updatedAt: string;
// }

const MasterData = () => {
    const [Categories, setCategories] = useState<CategoryMasterDataTypes[]>([]);
    const [Industries, setIndustries] = useState<IndustryMasterDataTypes[]>([]);
    const [Units, setUnits] = useState<UnitMasterDataTypes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<'category' | 'industry' | 'unit'>('category');
    const [symbol, setSymbol] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editType, setEditType] = useState<'category' | 'industry' | 'unit'>('category');
    const [editName, setEditName] = useState<string>('');
    const [editSymbol, setEditSymbol] = useState<string>('');

    const { user, isAdmin, authLoading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (authLoading) return;
        if (!user || !isAdmin) {
            showError('You are not authorized to access this page');
            router.push('/admin/signin');
            return;
        }
    }, [user, isAdmin, authLoading]);

    // Fetch Categories, Industries, and Units from the backend
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const response = await fetch(`${APIURL}/public/master-data`);
                if (!response.ok) {
                    const errorData = await response.json();
                    const error = errorData.error || errorData.message || 'Failed to fetch master data';
                    throw new Error(error);
                }
                const data = await response.json();
                setCategories(data.data.categories ?? []);
                setIndustries(data.data.industries ?? []);
                setUnits(data.data.units ?? []);
            } catch (error: any) {
                setError(error.message);
                showError(error.message);
                console.error('Error fetching master data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMasterData();
    }, []);

    const handleAddMasterData = async () => {
        const payload = {
            name,
            type,
            symbol
        }
        if (!name || !type) {
            showError('Name and type are required');
            return;
        }
        setUploading(true);
        try {
            const response = await fetch(`${APIURL}/admin/master-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                const error = errorData.error || errorData.message || 'Failed to add master data';
                showError(error);
                throw new Error(error);
            }
            else {
                const successData = await response.json();
                showSuccess(successData.message);
                setName('');
                setSymbol('');
                // Refresh master data
                setLoading(true);
                await fetchMasterData();
            }
        } catch (error: any) {
            setError(error.message);
            showError(error.message);
            console.error('Error adding master data:', error);
        } finally {
            setUploading(false);
        }
    };
    // Open edit modal and set values
    const openEditModal = (item: CategoryMasterDataTypes | IndustryMasterDataTypes | UnitMasterDataTypes, type: 'category' | 'industry' | 'unit') => {
        setEditId(item.id);
        setEditType(type);
        setEditName(item.name);
        setEditSymbol(type === 'unit' ? (item as UnitMasterDataTypes).symbol || '' : '');
        setEditModalOpen(true);
    };

    // Handle edit submit
    const handleEditSubmit = async () => {
        if (!editId) return;
        await handleEditMasterData(editId, editName, editType, editSymbol);
        setEditModalOpen(false);
        // Refresh master data
        setLoading(true);
        await fetchMasterData();
    };

    // Modified handleEditMasterData to accept params
    const handleEditMasterData = async (
        id: string,
        name: string,
        type: 'category' | 'industry' | 'unit',
        symbol: string
    ) => {
        const payload = { name, type, symbol, id };
        if (!name) {
            showError('Name is required');
            return;
        }
        setUploading(true);
        try {
            const response = await fetch(`${APIURL}/admin/master-data`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                const error = errorData.error || errorData.message || 'Failed to edit master data';
                showError(error);
                throw new Error(error);
            } else {
                const successData = await response.json();
                showSuccess(successData.message);
            }
        } catch (error: any) {
            setError(error.message);
            showError(error.message);
            console.error('Error editing master data:', error);
        } finally {
            setUploading(false);
        }
    };

    // Modified handleDeleteMasterData to refresh data
    const handleDeleteMasterData = async (id: string, type: 'category' | 'industry' | 'unit') => {
        setUploading(true);
        try {
            const response = await fetch(`${APIURL}/admin/master-data`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type, id }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                const error = errorData.error || errorData.message || 'Failed to delete master data';
                showError(error);
                throw new Error(error);
            }
            const successData = await response.json();
            showSuccess(successData.message);
            // Refresh master data
            setLoading(true);
            await fetchMasterData();
        } catch (error: any) {
            setError(error.message);
            showError(error.message);
            console.error('Error deleting master data:', error);
        } finally {
            setUploading(false);
        }
    };

    // Move fetchMasterData outside useEffect for reuse
    const fetchMasterData = async () => {
        try {
            const response = await fetch(`${APIURL}/public/master-data`);
            if (!response.ok) {
                const errorData = await response.json();
                const error = errorData.error || errorData.message || 'Failed to fetch master data';
                throw new Error(error);
            }
            const data = await response.json();
            setCategories(data.data.categories ?? []);
            setIndustries(data.data.industries ?? []);
            setUnits(data.data.units ?? []);
        } catch (error: any) {
            setError(error.message);
            showError(error.message);
            console.error('Error fetching master data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMasterData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-lg">Loading master data...</span>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Master Data Management</h1>
            {/* Breadcrumb: /admin/Master Data Management */}
            <nav className="mb-4">
                <ol className="list-reset flex">
                    <li>
                        <Link href="/admin" className="text-blue-500 hover:underline">Admin</Link>
                    </li>
                    <li className="mx-2">/</li>
                    <li>
                        <span className="text-gray-500">Master Data Management</span>
                    </li>
                </ol>
            </nav>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Add Master Data Form */}
            <div className="bg-white shadow rounded p-4 mb-8 flex flex-col md:flex-row items-center gap-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="border p-2 rounded flex-1"
                    required={true}
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'category' | 'industry' | 'unit')}
                    className="border p-2 rounded flex-1"
                >
                    <option value="category">Category</option>
                    <option value="industry">Industry</option>
                    <option value="unit">Unit</option>
                </select>
                {type === 'unit' && (
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="Symbol (optional)"
                        className="border p-2 rounded flex-1"
                    />
                )}
                <button
                    onClick={handleAddMasterData}
                    className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={uploading}
                >
                    {uploading ? (
                        <span className="flex items-center">
                            <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                            Adding...
                        </span>
                    ) : 'Add'}
                </button>
            </div>

            {/* Cards for each master data type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories Card */}
                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        Categories
                    </h2>
                    {Categories.length === 0 ? (
                        <p className="text-gray-500">No categories found.</p>
                    ) : (
                        <ul>
                            {Categories.map(category => (
                                <li key={category.id} className="flex items-center justify-between mb-2 p-2 hover:bg-gray-50 rounded">
                                    <span>{category.name}</span>
                                    <span className="flex gap-2">
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={() => openEditModal(category, 'category')}
                                        >Edit</button>
                                        <button
                                            className="text-red-500 hover:underline"
                                            onClick={() => handleDeleteMasterData(category.id, 'category')}
                                            disabled={uploading}
                                        >Delete</button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Industries Card */}
                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        Industries
                    </h2>
                    {Industries.length === 0 ? (
                        <p className="text-gray-500">No industries found.</p>
                    ) : (
                        <ul>
                            {Industries.map(industry => (
                                <li key={industry.id} className="flex items-center justify-between mb-2 p-2 hover:bg-gray-50 rounded">
                                    <span>{industry.name}</span>
                                    <span className="flex gap-2">
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={() => openEditModal(industry, 'industry')}
                                        >Edit</button>
                                        <button
                                            className="text-red-500 hover:underline"
                                            onClick={() => handleDeleteMasterData(industry.id, 'industry')}
                                            disabled={uploading}
                                        >Delete</button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Units Card */}
                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                        Units
                    </h2>
                    {Units.length === 0 ? (
                        <p className="text-gray-500">No units found.</p>
                    ) : (
                        <ul>
                            {Units.map(unit => (
                                <li key={unit.id} className="flex items-center justify-between mb-2 p-2 hover:bg-gray-50 rounded">
                                    <span>
                                        {unit.name} {unit.symbol ? <span className="text-gray-400">({unit.symbol})</span> : ''}
                                    </span>
                                    <span className="flex gap-2">
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={() => openEditModal(unit, 'unit')}
                                        >Edit</button>
                                        <button
                                            className="text-red-500 hover:underline"
                                            onClick={() => handleDeleteMasterData(unit.id, 'unit')}
                                            disabled={uploading}
                                        >Delete</button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Edit {editType.charAt(0).toUpperCase() + editType.slice(1)}</h3>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="border p-2 rounded w-full mb-2"
                                placeholder="Name"
                            />
                            {editType === 'unit' && (
                                <input
                                    type="text"
                                    value={editSymbol}
                                    onChange={e => setEditSymbol(e.target.value)}
                                    className="border p-2 rounded w-full"
                                    placeholder="Symbol (optional)"
                                />
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setEditModalOpen(false)}
                                disabled={uploading}
                            >Cancel</button>
                            <button
                                className={`px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleEditSubmit}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <span className="flex items-center">
                                        <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                                        Saving...
                                    </span>
                                ) : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MasterData
