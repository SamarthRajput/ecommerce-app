// components/form-steps/ProductDetailsStep.tsx
import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProductFormData } from '@/lib/types/listing';

interface ProductDetailsStepProps {
    control: Control<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
}

export default function ProductDetailsStep({ control, errors }: ProductDetailsStepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HSN Code */}
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

                {/* Warranty Period */}
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

                {/* Packing Description */}
                <div className="space-y-2">
                    <Label htmlFor="packingDescription">Packing Description *</Label>
                    <Controller
                        name="packingDescription"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="e.g., Box, Pallet, Bag"
                                className={errors.packingDescription ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.packingDescription && (
                        <p className="text-sm text-red-500">{errors.packingDescription.message}</p>
                    )}
                </div>

                {/* Primary Packing */}
                <div className="space-y-2">
                    <Label htmlFor="primaryPacking">Primary Packing *</Label>
                    <Controller
                        name="primaryPacking"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="e.g., Box, Bottle"
                                className={errors.primaryPacking ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.primaryPacking && (
                        <p className="text-sm text-red-500">{errors.primaryPacking.message}</p>
                    )}
                </div>

                {/* Secondary Packing */}
                <div className="space-y-2">
                    <Label htmlFor="secondaryPacking">Secondary Packing *</Label>
                    <Controller
                        name="secondaryPacking"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="e.g., Carton, Crate"
                                className={errors.secondaryPacking ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.secondaryPacking && (
                        <p className="text-sm text-red-500">{errors.secondaryPacking.message}</p>
                    )}
                </div>
            </div>

            {/* Specifications */}
            <div className="space-y-2">
                <Label htmlFor="specifications">Specifications *</Label>
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
