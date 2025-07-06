
// components/form-steps/ProductDetailsStep.tsx
import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProductFormData } from '@/src/lib/types/listing'

interface ProductDetailsStepProps {
    control: Control<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
}

export default function ProductDetailsStep({ control, errors }: ProductDetailsStepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="hsnCode">HSN Code *</Label>
                    <Controller
                        name="hsnCode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter HSN code"
                                className={errors.hsnCode ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.hsnCode && (
                        <p className="text-sm text-red-500">{errors.hsnCode.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="warrantyPeriod">Warranty Period</Label>
                    <Controller
                        name="warrantyPeriod"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="e.g., 12 months, 2 years"
                            />
                        )}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="specifications">Specifications</Label>
                <Controller
                    name="specifications"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            placeholder="Enter detailed specifications"
                            rows={4}
                        />
                    )}
                />
            </div>
        </div>
    );
}
