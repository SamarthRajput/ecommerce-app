
// components/modals/CreateAdminModal.tsx
import React, { useState, useCallback } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { CreateAdminData } from '@/src/lib/types/admin/userManagementInterface';

interface CreateAdminModalProps {
    onClose: () => void;
    onSubmit: (data: CreateAdminData) => Promise<boolean>;
    isLoading: boolean;
}

export const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ onClose, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<CreateAdminData & { confirmPassword: string }>({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        adminRole: 'AdminAdmin'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        // if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        // if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const { confirmPassword, ...submitData } = formData;
        const success = await onSubmit(submitData);

        if (success) {
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                adminRole: 'AdminAdmin'
            });
            onClose();
        }
    };

    const updateField = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
                <DialogDescription>
                    Add a new administrator to the system
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Enter full name"
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="Enter email address"
                        className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        placeholder="Enter password"
                        className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="adminRole">Admin Role</Label>
                    <Select value={formData.adminRole} onValueChange={(value) => updateField('adminRole', value)}>
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
                    Create Admin
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};
