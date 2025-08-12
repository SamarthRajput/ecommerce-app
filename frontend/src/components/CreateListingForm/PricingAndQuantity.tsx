// components/form-steps/PricingQuantityStep.tsx
import React from 'react';
import { Controller, Control, FieldErrors, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductFormData, CURRENCIES } from '@/lib/types/listing'
import { UnitMasterDataTypes } from '@/src/types/masterdata';

interface PricingQuantityStepProps {
    control: Control<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    unit: UnitMasterDataTypes[] | null;
}

export default function PricingQuantityStep({ control, errors, unit }: PricingQuantityStepProps) {
    const quantity = useWatch({ control, name: "quantity" });
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="price">Price per Unit *</Label>
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                step="0.5"
                                min="0"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                className={errors.price ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.price && (
                        <p className="text-sm text-red-500">{errors.price.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || 'INR'}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CURRENCIES.map(currency => (
                                        <SelectItem key={currency.value} value={currency.value}>
                                            {currency.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Available *</Label>
                    <Controller
                        name="quantity"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                min="1"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className={errors.quantity ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.quantity && (
                        <p className="text-sm text-red-500">{errors.quantity.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Controller
                        name="unitId"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                <SelectTrigger className={errors.unitId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unit && unit.map(unit => (
                                        <SelectItem key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.unitId && (
                        <p className="text-sm text-red-500">{errors.unitId.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="minimumOrderQuantity">Minimum Order Quantity *</Label>
                    <Controller
                        name="minimumOrderQuantity"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                max={quantity}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className={errors.minimumOrderQuantity ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.minimumOrderQuantity && (
                        <p className="text-sm text-red-500">{errors.minimumOrderQuantity.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
