'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rfqFormSchema, type RFQFormSchema } from '@/lib/validations/rfq';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showSuccess, showError, showInfo } from '@/lib/toast';
import { useRouter } from 'next/navigation';

interface RFQFormProps {
    listingId: string;
    onSuccess?: () => void;
}

export function RFQForm({ listingId, onSuccess }: RFQFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<RFQFormSchema>({
        resolver: zodResolver(rfqFormSchema),
        defaultValues: {
            listingId,
            quantity: 1,
            currency: 'USD',
        },
    });

    const onSubmit = async (data: RFQFormSchema) => {
        try {
            setIsSubmitting(true);
            // TODO: Implement API call to submit RFQ
            console.log('RFQ data:', data);
            showSuccess('RFQ submitted successfully!');
            reset(); // Reset form after successful submission
            onSuccess?.();
            router.push('/'); // Redirect to RFQs page after success
        } catch (error) {
            console.error('Error submitting RFQ:', error);
            showError('Failed to submit RFQ. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Request for Quote</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            <Label htmlFor="deliveryDate">Delivery Date</Label>
                            <Input
                                id="deliveryDate"
                                type="date"
                                {...register('deliveryDate')}
                            />
                            {errors.deliveryDate && (
                                <p className="text-sm text-red-500">{errors.deliveryDate.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget</Label>
                            <Input
                                id="budget"
                                type="number"
                                {...register('budget', { valueAsNumber: true })}
                                min={0}
                                step={0.01}
                            />
                            {errors.budget && (
                                <p className="text-sm text-red-500">{errors.budget.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Input
                                id="currency"
                                {...register('currency')}
                                placeholder="USD"
                            />
                            {errors.currency && (
                                <p className="text-sm text-red-500">{errors.currency.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentTerms">Payment Terms</Label>
                        <Input
                            id="paymentTerms"
                            {...register('paymentTerms')}
                            placeholder="e.g., 30 days after delivery"
                        />
                        {errors.paymentTerms && (
                            <p className="text-sm text-red-500">{errors.paymentTerms.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specialRequirements">Special Requirements</Label>
                        <Textarea
                            id="specialRequirements"
                            {...register('specialRequirements')}
                            placeholder="Enter any special requirements or conditions"
                            rows={3}
                        />
                        {errors.specialRequirements && (
                            <p className="text-sm text-red-500">{errors.specialRequirements.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="additionalNotes">Additional Notes</Label>
                        <Textarea
                            id="additionalNotes"
                            {...register('additionalNotes')}
                            placeholder="Enter any additional notes or comments"
                            rows={3}
                        />
                        {errors.additionalNotes && (
                            <p className="text-sm text-red-500">{errors.additionalNotes.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting RFQ...' : 'Submit RFQ'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 