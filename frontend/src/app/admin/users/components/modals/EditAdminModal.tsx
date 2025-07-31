
// components/modals/EditAdminModal.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { UpdateAdminData } from '@/src/lib/types/admin/userManagementInterface';

interface EditAdminModalProps {
    user: any;
    onClose: () => void;
    onSubmit: (id: string, data: UpdateAdminData) => Promise<boolean>;
    isLoading: boolean;
    currentUserRole?: string;
}

export const EditAdminModal: React.FC<EditAdminModalProps> = ({
    user,
    onClose,
    onSubmit,
    isLoading,
    currentUserRole
}) => {
    const [formData, setFormData] = useState<UpdateAdminData & { confirmPassword: string }>({
        email: user?.email || '',
        name: user?.name || '',
        adminRole: user?.adminRole || 'AdminAdmin',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Disable editing if the target user is a SuperAdmin and current user is not SuperAdmin
    const isDisabled = user?.adminRole === 'SuperAdmin' && currentUserRole !== 'SuperAdmin';

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email,
                name: user.name,
                adminRole: user.adminRole,
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        // if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        // if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async () => {
        if (!validateForm() || isDisabled) return;

        const { confirmPassword, ...submitData } = formData;
        if (!submitData.password) {
            delete submitData.password;
        }

        const success = await onSubmit(user.id, submitData);
        if (success) onClose();
    };

    const updateField = useCallback((field: string, value: string) => {
        setFormData((prev: typeof formData) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    if (isDisabled) {
        return (
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Admin User</DialogTitle>
                    <DialogDescription>
                        You cannot edit SuperAdmin users unless you are a SuperAdmin yourself.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="text-center text-muted-foreground">
                        <p>Access denied for editing this user.</p>
                    </div>
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
                <DialogTitle>Edit Admin User</DialogTitle>
                <DialogDescription>
                    Update administrator information and role
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Enter full name"
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                        id="edit-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="Enter email address"
                        className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-password">New Password (Optional)</Label>
                    <Input
                        id="edit-password"
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => updateField('password', e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
                </div>

                {formData.password && (
                    <div className="grid gap-2">
                        <Label htmlFor="edit-confirmPassword">Confirm New Password</Label>
                        <Input
                            id="edit-confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateField('confirmPassword', e.target.value)}
                            placeholder="Confirm new password"
                            className={errors.confirmPassword ? 'border-red-500' : ''}
                        />
                        {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword}</span>}
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="edit-adminRole">Admin Role</Label>
                    <Select
                        value={formData.adminRole}
                        onValueChange={(value) => updateField('adminRole', value)}
                        disabled={user?.adminRole === 'SuperAdmin' && currentUserRole !== 'SuperAdmin'}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select admin role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="INSPECTOR">Inspector</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Admin
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};
