
// components/form-steps/ReviewSubmitStep.tsx
import React from 'react';
import { Controller, Control, FieldErrors, UseFormGetValues } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProductFormData } from '@/lib/types/listing'

interface ReviewSubmitStepProps {
    control: Control<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    getValues: UseFormGetValues<ProductFormData>;
    imageFiles: File[];
    mode: 'create' | 'edit';
}

export default function ReviewSubmitStep({
    control,
    errors,
    getValues,
    imageFiles,
    mode
}: ReviewSubmitStepProps) {
    const formData = getValues();

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Product Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Product Name:</span> {formData.name || 'Not specified'}
                    </div>
                    <div>
                        <span className="font-medium">Category:</span> {formData.category || 'Not specified'}
                    </div>
                    <div>
                        <span className="font-medium">Price:</span> {formData.currency} {formData.price || 0}
                    </div>
                    <div>
                        <span className="font-medium">Quantity:</span> {formData.quantity || 0}
                    </div>
                    <div>
                        <span className="font-medium">Delivery Time:</span> {formData.deliveryTimeInDays || 0} days
                    </div>
                    <div>
                        <span className="font-medium">Images:</span> {imageFiles.length} uploaded
                    </div>
                </div>
            </div>

            {/* {mode === 'create' && (
                <div className="space-y-4">
                    <Controller
                        name="agreedToTerms"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={field.value || false}
                                    onCheckedChange={field.onChange}
                                />
                                <Label
                                    htmlFor="terms"
                                    className="text-sm leading-5 cursor-pointer"
                                >
                                    I agree to the{' '}
                                    <a href="#" className="text-blue-600 hover:underline">
                                        Terms and Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-blue-600 hover:underline">
                                        Privacy Policy
                                    </a>
                                </Label>
                            </div>
                        )}
                    />
                    {errors.agreedToTerms && (
                        <p className="text-sm text-red-500">{errors.agreedToTerms.message}</p>
                    )}
                </div>
            )} */}

            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {mode === 'create'
                        ? "Your product will be reviewed by our admin team before going live. You'll receive a notification once it's approved."
                        : "Your changes will be saved and the product will be updated immediately."
                    }
                </AlertDescription>
            </Alert>
        </div>
    );
}