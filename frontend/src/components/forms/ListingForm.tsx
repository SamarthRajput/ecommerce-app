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
import { toast } from 'sonner';

export function ListingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ListingFormSchema>({
        resolver: zodResolver(listingFormSchema),
        defaultValues: {
            listingType: 'SELL',
            condition: 'NEW',
            quantity: 1,
            validityPeriod: 30,
        },
    });

    const onSubmit = async (data: ListingFormSchema) => {
        try {
            setIsSubmitting(true);
            // TODO: Implement API call to submit listing
            console.log('Form data:', data);
            toast.success('Listing created successfully!');
        } catch (error) {
            toast.error('Failed to create listing. Please try again.');
            console.error('Error submitting form:', error);
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
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                setValue('images', files);
                            }}
                        />
                        {errors.images && (
                            <p className="text-sm text-red-500">{errors.images.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 