// import { PrismaClient, ProductStatus } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//     console.log('Starting database seeding...');

//     // Creating dummy buyer
//     const buyer = await prisma.buyer.create({
//         data: {
//             email: "testbuyer@gmail.com",
//             password: "hashedpassword123",
//             firstName: "Test",
//             lastName: "User",
//             phoneNumber: "9876543210",
//             street: "New Delhi, CP",
//             state: "Delhi",
//             city: "New Delhi",
//             zipCode: "110033",
//             country: "India"
//         }
//     });
    
//     // Create dummy sellers first
//     const sellers = await Promise.all([
//         prisma.seller.create({
//             data: {
//                 email: 'john.doe@example.com',
//                 password: 'hashedpassword123',
//                 firstName: 'John',
//                 lastName: 'Doe',
//                 role: 'seller',
//                 businessName: 'Tech Solutions Inc',
//                 businessType: 'Technology',
//                 phone: '+1234567890',
//                 street: '123 Main St',
//                 city: 'New York',
//                 state: 'NY',
//                 zipCode: '10001',
//                 country: 'USA',
//                 taxId: 'TAX123456789'
//             }
//         }),
//         prisma.seller.create({
//             data: {
//                 email: 'jane.smith@example.com',
//                 password: 'hashedpassword456',
//                 firstName: 'Jane',
//                 lastName: 'Smith',
//                 role: 'seller',
//                 businessName: 'Electronics Hub',
//                 businessType: 'Electronics',
//                 phone: '+1987654321',
//                 street: '456 Oak Ave',
//                 city: 'Los Angeles',
//                 state: 'CA',
//                 zipCode: '90210',
//                 country: 'USA',
//                 taxId: 'TAX987654321'
//             }
//         }),
//         prisma.seller.create({
//             data: {
//                 email: 'mike.johnson@example.com',
//                 password: 'hashedpassword789',
//                 firstName: 'Mike',
//                 lastName: 'Johnson',
//                 role: 'seller',
//                 businessName: 'Home & Garden Supplies',
//                 businessType: 'Retail',
//                 phone: '+1122334455',
//                 street: '789 Pine Rd',
//                 city: 'Chicago',
//                 state: 'IL',
//                 zipCode: '60601',
//                 country: 'USA',
//                 taxId: 'TAX112233445'
//             }
//         }),
//         prisma.seller.create({
//             data: {
//                 email: 'sarah.wilson@example.com',
//                 password: 'hashedpassword101',
//                 firstName: 'Sarah',
//                 lastName: 'Wilson',
//                 role: 'seller',
//                 businessName: 'Fashion Forward',
//                 businessType: 'Fashion',
//                 phone: '+1555666777',
//                 street: '321 Maple Dr',
//                 city: 'Miami',
//                 state: 'FL',
//                 zipCode: '33101',
//                 country: 'USA',
//                 taxId: 'TAX555666777'
//             }
//         }),
//         prisma.seller.create({
//             data: {
//                 email: 'admin@example.com',
//                 password: 'adminpassword123',
//                 firstName: 'Admin',
//                 lastName: 'User',
//                 role: 'admin',
//                 businessName: 'Admin Corp',
//                 businessType: 'Management',
//                 phone: '+1999888777',
//                 street: '999 Admin St',
//                 city: 'Seattle',
//                 state: 'WA',
//                 zipCode: '98101',
//                 country: 'USA',
//                 taxId: 'TAX999888777'
//             }
//         })
//     ]);

//     console.log(`Created ${sellers.length} sellers`);

