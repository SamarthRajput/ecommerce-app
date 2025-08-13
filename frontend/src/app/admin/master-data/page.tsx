"use client";
import { showError, showSuccess } from '@/lib/toast';
import { APIURL } from '@/src/config/env';
import { useAuth } from '@/src/context/AuthContext';
import { CategoryMasterDataTypes, IndustryMasterDataTypes, UnitMasterDataTypes } from '@/src/types/masterdata';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const MasterData = () => {
    const [categories, setCategories] = useState<CategoryMasterDataTypes[]>([]);
    const [industries, setIndustries] = useState<IndustryMasterDataTypes[]>([]);
    const [units, setUnits] = useState<UnitMasterDataTypes[]>([]);
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
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<{ id: string; type: 'category' | 'industry' | 'unit'; name: string } | null>(null);

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

    // Fetch master data from backend
    const fetchMasterData = async () => {
        try {
            setLoading(true);
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
            setError(null);
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

    const handleAddMasterData = async () => {
        if (!name.trim()) {
            showError('Name is required');
            return;
        }

        const payload = { name: name.trim(), type, symbol: symbol.trim() };
        setUploading(true);

        try {
            const response = await fetch(`${APIURL}/admin/master-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const error = errorData.error || errorData.message || 'Failed to add master data';
                throw new Error(error);
            }

            const successData = await response.json();
            showSuccess(successData.message || 'Item added successfully');
            setName('');
            setSymbol('');
            await fetchMasterData();
        } catch (error: any) {
            showError(error.message);
            console.error('Error adding master data:', error);
        } finally {
            setUploading(false);
        }
    };

    const openEditModal = (item: CategoryMasterDataTypes | IndustryMasterDataTypes | UnitMasterDataTypes, itemType: 'category' | 'industry' | 'unit') => {
        setEditId(item.id);
        setEditType(itemType);
        setEditName(item.name);
        setEditSymbol(itemType === 'unit' ? (item as UnitMasterDataTypes).symbol || '' : '');
        setEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!editId || !editName.trim()) {
            showError('Name is required');
            return;
        }

        const payload = {
            id: editId,
            name: editName.trim(),
            type: editType,
            symbol: editSymbol.trim()
        };
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
                throw new Error(error);
            }

            const successData = await response.json();
            showSuccess(successData.message || 'Item updated successfully');
            setEditModalOpen(false);
            await fetchMasterData();
        } catch (error: any) {
            showError(error.message);
            console.error('Error editing master data:', error);
        } finally {
            setUploading(false);
        }
    };

    const openDeleteConfirm = (id: string, itemType: 'category' | 'industry' | 'unit', itemName: string) => {
        setDeleteItem({ id, type: itemType, name: itemName });
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteItem) return;
        setUploading(true);
        try {
            if (
                (deleteItem.type === 'unit' && deleteItem.name === 'Peice') ||
                ((deleteItem.type === 'category' || deleteItem.type === 'industry') && deleteItem.name === 'Others')
            ) {
                showError('This item cannot be deleted.');
                setDeleteConfirmOpen(false);
                setDeleteItem(null);
                return;
            }
            const response = await fetch(`${APIURL}/admin/master-data`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type: deleteItem.type, id: deleteItem.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const error = errorData.error || errorData.message || 'Failed to delete master data';
                throw new Error(error);
            }

            const successData = await response.json();
            showSuccess(successData.message || 'Item deleted successfully');
            setDeleteConfirmOpen(false);
            setDeleteItem(null);
            await fetchMasterData();
        } catch (error: any) {
            showError(error.message);
            console.error('Error deleting master data:', error);
        } finally {
            setUploading(false);
            setDeleteConfirmOpen(false)
        }
    };

    const renderDataCard = (
        title: string,
        data: any[],
        colorClass: string,
        itemType: 'category' | 'industry' | 'unit'
    ) => (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${colorClass}`}></span>
                    {title}
                    <span className="ml-auto text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {data.length}
                    </span>
                </h3>
            </div>
            <div className="p-4">
                {data.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No {title.toLowerCase()} found</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {data.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors">
                                <span className="text-gray-900 font-medium">
                                    {item.name}
                                    {itemType === 'unit' && item.symbol && (
                                        <span className="ml-2 text-sm text-gray-500">({item.symbol})</span>
                                    )}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                        onClick={() => openEditModal(item, itemType)}
                                        disabled={uploading}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                        onClick={() => openDeleteConfirm(item.id, itemType, item.name)}
                                        disabled={uploading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading master data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Master Data Management</h1>

                    {/* Breadcrumb */}
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li>
                                <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Admin
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-600">Master Data Management</li>
                        </ol>
                    </nav>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Add Form */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Item</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={uploading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as 'category' | 'industry' | 'unit')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={uploading}
                                >
                                    <option value="category">Category</option>
                                    <option value="industry">Industry</option>
                                    <option value="unit">Unit</option>
                                </select>
                            </div>

                            {type === 'unit' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                                    <input
                                        type="text"
                                        value={symbol}
                                        onChange={(e) => setSymbol(e.target.value)}
                                        placeholder="Optional symbol"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={uploading}
                                    />
                                </div>
                            )}

                            <div className={`flex items-end ${type !== 'unit' ? 'md:col-start-4' : ''}`}>
                                <button
                                    onClick={handleAddMasterData}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
                                    disabled={uploading || !name.trim()}
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Item'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {renderDataCard('Categories', categories, 'bg-blue-500', 'category')}
                    {renderDataCard('Industries', industries, 'bg-green-500', 'industry')}
                    {renderDataCard('Units', units, 'bg-purple-500', 'unit')}
                </div>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Edit {editType.charAt(0).toUpperCase() + editType.slice(1)}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={uploading}
                                    />
                                </div>
                                {editType === 'unit' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                                        <input
                                            type="text"
                                            value={editSymbol}
                                            onChange={(e) => setEditSymbol(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={uploading}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    onClick={() => setEditModalOpen(false)}
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors flex items-center"
                                    onClick={handleEditSubmit}
                                    disabled={uploading || !editName.trim()}
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && deleteItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>"{deleteItem.name}"</strong>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setDeleteConfirmOpen(false);
                                        setDeleteItem(null);
                                    }}
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md font-medium transition-colors flex items-center"
                                    onClick={handleDeleteConfirm}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterData;