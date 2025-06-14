// backend/src/controllers/sellerController/route.ts
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'

export const registerSeller = async (req: Request, res: Response) => {
    try {
        const { email, password, profile } = req.body

        // Check if seller exists
        const existingSeller = await prisma.seller.findUnique({
            where: { email }
        })

        if (existingSeller) {
            return res.status(400).json({ error: 'Seller already exists' })
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
                taxId: profile.taxId
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

export const loginSeller = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        // Find seller
        const seller = await prisma.seller.findUnique({
            where: { email }
        })

        if (!seller) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        // Check password
        const isMatch = await bcrypt.compare(password, seller.password)
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        // Generate JWT
        const token = jwt.sign(
            { sellerId: seller.id },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        )

        res.json({
            message: 'Login successful',
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
        console.error('Login error:', error)
        res.status(500).json({ error: 'Server error' })
    }
}