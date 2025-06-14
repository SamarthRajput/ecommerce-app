'use client';
import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listingFormSchema, type ListingFormSchema } from '@/src/lib/validations/listing';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { showSuccess, showError } from '@/src/lib/toast';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

// Memoized Form Field Component
const FormField = React.memo(({
    label,
    error,
    children
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        {children}
        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
));

FormField.displayName = 'FormField';

export function ListingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Memoized default values with correct types
    const defaultValues = useMemo<ListingFormSchema>(() => ({
        listingType: 'SELL' as const,
        condition: 'NEW' as const,
        quantity: 1,
        validityPeriod: 30,
        industry: '',
        category: '',
        productCode: '',
        productName: '',
        description: '',
        model: '',
        specifications: '',
        countryOfSource: '',
        hsnCode: '',
        images: [],
    }), []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ListingFormSchema>({
        resolver: zodResolver(listingFormSchema),
        defaultValues,
    });

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            uploadedImages.forEach(image => {
                URL.revokeObjectURL(URL.createObjectURL(image));
            });
        };
    }, [uploadedImages]);

    const onSubmit = useCallback(async (data: ListingFormSchema) => {
        try {
            setIsSubmitting(true);
            console.log("Form submitted with data:", data);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // TODO: Add your API call here to submit the form data
            // const response = await fetch('/api/listings', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            // });

            // if (!response.ok) {
            //     throw new Error('Failed to create listing');
            // }

            showSuccess("Listing created successfully!");
            router.push('/'); // Redirect to listings page after successful submission
        } catch (error) {
            console.error("Form submission error:", error);
            showError("Failed to submit form");
        } finally {
            setIsSubmitting(false);
        }
    }, [router]);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (uploadedImages.length >= 5) {
            showError("Maximum 5 images allowed");
            return;
        }

        if (!file.type.startsWith('image/')) {
            showError("Please upload only image files");
            return;
        }

        setUploadedImages(prev => [...prev, file]);
        setValue('images', [...uploadedImages, file]);
    }, [uploadedImages, setValue]);

    const removeImage = useCallback((index: number) => {
        setUploadedImages(prev => {
            const newImages = prev.filter((_, i) => i !== index);
            setValue('images', newImages);
            return newImages;
        });
    }, [setValue]);

    // Memoized image preview grid
    const imagePreviewGrid = useMemo(() => {
        if (uploadedImages.length === 0) return null;

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                        <div className="aspect-square relative rounded-lg overflow-hidden border">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Uploaded ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                            {image.name}
                        </p>
                    </div>
                ))}
            </div>
        );
    }, [uploadedImages, removeImage]);

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Listing</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Listing Type" error={errors.listingType?.message}>
                            <Select
                                onValueChange={(value) => setValue('listingType', value as 'SELL' | 'RENT')}
                                defaultValue="SELL"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select listing type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SELL">Sell</SelectItem>
                                    <SelectItem value="RENT">Rent</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Condition" error={errors.condition?.message}>
                            <Select
                                onValueChange={(value) => setValue('condition', value as 'NEW' | 'USED')}
                                defaultValue="NEW"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NEW">New</SelectItem>
                                    <SelectItem value="USED">Used</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>

                    <FormField label="Product Name" error={errors.productName?.message}>
                        <Input
                            id="productName"
                            {...register('productName')}
                            placeholder="Enter product name"
                        />
                    </FormField>

                    <FormField label="Description" error={errors.description?.message}>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Enter product description"
                            rows={4}
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Product Code" error={errors.productCode?.message}>
                            <Input
                                id="productCode"
                                {...register('productCode')}
                                placeholder="Enter product code"
                            />
                        </FormField>

                        <FormField label="HSN Code" error={errors.hsnCode?.message}>
                            <Input
                                id="hsnCode"
                                {...register('hsnCode')}
                                placeholder="Enter HSN code"
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Quantity" error={errors.quantity?.message}>
                            <Input
                                id="quantity"
                                type="number"
                                {...register('quantity', { valueAsNumber: true })}
                                min={1}
                            />
                        </FormField>

                        <FormField label="Validity Period (days)" error={errors.validityPeriod?.message}>
                            <Input
                                id="validityPeriod"
                                type="number"
                                {...register('validityPeriod', { valueAsNumber: true })}
                                min={1}
                            />
                        </FormField>
                    </div>

                    <div className="space-y-4">
                        <FormField label="Product Images (Max 5)" error={errors.images?.message}>
                            <div className="flex items-center gap-4">
                                <Input
                                    ref={fileInputRef}
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="max-w-xs"
                                />
                                <span className="text-sm text-gray-500">
                                    {uploadedImages.length}/5 images uploaded
                                </span>
                            </div>
                        </FormField>

                        {imagePreviewGrid}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Industry" error={errors.industry?.message}>
                            <Input
                                id="industry"
                                {...register('industry')}
                                placeholder="Enter industry"
                            />
                        </FormField>

                        <FormField label="Category" error={errors.category?.message}>
                            <Input
                                id="category"
                                {...register('category')}
                                placeholder="Enter category"
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Model" error={errors.model?.message}>
                            <Input
                                id="model"
                                {...register('model')}
                                placeholder="Enter model"
                            />
                        </FormField>

                        <FormField label="Country of Source" error={errors.countryOfSource?.message}>
                            <Input
                                id="countryOfSource"
                                {...register('countryOfSource')}
                                placeholder="Enter country of source"
                            />
                        </FormField>
                    </div>

                    <FormField label="Specifications" error={errors.specifications?.message}>
                        <Textarea
                            id="specifications"
                            {...register('specifications')}
                            placeholder="Enter product specifications"
                            rows={4}
                        />
                    </FormField>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Creating Listing...
                            </div>
                        ) : (
                            'Create Listing'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 