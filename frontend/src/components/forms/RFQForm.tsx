'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rfqFormSchema, type RFQFormSchema } from '@/lib/validations/rfq';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showSuccess, showError } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { APIURL } from '@/src/config/env';
import { ListingData } from '@/src/app/buyer/request-quote/[listingId]/page';
interface RFQFormProps {
    listingId: string;
    listingData: ListingData | null;
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

export function RFQForm({ listingId, listingData }: RFQFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Memoized default values
    const defaultValues = useMemo<RFQFormSchema>(() => ({
        listingId,
        quantity: listingData?.minimumOrderQuantity || 1,
        currency: listingData?.currency || 'USD',
        deliveryDate: listingData?.minimumDeliveryDateInDays
            ? new Date(Date.now() + listingData.minimumDeliveryDateInDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        paymentTerms: '',
        paymentMethod: 'TELEGRAPHIC_TRANSFER',
        specialRequirements: '',
        advancePaymentPercentage: undefined,
        cashAgainstDocumentsPercentage: undefined,
        documentsAgainstPaymentPercentage: undefined,
        documentsAgainstAcceptancePercentage: undefined,
        letterOfCreditDescription: '',
        servicesRequired: [],
        requestChangeInDeliveryTerms: false,
        additionalNotes: '',
        message: '',
    }), [listingId, listingData]);


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = useForm<RFQFormSchema>({
        resolver: zodResolver(rfqFormSchema),
        defaultValues,
    });

    const onSubmit = useCallback(async (data: RFQFormSchema) => {
        try {
            setIsSubmitting(true);
            // quantity should be at least the minimum order quantity and not more then listingData.quantity (available)

            if (listingData?.minimumOrderQuantity && data.quantity < listingData.minimumOrderQuantity) {
                throw new Error(`Quantity must be at least ${listingData.minimumOrderQuantity}`);
            }
            if (listingData?.quantity && data.quantity > listingData?.quantity) {
                throw new Error(`Quantity must not exceed ${listingData?.quantity}`);
            }

            // delivery date should be in the future and more than listingData.minimumDeliveryDateInDays
            const deliveryDate = new Date(data.deliveryDate);
            if (deliveryDate < new Date()) {
                throw new Error(`Delivery date must be in the future`);
            }
            if (listingData?.minimumDeliveryDateInDays && deliveryDate < new Date(Date.now() + listingData.minimumDeliveryDateInDays * 24 * 60 * 60 * 1000)) {
                throw new Error(`Delivery date must be at least ${listingData.minimumDeliveryDateInDays} days from now`);
            }

            const payload = {
                productId: data.listingId,
                quantity: data.quantity,
                deliveryDate: data.deliveryDate,
                currency: data.currency,
                paymentTerms: data.paymentTerms,
                advancePaymentPercentage: data.advancePaymentPercentage || null,
                cashAgainstDocumentsPercentage: data.cashAgainstDocumentsPercentage || null,
                documentsAgainstPaymentPercentage: data.documentsAgainstPaymentPercentage || null,
                documentsAgainstAcceptancePercentage: data.documentsAgainstAcceptancePercentage || null,
                paymentMethod: data.paymentMethod,
                letterOfCreditDescription: data.letterOfCreditDescription || null,
                specialRequirements: data.specialRequirements,
                requestChangeInDeliveryTerms: data.requestChangeInDeliveryTerms || false,
                servicesRequired: data.servicesRequired || [],
                additionalNotes: data.additionalNotes || null,
                message: data.message || null,
                status: "PENDING"
            };

            const response = await fetch(`${APIURL}/rfq/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // alert(`Error: ${response.status} - ${response.statusText}`);
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Failed to submit RFQ');
            }

            const result = await response.json();

            showSuccess('RFQ submitted successfully!');
            reset(); // Reset form after successful submission
            router.push('/buyer/dashboard'); // Redirect to RFQs page after success
        } catch (error) {
            console.error('Error submitting RFQ:', error);
            showError(error instanceof Error ? error.message : 'Failed to submit RFQ. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [router, reset]);


    const quantity = watch('quantity');

    return (
        <Card className="w-full max-w-2xl mx-auto" >
            <CardHeader>
                <CardTitle>Request for Quote</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Quantity *" error={errors.quantity?.message}>
                            <Input
                                id="quantity"
                                type="number"
                                {...register('quantity', { valueAsNumber: true })}
                                min={listingData?.minimumOrderQuantity || 1}
                                max={listingData?.quantity || Infinity}
                            />
                            {listingData?.minimumOrderQuantity}
                            {listingData && (quantity < listingData.minimumOrderQuantity || quantity > listingData.quantity) && (
                                <div className="mt-1 px-3 py-2 rounded bg-red-100 border border-red-400 text-red-700 text-sm">
                                    {quantity < listingData.minimumOrderQuantity && (
                                        <span>
                                            <strong>Error:</strong> Minimum order quantity is {listingData.minimumOrderQuantity}.
                                        </span>
                                    )}
                                    {quantity > listingData.quantity && (
                                        <span>
                                            <strong>Error:</strong> Maximum order quantity is {listingData.quantity} {listingData.unit.name} ({listingData.unit.symbol}).
                                        </span>
                                    )}
                                </div>
                            )}
                        </FormField>


                        <FormField label="Delivery Date *" error={errors.deliveryDate?.message}>
                            <Input
                                id="deliveryDate"
                                type="date"
                                min={
                                    listingData?.minimumDeliveryDateInDays
                                        ? new Date(Date.now() + listingData.minimumDeliveryDateInDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
                                        : new Date().toISOString().slice(0, 10)
                                }
                                {...register('deliveryDate')}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Currency *" error={errors.currency?.message}>
                            <Input
                                id="currency"
                                {...register('currency')}
                                placeholder="USD"
                            />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Payment Method *" error={errors.paymentMethod?.message}>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="TELEGRAPHIC_TRANSFER"
                                        {...register('paymentMethod')}
                                    /> Telegraphic Transfer (TT)
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="LETTER_OF_CREDIT"
                                        {...register('paymentMethod')}
                                    /> Letter of Credit (LC)
                                </label>
                            </div>
                        </FormField>

                        {watch('paymentMethod') === 'LETTER_OF_CREDIT' && (
                            <FormField label="Letter of Credit Details" error={errors.letterOfCreditDescription?.message}>
                                <Textarea
                                    {...register('letterOfCreditDescription')}
                                    placeholder="Enter LC details"
                                    rows={3}
                                />
                            </FormField>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Advance Payment (%)" error={errors.advancePaymentPercentage?.message}>
                            <Input type="number" {...register('advancePaymentPercentage', { valueAsNumber: true })} min={0} max={100} />
                        </FormField>
                        <FormField label="Cash Against Documents (%)" error={errors.cashAgainstDocumentsPercentage?.message}>
                            <Input type="number" {...register('cashAgainstDocumentsPercentage', { valueAsNumber: true })} min={0} max={100} />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Documents Against Payment (%)" error={errors.documentsAgainstPaymentPercentage?.message}>
                            <Input type="number" {...register('documentsAgainstPaymentPercentage', { valueAsNumber: true })} min={0} max={100} />
                        </FormField>
                        <FormField label="Documents Against Acceptance (%)" error={errors.documentsAgainstAcceptancePercentage?.message}>
                            <Input type="number" {...register('documentsAgainstAcceptancePercentage', { valueAsNumber: true })} min={0} max={100} />
                        </FormField>
                    </div>

                    <FormField label="Services Required" error={errors.servicesRequired?.message}>
                        <div className="flex flex-wrap gap-4">
                            {['Inspection', 'Shipping', 'Custom Clearance'].map(service => (
                                <label key={service} className="flex items-center gap-2">
                                    <input type="checkbox" value={service} {...register('servicesRequired')} />
                                    {service}
                                </label>
                            ))}
                        </div>
                    </FormField>

                    <FormField label="Request Change in Delivery Terms">
                        <input type="checkbox" {...register('requestChangeInDeliveryTerms')} />
                    </FormField>

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
        </Card >
    );
}