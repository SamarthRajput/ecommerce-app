import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, X, Loader2 } from 'lucide-react';
import { Section3Props } from '@/src/lib/types/seller/signup';

const Section3 = ({ formData, errors, handleInputChange, handleFileUpload }: Section3Props) => {
    const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: boolean}>({});

    const handleFileUploadWithLoader = async (field: string, file: File | null) => {
        if (!file) return;
        
        // Set loading state
        setUploadingFiles(prev => ({ ...prev, [field]: true }));
        
        try {
            // Call the original handleFileUpload function
            await handleFileUpload(field, file);
        } catch (error) {
            console.error('File upload error:', error);
        } finally {
            // Remove loading state
            setUploadingFiles(prev => ({ ...prev, [field]: false }));
        }
    };

    const renderFileUpload = (field: string, label: string, accept: string = "*/*") => (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
            <input
                type="file"
                id={field}
                accept={accept}
                onChange={(e) => handleFileUploadWithLoader(field, e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                className="hidden"
                disabled={uploadingFiles[field]}
            />
            <label htmlFor={field} className={`cursor-pointer ${uploadingFiles[field] ? 'pointer-events-none' : ''}`}>
                {uploadingFiles[field] ? (
                    <div className="text-orange-500">
                        <Loader2 className="mx-auto mb-2 animate-spin" size={32} />
                        <p className="font-medium">Uploading...</p>
                        <p className="text-sm">Please wait while we process your file</p>
                    </div>
                ) : (formData as any)[field] ? (
                    <div className="text-green-600">
                        <CheckCircle className="mx-auto mb-2" size={32} />
                        <p className="font-medium">File uploaded successfully</p>
                        <button
                            type="button"
                            onClick={() => handleInputChange(field, null)}
                            className="text-red-500 hover:text-red-700 mt-2"
                        >
                            <X size={16} className="inline mr-1" />
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="text-gray-500">
                        <Upload className="mx-auto mb-2" size={32} />
                        <p className="font-medium">{label}</p>
                        <p className="text-sm">Click to upload or drag and drop</p>
                    </div>
                )}
            </label>
            {errors[field] && <p className="text-red-500 text-sm mt-2">{errors[field]}</p>}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <FileText className="text-orange-500 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Compliance Documents</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-medium text-gray-900 mb-3">Government ID Proof *</h3>
                    {renderFileUpload('govIdUrl', 'Upload Aadhaar/Passport/DL', 'image/*,.pdf')}
                </div>

                <div>
                    <h3 className="font-medium text-gray-900 mb-3">GST Certificate</h3>
                    {renderFileUpload('gstCertUrl', 'Upload GST Certificate', '.pdf,image/*')}
                </div>

                {formData.businessType !== 'individual' && (
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Business Registration *</h3>
                        {renderFileUpload('businessDocUrl', 'Upload Registration Document', '.pdf,image/*')}
                    </div>
                )}

                <div>
                    <h3 className="font-medium text-gray-900 mb-3">Other Licenses (Optional)</h3>
                    {renderFileUpload('otherDocsUrl', 'Upload Additional Documents', '.pdf,image/*')}
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Document Guidelines:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure all documents are clear and readable</li>
                    <li>• Accepted formats: PDF, JPG, PNG (max 5MB each)</li>
                    <li>• Documents should be current and valid</li>
                    <li>• For companies: Registration certificate is mandatory</li>
                </ul>
            </div>
        </div>
    );
}

export default Section3;