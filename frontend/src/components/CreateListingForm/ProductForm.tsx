// components/ProductForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, DollarSign, Truck, FileText, Image as ImageIcon, Tag, Check, ChevronRight, ChevronLeft, Save, Send, AlertCircle, Edit } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { ProductFormData, ProductFormProps, productSchema, createProductSchema, FORM_STEPS } from '@/lib/types/listing'
import { ProductBasicsStep, PricingQuantityStep, LogisticsValidityStep, ProductDetailsStep, MediaAttachmentsStep, SeoTaggingStep, ReviewSubmitStep } from './index'
import { useRouter } from 'next/navigation';

// Form steps configuration with icons
const STEP_ICONS = [Package, DollarSign, Truck, FileText, ImageIcon, Tag, Check];

export default function ProductForm({ mode, initialData, onSubmit }: ProductFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [submitType, setSubmitType] = useState<'draft' | 'submit'>('submit');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleConfirm = () => {
        setOpen(false);
        router.push("/seller/dashboard?tab=listings");
    };


    // Use appropriate schema based on mode
    const schema = mode === 'create' ? createProductSchema : productSchema;

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue,
        trigger,
        getValues,
        reset
    } = useForm<ProductFormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            condition: 'NEW',
            listingType: 'SELL',
            currency: 'INR',
            logisticsSupport: 'BOTH',
            quantity: 1,
            minimumOrderQuantity: 1,
            validityPeriod: 30,
            deliveryTimeInDays: 7,
            price: 0,
            tags: [],
            keywords: [],
            certifications: [],
            licenses: [],
            images: [],
            agreedToTerms: mode === 'edit' ? true : false,
            ...initialData
        }
    });

    // Load initial data for edit mode
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset(initialData);

            // If there are existing images, convert them to URLs for display
            if (initialData.images && Array.isArray(initialData.images)) {
                const existingImageUrls = initialData.images.map((img: any) => {
                    if (typeof img === 'string') return img;
                    if (img instanceof File) return URL.createObjectURL(img);
                    return img.url || '';
                }).filter(Boolean);
                setImageUrls(existingImageUrls);
            }
        }
    }, [mode, initialData, reset]);

    // File upload handler
    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        if (imageFiles.length + files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newFiles = Array.from(files);
        const newUrls = newFiles.map(file => URL.createObjectURL(file));

        setImageFiles(prev => [...prev, ...newFiles]);
        setImageUrls(prev => [...prev, ...newUrls]);
        setValue('images', [...imageFiles, ...newFiles]);
        trigger('images');
    };

    // Remove image
    const removeImage = (index: number) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        const newUrls = imageUrls.filter((_, i) => i !== index);

        // Revoke URL to prevent memory leaks
        if (imageUrls[index].startsWith('blob:')) {
            URL.revokeObjectURL(imageUrls[index]);
        }

        setImageFiles(newFiles);
        setImageUrls(newUrls);
        setValue('images', newFiles);
        trigger('images');
    };

    // Step validation mapping
    const getStepFields = (stepId: number): (keyof ProductFormData)[] => {
        const stepFields: { [key: number]: (keyof ProductFormData)[] } = {
            1: ['name', 'productCode', 'model', 'category', 'industry', 'condition', 'listingType', 'description'],
            2: ['price', 'currency', 'quantity', 'minimumOrderQuantity'],
            3: ['deliveryTimeInDays', 'logisticsSupport', 'countryOfSource', 'validityPeriod'],
            4: ['hsnCode'],
            5: ['images'],
            6: ['tags'],
            7: mode === 'create' ? ['agreedToTerms'] : []
        };
        return stepFields[stepId] || [];
    };

    // Check if step has errors
    const getStepErrors = (stepId: number) => {
        const stepFields = getStepFields(stepId);
        return stepFields.some(field => errors[field]);
    };

    // Check if step is valid
    const isStepValid = async (stepId: number) => {
        const stepFields = getStepFields(stepId);
        const result = await trigger(stepFields.length > 0 ? stepFields : undefined);
        return result;
    };

    // Step navigation
    const goToNextStep = async () => {
        const valid = await isStepValid(currentStep);
        if (valid && currentStep < FORM_STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step: number) => {
        setCurrentStep(step);
    };

    // Form submission
    const onFormSubmit = async (data: ProductFormData) => {
        setLoading(true);
        try {
            await onSubmit(data, submitType === 'draft');
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    // Progress calculation
    const progress = (currentStep / FORM_STEPS.length) * 100;

    // Render step content
    const renderStepContent = () => {
        const stepProps = { control, errors, watch, setValue, getValues };

        switch (currentStep) {
            case 1:
                return <ProductBasicsStep {...stepProps} />;
            case 2:
                return <PricingQuantityStep control={control} errors={errors} />;
            case 3:
                return <LogisticsValidityStep control={control} errors={errors} />;
            case 4:
                return <ProductDetailsStep control={control} errors={errors} />;
            case 5:
                return (
                    <MediaAttachmentsStep
                        control={control}
                        errors={errors}
                        imageFiles={imageFiles}
                        imageUrls={imageUrls}
                        onFileUpload={handleFileUpload}
                        onRemoveImage={removeImage}
                    />
                );
            case 6:
                return <SeoTaggingStep {...stepProps} />;
            case 7:
                return (
                    <ReviewSubmitStep
                        control={control}
                        errors={errors}
                        getValues={getValues}
                        imageFiles={imageFiles}
                        mode={mode}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        {mode === 'create' ? (
                            <>
                                <Package className="w-8 h-8" />
                                Create Product Listing
                            </>
                        ) : (
                            <>
                                <Edit className="w-8 h-8" />
                                Edit Product Listing
                            </>
                        )}
                    </h1>
                    <p className="text-gray-600">
                        {mode === 'create'
                            ? 'Add your product to reach thousands of potential buyers'
                            : 'Update your product information and settings'
                        }
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Step {currentStep} of {FORM_STEPS.length}
                        </span>
                        <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Step navigation */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {FORM_STEPS.map((step, index) => {
                            const Icon = STEP_ICONS[index];
                            const hasError = getStepErrors(step.id);
                            const isCompleted = step.id < currentStep;
                            const isCurrent = step.id === currentStep;

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => goToStep(step.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isCurrent
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : isCompleted
                                            ? 'bg-green-100 text-green-700'
                                            : hasError
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{step.title}</span>
                                    {hasError && <AlertCircle className="w-4 h-4" />}
                                    {isCompleted && <Check className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Form content */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {React.createElement(STEP_ICONS[currentStep - 1], { className: "w-5 h-5" })}
                            {FORM_STEPS[currentStep - 1].title}
                        </CardTitle>
                        <p className="text-gray-600">{FORM_STEPS[currentStep - 1].description}</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            {renderStepContent()}
                        </form>
                    </CardContent>
                </Card>

                {/* Navigation buttons */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <AlertDialog open={open} onOpenChange={setOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel editing?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to cancel editing? Unsaved changes will be lost.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Stay</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleConfirm}>Leave</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={goToPreviousStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        {currentStep === FORM_STEPS.length ? (
                            <>
                                {mode === 'create' && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setSubmitType('draft');
                                            handleSubmit(onFormSubmit)();
                                        }}
                                        disabled={loading}
                                        className="flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save as Draft
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    onClick={() => {
                                        // alert(`IsValid : ${isValid}`)
                                        setSubmitType('submit');
                                        handleSubmit(onFormSubmit)();
                                    }}
                                    disabled={loading}
                                    className="flex items-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {mode === 'create' ? 'Submit for Approval' : 'Update Product'}
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="button"
                                onClick={goToNextStep}
                                className="flex items-center gap-2"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Error summary */}
                {Object.keys(errors).length > 0 && (
                    <Alert className="mt-6" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please fix the following errors before proceeding:
                            <span>
                                {JSON.stringify(errors)}
                            </span>
                            <ul className="mt-2 list-disc list-inside">
                                {Object.entries(errors).map(([field, error]) => {
                                    // Zod errors may have nested errors (e.g., for arrays/objects)
                                    const messages: string[] = [];
                                    if (error?.message) {
                                        messages.push(error.message as string);
                                    }
                                    // If error has 'types' (for union/enum), collect those messages
                                    if (error?.types && typeof error.types === 'object') {
                                        messages.push(
                                            ...Object.values(error.types).filter(Boolean).map(String)
                                        );
                                    }
                                    // If error has 'refine' errors (for arrays/objects)
                                    if (Array.isArray((error as any)?.types?.refine)) {
                                        messages.push(
                                            ...(error as any).types.refine.map((msg: any) => String(msg))
                                        );
                                    }
                                    // If error has 'root' (for array/object errors)
                                    if (Array.isArray((error as any)?.root)) {
                                        messages.push(
                                            ...(error as any).root.map((msg: any) => String(msg))
                                        );
                                    }
                                    // If error has 'message' in nested errors (for arrays)
                                    if (Array.isArray((error as any)?.message)) {
                                        messages.push(
                                            ...(error as any).message.map((msg: any) => String(msg))
                                        );
                                    }
                                    // Fallback: show JSON if nothing else
                                    if (messages.length === 0) {
                                        messages.push(JSON.stringify(error));
                                    }
                                    return messages.map((msg, i) => (
                                        <li key={field + i} className="text-sm">
                                            {msg}
                                        </li>
                                    ));
                                })}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}