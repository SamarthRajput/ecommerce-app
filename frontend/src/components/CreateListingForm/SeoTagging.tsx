import React, { useState } from 'react';
import { Controller, Control, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { ProductFormData } from '@/lib/types/listing'

interface SeoTaggingStepProps {
    control: Control<ProductFormData>;
    watch: UseFormWatch<ProductFormData>;
    setValue: UseFormSetValue<ProductFormData>;
    getValues: UseFormGetValues<ProductFormData>;
}

export default function SeoTaggingStep({ control, watch, setValue, getValues }: SeoTaggingStepProps) {
    const [tagInput, setTagInput] = useState('');
    const [keywordInput, setKeywordInput] = useState('');

    const addTag = () => {
        if (tagInput.trim()) {
            const currentTags = getValues('tags') || [];
            setValue('tags', [...currentTags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        const currentTags = getValues('tags') || [];
        setValue('tags', currentTags.filter((_, i) => i !== index));
    };

    const addKeyword = () => {
        if (keywordInput.trim()) {
            const currentKeywords = getValues('keywords') || [];
            setValue('keywords', [...currentKeywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (index: number) => {
        const currentKeywords = getValues('keywords') || [];
        setValue('keywords', currentKeywords.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Enter tag and press Add"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} variant="outline">
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {(watch('tags') || []).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="ml-1 hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Keywords</Label>
                    <div className="flex gap-2">
                        <Input
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            placeholder="Enter keyword and press Add"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        />
                        <Button type="button" onClick={addKeyword} variant="outline">
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {(watch('keywords') || []).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                                {keyword}
                                <button
                                    type="button"
                                    onClick={() => removeKeyword(index)}
                                    className="ml-1 hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
