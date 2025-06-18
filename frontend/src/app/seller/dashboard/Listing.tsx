import { Listing } from '@/src/lib/types/listing';
import React from 'react'
import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

const renderListings = (listings: Listing[], router: ReturnType<typeof useRouter>) => (
    <div className="space-y-6">
        <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">My Listings</h2>
                    <div className="text-sm text-gray-500">
                        {listings.length} listing{listings.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            <div className="px-6 py-4">
                {listings.length === 0 ? (
                    <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You haven't created any product listings yet.
                        </p>
                        <button
                            onClick={() => router.push('/seller/create-listing')}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Create your first listing
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${listing.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800'
                                        : listing.status === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : listing.status === 'APPROVED'
                                                ? 'bg-blue-100 text-blue-800'
                                                : listing.status === 'REJECTED'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {listing.status}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Price:</span>
                                        <span className="font-medium">${listing.price?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Quantity:</span>
                                        <span className="font-medium">{listing.quantity}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Category:</span>
                                        <span className="font-medium">{listing.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                        <p className="text-2xl font-semibold text-gray-900">{listings.length}</p>
                        <p className="text-sm text-gray-500">Total Listings</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                    </div>
                    <div className="ml-4">
                        <p className="text-2xl font-semibold text-gray-900">
                            {listings.filter(l => l.status === 'ACTIVE').length}
                        </p>
                        <p className="text-sm text-gray-500">Active</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                    </div>
                    <div className="ml-4">
                        <p className="text-2xl font-semibold text-gray-900">
                            {listings.filter(l => l.status === 'PENDING').length}
                        </p>
                        <p className="text-sm text-gray-500">Pending</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="ml-4">
                        <p className="text-2xl font-semibold text-gray-900">
                            {listings.filter(l => l.status === 'INACTIVE').length}
                        </p>
                        <p className="text-sm text-gray-500">Inactive</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export {renderListings as default, renderListings};