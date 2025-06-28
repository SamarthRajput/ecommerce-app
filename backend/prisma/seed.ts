import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // Creating dummy buyer
    const buyer = await prisma.buyer.create({
        data: {
            email: "testbuyer@gmail.com",
            password: "hashedpassword123",
            firstName: "Test",
            lastName: "User",
            phoneNumber: "9876543210",
            street: "New Delhi, CP",
            state: "Delhi",
            city: "New Delhi",
            zipCode: "110033",
            country: "India"
        }
    });

    // Create dummy sellers first
    const sellers = await Promise.all([
        prisma.seller.create({
            data: {
                email: 'john.doe@example.com',
                password: 'hashedpassword123',
                firstName: 'John',
                lastName: 'Doe',
                role: 'seller',
                businessName: 'Tech Solutions Inc',
                businessType: 'Technology',
                phone: '+1234567890',
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
                taxId: 'TAX123456789'
            }
        }),
        prisma.seller.create({
            data: {
                email: 'jane.smith@example.com',
                password: 'hashedpassword456',
                firstName: 'Jane',
                lastName: 'Smith',
                role: 'seller',
                businessName: 'Electronics Hub',
                businessType: 'Electronics',
                phone: '+1987654321',
                street: '456 Oak Ave',
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90210',
                country: 'USA',
                taxId: 'TAX987654321'
            }
        }),
        prisma.seller.create({
            data: {
                email: 'mike.johnson@example.com',
                password: 'hashedpassword789',
                firstName: 'Mike',
                lastName: 'Johnson',
                role: 'seller',
                businessName: 'Home & Garden Supplies',
                businessType: 'Retail',
                phone: '+1122334455',
                street: '789 Pine Rd',
                city: 'Chicago',
                state: 'IL',
                zipCode: '60601',
                country: 'USA',
                taxId: 'TAX112233445'
            }
        }),
        prisma.seller.create({
            data: {
                email: 'sarah.wilson@example.com',
                password: 'hashedpassword101',
                firstName: 'Sarah',
                lastName: 'Wilson',
                role: 'seller',
                businessName: 'Fashion Forward',
                businessType: 'Fashion',
                phone: '+1555666777',
                street: '321 Maple Dr',
                city: 'Miami',
                state: 'FL',
                zipCode: '33101',
                country: 'USA',
                taxId: 'TAX555666777'
            }
        }),
        prisma.seller.create({
            data: {
                email: 'admin@example.com',
                password: 'adminpassword123',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                businessName: 'Admin Corp',
                businessType: 'Management',
                phone: '+1999888777',
                street: '999 Admin St',
                city: 'Seattle',
                state: 'WA',
                zipCode: '98101',
                country: 'USA',
                taxId: 'TAX999888777'
            }
        })
    ]);

    console.log(`Created ${sellers.length} sellers`);

    // Create 20 dummy products with PENDING status
    const products = [
        {
            name: 'iPhone 15 Pro Max',
            description: 'Latest Apple iPhone with 256GB storage, titanium design, and advanced camera system',
            price: 1199.99,
            quantity: 50,
            sellerId: sellers[0].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Electronics',
            model: '15 Pro Max',
            sku: 'IPHONE15PM-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Smartphones',
            productCode: 'APL-IP15PM-256',
            specifications: '256GB, Titanium, Advanced Camera',
            countryOfSource: 'USA',
            hsnCode: '85171200'
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            description: 'Premium Android smartphone with S Pen, 512GB storage, and exceptional display',
            price: 1299.99,
            quantity: 30,
            sellerId: sellers[1].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Electronics',
            brand: 'Samsung',
            model: 'Galaxy S24 Ultra',
            sku: 'SAMS24U-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Smartphones',
            productCode: 'SAM-GS24U-512',
            specifications: '512GB, S Pen, AMOLED Display',
            countryOfSource: 'South Korea',
            hsnCode: '85171200'
        },
        {
            name: 'MacBook Pro 16-inch',
            description: 'Powerful laptop with M3 Pro chip, 32GB RAM, and 1TB SSD for professional use',
            price: 2499.99,
            quantity: 15,
            sellerId: sellers[0].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Computers',
            brand: 'Apple',
            model: 'MacBook Pro 16',
            sku: 'MBP16M3-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Laptops',
            productCode: 'APL-MBP16-M3',
            specifications: 'M3 Pro, 32GB RAM, 1TB SSD',
            countryOfSource: 'USA',
            hsnCode: '84713010'
        },
        {
            name: 'Sony WH-1000XM5 Headphones',
            description: 'Industry-leading noise canceling wireless headphones with premium sound quality',
            price: 399.99,
            quantity: 100,
            sellerId: sellers[1].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Audio',
            brand: 'Sony',
            model: 'WH-1000XM5',
            sku: 'SONYXM5-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Headphones',
            productCode: 'SON-WH1000XM5',
            specifications: 'Wireless, Noise Cancelling',
            countryOfSource: 'Japan',
            hsnCode: '85183000'
        },
        {
            name: 'Dell XPS 13 Laptop',
            description: 'Ultra-portable laptop with Intel Core i7, 16GB RAM, and stunning InfinityEdge display',
            price: 1599.99,
            quantity: 25,
            sellerId: sellers[0].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Computers',
            brand: 'Dell',
            model: 'XPS 13',
            sku: 'DELLXPS13-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Laptops',
            productCode: 'DEL-XPS13-I7',
            specifications: 'Intel i7, 16GB RAM, InfinityEdge',
            countryOfSource: 'USA',
            hsnCode: '84713010'
        },
        {
            name: 'iPad Pro 12.9-inch',
            description: 'Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support',
            price: 1099.99,
            quantity: 40,
            sellerId: sellers[0].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Electronics',
            brand: 'Apple',
            model: 'iPad Pro 12.9',
            sku: 'IPADPRO12-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Tablets',
            productCode: 'APL-IPADPRO12',
            specifications: 'M2, Retina XDR, Pencil Support',
            countryOfSource: 'USA',
            hsnCode: '84713010'
        },
        {
            name: 'Nike Air Max 270',
            description: 'Comfortable running shoes with Max Air unit and breathable mesh upper',
            price: 129.99,
            quantity: 200,
            sellerId: sellers[3].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Footwear',
            brand: 'Nike',
            model: 'Air Max 270',
            sku: 'NIKEAM270-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Shoes',
            productCode: 'NIK-AM270',
            specifications: 'Max Air, Mesh Upper',
            countryOfSource: 'Vietnam',
            hsnCode: '64041100'
        },
        {
            name: 'KitchenAid Stand Mixer',
            description: 'Professional 5-quart stand mixer perfect for baking and cooking enthusiasts',
            price: 349.99,
            quantity: 60,
            sellerId: sellers[2].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Home Appliances',
            brand: 'KitchenAid',
            model: 'Stand Mixer',
            sku: 'KITCHENAIDSM-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Kitchen Appliances',
            productCode: 'KIT-SM5Q',
            specifications: '5 Quart, Multiple Attachments',
            countryOfSource: 'USA',
            hsnCode: '85094010'
        },
        {
            name: 'Dyson V15 Detect Vacuum',
            description: 'Cordless vacuum cleaner with laser dust detection and powerful suction',
            price: 749.99,
            quantity: 35,
            sellerId: sellers[2].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Home Appliances',
            brand: 'Dyson',
            model: 'V15 Detect',
            sku: 'DYSONV15-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Vacuum Cleaners',
            productCode: 'DYS-V15',
            specifications: 'Cordless, Laser Detection',
            countryOfSource: 'Malaysia',
            hsnCode: '85081100'
        },
        {
            name: 'Nintendo Switch OLED',
            description: 'Gaming console with vibrant OLED screen and enhanced audio for portable gaming',
            price: 349.99,
            quantity: 80,
            sellerId: sellers[1].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Gaming',
            brand: 'Nintendo',
            model: 'Switch OLED',
            sku: 'NINSWITCHOLED-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Gaming Consoles',
            productCode: 'NIN-SWITCH-OLED',
            specifications: 'OLED, Enhanced Audio',
            countryOfSource: 'Japan',
            hsnCode: '95045000'
        },
        {
            name: 'Adidas Ultraboost 22',
            description: 'Premium running shoes with Boost midsole and Primeknit upper for ultimate comfort',
            price: 189.99,
            quantity: 150,
            sellerId: sellers[3].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Footwear',
            brand: 'Adidas',
            model: 'Ultraboost 22',
            sku: 'ADIDASUB22-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Shoes',
            productCode: 'ADI-UB22',
            specifications: 'Boost Midsole, Primeknit',
            countryOfSource: 'Indonesia',
            hsnCode: '64041100'
        },
        {
            name: 'Canon EOS R6 Mark II',
            description: 'Full-frame mirrorless camera with 24.2MP sensor and advanced autofocus system',
            price: 2499.99,
            quantity: 20,
            sellerId: sellers[1].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Photography',
            brand: 'Canon',
            model: 'EOS R6 Mark II',
            sku: 'CANONR6M2-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Cameras',
            productCode: 'CAN-R6M2',
            specifications: '24.2MP, Mirrorless, Autofocus',
            countryOfSource: 'Japan',
            hsnCode: '85258030'
        },
        {
            name: 'Instant Pot Duo 7-in-1',
            description: 'Multi-functional pressure cooker that replaces 7 kitchen appliances',
            price: 99.99,
            quantity: 120,
            sellerId: sellers[2].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Home Appliances',
            brand: 'Instant Pot',
            model: 'Duo 7-in-1',
            sku: 'INSTANTPOT7-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Kitchen Appliances',
            productCode: 'INS-DUO7',
            specifications: '7-in-1, Multi-functional',
            countryOfSource: 'China',
            hsnCode: '85166000'
        },
        {
            name: 'Apple Watch Series 9',
            description: 'Advanced smartwatch with health monitoring, GPS, and cellular connectivity',
            price: 429.99,
            quantity: 75,
            sellerId: sellers[0].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Wearables',
            brand: 'Apple',
            model: 'Watch Series 9',
            sku: 'APLWATCH9-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Smartwatches',
            productCode: 'APL-WATCH9',
            specifications: 'GPS, Cellular, Health Monitoring',
            countryOfSource: 'China',
            hsnCode: '91021200'
        },
        {
            name: 'Levi\'s 501 Original Jeans',
            description: 'Classic straight-fit jeans made with premium denim and timeless styling',
            price: 79.99,
            quantity: 300,
            sellerId: sellers[3].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Apparel',
            brand: 'Levi\'s',
            model: '501 Original',
            sku: 'LEVIS501-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Jeans',
            productCode: 'LEV-501',
            specifications: 'Straight Fit, Premium Denim',
            countryOfSource: 'Bangladesh',
            hsnCode: '62034200'
        },
        {
            name: 'Bose QuietComfort Earbuds',
            description: 'True wireless earbuds with world-class noise cancellation and premium audio',
            price: 279.99,
            quantity: 90,
            sellerId: sellers[1].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Audio',
            brand: 'Bose',
            model: 'QuietComfort',
            sku: 'BOSEQC-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Earbuds',
            productCode: 'BOS-QC',
            specifications: 'Wireless, Noise Cancelling',
            countryOfSource: 'USA',
            hsnCode: '85183000'
        },
        {
            name: 'Roomba j7+ Robot Vacuum',
            description: 'Smart robot vacuum with obstacle avoidance and automatic dirt disposal',
            price: 799.99,
            quantity: 45,
            sellerId: sellers[2].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Home Appliances',
            brand: 'iRobot',
            model: 'Roomba j7+',
            sku: 'IROBOTJ7-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Robot Vacuums',
            productCode: 'IRO-J7PLUS',
            specifications: 'Obstacle Avoidance, Auto Disposal',
            countryOfSource: 'China',
            hsnCode: '85081100'
        },
        {
            name: 'North Face Puffer Jacket',
            description: 'Insulated winter jacket with water-resistant fabric and premium down fill',
            price: 249.99,
            quantity: 85,
            sellerId: sellers[3].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Apparel',
            brand: 'The North Face',
            model: 'Puffer Jacket',
            sku: 'TNFPUFFER-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Jackets',
            productCode: 'TNF-PUFF',
            specifications: 'Insulated, Water-resistant',
            countryOfSource: 'Vietnam',
            hsnCode: '62011300'
        },
        {
            name: 'Tesla Model Y Accessories Kit',
            description: 'Complete accessories package including floor mats, charging cable, and organizers',
            price: 399.99,
            quantity: 55,
            sellerId: sellers[0].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Automotive',
            brand: 'Tesla',
            model: 'Model Y Kit',
            sku: 'TESLAYKIT-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Car Accessories',
            productCode: 'TES-MY-KIT',
            specifications: 'Floor Mats, Charging Cable, Organizers',
            countryOfSource: 'USA',
            hsnCode: '87089900'
        },
        {
            name: 'Vitamix A3500 Blender',
            description: 'Professional-grade blender with smart-detect technology and wireless connectivity',
            price: 549.99,
            quantity: 40,
            sellerId: sellers[2].id,
            status: ProductStatus.PENDING,
            listingType: 'sale',
            condition: 'new',
            validityPeriod: 20241231,
            industry: 'Home Appliances',
            brand: 'Vitamix',
            model: 'A3500',
            sku: 'VITAMIXA3500-001',
            images: ['https://via.placeholder.com/300'],
            category: 'Blenders',
            productCode: 'VIT-A3500',
            specifications: 'Smart Detect, Wireless',
            countryOfSource: 'USA',
            hsnCode: '85094010'
        }
    ];

    // Insert all products
    for (const productData of products) {
        await prisma.product.create({
            data: productData
        });
    }

    console.log(`Created ${products.length} products with PENDING status`);

    // Create a few products with different statuses for variety
    await prisma.product.createMany({
        data: [
            {
                name: 'Approved Sample Product',
                description: 'This is an already approved product for testing',
                price: 99.99,
                quantity: 10,
                sellerId: sellers[0].id,
                status: ProductStatus.ACTIVE,
                listingType: 'sale',
                condition: 'new',
                validityPeriod: 20241231,
                industry: 'Electronics',
                model: 'SampleModel',
                images: ['https://via.placeholder.com/300'],
                category: 'Sample Category',
                productCode: 'APPROVED-SKU-001',
                specifications: 'Sample specifications',
                countryOfSource: 'USA',
                hsnCode: '123456'
            }
        ]
    });

    // Create RFQ for first product and buyer
    const rfq = await prisma.rFQ.create({
        data: {
            productId: products[0].sellerId, // you may need to adjust this depending on actual product IDs
            buyerId: buyer.id,
            quantity: 5,
            message: 'Looking for quick delivery.',
            status: 'PENDING'
        }
    });

    // Create Trade for that RFQ
    await prisma.trade.create({
        data: {
            rfqId: rfq.id,
            productId: products[0].sellerId,
            buyerId: buyer.id,
            sellerId: sellers[0].id,
            quantity: 5,
            price: 1199.99,
            deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            status: 'IN_PROGRESS'
        }
    });

    // Create admin user for ChatRoom
    const chatAdmin = await prisma.user.create({
        data: {
            name: 'Chat Admin',
            email: 'chatadmin@example.com',
            password: 'adminchat123',
            role: 'admin'
        }
    });

    // Create ChatRoom for RFQ
    const chatRoom = await prisma.chatRoom.create({
        data: {
            rfqId: rfq.id,
            buyerId: buyer.id,
            sellerId: sellers[0].id,
            adminId: chatAdmin.id,
            type: 'BUYER',
            status: 'ACTIVE'
        }
    });

    // Create ChatMessage
    const message = await prisma.chatMessage.create({
        data: {
            chatRoomId: chatRoom.id,
            senderRole: 'BUYER',
            senderId: buyer.id,
            content: 'Is this product still available?',
        }
    });

    // Create Review for product
    await prisma.review.create({
        data: {
            productId: products[0].sellerId,
            buyerId: buyer.id,
            rating: 5,
            comment: 'High quality and fast delivery!'
        }
    });

    // Add a message reaction
    await prisma.messageReaction.create({
        data: {
            messageId: message.id,
            reactorId: chatAdmin.id,
            reactorRole: 'ADMIN',
            emoji: '👍'
        }
    });

    console.log('🧩 RFQ, Trade, ChatRoom, Message, Review, and Reaction created');
    console.log('Created RFQ, Trade, ChatRoom, Message, Review, and Reaction');
    console.log('Created additional products with different statuses');
    console.log('✅ Database seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`- Create 1 buyer with email ${buyer.email} and password ${buyer.password}`);
    console.log(`- Created ${sellers.length} sellers (including 1 admin)`);
    console.log(`- Created ${products.length} products with PENDING status`);
    console.log(`- Created 2 additional products with ACTIVE and REJECTED status`);
    console.log(`\nAdmin credentials for testing:`);
    console.log(`Email: admin@example.com`);
    console.log(`Role: admin`);
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