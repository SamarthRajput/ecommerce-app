import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Section5Props } from '@/lib/types/seller/signup';

const Section5 = ({ formData, errors, handleInputChange, businessTypeOptions }: Section5Props) => (
    <div className="space-y-6">
        <div className="flex items-center mb-6">
            <CheckCircle className="text-orange-500 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="font-medium text-gray-900">Registration Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="font-medium">Business Name:</span> {formData.businessName}
                </div>
                <div>
                    <span className="font-medium">Email:</span> {formData.email}
                </div>
                <div>
                    <span className="font-medium">Phone:</span> {formData.countryCode} {formData.phone}
                </div>
                <div>
                    <span className="font-medium">Business Type:</span> {
                        businessTypeOptions.find(opt => opt.value === formData.businessType)?.label
                    }
                </div>
                <div>
                    <span className="font-medium">Location:</span> {formData.city}, {formData.state}
                </div>
                <div>
                    <span className="font-medium">Industries:</span> {formData.industryTags.join(', ')}
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <label className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-orange-600 hover:text-orange-500">
                        Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-orange-600 hover:text-orange-500">
                        Privacy Policy
                    </a>
                </span>
            </label>
            {errors.agreedToTerms && <p className="text-red-500 text-sm">{errors.agreedToTerms}</p>}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Your application will be reviewed within 2-3 business days</li>
                    <li>• You'll receive an email confirmation once approved</li>
                    <li>• You can start listing products after approval</li>
                    <li>• Our team may contact you for additional verification</li>
                </ul>
            </div>
        </div>
    </div>
);

export default Section5;