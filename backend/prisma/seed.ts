// File: backend/prisma/seed.ts
// To run this file, use the command: npx ts-node prisma/seed.ts

import { z } from 'zod';
import { prisma } from '../src/lib/prisma';

import bcrypt from 'bcryptjs';
import { ListingType, ProductCondition, LogisticsType } from '@prisma/client';

async function main() {

    console.log('Insert admin');

    const superAdminEmail = '1@1';
    const superAdminPassword = '1';
    const superAdminHashedPassword = await bcrypt.hash(superAdminPassword, 10);

    await prisma.admin.upsert({
        where: { email: superAdminEmail },
        update: {},
        create: {
            name: 'Super Admin',
            email: superAdminEmail ,
            password: superAdminHashedPassword,
            role: 'ADMIN', // Ensure the role is set to ADMIN
            adminRole: 'SUPER_ADMIN',
        },
    });

    const adminEmail = '2@2';
    const adminpassword = '2';
    const adminhashedPassword = await bcrypt.hash(adminpassword, 10);

    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            name: 'Admin',
            email: adminEmail,
            password: adminhashedPassword,
            role: 'ADMIN', // Ensure the role is set to ADMIN
            adminRole: 'ADMIN',
        },
    });

    const inspectorEmail = '3@3';
    const inspectorPassword = '3';
    const inspectorHashedPassword = await bcrypt.hash(inspectorPassword, 10);

    await prisma.admin.upsert({
        where: { email: inspectorEmail },
        update: {},
        create: {
            name: 'Inspector',
            email: inspectorEmail,
            password: inspectorHashedPassword,
            role: 'ADMIN', // Ensure the role is set to ADMIN
            adminRole: 'INSPECTOR',
        },
    });

    console.log(`SuperAdmin, Admin, Inspector ensured `);

    const sellerEmail = 'rohitkuyada@gmail.com';
    const sellerPassword = '123456789';
    const sellerHashedPassword = await bcrypt.hash(sellerPassword, 10);

    // Ensure seller exists
    let seller = await prisma.seller.findUnique({
        where: { email: sellerEmail },
    });

    if (!seller) {
        console.log('Creating seller...');
        seller = await prisma.seller.create({
            data: {
                firstName: 'Rohit',
                lastName: 'Kumar Yadav',
                email: sellerEmail,
                password: sellerHashedPassword,
                role: 'seller',
                country: 'India',
                state: 'Uttar Pradesh',
                city: 'Lucknow',
                street: '123 Main St',
                zipCode: '123456',
                phone: '1234567890',
                countryCode: '+91',
                isEmailVerified: true,
                isPhoneVerified: true,
                isApproved: true,
                approvalNote: 'Seller account approved',
                businessName: 'Rohit Enterprises',
                businessType: 'GOVERNMENT_ENTITY',
                registrationNo: 'REG123456',
                taxId: 'TAX123456',
                panOrTin: 'PAN123456',
                agreedToTerms: true,
            },
        });
    }

    console.log('Inserting products for seller with ID:', seller.id);

    // Generate future expiry dates
    const getExpiryDate = (validityDays: number) => {
        const date = new Date();
        date.setDate(date.getDate() + validityDays);
        return date;
    };

    const products = [
        // 5 smartphones - All fields properly typed according to schema
        {
            name: 'Apple iPhone 14 Pro Max (Deep Purple, 128 GB)',
            description: 'The Apple iPhone 14 Pro Max is a premium smartphone featuring a 6.7-inch Super Retina XDR display with Always-On technology, A16 Bionic chip with 6-core CPU, and an advanced Pro camera system with 48MP main camera that captures stunning photos and videos. Features Dynamic Island, Action mode for smooth videos, and all-day battery life. Includes ProRAW and ProRes video capabilities for professional content creation.',
            price: 1099.99,
            currency: 'USD',
            quantity: 50,
            minimumOrderQuantity: 1,
            deliveryTimeInDays: 3,
            logisticsSupport: LogisticsType.BOTH,
            listingType: ListingType.SELL,
            condition: ProductCondition.NEW,
            validityPeriod: 365,
            expiryDate: getExpiryDate(365),
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'IP14PM-128GB-PURPLE',
            model: 'iPhone 14 Pro Max',
            specifications: '6.7-inch Super Retina XDR display, A16 Bionic chip, 48MP Pro camera system, Face ID, iOS 16, 5G capable, Lightning connector, Water resistant IP68',
            countryOfSource: 'USA',
            hsnCode: '85171200',
            certifications: ['CE', 'FCC', 'RoHS'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111846_sp875-sp876-iphone14-pro-promax.png',
                'https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg',
                'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-deeppurple?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663703841896'
            ],
            tags: ['smartphone', 'apple', 'iphone', 'premium', 'flagship'],
            keywords: ['iPhone 14 Pro Max', 'Apple smartphone', 'A16 Bionic', 'Pro camera'],
        },
        {
            name: 'Samsung Galaxy S23 Ultra 5G (Cream, 256 GB) (12 GB RAM)',
            description: 'The Samsung Galaxy S23 Ultra redefines premium with its 200MP camera with advanced nightography, built-in S Pen for seamless note-taking, and the fastest Snapdragon processor. Features a stunning 6.8-inch Dynamic AMOLED 2X display with 120Hz refresh rate, massive 5000mAh battery with 45W fast charging, and up to 1TB storage. Perfect for photography enthusiasts and productivity power users.',
            price: 1199.99,
            currency: 'USD',
            quantity: 40,
            minimumOrderQuantity: 1,
            deliveryTimeInDays: 2,
            logisticsSupport: LogisticsType.INTERLINK,
            listingType: ListingType.SELL,
            condition: ProductCondition.NEW,
            validityPeriod: 365,
            expiryDate: getExpiryDate(365),
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'SGS23U-256GB-CREAM',
            model: 'Galaxy S23 Ultra',
            specifications: '6.8-inch QHD+ Dynamic AMOLED 2X, Snapdragon 8 Gen 2, 200MP camera, 12GB RAM, 256GB storage, S Pen included, 5000mAh battery',
            countryOfSource: 'South Korea',
            hsnCode: '85171200',
            certifications: ['CE', 'RoHS', 'FCC'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://m.media-amazon.com/images/I/71goZuIha-L._UF1000,1000_QL80_.jpg',
                'https://m.media-amazon.com/images/I/71lZBf-7QeL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/81zz+FAZ9XL._SX679_.jpg'
            ],
            tags: ['samsung', 'android', 'smartphone', 'camera', 's-pen'],
            keywords: ['Galaxy S23 Ultra', 'Samsung flagship phone', '200MP camera', 'S Pen'],
        },
        {
            name: 'OnePlus 11 5G (Titan Black, 256GB) (16GB RAM)',
            description: 'The OnePlus 11 5G delivers flagship performance with the powerful Snapdragon 8 Gen 2 processor, stunning 6.7-inch 120Hz AMOLED display with Dolby Vision, and incredibly fast 100W SUPERVOOC charging. Features Hasselblad camera system with 50MP main sensor, OxygenOS 13 based on Android 13, and premium build quality. Experience speed like never before.',
            price: 699.99,
            currency: 'USD',
            quantity: 100,
            minimumOrderQuantity: 1,
            deliveryTimeInDays: 1,
            logisticsSupport: LogisticsType.BOTH,
            listingType: ListingType.SELL,
            condition: ProductCondition.NEW,
            validityPeriod: 365,
            expiryDate: getExpiryDate(365),
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'OP11-256GB-BLACK',
            model: 'OnePlus 11',
            specifications: 'Snapdragon 8 Gen 2, 6.7-inch 120Hz AMOLED, 100W SUPERVOOC charging, Hasselblad camera, 50MP triple camera system, 16GB RAM, 256GB storage',
            countryOfSource: 'China',
            hsnCode: '85171200',
            certifications: ['CE', 'ISO', 'FCC'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://m.media-amazon.com/images/I/414+xRBltFL._SY300_SX300_.jpg',
                'https://m.media-amazon.com/images/I/51tKzI3G0zL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/51QVJveu+-L._SX679_.jpg'
            ],
            tags: ['oneplus', 'fast charging', 'android', 'flagship', 'hasselblad'],
            keywords: ['OnePlus 11 5G', 'Flagship Android phone', 'Snapdragon 8 Gen 2', '100W charging'],
        },
        {
            name: 'Google Pixel 7 Pro (Snow, 128GB) (12GB RAM)',
            description: 'Google Pixel 7 Pro powered by the custom-built Google Tensor G2 chip delivers exceptional AI-powered photography, computational photography features, and the purest Android experience. Features a brilliant 6.7-inch LTPO OLED display with 120Hz refresh rate, advanced camera system with Magic Eraser, and guaranteed 5 years of security updates. Perfect for photography enthusiasts who want the best of Google AI.',
            price: 899.99,
            currency: 'USD',
            quantity: 60,
            minimumOrderQuantity: 1,
            deliveryTimeInDays: 2,
            logisticsSupport: LogisticsType.SELF,
            listingType: ListingType.SELL,
            condition: ProductCondition.NEW,
            validityPeriod: 365,
            expiryDate: getExpiryDate(365),
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'PIX7PRO-128GB-SNOW',
            model: 'Pixel 7 Pro',
            specifications: 'Google Tensor G2 chip, 6.7-inch LTPO OLED 120Hz, 12GB RAM, 128GB storage, Triple camera system, Android 13, 5G capable',
            countryOfSource: 'USA',
            hsnCode: '85171200',
            certifications: ['FCC', 'CE', 'IC'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://m.media-amazon.com/images/I/61q+6n02zLL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/51nD339kAIL._SY879_.jpg'
            ],
            tags: ['google', 'pixel', 'smartphone', 'ai', 'camera'],
            keywords: ['Pixel 7 Pro', 'Google smartphone', 'Tensor G2', 'AI photography'],
        },
        {
            name: 'Xiaomi 13 Pro (Ceramic Black, 256GB) (12GB RAM)',
            description: 'Xiaomi 13 Pro elevates mobile photography with professional Leica camera system, featuring a 50.3MP main sensor with 1-inch sensor size for DSLR-quality photos. Powered by Snapdragon 8 Gen 2, boasts a stunning 6.73-inch WQHD+ AMOLED display with 120Hz refresh rate, and blazing-fast 120W wired + 50W wireless charging. Experience flagship performance with premium ceramic build quality.',
            price: 799.99,
            currency: 'USD',
            quantity: 70,
            minimumOrderQuantity: 1,
            deliveryTimeInDays: 3,
            logisticsSupport: LogisticsType.INTERLINK,
            listingType: ListingType.SELL,
            condition: ProductCondition.NEW,
            validityPeriod: 365,
            expiryDate: getExpiryDate(365),
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'XM13PRO-256GB-BLACK',
            model: 'Xiaomi 13 Pro',
            specifications: 'Leica camera system, 6.73-inch WQHD+ AMOLED 120Hz, 120W fast charging, Snapdragon 8 Gen 2, 12GB RAM, 256GB storage, ceramic body',
            countryOfSource: 'China',
            hsnCode: '85171200',
            certifications: ['CE', 'FCC'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://m.media-amazon.com/images/I/41eB+jXzGsL._SY300_SX300_.jpg',
                'https://m.media-amazon.com/images/I/515dcOdKTgL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/61jnXvSPXDL._SX679_.jpg'
            ],
            tags: ['xiaomi', 'leica', 'smartphone', 'ceramic', 'camera'],
            keywords: ['Xiaomi 13 Pro', 'Android flagship', 'Leica camera', 'ceramic build'],
        },

        // 5 products from different industries/categories
        {
            name: 'LG 1.5 Ton 5 Star Dual Inverter AC (Copper, White) - AI ThinQ Smart',
            description: 'Beat the heat with LG\'s most efficient 1.5 Ton 5-Star Dual Inverter Air Conditioner featuring AI ThinQ smart connectivity, Ocean Black Protection anti-corrosion coating, and 4-way swing for uniform cooling. The dual inverter compressor delivers 40% energy savings, faster cooling, and whisper-quiet operation. Features HD filter with anti-virus protection, auto-cleaning, and smart diagnosis for hassle-free maintenance.',
            price: 599.99,
            currency: 'USD',
            quantity: 30,
            minimumOrderQuantity: 1,
            deliveryTimeInDays: 7,
            logisticsSupport: LogisticsType.BOTH,
            listingType: ListingType.LEASE, // Changed to LEASE for variety
            condition: ProductCondition.NEW,
            validityPeriod: 180,
            expiryDate: getExpiryDate(180),
            industry: 'Home Appliances',
            category: 'Air Conditioners',
            productCode: 'LGAC15T5S2024',
            model: 'JS-Q18AUXA2',
            specifications: 'Dual Inverter Technology, 1.5 Ton capacity, 5 Star BEE rating, Copper condenser, 4-way swing, HD filter with anti-virus protection, AI ThinQ smart features',
            countryOfSource: 'India',
            hsnCode: '84151010',
            certifications: ['BEE 5 Star', 'ISO 14001', 'ISO 9001'],
            warrantyPeriod: '10 years compressor, 5 years PCB, 1 year complete unit',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://m.media-amazon.com/images/I/314pWpZA15L._SY445_SX342_QL70_FMwebp_.jpg',
                'https://m.media-amazon.com/images/I/51rNx8LmuSL.jpg'
            ],
            tags: ['AC', 'LG', 'cooling', 'smart', 'energy efficient'],
            keywords: ['LG AC', 'Inverter Air Conditioner', 'AI ThinQ', 'Dual Inverter'],
        },
        {
            name: 'Adidas Ultraboost 22 Running Shoes (Core Black/Carbon/Grey) - Men\'s',
            description: 'Step into next-level comfort with Adidas Ultraboost 22, engineered for runners who demand performance and style. Features responsive BOOST midsole with 20% more energy return, Primeknit+ upper for adaptive fit, Linear Energy Push system for smooth transitions, and Continental™ Rubber outsole for exceptional grip. Perfect for daily training, long runs, and casual wear with modern athletic aesthetic.',
            price: 179.99,
            currency: 'USD',
            quantity: 100,
            minimumOrderQuantity: 1,
            deliveryTimeInDays: 5,
            logisticsSupport: LogisticsType.SELF,
            listingType: ListingType.SELL,
            condition: ProductCondition.NEW,
            validityPeriod: 365,
            expiryDate: getExpiryDate(365),
            industry: 'Fashion',
            category: 'Footwear',
            productCode: 'ADUB22-BLK-US10',
            model: 'Ultraboost 22',
            specifications: 'Primeknit+ upper, BOOST midsole technology, Linear Energy Push system, Continental™ Rubber outsole, Regular fit, Lace closure',
            countryOfSource: 'Germany',
            hsnCode: '64041100',
            certifications: ['OEKO-TEX', 'Better Cotton Initiative'],
            warrantyPeriod: '6 months manufacturing defects',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://m.media-amazon.com/images/I/616iE+srj0L._SY695_.jpg',
                'https://m.media-amazon.com/images/I/51zPCDBCZ1L._SY695_.jpg'
            ],
            tags: ['shoes', 'adidas', 'running', 'boost', 'athletic'],
            keywords: ['Ultraboost 22', 'Adidas running shoes', 'BOOST technology', 'performance footwear'],
        },
        {
            name: 'Yonex Nanoray Light 18i Badminton Racket (Blue/Silver) - Beginner to Intermediate',
            description: 'Master your badminton game with the Yonex Nanoray Light 18i, specifically designed for beginner to intermediate players seeking precision and control. Features lightweight graphite construction for easy maneuverability, Isometric head shape for enlarged sweet spot, and optimized weight distribution for powerful yet controlled shots. The flexible shaft provides excellent feel and repulsion power for consistent performance.',
            price: 39.99,
            currency: 'USD',
            quantity: 200,
            minimumOrderQuantity: 2,
            deliveryTimeInDays: 4,
            logisticsSupport: LogisticsType.BOTH,
            listingType: ListingType.SELL,
            condition: ProductCondition.NEW,
            validityPeriod: 180,
            expiryDate: getExpiryDate(180),
            industry: 'Sports Equipment',
            category: 'Badminton',
            productCode: 'YNR18I-BLUE-SILVER',
            model: 'Nanoray Light 18i',
            specifications: 'Graphite shaft and frame, Isometric head shape, Weight: 85-89g, Grip size: G4, Flexible shaft, String tension: 17-22 lbs',
            countryOfSource: 'Japan',
            hsnCode: '95065900',
            certifications: ['BWF Approved', 'Japanese Quality Standards'],
            warrantyPeriod: '6 months against manufacturing defects',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://m.media-amazon.com/images/I/51665XuwWQL._SX679_.jpg',
                'https://m.media-amazon.com/images/I/61Gq02jTC0L._SY879_.jpg'
            ],
            tags: ['badminton', 'racket', 'yonex', 'lightweight', 'beginner'],
            keywords: ['Yonex racket', 'Nanoray 18i', 'badminton equipment', 'graphite racket'],
        },
        {
            name: 'Nilkamal Leo Plastic Chair (Brown) - Set of 4 - Stackable & Weather Resistant',
            description: 'Transform your space with the versatile Nilkamal Leo Plastic Chair, perfect for both indoor and outdoor use. Crafted from high-quality virgin plastic with UV stabilizers for long-lasting durability and fade resistance. Features ergonomic design for comfort, stackable construction for space-saving storage, and weather-resistant properties. Supports up to 100kg weight capacity with easy-to-clean surface.',
            price: 59.99,
            currency: 'USD',
            quantity: 300,
            minimumOrderQuantity: 4,
            deliveryTimeInDays: 6,
            logisticsSupport: LogisticsType.SELF,
            listingType: ListingType.RENT, // Changed to RENT for variety
            condition: ProductCondition.NEW,
            validityPeriod: 365,
            expiryDate: getExpiryDate(365),
            industry: 'Furniture',
            category: 'Chairs',
            productCode: 'NKLEO-PL-BROWN-SET4',
            model: 'Leo Plastic Chair',
            specifications: 'High-grade plastic construction, UV stabilized, Ergonomic design, Stackable up to 20 pieces, Weight capacity: 100kg, Dimensions: 45x52x80cm',
            countryOfSource: 'India',
            hsnCode: '94037000',
            certifications: ['ISI Mark', 'BIS Certified'],
            warrantyPeriod: '1 year against manufacturing defects',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://m.media-amazon.com/images/I/31jsJBB4h3L.jpg',
                'https://m.media-amazon.com/images/I/31S9n9cBLGL.jpg'
            ],
            tags: ['chair', 'nilkamal', 'furniture', 'plastic', 'stackable'],
            keywords: ['Plastic Chair', 'Nilkamal Leo', 'outdoor furniture', 'stackable chair'],
        },
        {
            name: 'Prestige IRIS 750W Mixer Grinder (White/Blue) - 4 Jars with Juicer Attachment',
            description: 'Revolutionize your kitchen with the Prestige IRIS 750W Mixer Grinder, designed for modern Indian kitchens. Features powerful 750W motor with overload protection, 4 stainless steel jars including dedicated juicer jar, and ergonomic design with easy-grip handles. The advanced blade system ensures efficient grinding, mixing, and juicing. Includes warranty and superior build quality that Prestige is known for.',
            price: 89.99,
            currency: 'USD',
            quantity: 150,
            minimumOrderQuantity: 1,
            deliveryTimeInDays: 3,
            logisticsSupport: LogisticsType.BOTH,
            listingType: ListingType.SELL,
            condition: ProductCondition.REFURBISHED, // Changed for variety
            validityPeriod: 365,
            expiryDate: getExpiryDate(365),
            industry: 'Kitchen Appliances',
            category: 'Mixers & Grinders',
            productCode: 'PRIRIS750W-4JAR',
            model: 'IRIS 750W',
            specifications: '750W powerful motor, 4 stainless steel jars (1.5L, 1.0L, 0.4L grinding, 1.0L juicer), Overload protection, Speed control, Ergonomic handles, Non-slip base',
            countryOfSource: 'India',
            hsnCode: '85094010',
            certifications: ['ISI Mark', 'CE Certified', 'RoHS Compliant'],
            warrantyPeriod: '2 years motor warranty, 1 year complete product warranty',
            licenses: [],
            brochureUrl: '',
            videoUrl: '',
            images: [
                'https://m.media-amazon.com/images/I/41H1Qnr0TbL._SX300_SY300_QL70_FMwebp_.jpg',
                'https://m.media-amazon.com/images/I/71og8V9OaOL._SX679_.jpg'
            ],
            tags: ['mixer', 'grinder', 'kitchen', 'prestige', 'appliance'],
            keywords: ['Prestige Mixer', 'IRIS 750W', 'mixer grinder', 'kitchen appliance'],
        }
    ];


    // Insert products
    for (const productData of products) {
        try {
            const slug = productData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
                .substring(0, 100); // Ensure slug isn't too long

            await prisma.product.create({
                data: {
                    ...productData,
                    sellerId: seller.id,
                    status: 'APPROVED',
                    slug: slug,
                },
            });

            console.log(`✅ Successfully inserted product: ${productData.name}`);
        } catch (error) {
            console.error(`❌ Error inserting product ${productData.name}:`, error);
        }
    }

    console.log('🎉 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

export default main;