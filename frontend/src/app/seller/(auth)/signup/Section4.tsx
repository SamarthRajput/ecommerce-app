import React, { useState } from 'react';
import { User, X, Plus, Trash2 } from 'lucide-react';
import { Section4Props } from '@/lib/types/seller/signup';
import { IndustrySelect } from './SelectIndustry';

const Section4 = ({ formData, errors, handleInputChange, industryId, yearsInBusinessOptions }: Section4Props) => {
    const [productInput, setProductInput] = useState('');

    // Handle adding products from comma-separated input
    const handleAddProducts = () => {
        if (!productInput.trim()) return;

        const newProducts = productInput
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0 && !formData.keyProducts.includes(item));

        if (newProducts.length > 0) {
            const updatedProducts = [...formData.keyProducts, ...newProducts];
            handleInputChange('keyProducts', updatedProducts);
        }
        setProductInput('');
    };

    // Handle removing a specific product
    const handleRemoveProduct = (productToRemove: string) => {
        const updatedProducts = formData.keyProducts.filter(product => product !== productToRemove);
        handleInputChange('keyProducts', updatedProducts);
    };

    // Handle removing all products
    const handleRemoveAllProducts = () => {
        handleInputChange('keyProducts', []);
    };

    // Handle Enter key press to add products
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddProducts();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <User className="text-orange-500 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Bio *
                </label>
                <textarea
                    value={formData.companyBio}
                    onChange={(e) => handleInputChange('companyBio', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.companyBio ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="Tell us about your business, mission, and what you offer..."
                    maxLength={1000}
                />
                <div className="flex justify-between mt-1">
                    {errors.companyBio && <p className="text-red-500 text-sm">{errors.companyBio}</p>}
                    <p className="text-gray-500 text-sm">{formData.companyBio.length}/1000</p>
                </div>
            </div>

            <div>
                {/* Pass the selected industry value from formData */}
                <IndustrySelect
                    industryOptions={industryId}
                    value={formData.industryId}
                    onChange={(selected) => handleInputChange('industryId', selected)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years in Business
                </label>
                <select
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                    <option value="">Select years in business</option>
                    {yearsInBusinessOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Products or Services
                </label>

                {/* Input field for adding new products */}
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={productInput}
                        onChange={(e) => setProductInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter products or services (separate multiple with commas)"
                    />
                    <button
                        type="button"
                        onClick={handleAddProducts}
                        disabled={!productInput.trim()}
                        className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add
                    </button>
                </div>

                <p className="text-gray-500 text-sm mb-3">
                    Separate multiple products with commas, then click Add or press Enter
                </p>

                {/* Display added products */}
                {formData.keyProducts.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                                Added Products/Services ({formData.keyProducts.length})
                            </h4>
                            <button
                                type="button"
                                onClick={handleRemoveAllProducts}
                                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                            >
                                <Trash2 size={14} />
                                Remove All
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.keyProducts.map((product, index) => (
                                <div
                                    key={index}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-full text-sm"
                                >
                                    <span>{product}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(product)}
                                        className="text-orange-600 hover:text-orange-800 hover:bg-orange-200 rounded-full p-1"
                                        title="Remove this product"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {formData.keyProducts.length === 0 && (
                    <div className="text-gray-500 text-sm italic p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                        No products or services added yet. Enter them above to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Section4;