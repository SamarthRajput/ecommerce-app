// File: backend/prisma/seed.ts
// To run this file, use the command: npx ts-node prisma/seed.ts

import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Insert admin');

    const email = '1@1';
    const password = '1';
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            name: 'Rohit Kumar Yadav',
            email,
            password: hashedPassword,
            role: 'admin',
        },
    });

    console.log(`Admin user ensured`);
    const sellerEmail = 'rohitkuyada@gmail.com';
    const sellerPassword = '123456789';
    const sellerHashedPassword = await bcrypt.hash(sellerPassword, 10);

    // Ensure seller exists
    const seller = await prisma.seller.findUnique({
        where: { email: sellerEmail },
    });
    if (!seller) {
        console.log('Creating seller with ID:', seller);
        return;
        // await prisma.seller.create({
        //     data: {
        //         id: SELLERID,
        //         firstName: 'Rohit',
        //         lastName: 'Kumar Yadav',
        //         email: sellerEmail,
        //         password: sellerHashedPassword,
        //         role: 'seller',
        //         country: 'India',
        //         state: 'Uttar Pradesh',
        //         city: 'Lucknow',
        //         street: '123 Main St',
        //         zipCode: '123456',
        //         phone: '1234567890',
        //         countryCode: '+91',
        //         isEmailVerified: true,
        //         isPhoneVerified: true,
        //         isApproved: true,
        //         approvalNote: 'Seller account approved',
        //         businessName: 'Rohit Enterprises',
        //         businessType: 'GOVERNMENT_ENTITY',
        //         registrationNo: 'REG123456',
        //         taxId: 'TAX123456',
        //         panOrTin: 'PAN123456',
        //     },
        // });
    }

    // Insert 10 Products from this selller, All the description of the product will look original with detailed information, Just like original Products on Flipkart, Amazon, etc. have

    console.log('Inserting products for seller with ID:', seller.id);

    const products = [
        // 5 smartphones
        {
            name: 'Apple iPhone 14 Pro Max',
            description: 'The Apple iPhone 14 Pro Max is a premium smartphone featuring a 6.7-inch Super Retina XDR display, A16 Bionic chip, and advanced camera system with ProRAW and ProRes video capabilities.',
            price: 1099.99,
            currency: 'USD',
            quantity: 50,
            minimumOrderQuantity: 1,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 365,
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'IP14PM-256GB-SILVER',
            model: 'iPhone 14 Pro Max',
            specifications: '6.7-inch display, A16 Bionic chip, Triple-camera system, Face ID, iOS 16',
            countryOfSource: 'USA',
            hsnCode: '85171200',
            certifications: ['CE', 'FCC'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/iphone14promax.jpg'],
            tags: ['smartphone', 'apple', 'iphone'],
            keywords: ['iPhone 14 Pro Max', 'Apple smartphone'],
        },
        {
            name: 'Samsung Galaxy S23 Ultra',
            description: 'The Samsung Galaxy S23 Ultra boasts a 200MP camera, Snapdragon 8 Gen 2 processor, 6.8-inch AMOLED display, and a massive 5000mAh battery for all-day performance.',
            price: 1199.99,
            currency: 'USD',
            quantity: 40,
            minimumOrderQuantity: 1,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 365,
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'SGS23U-512GB-BLK',
            model: 'Galaxy S23 Ultra',
            specifications: '6.8-inch QHD+ AMOLED, Snapdragon 8 Gen 2, 200MP camera, 12GB RAM',
            countryOfSource: 'South Korea',
            hsnCode: '85171200',
            certifications: ['CE', 'RoHS'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/s23ultra.jpg'],
            tags: ['samsung', 'android', 'smartphone'],
            keywords: ['Galaxy S23 Ultra', 'Samsung flagship phone'],
        },
        {
            name: 'OnePlus 11 5G',
            description: 'The OnePlus 11 5G offers a flagship experience with a Snapdragon 8 Gen 2 chipset, 120Hz AMOLED display, and 100W fast charging in a sleek and minimal design.',
            price: 699.99,
            currency: 'USD',
            quantity: 100,
            minimumOrderQuantity: 1,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 365,
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'OP11-256GB-GREEN',
            model: 'OnePlus 11',
            specifications: 'Snapdragon 8 Gen 2, 120Hz AMOLED, 100W charging, 50MP triple camera',
            countryOfSource: 'China',
            hsnCode: '85171200',
            certifications: ['CE', 'ISO'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/oneplus11.jpg'],
            tags: ['oneplus', 'fast charging', 'android'],
            keywords: ['OnePlus 11 5G', 'Flagship Android phone'],
        },
        {
            name: 'Google Pixel 7 Pro',
            description: 'Google Pixel 7 Pro features a custom-built Google Tensor G2 chip, AI-enhanced camera, and a 6.7-inch LTPO OLED display for a fluid and responsive experience.',
            price: 899.99,
            currency: 'USD',
            quantity: 60,
            minimumOrderQuantity: 1,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 365,
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'PIX7PRO-128GB-SNOW',
            model: 'Pixel 7 Pro',
            specifications: 'Tensor G2 chip, 6.7-inch LTPO OLED, 12GB RAM, Android 13',
            countryOfSource: 'USA',
            hsnCode: '85171200',
            certifications: ['FCC', 'CE'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/pixel7pro.jpg'],
            tags: ['google', 'pixel', 'smartphone'],
            keywords: ['Pixel 7 Pro', 'Google smartphone'],
        },
        {
            name: 'Xiaomi 13 Pro',
            description: 'Xiaomi 13 Pro comes with Leica camera optics, Snapdragon 8 Gen 2, and a vibrant WQHD+ AMOLED display, setting a new benchmark for Android flagships.',
            price: 799.99,
            currency: 'USD',
            quantity: 70,
            minimumOrderQuantity: 1,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 365,
            industry: 'Electronics',
            category: 'Smartphones',
            productCode: 'XM13PRO-512GB-BLACK',
            model: 'Xiaomi 13 Pro',
            specifications: 'Leica camera, WQHD+ AMOLED, 120W fast charging, Snapdragon 8 Gen 2',
            countryOfSource: 'China',
            hsnCode: '85171200',
            certifications: ['CE'],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/xiaomi13pro.jpg'],
            tags: ['xiaomi', 'leica', 'smartphone'],
            keywords: ['Xiaomi 13 Pro', 'Android flagship'],
        },

        // 5 products from different industries/categories
        {
            name: 'LG 1.5 Ton 5 Star Inverter AC',
            description: 'Efficient cooling with LG’s dual inverter compressor, 5-star energy rating, and silent operation for superior comfort during hot summers.',
            price: 499.99,
            currency: 'USD',
            quantity: 30,
            minimumOrderQuantity: 1,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 180,
            industry: 'Home Appliances',
            category: 'Air Conditioners',
            productCode: 'LGAC15T5S2023',
            model: 'JW-Q18WUZA',
            specifications: 'Dual inverter, 1.5 Ton, 5 Star, Anti-virus protection, Auto clean',
            countryOfSource: 'India',
            hsnCode: '84151010',
            certifications: ['BEE', 'ISO'],
            warrantyPeriod: '10 years compressor',
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/lgac.jpg'],
            tags: ['AC', 'LG', 'cooling'],
            keywords: ['LG AC', 'Inverter Air Conditioner'],
        },
        {
            name: 'Adidas Ultraboost 22 Running Shoes',
            description: 'Experience unparalleled comfort with Adidas Ultraboost 22 featuring a Primeknit upper, responsive Boost midsole, and stylish silhouette.',
            price: 179.99,
            currency: 'USD',
            quantity: 100,
            minimumOrderQuantity: 1,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 365,
            industry: 'Fashion',
            category: 'Footwear',
            productCode: 'ADUB22-BLK-10',
            model: 'Ultraboost 22',
            specifications: 'Primeknit upper, Boost midsole, Stretchweb outsole with Continental™ Rubber',
            countryOfSource: 'Germany',
            hsnCode: '64041100',
            certifications: [],
            warrantyPeriod: null,
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/ultraboost22.jpg'],
            tags: ['shoes', 'adidas', 'running'],
            keywords: ['Ultraboost 22', 'Adidas running shoes'],
        },
        {
            name: 'Yonex Nanoray Light 18i Badminton Racket',
            description: 'Built for speed and power, the Yonex Nanoray Light 18i is ideal for beginners and intermediate players seeking precision in their shots.',
            price: 39.99,
            currency: 'USD',
            quantity: 200,
            minimumOrderQuantity: 2,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 180,
            industry: 'Sports Equipment',
            category: 'Badminton',
            productCode: 'YNR18I-BLUE',
            model: 'Nanoray Light 18i',
            specifications: 'Graphite shaft, Isometric head shape, Lightweight design',
            countryOfSource: 'Japan',
            hsnCode: '95065900',
            certifications: [],
            warrantyPeriod: '6 months',
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/yonex18i.jpg'],
            tags: ['badminton', 'racket', 'yonex'],
            keywords: ['Yonex racket', 'Nanoray 18i'],
        },
        {
            name: 'Nilkamal Leo Plastic Chair',
            description: 'Durable and lightweight plastic chair by Nilkamal, suitable for both indoor and outdoor use, with a weight-bearing capacity of up to 100kg.',
            price: 14.99,
            currency: 'USD',
            quantity: 300,
            minimumOrderQuantity: 4,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 365,
            industry: 'Furniture',
            category: 'Chairs',
            productCode: 'NKLEO-PL-BROWN',
            model: 'Leo',
            specifications: 'Ergonomic design, weather-resistant plastic, stackable',
            countryOfSource: 'India',
            hsnCode: '94037000',
            certifications: [],
            warrantyPeriod: '1 year',
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/nilkamalchair.jpg'],
            tags: ['chair', 'nilkamal', 'furniture'],
            keywords: ['Plastic Chair', 'Nilkamal Leo'],
        },
        {
            name: 'Prestige IRIS 750W Mixer Grinder',
            description: 'The Prestige IRIS mixer grinder comes with 3 stainless steel jars and 1 juicer jar, featuring a powerful motor and elegant design for modern kitchens.',
            price: 49.99,
            currency: 'USD',
            quantity: 150,
            minimumOrderQuantity: 1,
            listingType: 'SELL',
            condition: 'NEW',
            validityPeriod: 365,
            industry: 'Kitchen Appliances',
            category: 'Mixers & Grinders',
            productCode: 'PRIRIS750W',
            model: 'IRIS 750W',
            specifications: '750W motor, 3 SS jars + 1 juicer jar, overload protection',
            countryOfSource: 'India',
            hsnCode: '85094010',
            certifications: ['ISI'],
            warrantyPeriod: '2 years',
            licenses: [],
            brochureUrl: null,
            videoUrl: null,
            images: ['https://example.com/prestigeiris.jpg'],
            tags: ['mixer', 'grinder', 'kitchen'],
            keywords: ['Prestige Mixer', 'IRIS 750W'],
        }
    ];

    for (const product of products) {
        await prisma.product.create({
            data: {
                ...product,
                sellerId: seller.id, // Use seller.id instead of SELLERID
                status: 'APPROVED',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

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
