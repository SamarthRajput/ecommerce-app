'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rfqFormSchema, type RFQFormSchema } from '@/src/lib/validations/rfq';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { showSuccess, showError, showInfo } from '@/src/lib/toast';
import { useRouter } from 'next/navigation';

interface RFQFormProps {
    listingId: string;
    onSuccess?: () => void;
}

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

export function RFQForm({ listingId, onSuccess }: RFQFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Memoized default values
    const defaultValues = useMemo<RFQFormSchema>(() => ({
        listingId,
        quantity: 1,
        currency: 'USD',
        deliveryDate: '',
        budget: 0,
        paymentTerms: '',
        specialRequirements: '',
        additionalNotes: '',
    }), [listingId]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<RFQFormSchema>({
        resolver: zodResolver(rfqFormSchema),
        defaultValues,
    });

    const onSubmit = useCallback(async (data: RFQFormSchema) => {
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
    }, [router, reset, onSuccess]);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Request for Quote</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Quantity" error={errors.quantity?.message}>
                            <Input
                                id="quantity"
                                type="number"
                                {...register('quantity', { valueAsNumber: true })}
                                min={1}
                            />
                        </FormField>

                        <FormField label="Delivery Date" error={errors.deliveryDate?.message}>
                            <Input
                                id="deliveryDate"
                                type="date"
                                {...register('deliveryDate')}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Budget" error={errors.budget?.message}>
                            <Input
                                id="budget"
                                type="number"
                                {...register('budget', { valueAsNumber: true })}
                                min={0}
                                step={0.01}
                            />
                        </FormField>

                        <FormField label="Currency" error={errors.currency?.message}>
                            <Input
                                id="currency"
                                {...register('currency')}
                                placeholder="USD"
                            />
                        </FormField>
                    </div>

                    <FormField label="Payment Terms" error={errors.paymentTerms?.message}>
                        <Input
                            id="paymentTerms"
                            {...register('paymentTerms')}
                            placeholder="e.g., 30 days after delivery"
                        />
                    </FormField>

                    <FormField label="Special Requirements" error={errors.specialRequirements?.message}>
                        <Textarea
                            id="specialRequirements"
                            {...register('specialRequirements')}
                            placeholder="Enter any special requirements or conditions"
                            rows={3}
                        />
                    </FormField>

                    <FormField label="Additional Notes" error={errors.additionalNotes?.message}>
                        <Textarea
                            id="additionalNotes"
                            {...register('additionalNotes')}
                            placeholder="Enter any additional notes or comments"
                            rows={3}
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
                                Submitting RFQ...
                            </div>
                        ) : (
                            'Submit RFQ'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 