//     // Create 20 dummy products with PENDING status
//     const products = [
//         {
//             name: 'iPhone 15 Pro Max',
//             description: 'Latest Apple iPhone with 256GB storage, titanium design, and advanced camera system',
//             price: 1199.99,
//             quantity: 50,
//             sellerId: sellers[0].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Samsung Galaxy S24 Ultra',
//             description: 'Premium Android smartphone with S Pen, 512GB storage, and exceptional display',
//             price: 1299.99,
//             quantity: 30,
//             sellerId: sellers[1].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'MacBook Pro 16-inch',
//             description: 'Powerful laptop with M3 Pro chip, 32GB RAM, and 1TB SSD for professional use',
//             price: 2499.99,
//             quantity: 15,
//             sellerId: sellers[0].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Sony WH-1000XM5 Headphones',
//             description: 'Industry-leading noise canceling wireless headphones with premium sound quality',
//             price: 399.99,
//             quantity: 100,
//             sellerId: sellers[1].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Dell XPS 13 Laptop',
//             description: 'Ultra-portable laptop with Intel Core i7, 16GB RAM, and stunning InfinityEdge display',
//             price: 1599.99,
//             quantity: 25,
//             sellerId: sellers[0].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'iPad Pro 12.9-inch',
//             description: 'Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support',
//             price: 1099.99,
//             quantity: 40,
//             sellerId: sellers[0].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Nike Air Max 270',
//             description: 'Comfortable running shoes with Max Air unit and breathable mesh upper',
//             price: 129.99,
//             quantity: 200,
//             sellerId: sellers[3].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'KitchenAid Stand Mixer',
//             description: 'Professional 5-quart stand mixer perfect for baking and cooking enthusiasts',
//             price: 349.99,
//             quantity: 60,
//             sellerId: sellers[2].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Dyson V15 Detect Vacuum',
//             description: 'Cordless vacuum cleaner with laser dust detection and powerful suction',
//             price: 749.99,
//             quantity: 35,
//             sellerId: sellers[2].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Nintendo Switch OLED',
//             description: 'Gaming console with vibrant OLED screen and enhanced audio for portable gaming',
//             price: 349.99,
//             quantity: 80,
//             sellerId: sellers[1].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Adidas Ultraboost 22',
//             description: 'Premium running shoes with Boost midsole and Primeknit upper for ultimate comfort',
//             price: 189.99,
//             quantity: 150,
//             sellerId: sellers[3].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Canon EOS R6 Mark II',
//             description: 'Full-frame mirrorless camera with 24.2MP sensor and advanced autofocus system',
//             price: 2499.99,
//             quantity: 20,
//             sellerId: sellers[1].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Instant Pot Duo 7-in-1',
//             description: 'Multi-functional pressure cooker that replaces 7 kitchen appliances',
//             price: 99.99,
//             quantity: 120,
//             sellerId: sellers[2].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Apple Watch Series 9',
//             description: 'Advanced smartwatch with health monitoring, GPS, and cellular connectivity',
//             price: 429.99,
//             quantity: 75,
//             sellerId: sellers[0].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Levi\'s 501 Original Jeans',
//             description: 'Classic straight-fit jeans made with premium denim and timeless styling',
//             price: 79.99,
//             quantity: 300,
//             sellerId: sellers[3].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Bose QuietComfort Earbuds',
//             description: 'True wireless earbuds with world-class noise cancellation and premium audio',
//             price: 279.99,
//             quantity: 90,
//             sellerId: sellers[1].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Roomba j7+ Robot Vacuum',
//             description: 'Smart robot vacuum with obstacle avoidance and automatic dirt disposal',
//             price: 799.99,
//             quantity: 45,
//             sellerId: sellers[2].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'North Face Puffer Jacket',
//             description: 'Insulated winter jacket with water-resistant fabric and premium down fill',
//             price: 249.99,
//             quantity: 85,
//             sellerId: sellers[3].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Tesla Model Y Accessories Kit',
//             description: 'Complete accessories package including floor mats, charging cable, and organizers',
//             price: 399.99,
//             quantity: 55,
//             sellerId: sellers[0].id,
//             status: ProductStatus.PENDING
//         },
//         {
//             name: 'Vitamix A3500 Blender',
//             description: 'Professional-grade blender with smart-detect technology and wireless connectivity',
//             price: 549.99,
//             quantity: 40,
//             sellerId: sellers[2].id,
//             status: ProductStatus.PENDING
//         }
//     ];

//     // Insert all products
//     for (const productData of products) {
//         await prisma.product.create({
//             data: productData
//         });
//     }

//     console.log(`Created ${products.length} products with PENDING status`);

//     // Create a few products with different statuses for variety
//     await prisma.product.createMany({
//         data: [
//             {
//                 name: 'Approved Sample Product',
//                 description: 'This is an already approved product for testing',
//                 price: 99.99,
//                 quantity: 10,
//                 sellerId: sellers[0].id,
//                 status: ProductStatus.ACTIVE
//             },
//             {
//                 name: 'Rejected Sample Product',
//                 description: 'This is a rejected product for testing',
//                 price: 149.99,
//                 quantity: 5,
//                 sellerId: sellers[1].id,
//                 status: ProductStatus.REJECTED
//             }
//         ]
//     });

//     console.log('Created additional products with different statuses');
//     console.log('✅ Database seeding completed successfully!');
//     console.log(`\nSummary:`);
//     console.log(`- Create 1 buyer with email ${buyer.email} and password ${buyer.password}`);
//     console.log(`- Created ${sellers.length} sellers (including 1 admin)`);
//     console.log(`- Created ${products.length} products with PENDING status`);
//     console.log(`- Created 2 additional products with ACTIVE and REJECTED status`);
//     console.log(`\nAdmin credentials for testing:`);
//     console.log(`Email: admin@example.com`);
//     console.log(`Role: admin`);
// }

// main()
//     .catch((e) => {
//         console.error('Error during seeding:', e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

// export default main;