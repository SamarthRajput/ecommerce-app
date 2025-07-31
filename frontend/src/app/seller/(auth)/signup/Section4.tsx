import React from 'react'
import { User } from 'lucide-react';
import { Section4Props } from '@/lib/types/seller/signup';

const Section4 = ({ formData, errors, handleInputChange, industryOptions, yearsInBusinessOptions }: Section4Props) => (
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Industries Served *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {industryOptions.map(industry => (
                    <label key={industry} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData.industryTags.includes(industry)}
                            onChange={(e) => {
                                const newTags = e.target.checked
                                    ? [...formData.industryTags, industry]
                                    : formData.industryTags.filter(tag => tag !== industry);
                                handleInputChange('industryTags', newTags);
                            }}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">{industry}</span>
                    </label>
                ))}
            </div>
            {errors.industryTags && <p className="text-red-500 text-sm mt-1">{errors.industryTags}</p>}
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
            <input
                type="text"
                value={formData.keyProducts.join(', ')}
                onChange={(e) => handleArrayInput('keyProducts', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Solar panels, IT services, Machinery (separate with commas)"
            />
            <p className="text-gray-500 text-sm mt-1">Separate multiple products with commas</p>
        </div>
    </div>
);

export default Section4;

// Helper function to handle comma-separated input for array fields
function handleArrayInput(field: string, value: string, handleInputChange?: (field: string, value: any) => void) {
    // Split by comma, trim whitespace, and filter out empty strings
    const arrayValue = value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    if (handleInputChange) {
        handleInputChange(field, arrayValue);
    }
}
