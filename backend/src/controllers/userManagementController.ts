import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

// Create an admin user
export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password, name, adminRole } = req.body;
        // Validate input
        if (!email || !password || !name || !adminRole) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        if (adminRole === 'SUPER_ADMIN') {
            return res.status(400).json({
                success: false,
                error: 'Cannot create SUPER_ADMIN from this endpoint'
            });
        }

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                error: 'Admin with this email already exists'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: "ADMIN",
                adminRole
            }
        });

        res.status(201).json({
            success: true,
            data: newAdmin
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create admin'
        });
    }
};
export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email, name, adminRole, password } = req.body;

        // Check if admin exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { id }
        });

        if (!existingAdmin) {
            return res.status(404).json({
                success: false,
                error: 'Admin not found'
            });
        }

        if (existingAdmin.adminRole === 'SUPER_ADMIN') {
            return res.status(400).json({
                success: false,
                error: 'Cannot update SUPER_ADMIN role'
            });
        }

        // Validate fields if provided
        if (email !== undefined && !email) {
            return res.status(400).json({
                success: false,
                error: 'Email cannot be empty'
            });
        }
        if (name !== undefined && !name) {
            return res.status(400).json({
                success: false,
                error: 'Name cannot be empty'
            });
        }
        if (adminRole !== undefined) {
            if (!adminRole) {
                return res.status(400).json({
                    success: false,
                    error: 'adminRole cannot be empty'
                });
            }
            if (adminRole === 'SUPER_ADMIN') {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot update adminRole to SUPER_ADMIN'
                });
            }
        }
        if (password !== undefined && password.length > 0 && password.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 3 characters'
            });
        }

        // Prepare update data
        const updateData: any = {};
        if (email !== undefined) updateData.email = email;
        if (name !== undefined) updateData.name = name;
        if (adminRole !== undefined) updateData.adminRole = adminRole;
        if (password !== undefined && password.length > 0) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // If nothing to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields provided for update'
            });
        }

        const updatedAdmin = await prisma.admin.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({
            success: true,
            data: updatedAdmin
        });
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update admin'
        });
    }
}

// Delete an admin user
export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if admin exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { id }
        });

        if (!existingAdmin) {
            return res.status(404).json({
                success: false,
                error: 'Admin not found'
            });
        }

        await prisma.admin.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete admin'
        });
    }
};

// Delete a buyer user
export const deleteBuyer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if buyer exists
        const existingBuyer = await prisma.buyer.findUnique({
            where: { id }
        });

        if (!existingBuyer) {
            return res.status(404).json({
                success: false,
                error: 'Buyer not found'
            });
        }

        await prisma.buyer.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Buyer deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting buyer:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete buyer'
        });
    }
}

// Approve Seller
export const approveSeller = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { approved, approvalNote }: { approved: boolean; approvalNote: string } = req.body;
        // Validate input
        if (approved === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Approved status is required'
            });
        }
        if (approvalNote && approvalNote.length > 500 && approvalNote.length < 1) {
            return res.status(400).json({
                success: false,
                error: 'Approval note cannot be longer than 500 characters'
            });
        }
        if (!approved && !approvalNote) {
            return res.status(400).json({
                success: false,
                error: 'Approval note is required when rejecting a seller'
            });
        }

        // Check if seller exists
        const existingSeller = await prisma.seller.findUnique({
            where: { id }
        });

        if (!existingSeller) {
            return res.status(404).json({
                success: false,
                error: 'Seller not found'
            });
        }
        // Check if the seller is already approved / rejected
        if (existingSeller.isApproved === approved) {
            return res.status(400).json({
                success: false,
                error: `Seller is already ${approved ? 'approved' : 'rejected'}`
            });
        }

        // Update seller status to approved
        const updatedSeller = await prisma.seller.update({
            where: { id },
            data: {
                isApproved: approved,
                approvalNote: approvalNote || null
            }
        });

        res.status(200).json({
            success: true,
            data: updatedSeller,
            message: approved ? 'Seller approved successfully' : 'Seller rejected successfully'
        });
    } catch (error) {
        console.error('Error approving seller:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to approve seller'
        });
    }
}