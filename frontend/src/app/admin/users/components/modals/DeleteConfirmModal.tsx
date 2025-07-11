
// components/modals/DeleteConfirmModal.tsx
import React from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

interface DeleteTarget {
    type: string;
    id: string;
    name: string;
}

interface DeleteConfirmModalProps {
    target: DeleteTarget | null;
    onClose: () => void;
    onConfirm: (target: DeleteTarget) => Promise<boolean>;
    isLoading: boolean;
    currentUserRole?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    target,
    onClose,
    onConfirm,
    isLoading,
    currentUserRole
}) => {
    if (!target) return null;

    // Disable deletion if target is SuperAdmin and current user is not SuperAdmin
    const isDisabled = target.type === 'admin' && currentUserRole !== 'SuperAdmin';

    const handleConfirm = async () => {
        if (isDisabled) return;
        const success = await onConfirm(target);
        if (success) onClose();
    };

    if (isDisabled) {
        return (
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        Access Denied
                    </DialogTitle>
                    <DialogDescription>
                        You cannot delete SuperAdmin users unless you are a SuperAdmin yourself.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-center text-muted-foreground">
                        Access denied for deleting this user.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        );
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    Confirm Deletion
                </DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete the {target.type} and remove all associated data.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <p className="text-sm">
                    Are you sure you want to delete <strong>{target.name}</strong>?
                </p>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleConfirm}
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete {target.type}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};