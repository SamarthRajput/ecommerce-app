
// components/modals/ApprovalModal.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { ApprovalData } from '../../useUserManagement';

interface ApprovalModalProps {
    user: any;
    onClose: () => void;
    onSubmit: (id: string, data: ApprovalData) => Promise<boolean>;
    isLoading: boolean;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ user, onClose, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<ApprovalData>({
        approved: !user?.isApproved,
        approvalNote: user?.approvalNote || ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                approved: !user.isApproved,
                approvalNote: user.approvalNote || ''
            });
        }
    }, [user]);

    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.approved && !formData.approvalNote.trim()) {
            newErrors.approvalNote = 'Rejection reason is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const success = await onSubmit(user.id, formData);
        if (success) {
            onClose();
        }
    };

    const updateField = useCallback((field: string, value: any) => {
        setFormData((prev: ApprovalData) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {formData.approved ? 'Approve' : 'Reject'} Seller
                </DialogTitle>
                <DialogDescription>
                    {formData.approved
                        ? 'Approve this seller to allow them to list products and accept orders.'
                        : 'Reject this seller application. Please provide a reason for rejection.'
                    }
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="approval-action">Action</Label>
                    <Select
                        value={formData.approved ? 'approve' : 'reject'}
                        onValueChange={(value) => updateField('approved', value === 'approve')}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="approve">Approve Seller</SelectItem>
                            <SelectItem value="reject">Reject Seller</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="approval-note">
                        {formData.approved ? 'Approval Note (Optional)' : 'Rejection Reason (Required)'}
                    </Label>
                    <Textarea
                        id="approval-note"
                        value={formData.approvalNote}
                        onChange={(e) => updateField('approvalNote', e.target.value)}
                        placeholder={formData.approved
                            ? "Add any notes about the approval..."
                            : "Please provide a reason for rejection..."
                        }
                        rows={3}
                        className={errors.approvalNote ? 'border-red-500' : ''}
                    />
                    {errors.approvalNote && <span className="text-sm text-red-500">{errors.approvalNote}</span>}
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || (!formData.approved && !formData.approvalNote.trim())}
                    variant={formData.approved ? "default" : "destructive"}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {formData.approved ? 'Approve Seller' : 'Reject Seller'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};
