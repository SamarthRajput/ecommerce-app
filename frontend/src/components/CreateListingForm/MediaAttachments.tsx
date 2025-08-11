// components/form-steps/MediaAttachmentsStep.tsx
import React, { useState } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2 } from 'lucide-react';
import { ProductFormData } from '@/lib/types/listing'

interface MediaAttachmentsStepProps {
    control: Control<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    imageFiles: File[];
    imageUrls: string[];
    onFileUpload: (files: FileList | null) => void;
    onRemoveImage: (index: number) => void;
}

export default function MediaAttachmentsStep({
    control,
    errors,
    imageFiles,
    imageUrls,
    onFileUpload,
    onRemoveImage
}: MediaAttachmentsStepProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUploadWithLoader = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setIsUploading(true);

        try {
            await onFileUpload(files);
        } catch (error) {
            console.error('File upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label>Product Images * (Max 5)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                    <input
                        type="file"
                        multiple
                        name="files"
                        accept="image/*"
                        onChange={(e) => handleFileUploadWithLoader(e.target.files)}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="image-upload"
                        className={`cursor-pointer flex flex-col items-center space-y-2 ${isUploading ? 'pointer-events-none' : ''
                            }`}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                                <span className="text-sm text-orange-600 font-medium">
                                    Uploading images...
                                </span>
                                <span className="text-xs text-gray-500">
                                    Please wait while we process your images
                                </span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Click to upload images or drag and drop
                                </span>
                                <span className="text-xs text-gray-500">
                                    PNG, JPG up to 5MB each
                                </span>
                            </>
                        )}
                    </label>
                </div>

                {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    disabled={isUploading}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {errors.images && (
                    <p className="text-sm text-red-500">{errors.images.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="videoUrl">Product Video URL (Optional)</Label>
                <Controller
                    name="videoUrl"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="YouTube or Video URL"
                            className={errors.videoUrl ? 'border-red-500' : ''}
                        />
                    )}
                />
                {errors.videoUrl && (
                    <p className="text-sm text-red-500">{errors.videoUrl.message}</p>
                )}
            </div>
        </div>
    );
}