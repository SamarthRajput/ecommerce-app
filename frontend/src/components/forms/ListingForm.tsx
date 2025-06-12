'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listingFormSchema, type ListingFormSchema } from '@/lib/validations/listing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showSuccess, showError } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';

export function ListingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ListingFormSchema>({
        resolver: zodResolver(listingFormSchema),
        defaultValues: {
            listingType: 'SELL',
            condition: 'NEW',
            quantity: 1,
            validityPeriod: 30,
        },
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (uploadedImages.length >= 5) {
            showError("Maximum 5 images allowed");
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError("Please upload an image file");
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        setUploadedImages(prev => [...prev, file]);
        setImagePreviewUrls(prev => [...prev, previewUrl]);
        setValue('images', [...uploadedImages, file]);
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviewUrls(prev => {
            const newUrls = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]); // Clean up the URL
            return newUrls;
        });
        setValue('images', uploadedImages.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: ListingFormSchema) => {
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
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Listing</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="listingType">Listing Type</Label>
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
                            {errors.listingType && (
                                <p className="text-sm text-red-500">{errors.listingType.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="condition">Condition</Label>
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
                            {errors.condition && (
                                <p className="text-sm text-red-500">{errors.condition.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                            id="productName"
                            {...register('productName')}
                            placeholder="Enter product name"
                        />
                        {errors.productName && (
                            <p className="text-sm text-red-500">{errors.productName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Enter product description"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="productCode">Product Code</Label>
                            <Input
                                id="productCode"
                                {...register('productCode')}
                                placeholder="Enter product code"
                            />
                            {errors.productCode && (
                                <p className="text-sm text-red-500">{errors.productCode.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hsnCode">HSN Code</Label>
                            <Input
                                id="hsnCode"
                                {...register('hsnCode')}
                                placeholder="Enter HSN code"
                            />
                            {errors.hsnCode && (
                                <p className="text-sm text-red-500">{errors.hsnCode.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                {...register('quantity', { valueAsNumber: true })}
                                min={1}
                            />
                            {errors.quantity && (
                                <p className="text-sm text-red-500">{errors.quantity.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="validityPeriod">Validity Period (days)</Label>
                            <Input
                                id="validityPeriod"
                                type="number"
                                {...register('validityPeriod', { valueAsNumber: true })}
                                min={1}
                            />
                            {errors.validityPeriod && (
                                <p className="text-sm text-red-500">{errors.validityPeriod.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">Product Images (Max 5)</Label>
                        <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadedImages.length >= 5}
                        />
                        {errors.images && (
                            <p className="text-sm text-red-500">{errors.images.message}</p>
                        )}

                        {/* Image Preview Grid */}
                        {imagePreviewUrls.length > 0 && (
                            <div className="grid grid-cols-5 gap-4 mt-4">
                                {imagePreviewUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square relative rounded-lg overflow-hidden">
                                            <Image
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input
                                id="industry"
                                {...register('industry')}
                                placeholder="Enter industry"
                            />
                            {errors.industry && (
                                <p className="text-sm text-red-500">{errors.industry.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                {...register('category')}
                                placeholder="Enter category"
                            />
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                {...register('model')}
                                placeholder="Enter model"
                            />
                            {errors.model && (
                                <p className="text-sm text-red-500">{errors.model.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="countryOfSource">Country of Source</Label>
                            <Input
                                id="countryOfSource"
                                {...register('countryOfSource')}
                                placeholder="Enter country of source"
                            />
                            {errors.countryOfSource && (
                                <p className="text-sm text-red-500">{errors.countryOfSource.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specifications">Specifications</Label>
                        <Textarea
                            id="specifications"
                            {...register('specifications')}
                            placeholder="Enter product specifications"
                            rows={4}
                        />
                        {errors.specifications && (
                            <p className="text-sm text-red-500">{errors.specifications.message}</p>
                        )}
                    </div>

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