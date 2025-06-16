const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { Request, Response, NextFunction } from "express";

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                [key: string]: any;
            };
        }
    }
}

// Middleware to check if user is a manager
const requireManager = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'Unauthorized. User not authenticated.' });
        }
        const { userId } = req.user;

        // Check if user exists and has manager role
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                error: 'Access denied. Manager role required.'
            });
        }

        next();
    } catch (error) {
        console.error('Manager auth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { requireManager };