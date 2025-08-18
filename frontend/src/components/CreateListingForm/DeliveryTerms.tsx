// components/form-steps/DeliveryTermsStep.tsx
import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductFormData, COUNTRIES } from '@/lib/types/listing';

interface DeliveryTermsStepProps {
    control: Control<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
}

export default function DeliveryTermsStep({ control, errors }: DeliveryTermsStepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="deliveryTerm">Delivery Term *</Label>
                    <Controller
                        name="deliveryTerm"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                <SelectTrigger className={errors.deliveryTerm ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select term" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EXW">Ex-Works (Ex Factory)</SelectItem>
                                    <SelectItem value="FOR">FOR (Free on Rail)</SelectItem>
                                    <SelectItem value="FOB">FOB (Free On Board)</SelectItem>
                                    <SelectItem value="CIF">CIF (Cost, Insurance, Freight)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.deliveryTerm && (
                        <p className="text-sm text-red-500">{errors.deliveryTerm.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="City Of Dispatch">City – Warehouse / Factory *</Label>
                    <Controller
                        name="cityOfDispatch"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                className={errors.cityOfDispatch ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.cityOfDispatch && (
                        <p className="text-sm text-red-500">{errors.cityOfDispatch.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="loadPort">Load Port *</Label>
                    <Controller
                        name="loadPort"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                className={errors.loadPort ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.loadPort && (
                        <p className="text-sm text-red-500">{errors.loadPort.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="loadCountry">Load Country *</Label>
                    <Controller
                        name="loadCountry"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                <SelectTrigger className={errors.loadCountry ? 'border-red-500' : ''}>
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
                    {errors.loadCountry && (
                        <p className="text-sm text-red-500">{errors.loadCountry.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
