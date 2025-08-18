// components/form-steps/LogisticsValidityStep.tsx
import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductFormData, COUNTRIES } from '@/lib/types/listing'

interface LogisticsValidityStepProps {
    control: Control<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
}

export default function LogisticsValidityStep({ control, errors }: LogisticsValidityStepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="deliveryTimeInDays">Delivery Time (Days) *</Label>
                    <Controller
                        name="deliveryTimeInDays"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                min="1"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className={errors.deliveryTimeInDays ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.deliveryTimeInDays && (
                        <p className="text-sm text-red-500">{errors.deliveryTimeInDays.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logisticsSupport">Logistics Support *</Label>
                    <Controller
                        name="logisticsSupport"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || 'BOTH'}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SELLER">Seller</SelectItem>
                                    <SelectItem value="INTERLINK">Interlink</SelectItem>
                                    <SelectItem value="BUYER">Buyer</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* <div className="space-y-2">
                    <Label htmlFor="countryOfSource">Country of Source *</Label>
                    <Controller
                        name="countryOfSource"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                <SelectTrigger className={errors.countryOfSource ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COUNTRIES.map(country => (
                                        <SelectItem key={country} value={country}>
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.countryOfSource && (
                        <p className="text-sm text-red-500">{errors.countryOfSource.message}</p>
                    )}
                </div> */}

                <div className="space-y-2">
                    <Label htmlFor="validityPeriod">Validity Period (Days) *</Label>
                    <Controller
                        name="validityPeriod"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                min="1"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className={errors.validityPeriod ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.validityPeriod && (
                        <p className="text-sm text-red-500">{errors.validityPeriod.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
