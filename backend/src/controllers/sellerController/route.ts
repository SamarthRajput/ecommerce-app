// backend/src/controllers/sellerController/route.ts

import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

// Zod validation schemas
const addressSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required')
})

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    businessName: z.string().min(1, 'Business name is required'),
    businessType: z.string().min(1, 'Business type is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: addressSchema,
    taxId: z.string().min(1, 'Tax ID is required')
})

const registerSellerSchema = z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    profile: profileSchema
})

const loginSellerSchema = z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required')
})

export const registerSeller = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body with Zod
        const validationResult = registerSellerSchema.safeParse(req.body)

        if (!validationResult.success) {
            res.status(400).json({
                details: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
                ,
                error: `Validation failed: ${validationResult.error.message}`
            })
            return
        }

        const { email, password, profile } = validationResult.data
        console.log('Registering seller:', email, profile.businessName)

        // Check if seller exists
        const existingSeller = await prisma.seller.findUnique({
            where: { email }
        })

        if (existingSeller) {
            res.status(400).json({ error: 'Seller already exists' })
            return
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create seller
        const seller = await prisma.seller.create({
            data: {
                email,
                password: hashedPassword,
                firstName: profile.firstName,
                lastName: profile.lastName,
                businessName: profile.businessName,
                businessType: profile.businessType,
                phone: profile.phone,
                street: profile.address.street,
                city: profile.address.city,
                state: profile.address.state,
                zipCode: profile.address.zipCode,
                country: profile.address.country,
                taxId: profile.taxId,
            }
        })

        // Generate JWT
        const token = jwt.sign(
            { sellerId: seller.id },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        )

        res.status(201).json({
            message: 'Seller registered successfully',
            token,
            seller: {
                id: seller.id,
                email: seller.email,
                profile: {
                    firstName: seller.firstName,
                    lastName: seller.lastName,
                    businessName: seller.businessName,
                    businessType: seller.businessType,
                    phone: seller.phone,
                    address: {
                        street: seller.street,
                        city: seller.city,
                        state: seller.state,
                        zipCode: seller.zipCode,
                        country: seller.country
                    },
                    taxId: seller.taxId
                }
            }
        })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ error: 'Server error' })
    }
}

export const loginSeller = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body with Zod
        const validationResult = loginSellerSchema.safeParse(req.body)

        if (!validationResult.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            })
            return
        }
        console.log('Logging in seller:', validationResult.data.email)

        const { email, password } = validationResult.data

        // Find seller
        const seller = await prisma.seller.findUnique({
            where: { email }
        })

        if (!seller) {
            res.status(400).json({ error: 'Invalid credentials' })
            console.log('Seller not found:', email)
            return
        }

        console.log('Seller found:', seller.id)

        // Check password
        const isMatch = await bcrypt.compare(password, seller.password)
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid credentials' })
            console.log('Password mismatch for seller:', email)
            return
        }

        console.log('Password match for seller:', seller.id)
        // Generate JWT
        const token = jwt.sign(
            { sellerId: seller.id },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        )

        console.log('JWT generated for seller:', seller.id)
        res.json({
            message: 'Login successful',
            token,
            seller: {
                id: seller.id,
                email: seller.email,
                role: 'seller',
                profile: {
                    firstName: seller.firstName,
                    lastName: seller.lastName,
                    businessName: seller.businessName,
                    businessType: seller.businessType,
                    phone: seller.phone,
                    address: {
                        street: seller.street,
                        city: seller.city,
                        state: seller.state,
                        zipCode: seller.zipCode,
                        country: seller.country
                    },
                    taxId: seller.taxId
                }
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Server error' })
    }
}