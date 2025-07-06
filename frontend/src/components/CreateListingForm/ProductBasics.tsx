

// components/form-steps/ProductBasicsStep.tsx
import React, { useEffect } from 'react';
import { Controller, Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductFormData, CATEGORIES, INDUSTRIES } from '../../lib/types/listing'

interface ProductBasicsStepProps {
    control: Control<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    setValue: UseFormSetValue<ProductFormData>;
    watch: UseFormWatch<ProductFormData>;
}

export default function ProductBasicsStep({ control, errors, setValue, watch }: ProductBasicsStepProps) {
    // Auto-generate slug from product name
    const productName = watch('name');
    useEffect(() => {
        if (productName) {
            const slug = productName
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setValue('slug', slug);
        }
    }, [productName, setValue]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter product name"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="productCode">Product Code *</Label>
                    <Controller
                        name="productCode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter product code"
                                className={errors.productCode ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.productCode && (
                        <p className="text-sm text-red-500">{errors.productCode.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Controller
                        name="model"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter model"
                                className={errors.model ? 'border-red-500' : ''}
                            />
                        )}
                    />
                    {errors.model && (
                        <p className="text-sm text-red-500">{errors.model.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.category && (
                        <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Controller
                        name="industry"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INDUSTRIES.map(industry => (
                                        <SelectItem key={industry} value={industry}>
                                            {industry}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.industry && (
                        <p className="text-sm text-red-500">{errors.industry.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Controller
                        name="condition"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || 'NEW'}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NEW">New</SelectItem>
                                    <SelectItem value="USED">Used</SelectItem>
                                    <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                                    <SelectItem value="CUSTOM">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="listingType">Listing Type *</Label>
                    <Controller
                        name="listingType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || 'SELL'}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SELL">Sell</SelectItem>
                                    <SelectItem value="LEASE">Lease</SelectItem>
                                    <SelectItem value="RENT">Rent</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <>
                            <textarea
                                {...field}
                                id="description"
                                rows={5}
                                placeholder="Enter product description"
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {/* <div className="mt-6">
                                <h2 className="text-lg font-semibold mb-2">HTML Output:</h2>
                                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                    {field.value || 'No content yet...'}
                                </pre>
                            </div> */}
                        </>
                    )}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>
        </div>
    );
}